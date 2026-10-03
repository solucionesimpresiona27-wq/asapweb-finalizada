/* =============================================================================
   ASAP 369 — Mapa interactivo de cobertura
   Render 2D de la República Mexicana con las ubicaciones de UBICACIONES
   marcadas dentro de su estado. Elegir un estado o una ubicación —en el mapa,
   en los botones, en el panel, en la sección de proyectos o en el pie de
   página— acerca el mapa a ese estado y lo ilumina. Todo pasa por
   seleccionar(), así que el mapa, el panel, los botones y el filtro de la
   sección de proyectos siempre dicen lo mismo.
   ========================================================================== */
import { ESTADOS, MAP_VIEWBOX } from './map-paths.js?v=27';
import { ENTIDADES, UBICACIONES, entidad, ubicacionesDe } from './data.js?v=27';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BASE = MAP_VIEWBOX.split(' ').map(Number);           // [0, 0, 793, 498]
const ASPECT = BASE[2] / BASE[3];
const NS = 'http://www.w3.org/2000/svg';

const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

const GEO = Object.fromEntries(ESTADOS.map(e => [e.id, e]));
const CON_UBICACION = new Set(UBICACIONES.map(u => u.estado));
const lugarPorId = id => UBICACIONES.find(u => u.id === id) || null;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const JUNTAR = 18;     // px por debajo de los cuales dos ubicaciones van en columna
const FILA = 21;       // separación entre filas de una columna
const COL_X = 30;      // distancia del centro a la columna

let svg, gEstados, gPuntos, gEtiquetas, tip, mapaBox;
let vista = [...BASE];        // viewBox actual
let destino = [...BASE];      // viewBox objetivo
let animando = false;
let sel = { estado: null, lugar: null };

/* -----------------------------------------------------------------------------
   Encuadres
   -------------------------------------------------------------------------- */
/* Proporción real del lienzo: el encuadre se adapta a ella para que el mapa
   llene la tarjeta en lugar de quedar con franjas vacías arriba y abajo. */
function aspectoLienzo() {
  const r = mapaBox?.getBoundingClientRect();
  return r && r.height ? r.width / r.height : ASPECT;
}

function ajustar([x, y, w, h]) {
  const a = aspectoLienzo();
  const cx = x + w / 2, cy = y + h / 2;
  if (w / h < a) w = h * a; else h = w / a;
  return [cx - w / 2, cy - h / 2, w, h];
}

/* Vista de todo el país, con un margen para que los puntos de las orillas
   (Cancún, Playa del Carmen) no queden pegados al borde. */
const vistaNacional = () => ajustar([BASE[0] - 12, BASE[1] - 8, BASE[2] + 46, BASE[3] + 16]);

/* El estado ocupa poco más de la mitad del ancho y queda un poco a la
   izquierda, para dejar aire a las etiquetas. Los estados pequeños (Ciudad
   de México, Colima, Querétaro) no se amplían de más: se ven con sus
   vecinos alrededor. Después se corre o se agranda en vertical para que
   ninguna etiqueta ni columna quede bajo la leyenda de abajo. */
function encuadre(estadoId) {
  const geo = GEO[estadoId];
  if (!geo) return vistaNacional();
  const [bx, by, bw, bh] = geo.b;
  const lista = ubicacionesDe(estadoId);
  const pts = lista.map(u => u.xy);
  const x0 = Math.min(bx, ...pts.map(p => p[0])), x1 = Math.max(bx + bw, ...pts.map(p => p[0]));
  const y0 = Math.min(by, ...pts.map(p => p[1])), y1 = Math.max(by + bh, ...pts.map(p => p[1]));

  const a = aspectoLienzo();
  const ancho = mapaBox?.clientWidth || BASE[2];
  let w = Math.max((x1 - x0) / 0.6, ((y1 - y0) / 0.74) * a, 120);
  let h = w / a;
  const cx = (x0 + x1) / 2 + w * 0.07;
  let top = (y0 + y1) / 2 - h / 2;

  for (let vuelta = 0; vuelta < 3; vuelta++) {
    const px = ancho / w;
    let arriba = Infinity, abajo = -Infinity;
    lista.forEach(u => {
      const juntos = lista.filter(v => Math.hypot(v.xy[0] - u.xy[0], v.xy[1] - u.xy[1]) * px < JUNTAR).length;
      const medio = juntos > 1 ? (juntos * FILA) / 2 + 8 : 14;
      arriba = Math.min(arriba, u.xy[1] - (medio + 24) / px);
      abajo = Math.max(abajo, u.xy[1] + (medio + 70) / px);    // 70 px: la leyenda
    });
    if (abajo - arriba > h) { h = abajo - arriba; w = h * a; top = arriba; continue; }
    if (arriba < top) top = arriba;
    if (abajo > top + h) top = abajo - h;
    break;
  }
  return [cx - w / 2, top, w, h];
}

