/* =============================================================================
   ASAP 369 — Sección de proyectos: dónde hemos trabajado
   Una tarjeta por ubicación de UBICACIONES con la silueta de su estado y el
   punto donde está. El filtro por estado y el mapa de cobertura van
   sincronizados: lo que se elige en uno se refleja en el otro, y tocar una
   tarjeta lleva al mapa con esa ubicación señalada.
   ========================================================================== */
import { ESTADOS } from './map-paths.js?v=27';
import { ENTIDADES, UBICACIONES, entidad, ubicacionesDe } from './data.js?v=27';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';

const ICON_ARROW = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';

const GEO = Object.fromEntries(ESTADOS.map(e => [e.id, e]));
let filtro = 'todos';
let elegido = null;

/* -----------------------------------------------------------------------------
   Siluetas: cada estado se define una sola vez y las tarjetas lo reutilizan
   -------------------------------------------------------------------------- */
function definirSiluetas() {
  if ($('#siluetas')) return;
  const sprite = document.createElementNS(NS, 'svg');
  sprite.id = 'siluetas';
  sprite.setAttribute('aria-hidden', 'true');
  sprite.setAttribute('width', '0');
  sprite.setAttribute('height', '0');
  sprite.style.position = 'absolute';
  sprite.innerHTML = `<defs>${ENTIDADES.map(e =>
    `<path id="silueta-${e.id}" d="${GEO[e.id].d}" vector-effect="non-scaling-stroke"/>`).join('')}</defs>`;
  document.body.appendChild(sprite);
}

/* Encuadre cuadrado alrededor del cuerpo principal del estado */
function cajaSilueta(estadoId) {
  const [x, y, w, h] = GEO[estadoId].b;
  const lado = Math.max(w, h) * 1.18;
  return [x + w / 2 - lado / 2, y + h / 2 - lado / 2, lado, lado];
}

function siluetaHTML(u) {
  const caja = cajaSilueta(u.estado);
  const r = caja[2] / 46;                       // el punto mide lo mismo en todas las tarjetas
  const vecinos = ubicacionesDe(u.estado).filter(v => v.id !== u.id);
  return `
    <svg class="lugar-card__silueta" viewBox="${caja.map(n => n.toFixed(2)).join(' ')}" aria-hidden="true">
      <use href="#silueta-${u.estado}" class="lugar-card__estado-forma"/>
      ${vecinos.map(v => `<circle class="lugar-card__vecino" cx="${v.xy[0]}" cy="${v.xy[1]}" r="${(r * .62).toFixed(2)}"/>`).join('')}
      <circle class="lugar-card__onda" cx="${u.xy[0]}" cy="${u.xy[1]}" r="${(r * 1.1).toFixed(2)}"/>
      <circle class="lugar-card__punto" cx="${u.xy[0]}" cy="${u.xy[1]}" r="${r.toFixed(2)}" style="stroke-width:${(r * .45).toFixed(2)}"/>
    </svg>`;
}

/* -----------------------------------------------------------------------------
   Tarjetas
   -------------------------------------------------------------------------- */
function cardHTML(u, i) {
  const e = entidad(u.estado);
  return `
  <button class="lugar-card${u.base ? ' lugar-card--base' : ''}" type="button" data-ver-lugar="${u.id}"
          data-reveal style="--d:${(i % 6) * 60}ms" aria-label="Ver ${u.nombre}, ${e.nombre}, en el mapa">
    <span class="lugar-card__mapa">${siluetaHTML(u)}</span>
    <span class="lugar-card__body">
      <span class="lugar-card__estado">${ICON_PIN}${e.nombre}</span>
      <span class="lugar-card__nombre">${u.nombre}</span>
      <span class="lugar-card__foot">
        <span>${u.base ? 'Base operativa' : u.tipo || 'Ciudad'}</span>
        <span class="lugar-card__ver">Mapa ${ICON_ARROW}</span>
      </span>
    </span>
  </button>`;
}

function renderGrid() {
  const grid = $('#proyGrid');
  if (!grid) return;
  definirSiluetas();
  grid.innerHTML = UBICACIONES.map(cardHTML).join('');
  aplicarFiltro(true);
}

function aplicarFiltro(inicial = false) {
  const grid = $('#proyGrid');
  let visibles = 0;
  UBICACIONES.forEach(u => {
    const card = grid.querySelector(`[data-ver-lugar="${u.id}"]`);
    if (!card) return;
    const ok = filtro === 'todos' || u.estado === filtro;
    card.classList.toggle('is-out', !ok);
    card.classList.toggle('is-sel', u.id === elegido);
    card.tabIndex = ok ? 0 : -1;
    if (ok) {
      if (!inicial) {
        card.classList.remove('is-fresh');
        void card.offsetWidth;                       // reinicia la animación
        card.style.animationDelay = `${visibles * 40}ms`;
        card.classList.add('is-fresh');
      }
      visibles++;
    }
  });

  $('#proyCount').textContent = visibles;
  $('#proyCountTxt').textContent = visibles === 1 ? 'ubicación' : 'ubicaciones';
  $('#proyEmpty').classList.toggle('u-hide', visibles > 0);
  if (!inicial) document.dispatchEvent(new CustomEvent('asap:rendered'));
}

/* -----------------------------------------------------------------------------
   Filtro por estado
   -------------------------------------------------------------------------- */
function marcarChips() {
  $$('#filtroCiudades .chip').forEach(c => {
    const on = c.dataset.v === filtro;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', String(on));
  });
}

function renderFiltros() {
  const fc = $('#filtroCiudades');
  if (!fc) return;
  fc.innerHTML = [
    `<button class="chip" type="button" data-v="todos">Todos</button>`,
    ...ENTIDADES.map(e => `<button class="chip" type="button" data-v="${e.id}">${e.nombre}</button>`)
  ].join('');
  marcarChips();

  fc.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip || chip.dataset.v === filtro) return;
    filtro = chip.dataset.v;
    if (elegido && filtro !== 'todos' && UBICACIONES.find(u => u.id === elegido)?.estado !== filtro) elegido = null;
    marcarChips();
    aplicarFiltro();
    // el mapa sigue al filtro (sin mover la página)
    document.dispatchEvent(new CustomEvent('asap:ver-estado', {
      detail: { estado: filtro === 'todos' ? null : filtro, avisar: false }
    }));
  });
}

/* -----------------------------------------------------------------------------
   Sincronía con el mapa
   -------------------------------------------------------------------------- */
function bindSincronia() {
  // lo que se elige en el mapa se refleja en el filtro y en la tarjeta
  document.addEventListener('asap:mapa', e => {
    const nuevo = e.detail.estado || 'todos';
    const cambia = nuevo !== filtro || e.detail.lugar !== elegido;
    filtro = nuevo;
    elegido = e.detail.lugar;
    if (!cambia) return;
    marcarChips();
    aplicarFiltro(true);
  });

  // una tarjeta lleva al mapa con su ubicación señalada
  $('#proyGrid')?.addEventListener('click', e => {
    const card = e.target.closest('[data-ver-lugar]');
    if (!card) return;
    document.dispatchEvent(new CustomEvent('asap:ver-lugar', {
      detail: { lugar: card.dataset.verLugar, desplazar: true }
    }));
  });
}

/* -----------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
export function initProyectos() {
  renderFiltros();
  renderGrid();
  bindSincronia();
}
