/* =====================================================================
   Misión «cfg» · Configurá: simulador de pantallas de configuración
   (router, Windows, Android, iPhone, apps). Todo es de mentira: no toca
   ningún equipo real. Las pantallas se describen como datos en cada trayecto.

   Formato de una misión:
   {type:'cfg', title, lead, device:'router'|'win'|'android'|'iphone',
    start:'id', state:{...}, screens:{id:{...}}, goals:[{t, ok:fn(s), ruta}],
    variantes:[{t:'Android', ic, ...mismos campos}]  ← opcional: elige el equipo }

   Una pantalla: {title, url, grid:true (pantalla de inicio con íconos),
    save:true (los cambios valen recién al tocar Guardar), valid:fn(s)→error,
    login:{next, user:fn(s), pass:fn(s), etiqueta:[[k,v],...]}, items:[...]}

   Elementos (items):
    {nav:'id', t, d, ic, tone, set:{...}}     fila que abre otra pantalla
    {sel:'clave', t, opts:[...]}               lista desplegable
    {tog:'clave', t, d}                        interruptor
    {pwd:'clave', t, min}                      contraseña con medidor
    {txt:'clave', t, ph}                       texto
    {act:'id', t, run:fn(s)→'mensaje' | {msg, nav, err}, alt:true, link:true}
    {info:'texto' | fn(s)}                     texto informativo
    {list:fn(s)→[{t,d,ic,tone,nav,set}]}       filas que dependen del estado
    {save:true, t:'Guardar'}                   guarda la pantalla
   ===================================================================== */
var CFG = null;
function cfgClon(o) { return JSON.parse(JSON.stringify(o)); }
function cfgFuerza(p) {
  p = p || ''; var v = 0;
  if (p.length >= 8) v++; if (p.length >= 12) v++; if (p.length >= 16) v++;
  if (/[a-z]/.test(p) && /[A-Z0-9]/.test(p)) v++; if (/[^a-zA-Z0-9]/.test(p) || /\s/.test(p)) v++;
  return Math.min(4, v);
}

