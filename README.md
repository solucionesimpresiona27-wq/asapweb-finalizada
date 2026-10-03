# ASAP Gestión de Proyectos 369 — Sitio web

Sitio institucional de una sola página para **ASAP Gestión de Proyectos 369**:
mantenimiento de fachadas y trabajos verticales en Querétaro, Guadalajara,
Puerto Vallarta y Morelia.

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
| 7 | Cobertura | `#cobertura` | **Mapa 2D interactivo de México** con acercamiento por ciudad y pines de proyecto |
| 8 | Portafolio | `#proyectos` | 12 proyectos filtrables por ciudad, con ficha ampliada |
| 9 | Proceso | `#proceso` | Cinco pasos con desplazamiento horizontal fijado al scroll |
| 10 | En números | — | Contadores animados, calculados desde el propio contenido |
| 11 | Cinta de cierre | — | Llamado a la acción |
| 12 | Contacto | `#contacto` | Datos de contacto y formulario |
| 13 | Pie | — | Navegación secundaria, avisos y créditos |

### El mapa interactivo

Render vectorial de las 32 entidades federativas. Al elegir una ciudad
—con los botones o haciendo clic sobre el estado— el mapa **se acerca con
animación** a esa zona, resalta la entidad y **señala cada proyecto** del
portafolio ejecutado ahí; el panel lateral lista los mismos proyectos.

Los marcadores salen directo de `PROYECTOS`: agregar un proyecto a esa lista
basta para que aparezca en el mapa, sin tocar código. Los que comparten ciudad
—o están a tiro de piedra, como Puerto Vallarta y Nuevo Vallarta— se agrupan en
un solo anclaje geográfico del que cuelga una columna con un renglón por obra.
Al hacer clic en cualquiera se abre su ficha.

Detalles de implementación relevantes:

- Los pines están **geolocalizados**: sus coordenadas provienen de latitud y
  longitud reales proyectadas al sistema del mapa (error medio ≈ 1 %).
- Una ciudad puede abarcar varias entidades: la zona de Puerto Vallarta resalta
  Jalisco y Nayarit, porque Nuevo Vallarta pertenece a Nayarit.
- La columna de proyectos se dibuja a la derecha del anclaje y salta a la
  izquierda si no cabe; si dos columnas se encimaran, se separan solas.
- Los marcadores miden lo mismo en pantalla a cualquier zoom y en cualquier
  ancho de lienzo, del monitor al celular.
- Los marcadores mantienen su tamaño en pantalla sin importar el acercamiento.
- Las etiquetas se acomodan solas: si dos se encimarían, una se desplaza y se
  dibuja una línea guía hasta su pin; si una se sale del lienzo, salta al otro
  lado del marcador.
