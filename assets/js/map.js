/* =============================================================================
   ASAP 369 — Mapa interactivo de cobertura
   Render 2D de la República Mexicana con acercamiento animado por ciudad
   y marcadores geolocalizados de los proyectos ejecutados.
   ========================================================================== */
import { ESTADOS, MAP_VIEWBOX } from './map-paths.js?v=24';
import { ZONAS, PROYECTOS, CIUDADES } from './data.js?v=24';
import { abrirProyecto, filtrarPorZona } from './projects.js?v=24';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BASE = MAP_VIEWBOX.split(' ').map(Number);           // [0, 0, 793, 498]
const ASPECT = BASE[2] / BASE[3];

/* Proporción real del lienzo: el encuadre se adapta a ella para que el mapa
   llene la tarjeta en lugar de quedar con franjas vacías arriba y abajo. */
function aspectoLienzo() {
  const r = mapaBox?.getBoundingClientRect();
  return r && r.height ? r.width / r.height : ASPECT;
}

/* Ajusta una caja al aspecto del lienzo creciendo por el lado que falte */
function ajustar(box) {
  const a = aspectoLienzo();
  let [x, y, w, h] = box;
  const cx = x + w / 2, cy = y + h / 2;
  if (w / h < a) w = h * a; else h = w / a;
  return [cx - w / 2, cy - h / 2, w, h];
}

const vistaNacional = () => ajustar([...BASE]);
const NS = 'http://www.w3.org/2000/svg';

const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

let svg, gEstados, gPines, tip, mapaBox;
let vista = [...BASE];        // viewBox actual
let destino = [...BASE];      // viewBox objetivo
let animando = false;
let zonaActiva = null;

const proyectosDe = zonaId => PROYECTOS.filter(p => p.zona === zonaId);

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
  svg.setAttribute('aria-label', 'Mapa de México con los estados donde ASAP 369 ha ejecutado proyectos');

  svg.innerHTML = `
    <defs>
      <linearGradient id="gZona" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2E9BC9" stop-opacity=".92"/>
        <stop offset="1" stop-color="#5EC4EC" stop-opacity=".55"/>
      </linearGradient>
      <filter id="fGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g id="mapaEstados"></g>
    <g id="mapaPines"></g>`;

  mapaBox.insertBefore(svg, $('.mapa__hud', mapaBox));
  gEstados = $('#mapaEstados', svg);
  gPines = $('#mapaPines', svg);
  tip = $('#mapaTip');

  const conZona = new Set(ZONAS.flatMap(z => z.estados));

  ESTADOS.forEach(e => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', e.d);
    path.setAttribute('class', 'st' + (conZona.has(e.id) ? ' st--zona' : ''));
    path.dataset.estado = e.id;
    path.dataset.nombre = e.nombre;
    if (conZona.has(e.id)) {
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `Ver proyectos en ${e.nombre}`);
    }
    gEstados.appendChild(path);
  });

  return true;
}

/* -----------------------------------------------------------------------------
   Marcadores
   -----------------------------------------------------------------------------
   Cada proyecto del portafolio se señala en el mapa. Los que comparten ciudad
   —o están a tiro de piedra, como Puerto Vallarta y Nuevo Vallarta— se agrupan
   en un solo anclaje geográfico del que sale una columna con un marcador por
   proyecto. Las medidas de la columna están en unidades locales del grupo, que
   por la contraescala equivalen a píxeles en pantalla.
   -------------------------------------------------------------------------- */
/* Escala del grupo de un marcador: hace que una unidad local valga exactamente
   un píxel CSS, sin importar el zoom ni el ancho del lienzo. Así los marcadores
   se ven igual en un monitor que en un celular. */
function escalaLocal(caja = vista) {
  const w = mapaBox?.clientWidth || BASE[2];
  return w ? caja[2] / w : 1;
}

