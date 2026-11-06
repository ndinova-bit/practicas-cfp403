var app=document.getElementById('app');
var S=null; // estado de la práctica en curso
function $(s,r){return (r||document).querySelector(s)}
function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var TN={navy:['#E6EDF6','#1F3A5F','#2C5282'],teal:['#E1F2F4','#1f6b77','#2A9AAB'],amber:['#FDF0DA','#B9771C','#E3A03A'],coral:['#FCE6E3','#B9483B','#E06A5B'],green:['#E2F3EA','#277A52','#3C9D6E'],violet:['#ECE8FA','#5B45A8','#7A62C9']};
function ic(n,t){var c=TN[t||'teal'];return (ICONS[n]||ICONS.check).split('{B}').join(c[0]).split('{D}').join(c[1]).split('{A}').join(c[2])}
function h4(str){var h=0x811c9dc5;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ('0000'+(h>>>0).toString(36).toUpperCase()).slice(-4);}
function mkCode(t,pid,per,score){return t.prefijo+pid+'-'+score+'-'+h4(per+'|'+pid+'|'+score+'|'+t.sal);}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||'null');localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
var ROM=['','I','II','III','IV','V','VI','VII','VIII'];
var TONOS=['navy','teal','violet','coral','green','amber'];
var TRAYECTOS={};var ORDEN=[];
function registrarTrayecto(t){TRAYECTOS[t.id]=t;ORDEN.push(t.id)}
function goHome(){location.hash='#/'}
function render(){
  var h=location.hash.replace(/^#\/?/,'');
  if(h==='docente')return teacher();
  var parts=h.split('/');var t=TRAYECTOS[parts[0]];
  if(t&&parts[1]&&t.practicas[+parts[1]])return startPractice(t.id,+parts[1]);
  if(t)return homeTrayecto(t);
  homeGeneral();
}
window.addEventListener('hashchange',render);
function header(t,s){S=null;$('#homeBtn').style.display=t?'inline-block':'none';$('#homeBtn').onclick=goHome;$('#hT').textContent=t||'Prácticas · CFP N.º 403';$('#hS').textContent=s||'Plataforma de prácticas virtuales';$('#steps').innerHTML=''}
function homeGeneral(){header();
  var h='<section class="screen"><div class="intro-ic">'+ic('medal','teal')+'</div><h1 style="text-align:center">Plataforma de prácticas</h1><p class="lead" style="text-align:center">Elegí el trayecto que estás cursando.</p>';
  ORDEN.forEach(function(id){var t=TRAYECTOS[id],n=Object.keys(t.practicas).length;
    h+='<button class="tcard"'+(n?' onclick="location.hash=\'#/'+id+'\'"':' disabled')+'>'+ic(t.icono,t.tono)+'<span><b>'+esc(t.nombre)+'</b><br><span class="hint">'+(n?n+' prácticas':'Próximamente')+'</span></span>'+(n?'':'<span class="soon">Pronto</span>')+'</button>'});
  h+='<div class="teacher-link">CFP N.º 403 «Oscar Smith» · Luján</div></section>';app.innerHTML=h;window.scrollTo(0,0)}
function homeTrayecto(t){header(t.nombre,'Prácticas del trayecto');
  var done=store('hechas-'+t.id)||{};var mods=Object.keys(t.modulos).map(Number).sort(function(a,b){return a-b});
  var h='<section class="screen"><div class="intro-ic">'+ic(t.icono,t.tono)+'</div><h1 style="text-align:center">'+esc(t.nombre)+'</h1><p class="lead" style="text-align:center">Elegí la práctica que te indica la clase que estás haciendo.</p>';
  if(mods.length>1){h+='<h3>Tus insignias</h3><div class="badges">';
    mods.forEach(function(mo,i){var all=true,any=false;for(var k in t.practicas){if(t.practicas[k].mod===mo){any=true;if(!(done[k]>=70))all=false}}
      h+='<div class="badge'+(any&&all?' on':'')+'">'+ic(t.iconosModulo&&t.iconosModulo[mo]||'medal',TONOS[i%TONOS.length])+'Módulo '+ROM[mo]+'</div>'});
    h+='</div><p class="hint">Ganás la insignia de un módulo cuando sacás 70 o más en todas sus prácticas. Se guardan en este navegador.</p>'}
  mods.forEach(function(mo,i){var col=TN[TONOS[i%TONOS.length]][2];h+='<h3>Módulo '+ROM[mo]+' · '+esc(t.modulos[mo])+'</h3><div class="plist">';
    Object.keys(t.practicas).map(Number).sort(function(a,b){return a-b}).forEach(function(id){var p=t.practicas[id];if(p.mod!==mo)return;
      h+='<button class="pitem" onclick="location.hash=\'#/'+t.id+'/'+id+'\'"><span class="num" style="background:'+col+'">'+id+'</span><span><b>'+esc(p.title)+'</b><br><span class="hint">Clase '+id+'</span></span>'+(done[id]!=null?'<span class="st">'+done[id]+'/100</span>':'')+'</button>'});h+='</div>'});
  h+='<div class="teacher-link">CFP N.º 403 «Oscar Smith» · Luján</div></section>';app.innerHTML=h;window.scrollTo(0,0)}

/* ---------------- PRÁCTICA ---------------- */
function startPractice(tid,id){
  var t=TRAYECTOS[tid],p=t.practicas[id];S={t:t,id:id,p:p,per:store('per')||'',mi:-1,pts:[],max:[],log:[]};
  $('#homeBtn').style.display='inline-block';$('#homeBtn').onclick=function(){location.hash='#/'+tid};$('#hT').textContent='Práctica '+id+' · '+p.title;$('#hS').textContent=t.nombre+' · Módulo '+ROM[p.mod]+' · Clase '+id;
  steps();
  app.innerHTML='<section class="screen"><div class="intro-ic">'+ic(p.icon,p.tone)+'</div><span class="tag">Práctica '+id+'</span><h1>'+esc(p.title)+'</h1><p class="lead">'+p.intro+'</p>'+
  '<div class="card"><b>Tu código personal</b><p class="hint">Tu apellido y las últimas 4 cifras de tu DNI, todo junto. Ejemplo: <b>GOMEZ1234</b>. Es el mismo que usás en la plataforma.</p>'+
  '<input type="text" id="per" autocomplete="off" placeholder="APELLIDO1234" style="text-transform:uppercase" value="'+esc(S.per)+'"><div class="err" id="e0"></div><button class="btn" id="go">Empezar</button></div>'+
  '<p class="hint">'+p.missions.length+' misiones · unos '+(p.mins||35)+' minutos · funciona en el celular y en la compu. Si te equivocás, te explica y seguís.</p></section>';
  $('#go').onclick=function(){var v=$('#per').value.trim().toUpperCase().replace(/\s+/g,'');
    if(!/^[A-ZÁÉÍÓÚÑÜ]{2,}\d{4}$/.test(v)){$('#e0').textContent='Revisalo: tu apellido y 4 números, sin espacios. Ejemplo: GOMEZ1234';return}
    S.per=v;store('per',v);next();};
  window.scrollTo(0,0);
}
function steps(){var h='';for(var i=0;i<S.p.missions.length;i++)h+='<i class="'+(i<S.mi?'done':(i===S.mi?'on':''))+'"></i>';$('#steps').innerHTML=h}
function next(){S.mi++;steps();window.scrollTo(0,0);if(S.mi>=S.p.missions.length)return finish();var m=S.p.missions[S.mi];
  var wrap='<section class="screen"><span class="tag">Misión '+(S.mi+1)+' de '+S.p.missions.length+'</span><h2>'+esc(m.title)+'</h2><p class="lead">'+m.lead+'</p><div id="mz"></div><button class="btn" id="nx" style="display:none">'+(S.mi+1<S.p.missions.length?'Siguiente misión':'Ver mi resultado')+'</button></section>';
  app.innerHTML=wrap;$('#nx').onclick=next;TYPES[m.type](m,$('#mz'));}
function done(pts,max,log){S.pts[S.mi]=pts;S.max[S.mi]=max;S.log[S.mi]=log;$('#nx').style.display='block';}

var TYPES={};
/* --- QUIZ --- */
TYPES.quiz=function(m,z){var i=0,first,score=0,log=[];
  function show(){var it=m.items[i];first=true;
    var opts=it.opts.map(function(o,k){return '<button data-k="'+k+'">'+o+'</button>'}).join('');
    z.innerHTML='<div class="card"><div class="counter">'+(i+1)+' de '+m.items.length+'</div><div class="bar"><b style="width:'+(i/m.items.length*100)+'%"></b></div>'+
    (it.ctx?'<div class="hint" style="margin-bottom:6px">'+it.ctx+'</div>':'')+(it.mock?it.mock:'')+'<div class="q">'+it.q+'</div><div class="opts'+(m.row?' row':'')+'">'+opts+'</div><div class="fb" id="f"></div><button class="btn" id="qn" style="display:none">Seguir</button></div>';
    z.querySelectorAll('.opts button').forEach(function(b){b.onclick=function(){var k=+b.dataset.k,f=$('#f');
      if(k===it.a){b.className='right';if(first)score++;log.push((i+1)+(first?'✓':'✗'));f.className='fb ok';f.innerHTML='<b>¡Bien!</b> '+it.why;
        z.querySelectorAll('.opts button').forEach(function(x){x.disabled=true});$('#qn').style.display='block';}
      else{b.className='wrong';b.disabled=true;first=false;f.className='fb no';f.innerHTML=(it.hint||'No es esa. Leé de nuevo y probá otra.');}}});
    $('#qn').onclick=function(){i++;if(i<m.items.length)show();else{z.innerHTML='<div class="fb ok">Terminaste: '+score+' de '+m.items.length+' al primer intento.</div>';done(score,m.items.length,'aciertos '+score+'/'+m.items.length+' ('+log.join(' ')+')')}};}
  show();};
/* --- SORT --- */
TYPES.sort=function(m,z){var sel=null,left=m.items.length,score=0,tried={};
  z.innerHTML='<div class="card"><div class="hint">Tocá una tarjeta y después la caja donde va.</div><div id="chips" style="margin-top:8px"></div><div class="bins" style="grid-template-columns:repeat('+Math.min(m.bins.length,3)+',1fr)">'+
  m.bins.map(function(b,k){return '<div class="bin" data-b="'+k+'"><h4>'+b+'</h4><div></div></div>'}).join('')+'</div><div class="fb" id="f"></div></div>';
  shuffle(m.items.map(function(x,k){return k})).forEach(function(k){var c=el('<span class="chip">'+m.items[k][0]+'</span>');c.dataset.k=k;c.onclick=function(){z.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});c.classList.add('sel');sel=c};$('#chips').appendChild(c)});
  z.querySelectorAll('.bin').forEach(function(bn){bn.onclick=function(){if(!sel)return;var k=+sel.dataset.k,b=+bn.dataset.b,f=$('#f'),it=m.items[k];
    if(it[1]===b){if(!tried[k])score++;bn.querySelector('div').appendChild(el('<div class="it">'+it[0]+'</div>'));sel.remove();sel=null;left--;f.className='fb ok';f.innerHTML='<b>¡Sí!</b> '+(it[2]||'Va en «'+m.bins[b]+'».');
      if(!left){f.innerHTML='<b>¡Todo ordenado!</b> '+(m.end||'');done(score,m.items.length,'al primer intento '+score+'/'+m.items.length)}}
    else{tried[k]=1;f.className='fb no';f.innerHTML=m.hint||'Esa no es su caja. Probá otra.'}}});};
