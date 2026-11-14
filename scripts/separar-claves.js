#!/usr/bin/env node
/* Separa las RESPUESTAS CORRECTAS de un trayecto de prácticas.
 *   node scripts/separar-claves.js <fuente.js> <publico.js> <claves.json>
 * - <fuente.js>: archivo del trayecto CON respuestas (registrarTrayecto({...})). NO subirlo al repositorio (es público).
 * - <publico.js>: lo que se publica en el sitio (sin respuestas; marca servidor:true).
 * - <claves.json>: {"<n° práctica>": {misiones:[…]}} para cargar en la tabla practica_claves de la plataforma del CFP.
 * La corrección la hace la función «practica-servidor» de la plataforma del CFP. */
const fs = require('fs'), vm = require('vm');
const [, , src, pub, out] = process.argv;
if (!src || !pub || !out) { console.error('Uso: separar-claves.js <fuente.js> <publico.js> <claves.json>'); process.exit(1); }
let T; const ctx = { registrarTrayecto: (t) => { T = t; }, console }; vm.createContext(ctx);
for (const f of (process.env.PRE || '').split(',').filter(Boolean)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
vm.runInContext(fs.readFileSync(src, 'utf8'), ctx, { filename: src });
const plain = (s) => String(s).replace(/<br>/g, ' ').replace(/<[^>]+>/g, '');
const unq = (s) => s.replace(/&quot;/g, '"');
const claves = {}, publicas = {};
for (const n of Object.keys(T.practicas)) {
  const p = JSON.parse(JSON.stringify(T.practicas[n])); const mis = [];
  p.missions.forEach((m, mi) => {
    const rv = (x) => Object.assign({ m: m.title }, x);
    switch (m.type) {
      case 'quiz':
        mis.push({ t: 'quiz', max: m.items.length, items: m.items.map((it) => ({ a: it.a, why: it.why || '', rv: rv({ t: (it.q || '').replace(/<[^>]+>/g, ''), ok: plain(it.opts[it.a]), why: it.why || '' }) })) });
        m.items.forEach((it) => { delete it.a; delete it.why; }); break;
      case 'sort':
        mis.push({ t: 'sort', max: m.items.length, items: m.items.map((it) => { const r = it[2] || 'Va en «' + m.bins[it[1]] + '».'; return { b: it[1], r, rv: rv({ t: it[0], ok: m.bins[it[1]], why: it[2] || '' }) }; }) });
        m.items = m.items.map((it) => [it[0]]); break;
      case 'spot': {
        const spans = []; m.html = m.html.replace(/<span class="sp" data-(ok|no)="([^"]*)">/g, (_, k, v) => { spans.push(k === 'ok' ? { ok: unq(v) } : { no: unq(v) }); return '<span class="sp">'; });
        if (/data-(ok|no)=/.test(m.html)) throw new Error('spot con atributos no reconocidos en práctica ' + n + ' misión ' + (mi + 1));
        const need = spans.filter((s) => s.ok != null).length; if (m.need !== need) throw new Error('need no coincide en ' + n + '/' + mi + ': ' + m.need + ' vs ' + need);
        mis.push({ t: 'spot', max: need, spans, rv: spans.filter((s) => s.ok != null).map((s) => rv({ t: s.ok })) }); break; }
      case 'tiles': {
        const need = m.items.filter((x) => x[2]).length;
        mis.push({ t: 'tiles', max: need, items: m.items.map((x) => ({ f: x[2] ? 1 : 0, x: x[3] || '', rv: x[2] ? rv({ t: '<b>' + x[1] + '.</b> ' + x[3] }) : null })) });
        m.need = need; m.items = m.items.map((x) => [x[0], x[1]]); break; }
      case 'order': {
        const k = m.steps.length, perm = []; for (let i = 0; i < k; i++) perm.push(i);
        for (let i = k - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
        // perm[j] = lugar correcto del paso que se muestra en la posición j
        const rank = perm.slice(); const pubSteps = new Array(k); rank.forEach((r, j) => { pubSteps[j] = m.steps[r]; });
        mis.push({ t: 'order', max: 1, rank, why: m.why || '', rv: rv({ t: 'El orden correcto es:', ok: m.steps.map((x, i) => (i + 1) + '. ' + x).join(' · '), why: m.why || '' }) });
        m.steps = pubSteps; delete m.why; break; }
      case 'list': case 'check': case 'pwd': case 'otp': mis.push({ t: 'comp', max: 1 }); break;
      case 'cipher': mis.push({ t: 'comp', max: 2 }); break;
      case 'term': case 'hash': case 'xss': case 'sqli': mis.push({ t: 'comp', max: m.tasks.length }); break;
      case 'sim': mis.push({ t: 'comp', max: m.ataques.length }); break;
      case 'cfg': { const ms = m.variantes ? m.variantes.map((v) => v.goals.length) : [m.goals.length]; mis.push({ t: 'comp', max: ms[0], maxs: ms }); break; }
      default: throw new Error('tipo de misión sin regla: ' + m.type + ' (práctica ' + n + ')');
    }
  });
  claves[n] = { misiones: mis }; publicas[n] = p;
}
const pubT = Object.assign({}, T, { servidor: true, practicas: undefined });
const head = JSON.stringify(pubT).slice(0, -1);
const body = Object.keys(publicas).map((n) => JSON.stringify(n) + ':' + JSON.stringify(publicas[n])).join(',\n');
fs.writeFileSync(pub, '/* Generado por scripts/separar-claves.js. Las respuestas correctas NO están en este archivo: las corrige el servidor. */\nregistrarTrayecto(' + head + (head.endsWith('{') ? '' : ',') + '"practicas":{\n' + body + '\n}});\n');
fs.writeFileSync(out, JSON.stringify(claves));
console.log('prácticas:', Object.keys(claves).length, '· misiones:', Object.values(claves).reduce((a, c) => a + c.misiones.length, 0));