const FUSION = 9;      // unidades del viewBox por debajo de las cuales dos ciudades se agrupan
const FILA = 19;       // separación vertical entre proyectos de una columna
const COL_X = 32;      // distancia del anclaje a la columna
const ALTO_FILA = 15;  // alto aproximado de una fila, para separar columnas

/* Agrupa los proyectos por ciudad y fusiona las ciudades muy cercanas */
function agrupar(lista) {
  const porCiudad = new Map();
  lista.forEach(p => {
    const c = CIUDADES[p.ciudad];
    if (!c) return;
    if (!porCiudad.has(p.ciudad)) {
      porCiudad.set(p.ciudad, { ciudades: [p.ciudad], x: c[0], y: c[1], items: [] });
    }
    porCiudad.get(p.ciudad).items.push(p);
  });

  const grupos = [...porCiudad.values()];
  for (let i = 0; i < grupos.length; i++) {
    if (!grupos[i]) continue;
    for (let j = i + 1; j < grupos.length; j++) {
      if (!grupos[j]) continue;
      const a = grupos[i], b = grupos[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) >= FUSION) continue;
      a.items.push(...b.items);
      a.ciudades.push(...b.ciudades);
      a.x = (a.x + b.x) / 2;
      a.y = (a.y + b.y) / 2;
      grupos[j] = null;
    }
  }
  return grupos.filter(Boolean);
}

/* Reparte verticalmente las columnas que se encimarían entre sí */
function separarColumnas(grupos) {
  const k = escalaLocal(destino);
  const puestas = [];
  grupos.forEach(g => {
    const alto = Math.max(1, g.items.length) * FILA;
    // centro de la columna en unidades del viewBox
    let centro = g.y;
    const medio = (alto / 2) * k;
    let intentos = 0;
    let choca = true;
    while (choca && intentos < 20) {
      choca = false;
      for (const q of puestas) {
        const cercaX = Math.abs(q.x - g.x) < 70 * k;
        const cruza = centro - medio < q.abajo + 6 * k && centro + medio > q.arriba - 6 * k;
        if (cercaX && cruza) {
          centro = q.abajo + medio + 8 * k;
          choca = true;
        }
      }
      intentos++;
    }
    g.desfase = (centro - g.y) / k;   // desplazamiento en unidades locales del grupo
    puestas.push({ x: g.x, arriba: centro - medio, abajo: centro + medio });
  });
}

/* Ancho aproximado que necesita la columna, en píxeles de pantalla */
function anchoColumna(grupo) {
  const masLargo = Math.max(...grupo.items.map(p => p.nombre.length));
  const encabezado = grupo.ciudades.join(' · ').length * 5.6;
  return COL_X + 14 + Math.max(masLargo * 5.9, encabezado);
}

/* ¿Cabe la columna a la derecha del anclaje? Si no, se dibuja hacia la izquierda.
   Se mide contra el encuadre de destino: cuando se pintan los marcadores la
   animación del viewBox apenas va empezando. */
function ladoColumna(grupo) {
  const r = mapaBox.getBoundingClientRect();
  if (!r.width) return 1;
  const pxPorUnidad = r.width / destino[2];
  const libreDerecha = (destino[0] + destino[2] - grupo.x) * pxPorUnidad;
  return libreDerecha >= anchoColumna(grupo) + 14 ? 1 : -1;
}

