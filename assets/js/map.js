/* =============================================================================
   ASAP 369 — Mapa interactivo de cobertura
   Render 2D de la República Mexicana con acercamiento animado por ciudad
   y marcadores geolocalizados de los proyectos ejecutados.
   ========================================================================== */
import { ESTADOS, MAP_VIEWBOX } from './map-paths.js';
import { ZONAS, PROYECTOS } from './data.js';
import { abrirProyecto, filtrarPorZona } from './projects.js';

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

  const conZona = new Set(ZONAS.map(z => z.estadoId));

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
   -------------------------------------------------------------------------- */
function crearPin(pin, zona, conEtiqueta) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', `mapa__pin mapa__pin--${pin.tipo}`);
  g.dataset.zona = zona.id;
  g.innerHTML = `
    <path class="mapa__pin-leader" d="M0 0"/>
    <circle class="mapa__pin-ring" cx="0" cy="0" r="4"/>
    <circle class="mapa__pin-dot" cx="0" cy="0" r="${pin.tipo === 'sede' ? 3.4 : 2.6}"/>
    ${conEtiqueta ? `<text class="mapa__pin-label" x="9" y="3.6">${pin.n}</text>` : ''}`;
  g.dataset.x = pin.p[0];
  g.dataset.y = pin.p[1];
  return g;
}

/* -----------------------------------------------------------------------------
   Colocación de etiquetas sin traslapes
   Las etiquetas parten de su posición natural (a la derecha del marcador) y se
   separan verticalmente hasta que ninguna se encima con otra; si una se sale
   por el costado derecho del lienzo, salta al lado izquierdo del marcador.
   -------------------------------------------------------------------------- */
function acomodarEtiquetas() {
  const textos = $$('.mapa__pin-label', gPines);
  if (!textos.length) return;
  const limite = mapaBox.getBoundingClientRect();

  // 1. reinicio y volteo lateral cuando la etiqueta se sale del lienzo
  textos.forEach(t => {
    t.setAttribute('x', '9');
    t.setAttribute('y', '3.6');
    t.setAttribute('text-anchor', 'start');
    const r = t.getBoundingClientRect();
    if (r.right > limite.right - 10) {
      t.setAttribute('x', '-9');
      t.setAttribute('text-anchor', 'end');
    }
  });

  // 2. separación vertical
  const escala = textos[0].getScreenCTM()?.d || 1;   // unidades locales → píxeles
  const cajas = textos
    .map(t => ({ t, r: t.getBoundingClientRect() }))
    .sort((a, b) => a.r.top - b.r.top);

  const puestas = [];
  cajas.forEach(item => {
    let top = item.r.top, bottom = item.r.bottom;
    let desplazado = 0;
    let choque = true;
    let vueltas = 0;

    while (choque && vueltas < 24) {
      choque = false;
      for (const p of puestas) {
        const cruzaX = item.r.left < p.right + 6 && item.r.right > p.left - 6;
        const cruzaY = top < p.bottom + 3 && bottom > p.top - 3;
        if (cruzaX && cruzaY) {
          const salto = p.bottom + 4 - top;
          top += salto; bottom += salto; desplazado += salto;
          choque = true;
        }
      }
      vueltas++;
    }

    if (desplazado) {
      item.t.setAttribute('y', (3.6 + desplazado / escala).toFixed(2));
      const g = item.t.closest('.mapa__pin');
      const leader = $('.mapa__pin-leader', g);
      const dx = item.t.getAttribute('text-anchor') === 'end' ? -7 : 7;
      const dy = (desplazado / escala).toFixed(2);
      leader?.setAttribute('d', `M0 0 L${dx * 0.5} ${dy * 0.7} L${dx} ${dy}`);
    }
    puestas.push({ left: item.r.left, right: item.r.right, top, bottom });
  });
}

function pintarPines(zona) {
  gPines.innerHTML = '';
  if (zona) {
    zona.pines.forEach(p => gPines.appendChild(crearPin(p, zona, true)));
  } else {
    ZONAS.forEach(z => {
      const sede = z.pines.find(p => p.tipo === 'sede') || z.pines[0];
      gPines.appendChild(crearPin({ ...sede, n: z.ciudad }, z, true));
    });
  }
  escalarPines();
  requestAnimationFrame(() => {
    acomodarEtiquetas();
    $$('.mapa__pin', gPines).forEach((g, i) => {
      setTimeout(() => g.classList.add('is-live'), REDUCED ? 0 : i * 90);
    });
  });
}