- El encuadre se adapta a la proporción real de la tarjeta, así que el mapa
  llena el espacio tanto en escritorio como en celular.

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
    │   └── projects.js         Catálogo, filtros y ficha de proyecto
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
| Coordenadas de cada ciudad en el mapa | `CIUDADES` |
| Zonas del selector y textos de cobertura | `ZONAS` |
| Portafolio y sus fichas | `PROYECTOS` |
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
  proyecto: null,              // o el id de un proyecto para tomar su ubicación
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  servicio: 'Pintura de fachadas'   // null para ocultar esa línea
};
```

Con `mostrar: false` la tarjeta vuelve al texto genérico de trabajos verticales
y deja de anunciar un proyecto activo. **Mantén este dato al día**: dice que
hay un trabajo ejecutándose en este momento en esa ciudad.

### Cintas de proveedores y clientes

Las dos cintas animadas que siguen al portafolio salen de `CINTAS` en
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

### Agregar un proyecto

Basta con sumarlo a `PROYECTOS` indicando una `ciudad` que ya exista en
`CIUDADES`. Aparece solo en el portafolio, en el panel del mapa y como marcador
sobre el mapa.

### Agregar una ciudad nueva

1. Calcula sus coordenadas a partir de latitud y longitud, y añádela a
   `CIUDADES`:

   ```
   x =  25.289593 · longitud −  0.456255 · latitud + 2998.2434
   y =  −1.361053 · longitud − 28.023522 · latitud +  782.1887
   ```

   (Ejemplo: Monterrey, 25.6866 N / −100.3161 O → `x ≈ 449.6`, `y ≈ 198.9`.)
2. Si además es una zona nueva del selector, añádela a `ZONAS` con su arreglo
   `estados` (claves de tres letras: `jal`, `mic`, `que`, `nay`, `nle`, `cmx`…;
   la lista completa está en `map-paths.js`) y su `centro`, que es la ciudad
   que la representa en la vista nacional. Si la zona abarca dos entidades,
   inclúyelas todas en `estados`.
3. Agrega sus proyectos a `PROYECTOS` con `zona` igual al `id` de la zona.

### Enriquecer una ficha del portafolio

Cada proyecto necesita solo `id`, `nombre`, `zona`, `ciudad` y `estado`. Todos
los demás campos son **opcionales** y la interfaz se adapta a los que existan:

```js
{
  id: 'westin', nombre: 'Hotel Westin',
  zona: 'vallarta', ciudad: 'Puerto Vallarta', estado: 'Jalisco',
  sector: 'Hotelería',
  servicios: ['cristales', 'sellado'],   // activa el filtro por servicio
  anio: '2024', altura: '52 m', niveles: '14 niveles',
  superficie: '13,700 m²', duracion: '31 días',
  reto: '…', solucion: '…', resultado: '…'
}
```

En cuanto **algún** proyecto declare `servicios`, aparece solo el filtro por
servicio en el portafolio. Los campos que se llenen se suman a la ficha técnica
y a la tarjeta; los que falten simplemente no se muestran.

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
cuadros intermedios (72 por segundo de base). Se muestra con su resolución
original (1280×720), sin ampliarlo más de lo necesario para cubrir la
portada, y con un ajuste de brillo para que se vea luminoso. Se alinea a su
lado derecho para que la torre y el técnico asomen junto al recuadro; en
pantallas de 1700 px o más, donde el video ya ocupa todo el ancho, el
recuadro se angosta un poco y se pega a la derecha con el mismo fin. En celular se usa un recorte vertical centrado en el técnico.

| Archivo | Para | Peso |
|---|---|---|
| `fondo-ancho.mp4` / `.webm` | pantallas horizontales (1280×720) | 3.4 MB / 1.8 MB |
| `fondo-alto.mp4` / `.webm` | pantallas verticales, el celular (540×960) | 0.8 MB / 0.9 MB |
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
| `assets/img/proyecto-01…16.svg` | Portafolio y fichas | Foto 4:3 por proyecto, mínimo 1200 × 900 px |

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

El isotipo que se usa hoy en navegación, precarga, pie y favicon es una
**reconstrucción vectorial** del logo de la empresa, dibujada para no depender
de un archivo externo. Para usar el original:

- Sustituye `assets/img/favicon.svg`.
- Reemplaza el bloque `<svg class="logo__mark">` en `index.html` (aparece tres
  veces: navegación, pie y precarga) por el SVG oficial.

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
la visión, el mensaje del fundador y el portafolio de 12 proyectos.
**Falta confirmar o completar:**

- [ ] **Proyecto anunciado en la portada**: la tarjeta dice «Proyecto en
      curso · Guadalajara, Jalisco · Pintura de fachadas». Mantenlo al día en
      `OBRA_ACTIVA` (`data.js`).
- [ ] **Holiday Inn Express / Select**: en la lista original este proyecto no
      traía ciudad. Quedó provisionalmente en Puerto Vallarta (en `data.js`,
      marcado con un comentario). Corrígelo si corresponde a otra ciudad.
- [ ] **Dominio del sitio**: se usa `www.asapgp.com.mx`, deducido del correo.
      Si el dominio es otro, actualízalo en `<link rel="canonical">`, en las
      etiquetas Open Graph, en los datos estructurados del `<head>`, en
      `sitemap.xml` y en `robots.txt`.
- [ ] **Formato de los teléfonos**: se normalizaron a
      `33 1323 0878` (Guadalajara) y `322 383 5244` (Puerto Vallarta).
- [ ] **Nombre del fundador**: hoy la firma muestra solo el cargo.
- [ ] **Ficha técnica de cada proyecto** (año, superficie, altura, servicios,
      reto, solución y resultado): opcional, pero es lo que convierte el
      portafolio en un catálogo consultable. Ver "Enriquecer una ficha".
- [ ] **Sección de seguridad**: la mención a la **NOM-009-STPS-2011** y las
      afirmaciones sobre capacitación, análisis de riesgos y bitácoras de
      equipo deben corresponder con lo que la empresa efectivamente acredita.
- [ ] **Aviso de privacidad**: falta la página; el formulario ya lo menciona de
      forma genérica.
- [ ] **Nombres de las cintas de proveedores y clientes**: todos son
      ficticios, puestos solo para mostrar el diseño. Sustitúyelos por los
      reales en `CINTAS` (`data.js`) antes de publicar.

Los indicadores de "En números" y las cifras de la portada se calculan solos a
partir de `data.js` (especialidades, proyectos, ciudades). Si prefieres mostrar
los totales históricos de la empresa en vez de lo publicado en el portafolio,
edita `METRICAS` con los valores reales.

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
<meta name="asap-version" content="24 — 2026-10-03">
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
de versión (`base.css?v=24`, y lo mismo en los `import` de `assets/js/`). Al
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
el mapa y la ficha de proyecto (con foco atrapado y cierre con `Esc`); enlace
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
