/* Escenarios del simulador «Configurá» para Seguridad Informática Básico.
   Son pantallas de mentira, parecidas a las reales: los nombres de los menús
   cambian un poco según la marca y la versión. */
var WPA_OK = ['WPA2-PSK (AES)', 'WPA2/WPA3', 'WPA3-SAE'];
function CFG_OTRA(t) { return { title: t, items: [{ info: 'En esta sección no está lo que buscás. Tocá <b>‹</b> para volver.' }] }; }

var CFGS = {

/* ------------------------------------------------------------ Clase 6 · Router */
router: {
  type: 'cfg', device: 'router', title: 'Configurá el router de Marta',
  lead: 'Es un panel de router de práctica, igual a los de verdad. Entrá con los datos de la etiqueta y dejá el wifi bien cerrado. <b>No toca ningún router real.</b>',
  intro: 'Escribí <b>192.168.1.1</b> en el navegador (ya está escrito) y entrá con los datos de la etiqueta.',
  fin: 'El wifi de la panadería quedó cerrado. En la vida real, al guardar se desconectan todos los equipos y hay que volver a conectarlos con la clave nueva.',
  start: 'login',
  state: { ssid: 'Panaderia_Marta', sec: 'WEP', key: 'marta123', wps: true, adm: 'admin', inv: false },
  screens: {
    login: { title: 'Iniciar sesión', login: { next: 'home', user: function () { return 'admin'; }, pass: function (s) { return s.adm; },
      etiqueta: [['Modelo', 'Router WR-840'], ['Panel', 'http://192.168.1.1'], ['Usuario', 'admin'], ['Contraseña', 'admin'], ['Red Wi-Fi', 'Panaderia_Marta']] } },
    home: { title: 'Estado del router', items: [
      { info: function (s) { return 'Conectado a internet · <b>6 equipos</b> conectados · Red: <b>' + esc(s.ssid) + '</b>'; } },
      { nav: 'wifi', t: 'Wi-Fi', d: 'Nombre, seguridad y clave', ic: 'wifi', tone: 'teal' },
      { nav: 'wps', t: 'WPS', d: 'Conexión con botón', ic: 'toggle', tone: 'amber' },
      { nav: 'inv', t: 'Red de invitados', d: 'Wi-Fi aparte para visitas', ic: 'users', tone: 'violet' },
      { nav: 'equipos', t: 'Equipos conectados', ic: 'laptop', tone: 'navy' },
      { nav: 'sistema', t: 'Sistema', d: 'Clave del panel, hora, reinicio', ic: 'gear', tone: 'navy' },
      { act: 'salir', t: 'Cerrar sesión', alt: true, run: function () { return { nav: 'login', msg: 'Cerraste la sesión.' }; } }] },
    wifi: { title: 'Wi-Fi › Configuración', save: true,
      valid: function (s) {
        if (!s.ssid) return 'La red necesita un nombre.';
        if (s.sec !== 'Abierta (sin clave)' && (s.key || '').length < 8) return 'La clave del Wi-Fi tiene que tener al menos 8 caracteres.';
      },
      onSave: function (s) { return 'Guardado. Los equipos se desconectan y vuelven a entrar con la clave nueva.'; },
      items: [
        { txt: 'ssid', t: 'Nombre de la red (SSID)' },
        { sel: 'sec', t: 'Tipo de seguridad', opts: ['Abierta (sin clave)', 'WEP', 'WPA2-PSK (AES)', 'WPA2/WPA3', 'WPA3-SAE'] },
        { pwd: 'key', t: 'Clave del Wi-Fi' },
        { info: 'Si tenés equipos viejos que no se conectan con WPA3, elegí <b>WPA2/WPA3</b>: sirve para todos.' },
        { save: true }] },
    wps: { title: 'WPS', save: true, items: [
      { info: 'WPS deja conectar un equipo apretando un botón o con un PIN de 8 números, <b>sin saber la clave</b>. Ese PIN se puede adivinar.' },
      { tog: 'wps', t: 'WPS activado' }, { save: true }] },
    inv: { title: 'Red de invitados', save: true, items: [
      { info: 'Una red aparte para clientes y visitas: tienen internet, pero no ven tus equipos.' },
      { tog: 'inv', t: 'Red de invitados activada', d: 'Opcional' }, { save: true }] },
    equipos: { title: 'Equipos conectados', items: [{ info: 'Celular de Marta · Notebook del local · Celular de Tomás · Tele del local · Impresora · <b>android-7c21 (no lo reconocen)</b>' },
      { info: 'Si aparece un equipo desconocido, lo más simple es <b>cambiar la clave del Wi-Fi</b>: se desconectan todos y solo vuelven los que la saben.' }] },
    sistema: { title: 'Sistema', items: [
      { nav: 'clave', t: 'Contraseña del panel', d: 'La que se usa para entrar acá', ic: 'key', tone: 'amber' },
      { nav: 'hora', t: 'Fecha y hora', ic: 'clock', tone: 'navy' },
      { nav: 'reini', t: 'Reiniciar el router', ic: 'update', tone: 'navy' }] },
    clave: { title: 'Sistema › Contraseña del panel', save: true,
      onSave: function () { return 'Guardado. La próxima vez vas a entrar con la clave nueva: anotala en un lugar seguro.'; },
      items: [{ info: 'Es <b>distinta</b> de la clave del Wi-Fi. La de fábrica («admin») la conoce cualquiera.' }, { pwd: 'adm', t: 'Nueva contraseña del panel' }, { save: true }] },
    hora: CFG_OTRA('Fecha y hora'),
    reini: CFG_OTRA('Reiniciar')
  },
  goals: [
    { t: 'Seguridad del Wi-Fi en <b>WPA2 o WPA3</b>', ok: function (s) { return WPA_OK.indexOf(s.sec) >= 0; }, ruta: 'Wi-Fi › Tipo de seguridad › elegí WPA2/WPA3 › Guardar.' },
    { t: 'Clave del Wi-Fi larga: <b>12 o más</b> caracteres y sin «marta»', ok: function (s) { return (s.key || '').length >= 12 && !/marta/i.test(s.key); }, ruta: 'Wi-Fi › Clave del Wi-Fi: una frase como «medialunas de manteca 2026» › Guardar.' },
    { t: '<b>WPS</b> apagado', ok: function (s) { return !s.wps; }, ruta: 'Volvé al inicio del panel › WPS › apagá el interruptor › Guardar.' },
    { t: 'Clave del <b>panel</b> cambiada: no «admin», 10 o más caracteres', ok: function (s) { return s.adm !== 'admin' && (s.adm || '').length >= 10; }, ruta: 'Sistema › Contraseña del panel › escribí una nueva › Guardar.' }]
},

/* ------------------------------------------------------- Clase 2 · Cuenta estándar */
cuenta: {
  type: 'cfg', device: 'win', title: 'Una cuenta para Tomás',
  lead: 'Tomás usa la compu del local con la cuenta de Marta, que es <b>administrador</b>. Creale su propia cuenta <b>estándar</b> con contraseña. Es un Windows de práctica.',
  intro: 'Empezá por <b>Configuración</b> en el escritorio.',
  fin: 'Tomás ya tiene su cuenta estándar: puede trabajar, pero no instalar programas sin permiso de Marta.',
  start: 'esc',
  state: { users: [{ n: 'Marta', t: 'Administrador', p: true }], sel: 0, nn: '', np: '', np2: '', tipo: 'Usuario estándar' },
  screens: {
    esc: { title: 'Escritorio', grid: true, items: [{ nav: 'home', t: 'Configuración', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Explorador', ic: 'folder', tone: 'amber' }, { nav: 'nada', t: 'Navegador', ic: 'globe', tone: 'teal' }] },
    nada: { title: 'Otra aplicación', items: [{ info: 'Esta aplicación no sirve para esto. Tocá <b>‹</b> y abrí <b>Configuración</b>.' }] },
    home: { title: 'Configuración', items: [
      { nav: 'o1', t: 'Sistema', d: 'Pantalla, sonido, notificaciones', ic: 'laptop' },
      { nav: 'o2', t: 'Red e Internet', d: 'Wi-Fi, VPN', ic: 'wifi', tone: 'teal' },
      { nav: 'cuentas', t: 'Cuentas', d: 'Tus cuentas, correo, otros usuarios', ic: 'user', tone: 'violet' },
      { nav: 'o3', t: 'Windows Update', d: 'Actualizaciones', ic: 'update', tone: 'green' }] },
    o1: CFG_OTRA('Sistema'), o2: CFG_OTRA('Red e Internet'), o3: CFG_OTRA('Windows Update'),
    cuentas: { title: 'Cuentas', items: [
      { nav: 'tuinfo', t: 'Tu información', d: 'Marta · Administrador', ic: 'user', tone: 'violet' },
      { nav: 'o4', t: 'Opciones de inicio de sesión', d: 'PIN, contraseña', ic: 'key', tone: 'amber' },
      { nav: 'otros', t: 'Otros usuarios', d: 'Acceso a esta compu para otras personas', ic: 'users', tone: 'teal' }] },
    o4: CFG_OTRA('Opciones de inicio de sesión'),
    tuinfo: { title: 'Tu información', items: [{ info: '<b>Marta</b> · Cuenta local · <b>Administrador</b>' }] },
    otros: { title: 'Cuentas › Otros usuarios', items: [
      { info: 'Agregá una cuenta para cada persona que use esta compu.' },
      { act: 'add', t: '+ Agregar cuenta', run: function () { return { nav: 'msa1' }; } },
      { list: function (s) { return s.users.map(function (u, i) { return i ? { t: u.n, d: u.t === 'Administrador' ? 'Administrador · Cuenta local' : 'Cuenta local (estándar)', ic: 'user', tone: 'teal', nav: 'usr', set: { sel: i } } : null; }).filter(Boolean); } }] },
    msa1: { title: '¿Cómo iniciará sesión esta persona?', win: 'Cuenta de Microsoft', items: [
      { info: 'Escribí el correo o el teléfono de la persona que querés agregar.' },
      { txt: 'tmp', t: 'Correo o teléfono' },
      { act: 'sig', t: 'Siguiente', run: function () { return { err: 'Tomás no tiene cuenta de Microsoft. Buscá la opción de abajo.' }; } },
      { act: 'no', t: 'No tengo la información de inicio de sesión de esta persona', link: true, run: function () { return { nav: 'msa2' }; } }] },
    msa2: { title: 'Crear cuenta', win: 'Cuenta de Microsoft', items: [
      { info: 'Podés crear una cuenta de Microsoft nueva o una cuenta solo para esta compu.' },
      { act: 'crearms', t: 'Siguiente', alt: true, run: function () { return { err: 'No hace falta crear una cuenta de Microsoft. Elegí la opción de abajo.' }; } },
      { act: 'local', t: 'Agregar un usuario sin cuenta de Microsoft', link: true, run: function () { return { nav: 'nueva' }; } }] },
    nueva: { title: 'Crear un usuario para este equipo', win: 'Cuenta de Microsoft', items: [
      { txt: 'nn', t: '¿Quién va a usar esta compu?', ph: 'Nombre de usuario' },
      { pwd: 'np', t: 'Contraseña' }, { pwd: 'np2', t: 'Volvé a escribir la contraseña' },
      { act: 'ok', t: 'Siguiente', run: function (s) {
        if (!s.nn.trim()) return { err: 'Escribí el nombre de usuario.' };
        if (s.np !== s.np2) return { err: 'Las contraseñas no coinciden.' };
        s.users.push({ n: s.nn.trim(), t: 'Usuario estándar', p: s.np.length >= 8 });
        s.nn = ''; s.np = ''; s.np2 = '';
        return { nav: 'otros', msg: 'Cuenta creada. Windows crea las cuentas nuevas como <b>estándar</b>.' };
      } }] },
    usr: { title: 'Cuenta', onEnter: function (s) { s.tipo = s.users[s.sel].t; }, items: [
      { info: function (s) { var u = s.users[s.sel]; return '<b>' + esc(u.n) + '</b> · ' + u.t; } },
      { act: 'tipo', t: 'Cambiar el tipo de cuenta', alt: true, run: function () { return { nav: 'tipo' }; } },
      { act: 'quitar', t: 'Quitar esta cuenta', alt: true, run: function (s) { s.users.splice(s.sel, 1); return { nav: 'otros', msg: 'Cuenta quitada.' }; } }] },
    tipo: { title: 'Cambiar el tipo de cuenta', items: [
      { sel: 'tipo', t: 'Tipo de cuenta', opts: ['Administrador', 'Usuario estándar'] },
      { act: 'acep', t: 'Aceptar', run: function (s) { s.users[s.sel].t = s.tipo; return { nav: 'otros', msg: 'Tipo de cuenta cambiado.' }; } }] }
  },
  goals: [
    { t: 'Existe una cuenta para <b>Tomás</b>', ok: function (s) { return s.users.some(function (u, i) { return i && /tom/i.test(u.n); }); }, ruta: 'Configuración › Cuentas › Otros usuarios › Agregar cuenta › «No tengo la información…» › «Agregar un usuario sin cuenta de Microsoft».' },
    { t: 'La cuenta de Tomás es <b>estándar</b>', ok: function (s) { return s.users.some(function (u, i) { return i && /tom/i.test(u.n) && u.t === 'Usuario estándar'; }); }, ruta: 'Otros usuarios › Tomás › Cambiar el tipo de cuenta › Usuario estándar.' },
    { t: 'Tiene contraseña de <b>8 o más</b> caracteres', ok: function (s) { return s.users.some(function (u, i) { return i && /tom/i.test(u.n) && u.p; }); }, ruta: 'Si ya la creaste sin contraseña, quitala y creala de nuevo con una de 8 o más.' }]
},

/* ------------------------------------------------- Clase 4 · Extensiones y antivirus */
revision: {
  type: 'cfg', device: 'win', title: 'Desenmascará la factura',
  lead: 'En la compu de Marta hay una «factura» sospechosa en Descargas. Mostrá las extensiones, examiná con el antivirus y sacala del medio. Es un Windows de práctica.',
  intro: 'Empezá por el <b>Explorador de archivos</b>.',
  fin: '¡Desenmascarada! «Factura_Marzo.pdf» era en realidad un programa (.exe). Con las extensiones visibles, ese truco ya no te agarra.',
  start: 'esc',
  state: { ext: false, oc: false, scan: false, amenaza: true, sel: '' },
  screens: {
    esc: { title: 'Escritorio', grid: true, items: [{ nav: 'exp', t: 'Explorador de archivos', ic: 'folder', tone: 'amber' }, { nav: 'seg', t: 'Seguridad de Windows', ic: 'shield', tone: 'navy' }, { nav: 'nada', t: 'Navegador', ic: 'globe', tone: 'teal' }] },
    nada: { title: 'Otra aplicación', items: [{ info: 'Esta aplicación no sirve para esto. Tocá <b>‹</b>.' }] },
    exp: { title: 'Descargas', win: 'Explorador de archivos', items: [
      { nav: 'ver', t: 'Ver ▾', d: 'Cómo se muestran los archivos', ic: 'eye', tone: 'teal' },
      { list: function (s) {
        var f = [['Factura_Marzo.pdf', '.exe', 'file', 'coral'], ['Foto_cumple', '.jpg', 'file', 'teal'], ['Presupuesto', '.xlsx', 'file', 'green']];
        return f.filter(function (x, i) { return i || s.amenaza; }).map(function (x) {
          return { t: s.ext ? x[0] + '<b style="color:#cf352e">' + x[1] + '</b>' : x[0], d: x[1] === '.exe' ? (s.ext ? 'Aplicación' : 'Documento') : 'Archivo', ic: x[2], tone: x[3], nav: 'arch', set: { sel: x[0] + x[1] } };
        });
      } }] },
    ver: { title: 'Ver › Mostrar', win: 'Explorador de archivos', items: [
      { tog: 'ext', t: 'Extensiones de nombre de archivo', d: 'Muestra el final del nombre: .pdf, .jpg, .exe…' },
      { tog: 'oc', t: 'Elementos ocultos' }] },
    arch: { title: 'Archivo', win: 'Explorador de archivos', items: [
      { info: function (s) { return 'Archivo: <b>' + esc(s.ext ? s.sel : s.sel.replace(/\.(exe|jpg|xlsx)$/, '')) + '</b>'; } },
      { act: 'abrir', t: 'Abrir', alt: true, run: function (s) { return /exe$/.test(s.sel) ? { err: '¡Cuidado! Ese archivo es un programa: si lo abrís, se ejecuta. Mejor no.' } : 'Se abrió el archivo.'; } },
      { act: 'borrar', t: 'Eliminar', alt: true, run: function (s) { if (/exe$/.test(s.sel)) { s.amenaza = false; return { nav: 'exp', msg: 'Archivo eliminado.' }; } return { err: 'Ese archivo es de Marta y está bien. No lo borres.' }; } }] },
    seg: { title: 'Seguridad de Windows', win: 'Seguridad de Windows', items: [
      { nav: 'virus', t: 'Protección contra virus y amenazas', ic: 'shield', tone: 'green' },
      { nav: 's2', t: 'Protección de cuentas', ic: 'user', tone: 'violet' },
      { nav: 's3', t: 'Firewall y protección de red', ic: 'wifi', tone: 'teal' }] },
    s2: CFG_OTRA('Protección de cuentas'), s3: { title: 'Firewall y protección de red', items: [{ info: 'El firewall está <b>activado</b>. No hace falta tocar nada acá.' }] },
    virus: { title: 'Protección contra virus y amenazas', win: 'Seguridad de Windows', items: [
      { info: function (s) { return s.scan ? (s.amenaza ? '<b>Se encontró 1 amenaza.</b>' : 'Último examen: <b>hoy</b> · Sin amenazas') : 'Último examen: <b>hace 41 días</b>'; } },
      { act: 'ex', t: 'Examen rápido', run: function (s) { s.scan = true; return s.amenaza ? 'Examen terminado: <b>1 amenaza</b> en Descargas › Factura_Marzo.pdf.exe (troyano).' : 'Examen terminado: no se encontraron amenazas.'; } },
      { act: 'q', t: 'Quitar amenazas', alt: true, run: function (s) { if (!s.scan) return { err: 'Primero hacé un examen.' }; if (!s.amenaza) return 'No hay amenazas para quitar.'; s.amenaza = false; return 'Amenaza quitada y puesta en cuarentena.'; } }] }
  },
  goals: [
    { t: 'Extensiones <b>visibles</b> en el Explorador', ok: function (s) { return s.ext; }, ruta: 'Explorador de archivos › Ver › Mostrar › Extensiones de nombre de archivo.' },
    { t: '<b>Examen rápido</b> del antivirus hecho', ok: function (s) { return s.scan; }, ruta: 'Escritorio › Seguridad de Windows › Protección contra virus y amenazas › Examen rápido.' },
    { t: 'La factura falsa <b>eliminada</b>', ok: function (s) { return !s.amenaza; }, ruta: 'Desde el Explorador (tocá el archivo › Eliminar) o desde el antivirus (Quitar amenazas).' }]
},

/* ------------------------------------------------- Clase 14 · Actualizaciones */
updates: {
  type: 'cfg', title: 'Poné al día un equipo',
  lead: 'Elegí un equipo de práctica y dejalo actualizado, con las actualizaciones automáticas prendidas. Después hacé lo mismo en tu equipo de verdad.',
  fin: 'Equipo al día. Con las automáticas prendidas, los parches de seguridad llegan solos.',
  variantes: [
    { t: 'Android', ic: 'phone', tone: 'green', device: 'android', start: 'ini',
      intro: 'En los Samsung el menú dice «Actualización de software»; en otros, «Sistema › Actualización del sistema».',
      state: { sys: true, apps: 4, auto: 'No actualizar apps automáticamente' },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'ps', t: 'Play Store', ic: 'store', tone: 'green' }, { nav: 'nada', t: 'Cámara', ic: 'eye', tone: 'violet' }] },
        nada: { title: 'Cámara', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        aj: { title: 'Ajustes', items: [{ nav: 'o1', t: 'Conexiones', ic: 'wifi', tone: 'teal' }, { nav: 'o2', t: 'Pantalla', ic: 'phone' }, { nav: 'o3', t: 'Batería', ic: 'plug', tone: 'amber' }, { nav: 'su', t: 'Actualización de software', ic: 'update', tone: 'green' }] },
        o1: CFG_OTRA('Conexiones'), o2: CFG_OTRA('Pantalla'), o3: CFG_OTRA('Batería'),
        su: { title: 'Actualización de software', items: [
          { info: function (s) { return s.sys ? 'Hay una actualización disponible: <b>parche de seguridad de noviembre</b>.' : 'Tu software está <b>actualizado</b>.'; } },
          { act: 'd', t: 'Descargar e instalar', run: function (s) { if (!s.sys) return 'No hay nada para instalar.'; s.sys = false; return 'Instalado. El celular se reinició y quedó al día.'; } }] },
        ps: { title: 'Play Store', items: [{ info: 'Para ver tus apps, tocá tu foto de perfil (arriba a la derecha).' }, { nav: 'perfil', t: 'Tu perfil', d: 'Ana', ic: 'user', tone: 'violet' }] },
        perfil: { title: 'Tu perfil', items: [{ nav: 'adm', t: 'Administrar apps y dispositivo', ic: 'box', tone: 'green' }, { nav: 'pc', t: 'Configuración', ic: 'gear' }] },
        adm: { title: 'Administrar apps y dispositivo', items: [
          { info: function (s) { return s.apps ? '<b>' + s.apps + ' actualizaciones</b> disponibles' : 'Todas las apps están actualizadas'; } },
          { act: 'u', t: 'Actualizar todo', run: function (s) { s.apps = 0; return 'Apps actualizadas.'; } }] },
        pc: { title: 'Configuración', items: [{ nav: 'red', t: 'Preferencias de red', ic: 'wifi', tone: 'teal' }, { nav: 'o4', t: 'General', ic: 'gear' }] },
        o4: CFG_OTRA('General'),
        red: { title: 'Preferencias de red', items: [{ sel: 'auto', t: 'Actualizar apps automáticamente', opts: ['Con cualquier red', 'Solo con Wi-Fi', 'No actualizar apps automáticamente'] }] }
      },
      goals: [
        { t: 'Sistema <b>actualizado</b>', ok: function (s) { return !s.sys; }, ruta: 'Ajustes › Actualización de software › Descargar e instalar.' },
        { t: 'Apps <b>actualizadas</b>', ok: function (s) { return !s.apps; }, ruta: 'Play Store › tu perfil › Administrar apps y dispositivo › Actualizar todo.' },
        { t: 'Apps con actualización <b>automática</b>', ok: function (s) { return s.auto !== 'No actualizar apps automáticamente'; }, ruta: 'Play Store › tu perfil › Configuración › Preferencias de red › Actualizar apps automáticamente › Solo con Wi-Fi.' }] },
    { t: 'iPhone', ic: 'phone', tone: 'navy', device: 'iphone', start: 'ini',
      state: { ios: true, dl: false, inst: false, apps: false },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Fotos', ic: 'eye', tone: 'amber' }, { nav: 'nada', t: 'Mail', ic: 'mail', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        aj: { title: 'Ajustes', items: [{ nav: 'o1', t: 'Wi-Fi', ic: 'wifi', tone: 'teal' }, { nav: 'gen', t: 'General', ic: 'gear' }, { nav: 'as', t: 'App Store', ic: 'store', tone: 'navy' }, { nav: 'o2', t: 'Batería', ic: 'plug', tone: 'green' }] },
        o1: CFG_OTRA('Wi-Fi'), o2: CFG_OTRA('Batería'),
        gen: { title: 'General', items: [{ nav: 'o3', t: 'Información', ic: 'phone' }, { nav: 'su', t: 'Actualización de software', ic: 'update', tone: 'green' }, { nav: 'o4', t: 'Almacenamiento', ic: 'box' }] },
        o3: CFG_OTRA('Información'), o4: CFG_OTRA('Almacenamiento'),
        su: { title: 'Actualización de software', items: [
          { info: function (s) { return s.ios ? 'iOS 26.1 · <b>Corrige fallas de seguridad</b>' : 'iOS está <b>actualizado</b>.'; } },
          { act: 'a', t: 'Actualizar ahora', run: function (s) { if (!s.ios) return 'No hay nada para instalar.'; s.ios = false; return 'Instalado. El iPhone se reinició y quedó al día.'; } },
          { nav: 'auto', t: 'Actualizaciones automáticas', d: 'Descargar e instalar solas' }] },
        auto: { title: 'Actualizaciones automáticas', items: [{ tog: 'dl', t: 'Descargar actualizaciones de iOS' }, { tog: 'inst', t: 'Instalar actualizaciones de iOS', d: 'De noche, cargando y con Wi-Fi' }] },
        as: { title: 'App Store', items: [{ tog: 'apps', t: 'Actualizaciones de apps', d: 'Descargas automáticas' }] }
      },
      goals: [
        { t: 'iOS <b>actualizado</b>', ok: function (s) { return !s.ios; }, ruta: 'Ajustes › General › Actualización de software › Actualizar ahora.' },
        { t: 'Actualizaciones de iOS <b>automáticas</b> (descargar e instalar)', ok: function (s) { return s.dl && s.inst; }, ruta: 'Ajustes › General › Actualización de software › Actualizaciones automáticas › prendé las dos.' },
        { t: 'Apps con actualización <b>automática</b>', ok: function (s) { return s.apps; }, ruta: 'Ajustes › App Store › Actualizaciones de apps.' }] },
    { t: 'Compu con Windows', ic: 'laptop', tone: 'teal', device: 'win', start: 'esc',
      state: { pausa: true, pend: true, reinicio: false },
      screens: {
        esc: { title: 'Escritorio', grid: true, items: [{ nav: 'home', t: 'Configuración', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Navegador', ic: 'globe', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        home: { title: 'Configuración', items: [{ nav: 'o1', t: 'Sistema', ic: 'laptop' }, { nav: 'o2', t: 'Cuentas', ic: 'user', tone: 'violet' }, { nav: 'wu', t: 'Windows Update', d: 'Actualizaciones', ic: 'update', tone: 'green' }] },
        o1: CFG_OTRA('Sistema'), o2: CFG_OTRA('Cuentas'),
        wu: { title: 'Windows Update', items: [
          { info: function (s) { return s.pausa ? '<b>Las actualizaciones están pausadas</b> hasta el 30/12.' : s.pend ? 'Hay actualizaciones disponibles: <b>Actualización de seguridad de noviembre</b>.' : s.reinicio ? '<b>Hace falta reiniciar</b> para terminar de instalar.' : 'Estás al día.'; } },
          { act: 'r', t: 'Reanudar actualizaciones', alt: true, run: function (s) { if (!s.pausa) return 'Ya están activas.'; s.pausa = false; return 'Actualizaciones reanudadas.'; } },
          { act: 'b', t: 'Buscar actualizaciones e instalar', run: function (s) { if (s.pausa) return { err: 'Están pausadas: primero tocá «Reanudar actualizaciones».' }; if (!s.pend) return 'No hay nada nuevo.'; s.pend = false; s.reinicio = true; return 'Descargadas e instaladas. Falta reiniciar.'; } },
          { act: 'x', t: 'Reiniciar ahora', alt: true, run: function (s) { if (!s.reinicio) return { err: 'Todavía no hay nada para terminar de instalar.' }; s.reinicio = false; return 'La compu se reinició y quedó al día.'; } }] }
      },
      goals: [
        { t: 'Actualizaciones <b>reanudadas</b> (no pausadas)', ok: function (s) { return !s.pausa; }, ruta: 'Configuración › Windows Update › Reanudar actualizaciones.' },
        { t: 'Actualizaciones <b>instaladas</b> y compu <b>reiniciada</b>', ok: function (s) { return !s.pend && !s.reinicio; }, ruta: 'Windows Update › Buscar actualizaciones e instalar › Reiniciar ahora.' }] }]
},

/* ------------------------------------------------- Clase 16 · Bloqueo a distancia */
robo: {
  type: 'cfg', title: 'Prepará el celular por si te lo roban',
  lead: 'Dejá el celular de práctica listo para encontrarlo, bloquearlo o borrarlo a distancia. Se hace <b>antes</b> de que pase: después ya es tarde.',
  fin: 'Celular preparado. Si te lo roban, desde otro equipo entrás a <b>android.com/find</b> (Android) o <b>icloud.com/find</b> (iPhone) y lo bloqueás o lo borrás.',
  variantes: [
    { t: 'Android', ic: 'phone', tone: 'green', device: 'android', start: 'ini',
      state: { fmd: false, loc: false, bloq: 'Deslizar', pin: '' },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Cámara', ic: 'eye', tone: 'violet' }, { nav: 'nada', t: 'Mensajes', ic: 'chat', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        aj: { title: 'Ajustes', items: [
          { nav: 'o1', t: 'Conexiones', ic: 'wifi', tone: 'teal' },
          { nav: 'seg', t: 'Seguridad y privacidad', d: 'Bloqueo de pantalla', ic: 'lock', tone: 'navy' },
          { nav: 'ubi', t: 'Ubicación', ic: 'globe', tone: 'green' },
          { nav: 'goo', t: 'Google', d: 'Servicios de Google', ic: 'user', tone: 'amber' }] },
        o1: CFG_OTRA('Conexiones'),
        seg: { title: 'Seguridad y privacidad', items: [{ nav: 'bloq', t: 'Bloqueo de pantalla', d: 'Cómo se desbloquea el celular', ic: 'lock' }, { nav: 'o2', t: 'Permisos de apps', ic: 'toggle' }] },
        o2: CFG_OTRA('Permisos de apps'),
        bloq: { title: 'Bloqueo de pantalla', save: true,
          valid: function (s) { if ((s.bloq === 'PIN' || s.bloq === 'Contraseña') && (s.pin || '').length < 6) return 'El PIN o la contraseña tienen que tener 6 o más caracteres.'; },
          items: [{ sel: 'bloq', t: 'Tipo de bloqueo', opts: ['Ninguno', 'Deslizar', 'Patrón', 'PIN', 'Contraseña'] },
            { pwd: 'pin', t: 'PIN o contraseña (si elegiste uno de esos)' },
            { info: '«Deslizar» no protege nada: cualquiera lo abre. Usá <b>PIN</b>, <b>patrón</b> o <b>contraseña</b>.' }, { save: true }] },
        ubi: { title: 'Ubicación', items: [{ tog: 'loc', t: 'Usar ubicación', d: 'Hace falta para encontrar el celular' }] },
        goo: { title: 'Google', items: [{ nav: 'o3', t: 'Copia de seguridad', ic: 'cloud', tone: 'teal' }, { nav: 'fmd', t: 'Encontrar mi dispositivo', ic: 'search', tone: 'green' }, { nav: 'o4', t: 'Autocompletar', ic: 'form' }] },
        o3: CFG_OTRA('Copia de seguridad'), o4: CFG_OTRA('Autocompletar'),
        fmd: { title: 'Encontrar mi dispositivo', items: [{ tog: 'fmd', t: 'Usar Encontrar mi dispositivo', d: 'Ubicar, bloquear o borrar a distancia' }, { info: 'Para probarlo: desde otro equipo entrá a <b>android.com/find</b> con tu cuenta de Google.' }] }
      },
      goals: [
        { t: '<b>Encontrar mi dispositivo</b> activado', ok: function (s) { return s.fmd; }, ruta: 'Ajustes › Google › Encontrar mi dispositivo › prendelo.' },
        { t: '<b>Ubicación</b> activada', ok: function (s) { return s.loc; }, ruta: 'Ajustes › Ubicación › Usar ubicación.' },
        { t: 'Bloqueo de pantalla <b>seguro</b> (patrón, PIN o contraseña)', ok: function (s) { return s.bloq === 'Patrón' || ((s.bloq === 'PIN' || s.bloq === 'Contraseña') && (s.pin || '').length >= 6); }, ruta: 'Ajustes › Seguridad y privacidad › Bloqueo de pantalla › PIN de 6 números › Guardar.' }] },
    { t: 'iPhone', ic: 'phone', tone: 'navy', device: 'iphone', start: 'ini',
      state: { fmi: false, red: false, cod: false, nc: '' },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Fotos', ic: 'eye', tone: 'amber' }, { nav: 'nada', t: 'Mail', ic: 'mail', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        aj: { title: 'Ajustes', items: [
          { nav: 'cta', t: 'Ana López', d: 'Cuenta de Apple, iCloud y más', ic: 'user', tone: 'violet' },
          { nav: 'o1', t: 'Wi-Fi', ic: 'wifi', tone: 'teal' },
          { nav: 'cod', t: 'Face ID y código', ic: 'lock', tone: 'green' },
          { nav: 'o2', t: 'Privacidad y seguridad', ic: 'shield' }] },
        o1: CFG_OTRA('Wi-Fi'), o2: CFG_OTRA('Privacidad y seguridad'),
        cta: { title: 'Cuenta de Apple', items: [{ nav: 'o3', t: 'iCloud', ic: 'cloud', tone: 'teal' }, { nav: 'bus', t: 'Buscar', ic: 'search', tone: 'green' }, { nav: 'o4', t: 'Medios y compras', ic: 'store' }] },
        o3: CFG_OTRA('iCloud'), o4: CFG_OTRA('Medios y compras'),
        bus: { title: 'Buscar', items: [{ nav: 'fmi', t: 'Buscar mi iPhone', ic: 'phone', tone: 'green' }] },
        fmi: { title: 'Buscar mi iPhone', items: [{ tog: 'fmi', t: 'Buscar mi iPhone', d: 'Ubicar, bloquear o borrar a distancia' }, { tog: 'red', t: 'Red de Buscar', d: 'Lo encuentra aunque esté sin conexión' }, { info: 'Para probarlo: desde otro equipo entrá a <b>icloud.com/find</b>.' }] },
        cod: { title: 'Face ID y código', items: [
          { info: function (s) { return s.cod ? 'Código <b>activado</b>.' : 'El código está <b>desactivado</b>: cualquiera puede abrir el iPhone.'; } },
          { pwd: 'nc', t: 'Código nuevo (6 números)' },
          { act: 'on', t: 'Activar código', run: function (s) { if (!/^\d{6,}$/.test(s.nc)) return { err: 'El código tiene que ser de 6 números.' }; s.cod = true; s.nc = ''; return 'Código activado.'; } }] }
      },
      goals: [
        { t: '<b>Buscar mi iPhone</b> activado', ok: function (s) { return s.fmi; }, ruta: 'Ajustes › tu nombre › Buscar › Buscar mi iPhone.' },
        { t: '<b>Red de Buscar</b> activada', ok: function (s) { return s.red; }, ruta: 'En la misma pantalla de Buscar mi iPhone.' },
        { t: '<b>Código</b> de desbloqueo activado', ok: function (s) { return s.cod; }, ruta: 'Ajustes › Face ID y código › código de 6 números › Activar código.' }] }]
},