/* Una unidad local de los marcadores vale exactamente un píxel CSS, sin
   importar el zoom ni el ancho del lienzo: se ven igual en un monitor que en
   un celular. */
function escalaLocal(caja = vista) {
  const w = mapaBox?.clientWidth || BASE[2];
  return w ? caja[2] / w : 1;
}

/* -----------------------------------------------------------------------------
   Construcción del SVG
   -------------------------------------------------------------------------- */
function construirSVG() {
  mapaBox = $('#mapa');
  if (!mapaBox) return false;

  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'mapa__svg');
  svg.setAttribute('viewBox', MAP_VIEWBOX);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Mapa de México con los estados y las ciudades donde ASAP 369 ha trabajado');

  svg.innerHTML = `
    <defs>
      <linearGradient id="gZona" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2E9BC9" stop-opacity=".92"/>
        <stop offset="1" stop-color="#5EC4EC" stop-opacity=".55"/>
      </linearGradient>
    </defs>
    <g id="mapaEstados"></g>
    <g id="mapaPuntos"></g>
    <g id="mapaEtiquetas"></g>`;

  mapaBox.insertBefore(svg, $('.mapa__hud', mapaBox));
  gEstados = $('#mapaEstados', svg);
  gPuntos = $('#mapaPuntos', svg);
  gEtiquetas = $('#mapaEtiquetas', svg);
  tip = $('#mapaTip');

  ESTADOS.forEach(e => {
    const path = document.createElementNS(NS, 'path');
    const activo = CON_UBICACION.has(e.id);
    path.setAttribute('d', e.d);
    path.setAttribute('class', 'st' + (activo ? ' st--zona' : ''));
    path.dataset.estado = e.id;
    path.dataset.nombre = e.nombre;
    if (activo) {
      const n = ubicacionesDe(e.id).length;
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `${e.nombre}: ${plural(n, 'ubicación', 'ubicaciones')}`);
    }
    gEstados.appendChild(path);
  });

  // un punto por ubicación, siempre dentro de su estado
  gPuntos.innerHTML = UBICACIONES.map(u => `
    <g class="mapa__punto${u.base ? ' mapa__punto--base' : ''}" data-lugar="${u.id}"
       data-x="${u.xy[0]}" data-y="${u.xy[1]}">
      <circle class="mapa__punto-zona" r="9"/>
      <circle class="mapa__punto-ring" r="4"/>
      <circle class="mapa__punto-dot" r="3.3"/>
    </g>`).join('');

  return true;
}

/* -----------------------------------------------------------------------------
   Etiquetas del estado elegido
   -----------------------------------------------------------------------------
   Las ubicaciones que en pantalla quedan a menos de 18 px —en la bahía de
   Banderas hay cinco en pocos kilómetros— se juntan en una columna que sale
   de su centro, con una fila por ubicación. Las demás llevan su nombre al
   lado. Las medidas van en unidades locales del grupo, que por la
   contraescala equivalen a píxeles.
   -------------------------------------------------------------------------- */
const anchoTexto = t => t.length * 6.6;

function agrupar(lista) {
  const px = (mapaBox.clientWidth || BASE[2]) / destino[2];
  const grupos = lista.map(u => ({ x: u.xy[0], y: u.xy[1], items: [u] }));
  let unido = true;
  while (unido) {
    unido = false;
    for (let i = 0; i < grupos.length && !unido; i++) {
      for (let j = i + 1; j < grupos.length && !unido; j++) {
        const a = grupos[i], b = grupos[j];
        if (Math.hypot(a.x - b.x, a.y - b.y) * px >= JUNTAR) continue;
        a.items.push(...b.items);
        a.x = a.items.reduce((s, u) => s + u.xy[0], 0) / a.items.length;
        a.y = a.items.reduce((s, u) => s + u.xy[1], 0) / a.items.length;
        grupos.splice(j, 1);
        unido = true;
      }
    }
  }
  // en columna, de norte a sur
  grupos.forEach(g => g.items.sort((p, q) => p.xy[1] - q.xy[1]));
  return grupos;
}

