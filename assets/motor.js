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
  if(h==='docente'||h.indexOf('docente/')===0)return teacher();
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
  h+=pieSesion()+'<div class="teacher-link">CFP N.º 403 «Oscar Smith» · Luján</div></section>';app.innerHTML=h;window.scrollTo(0,0)}
function homeTrayecto(t){header(t.nombre,'Prácticas del trayecto');sincronizarPendientes();
  var done=store('hechas-'+t.id)||{};var mods=Object.keys(t.modulos).map(Number).sort(function(a,b){return a-b});
  var h='<section class="screen"><div class="intro-ic">'+ic(t.icono,t.tono)+'</div><h1 style="text-align:center">'+esc(t.nombre)+'</h1><p class="lead" style="text-align:center">Elegí la práctica que te indica la clase que estás haciendo.</p>';
  if(mods.length>1){h+='<h3>Tus insignias</h3><div class="badges">';
    mods.forEach(function(mo,i){var all=true,any=false;for(var k in t.practicas){if(t.practicas[k].mod===mo){any=true;if(!(done[k]>=70))all=false}}
      h+='<div class="badge'+(any&&all?' on':'')+'">'+ic(t.iconosModulo&&t.iconosModulo[mo]||'medal',TONOS[i%TONOS.length])+'Módulo '+ROM[mo]+'</div>'});
    h+='</div><p class="hint">Ganás la insignia de un módulo cuando sacás 70 o más en todas sus prácticas. Se guardan en este navegador.</p>'}
  mods.forEach(function(mo,i){var col=TN[TONOS[i%TONOS.length]][2];h+='<h3>Módulo '+ROM[mo]+' · '+esc(t.modulos[mo])+'</h3><div class="plist">';
    Object.keys(t.practicas).map(Number).sort(function(a,b){return a-b}).forEach(function(id){var p=t.practicas[id];if(p.mod!==mo)return;
      h+='<button class="pitem" onclick="location.hash=\'#/'+t.id+'/'+id+'\'"><span class="num" style="background:'+col+'">'+id+'</span><span><b>'+esc(p.title)+'</b><br><span class="hint">Clase '+id+'</span></span>'+(done[id]!=null?'<span class="st">'+done[id]+'/100</span>':'')+'</button>'});h+='</div>'});
  h+=pieSesion()+'<div class="teacher-link">CFP N.º 403 «Oscar Smith» · Luján</div></section>';app.innerHTML=h;window.scrollTo(0,0)}

/* ---------------- PRÁCTICA ---------------- */
function codigoDe(per){var ap=per.apellido||String(per.nombre||'').split(',')[0].trim().split(/\s+/).pop();return (String(ap||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-ZÑ]/g,'')||'ESTUDIANTE')+(per.dni4||'0000')}
// Pantalla de ingreso con el usuario de la plataforma del CFP (la usan estudiantes y docentes)
function pantallaIngreso(titulo,texto,alEntrar){
  app.innerHTML='<section class="screen"><div class="intro-ic">'+ic('lock','navy')+'</div><h1 style="text-align:center">'+titulo+'</h1><p class="lead" style="text-align:center">'+texto+'</p>'+
  '<div class="card"><b>Ingresá con tu usuario de la plataforma del CFP</b><p class="hint">El mismo DNI (o correo) y la misma contraseña que usás para entrar a la plataforma de cursos. Lo hacés una sola vez en este dispositivo.</p>'+
  '<input type="text" id="lu" placeholder="DNI o correo" autocomplete="username" inputmode="text"><input type="password" id="lp" placeholder="Contraseña" style="margin-top:8px" autocomplete="current-password"><button class="btn" id="lb">Ingresar</button><div class="fb" id="lf"></div></div>'+
  '<p class="hint" style="text-align:center">¿No recordás tu contraseña? Pedile a preceptoría que la restablezca.</p></section>';
  function go(){var u=$('#lu').value.trim(),c=$('#lp').value;if(!u||!c)return;$('#lb').disabled=true;$('#lb').textContent='Ingresando…';
    ingresar(u,c).then(alEntrar,function(e){$('#lb').disabled=false;$('#lb').textContent='Ingresar';$('#lf').className='fb no';$('#lf').textContent=/invalid/i.test(e.message)?'DNI/correo o contraseña incorrectos.':e.message})}
  $('#lb').onclick=go;$('#lp').onkeydown=function(e){if(e.key==='Enter')go()};window.scrollTo(0,0)}
