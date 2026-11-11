function SP(ok,t){return '<span class="sp" data-ok="'+ok.replace(/"/g,'&quot;')+'">'+t+'</span>'}
function SN(no,t){return '<span class="sp" data-no="'+no.replace(/"/g,'&quot;')+'">'+t+'</span>'}
var CID=['C<br><small>Confidencialidad</small>','I<br><small>Integridad</small>','D<br><small>Disponibilidad</small>'];
var PR_SEG={
/* ================= MÓDULO I ================= */
1:{mod:1,title:'La trastienda de Marta',icon:'store',tone:'amber',mins:35,
 intro:'Marta tiene una panadería en Luján. Se le rompió el disco de la compu y perdió todo. Hoy sos su asesora o asesor de seguridad.',
 missions:[
 {type:'quiz',row:true,title:'¿Qué se rompió?',lead:'En cada situación, elegí cuál de las tres falló: <b>C</b> (que la vea solo quien debe), <b>I</b> (que nadie la cambie sin aviso) o <b>D</b> (que esté cuando la necesito).',items:[
  {q:'Se cortó internet y Marta no pudo entrar al home banking para pagarle al proveedor.',opts:CID,a:2,why:'No pudo usarla cuando la necesitaba: falló la disponibilidad.'},
  {q:'Rosa dejó abierto el correo del negocio y un cliente leyó un mensaje privado.',opts:CID,a:0,why:'Alguien vio lo que no debía: falló la confidencialidad.'},
  {q:'Alguien cambió los precios de la planilla y nadie se dio cuenta hasta fin de mes.',opts:CID,a:1,why:'La información se modificó sin aviso: falló la integridad.'},
  {q:'El disco de la compu se rompió y no hay forma de abrir los pedidos.',opts:CID,a:2,why:'La información existe pero no se puede usar: disponibilidad.'},
  {q:'Tomás le mostró a un amigo la lista de clientes con sus teléfonos.',opts:CID,a:0,why:'Datos privados en manos de quien no debía: confidencialidad.'},
  {q:'Un pedido de torta figura con la fecha equivocada porque alguien lo editó por error.',opts:CID,a:1,why:'El dato quedó alterado: integridad.'}]},
 {type:'sort',title:'Ordená la trastienda',lead:'<b>Activo:</b> lo que vale. <b>Amenaza:</b> lo que lo puede dañar. <b>Vulnerabilidad:</b> el punto débil por donde entra el daño.',bins:['Activo','Amenaza','Vulnerabilidad'],
  items:[['La lista de clientes',0],['Las fotos de las tortas',0],['Los pedidos del mes',0],['Un corte de luz',1],['Un virus en un adjunto',1],['Un ladrón que entra al local',1],['La compu sin contraseña',2],['No tener ninguna copia',2],['La clave escrita en un papelito',2]],
  end:'Ya distinguís lo que cuidamos, lo que lo amenaza y por dónde entra el daño.'},
 {type:'tiles',title:'Detective en la trastienda',lead:'Esto es lo que hay en la trastienda de Marta. Encontrá los <b>6 puntos débiles</b>. Ojo: también hay cosas que están bien.',items:[
  ['wifi','Cartel en la pared: «Wi-Fi del local · clave: marta123»',1,'Cualquier cliente puede usar la red del negocio, y la clave es fácil de adivinar.'],
  ['update','Aviso en pantalla: «Actualización pendiente · pospuesta hace 214 días»',1,'Las actualizaciones tapan agujeros de seguridad. Posponerlas deja la puerta abierta.'],
  ['globe','Home banking abierto con la sesión de Marta, y nadie en la compu',1,'Cualquiera que se siente puede operar con la cuenta. Hay que cerrar sesión.'],
  ['password','Papelito pegado al monitor: «clave compu: pan2020»',1,'Una clave a la vista deja de proteger. Y además es corta.'],
  ['usb','Caja de pendrives para copias… vacía',1,'No hay ninguna copia: es justo lo que le pasó a Marta. Lo resolvemos en la Clase 3.'],
  ['house','La compu está pegada a la ventana, que queda abierta cuando llueve',1,'El agua es una amenaza del ambiente. La compu debería estar lejos de la ventana.'],
  ['clock','Un reloj de pared',0,'El reloj no tiene nada que ver con la seguridad.'],
  ['shield','La compu tiene el antivirus de Windows activado',0,'¡Eso está bien! Es una protección.'],
  ['user','Marta atiende a un cliente en el mostrador',0,'Eso es lo normal del negocio. Seguí buscando.'],
  ['calendar','Un almanaque con los pedidos de la semana',0,'Está bien, no es un riesgo digital.']],end:'Marta tiene mucho para mejorar, y vos ya sabés por dónde empezar.'},
 {type:'list',title:'Tu propia trastienda',lead:'Elegí de 3 a 6 cosas digitales <b>tuyas</b>. No escribas contraseñas ni datos privados: solo el nombre de la cosa.',
  sug:['Fotos familiares','Correo electrónico','WhatsApp','Home banking o billetera virtual','Documentos de trabajo o estudio','Redes sociales','Contactos del celular'],
  qs:[['¿Cuánto te dolería perderlo?',['Muchísimo','Bastante','Poco'],'me dolería perderlo:'],['¿Tiene copia en otro lugar?',['Sí','No','No sé'],'copia:']]}]},

2:{mod:1,title:'Cuentas y contraseñas',icon:'user',tone:'navy',mins:45,
 intro:'En la compu de Marta, ella, su hijo Tomás y Rosa entran con la misma cuenta, que es de administrador. Un día Tomás instaló un «juego gratis»… Vamos a ordenar esas cuentas.',
 missions:[
 {type:'sort',title:'¿Quién necesita qué?',lead:'Una cuenta de <b>administrador</b> puede cambiar todo. Una <b>estándar</b> usa la compu sin tocar lo importante. ¿Qué cuenta alcanza para cada tarea?',bins:['Alcanza con estándar','Necesita administrador'],
  items:[['Rosa carga las ventas del día',0],['Tomás juega a un juego ya instalado',0],['Marta escribe un mail a un proveedor',0],['Mirar fotos y videos',0],['Instalar un programa nuevo',1],['Crear una cuenta para otra persona',1],['Cambiar la configuración de seguridad de Windows',1]],
  end:'Casi todo lo del día a día se hace con una cuenta estándar. La de administrador se usa solo para instalar o configurar.'},
 {type:'quiz',title:'El cartel de permisos',lead:'Windows muestra un cartel antes de dejar que un programa haga cambios. ¿Qué harías en cada caso?',items:[
  {mock:'<div class="mock"><div class="bar2">Control de cuentas de usuario</div><div class="body"><b>¿Quieres permitir que esta aplicación haga cambios en el dispositivo?</b><br><br>JuegoGratisFull.exe<br><span class="hint">Editor: desconocido</span></div></div>',q:'Tomás bajó el juego de un sitio que encontró buscando «juegos gratis». ¿Qué toca?',opts:['Sí, total es un juego','No'],a:1,why:'Editor desconocido y sitio no oficial: es la puerta de entrada típica del malware.'},
  {mock:'<div class="mock"><div class="bar2">Control de cuentas de usuario</div><div class="body"><b>¿Quieres permitir que esta aplicación haga cambios en el dispositivo?</b><br><br>Instalador de LibreOffice<br><span class="hint">Editor verificado: The Document Foundation</span></div></div>',q:'Marta acaba de descargar LibreOffice de su página oficial y le hizo doble clic. ¿Qué toca?',opts:['Sí','No'],a:0,why:'Ella misma lo pidió, de un sitio oficial y con editor verificado. Ahí sí corresponde aceptar.'},
  {mock:'<div class="mock"><div class="bar2">Control de cuentas de usuario</div><div class="body"><b>¿Quieres permitir que esta aplicación haga cambios en el dispositivo?</b><br><br>svch0st_update.exe<br><span class="hint">Editor: desconocido</span></div></div>',q:'Rosa está cargando ventas y el cartel aparece solo, sin que ella abriera nada. ¿Qué toca?',opts:['Sí, para que no moleste','No'],a:1,why:'Si no hiciste nada que lo justifique, la respuesta es No. Un cartel que aparece solo es muy sospechoso.'}]},
 {type:'pwd',title:'Armá una frase de contraseña',lead:'Una contraseña fuerte no tiene por qué ser rara: puede ser una <b>frase larga</b> que solo vos entiendas. Probá armar una de práctica.',
  rules:[['Tiene 15 caracteres o más','return p.length>=15'],['Tiene al menos 4 palabras','return p.trim().split(/\\s+/).length>=4'],['No incluye «123», «contraseña» ni «password»','return !/123|contrase|password/i.test(p)'],['No es una sola palabra repetida','return p.length>0&&new Set(p.toLowerCase().split(/\\s+/)).size>1']],
  end:'Una frase larga es fácil de recordar y muy difícil de adivinar. Usá esta idea para tus claves reales, pero no esta frase.'},
 {type:'quiz',title:'Verdadero o falso',lead:'Tres ideas sobre contraseñas. ¿Son ciertas?',row:true,items:[
  {q:'Usar la misma contraseña en el correo y en el banco está bien si es muy larga.',opts:['Verdadero','Falso'],a:1,why:'Si un sitio se filtra, prueban esa clave en todos lados. Tiene que ser distinta en cada lugar.'},
  {q:'Una app de linterna no necesita permiso para ver mis contactos.',opts:['Verdadero','Falso'],a:0,why:'Cada app debería tener solo los permisos que necesita. Una linterna no necesita tus contactos.'},
  {q:'Prestarle la contraseña a un amigo de confianza no tiene riesgo.',opts:['Verdadero','Falso'],a:1,why:'Una contraseña compartida deja de ser tuya: no sabés dónde la anota ni a quién se la pasa.'}]},
 CFGS.cuenta]},

3:{mod:1,title:'Copias que salvan',icon:'cloud',tone:'teal',mins:40,cfp:'Actividad 3 · Mi copia, comprobada',
 intro:'Marta perdió tres años de trabajo por no tener copias. Vamos a aprender a hacerlas bien, y sobre todo a comprobar que sirven.',
 missions:[
 {type:'quiz',row:true,title:'¿Es una copia de seguridad?',lead:'Una copia de seguridad es una copia guardada <b>en otro lugar</b>. ¿Estos casos cuentan?',items:[
  {q:'Tengo el archivo dos veces en el escritorio de la misma compu.',opts:['Es copia','No es copia'],a:1,why:'Si se rompe el disco, se pierden las dos. Tiene que estar en otro lugar.'},
  {q:'Copié mis fotos a un pendrive que guardo en un cajón.',opts:['Es copia','No es copia'],a:0,why:'Otro aparato, otro lugar: es una copia de verdad.'},
  {q:'Moví la carpeta de trabajos del escritorio a «Documentos».',opts:['Es copia','No es copia'],a:1,why:'Mover no es copiar: el archivo sigue existiendo una sola vez.'},
  {q:'Subí mis documentos al almacenamiento gratuito de mi cuenta de correo.',opts:['Es copia','No es copia'],a:0,why:'La nube es otro lugar, y además queda fuera de casa.'},
  {q:'Hice una copia en el pendrive hace dos años y nunca más la actualicé.',opts:['Es copia','No es copia'],a:0,why:'Es una copia, pero vieja. Le falta todo lo de estos dos años: hay que actualizarla.'}]},
 {type:'sort',title:'La regla 3-2-1',lead:'3 copias, en 2 tipos de lugar, 1 fuera de casa. Ubicá cada lugar donde corresponde para las fotos de Marta.',bins:['En la compu (original)','En otro aparato de casa','Fuera de casa'],
  items:[['La carpeta de fotos de la compu',0],['Un pendrive',1],['Un disco externo',1],['La nube de su cuenta de correo',2],['Una copia en la casa de su hermana',2]],end:'Con una copia en cada columna, Marta cumple la regla 3-2-1.'},
 {type:'order',title:'Copiar y comprobar',lead:'Ordená los pasos para hacer una copia y comprobar que funciona.',steps:['Elegir los archivos importantes','Copiarlos (Ctrl+C) sin moverlos','Pegarlos (Ctrl+V) en el pendrive o la nube','Desde la copia, traer un archivo a una carpeta de prueba','Abrir ese archivo y verificar que se ve bien'],
  why:'El último paso es el que casi nadie hace: una copia que nunca probaste es una esperanza, no una copia.'},
 CFGS.copia,
 {type:'list',title:'Tu plan de copias',lead:'Anotá de 3 a 5 cosas tuyas que necesitan copia. Elegí dónde y cada cuánto la vas a hacer.',
  sug:['Fotos del celular','Documentos de trabajo','Trabajos del curso','Contactos','Conversaciones de WhatsApp'],
  qs:[['¿Dónde vas a guardar la copia?',['Pendrive o disco','Nube','Otra compu'],'dónde:'],['¿Cada cuánto?',['Cada semana','Cada mes','Cada vez que cambia'],'frecuencia:']]}]},

4:{mod:1,title:'Malware al acecho',icon:'bug',tone:'coral',mins:50,cfp:'Actividad 4 · Diagnóstico de la compu de Marta',
 intro:'A la panadería llegó un correo con una «factura». Rosa lo abrió y apareció un cartel: «Tus archivos fueron bloqueados». Por suerte, Marta ya tenía copias. Vamos a entender qué pasó.',
 missions:[
 {type:'sort',title:'Conocé a la banda',lead:'Cada tipo de malware hace algo distinto. Ubicá cada descripción.',bins:['Troyano','Ransomware','Spyware','Adware'],
  items:[['Se disfraza de juego gratis, pero trae algo malo adentro',0],['Llega como una «factura» que en realidad es un programa',0],['Bloquea tus archivos y pide dinero',1],['Muestra un cartel: «pagá para recuperar tus fotos»',1],['Anota en silencio lo que escribís',2],['Manda a otro lado tus contraseñas',2],['Llena el navegador de publicidad',3],['Cambia tu página de inicio para mostrarte anuncios',3]],end:'No hace falta saber los nombres de memoria: lo importante es reconocer qué hace cada uno.'},
 {type:'spot',title:'El correo de la «factura»',lead:'Este es el correo que abrió Rosa. Tocá las <b>4 señales</b> de que era una trampa.',need:4,win:'Correo · Bandeja de entrada',
  html:'<b>De:</b> Facturación '+SP('La dirección no es de ninguna empresa conocida: es una cuenta gratuita con números al azar.','&lt;facturacion.pagos8812@gmail.com&gt;')+'<br><b>Asunto:</b> '+SP('Te apura y te asusta para que actúes sin pensar.','URGENTE: factura impaga, evite el corte del servicio')+'<br><br>Estimado cliente:<br>'+SN('Un saludo así no es sospechoso por sí solo.','Le enviamos la factura del mes.')+' '+SP('Ninguna empresa seria te amenaza con un plazo de horas.','Si no la abona en 24 horas, se dará de baja el servicio.')+'<br><br>📎 '+SP('Termina en .exe: no es un PDF, es un programa que se ejecuta al abrirlo.','Factura_octubre.pdf.exe')+'<br><br>'+SN('Una firma así no prueba nada, pero tampoco es la señal principal.','Atentamente, Departamento de Facturación')},
 {type:'quiz',row:true,title:'¿Tranquilo o cuidado?',lead:'Mirá el final del nombre de cada archivo (la extensión). ¿Lo abrirías si te llega por correo de alguien que no conocés?',items:[
  {q:'<span style="font-family:monospace">presupuesto.pdf</span>',opts:['Tranquilo','Cuidado'],a:0,why:'Un PDF es un documento. Igual conviene que venga de alguien conocido.'},
  {q:'<span style="font-family:monospace">fotos_cumple.zip.exe</span>',opts:['Tranquilo','Cuidado'],a:1,why:'Lo último es .exe: es un programa disfrazado de archivo comprimido.'},
  {q:'<span style="font-family:monospace">lista_precios.xlsx</span>',opts:['Tranquilo','Cuidado'],a:0,why:'Es una planilla. Si no la esperabas, preguntá antes de abrirla.'},
  {q:'<span style="font-family:monospace">comprobante.scr</span>',opts:['Tranquilo','Cuidado'],a:1,why:'.scr es un tipo de programa. Un comprobante nunca debería ser un programa.'}]},
 CFGS.revision,
 {type:'check',title:'Revisá tu equipo',lead:'Ahora en tu compu o tu celular de verdad. Marcá lo que pudiste hacer.',min:2,items:[
  '<b>Compu:</b> abrí <b>Seguridad de Windows</b> y ejecuté un <b>Examen rápido</b>',
  '<b>Compu:</b> en el Explorador de archivos activé <b>Ver › Extensiones de nombre de archivo</b>',
  '<b>Android:</b> en Play Store › mi perfil › <b>Play Protect</b>, ejecuté un análisis',
  '<b>iPhone:</b> en Ajustes › General › <b>Actualización de software</b>, revisé si hay actualizaciones',
  'Revisé las apps instaladas y borré una que no uso o no reconozco']}]},

/* ================= MÓDULO II ================= */
5:{mod:2,title:'¿Qué es una red?',icon:'network',tone:'teal',mins:30,
 intro:'Cada vez que mandás un WhatsApp, tu mensaje viaja por varias redes. Hoy vamos a ver qué es una red y de qué tamaños hay.',
 missions:[
 {type:'sort',title:'¿Qué tan grande es la red?',lead:'<b>PAN:</b> alrededor tuyo. <b>LAN:</b> una casa o un edificio. <b>WAN:</b> ciudades o países.',bins:['PAN (personal)','LAN (local)','WAN (amplia)'],
  items:[['El celular conectado a los auriculares por Bluetooth',0],['El reloj inteligente unido al celular',0],['La compu y la impresora del CFP',1],['El wifi de tu casa',1],['Las computadoras de la panadería',1],['Internet',2],['La red de un banco que une todas sus sucursales del país',2]],end:'Las redes van de lo más chico (vos) a lo más grande (el mundo).'},
 {type:'quiz',title:'Formas de conectar',lead:'La <b>topología</b> es la forma en que se conectan los equipos. Mirá cada caso.',items:[
  {q:'En tu casa, todos los equipos se conectan al router, que está en el medio. ¿Qué forma es?',opts:['Estrella','Bus (una línea)','Anillo'],a:0,why:'Todos a un punto central: estrella. Es la más común hoy.'},
  {q:'En una red en estrella, ¿qué pasa si se apaga el router?',opts:['Nada, siguen conectados entre sí','Se cae toda la red','Solo se cae un equipo'],a:1,why:'El centro es el punto débil: si falla, nadie se comunica.'},
  {q:'En una red en estrella, ¿qué pasa si se apaga una compu?',opts:['Se cae toda la red','Los demás siguen funcionando','Se apaga el router'],a:1,why:'Es una ventaja de la estrella: un equipo que falla no afecta a los demás.'}]},
 {type:'order',title:'El viaje de un mensaje',lead:'Mandás un mensaje desde el celular. Ordená el camino que hace hasta llegar a internet.',steps:['Tu celular','El wifi de tu casa','El router','El módem del proveedor','La red del proveedor de internet','Internet y el servidor de la app'],
  why:'Cada parte del camino es un lugar donde la información se puede cuidar, o quedar expuesta.'},
 {type:'quiz',row:true,title:'¿Con cable o sin cable?',lead:'Ventajas de cada forma de conectarse.',items:[
  {q:'Es más estable y rápida, ideal para una compu fija.',opts:['Con cable','Wifi'],a:0,why:'El cable no sufre interferencias de paredes u otros aparatos.'},
  {q:'Te deja moverte por la casa con el celular.',opts:['Con cable','Wifi'],a:1,why:'La comodidad del wifi: sin cables.'},
  {q:'Para que alguien se meta, tiene que enchufarse físicamente.',opts:['Con cable','Wifi'],a:0,why:'Por eso el wifi necesita una buena clave: la señal sale de tu casa.'}]}]},

6:{mod:2,title:'Tu red de casa',icon:'router',tone:'teal',mins:45,cfp:'Actividad 6 · El relevamiento de mi wifi',
 intro:'El router es la puerta de entrada de tu casa a internet. Hoy vamos a ver cómo está configurado el de Marta… y a revisar el tuyo.',
 missions:[
 {type:'sort',title:'Cada aparato, su función',lead:'Ubicá cada descripción en el aparato que corresponde.',bins:['Módem','Router','Switch','Dispositivo final'],
  items:[['Traduce la señal que llega del proveedor de internet',0],['Lo instala la empresa de internet en tu casa',0],['Reparte internet a todos los equipos y arma el wifi',1],['Tiene la clave del wifi',1],['Suma más bocas de cable cuando no alcanzan',2],['Tu celular',3],['El televisor inteligente',3]],end:'Hoy muchas veces el módem y el router vienen juntos en un solo aparato.'},
 {type:'spot',title:'El router de Marta',lead:'Esta es la configuración del router de la panadería. Encontrá las <b>4 cosas</b> que hay que cambiar.',need:4,win:'Configuración del router · 192.168.0.1',
  html:'<b>Nombre de la red (SSID):</b> '+SN('El nombre puede ser cualquiera. Mejor si no da datos personales, pero no es lo más grave.','Panaderia_Marta')+'<br><br><b>Seguridad:</b> '+SP('WEP es un cifrado muy viejo que se rompe fácil. Hay que elegir WPA2 o WPA3.','WEP')+'<br><br><b>Clave del wifi:</b> '+SP('Corta y fácil de adivinar: el nombre del negocio con números.','marta123')+'<br><br><b>Botón WPS:</b> '+SP('WPS permite conectarse sin la clave apretando un botón: si no lo usás, apagalo.','Activado')+'<br><br><b>Usuario del panel:</b> admin · <b>Clave del panel:</b> '+SP('Es la clave que viene de fábrica: está publicada en internet. Hay que cambiarla.','admin')+'<br><br><b>Firewall:</b> '+SN('El firewall activado está bien.','Activado')},
 CFGS.router,
 {type:'quiz',title:'WPA2, WPA3, ¿qué?',lead:'Leé estas situaciones sobre la seguridad del wifi.',items:[
  {q:'¿Qué tipo de seguridad conviene elegir en el router?',opts:['Abierta (sin clave)','WEP','WPA2 o WPA3'],a:2,why:'WPA2 y WPA3 son los actuales. WPA3 es el más nuevo; si tu router no lo tiene, WPA2 está bien.'},
  {q:'Un vecino te pide la clave del wifi «para una urgencia». ¿Qué conviene?',opts:['Dársela y cambiarla después','Dársela para siempre','Ofrecerle la red de invitados si el router la tiene'],a:2,why:'La red de invitados le da internet sin dejarlo ver tus equipos. Si no tenés, cambiá la clave después.'},
  {q:'En la lista del router aparece un equipo que no reconocés. ¿Qué hacés?',opts:['Nada','Cambio la clave del wifi','Apago el router para siempre'],a:1,why:'Al cambiar la clave, se desconectan todos y solo vuelven los que la saben.'}]}]},

7:{mod:2,title:'Direcciones IP',icon:'globe',tone:'teal',mins:35,
 intro:'Cada equipo en una red tiene una dirección, como cada casa tiene su calle y su número. Hoy aprendemos a leerlas.',
 missions:[
 {type:'quiz',row:true,title:'¿Es una IP válida?',lead:'Una dirección IP tiene <b>4 números separados por puntos</b>, cada uno <b>de 0 a 255</b>.',items:[
  {q:'<span style="font-family:monospace;font-size:22px">192.168.1.10</span>',opts:['Válida','No válida'],a:0,why:'Cuatro números, todos entre 0 y 255.'},
  {q:'<span style="font-family:monospace;font-size:22px">192.168.1.300</span>',opts:['Válida','No válida'],a:1,why:'300 es mayor que 255: no existe.'},
  {q:'<span style="font-family:monospace;font-size:22px">10.0.0.1</span>',opts:['Válida','No válida'],a:0,why:'Válida. Es una dirección privada muy usada.'},
  {q:'<span style="font-family:monospace;font-size:22px">172.16.5</span>',opts:['Válida','No válida'],a:1,why:'Tiene solo tres números. Faltan uno.'},
  {q:'<span style="font-family:monospace;font-size:22px">8.8.8.8</span>',opts:['Válida','No válida'],a:0,why:'Válida. Es pública: pertenece a un servidor de Google.'}]},
 {type:'sort',title:'¿Privada o pública?',lead:'Las <b>privadas</b> se usan dentro de tu casa o empresa (empiezan con 192.168, 10. o 172.16 a 172.31). Las <b>públicas</b> se ven desde internet.',bins:['Privada (dentro de casa)','Pública (en internet)'],
  items:[['192.168.0.15',0],['10.1.1.20',0],['172.16.0.8',0],['8.8.8.8',1],['200.45.12.3',1],['181.30.140.2',1]],end:'Tu router tiene las dos: una privada para hablar con tus equipos y una pública para salir a internet.'},
 {type:'quiz',title:'La máscara: ¿qué parte es la calle?',lead:'Con la máscara <b>255.255.255.0</b>, los tres primeros números son la «calle» (la red) y el último es el «número de casa» (el equipo). Dos equipos están en la misma red si tienen <b>la misma calle</b>.',items:[
  {q:'¿Están en la misma red?<br><span style="font-family:monospace">192.168.1.10</span> y <span style="font-family:monospace">192.168.1.200</span>',opts:['Sí','No'],a:0,why:'Misma calle (192.168.1), distinto número: misma red.'},
  {q:'¿Están en la misma red?<br><span style="font-family:monospace">192.168.1.10</span> y <span style="font-family:monospace">192.168.2.10</span>',opts:['Sí','No'],a:1,why:'La calle cambia (1 y 2): son redes distintas.'},
  {q:'¿Cuántos equipos entran en una red 192.168.1.x con esa máscara?',opts:['10','254','1000'],a:1,why:'Del 1 al 254. El 0 y el 255 están reservados para la red y para avisos generales.'},
  {q:'La compu tiene 192.168.1.50. ¿Cuál puede ser la impresora para que se vean?',opts:['192.168.1.60','192.168.5.60','10.0.0.60'],a:0,why:'Tiene que estar en la misma calle: 192.168.1.'}]},
 {type:'order',title:'De más grande a más chico',lead:'Ordená desde lo más grande hasta lo más específico, como una dirección postal.',steps:['Internet','La red de tu proveedor','Tu IP pública (la de tu casa)','La red de tu casa (192.168.1.x)','La IP de tu celular (192.168.1.34)'],why:'Igual que país, ciudad, calle y número.'}]},

8:{mod:2,title:'Diagnóstico de red',icon:'terminal',tone:'navy',mins:40,cfp:'Actividad 8 · Informe técnico de la red',
 intro:'«No anda internet». ¿Es el celular, el wifi, el router o la empresa? Con tres comandos lo podés averiguar. Vamos a practicar en una terminal simulada.',
 missions:[
 {type:'term',title:'Tu primera terminal',lead:'Escribí los comandos que pide cada tarea y apretá Enter.',banner:'Terminal de práctica del CFP. Nada de lo que escribas toca tu equipo.',
  tasks:[['Escribí <b>ipconfig</b> para ver la dirección IP de la compu'],['Escribí <b>ping 192.168.1.1</b> para ver si el router responde'],['Escribí <b>ping 8.8.8.8</b> para ver si llegás a internet'],['Escribí <b>ping google.com</b> para ver si funcionan los nombres']],
  cmds:{'ipconfig( /all)?':[[['o','Configuración IP de Windows'],['o',''],['o','Adaptador de LAN inalámbrica Wi-Fi:'],['g','   Dirección IPv4. . . . . . . . : 192.168.1.34'],['o','   Máscara de subred . . . . . . : 255.255.255.0'],['g','   Puerta de enlace predet.. . . : 192.168.1.1'],['y','   (La puerta de enlace es tu router)']],0],
   'ping 192\\.168\\.1\\.1':[[['o','Haciendo ping a 192.168.1.1 con 32 bytes de datos:'],['g','Respuesta desde 192.168.1.1: tiempo=2ms'],['g','Respuesta desde 192.168.1.1: tiempo=3ms'],['y','Enviados = 4, Recibidos = 4, Perdidos = 0  → el router está bien']],1],
   'ping 8\\.8\\.8\\.8':[[['o','Haciendo ping a 8.8.8.8 con 32 bytes de datos:'],['g','Respuesta desde 8.8.8.8: tiempo=21ms'],['g','Respuesta desde 8.8.8.8: tiempo=19ms'],['y','Enviados = 4, Recibidos = 4, Perdidos = 0  → hay salida a internet']],2],
   'ping (www\\.)?google\\.com':[[['o','Haciendo ping a google.com [142.250.79.46]:'],['g','Respuesta desde 142.250.79.46: tiempo=18ms'],['g','Respuesta desde 142.250.79.46: tiempo=17ms'],['y','→ El nombre google.com se tradujo a una IP: los nombres funcionan']],3],
   'tracert .*|traceroute .*':[[['o','Ese comando lo practicamos en la misión 3.']],null],
   'ping .*':[[['o','Haciendo ping…'],['r','Tiempo de espera agotado para esta solicitud.'],['y','Ese equipo no responde. Probá con los de las tareas.']],null],'help|ayuda':[[['y','Comandos de esta práctica: ipconfig, ping, tracert']],null]}},
 {type:'quiz',title:'¿Qué está fallando?',lead:'Leé el resultado de la terminal y decidí dónde está el problema.',items:[
  {mock:'<div class="mock dark"><div class="bar2">Símbolo del sistema</div><div class="body">&gt; ping 192.168.1.1<br>Tiempo de espera agotado.<br>Tiempo de espera agotado.<br>Perdidos = 4 (100% perdidos)</div></div>',q:'El celular está conectado al wifi, pero el router no responde.',opts:['El problema está en el router o en el wifi de casa','Se cayó Google','Está todo bien'],a:0,why:'Si ni siquiera llegás al router, el problema está dentro de tu casa. Primer paso: reiniciar el router.'},
  {mock:'<div class="mock dark"><div class="bar2">Símbolo del sistema</div><div class="body">&gt; ping 192.168.1.1 → Recibidos = 4<br>&gt; ping 8.8.8.8<br>Tiempo de espera agotado. Perdidos = 4</div></div>',q:'El router responde, pero 8.8.8.8 no.',opts:['El problema es el celular','El router anda, pero no hay salida a internet: llamar al proveedor','Hay que cambiar la clave del wifi'],a:1,why:'Tu casa está bien hasta el router. Lo que falla es la conexión del proveedor.'},
  {mock:'<div class="mock dark"><div class="bar2">Símbolo del sistema</div><div class="body">&gt; ping 8.8.8.8 → Recibidos = 4<br>&gt; ping google.com<br>No se pudo encontrar el host google.com.</div></div>',q:'Llegás a 8.8.8.8, pero no a google.com.',opts:['Falla la traducción de nombres a direcciones','Se rompió el cable','Google cerró'],a:0,why:'Hay internet, pero no se traducen los nombres. Es un problema de configuración, no de conexión.'}]},
 {type:'term',title:'El camino de los paquetes',lead:'El comando <b>tracert</b> muestra por dónde pasa tu conexión hasta llegar a un sitio.',banner:'Terminal de práctica. Escribí el comando de la tarea.',
  tasks:[['Escribí <b>tracert google.com</b> y mirá los saltos']],
  cmds:{'tracert (www\\.)?google\\.com':[[['o','Traza a la dirección google.com [142.250.79.46] sobre un máximo de 30 saltos:'],['g','  1     2 ms    192.168.1.1        ← tu router'],['g','  2     9 ms    10.24.0.1          ← red del proveedor'],['g','  3    12 ms    200.51.240.33      ← proveedor'],['g','  4    18 ms    142.250.79.46      ← servidor de Google'],['y','Traza completa. Cada línea es un «salto» del camino.']],0],'.*':[[['r','Para esta tarea escribí: tracert google.com']],null]}},
 {type:'check',title:'Ahora en tu compu (opcional)',lead:'Si tenés una compu con Windows, abrí <b>Símbolo del sistema</b> (buscalo con la lupa) y probá de verdad. Si no tenés compu, marcá solo la última.',min:1,items:['Ejecuté <b>ipconfig</b> y anoté mi dirección IPv4','Ejecuté <b>ping 8.8.8.8</b> y anoté cuántos paquetes llegaron','Ejecuté <b>tracert google.com</b> y conté los saltos','No tengo compu: hice todas las tareas en la terminal simulada']}]},

/* ================= MÓDULO III ================= */
9:{mod:3,title:'Cifrar es guardar bajo llave',icon:'lock',tone:'violet',mins:35,cfp:'Actividad 9 · Mi archivo bajo llave',
 intro:'Cifrar es transformar un mensaje para que solo pueda leerlo quien tenga la clave. Hoy vas a cifrar y descifrar de verdad.',
 missions:[
 {type:'cipher',title:'Cifrá y descifrá',lead:'Probá primero cifrar un mensaje tuyo. Después abrí el mensaje que te dejó Marta.',secret:'IlSS0kQwI15KsixkDaIMJ7PhPiAnR36OdJTbecjAsxC3L2lu0FP6sV1ki7vZH1Db2xp7/nadebFI9S+nYC809EVnfOZvhXtWfRyaHFOubbHFpUfhKEcZF2YfNMMTNATUuKBw+225e9ME57tu',clue:'es lo que más se vende en la panadería, en singular y en minúscula (una palabra, sin espacios).',after:'Esto mismo hace 7-Zip con tus archivos.'},
 {type:'quiz',title:'Una llave o dos',lead:'<b>Simétrico:</b> la misma clave cierra y abre. <b>Asimétrico:</b> un candado público que cualquiera puede cerrar, y una llave privada que solo vos tenés para abrir.',items:[
  {q:'Cifrás un archivo con 7-Zip y la contraseña «mate-con-tortas». Para abrirlo usás la misma contraseña. ¿Qué tipo es?',opts:['Simétrico','Asimétrico'],a:0,why:'Una sola clave para cerrar y abrir: simétrico.'},
  {q:'WhatsApp cifra tus mensajes para que solo el destinatario los lea, sin que ustedes hayan acordado una clave. ¿Qué tipo usa para empezar?',opts:['Simétrico','Asimétrico'],a:1,why:'Cada celular tiene su par de llaves: pública y privada. Por eso no tienen que pasarse una clave.'},
  {q:'Si perdés la contraseña de un archivo cifrado con 7-Zip…',opts:['Lo recupero con el antivirus','Lo abro con otro programa','No hay forma de abrirlo'],a:2,why:'Esa es la fuerza del cifrado y también su riesgo: guardá bien la contraseña.'}]},
 {type:'order',title:'Cifrar con 7-Zip',lead:'Ordená los pasos para proteger un archivo con 7-Zip (es gratis).',steps:['Clic derecho sobre el archivo','Elegir 7-Zip › Añadir al archivo…','Escribir una contraseña larga (dos veces)','Elegir cifrado AES-256','Tocar Aceptar','Comprobar que pide contraseña al abrirlo'],why:'El último paso, otra vez, es comprobar que funciona.'}]},

10:{mod:3,title:'La huella de los archivos',icon:'fingerprint',tone:'violet',mins:30,
 intro:'Cada archivo tiene una huella única llamada hash. Si cambia una sola letra, cambia la huella entera. Vamos a comprobarlo con una huella real.',
 missions:[
 {type:'hash',title:'Mirá la huella cambiar',lead:'Escribí en el cuadro y mirá cómo cambia la huella.',tasks:[
  ['Escribí exactamente <b>hola</b> y mirá su huella','return t==="hola"','Esa es la huella de «hola». Siempre que escribas «hola» va a dar lo mismo.'],
  ['Cambiá una sola letra: escribí <b>Hola</b> (con mayúscula)','return t==="Hola"','Cambió una sola letra… ¡y la huella es totalmente distinta!'],
  ['Volvé a escribir <b>hola</b>: ¿te da la misma huella del principio?','return t==="hola"&&seen["Hola"]!==undefined','Misma entrada, misma huella. Siempre.'],
  ['Escribí una frase larga, de más de 30 letras','return t.length>30','La huella tiene siempre el mismo largo, sea el texto chico o enorme.']]},
 {type:'quiz',title:'Detective de huellas',lead:'Marta descargó el instalador de un programa. El sitio oficial publica su huella. ¿Cuál descarga es la original?',items:[
  {ctx:'Huella publicada en el sitio oficial: <span style="font-family:monospace">3f9a 21c7 … 88b0</span>',q:'¿Qué archivo coincide?',opts:['Descarga A: <span style="font-family:monospace">3f9a 21c7 … 88b0</span>','Descarga B: <span style="font-family:monospace">3f9a 21c8 … 11d4</span>','Descarga C: <span style="font-family:monospace">a07e 5b2f … 88b0</span>'],a:0,why:'Tiene que coincidir entera. B y C se parecen en partes, pero no son iguales: fueron modificadas.'},
  {q:'La huella de tu archivo no coincide con la publicada. ¿Qué hacés?',opts:['Lo instalo igual','Lo borro y lo bajo del sitio oficial','Cambio el nombre del archivo'],a:1,why:'Si no coincide, el archivo cambió en el camino. Puede estar dañado o modificado.'},
  {q:'¿Se puede reconstruir el texto original a partir de su huella?',opts:['Sí, con un programa especial','No, es de un solo sentido'],a:1,why:'El hash es como una huella digital: identifica, pero no permite reconstruir a la persona.'}]},
 {type:'sort',title:'¿Hash o cifrado?',lead:'Se parecen, pero sirven para cosas distintas.',bins:['Hash (huella)','Cifrado (bajo llave)'],
  items:[['Comprobar que un archivo descargado no fue modificado',0],['No se puede volver atrás',0],['Siempre da el mismo largo',0],['Proteger un archivo para que solo lo abra quien tiene la clave',1],['Con la clave correcta se recupera el original',1],['Lo que hace 7-Zip con contraseña',1]],end:'El hash comprueba. El cifrado esconde.'},
 {type:'check',title:'Huella en tu compu (opcional)',lead:'Si tenés compu, probalo de verdad. Si no, marcá la última.',min:1,items:['Creé un archivo <b>huella.txt</b> con la palabra hola','En Windows ejecuté <b>certutil -hashfile huella.txt SHA256</b> (en Mac: <b>shasum -a 256 huella.txt</b>)','Cambié una letra, repetí el comando y vi que la huella cambió','No tengo compu: hice todo en esta práctica']}]},

11:{mod:3,title:'Un llavero para tus claves',icon:'key',tone:'violet',mins:45,cfp:'Actividad 11 · Mi llavero digital',
 intro:'¿Una contraseña distinta y larga para cada cuenta? Imposible de recordar… salvo que uses un gestor de contraseñas: un llavero cifrado que las guarda por vos.',
 missions:[
 {type:'quiz',title:'¿Para qué sirve un gestor?',lead:'Un gestor de contraseñas guarda todas tus claves cifradas. Vos recordás una sola: la contraseña maestra.',items:[
  {q:'Con un gestor de contraseñas, ¿cuántas contraseñas tenés que recordar?',opts:['Todas','Una sola: la maestra','Ninguna'],a:1,why:'Solo la maestra. Por eso tiene que ser muy buena.'},
  {q:'¿Qué pasa si te olvidás la contraseña maestra?',opts:['La empresa te la manda por correo','Podés perder el acceso a todas','No pasa nada'],a:1,why:'Los buenos gestores no pueden ver tu maestra: ni ellos la saben. Anotala en papel y guardala en un lugar seguro de tu casa.'},
  {q:'¿Cuál es una ventaja extra de usar un gestor?',opts:['Genera claves largas y distintas por vos','Hace la compu más rápida','Quita los virus'],a:0,why:'El gestor inventa claves de 20 caracteres o más, distintas para cada sitio.'}]},
 {type:'pwd',title:'Tu contraseña maestra de práctica',lead:'La maestra es la llave del llavero. Practicá cómo debería ser (no uses una real).',
  rules:[['Tiene 20 caracteres o más','return p.length>=20'],['Tiene 5 palabras o más','return p.trim().split(/\\s+/).length>=5'],['Incluye al menos un número','return /\\d/.test(p)'],['No contiene «123», «contraseña» ni «password»','return !/123|contrase|password/i.test(p)']],
  end:'Una maestra así es muy difícil de adivinar y se puede recordar. Hacé la tuya con la misma idea.'},
 {type:'order',title:'Empezar con Bitwarden',lead:'Ordená los pasos para empezar a usar Bitwarden, un gestor gratuito.',steps:['Bajar la app oficial de Bitwarden (tienda del celular o bitwarden.com)','Crear la cuenta con tu correo','Elegir una contraseña maestra larga y anotarla en papel','Agregar tu primera contraseña (por ejemplo, la del correo)','Agregar dos contraseñas más','Probar entrar a un sitio usando el gestor'],why:'Con 3 contraseñas guardadas ya tenés el hábito armado.'},
 CFGS.bitwarden]},

12:{mod:3,title:'Doble llave: la verificación en dos pasos',icon:'otp',tone:'violet',mins:40,cfp:'Actividad 12 · Mi cuenta con doble llave',
 intro:'Aunque alguien sepa tu contraseña, con la verificación en dos pasos no puede entrar sin tu celular. Es la mejor defensa contra el robo de cuentas.',
 missions:[
 {type:'otp',title:'Probalo en una simulación',lead:'Entrá a un correo de práctica. Primero con contraseña, después con el código del celular.',end:'Así funciona en tu correo, en WhatsApp o en el banco. Aunque te roben la contraseña, falta tu celular.'},
 {type:'sort',title:'Algo que sabés, tenés o sos',lead:'Los «factores» son formas de demostrar que sos vos. Lo más seguro es combinar dos distintos.',bins:['Algo que sabés','Algo que tenés','Algo que sos'],
  items:[['Una contraseña',0],['Un PIN',0],['Un código que llega al celular',1],['Una app autenticadora',1],['Tu huella dactilar',2],['Tu cara',2]],end:'Contraseña (sabés) + código del celular (tenés) = dos pasos.'},
 {type:'spot',title:'¡Cuidado con el código!',lead:'El truco más común para robar cuentas de WhatsApp en Argentina es pedirte el código. Encontrá las <b>3 señales</b> en este chat.',need:3,win:'WhatsApp',
  html:'<b>+54 9 11 5xxx-xxxx</b> '+SP('No está en tus contactos: dice ser alguien conocido desde un número nuevo.','(número desconocido)')+'<br><br>«Hola! '+SN('Un saludo amistoso no es señal por sí solo.','¿Cómo andás?')+' Soy Caro del grupo del colegio, '+SP('Excusa típica para justificar el número nuevo.','cambié de número.')+' Te llegó un código de 6 números por error, '+SP('¡Nunca! Ese código es tu llave. Quien lo tenga se queda con tu WhatsApp.','¿me lo pasás?')+' Es urgente 🙏»'}]},

/* ================= MÓDULO IV ================= */
13:{mod:4,title:'Detective de phishing',icon:'mail',tone:'coral',mins:40,
 intro:'El phishing es un engaño: te mandan un mensaje que parece de una empresa real para que hagas clic, pagues o des tus datos. Hoy entrenás el ojo.',
 missions:[
 {type:'spot',title:'El paquete retenido',lead:'Llegó este correo. Encontrá las <b>4 señales</b> de engaño.',need:4,win:'Correo · Bandeja de entrada',
  html:'<b>De:</b> Correo Argentino '+SP('Fijate bien: dice «argentin0» con un cero. Las empresas reales no tienen direcciones así.','&lt;avisos@correo-argentin0.com&gt;')+'<br><b>Asunto:</b> Su paquete está retenido<br><br>'+SP('Una empresa con la que tenés relación usaría tu nombre.','Estimado cliente:')+'<br>No pudimos entregar su paquete por falta de pago de $1.250. '+SP('Te apura para que no pienses.','Si no abona hoy, será devuelto al remitente.')+'<br><br>'+SP('El enlace no va a la página oficial: apuntá el dedo (o el mouse) y mirá la dirección real.','👉 Pagar ahora: correo-arg.pagos-envios.ru')+'<br><br>'+SN('Un saludo así no es la señal.','Gracias por elegirnos.')},
 {type:'quiz',row:true,title:'¿Real o trampa?',lead:'Mirá cada mensaje y decidí.',items:[
  {mock:'<div class="mock"><div class="bar2">SMS</div><div class="body"><b>BANCO</b>: Detectamos un ingreso inusual. Si no fue usted, ingrese en bit.ly/seg-banc0 y confirme su clave.</div></div>',q:'¿Real o trampa?',opts:['Real','Trampa'],a:1,why:'Ningún banco te pide la clave por un enlace. Y el enlace está acortado para esconder adónde va.'},
  {mock:'<div class="mock"><div class="bar2">Notificación</div><div class="body"><b>Mercado Libre</b>: Tu compra «Termo 1 L» está en camino. Seguila en la app.</div></div>',q:'Hiciste esa compra hace dos días. ¿Real o trampa?',opts:['Real','Trampa'],a:0,why:'Lo esperabas, no te pide datos ni te apura, y te manda a la app. Igual, siempre conviene entrar por la app y no por enlaces.'},
  {mock:'<div class="mock"><div class="bar2">WhatsApp</div><div class="body">¡Felicitaciones! 🎉 Ganaste una canasta navideña del supermercado. Completá tus datos en este formulario para recibirla: premios-super.top</div></div>',q:'No participaste de ningún sorteo. ¿Real o trampa?',opts:['Real','Trampa'],a:1,why:'Premio que no pediste + formulario de datos = trampa clásica.'},
  {mock:'<div class="mock"><div class="bar2">Correo</div><div class="body"><b>ANSES</b> &lt;notificaciones@anses-tramites.com&gt;<br>Tiene un beneficio pendiente de cobro. Descargue el formulario adjunto: <b>Formulario.pdf.exe</b></div></div>',q:'¿Real o trampa?',opts:['Real','Trampa'],a:1,why:'Dirección que no es .gob.ar, beneficio sorpresa y un adjunto que es un programa (.exe).'}]},
 {type:'sort',title:'Los trucos del engaño',lead:'Los estafadores usan siempre los mismos botones emocionales. Ubicá cada frase.',bins:['Urgencia','Miedo','Premio','Autoridad'],
  items:[['«Tenés 2 horas para responder»',0],['«Último aviso»',0],['«Tu cuenta será bloqueada»',1],['«Detectamos una compra sospechosa»',1],['«Ganaste un celular»',2],['«Reintegro de $50.000 a tu favor»',2],['«Le escribe el área de seguridad del banco»',3],['«Soy tu jefe, necesito que transfieras ya»',3]],end:'Si un mensaje te hace sentir apuro, miedo o mucha alegría, frená. Ese es el momento de desconfiar.'},
 {type:'order',title:'Me llegó algo raro, ¿qué hago?',lead:'Ordená qué conviene hacer.',steps:['No tocar ningún enlace ni adjunto','Fijarse quién lo manda y la dirección real','Entrar por la app o la web oficial escribiéndola vos','Si era falso, marcarlo como spam y borrarlo','Si ya pusiste datos, cambiar la contraseña enseguida'],why:'Y contale a alguien: a la próxima persona le puede servir.'}]},

14:{mod:4,title:'Al día y en el café',icon:'update',tone:'coral',mins:40,cfp:'Actividad 14 · Al día y en la calle',
 intro:'Las actualizaciones tapan agujeros de seguridad. Y las redes wifi públicas, como la del café o la plaza, tienen sus riesgos. Hoy vemos las dos cosas.',
 missions:[
 {type:'quiz',title:'¿Para qué actualizar?',lead:'Tres situaciones sobre actualizaciones.',items:[
  {q:'¿Por qué es importante instalar las actualizaciones?',opts:['Para que cambie el diseño','Porque corrigen fallas de seguridad que ya se conocen','No importa mucho'],a:1,why:'Cuando se descubre un agujero, se publica la corrección. Los atacantes buscan a quienes no actualizaron.'},
  {q:'La compu de Marta pospuso la actualización 214 días. ¿Qué conviene?',opts:['Seguir posponiendo','Instalarla al cerrar el negocio','Desactivar las actualizaciones'],a:1,why:'Elegí un horario que no moleste, pero instalala. Lo mejor es dejarlas automáticas.'},
  {q:'Un sitio te dice: «Tu navegador está desactualizado, descargá esta actualización». ¿Qué hacés?',opts:['La descargo','Actualizo desde la configuración del propio navegador','La comparto'],a:1,why:'Las actualizaciones reales vienen del sistema o de la app, nunca de un cartel en una página.'}]},
 {type:'spot',title:'Las actualizaciones de la panadería',lead:'Esta es la configuración de la compu de Marta. Encontrá las <b>3 cosas</b> que hay que cambiar.',need:3,win:'Configuración › Windows Update',
  html:'<b>Actualizaciones automáticas:</b> '+SP('Tienen que estar activadas para que se instalen solas.','Desactivadas')+'<br><br><b>Última búsqueda:</b> '+SP('Más de medio año sin buscar actualizaciones: hay muchos agujeros sin tapar.','hace 7 meses')+'<br><br><b>Horario activo:</b> '+SN('Elegir el horario en que usás la compu está bien: así no se reinicia mientras trabajás.','de 7:00 a 20:00')+'<br><br><b>Pausar actualizaciones:</b> '+SP('Pausar «indefinidamente» es lo mismo que no actualizar nunca.','Pausadas indefinidamente')+'<br><br><b>Seguridad de Windows:</b> '+SN('El antivirus activado está bien.','Activada')},
 {type:'tiles',title:'En el wifi del café',lead:'Estás conectado al wifi gratis de un café. Encontrá las <b>4 acciones riesgosas</b>.',items:[
  ['globe','Entrar al home banking para hacer una transferencia',1,'Para el banco, mejor usar los datos móviles del celular, no un wifi público.'],
  ['wifi','Conectarse a una red llamada «Wifi_Gratis_Plaza» que nadie del café conoce',1,'Cualquiera puede crear una red con un nombre tentador. Preguntá cuál es la red real del lugar.'],
  ['form','Cargar los datos de la tarjeta en una tienda nueva',1,'Esperá a estar en una red de confianza para pagar.'],
  ['folder','Tener activado «compartir archivos» en la compu',1,'En una red pública, otros equipos podrían ver tus carpetas.'],
  ['search','Leer las noticias',0,'Leer noticias no expone tus datos.'],
  ['chat','Mandar un mensaje por WhatsApp',0,'WhatsApp cifra tus mensajes de punta a punta.'],
  ['eye','Mirar el pronóstico del tiempo',0,'Sin riesgo.'],
  ['phone','Usar los datos móviles para entrar al banco',0,'¡Eso está bien! Es la alternativa segura.']],end:'En un wifi público: leer sí; bancos, compras y contraseñas, mejor con los datos del celular.'},
 CFGS.updates]},

15:{mod:4,title:'¿Quién ve lo que publico?',icon:'eye',tone:'coral',mins:35,cfp:'Actividad 15 · Mi perfil, revisado',
 intro:'Lo que publicás en redes lo puede ver mucha más gente de la que imaginás. Hoy revisamos qué conviene mostrar y qué no.',
 missions:[
 {type:'spot',title:'El perfil de Tomás',lead:'Este es el perfil público de Tomás. Encontrá los <b>5 datos</b> que no debería mostrar.',need:5,win:'Perfil público · @tomi.panaderia',
  html:'<b>Tomás · 19 años</b><br>'+SP('La fecha completa se usa para adivinar claves y robar identidad. Con el día alcanza, o nada.','🎂 Nacido el 14/03/2007')+'<br>'+SN('Decir la ciudad en general no es lo más grave.','📍 Luján')+' · '+SP('La dirección exacta de la casa no se publica nunca.','Vivo en Av. San Martín 1234')+'<br><br><b>Publicaciones recientes:</b><br>• '+SN('Una foto de comida no tiene riesgo.','Foto de medialunas recién hechas 🥐')+'<br>• '+SP('Avisa que la casa está vacía, y hasta cuándo.','«¡Nos vamos de vacaciones toda la familia hasta el 20!»')+'<br>• '+SP('Nunca se muestra un documento, ni siquiera tapado a medias.','Foto de mi DNI nuevo 😎')+'<br>• '+SP('Muestra en vivo dónde está y a qué hora.','Ubicación en vivo: Club, hoy 18 h')},
 {type:'sort',title:'¿Para quién es?',lead:'Decidí con quién compartirías cada cosa.',bins:['Público','Solo amigos','Nunca en redes'],
  items:[['Tu trabajo como pastelera o pastelero',0],['Fotos de tus productos',0],['Fotos del cumpleaños familiar',1],['Que estás de vacaciones (mejor a la vuelta)',1],['El número de tu tarjeta',2],['Fotos de tu DNI',2],['Tu dirección exacta',2],['Las respuestas a preguntas de seguridad (nombre de tu mascota, tu primera escuela)',2]],end:'Lo que se publica, aunque lo borres, puede haber sido copiado.'},
 {type:'quiz',title:'Situaciones de todos los días',lead:'¿Qué harías?',items:[
  {q:'Una app de juegos pide acceso a tus contactos y a tu ubicación.',opts:['Acepto todo','Niego los permisos que no necesita','Desinstalo el celular'],a:1,why:'Un juego no necesita tus contactos ni dónde estás.'},
  {q:'Un test viral te pregunta el nombre de tu primera mascota y tu calle de la infancia.',opts:['Lo contesto, es divertido','No lo contesto: son preguntas de seguridad','Lo comparto con amigos'],a:1,why:'Son las mismas preguntas que usan algunos sitios para recuperar claves.'},
  {q:'Querés que solo tus amigos vean tus fotos de Instagram.',opts:['Pongo la cuenta privada','Borro todas las fotos','No se puede'],a:0,why:'Configuración › Privacidad de la cuenta › Cuenta privada.'}]}]},


16:{mod:4,title:'La red de la oficina en 3D',icon:'network',tone:'navy',mins:50,cfp:'Actividad 16 · Mi plan de seguridad',
 intro:'Juntamos todo lo del trayecto en una oficina entera, en 3D: sus equipos, sus puntos débiles y cuatro ataques reales. Tu misión: prender las medidas justas para <b>frenar los cuatro</b>. Conviene hacerla en una compu; en el celular también funciona.',
 missions:[
 {type:'sim',title:'Frená los cuatro ataques',origen:'red-oficina-3d',src:'simulaciones/red-oficina-3d.html',
  lead:'Seguí los tres pasos. La simulación te muestra por dónde avanza cada ataque y qué medida lo frena. No hay apuro: podés probar todas las veces que quieras.',
  ataques:[['phishing','Correo falso'],['ransom','Ransomware'],['wifi','Intruso en el Wi-Fi'],['scan','Escaneo desde Internet']],
  guia:[
   {ic:'eye',tone:'teal',t:'Mirá la red',d:'Girala arrastrando con el dedo o el mouse. Tocá un equipo para leer sus riesgos.',demo:'<span class="dbtn">Separar por capas</span><span class="dbtn">Vista inicial</span>'},
   {ic:'bug',tone:'coral',t:'Probá los 4 ataques',d:'En «Probar un ataque», tocá cada uno y mirá hasta dónde llega.',demo:'<span class="dpill bad">Comprometido</span><span class="dpill ok">Frenado</span>'},
   {ic:'shield',tone:'green',t:'Prendé medidas y repetí',d:'En «Medidas de protección», prendé o apagá. Volvé a probar hasta que los 4 digan «Frenado».',demo:'<span class="dsw"></span><span class="dsw off"></span>'}],
  pista:'Dos medidas ya vienen prendidas. Prendé <b>«Equipos actualizados y con antivirus»</b> y volvé a probar los cuatro ataques, uno por uno.',
  solucion:'Con firewall, Wi-Fi con WPA3 y equipos actualizados se frenan los cuatro.'},
 {type:'quiz',title:'¿Hacían falta todas?',lead:'Ahora pensá en lo que viste en la simulación. Si dudás, volvé a probarlo: está en la misión anterior.',items:[
  {q:'¿Cuál es la <b>menor</b> cantidad de medidas que frena los cuatro ataques?',opts:['Dos: firewall y Wi-Fi con WPA3','Tres: firewall, Wi-Fi con WPA3 y equipos actualizados','Las seis'],a:1,why:'El firewall frena el escaneo, el Wi-Fi con WPA3 frena al intruso y el antivirus actualizado frena el correo falso y el ransomware en la PC.',hint:'Con dos, el correo falso y el ransomware igual llegan a la PC.'},
  {q:'Con tres alcanza en la simulación. ¿Por qué <b>igual</b> conviene prender las seis?',opts:['Porque ninguna medida es perfecta: si una falla, la siguiente frena o achica el daño','Porque con más medidas la red anda más rápido','No conviene: con tres alcanza'],a:0,why:'Se llama <b>defensa en capas</b>: un antivirus puede no reconocer un virus nuevo, y ahí te salva lo que viene después.'},
  {q:'Alguien ya consiguió tu contraseña. ¿Qué medida lo frena igual?',opts:['El firewall','El segundo factor','El Wi-Fi con WPA3'],a:1,why:'Con la contraseña sola no alcanza: también necesita el código de tu celular.'},
  {q:'Un ransomware cifró todo el servidor. ¿Qué te salva los archivos?',opts:['Una copia de respaldo desconectada','Apagar el router','El personal capacitado'],a:0,why:'Es tu plan de copias de esta clase: si la copia estaba desconectada, el ransomware no la alcanzó y se restaura.'}]},
 CFGS.robo]},

/* ================= MÓDULO V ================= */
17:{mod:5,title:'No confíes en lo que escriben',icon:'form',tone:'green',mins:35,
 intro:'Todo programa recibe datos de las personas: un nombre, una edad, un precio. Si no los revisa, se rompe… o alguien lo engaña. Revisar los datos se llama validar.',
 missions:[
 {type:'quiz',row:true,title:'¿Aceptar o rechazar?',lead:'Sos el programa de pedidos de la panadería. Decidí si cada dato debería aceptarse.',items:[
  {ctx:'Campo: <b>cantidad de medialunas</b>',q:'<span style="font-family:monospace;font-size:20px">12</span>',opts:['Aceptar','Rechazar'],a:0,why:'Un número entero, positivo y razonable.'},
  {ctx:'Campo: <b>cantidad de medialunas</b>',q:'<span style="font-family:monospace;font-size:20px">-5</span>',opts:['Aceptar','Rechazar'],a:1,why:'No existen las cantidades negativas. Si se acepta, el total del pedido da cualquier cosa.'},
  {ctx:'Campo: <b>cantidad de medialunas</b>',q:'<span style="font-family:monospace;font-size:20px">doce</span>',opts:['Aceptar','Rechazar'],a:1,why:'El programa espera un número. Hay que pedir que se escriba con cifras.'},
  {ctx:'Campo: <b>correo electrónico</b>',q:'<span style="font-family:monospace;font-size:20px">ana.gomez.gmail.com</span>',opts:['Aceptar','Rechazar'],a:1,why:'Le falta la @. Nunca va a llegar el aviso.'},
  {ctx:'Campo: <b>cantidad de medialunas</b>',q:'<span style="font-family:monospace;font-size:20px">99999999</span>',opts:['Aceptar','Rechazar'],a:1,why:'Es un número, pero absurdo. Una buena validación pone también un máximo.'}]},
 {type:'sort',title:'Las reglas de un buen control',lead:'¿Qué regla conviene para cada campo?',bins:['Solo números, con mínimo y máximo','Formato fijo','Largo máximo'],
  items:[['Edad',0],['Cantidad de un producto',0],['Correo electrónico (tiene que tener @)',1],['Fecha de entrega (día/mes/año)',1],['Código postal',1],['Comentario del pedido',2],['Nombre del cliente',2]],end:'Cada dato tiene su regla. Lo que no cumple, se rechaza con un mensaje claro.'},
 {type:'spot',dark:true,title:'Revisá el código',lead:'Este fragmento guarda un pedido. Tocá las <b>2 líneas</b> donde falta un control.',need:2,win:'pedido.js',
  html:'<div>1  '+SN('Leer el nombre está bien.','nombre = leer("nombre")')+'</div><div>2  '+SP('Se usa la cantidad sin revisar que sea un número positivo y razonable.','cantidad = leer("cantidad")')+'</div><div>3  '+SP('El correo se guarda sin comprobar que tenga @ y un formato válido.','correo = leer("correo")')+'</div><div>4  '+SN('Calcular el total está bien… si la cantidad fue validada antes.','total = cantidad * precio')+'</div><div>5  '+SN('Guardar es el paso final.','guardar(nombre, cantidad, correo, total)')+'</div>',end:'La regla de oro: <b>todo lo que entra se revisa antes de usarlo</b>.'},
 {type:'quiz',title:'¿Por qué importa?',lead:'Las validaciones no son solo prolijidad: son seguridad.',items:[
  {q:'Un cliente escribe −10 en la cantidad y el sistema le devuelve plata. ¿Qué parte del trío C-I-D se rompió?',opts:['Confidencialidad','Integridad','Disponibilidad'],a:1,why:'El dato quedó alterado y el total no es verdadero.'},
  {q:'¿Dónde hay que validar los datos?',opts:['Solo en el formulario de la página','También en el servidor, porque el formulario se puede saltear','En ningún lado'],a:1,why:'Quien sabe un poco puede mandar datos sin pasar por tu formulario. El servidor siempre revisa.'}]}]},

18:{mod:5,title:'Los 10 errores más comunes',icon:'warning',tone:'green',mins:35,
 intro:'OWASP es una comunidad que publica la lista de los errores de seguridad más frecuentes en los sitios web: el «OWASP Top 10». Hoy los conocemos con ejemplos de la vida diaria.',
 missions:[
 {type:'sort',title:'Cada error, su ejemplo',lead:'Ubicá cada situación en el tipo de error que corresponde.',bins:['Control de acceso roto','Contraseñas mal guardadas','Inyección','Configuración insegura'],
  items:[['Cambiando un número en la dirección de la web, veo el pedido de otro cliente',0],['Un empleado de mostrador puede borrar los precios del sistema',0],['El sitio guarda las contraseñas tal cual, sin hash',1],['Las claves viajan sin candado (sin https)',1],['Lo que escribo en el buscador se mezcla con las órdenes del sistema',2],['Un comentario con código cambia la página para todos',2],['El panel de control quedó con usuario «admin» y clave «admin»',3],['El sitio muestra mensajes de error con detalles internos',3]],end:'No hace falta saber programar para entender la idea: cada error es una puerta que quedó mal cerrada.'},
 {type:'quiz',title:'¿Qué error es?',lead:'Leé la situación y elegí el tipo de error.',items:[
  {q:'La web de turnos usa una versión vieja de un programa con un agujero conocido.',opts:['Componentes desactualizados','Inyección','Diseño lindo'],a:0,why:'Igual que en tu compu: si no se actualiza, el agujero queda abierto.'},
  {q:'El sitio deja probar contraseñas sin límite, millones de veces.',opts:['Fallas de autenticación','Contraseñas bien guardadas','Configuración correcta'],a:0,why:'Debería bloquear después de varios intentos o pedir un segundo paso.'},
  {q:'Un usuario común entra a «/admin» y puede ver todo.',opts:['Control de acceso roto','Inyección','Componentes desactualizados'],a:0,why:'El sistema no revisa quién es antes de dejarlo pasar.'}]},
 {type:'tiles',title:'Auditá la web de pedidos',lead:'Revisaste la web de pedidos de la panadería. Encontrá los <b>4 problemas</b>.',items:[
  ['unlock','La página de inicio de sesión funciona sin https (sin candado)',1,'Las contraseñas viajan sin protección. Falla criptográfica.'],
  ['password','Contraseña del panel: «admin»',1,'Configuración insegura: la clave de fábrica.'],
  ['update','El sistema usa una versión de 2017 de su programa principal',1,'Componente desactualizado, con agujeros conocidos.'],
  ['link','Cambiando «pedido=105» por «pedido=106» en la dirección, se ve el pedido de otro cliente',1,'Control de acceso roto: no revisa que el pedido sea tuyo.'],
  ['lock','Pide verificación en dos pasos al administrador',0,'¡Muy bien hecho!'],
  ['check','Rechaza cantidades negativas',0,'Validación correcta.'],
  ['shield','Bloquea la cuenta tras 5 intentos fallidos',0,'Bien: frena a quien prueba claves al azar.']],end:'Con este informe, el programador sabe qué arreglar primero.'},
 {type:'order',title:'Qué arreglar primero',lead:'Ordená de lo más urgente a lo menos urgente.',steps:['Que nadie pueda ver pedidos ajenos','Cambiar la clave «admin» del panel','Activar https (el candado)','Actualizar el programa de 2017','Mejorar los mensajes de error'],why:'Primero lo que expone datos de clientes; después lo demás.'}]},

19:{mod:5,title:'Comentarios con trampa (XSS)',icon:'code',tone:'green',mins:35,
 intro:'XSS pasa cuando una página muestra lo que escribe la gente sin revisarlo, y alguien escribe código en vez de texto. Vas a verlo en un blog de práctica, sin riesgos.',
 missions:[
 {type:'xss',title:'El blog de la panadería',lead:'Escribí comentarios y compará qué muestra una página insegura y una segura.',tip:'En HTML, las «etiquetas» entre &lt; y &gt; le dan órdenes a la página. Por ejemplo, &lt;b&gt;texto&lt;/b&gt; pone el texto en negrita.',
  tasks:[['Publicá un comentario normal, por ejemplo: <b>¡Qué ricas las medialunas!</b>','^[^<>]{3,}$','En las dos páginas se ve igual: un texto normal no tiene peligro.'],
   ['Ahora escribí: <b>&lt;b&gt;¡Hola!&lt;/b&gt;</b>','<b>','La página insegura <b>obedeció</b> la orden y lo puso en negrita. La segura lo mostró como texto. Eso es lo que hay que evitar.'],
   ['Probá con: <b>&lt;h1&gt;Cerrado por vacaciones&lt;/h1&gt;</b>','<h1>','Imaginate: cualquier visitante podría cambiar cómo se ve la página para todos.'],
   ['Escribí: <b>&lt;script&gt;</b>','<\\s*script','Con &lt;script&gt; podría ejecutar un programa en la compu de cada lector. La página segura lo neutraliza.']]},
 {type:'quiz',title:'¿Por qué pasa?',lead:'Entendamos la causa.',items:[
  {q:'¿Por qué la página insegura obedeció las etiquetas?',opts:['Porque mostró lo que escribió la persona sin revisarlo','Porque tiene virus','Porque el navegador está roto'],a:0,why:'Mezcló el dato (el comentario) con las órdenes de la página.'},
  {q:'¿Qué hizo la página segura?',opts:['Borró el comentario','Mostró los símbolos &lt; y &gt; como texto, sin obedecerlos','Pidió contraseña'],a:1,why:'A eso se le dice «escapar»: convertir los símbolos especiales en texto común.'},
  {q:'¿A quién perjudica un XSS?',opts:['Solo al que lo escribe','A cada persona que visita la página','A nadie'],a:1,why:'El código malicioso queda guardado y le aparece a cada visitante.'}]},
 {type:'spot',dark:true,title:'Encontrá la línea peligrosa',lead:'Este código muestra los comentarios. Tocá la <b>línea</b> que causa el XSS.',need:1,win:'comentarios.js',
  html:'<div>1  '+SN('Leer el comentario está bien.','comentario = leer("comentario")')+'</div><div>2  '+SN('Controlar el largo está muy bien.','si largo(comentario) &gt; 500: rechazar')+'</div><div>3  '+SP('Acá pega el comentario como si fuera parte de la página. Lo correcto es mostrarlo como texto (escapado).','pagina.agregarHTML(comentario)')+'</div><div>4  '+SN('Guardar es normal.','guardar(comentario)')+'</div>',end:'La corrección: <b>pagina.agregarTexto(comentario)</b>, que muestra los símbolos sin obedecerlos.'},
 {type:'order',title:'La receta contra el XSS',lead:'Ordená lo que hace un sistema seguro con un comentario.',steps:['Recibe el comentario','Revisa el largo y el formato (validación)','Lo guarda','Al mostrarlo, convierte &lt; y &gt; en texto (escapa)','La página lo muestra como texto común'],why:'Validar al entrar y escapar al mostrar: las dos defensas juntas.'}]},

20:{mod:5,title:'Consultas con trampa (SQL Injection)',icon:'database',tone:'green',mins:40,cfp:'Actividad 20 · Revisión de seguridad del sistema de la panadería',
 intro:'Los sistemas guardan datos en bases de datos y les hacen «consultas». Si mezclan lo que escribe la persona con la consulta, alguien puede cambiarle el sentido. Lo vemos solo como concepto, sin programar.',
 missions:[
 {type:'quiz',title:'Una base de datos, en criollo',lead:'Una base de datos es como una planilla gigante. Cada <b>tabla</b> es una hoja, cada <b>fila</b> es un registro, y una <b>consulta</b> es una pregunta que le hace el sistema.',items:[
  {q:'La panadería tiene una tabla «clientes». ¿Qué sería una fila?',opts:['Todos los clientes','Un cliente con su nombre y su teléfono','La palabra «clientes»'],a:1,why:'Cada fila es un registro: un cliente.'},
  {q:'«Buscá en clientes a los que se llaman Ana». ¿Qué es eso?',opts:['Una consulta','Una tabla','Un virus'],a:0,why:'Es una pregunta a la base: una consulta.'},
  {q:'¿Quién escribe la consulta en un sistema de pedidos?',opts:['El cliente','El programa, usando lo que el cliente escribió','Nadie'],a:1,why:'Y ahí está el riesgo: depende de cómo use lo que escribió el cliente.'}]},
 {type:'sqli',title:'Mirá cómo se arma la consulta',lead:'Escribí en el campo «Usuario» y mirá cómo lo usa un sistema inseguro y uno seguro.',
  tasks:[['Escribí un nombre normal, por ejemplo: <b>ana</b>',"^[a-záéíóúñ ]{2,}$"],['Escribí un apellido con apóstrofo: <b>D\'Angelo</b>',"^[^']*'[^']*$"],["Escribí: <b>' o '1'='1</b>","'\\s*(or|o)\\s"]],
  msgOk:'Con un nombre común, las dos formas funcionan igual.',
  msgQuote:'¿Viste? El apóstrofo «cierra» las comillas antes de tiempo y la consulta insegura queda rota. En la segura, el dato va aparte y no pasa nada.',
  msgTrick:'Ahora la consulta insegura dice «…nombre = \'\' o \'1\'=\'1\'». Como «1 es igual a 1» siempre es cierto, <b>le cambiaste el sentido a la pregunta</b>: el sistema podría dejar entrar sin contraseña. En la segura, todo eso es solo un nombre raro que no existe.'},
 {type:'spot',dark:true,title:'Encontrá la línea peligrosa',lead:'Este código arma la consulta de inicio de sesión. Tocá la <b>línea</b> que permite la inyección.',need:1,win:'login.js',
  html:'<div>1  '+SN('Leer el usuario está bien.','usuario = leer("usuario")')+'</div><div>2  '+SN('Validar el largo es una buena práctica, aunque no alcanza sola.','si largo(usuario) &gt; 30: rechazar')+'</div><div>3  '+SP('Pega el texto del usuario dentro de la consulta. Lo correcto es pasarlo como dato aparte (consulta parametrizada).','consulta = "BUSCAR usuarios DONDE nombre = \'" + usuario + "\'"')+'</div><div>4  '+SN('Ejecutar la consulta es el paso normal.','resultado = base.ejecutar(consulta)')+'</div>',end:'La corrección: <b>base.ejecutar("BUSCAR usuarios DONDE nombre = ?", usuario)</b>. El dato nunca se mezcla con la orden.'},
 {type:'sort',title:'Repaso del módulo',lead:'Ubicá cada defensa en el problema que resuelve.',bins:['Datos inválidos','XSS','SQL Injection'],
  items:[['Rechazar cantidades negativas',0],['Pedir @ en el correo',0],['Mostrar los comentarios como texto (escapar)',1],['No obedecer etiquetas que escribe la gente',1],['Pasar los datos aparte de la consulta',2],['Nunca pegar lo que escribe el usuario dentro de la orden',2]],end:'Las tres tienen la misma raíz: <b>no confiar en lo que escribe la gente y no mezclarlo con las órdenes</b>.'}]}
};

registrarTrayecto({id:'seguridad',nombre:'Seguridad Informática Básico',icono:'shield',tono:'teal',prefijo:'P',sal:'cfp403-seg-lab-v1',
 modulos:{1:'Fundamentos',2:'Redes e Internet',3:'Criptografía y contraseñas',4:'Hábitos digitales',5:'Software seguro'},
 iconosModulo:{1:'shield',2:'wifi',3:'key',4:'eye',5:'code'},practicas:PR_SEG});
