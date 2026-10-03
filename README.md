# ASAP Gestión de Proyectos 369 — Sitio web

Sitio institucional de una sola página para **ASAP Gestión de Proyectos 369**:
mantenimiento de fachadas y trabajos verticales, con base en Guadalajara y obra
en 18 ciudades y destinos de nueve estados, del Pacífico al Caribe.

Construido sin dependencias, sin proceso de compilación y sin servicios de
terceros: HTML, CSS y JavaScript nativo (módulos ES). Se publica copiando la
carpeta a cualquier hosting estático.

---

## 1. Contenido de la página

| # | Sección | Ancla | Qué incluye |
|---|---------|-------|-------------|
| 1 | Portada | `#inicio` | Titular animado, indicadores y tarjeta de proyecto en curso |
| 2 | Marquesina | — | Listado de servicios en movimiento continuo |
| — | Técnico en descenso | — | Técnico de la cuadrilla, colgado de dos cuerdas, que baja por el margen izquierdo durante todo el recorrido |
| 3 | Sobre nosotros | `#nosotros` | Historia, **misión**, **visión** y valores |
| 4 | Mensaje del fundador | — | Carta firmada con retrato |
| 5 | Servicios principales | `#servicios` | Los 8 servicios, cada uno desplegable con su alcance |
| 6 | Trabajos verticales | `#verticales` | Ventajas del método, técnica, equipo y protocolo de seguridad |
| 7 | Cobertura | `#cobertura` | **Mapa 2D interactivo de México**: 18 ubicaciones en 9 estados, con acercamiento por estado |
| 8 | Proyectos | `#proyectos` | Una tarjeta por ubicación, filtrable por estado y sincronizada con el mapa |
| 9 | Proceso | `#proceso` | Cinco pasos con desplazamiento horizontal fijado al scroll |
| 10 | En números | — | Contadores animados, calculados desde el propio contenido |
| 11 | Cinta de cierre | — | Llamado a la acción |
| 12 | Contacto | `#contacto` | Datos de contacto y formulario |
| 13 | Pie | — | Navegación secundaria, avisos y créditos |

### El mapa interactivo y la sección de proyectos

Render vectorial de las 32 entidades federativas con un punto por cada una de
las 18 ubicaciones de `UBICACIONES`, siempre **dentro de su propio estado**.

- **Elegir un estado** —con los botones, tocándolo en el mapa, en el panel, con
  el filtro de la sección de proyectos o desde el pie de página— acerca el mapa
  con animación, **ilumina ese estado** y escribe el nombre de sus ubicaciones.
- **Elegir una ubicación** —su punto o su nombre en el mapa, el panel o una
  tarjeta de proyectos— ilumina **el estado al que pertenece** (Bucerías y
  Nuevo Vallarta encienden Nayarit; Puerto Vallarta y Melaque, Jalisco) y la
  señala con un pulso. El panel muestra la ubicación, las demás del estado y
  un botón para cotizar que deja la ciudad elegida en el formulario.
- **Todo está sincronizado**: mapa, botones, panel, filtro y tarjetas pasan por
  la misma selección, así que siempre dicen lo mismo. Tocar una tarjeta lleva
  al mapa con su ubicación señalada.

Detalles de implementación relevantes:

- Las posiciones vienen de latitud y longitud reales proyectadas al sistema
  del mapa. Donde el contorno simplificado del mapa no coincide con la costa
  —la bahía de Banderas, Manzanillo, Melaque, Mazatlán, Cancún— se corrigieron
  a mano para que el punto caiga en su estado, del lado correcto del límite.
- Las ubicaciones que en pantalla quedan muy juntas (las cinco de la bahía de
  Banderas) se listan en una columna; las demás llevan su nombre al lado. Cada
  etiqueta elige el lado con lugar —en la costa, el del mar— sin salirse del
  mapa, sin tapar otra etiqueta ni la leyenda.
- Los marcadores miden lo mismo en pantalla a cualquier zoom y en cualquier
  ancho de lienzo, del monitor al celular.
- El encuadre se adapta a la proporción real de la tarjeta, así que el mapa
  llena el espacio tanto en escritorio como en celular.