function pieSesion(){return SES&&SES.perfil?'<p class="hint" style="text-align:center;margin-top:18px">Ingresaste como <b>'+esc(SES.perfil.nombre)+'</b> · <a href="#" onclick="salir();location.hash=\'#/\';render();return false">salir</a></p>':''}
function startPractice(tid,id){
  var t=TRAYECTOS[tid],p=t.practicas[id];
  $('#homeBtn').style.display='inline-block';$('#homeBtn').onclick=function(){location.hash='#/'+tid};$('#hT').textContent='Práctica '+id+' · '+p.title;$('#hS').textContent=t.nombre+' · Módulo '+ROM[p.mod]+' · Clase '+id;$('#steps').innerHTML='';
  if(!SES||!SES.perfil)return pantallaIngreso('Práctica '+id,esc(p.title),function(){startPractice(tid,id)});
  var per=SES.perfil;
  if(per.trayectos.indexOf(tid)<0){app.innerHTML='<section class="screen"><div class="intro-ic">'+ic('warning','amber')+'</div><h1 style="text-align:center">No figurás inscripto/a en este trayecto</h1><p class="lead" style="text-align:center">Para hacer las prácticas de <b>'+esc(t.nombre)+'</b> tenés que estar inscripto/a y confirmado/a en ese trayecto en la plataforma del CFP. Consultá con preceptoría o con tu docente.</p><button class="btn alt" id="rr">Ya me confirmaron: volver a revisar</button>'+pieSesion()+'</section>';
    $('#rr').onclick=function(){$('#rr').disabled=true;actualizarPerfil().then(function(){startPractice(tid,id)},function(e){if(!SES)startPractice(tid,id);else{$('#rr').disabled=false;alert(e.message)}})};return}
  S={t:t,id:id,p:p,per:codigoDe(per),mi:-1,pts:[],max:[],log:[]};steps();
  app.innerHTML='<section class="screen"><div class="intro-ic">'+ic(p.icon,p.tone)+'</div><span class="tag">Práctica '+id+'</span><h1>'+esc(p.title)+'</h1><p class="lead">'+p.intro+'</p>'+
  '<div class="card"><b>Hola, '+esc(per.nombre.split(', ')[1]||per.nombre)+'</b><p class="hint">Tu resultado se guarda solo cuando termines. '+p.missions.length+' misiones · unos '+(p.mins||35)+' minutos. Si te equivocás, te explica y seguís.</p><button class="btn" id="go">Empezar</button></div>'+pieSesion()+'</section>';
  $('#go').onclick=function(){next()};
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
var NOTA_MSG={cargada:['ok','✓ Tu nota quedó cargada en la plataforma del CFP.'],actualizada:['ok','✓ Mejoraste: se actualizó tu nota en la plataforma del CFP.'],
 sin_cambios:['info','Tu nota anterior en la plataforma del CFP era igual o mejor: queda la mejor.'],
 sin_clase:['info','Tu resultado quedó registrado. La nota va a pasar a la plataforma del CFP cuando el docente publique esta práctica allá: volvé a entrar a esta página más adelante.'],
 fuera_de_plazo:['no','Venció el plazo de esta práctica en la plataforma del CFP, así que la nota no se cargó. Consultá con tu docente.'],
 no_inscripto:['info','Tu resultado quedó registrado (sin inscripción en este trayecto no se carga nota en la plataforma del CFP).'],
 error:['no','No pudimos conectar con la plataforma del CFP. Tu resultado quedó guardado acá: volvé a abrir esta práctica más tarde y se va a cargar.']};
function finish(){var p=S.p,tot=0,pts=0;S.max.forEach(function(x,i){tot+=x;pts+=S.pts[i]});var score=Math.round(pts/tot*100);var code=mkCode(S.t,S.id,S.per,score);
  var dk='hechas-'+S.t.id,d=store(dk)||{};if(d[S.id]==null||score>d[S.id])d[S.id]=score;store(dk,d);
  var pend=store('pend-cfp')||{};pend[S.t.id+'|'+S.id]=d[S.id];store('pend-cfp',pend);
  $('#steps').innerHTML=p.missions.map(function(){return '<i class="done"></i>'}).join('');
  var det=p.missions.map(function(m,i){return m.title+': '+S.log[i]});
  var ok=score>=70;
  app.innerHTML='<section class="screen"><div class="intro-ic">'+ic('medal',ok?'green':'amber')+'</div><h1 style="text-align:center">'+(ok?'¡Práctica cumplida!':'¡Casi!')+'</h1><div class="big">'+score+' / 100</div>'+
  '<p class="lead" style="text-align:center">'+(ok?'Muy bien.':'Para aprobar necesitás 70 o más. Volvé a intentarlo: ya conocés las respuestas, y queda tu mejor nota.')+'</p>'+
  '<div class="fb info" id="gs" style="display:block;text-align:center">Guardando tu resultado…</div>'+
  '<button class="btn alt" onclick="startPractice(\''+S.t.id+'\','+S.id+')">Volver a intentar</button><button class="btn alt" onclick="location.hash=\'#/'+S.t.id+'\'">Volver a las prácticas del trayecto</button>'+pieSesion()+'</section>';
  var tid=S.t.id,pid=S.id;
  guardarIntento({trayecto:tid,practica:pid,codigo_personal:S.per,puntaje:score,codigo:code,detalle:S.log}).then(function(){return notaEnCFP(tid,pid,d[pid],det)}).then(function(st){
    var m=NOTA_MSG[st]||NOTA_MSG.error,g=$('#gs');if(g){g.className='fb '+m[0];g.textContent=m[1]}
    if(st!=='error'&&st!=='sin_clase'){var pe=store('pend-cfp')||{};delete pe[tid+'|'+pid];store('pend-cfp',pe)}});
  window.scrollTo(0,0);}
// Reintenta pasar a la plataforma del CFP las notas que quedaron pendientes (sin conexión o práctica todavía no publicada)
function sincronizarPendientes(){if(!SES||!SES.perfil)return;var pe=store('pend-cfp')||{};Object.keys(pe).forEach(function(k){var x=k.split('|');
  notaEnCFP(x[0],+x[1],pe[k],null).then(function(st){if(st!=='error'&&st!=='sin_clase'){var p2=store('pend-cfp')||{};delete p2[k];store('pend-cfp',p2)}})})}

/* ---------------- DOCENTE (oculto: #/docente) ---------------- */
var DOC={datos:null};
function docSalir(){salir();DOC.datos=null;location.hash='#/docente';teacher()}
function docCargar(forzar){if(DOC.datos&&!forzar)return Promise.resolve(DOC.datos);return leerIntentos().then(function(d){d.forEach(function(r){r.codigo_personal=r.estudiante||r.codigo_personal||'(sin nombre)'});DOC.datos=d;return d})}
function teacher(){
  var parts=location.hash.replace(/^#\/?/,'').split('/');var tid=parts[1],vista=parts[2]||'clases',sel=parts[3];
  header('Panel docente','Resultados de las prácticas');
  if(!SES||!SES.perfil)return pantallaIngreso('Panel docente','Resultados de las prácticas',teacher);
  if(!SES.perfil.admin){app.innerHTML='<section class="screen"><h1>Panel docente</h1><div class="fb no" style="display:block">Este panel es solo para la dirección del CFP.</div>'+pieSesion()+'</section>';return}
  app.innerHTML='<section class="screen"><div class="card">Cargando resultados…</div></section>';
  docCargar().then(function(d){
    if(!tid||!TRAYECTOS[tid])return docTrayectos(d);
    docTrayecto(TRAYECTOS[tid],d.filter(function(r){return r.trayecto===tid}),vista,sel)},
   function(e){if(e.status===401||/sesión/.test(e.message)){docSalir();return}app.innerHTML='<section class="screen"><div class="fb no" style="display:block">'+esc(e.message)+'</div><button class="btn alt" onclick="DOC.datos=null;teacher()">Reintentar</button></section>'})}
function docPie(){return '<p class="hint" style="margin-top:24px">Sesión de <b>'+esc(SES.perfil.nombre)+'</b> · <a href="#" onclick="DOC.datos=null;teacher();return false">actualizar datos</a> · <a href="#" onclick="docSalir();return false">salir</a></p>'+
  '<details style="margin-top:8px"><summary class="hint" style="cursor:pointer">Verificar un código a mano</summary>'+docVerif()+'</details>'}
function mejores(rows){var g={};rows.forEach(function(r){var k=r.practica+'|'+r.codigo_personal;var x=g[k]||(g[k]={p:r.practica,c:r.codigo_personal,best:-1,n:0,last:r.creado,list:[]});x.n++;x.list.push(r);if(r.puntaje>x.best)x.best=r.puntaje;if(r.creado>x.last)x.last=r.creado});return Object.keys(g).map(function(k){return g[k]})}
function fecha(s){return new Date(s).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})}
function nota(b){return '<b style="color:'+(b>=70?'#277A52':'#B9483B')+'">'+b+'</b>'}
function docTrayectos(d){
  var h='<section class="screen"><h1>Resultados de las prácticas</h1><p class="lead">Elegí un trayecto.</p>';
  ORDEN.forEach(function(id){var t=TRAYECTOS[id],r=d.filter(function(x){return x.trayecto===id}),est={};r.forEach(function(x){est[x.codigo_personal]=1});var n=Object.keys(t.practicas).length;
    h+='<button class="tcard"'+(n?' onclick="location.hash=\'#/docente/'+id+'\'"':' disabled')+'>'+ic(t.icono,t.tono)+'<span><b>'+esc(t.nombre)+'</b><br><span class="hint">'+(n?Object.keys(est).length+' estudiantes · '+r.length+' intentos':'Todavía sin prácticas')+'</span></span></button>'});
  app.innerHTML=h+docPie()+'</section>';bindVerif();window.scrollTo(0,0)}
