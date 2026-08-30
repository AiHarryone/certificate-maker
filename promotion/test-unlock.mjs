// Local simulation: run worker-cf.js against a mock Creem API.
const worker = (await import('../worker-cf.js')).default;

// Mock Creem activate API
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  if (u.includes('/v1/licenses/activate')) {
    const body = JSON.parse(opts.body);
    if (body.key === 'VALID-XXXX-2026') return new Response(JSON.stringify({ status: 'active', instance: [{ id: 'inst-001' }] }), { status: 200 });
    if (body.key === 'INVALID-KEY') return new Response('{}', { status: 404 });
    if (body.key === 'USED-KEY') return new Response(JSON.stringify({ error: 'already activated' }), { status: 403 });
  }
  return new Response('{}', { status: 404 });
};

const env = { CREEM_API_KEY: 'creem_test', CREEM_API_BASE: 'https://api.creem.io' };

async function call(path, body) {
  const req = new Request('https://test.local' + path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  const res = await worker.fetch(req, env);
  return { status: res.status, json: await res.json() };
}

const health = await worker.fetch(new Request('https://test.local/health'), env);
console.log('health:', health.status, JSON.stringify(await health.json()));

const valid = await call('/unlock', { key: 'VALID-XXXX-2026' });
console.log('valid key:', valid.status, JSON.stringify(valid.json));

const invalid = await call('/unlock', { key: 'INVALID-KEY' });
console.log('invalid key:', invalid.status, JSON.stringify(invalid.json));

const used = await call('/unlock', { key: 'USED-KEY' });
console.log('used key:', used.status, JSON.stringify(used.json));

const empty = await call('/unlock', { key: '' });
console.log('empty key:', empty.status, JSON.stringify(empty.json));