- Las tarjetas de la sección de proyectos dibujan la silueta de cada estado
  con el mismo mapa, con el punto de la ubicación y, más tenues, las demás del
  estado.

---

## 2. Estructura de archivos

```
.
├── index.html                  Documento único (estructura y metadatos)
├── .htaccess                   Compresión, caché y encabezados (Apache/LiteSpeed)
├── site.webmanifest            Manifiesto PWA
├── robots.txt · sitemap.xml    SEO
└── assets/
    ├── css/
    │   ├── base.css            Tipografías, tokens de color, retícula, animaciones base
    │   ├── components.css      Precarga, cursor, navegación, botones, tarjetas, modal
    │   └── sections.css        Maquetación de cada sección + responsivo
    ├── js/
    │   ├── main.js             Orquestador: precarga, scroll, revelados, render de secciones
    │   ├── data.js             ► TODO EL CONTENIDO EDITABLE ◄
    │   ├── map.js              Mapa interactivo
    │   ├── map-paths.js        Geometría de los 32 estados (generado, no editar a mano)
    │   └── projects.js         Tarjetas de ubicaciones y filtro por estado
    ├── fonts/                  Outfit e Inter autoalojadas (woff2 variable)
    ├── img/                    Ilustraciones de referencia (reemplazables)
    └── data/                   Licencia del mapa base
```

---

## 3. Cómo verlo en local

Los módulos ES requieren un servidor; abrir `index.html` con doble clic no basta.

```bash
npx http-server -p 8080 -c-1 .      # o: python3 -m http.server 8080
```

Luego abre <http://localhost:8080>.

---

## 4. Cómo editar el contenido

Casi todo el texto vive en **`assets/js/data.js`**. Al cambiarlo, la página se
reconstruye sola: no hay que tocar el HTML.

| Qué quieres cambiar | Dónde |
|---|---|
| Servicios (nombre, descripción, puntos, indicador) | `SERVICIOS` |
| Ventajas, técnicas y puntos de seguridad | `VERTICALES` |
| Estados (orden de botones y filtros) | `ENTIDADES` |
| Ciudades y destinos del mapa y de la sección de proyectos | `UBICACIONES` |
| Obra anunciada en la portada | `OBRA_ACTIVA` |
| Pasos del proceso | `PROCESO` |
| Cifras de la sección "En números" | `METRICAS` (se calculan solas) |
| Intro, misión, visión, valores, mensaje del fundador y contacto | `EMPRESA` |

Los textos fijos (titulares de sección, portada y pie) están directamente en
`index.html`, identificados con comentarios por sección.

### Cambiar el proyecto que anuncia la portada

La tarjeta sobre el video del recuadro dice «Proyecto en curso», con la ciudad
y el estado, el servicio que se está ejecutando y una barra de avance animada.
Se controla desde `OBRA_ACTIVA` en `data.js`:

```js
export const OBRA_ACTIVA = {
  mostrar: true,
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  servicio: 'Pintura de fachadas'   // null para ocultar esa línea
};
```

Con `mostrar: false` la tarjeta vuelve al texto genérico de trabajos verticales
y deja de anunciar un proyecto activo. **Mantén este dato al día**: dice que
hay un trabajo ejecutándose en este momento en esa ciudad.

### Cintas de proveedores y clientes

Las dos cintas animadas que siguen a la sección de proyectos salen de `CINTAS` en
`data.js`. **Los nombres que traen hoy son ficticios**, puestos solo para
mostrar el diseño: hay que sustituirlos por los proveedores y clientes reales
antes de publicar. Cada cinta tiene:

```js
{
  rotulo: 'Proveedores',          // el título que la acompaña
  posicion: 'arriba',             // el título va arriba o abajo de la cinta
  nombres: ['Nombre 1', 'Nombre 2'],
  sentido: -1,                    // -1 hacia la izquierda, 1 hacia la derecha
  estilo: 'llena'                 // 'llena' (sólida) o 'hueca' (contorno)
}
```

