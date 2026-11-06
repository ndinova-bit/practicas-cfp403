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
| `assets/config.js` | Conexión con Supabase (vacía hasta conectarla). |
| `trayectos/*.js` | **Un archivo por trayecto**, con sus módulos y prácticas. |

## Direcciones

- `#/` → elegir trayecto
- `#/seguridad` → prácticas de Seguridad Informática Básico
- `#/seguridad/5` → práctica 5
- `#/docente` → verificador de códigos (no aparece en ningún menú)

## Agregar un trayecto nuevo

1. Crear `trayectos/<nombre>.js` con `registrarTrayecto({...})`.
2. Agregar su `<script>` en `index.html`.

Cada trayecto tiene su propio prefijo de código (`P` Seguridad, `PC` Pensamiento
Computacional, `PL` Planillas), así los códigos de práctica no se confunden.
