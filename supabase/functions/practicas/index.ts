// Función «practicas» · Plataforma de prácticas del CFP N.º 403
// Comprueba al estudiante con la plataforma del CFP (proyecto PLATAFORMA EDUCATIVA)
// y recién ahí guarda o lee intentos en este proyecto (practicas-cfp403).
// IMPORTANTE: al desplegarla, desactivar «Verify JWT» (el ingreso lo valida esta función).

const CFP_URL = 'https://dxgqtdaexlegsaohdywx.supabase.co';
const CFP_CLAVE = 'sb_publishable_q3iliYP60gR5bP6vtTwoHA_8FWqg7iz'; // clave pública de la plataforma del CFP
// Cómo se reconoce cada trayecto de prácticas entre los trayectos del CFP (por nombre)
const PATRONES: Record<string, string> = {
  seguridad: 'seguridad inform',
  planillas: 'planillas de c',
  pensamiento: 'pensamiento comput',
};
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const resp = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const PROPIA_URL = Deno.env.get('SUPABASE_URL')!;
const PROPIA_SECRETA = Deno.env.get('CLAVE_SECRETA') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const propia = (path: string, init: RequestInit = {}) => {
  const h: Record<string, string> = { apikey: PROPIA_SECRETA, 'Content-Type': 'application/json' };
  if (PROPIA_SECRETA.startsWith('eyJ')) h.Authorization = 'Bearer ' + PROPIA_SECRETA;
  return fetch(PROPIA_URL + '/rest/v1/' + path, { ...init, headers: { ...h, ...(init.headers || {}) } });
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return resp(405, { error: 'Método no permitido' });
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const body = await req.json().catch(() => ({}));
    if (!token) return resp(401, { error: 'Falta ingresar' });

    // 1. ¿Quién es? (lo confirma la plataforma del CFP)
    const cfp = (path: string) => fetch(CFP_URL + path, { headers: { apikey: CFP_CLAVE, Authorization: 'Bearer ' + token } });
    const u = await cfp('/auth/v1/user');
    if (!u.ok) return resp(401, { error: 'La sesión venció. Volvé a ingresar.' });
    const user = await u.json();
    const perfiles = await (await cfp('/rest/v1/profiles?select=id,dni,nombre,apellido,rol,estado&id=eq.' + user.id)).json();
    const perfil = Array.isArray(perfiles) ? perfiles[0] : null;
    if (!perfil) return resp(403, { error: 'No encontramos tu perfil en la plataforma del CFP.' });
    const rol = String(perfil.rol || '').toLowerCase().trim();
    const esAdmin = rol === 'admin' || rol === 'administrador';
    if (!esAdmin && String(perfil.estado || 'ACTIVO').toUpperCase() !== 'ACTIVO')
      return resp(403, { error: 'Tu cuenta de la plataforma del CFP no está activa.' });

    // 2. ¿En qué trayectos está inscripto/a y confirmado/a? (inscripción ACTIVA)
    let habilitados: string[] = [];
    if (esAdmin) habilitados = Object.keys(PATRONES);
    else {
      const ins = await (await cfp('/rest/v1/inscripciones?select=trayecto_id&estado=eq.ACTIVA&estudiante_user=eq.' + encodeURIComponent(perfil.dni))).json();
      const ids = (Array.isArray(ins) ? ins : []).map((i: { trayecto_id: number }) => i.trayecto_id);
      if (ids.length) {
        const trs = await (await cfp('/rest/v1/trayectos?select=id,nombre&id=in.(' + ids.join(',') + ')')).json();
        const nombres = (Array.isArray(trs) ? trs : []).map((t: { nombre: string }) => String(t.nombre || '').toLowerCase());
        habilitados = Object.keys(PATRONES).filter((k) => nombres.some((n: string) => n.includes(PATRONES[k])));
      }
    }
    const nombre = [perfil.apellido, perfil.nombre].filter(Boolean).join(', ');

    if (body.accion === 'perfil')
      return resp(200, { nombre, apellido: perfil.apellido || '', dni4: String(perfil.dni || '').slice(-4), admin: esAdmin, trayectos: habilitados });

    if (body.accion === 'registrar') {
      const d = body.datos || {};
      if (!habilitados.includes(d.trayecto)) return resp(403, { error: 'No figurás inscripto/a en este trayecto.' });
      const practica = Number(d.practica), puntaje = Number(d.puntaje);
      if (!Number.isInteger(practica) || practica < 1 || practica > 100 || !Number.isInteger(puntaje) || puntaje < 0 || puntaje > 100)
        return resp(400, { error: 'Datos inválidos' });
      const fila = {
        trayecto: d.trayecto, practica, puntaje,
        estudiante_id: perfil.id, dni: String(perfil.dni || ''), estudiante: nombre,
        codigo_personal: String(d.codigo_personal || '').slice(0, 50), codigo: String(d.codigo || '').slice(0, 20),
        detalle: Array.isArray(d.detalle) ? d.detalle.slice(0, 10).map((x: unknown) => String(x).slice(0, 600)) : null,
      };
      const r = await propia('intentos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(fila) });
      if (!r.ok) return resp(500, { error: 'No se pudo guardar', detalle: await r.text() });
      return resp(200, { ok: true });
    }

    if (body.accion === 'mis_intentos') {
      // Los intentos del propio estudiante (para recuperar una nota hecha desde otro equipo)
      const r = await propia('intentos?select=trayecto,practica,puntaje,detalle,creado&dni=eq.' + encodeURIComponent(String(perfil.dni || '')) + '&order=creado.asc&limit=500');
      if (!r.ok) return resp(500, { error: 'No se pudieron leer tus intentos' });
      return resp(200, { intentos: await r.json() });
    }

    if (body.accion === 'listar') {
      if (!esAdmin) return resp(403, { error: 'Este panel es solo para la dirección.' });
      const r = await propia('intentos?select=*&order=creado.desc&limit=20000');
      if (!r.ok) return resp(500, { error: 'No se pudieron leer los intentos' });
      return resp(200, { intentos: await r.json() });
    }
    return resp(400, { error: 'Acción desconocida' });
  } catch (e) {
    return resp(500, { error: 'Error interno', detalle: String(e) });
  }
});