La cinta se repite sola hasta cubrir el ancho de la pantalla, sin importar
cuántos nombres tenga. Los lectores de pantalla reciben cada lista una sola
vez, con su título.

### Agregar o quitar una ubicación

Todo sale de `UBICACIONES` en `data.js`: el mapa, las tarjetas de proyectos,
el selector de ciudad del formulario, los indicadores y la lista de estados del
menú, del contacto y del pie. Para sumar una:

1. Escribe su latitud y longitud y calcula su lugar en el mapa:

   ```
   x =  25.289593 · longitud −  0.456255 · latitud + 2998.2434
   y =  −1.361053 · longitud − 28.023522 · latitud +  782.1887
   ```

   (Ejemplo: Monterrey, 25.6866 N / −100.3161 O → `x ≈ 449.6`, `y ≈ 198.9`.)
2. Añádela con su `estado` (clave de tres letras: `jal`, `nay`, `col`, `sin`,
   `mic`, `que`, `cmx`, `nle`, `roo`…; la lista completa está en
   `map-paths.js`):

   ```js
   { id: 'zihuatanejo', nombre: 'Zihuatanejo', estado: 'gro', lat: 17.6416, lon: -101.5520, xy: [422.0, 426.0] }
   ```
3. Revisa que el punto caiga dentro de su estado. En la costa el mapa está
   simplificado y a veces el punto queda en el mar o del otro lado de un
   límite; en ese caso muévelo a mano un par de unidades tierra adentro.
4. Si es de un estado nuevo, agrégalo también a `ENTIDADES`.

Opcionales: `tipo: 'Región'` o `'Municipio'` cuando no es una ciudad, y
`base: true` para la base de operaciones.

---

## 5. Cómo sustituir imágenes y video

### Videos de la portada

La portada lleva dos videos reales, los dos en loop continuo, en silencio y
solo mientras la portada está a la vista. Ninguno aparece en otra parte de la
página. Se reproducen únicamente si el visitante no pidió movimiento reducido
ni ahorro de datos; en esos casos se ve su primer cuadro como imagen fija.

**En el recuadro**: toma de dron del Holiday Inn Express con la cuadrilla en
la fachada. Recorre los primeros 20 s del original —la fachada de ladrillo
con los técnicos, el giro hacia la esquina del letrero y el costado del
edificio— a 0.85× de velocidad, recortado al marco 4:5. El último segundo y
medio se funde sobre el principio, así que el loop de 22 s no tiene corte.
La tarjeta «Proyecto en curso» va encima.

| Archivo | Para | Peso |
|---|---|---|
| `hero-720.mp4` / `.webm` | escritorio (720×900) | 3.8 MB / 3.2 MB |
| `hero-540.mp4` / `.webm` | celular (544×680) | 1.5 MB / 1.5 MB |
| `hero-poster.jpg` | imagen fija | 63 KB |

**De fondo** (`.hero__fondo`): una torre de cristal al atardecer con un
técnico colgado de la arista y nubes en movimiento. Es un video generado con
IA (Gemini), horizontal, de 10 s. La cámara hace un recorrido lateral lento,
así que el loop no une el final con el principio —se verían los edificios
duplicados—: es un vaivén. La toma avanza 8 s, frena con suavidad, regresa
otros 8 s y vuelve a frenar, siempre con velocidad cero en los extremos, de
modo que no hay corte ni rebote. Para que el frenado sea fluido se generaron
cuadros intermedios (72 por segundo de base). La luz va ya en el archivo:
se aclararon sombras y medios tonos con una curva que no quema las nubes, y
el velo oscuro solo cubre la columna del texto; termina justo donde acaba el
párrafo (`--texto-fin`), así que el centro y la derecha quedan luminosos.

Encuadre en escritorio: `initEncuadreFondo()` (en `main.js`) coloca al
técnico —en la toma está en x 725 · y 340— en el hueco entre el texto y el
recuadro, sea cual sea el tamaño de la pantalla. Primero solo recorre el
video (`--fondo-x`); si ni alineado a la derecha alcanza, lo acerca lo
mínimo necesario (`--fondo-k`, nunca más de 1.3×). En una pantalla de
1600 px el acercamiento es de apenas 3 %. La imagen fija que se ve mientras
carga lleva el mismo encuadre. En pantallas de 1700 px o más el recuadro se
angosta un poco y se pega a la derecha para dejar más hueco. En celular se
usa un recorte vertical centrado en el técnico.

