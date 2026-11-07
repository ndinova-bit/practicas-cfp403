// Conexión con Supabase (proyecto propio de la plataforma de prácticas: practicas-cfp403).
// La clave publishable es pública: está pensada para ir en el navegador. La seguridad la dan las reglas (RLS) de la base.
var SUPABASE_URL = 'https://kejiwtpjixczomylnkzj.supabase.co';
var SUPABASE_CLAVE_PUBLICA = 'sb_publishable_UHMTlgI0BP9vVDYBDm6AcA_x9K2ROZR';

// Guarda un intento al terminar una práctica. Si falla (sin internet), la práctica sigue igual.
function guardarIntento(datos){
  if(!SUPABASE_URL||!SUPABASE_CLAVE_PUBLICA) return Promise.resolve(false);
  try{
    return fetch(SUPABASE_URL+'/rest/v1/intentos',{method:'POST',headers:{'apikey':SUPABASE_CLAVE_PUBLICA,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(datos)})
      .then(function(r){return r.ok}).catch(function(){return false});
  }catch(e){return Promise.resolve(false)}
}
// Ingreso de docentes (correo y contraseña creados en Supabase › Authentication › Users)
function ingresarDocente(correo,clave){
  return fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':SUPABASE_CLAVE_PUBLICA,'Content-Type':'application/json'},body:JSON.stringify({email:correo,password:clave})})
    .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error_description||j.msg||'No se pudo ingresar');return j})});
}
function renovarSesion(refresh){
  return fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':SUPABASE_CLAVE_PUBLICA,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refresh})})
    .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error('La sesión venció. Volvé a ingresar.');return j})});
}
function leerIntentos(token){
  return fetch(SUPABASE_URL+'/rest/v1/intentos?select=*&order=creado.desc&limit=10000',{headers:{'apikey':SUPABASE_CLAVE_PUBLICA,'Authorization':'Bearer '+token}})
    .then(function(r){if(r.status===401)throw new Error('La sesión venció. Volvé a ingresar.');if(!r.ok)throw new Error('No se pudieron leer los intentos ('+r.status+')');return r.json()});
}
