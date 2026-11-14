# Plataforma de prácticas · CFP N.º 403 «Oscar Smith»

Prácticas interactivas para los trayectos virtuales del CFP N.º 403 de Luján.
Es un sitio estático (HTML, CSS y JavaScript): no hay que instalar nada y funciona
en el celular y en la compu.

## Cómo está organizado

| Carpeta / archivo | Qué hay |
| --- | --- |
| `index.html` | La página. Carga el motor y los trayectos. |
| `assets/motor.js` | El motor: pantallas, tipos de misión, puntaje, resumen y verificador docente. |
| `assets/estilos.css` | Estilos. |
| `assets/iconos.js` | Íconos. |
| `assets/config.js` | Ingreso con el usuario de la plataforma del CFP y llamadas a la función `practicas`. |
| `supabase/functions/practicas/index.ts` | Función de Supabase: comprueba la inscripción y guarda/lee intentos. |
| `trayectos/*.js` | **Un archivo por trayecto**, con sus módulos y prácticas. |

## Direcciones

- `#/` → elegir trayecto
- `#/seguridad` → prácticas de Seguridad Informática Básico
- `#/seguridad/5` → práctica 5
- `#/docente` → panel docente: resultados de las prácticas (con usuario) y verificador de códigos. No aparece en ningún menú.

## Agregar un trayecto nuevo

1. Crear `trayectos/<nombre>.js` con `registrarTrayecto({...})`.
2. Agregar su `<script>` en `index.html`.

Cada trayecto tiene su propio prefijo de código (`P` Seguridad, `PC` Pensamiento
Computacional, `PL` Planillas), así los códigos de práctica no se confunden.

## Cómo se controla quién entra

1. El estudiante ingresa con su usuario de la plataforma del CFP (DNI o correo y contraseña).
2. La función `practicas` (proyecto `practicas-cfp403`) le pregunta a la plataforma del CFP quién es
   y en qué trayectos tiene inscripción **ACTIVA**.
3. Solo si está inscripto/a en ese trayecto, la función guarda el intento. Nadie más puede escribir ni leer la tabla.
4. El panel docente (`#/docente`) solo lo ve el rol administrador de la plataforma del CFP.

## Corrección en el servidor (Seguridad Informática)

Las respuestas correctas de **Seguridad Informática** ya no están en este repositorio (que es público): viven en la tabla
privada `practica_claves` de la plataforma del CFP. El navegador manda lo que eligió la persona a la función
`practica-servidor` (plataforma del CFP) y recibe si estuvo bien; el puntaje lo calcula esa función y la nota se carga desde
el servidor. `trayectos/seguridad.js` es el archivo **sin respuestas** (generado con `scripts/separar-claves.js`).

Misiones que se corrigen en el servidor: `quiz`, `sort`, `spot`, `tiles`, `order`. Las demás (simuladores, terminal, router,
listas y tareas autodeclaradas) las informa el navegador: no se pueden verificar desde afuera, pero tienen tope y peso fijo.

Para agregar o cambiar una práctica con respuestas: armar la fuente (con respuestas) en una carpeta que **no** sea este repo,
correr `node scripts/separar-claves.js <fuente> <publico> <claves.json>`, publicar el archivo público y cargar las claves en
`practica_claves`.