/* --- SPOT (texto clickeable en una pantalla simulada) --- */
TYPES.spot=function(m,z){var need=m.need,found=0,miss=0,got={};
  z.innerHTML='<div class="mock'+(m.dark?' dark':'')+'"><div class="bar2"><i style="background:#E06A5B"></i><i style="background:#E3A03A"></i><i style="background:#3C9D6E"></i>&nbsp;'+esc(m.win||'')+'</div><div class="body">'+m.html+'</div></div>'+
  '<div class="card"><div class="counter" id="c">Encontrados: 0 de '+need+'</div><div class="fb" id="f"></div><ul class="found-list" id="fl"></ul><button class="btn alt" id="rv" style="display:none">No encuentro los que faltan: mostrámelos</button></div>';
  z.querySelectorAll('.sp').forEach(function(s,ix){s.onclick=function(){var f=$('#f');
    if(s.dataset.ok){if(got[ix])return;got[ix]=1;found++;s.classList.add('found');f.className='fb ok';f.textContent='¡Encontraste uno!';$('#fl').appendChild(el('<li>'+s.dataset.ok+'</li>'));
      $('#c').textContent='Encontrados: '+found+' de '+need;if(found>=need){f.innerHTML='<b>¡Los encontraste todos!</b> '+(m.end||'');$('#rv').style.display='none';done(need,need,'encontró '+need+'/'+need+(miss?' ('+miss+' toques de más)':''))}}
    else{miss++;s.classList.add('miss');setTimeout(function(){s.classList.remove('miss')},900);f.className='fb no';f.innerHTML=s.dataset.no||'Eso está bien. Seguí buscando.';if(miss>=3&&found<need)$('#rv').style.display='block'}}});
  $('#rv').onclick=function(){z.querySelectorAll('.sp').forEach(function(s,ix){if(s.dataset.ok&&!got[ix]){got[ix]=1;s.classList.add('found');$('#fl').appendChild(el('<li>'+s.dataset.ok+'</li>'))}});
    $('#rv').style.display='none';$('#c').textContent='Encontrados por vos: '+found+' de '+need;done(found,need,'encontró '+found+'/'+need+' (pidió ayuda)')};};