/* Colocación en píxeles del encuadre de destino. Primero las columnas y
   luego las etiquetas sueltas; cada una prueba la derecha y la izquierda —y
   si ambas chocan, un poco más arriba o más abajo— y se queda con la opción
   que no se sale del mapa, no tapa otra etiqueta y cubre menos puntos. */
function colocar(grupos) {
  const W = mapaBox.clientWidth || BASE[2], H = mapaBox.clientHeight || BASE[3];
  const px = W / destino[2];
  const enPx = ([x, y]) => [(x - destino[0]) * px, (y - destino[1]) * px];
  const puntos = UBICACIONES.map(u => enPx(u.xy));
  const puestas = [];
  const choca = (r, q) => r.x0 < q.x1 + 4 && r.x1 > q.x0 - 4 && r.y0 < q.y1 + 3 && r.y1 > q.y0 - 3;

  const caja = (g, s, dy) => {
    const [X, Y] = enPx([g.x, g.y]);
    const texto = Math.max(...g.items.map(u => anchoTexto(u.nombre)));
    if (g.items.length > 1) {
      const medio = ((g.items.length - 1) * FILA) / 2 + 11;
      const xa = X + s * (COL_X - 12), xb = X + s * (COL_X + 12 + texto);
      return { x0: Math.min(xa, xb), x1: Math.max(xa, xb), y0: Y - medio, y1: Y + medio };
    }
    const xa = X + s * 4, xb = X + s * (14 + texto);
    return { x0: Math.min(xa, xb), x1: Math.max(xa, xb), y0: Y + dy - 10, y1: Y + dy + 10 };
  };
  const costo = (g, r) => {
    let c = 0;
    if (r.x0 < 6 || r.x1 > W - 6 || r.y0 < 6 || r.y1 > H - 64) c += 1000;     // abajo está la leyenda
    puestas.forEach(q => { if (choca(r, q)) c += 500; });
    puntos.forEach(([x, y], i) => {
      if (g.items.includes(UBICACIONES[i])) return;
      if (x > r.x0 - 3 && x < r.x1 + 3 && y > r.y0 - 3 && y < r.y1 + 3) c += 20;
    });
    return c;
  };

  [...grupos]
    .sort((p, q) => q.items.length - p.items.length)
    .forEach(g => {
      const desfases = g.items.length > 1 ? [0] : [0, 14, -14, 26, -26, 38, -38];
      let mejor = null;
      desfases.forEach(dy => [1, -1].forEach(s => {
        const r = caja(g, s, dy);
        const c = costo(g, r) + Math.abs(dy) * .5 + (s < 0 ? .2 : 0);
        if (!mejor || c < mejor.c) mejor = { s, dy, r, c };
      }));
      g.lado = mejor.s;
      g.dy = mejor.dy;
      puestas.push(mejor.r);
    });
}

function etiquetaSuelta(u, s, dy = 0) {
  const ancho = anchoTexto(u.nombre) + 14;
  return `
    <g class="mapa__etq" data-lugar="${u.id}" data-x="${u.xy[0]}" data-y="${u.xy[1]}"
       tabindex="0" role="button" aria-label="Ver ${u.nombre}, ${entidad(u.estado).nombre}">
      ${dy ? `<path class="mapa__col-linea" d="M${4 * s} 0 L${9 * s} ${dy}"/>` : ''}
      <rect class="mapa__etq-zona" x="${s > 0 ? 4 : -ancho - 4}" y="${dy - 10}" width="${ancho}" height="20" rx="6"/>
      <text class="mapa__etq-txt" x="${11 * s}" y="${dy + 4}" text-anchor="${s > 0 ? 'start' : 'end'}">${u.nombre}</text>
    </g>`;
}

function columna(grupo, s) {
  const n = grupo.items.length;
  const y0 = -((n - 1) * FILA) / 2;
  const espina = (COL_X - 12) * s;
  const ancho = Math.max(...grupo.items.map(u => anchoTexto(u.nombre))) + 24;
  const filas = grupo.items.map((u, i) => {
    const y = y0 + i * FILA;
    return `
      <g class="mapa__fila" data-lugar="${u.id}" tabindex="0" role="button"
         aria-label="Ver ${u.nombre}, ${entidad(u.estado).nombre}">
        <rect class="mapa__etq-zona" x="${s > 0 ? COL_X - 9 : -(COL_X - 9) - ancho}" y="${y - 10}" width="${ancho}" height="20" rx="6"/>
        <path class="mapa__fila-tick" d="M${espina} ${y} H${(COL_X - 4) * s}"/>
        <circle class="mapa__fila-dot" cx="${COL_X * s}" cy="${y}" r="3"/>
        <text class="mapa__etq-txt" x="${(COL_X + 9) * s}" y="${y + 4}" text-anchor="${s > 0 ? 'start' : 'end'}">${u.nombre}</text>
      </g>`;
  }).join('');
  return `
    <g class="mapa__col" data-x="${grupo.x}" data-y="${grupo.y}">
      <path class="mapa__col-linea" d="M${5 * s} 0 H${espina} M${espina} ${y0} V${y0 + (n - 1) * FILA}"/>
      ${filas}
    </g>`;
}