function docTrayecto(t,rows,vista,sel){
  header(t.nombre,'Panel docente');$('#homeBtn').onclick=function(){location.hash='#/docente'};
  var M=mejores(rows),est={};M.forEach(function(x){est[x.c]=1});var alumnos=Object.keys(est).sort();
  var ids=Object.keys(t.practicas).map(Number).sort(function(a,b){return a-b});
  var tab=function(v,l){return '<button class="chip'+(vista===v?' sel':'')+'" onclick="location.hash=\'#/docente/'+t.id+'/'+v+'\'">'+l+'</button>'};
  var h='<section class="screen"><h1>'+esc(t.nombre)+'</h1><div style="margin:6px 0 10px">'+tab('clases','Por clase')+tab('estudiantes','Por estudiante')+'</div>';
  if(vista==='clases'&&!sel){
    h+='<div class="card" style="padding:6px 0">';
    ids.forEach(function(id){var xs=M.filter(function(x){return x.p===id}),ap=xs.filter(function(x){return x.best>=70}).length;
      h+='<button class="pitem" style="box-shadow:none;width:100%;border-radius:0;border-bottom:1px solid #E3E8EF" onclick="location.hash=\'#/docente/'+t.id+'/clases/'+id+'\'"><span class="num" style="background:#2A7F8E">'+id+'</span><span><b>'+esc(t.practicas[id].title)+'</b><br><span class="hint">'+(xs.length?xs.length+' estudiantes · '+ap+' con 70 o más':'Nadie la hizo todavía')+'</span></span><span class="st" style="color:#6B7A8C">›</span></button>'});
    h+='</div>'}
  else if(vista==='clases'){var id=+sel,xs=M.filter(function(x){return x.p===id}).sort(function(a,b){return a.c<b.c?-1:1});
    h+='<h2>Clase '+id+' · '+esc(t.practicas[id]?t.practicas[id].title:'')+'</h2><p class="hint"><a href="#/docente/'+t.id+'/clases">‹ volver a las clases</a></p>';
    var faltan=alumnos.filter(function(a){return !xs.some(function(x){return x.c===a})});
    h+='<div class="card">'+(xs.length?xs.map(function(x,i){return '<div class="task" style="cursor:pointer;align-items:center" onclick="var d=document.getElementById(\'dt'+i+'\');d.style.display=d.style.display?\'\':\'none\'"><span style="flex:1"><b>'+esc(x.c)+'</b><br><span class="hint">'+x.n+' intento'+(x.n>1?'s':'')+' · último '+fecha(x.last)+'</span></span>'+nota(x.best)+'</div><div id="dt'+i+'" style="display:none">'+det(x)+'</div>'}).join(''):'<p class="hint">Nadie la hizo todavía.</p>')+'</div>';
    if(faltan.length)h+='<h3>Todavía no la hicieron ('+faltan.length+')</h3><div class="card hint">'+faltan.map(esc).join(' · ')+'</div>'}
  else if(!sel){
    if(!alumnos.length)h+='<div class="card hint">Todavía no hay estudiantes con prácticas.</div>';
    else{h+='<p class="hint">Cada casillero es una clase: <b style="color:#277A52">verde</b> 70 o más, <b style="color:#B9483B">rojo</b> menos de 70, gris sin hacer.</p><div class="card" style="padding:6px 12px">';
      alumnos.forEach(function(a){var mine=M.filter(function(x){return x.c===a}),ap=mine.filter(function(x){return x.best>=70}).length;
        h+='<div class="task" style="display:block;cursor:pointer" onclick="location.hash=\'#/docente/'+t.id+'/estudiantes/'+encodeURIComponent(a)+'\'"><b>'+esc(a)+'</b> <span class="hint">· '+ap+' de '+ids.length+' aprobadas</span><div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:6px">'+
        ids.map(function(id){var x=mine.filter(function(y){return y.p===id})[0];var bg=!x?'#E3E8EF':(x.best>=70?'#3C9D6E':'#E06A5B');return '<span title="Clase '+id+(x?': '+x.best:'')+'" style="width:22px;height:22px;border-radius:5px;background:'+bg+';color:#fff;font-size:10px;display:inline-flex;align-items:center;justify-content:center">'+id+'</span>'}).join('')+'</div></div>'});
      h+='</div><button class="btn alt" id="csv">Descargar planilla de notas (Excel/CSV)</button>'}}
  else{var a=decodeURIComponent(sel),mine=M.filter(function(x){return x.c===a});
    h+='<h2>'+esc(a)+'</h2><p class="hint"><a href="#/docente/'+t.id+'/estudiantes">‹ volver a los estudiantes</a></p><div class="card">';
    ids.forEach(function(id,i){var x=mine.filter(function(y){return y.p===id})[0];
      h+='<div class="task" style="align-items:center'+(x?';cursor:pointer':'')+'"'+(x?' onclick="var d=document.getElementById(\'de'+i+'\');d.style.display=d.style.display?\'\':\'none\'"':'')+'><span style="flex:1"><b>Clase '+id+'</b> · '+esc(t.practicas[id].title)+(x?'<br><span class="hint">'+x.n+' intento'+(x.n>1?'s':'')+' · último '+fecha(x.last)+'</span>':'')+'</span>'+(x?nota(x.best):'<span class="hint">—</span>')+'</div>'+(x?'<div id="de'+i+'" style="display:none">'+det(x)+'</div>':'')});
    h+='</div>'}
  app.innerHTML=h+docPie()+'</section>';bindVerif();window.scrollTo(0,0);
  var c=$('#csv');if(c)c.onclick=function(){var L=[['Estudiante'].concat(ids.map(function(id){return 'Clase '+id})).concat(['Aprobadas'])];
    alumnos.forEach(function(a){var mine=M.filter(function(x){return x.c===a});L.push([a].concat(ids.map(function(id){var x=mine.filter(function(y){return y.p===id})[0];return x?x.best:''})).concat([mine.filter(function(x){return x.best>=70}).length]))});
    var b=new Blob(['﻿'+L.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"'}).join(';')}).join('\n')],{type:'text/csv'});var e=document.createElement('a');e.href=URL.createObjectURL(b);e.download='notas-practicas-'+t.id+'.csv';e.click()}}
function det(x){return x.list.slice().sort(function(a,b){return a.creado<b.creado?1:-1}).map(function(r){return '<div class="mono" style="font-size:12.5px;margin:4px 0 8px">'+new Date(r.creado).toLocaleString('es-AR')+' · <b>'+r.puntaje+'/100</b> · '+esc(r.codigo)+'<br>'+(Array.isArray(r.detalle)?r.detalle.map(function(l,j){return 'Misión '+(j+1)+': '+esc(String(l))}).join('<br>').replace(/\n/g,'<br>&nbsp;&nbsp;'):'')+'</div>'}).join('')}
function docVerif(){return '<div class="card"><p class="hint" style="margin-top:0">Para un resumen pegado en una actividad, por ejemplo del Plan B o si no se registró por falta de internet.</p><input type="text" id="vp" placeholder="Código personal (APELLIDO1234)" style="text-transform:uppercase"><input type="text" id="vc" placeholder="Código de práctica (ej. P5-80-K3ZQ)" style="margin-top:8px;text-transform:uppercase"><button class="btn alt" id="vb">Verificar</button><div class="fb" id="vf"></div></div>'}
function bindVerif(){var b=$('#vb');if(!b)return;b.onclick=function(){var p=$('#vp').value.trim().toUpperCase().replace(/\s+/g,''),c=$('#vc').value.trim().toUpperCase().replace(/\s+/g,''),f=$('#vf');var m=c.match(/^([A-Z]+)(\d+)-(\d{1,3})-([0-9A-Z]{4})$/);var tt=null;for(var k in TRAYECTOS)if(TRAYECTOS[k].prefijo===(m&&m[1]))tt=TRAYECTOS[k];
  if(!m||!tt){f.className='fb no';f.textContent='El código no tiene el formato correcto (por ejemplo P5-80-K3ZQ).';return}
  if(mkCode(tt,+m[2],p,+m[3])===c){f.className='fb ok';f.innerHTML='<b>Código válido.</b> '+esc(tt.nombre)+' · Práctica '+m[2]+' · puntaje '+m[3]+'/100.'}
  else{f.className='fb no';f.innerHTML='<b>No coincide.</b> Ese código no corresponde a ese estudiante, o el puntaje fue modificado.'}}}