| Archivo | Para | Peso |
|---|---|---|
| `fondo-ancho.mp4` / `.webm` | pantallas horizontales (1280×720) | 3.5 MB / 2.2 MB |
| `fondo-alto.mp4` / `.webm` | pantallas verticales, el celular (540×960) | 1.0 MB / 1.0 MB |
| `fondo-ancho.jpg` / `fondo-alto.jpg` | imagen fija | ~135 KB / ~63 KB |

Si cambias algún video, conserva los nombres y sube el número `?v=` en
`index.html` y en `sections.css`, para que nadie vea el anterior guardado.

Todas las ilustraciones actuales son **material de referencia** generado para
mostrar el diseño. Se reemplazan conservando el nombre del archivo —o
actualizando la ruta— sin tocar nada más.

| Archivo actual | Dónde se ve | Reemplazo sugerido |
|---|---|---|
| `assets/img/hero-fachada.svg` | Portada | Foto vertical 4:5, mínimo 1600 × 2000 px |
| `assets/img/nosotros.svg` | Sobre nosotros | Foto vertical 5:6 de cuadrilla en obra |
| `assets/img/fundador.svg` | Mensaje del fundador | Retrato 4:5, mínimo 900 × 1100 px |
| `assets/img/verticales.svg` | Trabajos verticales | Foto vertical 3:4 de descenso por cuerdas |

Recomendaciones: exportar en **WebP** (calidad 80) o JPG, con peso objetivo
menor a 300 KB por imagen. Al cambiar de extensión, actualiza la ruta en
`index.html` (portada, nosotros, fundador, verticales) y la línea de
`projects.js` que arma `p.img`. También puedes fijar la imagen de un proyecto
concreto agregándole `img: 'assets/img/westin.webp'` en `data.js`.

**Para poner video en la portada** sustituye la etiqueta `<img>` dentro de
`.hero__frame` por:

```html
<video autoplay muted loop playsinline poster="/assets/img/hero-poster.jpg">
  <source src="/assets/video/fachada.mp4" type="video/mp4">
</video>
```

El contenedor ya recorta, redondea y aplica el degradado sobre el video.

### Logotipo

El sitio usa el **logotipo oficial** de la empresa, tomado en vectores de
`ASAP_2.pdf` (primera página), sin fondo:

| Dónde | Qué versión | Archivo |
|---|---|---|
| Navegación | corta: edificios y «asap» (el texto chico no se leería a esa altura) | SVG dentro de `index.html` (`<svg class="logo__img">`) |
| Pie de página y precarga | completa, con «Gestión de Proyectos 369» | `assets/img/logo-asap.svg` |
| Pestaña del navegador | solo los edificios, con línea más gruesa, sobre cuadro oscuro | `assets/img/favicon.svg` |
| Espalda del técnico ilustrado | corta, en un solo color, como estampado | dentro de `index.html` |

Colores: «asap» en el azul del PDF (`#0095DA`); los edificios con el
degradado del logo (azul → azul pálido → gris → azul marino). Como el sitio
es oscuro, el gris del texto se aclaró (`#C3C8CE`) y el extremo azul marino
del degradado subió un tono (`#3D6C97`) para que no se pierdan sobre el
fondo. Si algún día se necesita la versión para fondo claro, basta con
regresar el texto a `#6C6E70` y el extremo del degradado a `#2C5B85`.

---

## 6. Conectar el formulario

El formulario valida en el navegador y muestra confirmación, pero **no envía
nada todavía**: no hay backend. Tres formas de activarlo, de menor a mayor
esfuerzo:

1. **Servicio externo** (Formspree, Getform, Basin): cambia `<form id="form">`
   por `<form id="form" action="https://formspree.io/f/TU_ID" method="POST">`
   y elimina el `e.preventDefault()` de `initForm()` en `main.js`.