/* --- TILES (buscar los riesgosos entre tarjetas con ícono) --- */
TYPES.tiles=function(m,z){var need=m.items.filter(function(x){return x[2]}).length,found=0,miss=0,got={};
  z.innerHTML='<div class="tiles">'+shuffle(m.items.map(function(x,k){return k})).map(function(k){var it=m.items[k];return '<button class="tile" data-k="'+k+'">'+ic(it[0],'navy')+'<span>'+it[1]+'</span></button>'}).join('')+'</div>'+
  '<div class="card"><div class="counter" id="c">Encontrados: 0 de '+need+'</div><div class="fb" id="f"></div><ul class="found-list" id="fl"></ul><button class="btn alt" id="rv" style="display:none">No encuentro los que faltan: mostrámelos</button></div>';
  z.querySelectorAll('.tile').forEach(function(t){t.onclick=function(){var k=+t.dataset.k,it=m.items[k],f=$('#f');
    if(it[2]){if(got[k])return;got[k]=1;found++;t.classList.add('found');f.className='fb ok';f.textContent='¡Encontraste uno!';$('#fl').appendChild(el('<li><b>'+it[1]+'.</b> '+it[3]+'</li>'));$('#c').textContent='Encontrados: '+found+' de '+need;
      if(found>=need){f.innerHTML='<b>¡Los encontraste todos!</b> '+(m.end||'');$('#rv').style.display='none';done(need,need,'encontró '+need+'/'+need)}}
    else{miss++;t.classList.add('miss');setTimeout(function(){t.classList.remove('miss')},900);f.className='fb no';f.innerHTML=it[3]||'Eso está bien.';if(miss>=3&&found<need)$('#rv').style.display='block'}}});
  $('#rv').onclick=function(){m.items.forEach(function(it,k){if(it[2]&&!got[k]){got[k]=1;$('.tile[data-k="'+k+'"]').classList.add('found');$('#fl').appendChild(el('<li><b>'+it[1]+'.</b> '+it[3]+'</li>'))}});$('#rv').style.display='none';done(found,need,'encontró '+found+'/'+need+' (pidió ayuda)')};};
/* --- ORDER --- */
TYPES.order=function(m,z){var picked=[],tries=0;
  function draw(){var ord=shuffle(m.steps.map(function(x,k){return k}));picked=[];
    z.innerHTML='<div class="card"><div class="hint">Tocá los pasos en el orden correcto. Si te equivocás, se reinicia.</div><div class="ord">'+ord.map(function(k){return '<button data-k="'+k+'"><b></b><span>'+m.steps[k]+'</span></button>'}).join('')+'</div><div class="fb" id="f"></div></div>';
    z.querySelectorAll('.ord button').forEach(function(b){b.onclick=function(){if(b.classList.contains('picked'))return;var k=+b.dataset.k,f=$('#f');
      if(k===picked.length){picked.push(k);b.classList.add('picked');b.querySelector('b').textContent=picked.length;
        if(picked.length===m.steps.length){f.className='fb ok';f.innerHTML='<b>¡Orden perfecto!</b> '+(m.why||'');done(tries===0?1:(tries===1?0.5:0),1,tries===0?'al primer intento':'con '+tries+' reintentos')}}
      else{tries++;f.className='fb no';f.innerHTML=(m.hint||'Ese no va ahí.')+' Volvé a empezar.';setTimeout(draw,1300)}}});}
  draw();};
