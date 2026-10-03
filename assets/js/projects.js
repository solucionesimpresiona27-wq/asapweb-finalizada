/* =============================================================================
   ASAP 369 — Portafolio de proyectos
   Filtrado por ciudad (y por servicio cuando el contenido lo declara) más
   ficha ampliada. Los campos técnicos son opcionales: la tarjeta y la ficha
   muestran solo los que tienen contenido.
   ========================================================================== */
import { PROYECTOS, SERVICIOS, ZONAS } from './data.js?v=25';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const ICON_ARROW = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';

const nombreServicio = id => SERVICIOS.find(s => s.id === id)?.nombre ?? id;
const estadoZona = id => ZONAS.find(z => z.id === id)?.estado ?? '';
const serviciosDe = p => p.servicios ?? [];

/* ¿Algún proyecto declara servicios? De eso depende que exista ese filtro. */
const HAY_SERVICIOS = PROYECTOS.some(p => serviciosDe(p).length);

/* Imagen de referencia asignada por posición en el portafolio */
PROYECTOS.forEach((p, i) => {
  if (!p.img) p.img = `assets/img/proyecto-${String((i % 16) + 1).padStart(2, '0')}.svg`;
});

const estado = { servicio: 'todos', zona: 'todas' };
let ultimoFoco = null;

/* Ubicación legible: "Juriquilla, Querétaro" o solo "Morelia" si se repite.
   Se prefiere el estado propio del proyecto, porque una zona puede abarcar
   más de una entidad (Puerto Vallarta en Jalisco y Nuevo Vallarta en Nayarit). */
function ubicacion(p) {
  const e = p.estado ?? estadoZona(p.zona);
  return e && e !== p.ciudad ? `${p.ciudad}, ${e}` : p.ciudad;
}

/* -----------------------------------------------------------------------------
   Tarjetas
   -------------------------------------------------------------------------- */
function cardHTML(p, i) {
  const servicios = serviciosDe(p);
  return `
  <button class="proy-card" type="button" data-proy="${p.id}" data-reveal style="--d:${(i % 3) * 90}ms" data-cur-view
          aria-label="Ver ${p.nombre}">
    <span class="proy-card__media">
      <img src="${p.img}" alt="Imagen de referencia del proyecto ${p.nombre}" loading="lazy" width="1200" height="900">
      ${p.anio ? `<span class="proy-card__year">${p.anio}</span>` : ''}
      <span class="proy-card__place">${ICON_PIN}${ubicacion(p)}</span>
    </span>
    <span class="proy-card__body">
      <span class="proy-card__title">${p.nombre}</span>
      ${servicios.length
        ? `<span class="proy-card__tags">${servicios.map(s => `<span>${nombreServicio(s)}</span>`).join('')}</span>`
        : ''}
      <span class="proy-card__foot">
        <span>${p.sector ?? ''}</span>
        <span class="proy-card__ver">Ver ${ICON_ARROW}</span>
      </span>
    </span>
  </button>`;
}

function renderGrid() {
  const grid = $('#proyGrid');
  if (!grid) return;
  grid.innerHTML = PROYECTOS.map((p, i) => cardHTML(p, i)).join('');
  aplicarFiltros(true);
}

function aplicarFiltros(inicial = false) {
  const grid = $('#proyGrid');
  let visibles = 0;

  PROYECTOS.forEach(p => {
    const card = grid.querySelector(`[data-proy="${p.id}"]`);
    if (!card) return;
    const okS = estado.servicio === 'todos' || serviciosDe(p).includes(estado.servicio);
    const okZ = estado.zona === 'todas' || p.zona === estado.zona;
    const ok = okS && okZ;
    card.classList.toggle('is-out', !ok);
    card.tabIndex = ok ? 0 : -1;
    if (ok) {
      if (!inicial) {
        card.classList.remove('is-fresh');
        void card.offsetWidth;                       // reinicia la animación
        card.style.animationDelay = `${visibles * 45}ms`;
        card.classList.add('is-fresh');
      }
      visibles++;
    }
  });

  $('#proyCount').textContent = visibles;
  $('#proyEmpty').classList.toggle('u-hide', visibles > 0);
  if (!inicial) document.dispatchEvent(new CustomEvent('asap:rendered'));
}

/* -----------------------------------------------------------------------------
   Filtros
   -------------------------------------------------------------------------- */
