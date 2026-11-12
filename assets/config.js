// Conexiones de la plataforma de prácticas.
// - Ingreso: con el usuario de la plataforma del CFP N.º 403 (mismo DNI/correo y contraseña).
// - Intentos: se guardan en el proyecto propio «practicas-cfp403», a través de la función «practicas»,
//   que comprueba antes que la persona esté inscripta y confirmada en el trayecto.
// Las claves de acá son públicas (están pensadas para ir en el navegador).
var CFP_URL = 'https://dxgqtdaexlegsaohdywx.supabase.co';
var CFP_CLAVE = 'sb_publishable_q3iliYP60gR5bP6vtTwoHA_8FWqg7iz';
var PRACTICAS_FUNCION = 'https://kejiwtpjixczomylnkzj.supabase.co/functions/v1/practicas';

var SES = null; // {token, refresh, exp, perfil:{nombre, apellido, dni4, admin, trayectos[]}}
try { SES = JSON.parse(localStorage.getItem('sesion-cfp') || 'null'); } catch (e) {}
function sesGuardar() { try { if (SES) localStorage.setItem('sesion-cfp', JSON.stringify(SES)); else localStorage.removeItem('sesion-cfp'); } catch (e) {} }

// Igual que en la plataforma del CFP: si escribe un DNI, se usa DNI@cfp403.ar
function identificadorAEmail(v) { v = String(v || '').trim().toLowerCase(); return v.indexOf('@') >= 0 ? v : v.replace(/\D/g, '') + '@cfp403.ar'; }

function authCFP(tipo, cuerpo) {
  return fetch(CFP_URL + '/auth/v1/token?grant_type=' + tipo, { method: 'POST', headers: { apikey: CFP_CLAVE, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error_description || j.msg || 'No se pudo ingresar'); return j; }); });
}
function tomarTokens(j) { SES = SES || {}; SES.token = j.access_token; SES.refresh = j.refresh_token; SES.exp = Date.now() + (j.expires_in || 3600) * 1000 - 60000; }
function tokenVigente() {
  if (!SES || !SES.refresh) return Promise.reject(new Error('sin sesión'));
  if (SES.exp > Date.now()) return Promise.resolve(SES.token);
  return authCFP('refresh_token', { refresh_token: SES.refresh }).then(function (j) { tomarTokens(j); sesGuardar(); return j.access_token; },
    function () { SES = null; sesGuardar(); throw new Error('La sesión venció. Volvé a ingresar.'); });
}
function funcion(accion, datos) {
  return tokenVigente().then(function (t) {
    return fetch(PRACTICAS_FUNCION, { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: accion, datos: datos }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || ('Error ' + r.status)); e.status = r.status; throw e; } return j; }); });
  });
}
// Ingresar con DNI o correo + contraseña de la plataforma del CFP
function ingresar(usuario, clave) {
  return authCFP('password', { email: identificadorAEmail(usuario), password: clave }).then(function (j) {
    tomarTokens(j); return funcion('perfil');
  }).then(function (p) { SES.perfil = p; sesGuardar(); return p; });
}
function actualizarPerfil() { return funcion('perfil').then(function (p) { SES.perfil = p; sesGuardar(); return p; }); }
function salir() { SES = null; sesGuardar(); }
// Guarda un intento al terminar una práctica
function guardarIntento(datos) { return funcion('registrar', datos).then(function () { return true; }, function () { return false; }); }
// Consulta el estado del intento con nota en la plataforma del CFP (primer intento, reintento, aprobada, etc.)
function estadoEnCFP(trayecto, practica) {
  return tokenVigente().then(function (t) {
    return fetch(CFP_URL + '/rest/v1/rpc/estado_practica', { method: 'POST', headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_trayecto: trayecto, p_practica: practica }) }).then(function (r) { return r.ok ? r.json() : { estado: 'error' }; });
  }).catch(function () { return { estado: 'error' }; });
}
// Carga la nota en la sábana de la plataforma del CFP (clase titulada «Práctica N»). Devuelve un estado.
function notaEnCFP(trayecto, practica, puntaje, detalle) {
  return tokenVigente().then(function (t) {
    return fetch(CFP_URL + '/rest/v1/rpc/registrar_nota_practica', { method: 'POST', headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_trayecto: trayecto, p_practica: practica, p_puntaje: puntaje, p_detalle: detalle || null }) })
      .then(function (r) { return r.ok ? r.json() : 'error'; });
  }).catch(function () { return 'error'; });
}
// Notas de MIS prácticas en la plataforma del CFP, todas en una consulta: {"3":{nota,evaluada,reintentos_usados},…}
function notasPracticasCFP(trayecto) {
  return tokenVigente().then(function (t) {
    return fetch(CFP_URL + '/rest/v1/rpc/notas_practicas', { method: 'POST', headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_trayecto: trayecto }) }).then(function (r) { return r.ok ? r.json() : null; });
  }).catch(function () { return null; });
}
// Mis intentos guardados en la base de prácticas (para recuperar una nota hecha en otro equipo)
function misIntentos() { return funcion('mis_intentos').then(function (j) { return j.intentos || []; }, function () { return null; }); }
function leerIntentos() { return funcion('listar').then(function (j) { return j.intentos || []; }); }

/* ---------- Qué prácticas están habilitadas (igual que en la plataforma del CFP) ----------
   Una práctica se habilita si en la plataforma del CFP existe la clase «Práctica N»,
   ya llegó su fecha de publicación y su módulo no está bloqueado por correlatividad
   (las reglas son las de la plataforma: ReglasFP). Si algo falla, no se bloquea nada:
   la base igual controla la nota. */