/* --- LIST (inventario / plan personal: completar, no tiene error) --- */
TYPES.list=function(m,z){var items=[];
  z.innerHTML='<div class="card"><div id="sg"></div><input type="text" id="cu" placeholder="'+(m.ph||'Otra (escribila)')+'" style="margin-top:8px"><button class="btn alt" id="ad">Agregar</button></div><div class="inv" id="iv"></div><div class="err" id="er"></div><button class="btn" id="ok">Listo</button>';
  m.sug.forEach(function(s){var c=el('<span class="chip">+ '+s+'</span>');c.onclick=function(){add(s);c.remove()};$('#sg').appendChild(c)});
  $('#ad').onclick=function(){var v=$('#cu').value.trim();if(v){add(v.slice(0,50));$('#cu').value=''}};
  function add(n){if(items.length>=(m.max||6)){$('#er').textContent='Con '+(m.max||6)+' alcanza.';return}items.push({n:n,a:{}});draw()}
  function draw(){var iv=$('#iv');iv.innerHTML='';items.forEach(function(it,ix){var d=el('<div class="invitem"><div class="n">'+esc(it.n)+' <a href="#" style="float:right;font-size:13px;color:#E06A5B">quitar</a></div></div>');
    m.qs.forEach(function(q,qi){d.appendChild(el('<div class="hint">'+q[0]+'</div>'));var sg=el('<div class="seg"></div>');q[1].forEach(function(o,oi){var b=el('<button'+(it.a[qi]===oi?' class="on"':'')+'>'+o+'</button>');b.onclick=function(){it.a[qi]=oi;draw()};sg.appendChild(b)});d.appendChild(sg)});
    d.querySelector('a').onclick=function(e){e.preventDefault();items.splice(ix,1);draw()};iv.appendChild(d)});$('#er').textContent=''}
  $('#ok').onclick=function(){if(items.length<(m.min||3)){$('#er').textContent='Agregá al menos '+(m.min||3)+'.';return}
    if(items.some(function(it){return m.qs.some(function(q,qi){return it.a[qi]==null})})){$('#er').textContent='Te falta responder alguna pregunta.';return}
    var lines=items.map(function(it){return '- '+it.n+': '+m.qs.map(function(q,qi){return q[2]+' '+q[1][it.a[qi]].toLowerCase()}).join(' · ')});
    $('#ok').style.display='none';z.querySelectorAll('button,input').forEach(function(b){b.disabled=true});done(1,1,'\n'+lines.join('\n'));$('#nx').click();};};
/* --- CHECK (acciones reales en tu dispositivo, autodeclaradas) --- */
TYPES.check=function(m,z){var st={};
  z.innerHTML='<div class="card">'+m.items.map(function(t,k){return '<div class="task" data-k="'+k+'"><i></i><span>'+t+'</span></div>'}).join('')+'<div class="hint" style="margin-top:10px">Tocá cada tarea cuando la hayas hecho en tu celular o tu compu. Si alguna no la pudiste hacer, dejala sin marcar y contalo en la actividad.</div></div><button class="btn" id="ok">Listo</button>';
  z.querySelectorAll('.task').forEach(function(t){t.onclick=function(){var k=+t.dataset.k;st[k]=!st[k];t.classList.toggle('done',st[k])}});
  $('#ok').onclick=function(){var n=Object.keys(st).filter(function(k){return st[k]}).length;var lst=m.items.map(function(t,k){return (st[k]?'[hecho] ':'[pendiente] ')+t.replace(/<[^>]+>/g,'')});
    $('#ok').style.display='none';done(n>=(m.min||1)?1:n/(m.min||1),1,'\n'+lst.join('\n'));$('#nx').click()};};
/* --- TERMINAL simulada --- */
TYPES.term=function(m,z){var doneT={},cnt=0;
  z.innerHTML='<div class="card">'+m.tasks.map(function(t,k){return '<div class="task" id="tk'+k+'"><i></i><span>'+t[0]+'</span></div>'}).join('')+'</div><div class="term" id="tm"><span class="o">'+esc(m.banner||'Terminal de práctica. Escribí un comando y apretá Enter.')+'\n</span></div>'+
  '<div class="termin"><input type="text" id="ci" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="escribí acá el comando"><button id="cb">Enter</button></div><div class="hint">Es una simulación: nada de esto toca tu equipo. ¿No sabés qué escribir? Leé la tarea de nuevo: el comando está en negrita.</div>';
  function out(t,c){$('#tm').appendChild(el('<span class="'+c+'">'+esc(t)+'\n</span>'));$('#tm').scrollTop=1e6}
  function run(){var v=$('#ci').value.trim();if(!v)return;$('#ci').value='';out((m.prompt||'C:\\Users\\vos> ')+v,'c');var lv=v.toLowerCase().replace(/\s+/g,' ');
    var hit=null;for(var k in m.cmds){if(new RegExp('^'+k+'$','i').test(lv)){hit=m.cmds[k];break}}
    if(!hit){out(m.unknown||'"'+v.split(' ')[0]+'" no se reconoce como un comando. Revisá cómo lo escribiste.','r');return}
    hit[0].forEach(function(l){out(l[1],l[0])});if(hit[1]!=null&&!doneT[hit[1]]){doneT[hit[1]]=1;cnt++;$('#tk'+hit[1]).classList.add('done');
      if(cnt>=m.tasks.length){out('*** ¡Completaste todas las tareas! ***','g');done(m.tasks.length,m.tasks.length,'tareas '+cnt+'/'+m.tasks.length)}}}
  $('#cb').onclick=run;$('#ci').onkeydown=function(e){if(e.key==='Enter')run()};};
/* --- HASH real --- */
TYPES.hash=function(m,z){var stage=0;
  z.innerHTML='<div class="card"><b>Escribí un texto</b><input type="text" id="ht" value="hola"><div class="hint" style="margin-top:8px">Huella SHA-256:</div><div class="mono" id="hv"></div></div><div class="card">'+m.tasks.map(function(t,k){return '<div class="task" id="tk'+k+'"><i></i><span>'+t[0]+'</span></div>'}).join('')+'<div class="fb" id="f"></div></div>';
  var seen={};
  function upd(){var t=$('#ht').value;sha(t).then(function(h){$('#hv').textContent=h.match(/.{1,8}/g).join(' ');seen[t]=h;check(t,h)})}
  function check(t,h){m.tasks.forEach(function(tk,k){if($('#tk'+k).classList.contains('done'))return;if(new Function('t','h','seen',tk[1])(t,h,seen)){$('#tk'+k).classList.add('done');$('#f').className='fb ok';$('#f').innerHTML=tk[2];}});
    if(z.querySelectorAll('.task.done').length===m.tasks.length&&!stage){stage=1;done(m.tasks.length,m.tasks.length,'tareas '+m.tasks.length+'/'+m.tasks.length)}}
  $('#ht').oninput=upd;upd();};
