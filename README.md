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
| 1 | Portada | `#inicio` | Titular animado, indicadores y tarjeta de obra en curso |
| 2 | Marquesina | — | Listado de servicios en movimiento continuo |
| 3 | Sobre nosotros | `#nosotros` | Historia, **misión**, **visión** y valores |
| 4 | Mensaje del fundador | — | Carta firmada con retrato |
| 5 | Servicios principales | `#servicios` | Los 8 servicios, cada uno desplegable con alcance, puntos clave e indicador |
| 6 | Trabajos verticales | `#verticales` | Ventajas del método, técnica, equipo y protocolo de seguridad |
| 7 | Cobertura | `#cobertura` | **Mapa 2D interactivo de México** con acercamiento por ciudad y pines de proyecto |
| 8 | Catálogo de proyectos | `#proyectos` | 16 proyectos filtrables por servicio y ciudad, con ficha ampliada |
| 9 | Proceso | `#proceso` | Cinco pasos con desplazamiento horizontal fijado al scroll |
| 10 | En números | — | Contadores animados |
| 11 | Cinta de cierre | — | Llamado a la acción |
| 12 | Contacto | `#contacto` | Datos de contacto y formulario |
| 13 | Pie | — | Navegación secundaria, avisos y créditos |

### El mapa interactivo

Render vectorial de las 32 entidades federativas. Al elegir una ciudad
—con los botones o haciendo clic sobre el estado— el mapa **se acerca con
animación** a esa zona, resalta la entidad, despliega los pines de cada obra
y el panel lateral lista los proyectos de esa ciudad.

Detalles de implementación relevantes:

- Los pines están **geolocalizados**: sus coordenadas provienen de latitud y
  longitud reales proyectadas al sistema del mapa (error medio ≈ 1 %).
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
| Ciudades, pines del mapa y textos de cobertura | `ZONAS` |
| Catálogo de proyectos y sus fichas | `PROYECTOS` |
| Pasos del proceso | `PROCESO` |
| Cifras de la sección "En números" | `METRICAS` |
| Misión, visión, valores, mensaje del fundador y datos de contacto | `EMPRESA` |

Los textos fijos (titulares de sección, portada y pie) están directamente en
`index.html`, identificados con comentarios por sección.

### Agregar una ciudad nueva

1. Añade el objeto a `ZONAS` con su `estadoId` (clave de tres letras: `que`,
   `jal`, `mic`, `gua`, `cmx`…; la lista completa está en `map-paths.js`).
2. Calcula la posición de cada pin. Las coordenadas `p: [x, y]` se obtienen de
   latitud/longitud con:

   ```
   x = 25.289593 · longitud − 0.456255 · latitud + 2998.2434
   y = −1.361053 · longitud − 28.023522 · latitud + 782.1887
   ```

   (Ejemplo: Monterrey, 25.6866 N / −100.3161 O → `x ≈ 449.6`, `y ≈ 198.9`.)
3. Agrega sus proyectos a `PROYECTOS` con `zona` igual al `id` de la ciudad.

---

## 5. Cómo sustituir imágenes y video

Todas las ilustraciones actuales son **material de referencia** generado para
mostrar el diseño. Se reemplazan conservando el nombre del archivo —o
actualizando la ruta— sin tocar nada más.

| Archivo actual | Dónde se ve | Reemplazo sugerido |
|---|---|---|
| `assets/img/hero-fachada.svg` | Portada | Foto vertical 4:5, mínimo 1600 × 2000 px |
| `assets/img/nosotros.svg` | Sobre nosotros | Foto vertical 5:6 de cuadrilla en obra |
| `assets/img/fundador.svg` | Mensaje del fundador | Retrato 4:5, mínimo 900 × 1100 px |
| `assets/img/verticales.svg` | Trabajos verticales | Foto vertical 3:4 de descenso por cuerdas |
| `assets/img/proyecto-01…16.svg` | Catálogo y fichas | Foto 4:3 por proyecto, mínimo 1200 × 900 px |

Recomendaciones: exportar en **WebP** (calidad 80) o JPG, con peso objetivo
menor a 300 KB por imagen. Al cambiar de extensión, actualiza la ruta en
`index.html` (portada, nosotros, fundador, verticales) y la línea de
`projects.js` que arma `p.img` para el catálogo.

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

El sitio está poblado con contenido de muestra para que se pueda ver terminado.
**Revisa y sustituye** lo siguiente:

- [ ] Teléfono `+52 442 000 0000` (aparece en navegación, menú, contacto, pie y
      en el bloque de datos estructurados del `<head>`).
- [ ] Correo `contacto@asap369.mx` y dominio `www.asap369.mx`
      (`<link rel="canonical">`, Open Graph, `sitemap.xml`, `robots.txt`).
- [ ] Nombre del fundador y su cargo exacto (hoy aparece solo el cargo).
- [ ] Cifras de "En números" y de los indicadores de cada servicio
      (+350 proyectos, +180 mil m², 12 años, 0 incidentes).
- [ ] Año de fundación (2013) y años de llegada a cada ciudad.
- [ ] Nombres, clientes y fichas técnicas de los 16 proyectos del catálogo.
- [ ] Mención a la **NOM-009-STPS-2011** y al resto de afirmaciones sobre
      seguridad, capacitación y pólizas: deben corresponder con lo que la
      empresa efectivamente acredita.
- [ ] Dirección fiscal / base operativa y horario de atención.
- [ ] Aviso de privacidad (falta la página; el formulario ya lo referencia de
      forma genérica).

---

## 8. Publicación

Cualquier hosting estático sirve, sin configuración adicional:

- **Netlify / Vercel / Cloudflare Pages**: arrastra la carpeta o conecta el
  repositorio. Sin comando de build; directorio de publicación: la raíz.
- **Hosting tradicional (cPanel, FTP)**: sube todo a `public_html`.
- **GitHub Pages**: publica la rama y listo.

Conviene servir con compresión (gzip o brotli) y caché larga para
`assets/fonts`, `assets/img` y `assets/css`.

---

## 9. Detalles técnicos

**Rendimiento.** Sin frameworks ni librerías. El sitio completo pesa ~750 KB:
68 KB de JavaScript propio, 73 KB de geometría del mapa, 73 KB de CSS, 200 KB
de tipografías y el resto en ilustraciones. Tipografías autoalojadas en woff2
variable con `font-display: swap` y precarga del subconjunto latino. Imágenes
bajo demanda con `loading="lazy"` salvo la de portada.

**Animación.** Revelados con `IntersectionObserver`, efectos de scroll sobre
`requestAnimationFrame` y el resto en CSS. Se respeta
`prefers-reduced-motion`: quien lo tenga activo ve la página completa y estática.

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