/* Los marcadores mantienen su tamaño en pantalla aunque cambie el zoom */
function escalarPines() {
  const k = vista[2] / BASE[2];
  $$('.mapa__pin', gPines).forEach(g => {
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
    requestAnimationFrame(acomodarEtiquetas);
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

/* Encuadre calculado a partir de los marcadores de la zona */
function encuadre(zona) {
  const xs = zona.pines.map(p => p.p[0]);
  const ys = zona.pines.map(p => p.p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

  const a = aspectoLienzo();
  let w = Math.max(Math.max(...xs) - Math.min(...xs) + 96, 186);
  let h = w / a;
  const alto = Math.max(...ys) - Math.min(...ys) + 66;
  if (alto > h) { h = alto; w = h * a; }

  // el encuadre se desplaza a la izquierda para dejar aire a las etiquetas
  return [cx - w * 0.42, cy - h / 2, w, h];
}

/* -----------------------------------------------------------------------------
   Panel lateral
   -------------------------------------------------------------------------- */
function panelNacional() {
  const total = PROYECTOS.length;
  $('#zonaPanel').innerHTML = `
    <div class="zona-panel__head">
      <div>
        <div class="zona-panel__ciudad">Cobertura nacional</div>
        <div class="zona-panel__estado">4 ciudades · 3 estados</div>
      </div>
      <div class="zona-panel__desde">
        <b>${total}</b>
        <span>Proyectos</span>
      </div>
    </div>
    <p class="zona-panel__resumen">
      Operamos desde Querétaro hacia el occidente del país. Elige una ciudad en el mapa
      o en los botones superiores para ver la obra ejecutada en ese estado.
    </p>
    <div class="zona-panel__sep"></div>
    <div class="zona-panel__label"><b>Ciudades</b><i>Selecciona una</i></div>
    <div class="zona-proyectos">
      ${ZONAS.map(z => `
        <button class="zona-proy" type="button" data-ir="${z.id}">
          <span>
            <b>${z.ciudad}</b>
            <span>${z.estado} · desde ${z.desde} · ${proyectosDe(z.id).length} proyectos</span>
          </span>
          ${ICON_ARROW}
        </button>`).join('')}
    </div>
    <div class="zona-panel__cta">
      <a class="btn btn--ghost btn--sm" href="#proyectos">Ver catálogo completo ${ICON_ARROW}</a>
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
        <b>${zona.desde}</b>
        <span>Desde</span>
      </div>
    </div>
    <p class="zona-panel__resumen">${zona.resumen}</p>
    <div class="zona-panel__tags">${zona.destacados.map(d => `<span>${d}</span>`).join('')}</div>
    <div class="zona-panel__sep"></div>
    <div class="zona-panel__label"><b>Proyectos en la zona</b><i>${lista.length}</i></div>
    <div class="zona-proyectos">
      ${lista.map(p => `
        <button class="zona-proy" type="button" data-proy="${p.id}">
          <span>
            <b>${p.nombre}</b>
            <span>${p.ciudad} · ${p.anio} · ${p.superficie}</span>
          </span>
          ${ICON_ARROW}
        </button>`).join('')}
    </div>
    <div class="zona-panel__cta">
      <button class="btn btn--ghost btn--sm" type="button" data-filtrar="${zona.id}">
        Ver estos proyectos en el catálogo ${ICON_ARROW}
      </button>
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
    $$(`.st[data-estado="${zona.estadoId}"]`, gEstados).forEach(p => p.classList.add('st--on'));
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
  const cands = ZONAS.filter(z => z.estadoId === estadoId);
  if (cands.length < 2 || !punto) return cands[0];
  let mejor = cands[0], dist = Infinity;
  cands.forEach(z => {
    z.pines.forEach(p => {
      const d = (p.p[0] - punto.x) ** 2 + (p.p[1] - punto.y) ** 2;
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
    const zona = ZONAS.find(z => z.estadoId === path.dataset.estado);
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
      escalarPines();
      acomodarEtiquetas();
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
      setTimeout(() => { if (!zonaActiva) seleccionar('queretaro'); }, 900);
    });
  }, { threshold: 0.4 });
  io.observe($('#cobertura'));
}