function sha(t){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')})}
/* --- CIFRADO real (AES-GCM con clave derivada) --- */
TYPES.cipher=function(m,z){var cnt=0,doneT={};
  z.innerHTML='<div class="card"><b>1. Cifrá un mensaje</b><input type="text" id="cm" placeholder="Escribí un mensaje" style="margin-top:6px"><input type="text" id="ck" placeholder="Elegí una contraseña" style="margin-top:6px"><button class="btn" id="cb1">Cifrar</button><div class="mono" id="co" style="display:none"></div></div>'+
  '<div class="card"><b>2. Descifrá el mensaje que te dejó Marta</b><div class="mono">'+m.secret+'</div><div class="hint">Pista: '+m.clue+'</div><input type="text" id="dk" placeholder="Contraseña" style="margin-top:6px"><button class="btn" id="cb2">Descifrar</button><div class="fb" id="df"></div></div>';
  function key(p,s){return crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveKey']).then(function(k){return crypto.subtle.deriveKey({name:'PBKDF2',salt:new TextEncoder().encode(s),iterations:50000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])})}
  $('#cb1').onclick=function(){var t=$('#cm').value,p=$('#ck').value;if(!t||!p)return;var iv=crypto.getRandomValues(new Uint8Array(12));key(p,'lab').then(function(k){return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,new TextEncoder().encode(t))}).then(function(c){
    var all=new Uint8Array(12+c.byteLength);all.set(iv);all.set(new Uint8Array(c),12);$('#co').style.display='block';$('#co').textContent=btoa(String.fromCharCode.apply(null,all));if(!doneT[0]){doneT[0]=1;cnt++;fin()}})};
  $('#cb2').onclick=function(){var p=$('#dk').value.trim().toLowerCase();var raw=Uint8Array.from(atob(m.secret),function(c){return c.charCodeAt(0)});
    key(p,'lab').then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:raw.slice(0,12)},k,raw.slice(12))}).then(function(d){$('#df').className='fb ok';$('#df').innerHTML='<b>¡Lo abriste!</b> El mensaje dice: «'+esc(new TextDecoder().decode(d))+'». '+m.after;if(!doneT[1]){doneT[1]=1;cnt++;fin()}},
    function(){$('#df').className='fb no';$('#df').innerHTML='Contraseña incorrecta: el mensaje sigue cerrado. Con la clave equivocada no hay forma de leerlo. Probá de nuevo.'})};
  function fin(){if(cnt===2)done(2,2,'cifró un mensaje propio y descifró el de Marta')}};
/* --- CONTRASEÑA: medidor (no se guarda) --- */
TYPES.pwd=function(m,z){var ok=false;
  z.innerHTML='<div class="card"><b>Armá una frase de contraseña de práctica</b><p class="hint">No uses una contraseña real tuya. Es solo para probar. No se guarda ni se envía.</p><input type="text" id="pw" autocomplete="off" placeholder="ej.: mate frío en la plaza de olivera"><div class="meter"><b id="mb"></b></div><div id="ml" class="counter"></div><div style="margin-top:8px">'+
  m.rules.map(function(r,k){return '<div class="task" id="r'+k+'"><i></i><span>'+r[0]+'</span></div>'}).join('')+'</div><div class="fb" id="f"></div></div>';
  $('#pw').oninput=function(){var p=$('#pw').value,n=0;m.rules.forEach(function(r,k){var g=new Function('p',r[1])(p);$('#r'+k).classList.toggle('done',g);if(g)n++});
    var pc=n/m.rules.length*100;$('#mb').style.width=pc+'%';$('#mb').style.background=pc<50?'#E06A5B':(pc<100?'#E3A03A':'#3C9D6E');$('#ml').textContent=pc<50?'Floja':(pc<100?'Mejorando':'¡Fuerte!');
    if(n===m.rules.length&&!ok){ok=true;$('#f').className='fb ok';$('#f').innerHTML='<b>¡Excelente!</b> '+m.end;done(1,1,'armó una frase que cumple las '+m.rules.length+' reglas')}};};
/* --- 2FA simulado --- */
TYPES.otp=function(m,z){var code='',t=30,timer,stage=0;
  z.innerHTML='<div class="cmp"><div class="pane"><h5>Página de tu correo</h5><div id="ls"><input type="text" id="u" placeholder="usuario" value="ana.gomez"><input type="password" id="p" placeholder="contraseña" style="margin-top:6px"><button class="btn" id="lb">Entrar</button></div></div>'+
  '<div class="pane"><h5>Tu celular</h5><div id="ph" class="hint">Sin notificaciones.</div></div></div><div class="fb" id="f"></div>';
  function gen(){code=String(Math.floor(100000+Math.random()*900000));t=30;$('#ph').innerHTML='<b>Autenticador</b><div class="code" style="font-size:30px">'+code.slice(0,3)+' '+code.slice(3)+'</div><div class="hint" id="tt">Vence en 30 s</div>';
    clearInterval(timer);timer=setInterval(function(){t--;var e=$('#tt');if(!e){clearInterval(timer);return}e.textContent='Vence en '+t+' s';if(t<=0)gen()},1000)}
  $('#lb').onclick=function(){if(!$('#p').value){$('#f').className='fb no';$('#f').textContent='Escribí cualquier contraseña de práctica.';return}
    if(stage===0){stage=1;$('#ls').innerHTML='<p style="margin:0 0 6px"><b>Paso 2 de 2</b><br>Escribí el código de 6 números que aparece en tu celular.</p><input type="text" id="oc" inputmode="numeric" placeholder="000000"><button class="btn" id="vb">Verificar</button>';gen();
      $('#f').className='fb info';$('#f').innerHTML='¿Viste? Con la contraseña sola no alcanza: ahora te pide algo que <b>tenés</b> en la mano.';
      $('#vb').onclick=function(){var v=$('#oc').value.replace(/\s/g,'');if(v===code){clearInterval(timer);$('#ls').innerHTML='<div class="fb ok" style="display:block">Entraste a tu correo.</div>';$('#f').className='fb ok';$('#f').innerHTML='<b>¡Listo!</b> '+m.end;done(1,1,'completó un ingreso con verificación en dos pasos')}
        else{$('#f').className='fb no';$('#f').textContent='Código incorrecto o vencido. Mirá el celular y copiá el que está ahora.'}}}};};