function renderFiltros() {
  const fs = $('#filtroServicios');
  const fc = $('#filtroCiudades');
  if (!fc) return;

  if (HAY_SERVICIOS && fs) {
    fs.innerHTML = [
      `<button class="chip is-on" type="button" data-f="servicio" data-v="todos">Todos</button>`,
      ...SERVICIOS.map(s => `<button class="chip" type="button" data-f="servicio" data-v="${s.id}">${s.nombre}</button>`)
    ].join('');
  } else {
    // sin servicios declarados por proyecto, el filtro no aportaría nada
    fs?.closest('.filtro-grupo')?.remove();
  }

  fc.innerHTML = [
    `<button class="chip is-on" type="button" data-f="zona" data-v="todas">Todas</button>`,
    ...ZONAS.map(z => `<button class="chip" type="button" data-f="zona" data-v="${z.id}">${z.ciudad}</button>`)
  ].join('');

  [fs, fc].forEach(box => box?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip', box).forEach(c => c.classList.remove('is-on'));
    chip.classList.add('is-on');
    estado[chip.dataset.f] = chip.dataset.v;
    aplicarFiltros();
  }));
}

/* Permite que el mapa sincronice el filtro de ciudad */
export function filtrarPorZona(zonaId) {
  estado.zona = zonaId || 'todas';
  const fc = $('#filtroCiudades');
  if (fc) $$('.chip', fc).forEach(c => c.classList.toggle('is-on', c.dataset.v === estado.zona));
  aplicarFiltros();
}

/* -----------------------------------------------------------------------------
   Ficha del proyecto
   -------------------------------------------------------------------------- */
function fichaHTML(p) {
  const servicios = serviciosDe(p);
  const datos = [
    ['Ciudad', ubicacion(p)],
    ['Sector', p.sector],
    ['Año', p.anio],
    ['Altura', p.altura],
    ['Niveles', p.niveles],
    ['Superficie', p.superficie],
    ['Duración', p.duracion],
    ['Método', 'Acceso por cuerdas']
  ].filter(([, v]) => v);

  const bloques = [
    ['El reto', p.reto],
    ['Nuestra solución', p.solucion],
    ['Resultado', p.resultado]
  ].filter(([, v]) => v);

  return `
  <article class="ficha">
    <figure class="ficha__hero">
      <img src="${p.img}" alt="Imagen de referencia del proyecto ${p.nombre}" width="1200" height="900">
      <figcaption class="ficha__head">
        ${p.sector ? `<span class="pill">${p.sector}</span>` : ''}
        <h3 class="ficha__title font-display u-mt-2" id="fichaTitle">${p.nombre}</h3>
        <div class="ficha__sub">
          <span>${ICON_PIN} ${ubicacion(p)}</span>
          ${p.anio ? `<span>${p.anio}</span>` : ''}
          ${p.altura ? `<span>${p.altura} de altura</span>` : ''}
        </div>
      </figcaption>
    </figure>

    <div class="ficha__body">
      <div>
        ${bloques.length
          ? bloques.map(([t, v]) => `
            <div class="ficha__block">
              <h4>${t}</h4>
              <p>${v}</p>
            </div>`).join('')
          : `<div class="ficha__block">
               <h4>Trabajos verticales</h4>
               <p>Proyecto atendido con acceso por cuerdas, sin andamios y sin detener la
                  operación del inmueble. Escríbenos si quieres conocer el detalle de
                  esta intervención o cotizar algo similar.</p>
             </div>`}
        ${servicios.length
          ? `<div class="ficha__servicios">${servicios.map(s => `<span class="pill">${nombreServicio(s)}</span>`).join('')}</div>`
          : ''}
      </div>

      <aside>
        <h4 class="t-mono" style="color:var(--tx-low);margin-bottom:.9rem">Ficha técnica</h4>
        <div class="ficha__datos">
          ${datos.map(([t, v]) => `<div class="ficha__dato"><span>${t}</span><b>${v}</b></div>`).join('')}
        </div>
        <a class="btn btn--ghost u-mt-3" href="#contacto" data-close style="width:100%">
          Quiero algo así
          ${ICON_ARROW}
        </a>
      </aside>
    </div>
  </article>`;
}

export function abrirProyecto(id) {
  const p = PROYECTOS.find(x => x.id === id);
  const modal = $('#modal');
  if (!p || !modal) return;

  ultimoFoco = document.activeElement;
  $('#modalContent').innerHTML = fichaHTML(p);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  $('#modalBox').scrollTop = 0;
  // se fuerza el recálculo de estilos: un elemento aún oculto no acepta el foco
  void modal.offsetHeight;
  modal.querySelector('.modal__close')?.focus();
}

function cerrarModal() {
  const modal = $('#modal');
  if (!modal?.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  ultimoFoco?.focus?.();
}

function initModal() {
  const modal = $('#modal');
  if (!modal) return;

  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) cerrarModal(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
    if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
    const foco = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
      .filter(el => el.offsetParent !== null);
    if (!foco.length) return;
    const first = foco[0], last = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('click', e => {
    const card = e.target.closest('[data-proy]');
    if (card) abrirProyecto(card.dataset.proy);
  });
}

/* -----------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
export function initProyectos() {
  renderFiltros();
  renderGrid();
  initModal();
}