2. **Función serverless** (Vercel, Netlify): reemplaza el cuerpo de
   `initForm()` por un `fetch()` a tu endpoint.
3. **Correo directo**: convierte el botón en un enlace `mailto:` con los campos
   prellenados (la opción menos recomendable).

---

## 7. Datos a confirmar antes de publicar

Ya están cargados los datos reales de contacto, los ocho servicios, la misión,
la visión, el mensaje del fundador y las 18 ubicaciones donde han trabajado.
**Falta confirmar o completar:**

- [ ] **Proyecto anunciado en la portada**: la tarjeta dice «Proyecto en
      curso · Guadalajara, Jalisco · Pintura de fachadas». Mantenlo al día en
      `OBRA_ACTIVA` (`data.js`).
- [ ] **Playa del Carmen**: en la lista llegó como «Plaza del Carmen» y se
      tomó como Playa del Carmen, Quintana Roo. Si era Ciudad del Carmen
      (Campeche), cámbialo en `UBICACIONES`.
- [ ] **Dominio del sitio**: se usa `www.asapgp.com.mx`, deducido del correo.
      Si el dominio es otro, actualízalo en `<link rel="canonical">`, en las
      etiquetas Open Graph, en los datos estructurados del `<head>`, en
      `sitemap.xml` y en `robots.txt`.
- [ ] **Formato de los teléfonos**: se normalizaron a
      `33 1323 0878` (Guadalajara) y `322 383 5244` (Puerto Vallarta).
- [ ] **Nombre del fundador**: hoy la firma muestra solo el cargo.
- [ ] **Sección de seguridad**: la mención a la **NOM-009-STPS-2011** y las
      afirmaciones sobre capacitación, análisis de riesgos y bitácoras de
      equipo deben corresponder con lo que la empresa efectivamente acredita.
- [ ] **Aviso de privacidad**: falta la página; el formulario ya lo menciona de
      forma genérica.
- [ ] **Nombres de las cintas de proveedores y clientes**: todos son
      ficticios, puestos solo para mostrar el diseño. Sustitúyelos por los
      reales en `CINTAS` (`data.js`) antes de publicar.

Los indicadores de "En números" y las cifras de la portada se calculan solos a
partir de `data.js` (especialidades, ubicaciones, estados). «Litorales» (2: el
Pacífico y el Caribe) es el único valor escrito a mano en `METRICAS`.

---

## 8. Publicación

Cualquier hosting estático sirve, sin configuración adicional:

- **Netlify / Vercel / Cloudflare Pages**: arrastra la carpeta o conecta el
  repositorio. Sin comando de build; directorio de publicación: la raíz.
- **Hosting tradicional (Hostinger, cPanel, FTP)**: sube todo a `public_html`.
  El `.htaccess` incluido ya activa compresión, caché y encabezados de
  seguridad. Trae el redirector a HTTPS comentado: quítale los `#` cuando el
  certificado SSL ya esté instalado y el sitio abra bien con `https://`.
- **GitHub Pages**: publica la rama y listo.

En hosting Apache o LiteSpeed eso ya lo resuelve el `.htaccess`. En Netlify,
Vercel o Cloudflare Pages viene activado de fábrica.

### Versionado y caché

Cada publicación lleva un número de versión visible en el código fuente:

```html
<meta name="asap-version" content="27 — 2026-10-03">
```

Para saber qué versión está viva en el servidor, abre el sitio, pulsa `Ctrl+U`
y busca esa línea. Es la forma más rápida de distinguir "no se subió" de "el
navegador está mostrando su copia guardada".

El `.htaccess` guarda las tipografías, imágenes y video un año —nunca cambian—
pero obliga al navegador a revalidar `html`, `css` y `js` en cada visita. Eso
significa que al editar un archivo en el servidor el cambio se ve de inmediato,
sin pedirle a nadie que limpie su caché. El costo es una petición condicional
por archivo, que el servidor contesta con un `304 Not Modified` de pocos bytes.