/* --- XSS: comentario inseguro vs seguro (no ejecuta scripts) --- */
TYPES.xss=function(m,z){var cnt=0,doneT={};
  z.innerHTML='<div class="card"><b>Dejá un comentario en el blog de la panadería</b><input type="text" id="xi" placeholder="Escribí un comentario"><button class="btn" id="xb">Publicar</button>'+
  '<div class="hint" style="margin-top:8px">'+m.tip+'</div></div><div class="cmp"><div class="pane"><h5>Página insegura</h5><div id="xa"></div></div><div class="pane"><h5>Página segura</h5><div id="xs"></div></div></div><div class="card">'+
  m.tasks.map(function(t,k){return '<div class="task" id="tk'+k+'"><i></i><span>'+t[0]+'</span></div>'}).join('')+'</div><div class="fb" id="f"></div>';
  $('#xb').onclick=function(){var v=$('#xi').value;if(!v)return;
    var safeTags=v.replace(/<(\/?)(b|i|u|mark|h1|h2|s|big|small)\s*>/gi,'\u0001$1$2\u0002');var hasScript=/<\s*script|on\w+\s*=|javascript:|<\s*img|<\s*iframe/i.test(v);
    var shown=esc(safeTags).replace(/\u0001(\/?)(\w+)\u0002/g,'<$1$2>');
    $('#xa').innerHTML=hasScript?'<div class="fb no" style="display:block">⚠ Acá la página insegura <b>ejecutaría ese código</b> en la compu de cada persona que lea el comentario. (En este laboratorio no se ejecuta.)</div>':shown;
    $('#xs').textContent=v;var f=$('#f');
    m.tasks.forEach(function(t,k){if(!doneT[k]&&new RegExp(t[1],'i').test(v)){doneT[k]=1;cnt++;$('#tk'+k).classList.add('done');f.className='fb ok';f.innerHTML=t[2]}});
    if(cnt===m.tasks.length)done(cnt,cnt,'tareas '+cnt+'/'+cnt)};};
/* --- SQLi: ver cómo se arma la consulta (conceptual) --- */
TYPES.sqli=function(m,z){var cnt=0,doneT={};
  z.innerHTML='<div class="card"><b>Inicio de sesión del sistema de pedidos</b><input type="text" id="su" placeholder="Usuario" style="margin-top:6px"><button class="btn" id="sb">Probar</button></div>'+
  '<div class="card"><div class="hint">Así arma la consulta un sistema <b>inseguro</b> (pega el texto tal cual):</div><div class="mono" id="sq"></div><div class="hint" style="margin-top:10px">Así la arma un sistema <b>seguro</b> (el dato va aparte, nunca se mezcla con la orden):</div><div class="mono" id="sp"></div><div class="fb" id="f"></div></div><div class="card">'+
  m.tasks.map(function(t,k){return '<div class="task" id="tk'+k+'"><i></i><span>'+t[0]+'</span></div>'}).join('')+'</div>';
  $('#sb').onclick=function(){var v=$('#su').value;$('#sq').textContent="BUSCAR usuarios DONDE nombre = '"+v+"'";$('#sp').textContent="BUSCAR usuarios DONDE nombre = [dato 1]     dato 1 → "+JSON.stringify(v);
    var f=$('#f');var broke=(v.split("'").length-1)%2===1;var tricky=/'\s*(or|o)\s/i.test(v);
    f.className=tricky?'fb no':(broke?'fb info':'fb ok');f.innerHTML=tricky?m.msgTrick:(broke?m.msgQuote:m.msgOk);
    m.tasks.forEach(function(t,k){if(!doneT[k]&&new RegExp(t[1],'i').test(v)){doneT[k]=1;cnt++;$('#tk'+k).classList.add('done')}});if(cnt===m.tasks.length)done(cnt,cnt,'tareas '+cnt+'/'+cnt)};};