function crearGrupo(grupo) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'mapa__cluster');
  g.dataset.x = grupo.x;
  g.dataset.y = grupo.y;

  const n = grupo.items.length;
  const lado = ladoColumna(grupo);
  const ancho = anchoColumna(grupo);
  const desfase = grupo.desfase || 0;
  const y0 = desfase - ((n - 1) * FILA) / 2;
  const ciudad = grupo.ciudades.join(' · ');

  const colX = COL_X * lado;
  const spineX = (COL_X - 12) * lado;
  const anclaje = lado > 0 ? 'start' : 'end';

  const filas = grupo.items.map((p, i) => {
    const y = y0 + i * FILA;
    const zonaX = lado > 0 ? COL_X - 9 : -(ancho);
    return `
      <g class="mapa__obra" data-proy="${p.id}" tabindex="0" role="button"
         aria-label="Ver ${p.nombre}, ${p.ciudad}">
        <rect class="mapa__obra-zona" x="${zonaX.toFixed(1)}" y="${(y - 8.5).toFixed(1)}" width="${(ancho + 4).toFixed(1)}" height="17" rx="5"/>
        <path class="mapa__obra-tick" d="M${spineX} ${y} H${(COL_X - 4) * lado}"/>
        <circle class="mapa__obra-dot" cx="${colX}" cy="${y}" r="2.9"/>
        <text class="mapa__obra-label" x="${(COL_X + 8) * lado}" y="${(y + 3.4).toFixed(1)}" text-anchor="${anclaje}">${p.nombre}</text>
      </g>`;
  }).join('');

  const spine = n > 1
    ? `<path class="mapa__cluster-spine" d="M${spineX} ${y0} V${y0 + (n - 1) * FILA}"/>`
    : '';

  g.innerHTML = `
    <path class="mapa__cluster-link" d="M${5 * lado} 0 H${spineX} V${desfase}"/>
    ${spine}
    <circle class="mapa__pin-ring" cx="0" cy="0" r="4"/>
    <circle class="mapa__pin-dot" cx="0" cy="0" r="3.6"/>
    <text class="mapa__cluster-ciudad" x="${(COL_X - 4) * lado}" y="${(y0 - 13).toFixed(1)}" text-anchor="${anclaje}">${ciudad}</text>
    ${filas}`;
  return g;
}

/* Marcador simple de la vista nacional: una ciudad por zona */
function crearPinZona(zona) {
  const c = CIUDADES[zona.centro];
  if (!c) return null;
  const n = proyectosDe(zona.id).length;
  const r = mapaBox.getBoundingClientRect();
  const pxPorUnidad = r.width ? r.width / destino[2] : 1;
  const libre = (destino[0] + destino[2] - c[0]) * pxPorUnidad;
  const lado = libre >= zona.ciudad.length * 6.4 + 40 ? 1 : -1;

  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'mapa__pin mapa__pin--sede');
  g.dataset.x = c[0];
  g.dataset.y = c[1];
  g.dataset.ir = zona.id;
  g.setAttribute('tabindex', '0');
  g.setAttribute('role', 'button');
  g.setAttribute('aria-label', `Ver ${zona.ciudad}`);
  g.innerHTML = `
    <circle class="mapa__pin-ring" cx="0" cy="0" r="4"/>
    <circle class="mapa__pin-dot" cx="0" cy="0" r="3.4"/>
    <text class="mapa__pin-label" x="${9 * lado}" y="3.6" text-anchor="${lado > 0 ? 'start' : 'end'}">${zona.ciudad}${n ? ` · ${n}` : ''}</text>`;
  return g;
}

function pintarPines(zona) {
  gPines.innerHTML = '';

  if (zona) {
    const grupos = agrupar(proyectosDe(zona.id));
    separarColumnas(grupos);
    grupos.forEach(gr => gPines.appendChild(crearGrupo(gr)));

    // una zona sin proyectos (la base) conserva su marcador de ciudad
    if (!grupos.length) {
      const pin = crearPinZona(zona);
      if (pin) gPines.appendChild(pin);
    }
  } else {
    ZONAS.forEach(z => {
      const pin = crearPinZona(z);
      if (pin) gPines.appendChild(pin);
    });
  }

  escalarPines();
  requestAnimationFrame(() => {
    acomodarEtiquetas();
    [...gPines.children].forEach((g, i) => {
      setTimeout(() => g.classList.add('is-live'), REDUCED ? 0 : i * 110);
    });
  });
}

/* -----------------------------------------------------------------------------
   Separa las etiquetas de los marcadores simples (vista nacional) cuando dos
   ciudades quedan tan cerca que sus nombres se encimarían.
   -------------------------------------------------------------------------- */