/* ------------------------------------------------- Clase 11 · Bitwarden */
bitwarden: {
  type: 'cfg', device: 'android', title: 'Tu primer gestor (de práctica)',
  lead: 'Un Bitwarden de práctica para perderle el miedo: creás la cuenta y guardás tres claves. Es igual al real, pero <b>no uses tus datos ni contraseñas de verdad</b>.',
  intro: 'Abrí <b>Bitwarden</b> en el celular de práctica.',
  fin: 'Así de simple. Ahora hacé lo mismo con el Bitwarden de verdad (es gratis) y contalo en la Actividad 11.',
  start: 'ini',
  state: { cuenta: false, maestra: '', items: [], gen: 0, cm: '', cm2: '', mail: '', pista: '', in: '', iu: '', ip: '', ipg: false },
  screens: {
    ini: { title: 'Inicio', grid: true, items: [{ nav: 'bw', t: 'Bitwarden', ic: 'key', tone: 'navy' }, { nav: 'nada', t: 'Cámara', ic: 'eye', tone: 'violet' }, { nav: 'nada', t: 'Mensajes', ic: 'chat', tone: 'teal' }] },
    nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
    bw: { title: 'Bitwarden', items: [
      { info: function (s) { return s.cuenta ? 'Ya tenés cuenta. Entrá a tu bóveda.' : '<b>Te damos la bienvenida.</b> Guardá todas tus contraseñas en un solo lugar.'; } },
      { act: 'c', t: 'Crear cuenta', run: function (s) { return s.cuenta ? { nav: 'bov' } : { nav: 'crear' }; } },
      { act: 'i', t: 'Iniciar sesión', alt: true, run: function (s) { return s.cuenta ? { nav: 'bov' } : { err: 'Todavía no tenés cuenta: tocá «Crear cuenta».' }; } }] },
    crear: { title: 'Crear cuenta', items: [
      { txt: 'mail', t: 'Correo electrónico', ph: 'ana.practica@correo.com' },
      { pwd: 'cm', t: 'Contraseña maestra' }, { pwd: 'cm2', t: 'Repetí la contraseña maestra' },
      { txt: 'pista', t: 'Pista (opcional)', ph: 'Algo que te la recuerde, sin decirla' },
      { info: 'La contraseña maestra es la <b>única</b> que vas a tener que recordar. Si la olvidás, nadie la puede recuperar: anotala en papel y guardalo.' },
      { act: 'ok', t: 'Crear cuenta', run: function (s) {
        if (!/@/.test(s.mail)) return { err: 'Escribí un correo (puede ser inventado).' };
        if ((s.cm || '').length < 12) return { err: 'La contraseña maestra tiene que tener 12 caracteres o más. Probá con una frase.' };
        if (s.cm !== s.cm2) return { err: 'Las dos contraseñas no coinciden.' };
        if (s.pista && s.pista.toLowerCase().indexOf(s.cm.toLowerCase()) >= 0) return { err: 'La pista no puede contener la contraseña.' };
        s.cuenta = true; s.maestra = s.cm.length; s.cm = ''; s.cm2 = '';
        return { nav: 'bov', msg: 'Cuenta creada.' };
      } }] },
    bov: { title: 'Mi bóveda', items: [
      { info: function (s) { return s.items.length ? '<b>' + s.items.length + '</b> elemento(s) guardado(s)' : 'Tu bóveda está vacía.'; } },
      { list: function (s) { return s.items.map(function (x) { return { t: esc(x.n), d: esc(x.u) + (x.g ? ' · contraseña generada 🔑' : ''), ic: 'password', tone: x.g ? 'green' : 'amber', nav: 'bov' }; }); } },
      { act: 'n', t: '+ Nuevo elemento', run: function (s) { s.in = ''; s.iu = ''; s.ip = ''; s.ipg = false; return { nav: 'nuevo' }; } }] },
    nuevo: { title: 'Nuevo elemento', items: [
      { txt: 'in', t: 'Nombre', ph: 'Por ejemplo: Correo, Banco, Facebook' },
      { txt: 'iu', t: 'Usuario', ph: 'ana.practica' },
      { pwd: 'ip', t: 'Contraseña' },
      { act: 'g', t: '🔑 Generar contraseña', alt: true, run: function (s) {
        var c = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%&*?', p = '';
        for (var i = 0; i < 18; i++) p += c[Math.floor(Math.random() * c.length)];
        s.ip = p; s.ipg = true; return 'Contraseña generada: 18 caracteres al azar. No hace falta que la recuerdes: la guarda Bitwarden.';
      } },
      { act: 'ok', t: 'Guardar', run: function (s) {
        if (!s.in.trim()) return { err: 'Ponele un nombre (por ejemplo, «Correo»).' };
        if (!s.ip) return { err: 'Falta la contraseña. Probá «Generar contraseña».' };
        s.items.push({ n: s.in.trim(), u: s.iu, g: s.ipg && s.ip.length >= 16 });
        return { nav: 'bov', msg: 'Elemento guardado.' };
      } }] }
  },
  goals: [
    { t: 'Cuenta creada con contraseña maestra de <b>12 o más</b>', ok: function (s) { return s.cuenta; }, ruta: 'Bitwarden › Crear cuenta › una frase larga como contraseña maestra.' },
    { t: '<b>3</b> elementos guardados en la bóveda', ok: function (s) { return s.items.length >= 3; }, ruta: 'Mi bóveda › + Nuevo elemento › nombre, usuario y contraseña › Guardar. Tres veces.' },
    { t: 'Al menos 2 con contraseña <b>generada</b>', ok: function (s) { return s.items.filter(function (x) { return x.g; }).length >= 2; }, ruta: 'En «Nuevo elemento», tocá «Generar contraseña» antes de Guardar.' }]
}
};