/* ---------------- FINAL ---------------- */
function finish(){var p=S.p,tot=0,pts=0;S.max.forEach(function(x,i){tot+=x;pts+=S.pts[i]});var score=Math.round(pts/tot*100);var code=mkCode(S.t,S.id,S.per,score);
  var dk='hechas-'+S.t.id,d=store(dk)||{};if(d[S.id]==null||score>d[S.id])d[S.id]=score;store(dk,d);var gp=guardarIntento({trayecto:S.t.id,practica:S.id,codigo_personal:S.per,puntaje:score,codigo:code,detalle:S.log});
  $('#steps').innerHTML=p.missions.map(function(){return '<i class="done"></i>'}).join('');
  var t=S.t.nombre.toUpperCase()+'\nPRÁCTICA '+S.id+' · '+p.title.toUpperCase()+'\nCódigo personal: '+S.per+'\nCódigo de práctica: '+code+'\nPuntaje: '+score+'/100\n';
  p.missions.forEach(function(m,i){t+='Misión '+(i+1)+' ('+m.title+'): '+S.log[i]+'\n'});
  app.innerHTML='<section class="screen"><div class="intro-ic">'+ic('medal',score>=70?'green':'amber')+'</div><h1 style="text-align:center">'+(score>=70?'¡Práctica cumplida!':'¡Casi!')+'</h1><div class="big">'+score+' / 100</div>'+
  '<p class="lead" style="text-align:center">'+(score>=70?'Muy bien. Ahora pasá a la Actividad '+S.id+'.':'Para la actividad necesitás 70 o más. Volvé a intentarlo: ya conocés las respuestas.')+'</p>'+
  '<div class="card"><b>Paso 1 · Copiá tu resumen</b><p class="hint">Incluye tu código de práctica. Tocá el botón y se copia solo.</p><textarea class="sum" id="sm" readonly></textarea><button class="btn" id="cp">Copiar resumen</button><div class="hint" id="cpm" style="text-align:center;margin-top:6px"></div></div>'+
  '<div class="card"><b>Paso 2 · Pegalo en la plataforma</b><p class="hint" style="margin-bottom:0">Entrá a la plataforma del CFP, abrí la <b>Actividad '+S.id+'</b> y pegalo en el cuadro de respuesta (mantené apretado y elegí <b>Pegar</b>, o Ctrl+V). Después respondé las preguntas de la actividad y entregá. <b>Si no lo pegás en la plataforma, el docente no lo recibe.</b></p></div>'+
  '<div class="code">'+code+'</div><div class="hint" id="gs" style="text-align:center">Guardando tu intento…</div><button class="btn alt" onclick="startPractice(\''+S.t.id+'\','+S.id+')">Volver a intentar</button><button class="btn alt" onclick="location.hash=\'#/'+S.t.id+'\'">Volver a las prácticas del trayecto</button></section>';
  $('#sm').value=t;gp.then(function(ok){var g=$('#gs');if(g)g.innerHTML=ok?'✓ Tu intento quedó registrado para el docente. Igual pegá el resumen en la actividad.':'No se pudo registrar el intento (¿sin internet?). No pasa nada: pegá el resumen en la actividad.'});$('#cp').onclick=function(){var ta=$('#sm');ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}
    if(navigator.clipboard)navigator.clipboard.writeText(ta.value).then(function(){msg(true)},function(){msg(ok)});else msg(ok)};
  function msg(ok){$('#cpm').textContent=ok?'¡Copiado! Ahora andá a la plataforma y pegalo en la actividad.':'Seleccioná el texto y copialo a mano (mantené apretado en el celular).'}
  window.scrollTo(0,0);}

/* ---------------- DOCENTE (oculto: #/docente) ---------------- */
var DOC={token:null,correo:'',datos:[],f:{t:'',p:'',q:''}};
try{var _s=JSON.parse(sessionStorage.getItem('doc')||'null');if(_s&&_s.exp>Date.now()){DOC.token=_s.token;DOC.correo=_s.correo}}catch(e){}
function teacher(){header('Panel docente','Plataforma de prácticas');
  if(!DOC.token)return docLogin();
  app.innerHTML='<section class="screen"><h1>Resultados de las prácticas</h1><p class="hint">Ingresaste como <b>'+esc(DOC.correo)+'</b> · <a href="#" id="dsal">salir</a></p><div id="dz" class="card">Cargando intentos…</div>'+docVerif()+'</section>';
  $('#dsal').onclick=function(e){e.preventDefault();DOC.token=null;try{sessionStorage.removeItem('doc')}catch(x){}teacher()};
  bindVerif();
  leerIntentos(DOC.token).then(function(d){DOC.datos=d;docTabla()},function(e){$('#dz').innerHTML='<div class="fb no" style="display:block">'+esc(e.message)+'</div>';if(/venció/.test(e.message)){DOC.token=null;try{sessionStorage.removeItem('doc')}catch(x){}}})}
function docLogin(){
  app.innerHTML='<section class="screen"><h1>Panel docente</h1><p class="lead">Ingresá con el correo y la contraseña que te dio la dirección del CFP.</p><div class="card"><input type="text" id="dc" placeholder="Correo" autocomplete="username"><input type="password" id="dp" placeholder="Contraseña" style="margin-top:8px" autocomplete="current-password"><button class="btn" id="db">Ingresar</button><div class="fb" id="df"></div></div>'+docVerif()+'</section>';
  bindVerif();
  function go(){var c=$('#dc').value.trim().toLowerCase(),p=$('#dp').value;if(!c||!p)return;$('#db').disabled=true;
    ingresarDocente(c,p).then(function(j){DOC.token=j.access_token;DOC.correo=c;try{sessionStorage.setItem('doc',JSON.stringify({token:j.access_token,correo:c,exp:Date.now()+(j.expires_in||3600)*1000-60000}))}catch(e){}teacher()},
      function(e){$('#db').disabled=false;$('#df').className='fb no';$('#df').textContent=/invalid/i.test(e.message)?'Correo o contraseña incorrectos.':e.message})}
  $('#db').onclick=go;$('#dp').onkeydown=function(e){if(e.key==='Enter')go()}}