function pintarEtiquetas() {
  gEtiquetas.innerHTML = '';
  if (!sel.estado) return;
  const grupos = agrupar(ubicacionesDe(sel.estado));
  colocar(grupos);
  gEtiquetas.innerHTML = grupos.map(g =>
    g.items.length > 1 ? columna(g, g.lado) : etiquetaSuelta(g.items[0], g.lado, g.dy)).join('');
  marcarSeleccion();
  escalarPines();
  requestAnimationFrame(() => {
    [...gEtiquetas.children].forEach((g, i) => {
      setTimeout(() => g.classList.add('is-live'), REDUCED ? 0 : 140 + i * 90);
    });
  });
}

/* Los marcadores mantienen su tamaño en pantalla aunque cambie el zoom */
function escalarPines() {
  const k = escalaLocal().toFixed(4);
  [...gPuntos.children, ...gEtiquetas.children].forEach(g => {
    g.setAttribute('transform', `translate(${g.dataset.x} ${g.dataset.y}) scale(${k})`);
  });
}

function marcarSeleccion() {
  $$('.mapa__punto', gPuntos).forEach(g => {
    const u = lugarPorId(g.dataset.lugar);
    g.classList.toggle('is-propio', !!sel.estado && u.estado === sel.estado);
    g.classList.toggle('is-otro', !!sel.estado && u.estado !== sel.estado);
    g.classList.toggle('is-sel', u.id === sel.lugar);
  });
  $$('[data-lugar]', gEtiquetas).forEach(g => {
    const on = g.dataset.lugar === sel.lugar;
    g.classList.toggle('is-sel', on);
    g.setAttribute('aria-pressed', String(on));
  });
}

/* -----------------------------------------------------------------------------
   Animación del viewBox
   -------------------------------------------------------------------------- */