/* ------------------------------------------------- Clase 3 · Copias de seguridad */
CFGS.copia = {
  type: 'cfg', title: 'Hacé una copia y comprobala',
  lead: 'Elegí el camino que más se parece a lo que vas a hacer en tu casa. En los tres hay que <b>copiar</b> (no mover) y después <b>recuperar</b> un archivo para comprobar que la copia sirve.',
  fin: 'Copia hecha <b>y comprobada</b>. Ahora hacelo con tus archivos de verdad y contalo en la Actividad 3.',
  variantes: [
    { t: 'Compu → pendrive', ic: 'usb', tone: 'amber', device: 'win', start: 'esc',
      intro: 'Enchufaste el pendrive en la compu de Marta. Copiá sus documentos y comprobá la copia.',
      state: { docs: ['Recetas.docx', 'Precios.xlsx', 'Foto_local.jpg', 'Cuentas_marzo.pdf', 'Proveedores.docx'], usb: [], prueba: [], clip: [], clipDe: '', cut: false, sel: '', donde: 'docs', abierto: false },
      screens: {
        esc: { title: 'Escritorio', grid: true, items: [{ nav: 'exp', t: 'Explorador de archivos', ic: 'folder', tone: 'amber' }, { nav: 'nada', t: 'Navegador', ic: 'globe', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b> y abrí el <b>Explorador de archivos</b>.' }] },
        exp: { title: 'Este equipo', win: 'Explorador de archivos', items: [
          { list: function (s) { return [
            { t: 'Documentos', d: s.docs.length + ' archivos · los originales', ic: 'folder', tone: 'amber', nav: 'docs' },
            { t: 'Pendrive (E:)', d: s.usb.length ? s.usb.length + ' archivos' : 'Vacío', ic: 'usb', tone: 'teal', nav: 'usb' },
            { t: 'Escritorio › Prueba de recuperación', d: 'Carpeta nueva para comprobar', ic: 'folder', tone: 'green', nav: 'prueba' }]; } }] },
        docs: { title: 'Documentos', win: 'Explorador de archivos', items: [
          { act: 'all', t: 'Seleccionar todo y Copiar (Ctrl+A, Ctrl+C)', run: function (s) { s.clip = s.docs.slice(); s.clipDe = 'docs'; s.cut = false; return 'Copiaste ' + s.clip.length + ' archivos. Ahora andá al <b>pendrive</b> y pegá.'; } },
          { list: function (s) { return s.docs.map(function (f) { return { t: f, ic: 'file', tone: 'navy', nav: 'arch', set: { sel: f, donde: 'docs' } }; }); } }] },
        arch: { title: 'Archivo', win: 'Explorador de archivos', items: [
          { info: function (s) { return '<b>' + esc(s.sel) + '</b>'; } },
          { act: 'c', t: 'Copiar (Ctrl+C)', run: function (s) { s.clip = [s.sel]; s.clipDe = s.donde; s.cut = false; return 'Copiado. Andá a la carpeta de destino y tocá <b>Pegar</b>.'; } },
          { act: 'x', t: 'Cortar (Ctrl+X)', alt: true, run: function (s) { s.clip = [s.sel]; s.clipDe = s.donde; s.cut = true; return '<b>Ojo:</b> cortar <b>mueve</b> el archivo. Al pegar, desaparece de acá. Para una copia, usá <b>Copiar</b>.'; } },
          { act: 'a', t: 'Abrir', alt: true, run: function (s) {
            if (s.donde === 'prueba') { var x = s.prueba.find(function (p) { return p.n === s.sel; }); if (x && x.de === 'usb') { s.abierto = true; return 'Se abrió bien: <b>la copia funciona</b> ✔'; } }
            return 'Se abrió.'; } }] },
        usb: { title: 'Pendrive (E:)', win: 'Explorador de archivos', items: [
          { act: 'p', t: 'Pegar (Ctrl+V)', run: function (s) {
            if (!s.clip.length) return { err: 'Todavía no copiaste nada. Andá a Documentos y copiá.' };
            if (s.clipDe === 'usb') return { err: 'Esos archivos ya están en el pendrive.' };
            s.clip.forEach(function (f) { if (s.usb.indexOf(f) < 0) s.usb.push(f); });
            if (s.cut) { s.docs = s.docs.filter(function (f) { return s.clip.indexOf(f) < 0; }); s.cut = false; s.clip = []; return 'Pegado… pero como <b>cortaste</b>, el original ya no está en Documentos.'; }
            return 'Pegado: ' + s.usb.length + ' archivos en el pendrive.'; } },
          { list: function (s) { return s.usb.map(function (f) { return { t: f, ic: 'file', tone: 'teal', nav: 'arch', set: { sel: f, donde: 'usb' } }; }); } }] },
        prueba: { title: 'Prueba de recuperación', win: 'Explorador de archivos', items: [
          { info: 'Una carpeta nueva y vacía. Traé acá <b>un archivo desde el pendrive</b> y abrilo.' },
          { act: 'p', t: 'Pegar (Ctrl+V)', run: function (s) {
            if (!s.clip.length) return { err: 'Primero copiá un archivo desde el pendrive.' };
            s.clip.forEach(function (f) { if (!s.prueba.some(function (p) { return p.n === f; })) s.prueba.push({ n: f, de: s.clipDe }); });
            return s.clipDe === 'usb' ? 'Pegado desde el pendrive. Ahora <b>abrilo</b>.' : 'Pegado, pero vino de Documentos: para comprobar la copia, tiene que venir <b>del pendrive</b>.'; } },
          { list: function (s) { return s.prueba.map(function (p) { return { t: p.n, d: p.de === 'usb' ? 'Recuperado del pendrive' : 'Vino de Documentos', ic: 'file', tone: 'green', nav: 'arch', set: { sel: p.n, donde: 'prueba' } }; }); } }] }
      },
      goals: [
        { t: 'Copiaste <b>3 o más</b> archivos al pendrive', ok: function (s) { return s.usb.length >= 3; }, ruta: 'Explorador › Documentos › «Seleccionar todo y Copiar» › Este equipo › Pendrive › Pegar.' },
        { t: 'Los <b>originales</b> siguen en Documentos (copiar, no mover)', ok: function (s) { return s.docs.length === 5 && s.usb.length > 0; }, ruta: 'Usá Copiar, no Cortar. Si ya cortaste, tocá «Empezar de nuevo».' },
        { t: 'Trajiste un archivo <b>del pendrive</b> a la carpeta de prueba', ok: function (s) { return s.prueba.some(function (p) { return p.de === 'usb'; }); }, ruta: 'Pendrive › tocá un archivo › Copiar › Este equipo › Prueba de recuperación › Pegar.' },
        { t: 'Lo <b>abriste</b> y se ve bien', ok: function (s) { return s.abierto; }, ruta: 'En Prueba de recuperación, tocá el archivo › Abrir.' }] },

    { t: 'Celular Android → nube de Google', ic: 'phone', tone: 'green', device: 'android', start: 'ini',
      intro: 'Con la cuenta de Google del celular tenés <b>15 GB gratis</b>. Activá las dos copias y comprobá que una foto vuelve.',
      state: { fotos: false, uno: false, hecha: false, rest: false, cal: 'Ahorro de almacenamiento' },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'fotos', t: 'Google Fotos', ic: 'eye', tone: 'amber' }, { nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Cámara', ic: 'eye', tone: 'violet' }] },
        nada: { title: 'App', items: [{ info: 'Esta app no sirve para esto. Tocá <b>‹</b>.' }] },
        fotos: { title: 'Google Fotos', items: [
          { info: function (s) { return s.fotos ? '☁️ <b>Copia de seguridad activada</b> · 1.240 fotos guardadas en tu cuenta' : '⚠️ <b>Copia de seguridad desactivada:</b> tus fotos están solo en este celular.'; } },
          { nav: 'fperfil', t: 'Tu perfil', d: 'La foto de arriba a la derecha', ic: 'user', tone: 'violet' },
          { nav: 'nube', t: 'Biblioteca › Fotos en la nube', ic: 'cloud', tone: 'teal' }] },
        fperfil: { title: 'Tu perfil', items: [{ nav: 'fconf', t: 'Configuración de Fotos', ic: 'gear' }, { nav: 'o1', t: 'Administrar tu cuenta', ic: 'user', tone: 'violet' }] },
        o1: CFG_OTRA('Tu cuenta'),
        fconf: { title: 'Configuración de Fotos', items: [{ nav: 'fcop', t: 'Copia de seguridad', ic: 'cloud', tone: 'teal' }, { nav: 'o2', t: 'Notificaciones', ic: 'chat' }] },
        o2: CFG_OTRA('Notificaciones'),
        fcop: { title: 'Copia de seguridad', items: [
          { tog: 'fotos', t: 'Copia de seguridad', d: 'Guarda tus fotos y videos en tu cuenta de Google' },
          { sel: 'cal', t: 'Calidad', opts: ['Ahorro de almacenamiento', 'Calidad original'] },
          { info: '«Ahorro de almacenamiento» ocupa menos lugar: alcanza y sobra para la mayoría.' }] },
        nube: { title: 'Fotos en la nube', items: [
          { info: function (s) { return s.fotos ? 'Estas fotos están guardadas en tu cuenta: aunque pierdas el celular, siguen acá.' : 'Todavía no hay nada en la nube: primero activá la copia de seguridad.'; } },
          { list: function (s) { return s.fotos ? [{ t: 'Torta de cumpleaños.jpg', d: '☁️ En la nube', ic: 'eye', tone: 'amber', nav: 'foto' }, { t: 'Vidriera del local.jpg', d: '☁️ En la nube', ic: 'eye', tone: 'amber', nav: 'foto' }] : []; } }] },
        foto: { title: 'Foto', items: [{ info: '🖼️ (vista previa)' },
          { act: 'd', t: 'Descargar al celular', run: function (s) { s.rest = true; return 'Descargada en la carpeta <b>Descargas</b>. Se abre bien: <b>la copia funciona</b> ✔'; } }] },
        aj: { title: 'Ajustes', items: [{ nav: 'o3', t: 'Conexiones', ic: 'wifi', tone: 'teal' }, { nav: 'goo', t: 'Google', d: 'Servicios de Google', ic: 'user', tone: 'amber' }, { nav: 'o4', t: 'Batería', ic: 'plug', tone: 'green' }] },
        o3: CFG_OTRA('Conexiones'), o4: CFG_OTRA('Batería'),
        goo: { title: 'Google', items: [{ nav: 'gcop', t: 'Copia de seguridad', ic: 'cloud', tone: 'teal' }, { nav: 'o5', t: 'Encontrar mi dispositivo', ic: 'search', tone: 'green' }] },
        o5: CFG_OTRA('Encontrar mi dispositivo'),
        gcop: { title: 'Copia de seguridad', items: [
          { tog: 'uno', t: 'Copia de seguridad de Google One', d: 'Contactos, apps, mensajes, llamadas y ajustes' },
          { act: 'h', t: 'Crear copia ahora', run: function (s) { if (!s.uno) return { err: 'Primero activá «Copia de seguridad de Google One».' }; s.hecha = true; return 'Copia terminada: contactos, apps, mensajes y ajustes guardados en tu cuenta.'; } },
          { info: 'WhatsApp tiene su propia copia: WhatsApp › Ajustes › Chats › Copia de seguridad.' }] }
      },
      goals: [
        { t: 'Copia de <b>fotos</b> activada', ok: function (s) { return s.fotos; }, ruta: 'Google Fotos › tu perfil › Configuración de Fotos › Copia de seguridad › activala.' },
        { t: 'Copia del <b>celular</b> hecha (contactos, apps, mensajes)', ok: function (s) { return s.hecha; }, ruta: 'Ajustes › Google › Copia de seguridad › activá Google One › Crear copia ahora.' },
        { t: '<b>Comprobaste:</b> trajiste una foto desde la nube', ok: function (s) { return s.rest; }, ruta: 'Google Fotos › Biblioteca › Fotos en la nube › tocá una foto › Descargar.' }] },

    { t: 'Compu → Google Drive', ic: 'cloud', tone: 'teal', device: 'win', start: 'esc',
      intro: 'Subí la carpeta de recetas de Marta a su Google Drive (gratis con su cuenta de Gmail) y comprobá que un archivo vuelve.',
      state: { sub: false, desc: false, abierto: false, carpeta: '— elegí una carpeta —' },
      screens: {
        esc: { title: 'Escritorio', grid: true, items: [{ nav: 'drive', t: 'Navegador', ic: 'globe', tone: 'teal' }, { nav: 'nada', t: 'Explorador', ic: 'folder', tone: 'amber' }] },
        nada: { title: 'App', items: [{ info: 'Para esto se usa el <b>navegador</b>. Tocá <b>‹</b>.' }] },
        drive: { title: 'Mi unidad', win: 'Navegador · drive.google.com', items: [
          { info: function (s) { return s.sub ? 'Tu Drive: <b>15 GB gratis</b>, usados 0,3 GB.' : 'Tu Drive está vacío. 15 GB gratis.'; } },
          { act: 'n', t: '+ Nuevo', run: function () { return { nav: 'nuevo' }; } },
          { list: function (s) { return s.sub ? [{ t: 'Recetas', d: '12 archivos · subida hoy', ic: 'folder', tone: 'amber', nav: 'carp' }] : []; } }] },
        nuevo: { title: 'Nuevo', win: 'Navegador · drive.google.com', items: [
          { nav: 'o1', t: 'Carpeta nueva', ic: 'folder' },
          { act: 'a', t: 'Subir archivo', alt: true, run: function () { return { err: 'Sirve para un archivo suelto. Para toda una carpeta, usá «Subir carpeta».' }; } },
          { act: 'c', t: 'Subir carpeta', run: function () { return { nav: 'elegir' }; } }] },
        o1: CFG_OTRA('Carpeta nueva'),
        elegir: { title: 'Elegí la carpeta para subir', win: 'Abrir', items: [
          { sel: 'carpeta', t: 'Carpeta', opts: ['— elegí una carpeta —', 'Documentos › Recetas', 'Descargas', 'Escritorio'] },
          { act: 's', t: 'Subir', run: function (s) { if (s.carpeta !== 'Documentos › Recetas') return { err: 'Elegí la carpeta de las recetas de Marta (Documentos › Recetas).' }; s.sub = true; return { nav: 'drive', msg: 'Subiendo 12 archivos… <b>¡Listo!</b> La carpeta Recetas ya está en tu Drive.' }; } }] },
        carp: { title: 'Recetas', win: 'Navegador · drive.google.com', items: [
          { list: function () { return ['Medialunas.docx', 'Pan dulce.docx', 'Facturas.docx'].map(function (f) { return { t: f, ic: 'file', tone: 'navy', nav: 'archd' }; }); } }] },
        archd: { title: 'Archivo en Drive', win: 'Navegador · drive.google.com', items: [
          { info: 'Medialunas.docx · guardado en la nube' },
          { act: 'd', t: 'Descargar', run: function (s) { s.desc = true; return 'Descargado en la carpeta <b>Descargas</b> de la compu.'; } },
          { act: 'o', t: 'Abrir lo que descargaste', alt: true, run: function (s) { if (!s.desc) return { err: 'Primero tocá «Descargar».' }; s.abierto = true; return 'Se abrió bien: <b>la copia funciona</b> ✔'; } }] }
      },
      goals: [
        { t: 'La carpeta <b>Recetas</b> subida a Drive', ok: function (s) { return s.sub; }, ruta: 'Navegador (drive.google.com) › + Nuevo › Subir carpeta › Documentos › Recetas › Subir.' },
        { t: '<b>Descargaste</b> un archivo desde Drive', ok: function (s) { return s.desc; }, ruta: 'Mi unidad › Recetas › tocá un archivo › Descargar.' },
        { t: 'Lo <b>abriste</b> y se ve bien', ok: function (s) { return s.abierto; }, ruta: 'En el mismo archivo: «Abrir lo que descargaste».' }] },

    { t: 'iPhone → iCloud', ic: 'phone', tone: 'navy', device: 'iphone', start: 'ini',
      intro: 'Con tu cuenta de Apple tenés <b>5 GB gratis</b> en iCloud. Si se te llenan, guardá las fotos en Google Fotos (también existe para iPhone).',
      state: { fot: false, icb: false, hecha: false },
      screens: {
        ini: { title: 'Inicio', grid: true, items: [{ nav: 'aj', t: 'Ajustes', ic: 'gear', tone: 'navy' }, { nav: 'nada', t: 'Fotos', ic: 'eye', tone: 'amber' }, { nav: 'nada', t: 'Mail', ic: 'mail', tone: 'teal' }] },
        nada: { title: 'App', items: [{ info: 'Las copias se activan desde <b>Ajustes</b>. Tocá <b>‹</b>.' }] },
        aj: { title: 'Ajustes', items: [{ nav: 'cta', t: 'Ana López', d: 'Cuenta de Apple, iCloud y más', ic: 'user', tone: 'violet' }, { nav: 'o1', t: 'Wi-Fi', ic: 'wifi', tone: 'teal' }, { nav: 'o2', t: 'General', ic: 'gear' }] },
        o1: CFG_OTRA('Wi-Fi'), o2: CFG_OTRA('General'),
        cta: { title: 'Cuenta de Apple', items: [{ nav: 'icl', t: 'iCloud', d: '5 GB gratis', ic: 'cloud', tone: 'teal' }, { nav: 'o3', t: 'Buscar', ic: 'search', tone: 'green' }] },
        o3: CFG_OTRA('Buscar'),
        icl: { title: 'iCloud', items: [{ nav: 'fot', t: 'Fotos', ic: 'eye', tone: 'amber' }, { nav: 'icb', t: 'Copia en iCloud', ic: 'cloud', tone: 'teal' }] },
        fot: { title: 'Fotos', items: [{ tog: 'fot', t: 'Sincronizar este iPhone', d: 'Guarda tus fotos en iCloud' }] },
        icb: { title: 'Copia en iCloud', items: [
          { tog: 'icb', t: 'Hacer copia de este iPhone', d: 'Se hace sola cuando está cargando, bloqueado y con Wi-Fi' },
          { act: 'h', t: 'Realizar copia ahora', run: function (s) { if (!s.icb) return { err: 'Primero activá «Hacer copia de este iPhone».' }; s.hecha = true; return 'Copia terminada. Última copia: hoy.'; } }] }
      },
      goals: [
        { t: '<b>Fotos de iCloud</b> activadas', ok: function (s) { return s.fot; }, ruta: 'Ajustes › tu nombre › iCloud › Fotos › Sincronizar este iPhone.' },
        { t: '<b>Copia en iCloud</b> activada', ok: function (s) { return s.icb; }, ruta: 'Ajustes › tu nombre › iCloud › Copia en iCloud.' },
        { t: 'Copia <b>hecha ahora</b>', ok: function (s) { return s.hecha; }, ruta: 'En Copia en iCloud: «Realizar copia ahora».' }] }]
};