function acomodarEtiquetas() {
  const textos = $$('.mapa__pin-label', gPines);
  textos.forEach(t => t.setAttribute('y', '3.6'));
  if (textos.length < 2) return;

  const escala = textos[0].getScreenCTM()?.d || 1;
  const cajas = textos
    .map(t => ({ t, r: t.getBoundingClientRect() }))
    .sort((a, b) => a.r.top - b.r.top);

  const puestas = [];
  cajas.forEach(item => {
    let top = item.r.top, abajo = item.r.bottom, corrido = 0, choque = true, vueltas = 0;
    while (choque && vueltas < 24) {
      choque = false;
      for (const q of puestas) {
        const cruzaX = item.r.left < q.right + 6 && item.r.right > q.left - 6;
        const cruzaY = top < q.abajo + 3 && abajo > q.top - 3;
        if (cruzaX && cruzaY) {
          const salto = q.abajo + 4 - top;
          top += salto; abajo += salto; corrido += salto;
          choque = true;
        }
      }
      vueltas++;
    }
    if (corrido) item.t.setAttribute('y', (3.6 + corrido / escala).toFixed(2));
    puestas.push({ left: item.r.left, right: item.r.right, top, abajo });
  });
}

/* Los marcadores mantienen su tamaño en pantalla aunque cambie el zoom */
function escalarPines() {
  const k = escalaLocal();
  [...gPines.children].forEach(g => {
    g.setAttribute('transform', `translate(${g.dataset.x} ${g.dataset.y}) scale(${k.toFixed(4)})`);
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
      acomodarEtiquetas();
      animando = false;
      return;
    }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* Puntos de una zona: las ciudades donde tiene proyectos, o su ciudad centro */
function puntosDe(zona) {
  const ciudades = new Set(proyectosDe(zona.id).map(p => p.ciudad));
  if (!ciudades.size && zona.centro) ciudades.add(zona.centro);
  return [...ciudades].map(c => CIUDADES[c]).filter(Boolean);
}

/* Encuadre calculado a partir de las ciudades de la zona */
function encuadre(zona) {
  const pts = puntosDe(zona);
  if (!pts.length) return vistaNacional();

  const xs = pts.map(p => p[0]);
  const ys = pts.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

  const a = aspectoLienzo();
  let w = Math.max(Math.max(...xs) - Math.min(...xs) + 96, 186);
  let h = w / a;
  const alto = Math.max(...ys) - Math.min(...ys) + 66;
  if (alto > h) { h = alto; w = h * a; }

  // el encuadre se desplaza a la izquierda para dejar aire a la columna
  return [cx - w * 0.34, cy - h / 2, w, h];
}

/* -----------------------------------------------------------------------------
   Panel lateral
   -------------------------------------------------------------------------- */
function panelNacional() {
  const total = PROYECTOS.length;
  $('#zonaPanel').innerHTML = `
    <div class="zona-panel__head">
      <div>
        <div class="zona-panel__ciudad">Dónde trabajamos</div>
        <div class="zona-panel__estado">${ZONAS.length} ciudades · 4 estados</div>
      </div>
      <div class="zona-panel__desde">
        <b>${total}</b>
        <span>Proyectos</span>
      </div>
    </div>
    <p class="zona-panel__resumen">
      Operamos desde Guadalajara hacia el occidente y el centro del país. Elige una ciudad
      en el mapa o en los botones de arriba para ver la obra ejecutada en ese estado.
    </p>
    <div class="zona-panel__sep"></div>
    <div class="zona-panel__label"><b>Ciudades</b><i>Selecciona una</i></div>
    <div class="zona-proyectos">
      ${ZONAS.map(z => {
        const n = proyectosDe(z.id).length;
        const nota = z.base ? 'Base operativa' : `${n} ${n === 1 ? 'proyecto' : 'proyectos'}`;
        return `
        <button class="zona-proy" type="button" data-ir="${z.id}">
          <span>
            <b>${z.ciudad}</b>
            <span>${z.estado} · ${nota}</span>
          </span>
          ${ICON_ARROW}
        </button>`;
      }).join('')}
    </div>
    <div class="zona-panel__cta">
      <a class="btn btn--ghost btn--sm" href="#proyectos">Ver portafolio completo ${ICON_ARROW}</a>
    </div>`;
}

function panelZona(zona) {
  const lista = proyectosDe(zona.id);
  $('#zonaPanel').innerHTML = `
    <div class="zona-panel__head">
      <div>
        <div class="zona-panel__ciudad">${zona.ciudad}</div>
        <div class="zona-panel__estado">${zona.estado}</div>
      </div>
      <div class="zona-panel__desde">
        <b>${zona.base ? 'Base' : lista.length}</b>
        <span>${zona.base ? 'Operativa' : lista.length === 1 ? 'Proyecto' : 'Proyectos'}</span>
      </div>
    </div>
    <p class="zona-panel__resumen">${zona.resumen}</p>
    <div class="zona-panel__tags">${zona.destacados.map(d => `<span>${d}</span>`).join('')}</div>
    <div class="zona-panel__sep"></div>
    ${lista.length ? `
      <div class="zona-panel__label"><b>Proyectos en la zona</b><i>${lista.length}</i></div>
      <div class="zona-proyectos">
        ${lista.map(p => `
          <button class="zona-proy" type="button" data-proy="${p.id}">
            <span>
              <b>${p.nombre}</b>
              <span>${p.ciudad}${p.sector ? ' · ' + p.sector : ''}</span>
            </span>
            ${ICON_ARROW}
          </button>`).join('')}
      </div>` : `
      <div class="zona-panel__label"><b>Desde aquí operamos</b></div>
      <p class="zona-panel__resumen">
        Coordinamos desde Guadalajara los proyectos de Puerto Vallarta, Morelia y Querétaro.
        Selecciona cualquiera de esas ciudades para ver la obra ejecutada.
      </p>`}
    <div class="zona-panel__cta">
      ${lista.length ? `
        <button class="btn btn--ghost btn--sm" type="button" data-filtrar="${zona.id}">
          Ver estos proyectos en el portafolio ${ICON_ARROW}
        </button>` : `
        <a class="btn btn--ghost btn--sm" href="#contacto">Contáctanos ${ICON_ARROW}</a>`}
    </div>`;
}

/* -----------------------------------------------------------------------------
   Selección
   -------------------------------------------------------------------------- */
function seleccionar(zonaId) {
  const zona = ZONAS.find(z => z.id === zonaId) || null;
  zonaActiva = zona;

  $$('.ciudad-btn').forEach(b => {
    const on = b.dataset.zona === (zona ? zona.id : '');
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });

  $$('.st', gEstados).forEach(p => p.classList.remove('st--on'));
  mapaBox.classList.toggle('is-focus', !!zona);

  if (zona) {
    zona.estados.forEach(id => {
      $$(`.st[data-estado="${id}"]`, gEstados).forEach(p => p.classList.add('st--on'));
    });
    $('#mapaEstado').textContent = `${zona.ciudad}, ${zona.estado}`;
    irA(encuadre(zona));
    panelZona(zona);
  } else {
    $('#mapaEstado').textContent = 'Vista nacional';
    irA(vistaNacional());
    panelNacional();
  }

  pintarPines(zona);
  document.dispatchEvent(new CustomEvent('asap:rendered'));
}

/* -----------------------------------------------------------------------------
   Botonera de ciudades
   -------------------------------------------------------------------------- */
function renderBotones() {
  const box = $('#ciudadesBtns');
  if (!box) return;
  box.innerHTML = [
    ...ZONAS.map(z => `
      <button class="ciudad-btn" type="button" role="tab" aria-selected="false" data-zona="${z.id}">
        <i></i>${z.ciudad}
      </button>`),
    `<button class="ciudad-btn ciudad-btn--reset" type="button" role="tab" aria-selected="true" data-zona="">
       Todo México
     </button>`
  ].join('');

  box.addEventListener('click', e => {
    const btn = e.target.closest('.ciudad-btn');
    if (btn) seleccionar(btn.dataset.zona || null);
  });
}

/* -----------------------------------------------------------------------------
   Eventos del mapa
   -------------------------------------------------------------------------- */
function zonaMasCercana(estadoId, punto) {
  const cands = ZONAS.filter(z => z.estados.includes(estadoId));
  if (cands.length < 2 || !punto) return cands[0];
  let mejor = cands[0], dist = Infinity;
  cands.forEach(z => {
    puntosDe(z).forEach(c => {
      const d = (c[0] - punto.x) ** 2 + (c[1] - punto.y) ** 2;
      if (d < dist) { dist = d; mejor = z; }
    });
  });
  return mejor;
}

function puntoSVG(evt) {
  const r = svg.getBoundingClientRect();
  if (!r.width) return null;
  // el SVG se ajusta con preserveAspectRatio="meet": hay que descontar el letterbox
  const escala = Math.min(r.width / vista[2], r.height / vista[3]);
  const offX = (r.width - vista[2] * escala) / 2;
  const offY = (r.height - vista[3] * escala) / 2;
  return {
    x: (evt.clientX - r.left - offX) / escala + vista[0],
    y: (evt.clientY - r.top - offY) / escala + vista[1]
  };
}

function bindMapa() {
  gEstados.addEventListener('click', e => {
    const path = e.target.closest('.st--zona');
    if (!path) return;
    const zona = zonaMasCercana(path.dataset.estado, puntoSVG(e));
    seleccionar(zona ? zona.id : null);
  });

  gEstados.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const path = e.target.closest('.st--zona');
    if (!path) return;
    e.preventDefault();
    const zona = ZONAS.find(z => z.estados.includes(path.dataset.estado));
    if (zona) seleccionar(zona.id);
  });

  gEstados.addEventListener('mousemove', e => {
    const path = e.target.closest('.st');
    if (!path) { tip.classList.remove('is-on'); return; }
    const r = mapaBox.getBoundingClientRect();
    tip.textContent = path.dataset.nombre;
    tip.style.left = `${e.clientX - r.left}px`;
    tip.style.top = `${e.clientY - r.top}px`;
    tip.classList.add('is-on');
  });
  gEstados.addEventListener('mouseleave', () => tip.classList.remove('is-on'));

  // los marcadores abren la ficha del proyecto o entran a la zona
  const activarPin = el => {
    const obra = el.closest('.mapa__obra');
    if (obra) { abrirProyecto(obra.dataset.proy); return true; }
    const pin = el.closest('[data-ir]');
    if (pin) { seleccionar(pin.dataset.ir); return true; }
    return false;
  };
  gPines.addEventListener('click', e => activarPin(e.target));
  gPines.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (activarPin(e.target)) e.preventDefault();
  });

  $('#zonaPanel').addEventListener('click', e => {
    const ir = e.target.closest('[data-ir]');
    if (ir) { seleccionar(ir.dataset.ir); return; }

    const proy = e.target.closest('[data-proy]');
    if (proy) { abrirProyecto(proy.dataset.proy); return; }

    const filtrar = e.target.closest('[data-filtrar]');
    if (filtrar) {
      filtrarPorZona(filtrar.dataset.filtrar);
      document.getElementById('proyectos')?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    }
  });

  let reajuste;
  addEventListener('resize', () => {
    clearTimeout(reajuste);
    reajuste = setTimeout(() => {
      irA(zonaActiva ? encuadre(zonaActiva) : vistaNacional());
      pintarPines(zonaActiva);
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
  seleccionar(null);

  // Al entrar en pantalla por primera vez, el mapa se acerca a Querétaro
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      setTimeout(() => { if (!zonaActiva) seleccionar('vallarta'); }, 900);
    });
  }, { threshold: 0.4 });
  io.observe($('#cobertura'));
}