Como segunda red de seguridad, los estilos y los scripts se piden con un sufijo
de versión (`base.css?v=27`, y lo mismo en los `import` de `assets/js/`). Al
cambiar ese número la URL cambia, así que ninguna copia guardada puede
reutilizarse. Si subes una versión nueva, actualiza el número en los cuatro
sitios de `index.html`, en los `import` de `main.js`, `map.js` y `projects.js`,
y en el `<meta name="asap-version">`. Todos deben coincidir: si `data.js` se
pide con dos sufijos distintos, el navegador lo carga dos veces.

---

## 9. Detalles técnicos

**Rendimiento.** Sin frameworks ni librerías. El sitio completo pesa ~730 KB:
~65 KB de JavaScript propio, 73 KB de geometría del mapa, 73 KB de CSS, 200 KB
de tipografías y el resto en ilustraciones. Tipografías autoalojadas en woff2
variable con `font-display: swap` y precarga del subconjunto latino. Imágenes
bajo demanda con `loading="lazy"` salvo la de portada.

**Animación.** Revelados con `IntersectionObserver`, efectos de scroll sobre
`requestAnimationFrame` y el resto en CSS. Se respeta
`prefers-reduced-motion`: quien lo tenga activo ve la página completa y estática.

El **técnico en descenso** del margen izquierdo está dibujado a partir de una
fotografía de la cuadrilla: casco blanco, camisola gris con el logotipo en la
espalda, arnés, bolsa blanca y cubeta. Es una capa fija (`.vertical`, en
`components.css`) que no recibe eventos de puntero; al personaje solo se le
escribe `transform`, así que no provoca recálculos de maquetación.

Cuelga de **dos cuerdas**, como en la foto: bajan de la azotea a su mano y a su
casco, y siguen desde la mano y el arnés hasta el pie de la ventana, donde se
desvanecen. `main.js` las tiende en cada cuadro desde la posición real —ya
girada— de cada punto de amarre, así que nunca se despegan de él. Ninguna está
dibujada de antemano: durante la portada no se ve nada. Al quedar la portada
atrás entra desde arriba soltando cuerda —con un descenso de entrada más vivo
en los primeros 560 px de scroll y un recorrido lento el resto de la página—,
las cuerdas de abajo se despliegan con él, y todo se recoge igual al volver a
subir, porque depende de la posición del scroll y no de un estado guardado.
El balanceo responde a la velocidad del scroll con un resorte amortiguado, y
la cubeta tiene su propio péndulo.

No tapa nada: vive fuera del ancho del contenido, y las dos secciones cuyo
contenido invade los márgenes —«Cómo trabajamos», con sus tarjetas que se
deslizan de borde a borde, y las cintas de proveedores— van por delante de la
capa (`z-index: 41`), así que ahí el técnico pasa por detrás. Aparece a partir de **1440 px de
ancho**, que es donde el margen libre da holgura suficiente; por debajo se
retira por completo, igual que con movimiento reducido. Su tamaño crece con la
ventana en la misma proporción que el margen, de modo que la separación con el
texto se mantiene.

**Accesibilidad.** Navegación por teclado en el menú, el acordeón de servicios,
el mapa (estados, etiquetas y panel) y las tarjetas de ubicaciones; enlace
de salto al contenido; textos alternativos; contraste alto sobre fondo oscuro.

**Compatibilidad.** Chrome, Edge, Firefox y Safari en versiones recientes
(usa `aspect-ratio`, `clamp()`, `backdrop-filter`, `:is()` y módulos ES).
Sin JavaScript se muestra un aviso y el contenido estático sigue siendo legible.

---

## 10. Créditos y licencias

- **Geometría del mapa**: [svg-maps](https://github.com/VictorCazanave/svg-maps)
  de Victor Cazanave — CC BY 4.0. Texto de la licencia en
  `assets/data/MEXICO-MAP-LICENSE.md`; el crédito aparece en el pie del sitio y
  debe conservarse.
- **Outfit** e **Inter**: SIL Open Font License 1.1
  (`assets/fonts/LICENSE-Outfit.txt`, `assets/fonts/LICENSE-Inter.txt`).
- Ilustraciones de referencia, código y diseño: elaborados para este proyecto.