var PATRON_TRAYECTO = { seguridad: /seguridad inform/i, planillas: /planillas de c/i, pensamiento: /pensamiento comput/i };
var DISP = {};
function cfpGet(ruta) {
  return tokenVigente().then(function (t) {
    return fetch(CFP_URL + '/rest/v1/' + ruta, { headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + t } })
      .then(function (r) { if (!r.ok) throw new Error('Error ' + r.status); return r.json(); });
  });
}
function fechaPub(c) {
  if (c.fecha_publicacion) return String(c.fecha_publicacion).slice(0, 10);
  var m = String(c.descripcion || '').match(/Fecha de Publicaci[oó]n: (\d{2})\/(\d{2})\/(\d{4})/);
  return m ? m[3] + '-' + m[2] + '-' + m[1] : null;
}
function hoyAR() {
  var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function disponibilidad(tid) {
  if (!SES || !SES.perfil || SES.perfil.admin || !PATRON_TRAYECTO[tid]) return Promise.resolve(null);
  var c0 = DISP[tid]; if (c0 && Date.now() - c0.t < 60000) return Promise.resolve(c0.d);
  var dni, T, clases, mods;
  return tokenVigente().then(function (tk) {
    return fetch(CFP_URL + '/rest/v1/rpc/mi_dni', { method: 'POST', headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { if (!r.ok) throw new Error('sin dni'); return r.json(); });
  }).then(function (miDni) {
    if (!miDni) throw new Error('sin dni');
    return cfpGet('inscripciones?select=estudiante_user,estado,trayecto_id&estudiante_user=eq.' + encodeURIComponent(miDni));
  }).then(function (ins) {
    ins = (ins || []).filter(function (i) { return String(i.estado || '').toUpperCase() === 'ACTIVA'; });
    if (!ins.length) throw new Error('sin inscripción');
    return cfpGet('trayectos?select=*&id=in.(' + ins.map(function (i) { return i.trayecto_id; }).join(',') + ')').then(function (tr) {
      tr = (tr || []).filter(function (x) { return PATRON_TRAYECTO[tid].test(x.nombre || ''); })
        .sort(function (a, b) { return String(b.ciclo_lectivo || '').localeCompare(String(a.ciclo_lectivo || '')) || b.id - a.id; });
      if (!tr.length) throw new Error('sin trayecto');
      T = tr[0]; dni = String((ins.find(function (i) { return i.trayecto_id === T.id; }) || ins[0]).estudiante_user);
      return Promise.all([cfpGet('clases?select=*&trayecto_id=eq.' + T.id + '&order=id.asc'), cfpGet('modulos?select=*&trayecto_id=eq.' + T.id + '&order=id.asc')]);
    });
  }).then(function (r) {
    clases = r[0] || []; mods = r[1] || [];
    if (mods.length < 2 || typeof ReglasFP === 'undefined' || !clases.length) return null;
    var ids = clases.map(function (c) { return c.id; }).join(',');
    return Promise.all([
      cfpGet('entregas_actividades?select=*&clase_id=in.(' + ids + ')'),
      cfpGet('asistencias?select=estudiante_user,modulo_id,estado&trayecto_id=eq.' + T.id + '&estudiante_user=eq.' + encodeURIComponent(dni)),
      cfpGet('modulos_acreditados?select=*&trayecto_id=eq.' + T.id + '&estudiante_user=eq.' + encodeURIComponent(dni)).catch(function () { return []; }),
      cfpGet('excepciones_estudiantes?select=*&habilitado=eq.true&trayecto_id=eq.' + T.id + '&estudiante_user=eq.' + encodeURIComponent(dni)).catch(function () { return []; })
    ]).then(function (x) {
      return ReglasFP.evaluar({ key: dni, modulos: mods, clases: clases, entregas: x[0] || [], asistencias: x[1] || [], acreditados: x[2] || [],
        computaAsistencia: ReglasFP.computaAsistencia(T), excepcion: !!(x[3] && x[3].length) });
    });
  }).then(function (ev) {
    var hoy = hoyAR(), d = {}, t = TRAYECTOS[tid];
    Object.keys(t.practicas).forEach(function (n) {
      var re = new RegExp('^\\s*pr[aá]ctica\\s*0*' + n + '([^0-9]|$)', 'i');
      var c = clases.filter(function (x) { return !x.estudiante_user && x.calificable !== false && re.test(x.titulo || ''); }).pop();
      if (!c) { d[n] = { e: 'sin_clase' }; return; }
      var f = fechaPub(c);
      if (f && f > hoy) { d[n] = { e: 'no_publicada', f: f }; return; }
      var m = ev && ev.modulos.find(function (x) { return Number(x.id) === Number(c.modulo_id); });
      d[n] = m && m.bloqueado ? { e: 'modulo' } : { e: 'ok' };
    });
    DISP[tid] = { t: Date.now(), d: d }; return d;
  }).catch(function () { return null; });
}
function textoBloqueo(x) {
  if (!x || x.e === 'ok') return '';
  if (x.e === 'no_publicada') { var p = x.f.split('-'); return 'Se habilita el ' + p[2] + '/' + p[1]; }
  if (x.e === 'modulo') return 'Se habilita al aprobar el módulo anterior';
  return 'Todavía no está disponible';
}