function irA(box) {
  destino = box;
  if (REDUCED) {
    vista = [...destino];
    svg.setAttribute('viewBox', vista.join(' '));
    escalarPines();
    return;
  }
  if (animando) return;
  animando = true;

  const paso = () => {
    let quieto = true;
    for (let i = 0; i < 4; i++) {
      const delta = destino[i] - vista[i];
      if (Math.abs(delta) > 0.12) quieto = false;
      vista[i] += delta * 0.085;
    }
    svg.setAttribute('viewBox', vista.map(n => n.toFixed(2)).join(' '));
    escalarPines();
    if (quieto) {
      vista = [...destino];
      svg.setAttribute('viewBox', vista.join(' '));
      escalarPines();
      animando = false;
      return;
    }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* -----------------------------------------------------------------------------
   Panel lateral
   -------------------------------------------------------------------------- */
const filaLugar = u => `
  <button class="zona-proy${u.id === sel.lugar ? ' is-sel' : ''}" type="button" data-lugar="${u.id}"
          aria-pressed="${u.id === sel.lugar}">
    <span>
      <b>${u.nombre}</b>
      <span>${u.base ? 'Base de operaciones' : u.tipo || 'Ciudad'}</span>
    </span>
    ${ICON_ARROW}
  </button>`;

function panelNacional() {
  $('#zonaPanel').innerHTML = `
    <div class="zona-panel__head">
      <div>
        <div class="zona-panel__ciudad">Dónde hemos trabajado</div>
        <div class="zona-panel__estado">${plural(ENTIDADES.length, 'estado', 'estados')}</div>
      </div>
      <div class="zona-panel__desde">
        <b>${UBICACIONES.length}</b>
        <span>Ubicaciones</span>
      </div>
    </div>
    <p class="zona-panel__resumen">
      Operamos desde Guadalajara, del Pacífico al Caribe. Elige un estado en el mapa
      o en la lista para ver las ciudades donde hemos trabajado.
    </p>
    <div class="zona-panel__sep"></div>
    <div class="zona-panel__label"><b>Estados</b><i>Selecciona uno</i></div>
    <div class="zona-proyectos">
      ${ENTIDADES.map(e => {
        const lista = ubicacionesDe(e.id);
        return `
        <button class="zona-proy" type="button" data-estado="${e.id}">
          <span>
            <b>${e.nombre}</b>
            <span>${lista.map(u => u.nombre).join(' · ')}</span>
          </span>
          ${ICON_ARROW}
        </button>`;
      }).join('')}
    </div>`;
}

function panelEstado() {
  const e = entidad(sel.estado);
  const lista = ubicacionesDe(e.id);
  const u = lugarPorId(sel.lugar);
  const n = lista.length;
  $('#zonaPanel').innerHTML = `
    <div class="zona-panel__head">
      <div>
        <div class="zona-panel__ciudad">${u ? u.nombre : e.nombre}</div>
        <div class="zona-panel__estado">${u ? e.nombre : plural(n, 'ubicación', 'ubicaciones')}</div>
      </div>
      ${u?.base ? `
      <div class="zona-panel__desde">
        <b>Base</b>
        <span>Operativa</span>
      </div>` : ''}
    </div>
    <p class="zona-panel__resumen">${u
      ? `${u.base ? 'Nuestra base de operaciones. ' : ''}Hemos ejecutado trabajos verticales en ${u.nombre}${u.tipo === 'Región' ? ', en la costa de ' + e.nombre : ''}. Cuéntanos tu proyecto y lo cotizamos.`
      : `Elige una ubicación en el mapa o en la lista para señalarla.`}</p>
    <div class="zona-panel__sep"></div>
    <div class="zona-panel__label"><b>${u ? `En ${e.nombre}` : 'Ubicaciones'}</b><i>${n}</i></div>
    <div class="zona-proyectos">${lista.map(filaLugar).join('')}</div>
    <div class="zona-panel__cta">
      <a class="btn btn--ghost btn--sm" href="#contacto" data-cotizar="${u ? u.nombre : ''}">
        ${u ? `Cotizar en ${u.nombre}` : `Cotizar en ${e.nombre}`} ${ICON_ARROW}
      </a>
      <button class="zona-panel__volver" type="button" data-estado="">Ver todo México</button>
    </div>`;
}

/* -----------------------------------------------------------------------------
   Selección
   -------------------------------------------------------------------------- */
function seleccionar({ estado = null, lugar = null } = {}, { avisar = true } = {}) {
  const u = lugarPorId(lugar);
  const nuevo = { estado: u ? u.estado : (CON_UBICACION.has(estado) ? estado : null), lugar: u ? u.id : null };
  const cambiaEstado = nuevo.estado !== sel.estado;
  sel = nuevo;

  $$('.ciudad-btn').forEach(b => {
    const on = b.dataset.estado === (sel.estado || '');
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });

  $$('.st', gEstados).forEach(p => p.classList.toggle('st--on', p.dataset.estado === sel.estado));
  mapaBox.classList.toggle('is-focus', !!sel.estado);

  const e = entidad(sel.estado);
  $('#mapaEstado').textContent = u ? `${u.nombre}, ${e.nombre}` : e ? e.nombre : 'Vista nacional';

  if (cambiaEstado || !gEtiquetas.children.length) {
    irA(sel.estado ? encuadre(sel.estado) : vistaNacional());
    pintarEtiquetas();
  }
  marcarSeleccion();
  if (sel.estado) panelEstado(); else panelNacional();

  if (avisar) document.dispatchEvent(new CustomEvent('asap:mapa', { detail: { ...sel } }));
  document.dispatchEvent(new CustomEvent('asap:rendered'));
}

/* -----------------------------------------------------------------------------
   Botones de estados
   -------------------------------------------------------------------------- */
function renderBotones() {
  const box = $('#ciudadesBtns');
  if (!box) return;
  box.innerHTML = [
    ...ENTIDADES.map(e => `
      <button class="ciudad-btn" type="button" role="tab" aria-selected="false" data-estado="${e.id}">
        <i></i>${e.nombre}<em>${ubicacionesDe(e.id).length}</em>
      </button>`),
    `<button class="ciudad-btn ciudad-btn--reset" type="button" role="tab" aria-selected="true" data-estado="">
       Todo México
     </button>`
  ].join('');

  box.addEventListener('click', e => {
    const btn = e.target.closest('.ciudad-btn');
    if (btn) seleccionar({ estado: btn.dataset.estado || null });
  });
}

/* -----------------------------------------------------------------------------
   Eventos
   -------------------------------------------------------------------------- */
function verMapa() {
  const destinoScroll = window.innerWidth <= 1040 ? $('#mapa') : $('.cobertura__grid');
  destinoScroll?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}

function mostrarTip(evt, texto) {
  const r = mapaBox.getBoundingClientRect();
  tip.textContent = texto;
  tip.style.left = `${evt.clientX - r.left}px`;
  tip.style.top = `${evt.clientY - r.top}px`;
  tip.classList.add('is-on');
}

function bindMapa() {
  gEstados.addEventListener('click', e => {
    const path = e.target.closest('.st--zona');
    if (path) seleccionar({ estado: path.dataset.estado });
  });
  gEstados.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const path = e.target.closest('.st--zona');
    if (!path) return;
    e.preventDefault();
    seleccionar({ estado: path.dataset.estado });
  });

  // nombre del estado o de la ubicación bajo el puntero
  svg.addEventListener('mousemove', e => {
    const punto = e.target.closest('.mapa__punto');
    if (punto) {
      const u = lugarPorId(punto.dataset.lugar);
      mostrarTip(e, `${u.nombre} · ${entidad(u.estado).nombre}`);
      return;
    }
    const path = e.target.closest('.st');
    if (path && !e.target.closest('#mapaEtiquetas')) mostrarTip(e, path.dataset.nombre);
    else tip.classList.remove('is-on');
  });
  svg.addEventListener('mouseleave', () => tip.classList.remove('is-on'));

  // un punto, una etiqueta o una fila de columna eligen esa ubicación
  const elegir = el => {
    const g = el.closest('.mapa__punto, .mapa__etq, .mapa__fila');
    if (!g) return false;
    seleccionar({ lugar: g.dataset.lugar });
    return true;
  };
  [gPuntos, gEtiquetas].forEach(capa => capa.addEventListener('click', e => elegir(e.target)));
  gEtiquetas.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (elegir(e.target)) {
      e.preventDefault();
      $(`[data-lugar="${sel.lugar}"]`, gEtiquetas)?.focus();
    }
  });

  // al pasar sobre una fila se enciende su punto en el mapa
  const encender = (id, on) => $(`.mapa__punto[data-lugar="${id}"]`, gPuntos)?.classList.toggle('is-hover', on);
  gEtiquetas.addEventListener('pointerover', e => { const g = e.target.closest('[data-lugar]'); if (g) encender(g.dataset.lugar, true); });
  gEtiquetas.addEventListener('pointerout', e => { const g = e.target.closest('[data-lugar]'); if (g) encender(g.dataset.lugar, false); });

  $('#zonaPanel').addEventListener('click', e => {
    const lugar = e.target.closest('[data-lugar]');
    if (lugar) { seleccionar({ lugar: lugar.dataset.lugar }); return; }
    const estado = e.target.closest('[data-estado]');
    if (estado) { seleccionar({ estado: estado.dataset.estado || null }); return; }
    const cotizar = e.target.closest('[data-cotizar]');
    if (cotizar) {
      const campo = $('#f-ciudad');
      if (campo && cotizar.dataset.cotizar) campo.value = cotizar.dataset.cotizar;
    }
  });

  // desde fuera del mapa: la sección de proyectos y el pie de página
  document.addEventListener('asap:ver-lugar', e => {
    seleccionar({ lugar: e.detail.lugar });
    if (e.detail.desplazar) verMapa();
  });
  document.addEventListener('asap:ver-estado', e => {
    if ((e.detail.estado || null) !== sel.estado || sel.lugar) seleccionar({ estado: e.detail.estado }, { avisar: e.detail.avisar !== false });
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-ver-estado]');
    if (a) seleccionar({ estado: a.dataset.verEstado });
  });

  let reajuste;
  addEventListener('resize', () => {
    clearTimeout(reajuste);
    reajuste = setTimeout(() => {
      irA(sel.estado ? encuadre(sel.estado) : vistaNacional());
      pintarEtiquetas();
    }, 140);
  });
}

/* -----------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
export function initMapa() {
  if (!construirSVG()) return;
  vista = vistaNacional();
  destino = [...vista];
  svg.setAttribute('viewBox', vista.join(' '));
  renderBotones();
  bindMapa();
  escalarPines();
  seleccionar({}, { avisar: false });
  requestAnimationFrame(() => {
    [...gPuntos.children].forEach((g, i) => setTimeout(() => g.classList.add('is-live'), REDUCED ? 0 : 300 + i * 45));
  });
}
