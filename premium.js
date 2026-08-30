/* premium.js — shared "Premium Collection" renderer for Certificate Maker.
   Six genuinely distinct design directions (gold foil / art deco / watercolor /
   emerald / ribbon-medal / classical pediment), each rendered from a normalized
   content object so every tool gets the same quality floor.
   Usage: drawPremium(ctx, template, W, H, content)
   content = { mode:'portrait'|'card', kicker, title, subtitle, body, meta, footer, sig, sigLabel }
   Template palette comes from the template entry: {premium, bg, ink, accent, gold, serif, dark} */
(function () {
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function goldGrad(ctx, x0, y0, x1, y1) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#f9e9b8');
    g.addColorStop(0.32, '#e3c35c');
    g.addColorStop(0.5, '#b8860b');
    g.addColorStop(0.68, '#e3c35c');
    g.addColorStop(1, '#f9e9b8');
    return g;
  }
  // Centered metallic text with a foil highlight sweep.
  function foilText(ctx, txt, x, y, font) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'center';
    var w = ctx.measureText(txt).width;
    ctx.fillStyle = goldGrad(ctx, x - w / 2, y - 50, x + w / 2, y + 10);
    ctx.fillText(txt, x, y);
    // thin lighter sheen across the upper third
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - w / 2, y - 40, w, 14);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,250,220,0.35)';
    ctx.fillRect(x - w / 2, y - 40, w, 14);
    ctx.restore();
    ctx.restore();
  }
  function wrapLines(ctx, txt, x, y, maxW, lh, align, maxN) {
    if (!txt) return;
    var words = String(txt).split(' '), line = '', n = 0, i, test;
    for (i = 0; i < words.length; i++) {
      test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, y);
        y += lh; n++;
        if (maxN && n >= maxN) return;
        line = words[i];
      } else line = test;
    }
    ctx.fillText(line, x, y);
  }
  function wash(ctx, cx, cy, r, color, alpha) {
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, hexA(color, alpha));
    g.addColorStop(1, hexA(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  function decoCorners(ctx, W, H, gold) {
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    var c = [[44, 44, 1, 1], [W - 44, 44, -1, 1], [44, H - 44, 1, -1], [W - 44, H - 44, -1, -1]];
    for (var k = 0; k < 4; k++) {
      var x = c[k][0], y = c[k][1], dx = c[k][2], dy = c[k][3], i, s;
      for (i = 0; i < 3; i++) {
        s = 30 + i * 14;
        ctx.beginPath();
        ctx.moveTo(x + dx * s, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + dy * s);
        ctx.stroke();
      }
    }
  }
  function sunburst(ctx, cx, cy, r0, r1, n, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    var i, a, a2;
    for (i = 0; i < n; i++) {
      a = i * (Math.PI * 2 / n);
      a2 = a + (Math.PI * 2 / n);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos((a + a2) / 2) * r1, Math.sin((a + a2) / 2) * r1);
      ctx.lineTo(Math.cos(a2) * r0, Math.sin(a2) * r0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  function laurel(ctx, cx, cy, r, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.95, Math.PI * 1.55); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.45, Math.PI * 1.05); ctx.stroke();
    ctx.fillStyle = color;
    var i, a, x1, y1, x2, y2;
    for (i = -6; i <= 6; i++) {
      a = Math.PI * 1.25 + i * 0.045;
      x1 = cx + Math.cos(a) * r; y1 = cy - Math.sin(a) * r;
      x2 = cx + Math.cos(a) * (r - 9); y2 = cy - Math.sin(a) * (r - 9);
      ctx.strokeStyle = color; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2 + 6); ctx.stroke();
    }
  }
  function ribbon(ctx, cx, cy, halfW, color, gold) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(cx - halfW - 16, cy - 30); ctx.lineTo(cx - halfW, cy - 18); ctx.lineTo(cx - halfW, cy - 2); ctx.lineTo(cx - halfW - 16, cy - 12); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + halfW + 16, cy - 30); ctx.lineTo(cx + halfW, cy - 18); ctx.lineTo(cx + halfW, cy - 2); ctx.lineTo(cx + halfW + 16, cy - 12); ctx.closePath(); ctx.fill();
    ctx.fillRect(cx - halfW, cy - 18, halfW * 2, 36);
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(cx - halfW, cy - 18, halfW * 2, 9);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(cx - halfW, cy + 9, halfW * 2, 9);
    ctx.fillStyle = gold; ctx.fillRect(cx - halfW, cy + 16, halfW * 2, 3);
  }
  function medal(ctx, cx, cy, r, gold) {
    ctx.fillStyle = goldGrad(ctx, cx - r, cy - r, cx + r, cy + r);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.round(r * 0.68) + 'px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('★', cx, cy + 2);
    ctx.textBaseline = 'alphabetic';
  }
  function pediment(ctx, W, y, gold) {
    ctx.strokeStyle = gold; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2, y); ctx.lineTo(W / 2 - 190, y + 108); ctx.lineTo(W / 2 + 190, y + 108); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 - 222, y + 108); ctx.lineTo(W / 2 + 222, y + 108); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 - 150, y + 108); ctx.lineTo(W / 2 - 150, y + 148); ctx.lineTo(W / 2 - 92, y + 148); ctx.lineTo(W / 2 - 92, y + 108); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 + 92, y + 108); ctx.lineTo(W / 2 + 92, y + 148); ctx.lineTo(W / 2 + 150, y + 148); ctx.lineTo(W / 2 + 150, y + 108); ctx.stroke();
  }
  function sigAt(ctx, x, y, name, label, ink, align) {
    ctx.save();
    ctx.textAlign = align || 'center';
    ctx.strokeStyle = ink; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
    var w = 180;
    ctx.beginPath(); ctx.moveTo(x - w, y + 6); ctx.lineTo(x + w, y + 6); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink; ctx.font = 'italic 18px Georgia, serif'; ctx.fillText(name || '', x, y - 2);
    ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '12px Trebuchet MS, sans-serif';
    ctx.fillText(label || 'Signature', x, y + 26);
    ctx.restore();
  }

  // ---- extra premium helpers (round 2) ----
  function roseGoldGrad(ctx, x0, y0, x1, y1) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#f9dcd3'); g.addColorStop(0.35, '#e9b0a4'); g.addColorStop(0.5, '#c98b82');
    g.addColorStop(0.65, '#e9b0a4'); g.addColorStop(1, '#f9dcd3'); return g;
  }
  function platGrad(ctx, x0, y0, x1, y1) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#f0f2f5'); g.addColorStop(0.35, '#c2c8d0'); g.addColorStop(0.5, '#9aa2ad');
    g.addColorStop(0.65, '#c2c8d0'); g.addColorStop(1, '#f0f2f5'); return g;
  }
  function metalText(ctx, txt, x, y, font, gradFn) {
    ctx.save(); ctx.font = font; ctx.textAlign = 'center';
    var w = ctx.measureText(txt).width;
    ctx.fillStyle = gradFn(ctx, x - w / 2, y - 50, x + w / 2, y + 8);
    ctx.fillText(txt, x, y);
    ctx.beginPath(); ctx.rect(x - w / 2, y - 40, w, 13); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(x - w / 2, y - 40, w, 13);
    ctx.restore();
  }
  function parchmentBg(ctx, W, H) {
    var g = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.78);
    g.addColorStop(0, '#f6ecd0'); g.addColorStop(0.7, '#efe0b8'); g.addColorStop(1, '#e2c58c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var v = ctx.createLinearGradient(0, 0, W, H);
    v.addColorStop(0, 'rgba(122,88,44,0.12)'); v.addColorStop(0.5, 'rgba(122,88,44,0)'); v.addColorStop(1, 'rgba(122,88,44,0.12)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }
  function waxSeal(ctx, cx, cy, r) {
    var g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#b03131'); g.addColorStop(1, '#6f1414');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r * 0.74, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,220,200,0.85)'; ctx.font = 'bold ' + Math.round(r * 0.5) + 'px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', cx, cy + 2); ctx.textBaseline = 'alphabetic';
  }
  function garlandCorners(ctx, W, H, col) {
    var corners = [[72, 72], [W - 72, 72], [72, H - 72], [W - 72, H - 72]];
    for (var k = 0; k < 4; k++) {
      var px = corners[k][0], py = corners[k][1], a, b;
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 36, 0, Math.PI * 2); ctx.stroke();
      for (a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        var fx = px + Math.cos(a) * 36, fy = py + Math.sin(a) * 36;
        ctx.fillStyle = col;
        for (b = 0; b < Math.PI * 2; b += Math.PI * 2 / 5) {
          ctx.beginPath(); ctx.arc(fx + Math.cos(b) * 7, fy + Math.sin(b) * 7, 4.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#e8c86a'; ctx.beginPath(); ctx.arc(fx, fy, 3.2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function geoPattern(ctx, W, H, color) {
    ctx.fillStyle = color; ctx.globalAlpha = 0.12;
    var s = 46, x, y;
    for (x = 0; x < W + s; x += s) for (y = 0; y < H + s; y += s) {
      if ((Math.floor(x / s) + Math.floor(y / s)) % 2 === 0) {
        ctx.beginPath(); ctx.moveTo(x, y + s / 2); ctx.lineTo(x + s / 2, y); ctx.lineTo(x + s, y + s / 2); ctx.lineTo(x + s / 2, y + s); ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function crown(ctx, cx, cy, w, gold) {
    var h = w * 0.62;
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy + h); ctx.lineTo(cx - w / 2, cy);
    ctx.lineTo(cx - w / 4, cy + h * 0.45); ctx.lineTo(cx, cy - h * 0.12);
    ctx.lineTo(cx + w / 4, cy + h * 0.45); ctx.lineTo(cx + w / 2, cy);
    ctx.lineTo(cx + w / 2, cy + h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(cx - w / 2, cy + h * 0.72, w, h * 0.28);
  }
  function swirl(ctx, cx, cy, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 52, cy - 6);
    ctx.quadraticCurveTo(cx, cy - 74, cx + 42, cy - 18);
    ctx.quadraticCurveTo(cx + 58, cy + 8, cx + 30, cy + 32);
    ctx.quadraticCurveTo(cx + 8, cy + 52, cx - 10, cy + 30);
    ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(cx - 14, cy + 12, 6, 0, Math.PI * 2); ctx.stroke();
  }

  // ---- premium ornament helpers (round 3, classic real-certificate looks) ----
  function ornateCorner(ctx, x, y, dx, dy, size, gold) {
    ctx.save(); ctx.translate(x, y);
    ctx.strokeStyle = gold; ctx.lineCap = 'round';
    // arms
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * size, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, dy * size); ctx.stroke();
    // big curl
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2); ctx.stroke();
    // inner spiral curl
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(dx * size * 0.16, dy * size * 0.16, size * 0.13, 0, Math.PI * 2); ctx.stroke();
    // flourishes
    ctx.beginPath();
    ctx.moveTo(dx * size * 0.48, 0);
    ctx.quadraticCurveTo(dx * size * 0.6, dy * size * 0.2, dx * size * 0.44, dy * size * 0.34);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, dy * size * 0.48);
    ctx.quadraticCurveTo(dx * size * 0.2, dy * size * 0.6, dx * size * 0.34, dy * size * 0.44);
    ctx.stroke();
    // diamond tips
    ctx.fillStyle = gold;
    ctx.save(); ctx.translate(dx * size, 0); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore();
    ctx.save(); ctx.translate(0, dy * size); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore();
    ctx.restore();
  }
  function guillocheBand(ctx, W, H, inset, gold) {
    ctx.strokeStyle = gold; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.85;
    function rosette(x, y, rr) {
      ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.stroke();
      var a;
      for (a = 0; a < Math.PI * 2; a += Math.PI / 2) {
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, rr * 0.52, 0, Math.PI * 2); ctx.stroke();
      }
    }
    var step = 96, i;
    for (i = inset + 30; i < W - inset; i += step) { rosette(i, inset + 26, 11); rosette(i, H - inset - 26, 11); }
    for (i = inset + 30; i < H - inset; i += step) { rosette(inset + 26, i, 11); rosette(W - inset - 26, i, 11); }
    ctx.globalAlpha = 1;
  }
  function laurelWreath(ctx, cx, cy, r, gold) {
    ctx.strokeStyle = gold; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.95, Math.PI * 1.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.4, Math.PI * 1.05); ctx.stroke();
    ctx.fillStyle = gold;
    var s, i, a, lx, ly, ang;
    for (s = -1; s <= 1; s += 2) {
      for (i = -5; i <= 5; i++) {
        a = (s < 0 ? Math.PI * 1.27 : Math.PI * 0.73) + i * 0.055;
        lx = cx + Math.cos(a) * r; ly = cy + Math.sin(a) * r;
        ang = a + Math.PI / 2;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang);
        ctx.beginPath(); ctx.ellipse(0, 0, 7.5, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
  }
  function ribbonBanner(ctx, cx, cy, halfW, color, gold, text) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx - halfW - 20, cy - 13);
    ctx.lineTo(cx - halfW, cy - 27);
    ctx.lineTo(cx + halfW, cy - 27);
    ctx.lineTo(cx + halfW + 20, cy - 13);
    ctx.lineTo(cx + halfW, cy + 2);
    ctx.lineTo(cx - halfW, cy + 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = gold; ctx.fillRect(cx - halfW, cy, halfW * 2, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(cx - halfW, cy - 25, halfW * 2, 6);
    if (text) { ctx.fillStyle = '#fff'; ctx.font = 'bold 22px Trebuchet MS, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(text, cx, cy - 4); }
  }
  function goldSeal(ctx, cx, cy, r, gold) {
    ctx.fillStyle = goldGrad(ctx, cx - r, cy - r, cx + r, cy + r);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    var a;
    for (a = 0; a < Math.PI * 2; a += Math.PI * 2 / 24) {
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r * 0.74, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.round(r * 0.6) + 'px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('★', cx, cy + 2); ctx.textBaseline = 'alphabetic';
  }
  function ornateDivider(ctx, x, y, gold) {
    ctx.strokeStyle = gold; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x - 150, y); ctx.lineTo(x - 22, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 22, y); ctx.lineTo(x + 150, y); ctx.stroke();
    ctx.fillStyle = gold;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-7, -7, 14, 14); ctx.restore();
    ctx.beginPath(); ctx.arc(x - 20, y, 7, Math.PI * 0.75, Math.PI * 1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 20, y, 7, Math.PI * 1.75, Math.PI * 2.25); ctx.stroke();
  }
  function faintWatermark(ctx, W, H, symbol, color) {
    ctx.save(); ctx.globalAlpha = 0.05; ctx.fillStyle = color; ctx.font = 'bold 220px Georgia, serif';
    ctx.textAlign = 'center'; ctx.fillText(symbol, W / 2, H * 0.42); ctx.restore();
  }
  function marbleBg(ctx, W, H, base, vein) {
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
    ctx.save();
    try { ctx.filter = 'blur(4px)'; } catch (e) {}
    var i, x, y, k;
    for (i = 0; i < 12; i++) {
      ctx.strokeStyle = vein; ctx.globalAlpha = 0.06 + Math.random() * 0.07;
      ctx.lineWidth = 10 + Math.random() * 18;
      ctx.beginPath();
      x = Math.random() * W; y = Math.random() * H;
      ctx.moveTo(x, y);
      for (k = 0; k < 6; k++) {
        x += (Math.random() - 0.5) * 340; y += (Math.random() - 0.5) * 240;
        ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 140, y + (Math.random() - 0.5) * 140, x, y);
      }
      ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }

  // ---- main entry ----
  function drawPremium(ctx, t, W, H, c) {
    var ink = t.ink, ac = t.accent, gold = t.gold || '#d4af37';
    var serif = 'Georgia, serif', sans = 'Trebuchet MS, sans-serif';

    if (c.mode === 'card') { drawCard(ctx, t, W, H, c, ink, ac, gold, serif, sans); return; }

    ctx.save();
    ctx.textAlign = 'center';
    var name = c.title || '', kicker = c.kicker || '', sub = c.subtitle || '', body = c.body || '',
        meta = c.meta || '', footer = c.footer || '', sig = c.sig || '';

    switch (t.premium) {
      case 'foil':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(28, 28, W - 56, H - 56);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.55; ctx.lineWidth = 1; ctx.strokeRect(38, 38, W - 76, H - 76);
        ctx.globalAlpha = 1;
        // foil corner fleurons
        ctx.fillStyle = gold;
        [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]].forEach(function (p) {
          ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(Math.PI / 4); ctx.fillRect(-5, -5, 10, 10); ctx.restore();
        });
        ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = 'bold 15px ' + sans;
        ctx.fillText(kicker, W / 2, 130);
        ctx.globalAlpha = 1;
        foilText(ctx, name, W / 2, 250, 'bold 58px ' + serif);
        ctx.fillStyle = gold; ctx.font = 'italic 26px ' + serif; ctx.fillText(sub, W / 2, 320);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(W / 2 - 160, 350); ctx.lineTo(W / 2 + 160, 350); ctx.stroke();
        ctx.globalAlpha = 1;
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = 'italic 17px ' + serif; wrapLines(ctx, body, W / 2, 400, 660, 25, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.6; ctx.font = '16px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'deco':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        decoCorners(ctx, W, H, gold);
        sunburst(ctx, W / 2, 118, 26, 82, 24, gold);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(W / 2, 118, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = t.bg; ctx.font = 'bold 20px ' + serif; ctx.fillText('★', W / 2, 127);
        ctx.fillStyle = ink; ctx.font = 'bold 44px ' + serif; ctx.fillText(name, W / 2, 290);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 345);
        ctx.fillStyle = gold; ctx.font = 'bold 14px ' + sans;
        ctx.fillText('— ' + kicker + ' —', W / 2, 200);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.72; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 400, 620, 26, 'center', 5); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.6; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'bloom':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        wash(ctx, W * 0.16, H * 0.18, 340, ac, 0.14);
        wash(ctx, W * 0.84, H * 0.24, 300, t.bloom2 || '#a7b8a4', 0.12);
        wash(ctx, W * 0.5, H * 0.9, 360, t.bloom3 || '#d9c6a9', 0.1);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.65; ctx.lineWidth = 1; ctx.strokeRect(34, 34, W - 68, H - 68); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = 'bold 14px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.font = 'italic 56px ' + serif; ctx.fillText(name, W / 2, 300);
        ctx.fillStyle = ac; ctx.font = 'italic 25px ' + serif; ctx.fillText(sub, W / 2, 355);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 405, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.6; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'emerald':
        var vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.75);
        vg.addColorStop(0, t.bg); vg.addColorStop(1, '#04180f');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.85; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60); ctx.globalAlpha = 1;
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.4; ctx.lineWidth = 1; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
        laurel(ctx, W / 2, 170, 64, gold);
        ctx.fillStyle = gold; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 250);
        ctx.fillStyle = '#f6f1e3'; ctx.font = 'bold 52px ' + serif; ctx.fillText(name, W / 2, 340);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 395);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W / 2 - 130, 425); ctx.lineTo(W / 2 + 130, 425); ctx.stroke(); ctx.globalAlpha = 1;
        if (body) { ctx.fillStyle = '#d9e5dd'; ctx.globalAlpha = 0.85; ctx.font = '16px ' + serif; wrapLines(ctx, body, W / 2, 470, 620, 25, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#b8cdbf'; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = '#b8cdbf'; ctx.globalAlpha = 0.85; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, '#d9e5dd');
        break;

      case 'medal':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.strokeRect(30, 30, W - 60, H - 60); ctx.globalAlpha = 1;
        ribbon(ctx, W / 2, 92, 210, t.ribbonColor || '#9f1d1d', gold);
        medal(ctx, W / 2, 200, 46, gold);
        ctx.fillStyle = ink; ctx.font = 'bold 45px ' + serif; ctx.fillText(name, W / 2, 310);
        ctx.fillStyle = ac; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 362);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 410, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.6; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'ceremony':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.45; ctx.lineWidth = 1; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
        pediment(ctx, W, 70, gold);
        medal(ctx, W / 2, 240, 34, gold);
        ctx.fillStyle = ink; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 310);
        ctx.fillStyle = ink; ctx.font = 'bold 48px ' + serif; ctx.fillText(name, W / 2, 385);
        ctx.fillStyle = ac; ctx.font = 'italic 23px ' + serif; ctx.fillText(sub, W / 2, 435);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 480, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.6; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'victorian':
        var vtb = ctx.createLinearGradient(0, 0, W, H);
        vtb.addColorStop(0, '#f7ecd7'); vtb.addColorStop(0.5, '#f0dfc0'); vtb.addColorStop(1, '#e9d3a6');
        ctx.fillStyle = vtb; ctx.fillRect(0, 0, W, H);
        faintWatermark(ctx, W, H, '❧', '#8c6a3f');
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
        ornateCorner(ctx, 32, 32, 1, 1, 64, gold);
        ornateCorner(ctx, W - 32, 32, -1, 1, 64, gold);
        ornateCorner(ctx, 32, H - 32, 1, -1, 64, gold);
        ornateCorner(ctx, W - 32, H - 32, -1, -1, 64, gold);
        goldSeal(ctx, W / 2, 175, 36, gold);
        ctx.fillStyle = ink; ctx.font = 'bold 15px ' + serif; ctx.fillText(kicker.toUpperCase(), W / 2, 260);
        metalText(ctx, name, W / 2, 355, 'italic 54px ' + serif, goldGrad);
        ctx.fillStyle = ink; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 410);
        ornateDivider(ctx, W / 2, 440, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = 'italic 17px ' + serif; wrapLines(ctx, body, W / 2, 480, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '16px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'navy':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = t.accent; ctx.fillRect(24, 24, W - 48, H - 48);
        ctx.fillStyle = t.bg; ctx.fillRect(37, 37, W - 74, H - 74);
        guillocheBand(ctx, W, H, 24, gold);
        ribbonBanner(ctx, W / 2, 140, 190, t.ribbon || '#9f1d1d', gold, 'CERTIFICATE');
        goldSeal(ctx, W / 2, 215, 30, gold);
        ctx.fillStyle = ink; ctx.font = 'bold 15px ' + serif; ctx.fillText(kicker.toUpperCase(), W / 2, 275);
        ctx.fillStyle = ink; ctx.font = 'bold 50px ' + serif; ctx.fillText(name, W / 2, 360);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 415);
        ornateDivider(ctx, W / 2, 445, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 485, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'redgold':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
        ctx.fillStyle = gold;
        [[62, 62], [W - 62, 62], [62, H - 62], [W - 62, H - 62]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fill(); });
        laurelWreath(ctx, W / 2, 180, 60, gold);
        ctx.fillStyle = t.ribbon || '#9f1d1d'; ctx.beginPath(); ctx.arc(W / 2, 180, 25, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W / 2, 180, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', W / 2, 182); ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = ink; ctx.font = 'bold 15px ' + serif; ctx.fillText(kicker.toUpperCase(), W / 2, 255);
        ctx.fillStyle = ink; ctx.font = 'italic 56px ' + serif; ctx.fillText(name, W / 2, 350);
        ctx.fillStyle = ac; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 400);
        ornateDivider(ctx, W / 2, 430, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 475, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'blackgold':
        var bgb = ctx.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.8);
        bgb.addColorStop(0, t.bg); bgb.addColorStop(1, '#050505');
        ctx.fillStyle = bgb; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.85; ctx.lineWidth = 2; ctx.strokeRect(28, 28, W - 56, H - 56); ctx.globalAlpha = 1;
        ribbonBanner(ctx, W / 2, 140, 170, gold, '#b8860b', 'AWARD');
        ctx.strokeStyle = gold; ctx.lineWidth = 2;
        [[44, 44, 1, 1], [W - 44, 44, -1, 1], [44, H - 44, 1, -1], [W - 44, H - 44, -1, -1]].forEach(function (c) {
          ctx.beginPath(); ctx.moveTo(c[0] + c[2] * 40, c[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0], c[1] + c[3] * 40); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(c[0] + c[2] * 27, c[1] + 13); ctx.lineTo(c[0] + 13, c[1] + 13); ctx.lineTo(c[0] + 13, c[1] + c[3] * 27); ctx.stroke();
        });
        goldSeal(ctx, W / 2, 230, 40, gold);
        ctx.fillStyle = 'rgba(245,245,240,0.92)'; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 315);
        metalText(ctx, name, W / 2, 395, 'bold 54px ' + serif, goldGrad);
        ctx.fillStyle = 'rgba(212,175,55,0.95)'; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 450);
        if (body) { ctx.fillStyle = 'rgba(230,230,225,0.7)'; ctx.font = '16px ' + serif; wrapLines(ctx, body, W / 2, 495, 620, 25, 'center', 4); }
        ctx.fillStyle = 'rgba(210,210,205,0.6)'; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150);
        ctx.fillStyle = 'rgba(230,230,225,0.85)'; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120);
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, 'rgba(230,230,225,0.9)');
        break;

      case 'bluegold':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = t.accent; ctx.fillRect(26, 26, W - 52, H - 52);
        ctx.fillStyle = t.bg; ctx.fillRect(36, 36, W - 72, H - 72);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(42, 42, W - 84, H - 84);
        ornateCorner(ctx, 44, 44, 1, 1, 46, gold);
        ornateCorner(ctx, W - 44, 44, -1, 1, 46, gold);
        ornateCorner(ctx, 44, H - 44, 1, -1, 46, gold);
        ornateCorner(ctx, W - 44, H - 44, -1, -1, 46, gold);
        laurelWreath(ctx, W / 2, 175, 56, gold);
        goldSeal(ctx, W / 2, 175, 22, gold);
        ctx.fillStyle = t.accent; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 260);
        ctx.fillStyle = ink; ctx.font = 'bold 50px ' + serif; ctx.fillText(name, W / 2, 350);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 405);
        ornateDivider(ctx, W / 2, 435, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 478, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'medallion':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(26, 26, W - 52, H - 52);
        guillocheBand(ctx, W, H, 26, gold);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.strokeRect(44, 44, W - 88, H - 88); ctx.globalAlpha = 1;
        goldSeal(ctx, W / 2, 180, 44, gold);
        ctx.fillStyle = gold; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 275);
        metalText(ctx, name, W / 2, 365, 'italic 54px ' + serif, goldGrad);
        ctx.fillStyle = ink; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 420);
        ornateDivider(ctx, W / 2, 450, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 490, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'marble':
        marbleBg(ctx, W, H, t.bg, t.vein || '#c8b896');
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.strokeRect(34, 34, W - 68, H - 68); ctx.globalAlpha = 1;
        ctx.fillStyle = '#8a7a5c'; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 200);
        metalText(ctx, name, W / 2, 330, 'italic 56px ' + serif, goldGrad);
        ctx.fillStyle = '#8a7a5c'; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 385);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.6; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W / 2 - 140, 415); ctx.lineTo(W / 2 + 140, 415); ctx.stroke(); ctx.globalAlpha = 1;
        if (body) { ctx.fillStyle = '#5c5548'; ctx.globalAlpha = 0.75; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 455, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#5c5548'; ctx.globalAlpha = 0.6; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = '#5c5548'; ctx.globalAlpha = 0.8; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, '#5c5548');
        break;

      case 'forest':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = t.accent; ctx.fillRect(28, 28, W - 56, H - 56);
        ctx.fillStyle = t.bg; ctx.fillRect(38, 38, W - 76, H - 76);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(44, 44, W - 88, H - 88);
        ornateCorner(ctx, 46, 46, 1, 1, 42, gold);
        ornateCorner(ctx, W - 46, 46, -1, 1, 42, gold);
        ornateCorner(ctx, 46, H - 46, 1, -1, 42, gold);
        ornateCorner(ctx, W - 46, H - 46, -1, -1, 42, gold);
        laurelWreath(ctx, W / 2, 180, 54, gold);
        ctx.fillStyle = t.accent; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 265);
        ctx.fillStyle = ink; ctx.font = 'bold 50px ' + serif; ctx.fillText(name, W / 2, 355);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 410);
        ornateDivider(ctx, W / 2, 440, gold);
        if (body) { ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 482, 620, 26, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = ink; ctx.globalAlpha = 0.55; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, ink);
        break;

      case 'champagne':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        wash(ctx, W * 0.2, H * 0.15, 340, ac, 0.1);
        wash(ctx, W * 0.84, H * 0.82, 360, t.bloom2 || '#d8c3a8', 0.12);
        ctx.strokeStyle = 'rgba(184,138,92,0.55)'; ctx.lineWidth = 1.5; ctx.strokeRect(36, 36, W - 72, H - 72);
        ornateCorner(ctx, 38, 38, 1, 1, 44, 'rgba(184,138,92,0.75)');
        ornateCorner(ctx, W - 38, 38, -1, 1, 44, 'rgba(184,138,92,0.75)');
        ornateCorner(ctx, 38, H - 38, 1, -1, 44, 'rgba(184,138,92,0.75)');
        ornateCorner(ctx, W - 38, H - 38, -1, -1, 44, 'rgba(184,138,92,0.75)');
        ctx.fillStyle = 'rgba(120,90,60,0.65)'; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 200);
        metalText(ctx, name, W / 2, 330, 'italic 56px ' + serif, roseGoldGrad);
        ctx.fillStyle = 'rgba(140,100,70,0.9)'; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 385);
        ctx.strokeStyle = 'rgba(184,138,92,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W / 2 - 140, 415); ctx.lineTo(W / 2 + 140, 415); ctx.stroke();
        if (body) { ctx.fillStyle = 'rgba(100,72,58,0.75)'; ctx.font = '17px ' + serif; wrapLines(ctx, body, W / 2, 455, 620, 26, 'center', 4); }
        ctx.fillStyle = 'rgba(120,90,60,0.6)'; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150);
        ctx.fillStyle = 'rgba(120,90,60,0.8)'; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120);
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, 'rgba(120,90,60,0.85)');
        break;

      case 'burgundy':
        var bub = ctx.createRadialGradient(W / 2, H / 2, W * 0.12, W / 2, H / 2, W * 0.78);
        bub.addColorStop(0, t.bg); bub.addColorStop(1, '#2a060e');
        ctx.fillStyle = bub; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.9; ctx.lineWidth = 3; ctx.strokeRect(30, 30, W - 60, H - 60); ctx.globalAlpha = 1;
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.4; ctx.lineWidth = 1; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
        ornateCorner(ctx, 32, 32, 1, 1, 56, gold);
        ornateCorner(ctx, W - 32, 32, -1, 1, 56, gold);
        ornateCorner(ctx, 32, H - 32, 1, -1, 56, gold);
        ornateCorner(ctx, W - 32, H - 32, -1, -1, 56, gold);
        laurelWreath(ctx, W / 2, 175, 58, gold);
        ctx.fillStyle = gold; ctx.font = 'bold 15px ' + sans; ctx.fillText(kicker.toUpperCase(), W / 2, 260);
        ctx.fillStyle = '#f6ecdf'; ctx.font = 'italic 52px ' + serif; ctx.fillText(name, W / 2, 350);
        ctx.fillStyle = gold; ctx.font = 'italic 24px ' + serif; ctx.fillText(sub, W / 2, 405);
        ornateDivider(ctx, W / 2, 435, gold);
        if (body) { ctx.fillStyle = '#e8d5cd'; ctx.globalAlpha = 0.8; ctx.font = '16px ' + serif; wrapLines(ctx, body, W / 2, 478, 620, 25, 'center', 4); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#e0c9c0'; ctx.globalAlpha = 0.7; ctx.font = '15px ' + serif; ctx.fillText(meta, W / 2, H - 150); ctx.globalAlpha = 1;
        ctx.fillStyle = '#e8d5cd'; ctx.globalAlpha = 0.9; ctx.font = '15px ' + serif; ctx.fillText(footer, W / 2, H - 120); ctx.globalAlpha = 1;
        sigAt(ctx, W / 2, H - 70, sig, c.sigLabel, '#f6ecdf');
        break;


      default:
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = ink; ctx.font = 'bold 40px ' + serif; ctx.fillText(name, W / 2, H / 2);
    }
    ctx.restore();
  }

  // Compact compositions for business cards and name tags (mode:'card').
  function drawCard(ctx, t, W, H, c, ink, ac, gold, serif, sans) {
    var name = c.title || '', sub = c.subtitle || '', body = c.body || '', meta = c.meta || '';
    switch (t.premium) {
      case 'foil':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.6; ctx.strokeRect(16, 16, W - 32, H - 32); ctx.globalAlpha = 1;
        ctx.fillStyle = gold;
        [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(function (p) {
          ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(Math.PI / 4); ctx.fillRect(-3.5, -3.5, 7, 7); ctx.restore();
        });
        ctx.textAlign = 'left';
        foilTextLeft(ctx, name, 42, H * 0.42, 'bold 44px ' + serif);
        ctx.fillStyle = ink; ctx.globalAlpha = 0.8; ctx.font = '18px ' + sans; ctx.fillText(sub, 44, H * 0.42 + 38); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.65; ctx.font = '15px ' + sans; wrapLines(ctx, body, 44, H * 0.6, W - 90, 22, 'left', 2); ctx.globalAlpha = 1;
        ctx.fillStyle = gold; ctx.globalAlpha = 0.8; ctx.font = '13px ' + sans; wrapLines(ctx, meta, 44, H - 46, W - 90, 20, 'left', 3); ctx.globalAlpha = 1;
        break;

      case 'deco':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        decoCorners(ctx, W, H, gold);
        ctx.textAlign = 'left';
        ctx.fillStyle = gold; ctx.font = 'bold 13px ' + sans; ctx.fillText((c.kicker || 'EST').toUpperCase(), 46, 60);
        ctx.fillStyle = ink; ctx.font = 'bold 42px ' + serif; ctx.fillText(name, 46, H * 0.45);
        ctx.fillStyle = gold; ctx.font = 'italic 19px ' + serif; ctx.fillText(sub, 46, H * 0.45 + 36);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, H * 0.52); ctx.lineTo(W - 46, H * 0.52); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '14px ' + sans; wrapLines(ctx, body, 46, H * 0.62, W - 100, 20, 'left', 3); ctx.globalAlpha = 1;
        ctx.fillStyle = gold; ctx.font = '12px ' + sans; wrapLines(ctx, meta, 46, H - 46, W - 100, 18, 'left', 3); ctx.globalAlpha = 1;
        break;

      case 'bloom':
        ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
        wash(ctx, W * 0.25, H * 0.15, 220, ac, 0.16);
        wash(ctx, W * 0.85, H * 0.8, 240, t.bloom2 || '#a7b8a4', 0.14);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.7; ctx.lineWidth = 1; ctx.strokeRect(18, 18, W - 36, H - 36); ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        ctx.fillStyle = ink; ctx.font = 'italic 40px ' + serif; ctx.fillText(name, 40, H * 0.42);
        ctx.fillStyle = ink; ctx.globalAlpha = 0.7; ctx.font = '17px ' + serif; ctx.fillText(sub, 40, H * 0.42 + 34); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.globalAlpha = 0.65; ctx.font = '14px ' + sans; wrapLines(ctx, body, 40, H * 0.58, W - 90, 20, 'left', 3); ctx.globalAlpha = 1;
        ctx.fillStyle = ac; ctx.font = '13px ' + sans; wrapLines(ctx, meta, 40, H - 46, W - 90, 18, 'left', 3); ctx.globalAlpha = 1;
        break;

      case 'emerald':
        var vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.8);
        vg.addColorStop(0, t.bg); vg.addColorStop(1, '#04180f');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.6; ctx.strokeRect(16, 16, W - 32, H - 32); ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        ctx.fillStyle = gold; ctx.font = 'bold 12px ' + sans; ctx.fillText((c.kicker || 'EST').toUpperCase(), 42, 50);
        ctx.fillStyle = '#f6f1e3'; ctx.font = 'bold 40px ' + serif; ctx.fillText(name, 42, H * 0.42);
        ctx.fillStyle = gold; ctx.font = 'italic 18px ' + serif; ctx.fillText(sub, 42, H * 0.42 + 32);
        ctx.strokeStyle = gold; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(42, H * 0.5); ctx.lineTo(W - 42, H * 0.5); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = '#c7d8cc'; ctx.font = '14px ' + sans; wrapLines(ctx, body, 42, H * 0.6, W - 100, 20, 'left', 3); ctx.globalAlpha = 1;
        ctx.fillStyle = '#b8cdbf'; ctx.font = '12px ' + sans; wrapLines(ctx, meta, 42, H - 44, W - 100, 18, 'left', 3); ctx.globalAlpha = 1;
        break;

      default:
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = ink; ctx.font = 'bold 34px ' + serif; ctx.textAlign = 'center'; ctx.fillText(name, W / 2, H / 2);
    }
  }

  // Left-aligned foil text (cards).
  function foilTextLeft(ctx, txt, x, y, font) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'left';
    var w = ctx.measureText(txt).width;
    ctx.fillStyle = goldGrad(ctx, x, y - 40, x + w, y + 6);
    ctx.fillText(txt, x, y);
    ctx.restore();
  }

  window.drawPremium = drawPremium;
})();
