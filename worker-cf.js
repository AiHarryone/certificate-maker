// Certificate Maker — unlock backend for Cloudflare Workers
// Routes:
//   POST /unlock   { key, instanceName }  -> validate license key via Creem, unlock if valid
//   POST /webhook  Creem checkout.completed -> record order + emit fallback token (for non-license products)
//   GET  /health                           -> liveness probe
//
// Environment variables / Secrets (set via `wrangler secret put` or dashboard):
//   CREEM_API_KEY         required  — Creem production API key
//   CREEM_WEBHOOK_SECRET  optional  — HMAC secret from Creem Developers page; verify webhooks when set
//   FALLBACK_TOKEN_SECRET optional  — secret used to mint fallback tokens when the product has no Creem license
//
// Deploy:  npx wrangler deploy worker-cf.js

// ---- Web Crypto HMAC helpers (replaces Node crypto.createHmac) -------------

async function hmacHex(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(String(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomInstanceId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return "web-" + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  const clean = String(hex).replace(/^sha256=/, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifySignature(rawBody, signature, secret) {
  if (!secret) return true; // no secret configured -> skip verify
  if (!signature) return false;
  const expected = await hmacHex(secret, rawBody);
  const a = hexToBytes(expected);
  const b = hexToBytes(String(signature));
  return timingSafeEqual(a, b);
}

async function mintFallbackToken(orderId, fallbackSecret) {
  // Deterministic token from order id + secret, so webhook re-delivery is idempotent.
  const hex = await hmacHex(fallbackSecret || "kdp-fallback", orderId);
  return "KDP-" + hex.toUpperCase().slice(0, 16);
}

// ---- Creem API calls --------------------------------------------------------

async function activateLicense(key, instanceName, creemApiBase, creemApiKey) {
  const resp = await fetch(`${creemApiBase}/v1/licenses/activate`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "x-api-key": creemApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, instance_name: instanceName }),
  });
  let data = {};
  try { data = await resp.json(); } catch {}
  return { status: resp.status, data };
}

async function validateLicense(key, instanceId, creemApiBase, creemApiKey) {
  const resp = await fetch(`${creemApiBase}/v1/licenses/validate`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "x-api-key": creemApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, instance_id: instanceId }),
  });
  let data = {};
  try { data = await resp.json(); } catch {}
  return { status: resp.status, data };
}

// ---- route handlers ---------------------------------------------------------

function jsonResponse(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

async function handleUnlock(request, env) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse(400, { ok: false, error: "Invalid request body" }); }

  const key = String(body.key || "").trim();
  const instanceName = String(body.instanceName || "").trim() || randomInstanceId();

  if (!key) return jsonResponse(400, { ok: false, error: "Enter your unlock code" });

  if (!env.CREEM_API_KEY) {
    return jsonResponse(503, { ok: false, error: "Unlock service not configured yet." });
  }

  try {
    const { status, data } = await activateLicense(key, instanceName, env.CREEM_API_BASE || "https://api.creem.io", env.CREEM_API_KEY);
    if (status === 200 && (data.status === "active" || data.status === "active_ok")) {
      return jsonResponse(200, { ok: true, instanceId: data.instance?.[0]?.id || "", instanceName });
    }
    if (status === 404) return jsonResponse(404, { ok: false, error: "Invalid unlock code. Check your purchase email." });
    if (status === 403) return jsonResponse(403, { ok: false, error: "This unlock code is already in use on another device." });
    return jsonResponse(502, { ok: false, error: "Could not validate unlock code. Please try again." });
  } catch (e) {
    return jsonResponse(502, { ok: false, error: "Unlock service error. Please try again." });
  }
}

async function handleValidate(request, env) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse(400, { ok: false, error: "Invalid request body" }); }

  const key = String(body.key || "").trim();
  const instanceId = String(body.instanceId || "").trim();
  if (!key || !instanceId) return jsonResponse(400, { ok: false, error: "Missing key or instanceId" });

  try {
    const { status, data } = await validateLicense(key, instanceId, env.CREEM_API_BASE || "https://api.creem.io", env.CREEM_API_KEY);
    if (status === 200 && data.status === "active") {
      return jsonResponse(200, { ok: true, status: data.status });
    }
    return jsonResponse(200, { ok: false, status: data.status || "invalid" });
  } catch (e) {
    return jsonResponse(502, { ok: false, error: "Validate service error" });
  }
}

async function handleWebhook(request, env) {
  const raw = await request.arrayBuffer();
  const rawText = new TextDecoder().decode(raw);
  const signature = request.headers.get("creem-signature") || request.headers.get("x-creem-signature") || "";

  if (!(await verifySignature(rawText, signature, env.CREEM_WEBHOOK_SECRET))) {
    return jsonResponse(401, { ok: false, error: "Invalid signature" });
  }

  let event;
  try { event = JSON.parse(rawText || "{}"); }
  catch { return jsonResponse(400, { ok: false, error: "Invalid JSON" }); }

  const eventType = event.eventType || event.type || "";
  const obj = event.object || {};
  const order = obj.order || {};
  const customer = obj.customer || {};

  console.log("[webhook]", eventType, "order=", order.id, "customer=", customer.email, "product=", order.product);

  if (eventType === "checkout.completed" && order.status === "paid") {
    const fallbackToken = await mintFallbackToken(order.id || event.id || "unknown", env.FALLBACK_TOKEN_SECRET);
    console.log("[webhook] order paid. fallback token:", fallbackToken);
    return jsonResponse(200, { ok: true, received: true, fallbackToken, customerEmail: customer.email });
  }

  return jsonResponse(200, { ok: true, received: true });
}

// ---- entry point ------------------------------------------------------------

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (request.method === "POST" && path === "/unlock") return await handleUnlock(request, env);
      if (request.method === "POST" && path === "/validate") return await handleValidate(request, env);
      if (request.method === "POST" && path === "/webhook") return await handleWebhook(request, env);
      if (request.method === "GET" && path === "/health") return jsonResponse(200, { ok: true, ts: Date.now() });
      return jsonResponse(404, { ok: false, error: "Not found" });
    } catch (e) {
      console.error("[error]", e);
      return jsonResponse(500, { ok: false, error: "Internal error" });
    }
  },
};
