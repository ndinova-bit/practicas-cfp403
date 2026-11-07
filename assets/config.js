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
// Carga la nota en la sábana de la plataforma del CFP (clase titulada «Práctica N»). Devuelve un estado.
function notaEnCFP(trayecto, practica, puntaje, detalle) {
  return tokenVigente().then(function (t) {
    return fetch(CFP_URL + '/rest/v1/rpc/registrar_nota_practica', { method: 'POST', headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_trayecto: trayecto, p_practica: practica, p_puntaje: puntaje, p_detalle: detalle || null }) })
      .then(function (r) { return r.ok ? r.json() : 'error'; });
  }).catch(function () { return 'error'; });
}
function leerIntentos() { return funcion('listar').then(function (j) { return j.intentos || []; }); }
