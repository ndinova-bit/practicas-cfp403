// Conexión con Supabase (proyecto propio de la plataforma de prácticas).
// Mientras URL y CLAVE estén vacías, no se guarda nada en internet y todo funciona igual.
var SUPABASE_URL = '';
var SUPABASE_CLAVE_PUBLICA = '';
function guardarIntento(datos){
  if(!SUPABASE_URL||!SUPABASE_CLAVE_PUBLICA) return;
  try{
    fetch(SUPABASE_URL+'/rest/v1/intentos',{method:'POST',headers:{'apikey':SUPABASE_CLAVE_PUBLICA,'Authorization':'Bearer '+SUPABASE_CLAVE_PUBLICA,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(datos)}).catch(function(){});
  }catch(e){}
}