function docTabla(){var f=DOC.f,d=DOC.datos;
  var tOpts='<option value="">Todos los trayectos</option>'+ORDEN.map(function(id){return '<option value="'+id+'"'+(f.t===id?' selected':'')+'>'+esc(TRAYECTOS[id].nombre)+'</option>'}).join('');
  var ps={};d.forEach(function(r){if(!f.t||r.trayecto===f.t)ps[r.practica]=1});
  var pOpts='<option value="">Todas las prácticas</option>'+Object.keys(ps).map(Number).sort(function(a,b){return a-b}).map(function(n){return '<option value="'+n+'"'+(String(f.p)===String(n)?' selected':'')+'>Práctica '+n+'</option>'}).join('');
  var rows=d.filter(function(r){return (!f.t||r.trayecto===f.t)&&(!f.p||String(r.practica)===String(f.p))&&(!f.q||r.codigo_personal.indexOf(f.q.toUpperCase())>=0)});
  var g={};rows.forEach(function(r){var k=r.trayecto+'|'+r.practica+'|'+r.codigo_personal;var x=g[k]||(g[k]={t:r.trayecto,p:r.practica,c:r.codigo_personal,best:-1,n:0,last:r.creado,list:[]});
    x.n++;x.list.push(r);if(r.puntaje>x.best)x.best=r.puntaje;if(r.creado>x.last)x.last=r.creado});
  var arr=Object.keys(g).map(function(k){return g[k]}).sort(function(a,b){return a.c<b.c?-1:a.c>b.c?1:(a.t<b.t?-1:a.t>b.t?1:a.p-b.p)});
  var est={};arr.forEach(function(x){est[x.c]=1});var apr=arr.filter(function(x){return x.best>=70}).length;
  var h='<div style="display:grid;gap:8px"><select id="ft" class="in">'+tOpts+'</select><select id="fp" class="in">'+pOpts+'</select><input type="text" id="fq" placeholder="Buscar estudiante (apellido)" value="'+esc(f.q)+'" style="text-transform:uppercase"></div>'+
   '<div class="badges" style="margin:12px 0"><div class="badge on"><span class="big" style="font-size:26px;display:block;margin:0">'+Object.keys(est).length+'</span>estudiantes</div><div class="badge on"><span class="big" style="font-size:26px;display:block;margin:0">'+rows.length+'</span>intentos</div><div class="badge on"><span class="big" style="font-size:26px;display:block;margin:0">'+apr+'/'+arr.length+'</span>prácticas con 70+</div></div>';
  if(!arr.length)h+='<p class="hint">Todavía no hay intentos con estos filtros.</p>';
  else{h+='<div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="text-align:left;color:#6B7A8C"><th style="padding:6px">Estudiante</th>'+(f.t?'':'<th>Trayecto</th>')+'<th>Práct.</th><th>Mejor</th><th>Intentos</th><th>Último</th></tr>';
    arr.forEach(function(x,i){var t=TRAYECTOS[x.t];h+='<tr class="drow" data-i="'+i+'" style="border-top:1px solid #E3E8EF;cursor:pointer"><td style="padding:8px 6px"><b>'+esc(x.c)+'</b></td>'+(f.t?'':'<td>'+esc(t?t.nombre.split(' ')[0]:x.t)+'</td>')+'<td>'+x.p+'</td><td style="font-weight:800;color:'+(x.best>=70?'#277A52':'#B9483B')+'">'+x.best+'</td><td>'+x.n+'</td><td>'+new Date(x.last).toLocaleDateString('es-AR')+'</td></tr><tr id="dd'+i+'" style="display:none"><td colspan="6" style="padding:6px 6px 12px"></td></tr>'});
    h+='</table></div><button class="btn alt" id="csv">Descargar planilla (CSV)</button>'}
  $('#dz').innerHTML=h;
  $('#ft').onchange=function(){f.t=this.value;f.p='';docTabla()};$('#fp').onchange=function(){f.p=this.value;docTabla()};
  $('#fq').oninput=function(){f.q=this.value.trim();clearTimeout(DOC.tm);DOC.tm=setTimeout(function(){docTabla();var q=$('#fq');q.focus();q.setSelectionRange(q.value.length,q.value.length)},400)};
  app.querySelectorAll('.drow').forEach(function(tr){tr.onclick=function(){var x=arr[+tr.dataset.i],dd=$('#dd'+tr.dataset.i),td=dd.firstChild;
    if(dd.style.display==='none'){var p=TRAYECTOS[x.t]&&TRAYECTOS[x.t].practicas[x.p];
      td.innerHTML='<div class="hint"><b>'+esc(p?p.title:'Práctica '+x.p)+'</b></div>'+x.list.map(function(r){return '<div class="mono" style="font-size:12.5px">'+new Date(r.creado).toLocaleString('es-AR')+' · <b>'+r.puntaje+'/100</b> · '+esc(r.codigo)+'<br>'+(Array.isArray(r.detalle)?r.detalle.map(function(l,j){return 'Misión '+(j+1)+': '+esc(String(l))}).join('<br>').replace(/\n/g,'<br>&nbsp;&nbsp;'):'')+'</div>'}).join('');dd.style.display=''}else dd.style.display='none'}});
  var c=$('#csv');if(c)c.onclick=function(){var L=[['estudiante','trayecto','practica','mejor_puntaje','intentos','ultimo_intento']].concat(arr.map(function(x){return [x.c,x.t,x.p,x.best,x.n,new Date(x.last).toLocaleString('es-AR')]}));
    var b=new Blob(['﻿'+L.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"'}).join(';')}).join('\n')],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='practicas-'+(f.t||'todas')+'.csv';a.click()}}
function docVerif(){return '<h3>Verificar un código a mano</h3><div class="card"><p class="hint" style="margin-top:0">Para un resumen pegado en una actividad. Copiá el código personal y el código de práctica.</p><input type="text" id="vp" placeholder="Código personal (APELLIDO1234)" style="text-transform:uppercase"><input type="text" id="vc" placeholder="Código de práctica (ej. P5-80-K3ZQ)" style="margin-top:8px;text-transform:uppercase"><button class="btn alt" id="vb">Verificar</button><div class="fb" id="vf"></div></div>'}
function bindVerif(){$('#vb').onclick=function(){var p=$('#vp').value.trim().toUpperCase().replace(/\s+/g,''),c=$('#vc').value.trim().toUpperCase().replace(/\s+/g,''),f=$('#vf');var m=c.match(/^([A-Z]+)(\d+)-(\d{1,3})-([0-9A-Z]{4})$/);var tt=null;for(var k in TRAYECTOS)if(TRAYECTOS[k].prefijo===(m&&m[1]))tt=TRAYECTOS[k];
  if(!m||!tt){f.className='fb no';f.textContent='El código no tiene el formato correcto (por ejemplo P5-80-K3ZQ).';return}
  if(mkCode(tt,+m[2],p,+m[3])===c){f.className='fb ok';f.innerHTML='<b>Código válido.</b> '+esc(tt.nombre)+' · Práctica '+m[2]+' · puntaje '+m[3]+'/100.'}
  else{f.className='fb no';f.innerHTML='<b>No coincide.</b> Ese código no corresponde a ese estudiante, o el puntaje fue modificado.'}}}