TYPES.cfg = function (m, z) {
  if (m.variantes && !m._v) {
    z.innerHTML = '<div class="card"><div class="q">¿Qué equipo querés configurar?</div><p class="hint">Elegí el que más se parece al tuyo. Si no tenés ninguno, elegí cualquiera.</p>' +
      '<div class="cfgvar">' + m.variantes.map(function (v, k) {
        return '<button class="cfgvb" data-k="' + k + '">' + ic(v.ic || 'phone', v.tone || 'teal') + '<b>' + v.t + '</b></button>';
      }).join('') + '</div></div>';
    z.querySelectorAll('.cfgvb').forEach(function (b) {
      b.onclick = function () {
        var v = m.variantes[+b.dataset.k], mm = {};
        for (var k in m) if (k !== 'variantes') mm[k] = m[k];
        for (var k2 in v) if (k2 !== 't') mm[k2] = v[k2];
        mm._v = v.t; TYPES.cfg(mm, z);
      };
    });
    return;
  }
  document.body.classList.add('ancho');
  var C = CFG = { m: m, s: cfgClon(m.state || {}), d: {}, cur: m.start, hist: [], dirty: false, acts: 0, fin: false, msg: null, warn: null };

  z.innerHTML = '<div class="cfgwrap"><div class="cfgdev dev-' + m.device + '" id="cdev"></div>' +
    '<div class="cfgtask"><div class="card"><div class="counter">Tu tarea' + (m._v ? ' · ' + esc(m._v) : '') + '</div>' +
    (m.intro ? '<p class="hint" style="margin:6px 0 0">' + m.intro + '</p>' : '') +
    '<ol class="cgoals" id="cg"></ol>' +
    '<div class="fb" id="f"></div>' +
    '<button class="btn alt" id="cpi" style="display:none">¿Dónde está? Ver una pista</button>' +
    '<button class="btn alt" id="cfin" style="display:none">Entregar como está</button>' +
    '<button class="btn alt" id="crs">Empezar de nuevo</button></div></div></div>';

  function val(k) { var sc = m.screens[C.cur]; return (sc.save && (k in C.d)) ? C.d[k] : C.s[k]; }
  function pon(k, v) { var sc = m.screens[C.cur]; if (sc.save) { C.d[k] = v; C.dirty = true; } else { C.s[k] = v; } }
  function ir(id, atras) {
    if (C.dirty) { C.warn = id; C.warnAtras = !!atras; dibujar(); return; }
    if (!m.screens[id]) return;
    if (!atras) { var j = C.hist.lastIndexOf(id); if (j >= 0) C.hist = C.hist.slice(0, j); else C.hist.push(C.cur); }
    C.cur = id; C.d = {}; C.msg = null; C.warn = null;
    var sc = m.screens[id]; if (sc.onEnter) sc.onEnter(C.s);
    dibujar();
  }
  function volver() { if (!C.hist.length) return; var id = C.hist[C.hist.length - 1]; if (C.dirty) { C.warn = id; C.warnAtras = true; dibujar(); return; } C.hist.pop(); C.cur = id; C.d = {}; C.msg = null; dibujar(); }
  function guardar() {
    var sc = m.screens[C.cur], tmp = cfgClon(C.s); for (var k in C.d) tmp[k] = C.d[k];
    var e = sc.valid ? sc.valid(tmp) : null;
    if (e) { C.msg = ['bad', e]; dibujar(); return false; }
    C.s = tmp; C.d = {}; C.dirty = false;
    C.msg = ['ok', (sc.onSave ? sc.onSave(C.s) : null) || 'Cambios guardados.'];
    accion(); return true;
  }

  function fila(it) {
    var icono = it.ic ? '<span class="cri">' + ic(it.ic, it.tone || 'navy') + '</span>' : '';
    return '<button class="crow" data-nav="' + it.nav + '"' + (it.set ? ' data-set=\'' + esc(JSON.stringify(it.set)) + '\'' : '') + '>' + icono +
      '<span class="crt"><b>' + it.t + '</b>' + (it.d ? '<small>' + it.d + '</small>' : '') + '</span><span class="crx">›</span></button>';
  }
  function campo(it, i) {
    if (it.nav) return fila(it);
    if (it.list) return it.list(C.s).map(fila).join('') || '<div class="cinfo">(vacío)</div>';
    if (it.info) return '<div class="cinfo">' + (typeof it.info === 'function' ? it.info(C.s) : it.info) + '</div>';
    if (it.sel) return '<label class="cfld"><span>' + it.t + '</span><select data-k="' + it.sel + '">' + it.opts.map(function (o) {
      return '<option' + (o === val(it.sel) ? ' selected' : '') + '>' + esc(o) + '</option>';
    }).join('') + '</select></label>';
    if (it.tog) { var on = !!val(it.tog); return '<div class="cfld ctog"><span><b>' + it.t + '</b>' + (it.d ? '<small>' + it.d + '</small>' : '') + '</span><button class="csw' + (on ? ' on' : '') + '" data-tog="' + it.tog + '" aria-pressed="' + on + '" aria-label="' + esc(it.t) + '"></button></div>'; }
    if (it.txt) return '<label class="cfld"><span>' + it.t + '</span><input type="text" data-k="' + it.txt + '" value="' + esc(val(it.txt) || '') + '" placeholder="' + esc(it.ph || '') + '" autocomplete="off"></label>';
    if (it.pwd) {
      var v = val(it.pwd) || '', f = cfgFuerza(v);
      return '<label class="cfld"><span>' + it.t + '</span><span class="cpw"><input type="password" data-k="' + it.pwd + '" value="' + esc(v) + '" autocomplete="new-password"><button type="button" class="cver" data-ver="1">Ver</button></span>' +
        '<span class="cmet f' + f + '"><i></i><i></i><i></i><i></i></span><small class="cmt">' + ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy buena'][f] + ' · ' + v.length + ' caracteres</small></label>';
    }
    if (it.save) return '<button class="cbtn" data-save="1">' + (it.t || 'Guardar') + '</button>';
    if (it.act) return '<button class="cbtn' + (it.alt ? ' alt' : '') + (it.link ? ' link' : '') + '" data-act="' + i + '">' + it.t + '</button>';
    return '';
  }

  function dibujar() {
    var sc = m.screens[C.cur], h = '';
    var barra = '<div class="cbar">' + (C.hist.length ? '<button class="cback" aria-label="Volver">‹</button>' : '<span class="cback off"></span>') + '<b>' + sc.title + '</b></div>';
    if (m.device === 'router' || m.device === 'win') {
      h += '<div class="cchrome">' + (m.device === 'router'
        ? '<span class="cdots"><i></i><i></i><i></i></span><span class="curl">🔒 ' + esc(sc.url || '192.168.1.1') + '</span>'
        : '<span class="cwt">' + esc(sc.win || 'Configuración') + '</span><span class="cwb">— ▢ ✕</span>') + '</div>';
    } else {
      h += '<div class="cstatus"><span>9:41</span><span>▂▄▆ ' + (m.device === 'iphone' ? '🔋' : '▮') + '</span></div>';
    }
    if (sc.login) {
      var L = sc.login;
      h += barra + '<div class="cbody"><div class="cinfo">' + (L.info || 'Ingresá con el usuario y la contraseña del panel.') + '</div>' +
        '<label class="cfld"><span>Usuario</span><input type="text" id="lu" autocomplete="off"></label>' +
        '<label class="cfld"><span>Contraseña</span><input type="password" id="lp" autocomplete="off"></label>' +
        '<button class="cbtn" id="lgo">Ingresar</button>' + (C.msg ? '<div class="cmsg ' + C.msg[0] + '">' + C.msg[1] + '</div>' : '') + '</div>' +
        (L.etiqueta ? '<div class="cetq"><div class="cetqt">Etiqueta pegada abajo del router</div>' + L.etiqueta.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') + '</div>' : '');
    } else if (sc.grid) {
      h += '<div class="cgrid">' + sc.items.map(function (it) {
        return '<button class="capp" data-nav="' + it.nav + '">' + ic(it.ic, it.tone || 'navy') + '<span>' + it.t + '</span></button>';
      }).join('') + '</div>';
    } else {
      h += barra + '<div class="cbody">' + (C.warn ? '<div class="cwarn"><b>Tenés cambios sin guardar.</b> Si salís, se pierden.<div><button class="cbtn" data-w="g">Guardar</button><button class="cbtn alt" data-w="d">Descartar</button></div></div>' : '') +
        sc.items.map(campo).join('') + (C.msg ? '<div class="cmsg ' + C.msg[0] + '">' + C.msg[1] + '</div>' : '') + '</div>';
    }
    var dv = $('#cdev'); dv.innerHTML = h;
    var b = dv.querySelector('.cback:not(.off)'); if (b) b.onclick = volver;
    dv.querySelectorAll('[data-nav]').forEach(function (e) {
      e.onclick = function () { if (e.dataset.set) { var o = JSON.parse(e.dataset.set); for (var k in o) C.s[k] = o[k]; } ir(e.dataset.nav); };
    });
    dv.querySelectorAll('select[data-k]').forEach(function (e) { e.onchange = function () { pon(e.dataset.k, e.value); C.msg = null; dibujar(); accion(); }; });
    dv.querySelectorAll('input[data-k]').forEach(function (e) {
      e.oninput = function () {
        pon(e.dataset.k, e.value);
        var lab = e.closest('.cfld'), met = lab && lab.querySelector('.cmet');
        if (met) { var f = cfgFuerza(e.value); met.className = 'cmet f' + f; lab.querySelector('.cmt').textContent = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy buena'][f] + ' · ' + e.value.length + ' caracteres'; }
      };
      e.onchange = function () { accion(); };
    });
    dv.querySelectorAll('.cver').forEach(function (e) { e.onclick = function () { var i = e.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; e.textContent = i.type === 'password' ? 'Ver' : 'Ocultar'; }; });
    dv.querySelectorAll('[data-tog]').forEach(function (e) { e.onclick = function () { pon(e.dataset.tog, !val(e.dataset.tog)); C.msg = null; dibujar(); accion(); }; });
    dv.querySelectorAll('[data-save]').forEach(function (e) { e.onclick = function () { guardar(); dibujar(); }; });
    dv.querySelectorAll('[data-act]').forEach(function (e) {
      e.onclick = function () {
        var it = sc.items[+e.dataset.act], r = it.run ? it.run(C.s) : null;
        if (typeof r === 'string') r = { msg: r };
        r = r || {};
        C.msg = r.err ? ['bad', r.err] : (r.msg ? ['ok', r.msg] : null);
        accion();
        if (r.nav && !r.err) { var keep = C.msg; C.dirty = false; ir(r.nav); C.msg = keep; dibujar(); } else dibujar();
      };
    });
    dv.querySelectorAll('[data-w]').forEach(function (e) {
      e.onclick = function () {
        var dest = C.warn, at = C.warnAtras;
        if (e.dataset.w === 'g') { if (!guardar()) { C.warn = null; dibujar(); return; } } else { C.d = {}; C.dirty = false; }
        C.warn = null; if (at) { C.hist.pop(); C.cur = dest; C.msg = null; dibujar(); } else ir(dest);
      };
    });
    var go = $('#lgo');
    if (go) go.onclick = function () {
      var L = sc.login, u = $('#lu').value.trim(), p = $('#lp').value;
      if (u === L.user(C.s) && p === L.pass(C.s)) { C.msg = null; accion(); ir(L.next); }
      else { C.msg = ['bad', 'Usuario o contraseña incorrectos. Mirá la etiqueta del router.']; dibujar(); }
    };
  }

  function metas() { return m.goals.map(function (g) { try { return !!g.ok(C.s); } catch (e) { return false; } }); }
  function pintarMetas() {
    var ok = metas();
    $('#cg').innerHTML = m.goals.map(function (g, k) { return '<li class="' + (ok[k] ? 'hecho' : '') + '"><span class="cgk">' + (ok[k] ? '✓' : k + 1) + '</span><span>' + g.t + '</span></li>'; }).join('');
    return ok;
  }
  function accion() {
    if (C !== CFG) return;
    C.acts++;
    var ok = pintarMetas(), n = ok.filter(Boolean).length, tot = m.goals.length;
    if (C.acts >= 5 && n < tot) $('#cpi').style.display = 'block';
    if (C.acts >= 14 && n < tot && !C.fin) $('#cfin').style.display = 'block';
    if (n === tot && !C.fin) {
      C.fin = true; var fb = $('#f'); fb.className = 'fb ok';
      fb.innerHTML = '<b>¡Listo!</b> ' + (m.fin || 'Quedó todo bien configurado.');
      $('#cpi').style.display = 'none'; $('#cfin').style.display = 'none';
      done(tot, tot, 'configuró ' + tot + '/' + tot + (m._v ? ' (' + m._v + ')' : ''));
    }
  }
  $('#cpi').onclick = function () {
    var ok = metas(), k = ok.indexOf(false); if (k < 0) return;
    var fb = $('#f'); fb.className = 'fb info'; fb.innerHTML = '<b>Pista para «' + m.goals[k].t + '»:</b> ' + m.goals[k].ruta;
  };
  $('#cfin').onclick = function () {
    var ok = metas(), n = ok.filter(Boolean).length; C.fin = true;
    m.goals.forEach(function (g, k) { if (!ok[k]) S.rev.push({ m: m.title, t: g.t, ok: g.ruta, why: '' }); });
    var fb = $('#f'); fb.className = 'fb no'; fb.innerHTML = 'Entregaste con <b>' + n + ' de ' + m.goals.length + '</b> cosas hechas. Al final podés ver en qué te equivocaste.';
    $('#cfin').style.display = 'none'; $('#cpi').style.display = 'none';
    done(n, m.goals.length, 'configuró ' + n + '/' + m.goals.length + (m._v ? ' (' + m._v + ')' : '') + ' (entregó sin terminar)');
  };
  $('#crs').onclick = function () { var mm = m; TYPES.cfg(mm, z); };
  pintarMetas(); dibujar();
};
