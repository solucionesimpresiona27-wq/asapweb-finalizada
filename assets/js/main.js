/* =============================================================================
   ASAP 369 — Orquestador de interfaz
   Precarga · cursor · navegación · revelados · parallax · secciones dinámicas
   ========================================================================== */
import { SERVICIOS, VERTICALES, PROCESO, METRICAS, EMPRESA, OBRA_ACTIVA, PROYECTOS } from './data.js';
import { initMapa } from './map.js';
import { initProyectos } from './projects.js';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';

/* -----------------------------------------------------------------------------
   Precarga
   -------------------------------------------------------------------------- */
function initPreload() {
  const box = $('#preload');
  const bar = $('#preloadBar');
  const pct = $('#preloadPct');
  if (!box) return Promise.resolve();

  return new Promise(resolve => {
    let p = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      p = 1;
      bar.style.setProperty('--p', 1);
      pct.textContent = '100%';
      setTimeout(() => {
        box.classList.add('is-done');
        document.body.classList.remove('is-locked');
        // se retira del DOM para no dejar una capa de composición viva
        setTimeout(() => box.remove(), 900);
        resolve();
      }, 380);
    };

    const tick = () => {
      if (done) return;
      p = Math.min(p + (0.9 - p) * 0.045 + 0.004, 0.92);
      bar.style.setProperty('--p', p);
      pct.textContent = Math.round(p * 100) + '%';
      requestAnimationFrame(tick);
    };

    document.body.classList.add('is-locked');
    if (REDUCED) return finish();
    requestAnimationFrame(tick);

    if (document.readyState === 'complete') setTimeout(finish, 520);
    else window.addEventListener('load', () => setTimeout(finish, 420), { once: true });
    setTimeout(finish, 4200); // salvaguarda
  });
}

/* -----------------------------------------------------------------------------
   Cursor personalizado
   -------------------------------------------------------------------------- */
function initCursor() {
  if (!FINE || REDUCED) return;
  const dot = $('.cursor');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  document.body.classList.add('cur-hidden');
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.remove('cur-hidden');
  }, { passive: true });
  addEventListener('mouseleave', () => document.body.classList.add('cur-hidden'));
  addEventListener('mouseenter', () => document.body.classList.remove('cur-hidden'));

  const loop = () => {
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const bind = () => {
    $$('a, button, [role="tab"], input, select, textarea, .srv').forEach(el => {
      if (el.dataset.curBound) return;
      el.dataset.curBound = '1';
      const view = el.hasAttribute('data-cur-view');
      el.addEventListener('mouseenter', () => document.body.classList.add(view ? 'cur-view' : 'cur-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-view', 'cur-link'));
    });
  };
  bind();
  document.addEventListener('asap:rendered', bind);
}

/* -----------------------------------------------------------------------------
   Botones magnéticos
   -------------------------------------------------------------------------- */
function initMagnetic() {
  if (!FINE || REDUCED) return;
  $$('[data-magnetic]').forEach(el => {
    const strength = parseFloat(el.dataset.magnetic) || 0.32;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* -----------------------------------------------------------------------------
   Revelados por scroll y títulos por palabra
   -------------------------------------------------------------------------- */
function splitWords(root) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const txt = n.textContent;
        if (!txt.trim()) return;
        const frag = document.createDocumentFragment();
        txt.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const mask = document.createElement('span');
          mask.className = 'split-mask';
          const word = document.createElement('span');
          word.className = 'split-word';
          word.textContent = part;
          mask.appendChild(word);
          frag.appendChild(mask);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('split-mask')) {
        walk(n);
      }
    });
  };
  walk(root);
  $$('.split-word', root).forEach((w, i) => w.style.setProperty('--wd', `${i * 52}ms`));
}

function initReveals() {
  $$('[data-split]').forEach(el => { if (!REDUCED) splitWords(el); });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  const watch = () => $$('[data-reveal], [data-curtain], [data-split], [data-line]')
    .forEach(el => { if (!el.dataset.ioBound) { el.dataset.ioBound = '1'; io.observe(el); } });

  watch();
  document.addEventListener('asap:rendered', watch);
}

/* -----------------------------------------------------------------------------
   Navegación
   -------------------------------------------------------------------------- */
function initNav() {
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  const bar = $('#progressBar');

  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? clamp(y / h) : 0);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  burger?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  menu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Enlace activo
  const links = $$('.nav__link');
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const secs = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('is-active'));
      map.get(e.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));
}

/* -----------------------------------------------------------------------------
   Parallax y animaciones ligadas al scroll
   -------------------------------------------------------------------------- */
function initScrollFX() {
  const px = $$('[data-parallax]');
  const gaugeBar = $('#gaugeBar');
  const gaugePct = $('#gaugePct');
  const verticales = $('#verticales');
  const pin = $('#procesoPin');
  const track = $('#procesoTrack');
  const procBar = $('#procesoBar');
  const procNum = $('#procesoNum');
  let ticking = false;

  const frame = () => {
    ticking = false;
    const vh = innerHeight;

    if (!REDUCED) {
      px.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const prog = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(prog * parseFloat(el.dataset.parallax) * vh).toFixed(2)}px, 0)`;
      });
    }

    if (verticales && gaugeBar) {
      const r = verticales.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height * 0.75));
      gaugeBar.style.setProperty('--p', p);
      if (gaugePct) gaugePct.textContent = Math.round(p * 78) + ' m';
    }

    if (pin && track && innerWidth > 820) {
      const r = pin.getBoundingClientRect();
      const total = pin.offsetHeight - vh;
      const p = clamp(-r.top / total);
      const shift = Math.max(0, track.scrollWidth - innerWidth + 24);
      track.style.transform = `translate3d(${(-p * shift).toFixed(2)}px, 0, 0)`;
      if (procBar) procBar.style.setProperty('--p', p);
      const cards = $$('.paso', track);
      const idx = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
      if (procNum) procNum.textContent = String(idx + 1).padStart(2, '0');
      cards.forEach((c, i) => c.classList.toggle('is-on', i <= idx));
    } else if (track) {
      track.style.transform = '';
    }
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  document.addEventListener('asap:rendered', onScroll);
  frame();
}

/* -----------------------------------------------------------------------------
   Técnico en descenso
   -----------------------------------------------------------------------------
   Desciende por el margen conforme avanza la lectura: entra al terminar la
   portada y llega abajo al final de la página. El balanceo responde a la
   velocidad del scroll con un resorte amortiguado, más una oscilación suave
   cuando no hay movimiento. Solo se escribe `transform`, nunca medidas.
   -------------------------------------------------------------------------- */
function initVertical() {
  const caja = $('#vertical');
  if (!caja || REDUCED) return;

  const fig = $('.vertical__fig', caja);
  const hero = $('#inicio');
  const claros = $$('.panel-light');
  const mq = matchMedia('(min-width: 1440px)');

  let y = -innerHeight, destinoY = y;
  let giro = 0, velGiro = 0;
  let ultimoScroll = scrollY, velScroll = 0;
  let corriendo = false;

  const paso = t => {
    if (!corriendo) return;

    const arranque = (hero?.offsetHeight ?? innerHeight) * 0.88;
    const tramo = Math.max(1, document.documentElement.scrollHeight - innerHeight - arranque);
    const avance = clamp((scrollY - arranque) / tramo);
    destinoY = lerp(-0.24, 0.70, avance) * innerHeight;

    const delta = scrollY - ultimoScroll;
    ultimoScroll = scrollY;
    velScroll = lerp(velScroll, delta, 0.18);

    y = lerp(y, destinoY, 0.075);

    // resorte del balanceo: la cuerda se queda atrás del movimiento
    const objetivo = clamp(-velScroll * 0.5, -9, 9);
    velGiro += (objetivo - giro) * 0.014;
    velGiro *= 0.9;
    giro += velGiro;
    const vaiven = Math.sin(t / 1500) * 1.4;

    fig.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${(giro + vaiven).toFixed(2)}deg)`;
    caja.classList.toggle('is-on', scrollY > arranque - innerHeight * 0.55);

    // ¿está pasando por una sección de fondo claro?
    const centro = y + 60;
    caja.classList.toggle('is-claro', claros.some(sec => {
      const r = sec.getBoundingClientRect();
      return centro > r.top && centro < r.bottom;
    }));

    requestAnimationFrame(paso);
  };

  const arrancar = () => {
    if (corriendo || !mq.matches) return;
    corriendo = true;
    ultimoScroll = scrollY;
    requestAnimationFrame(paso);
  };
  const detener = () => { corriendo = false; caja.classList.remove('is-on'); };

  mq.addEventListener('change', () => (mq.matches ? arrancar() : detener()));
  arrancar();
}

/* -----------------------------------------------------------------------------
   Contadores
   -------------------------------------------------------------------------- */
function initCounters() {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const dur = 1700;
      const t0 = performance.now();
      const step = t => {
        const k = clamp((t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * eased).toLocaleString('es-MX');
        if (k < 1) requestAnimationFrame(step);
      };
      if (REDUCED) el.textContent = end.toLocaleString('es-MX');
      else requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach(el => io.observe(el));
}

/* -----------------------------------------------------------------------------
   Contenido dinámico
   -------------------------------------------------------------------------- */
function renderMarquee() {
  const track = $('#marqueeTrack');
  if (!track) return;
  const dot = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>';
  const items = [...SERVICIOS.map(s => s.nombre), 'Trabajos verticales', 'Acceso por cuerdas', 'NOM-009-STPS-2011'];
  const chunk = `<span class="marquee__item">${items.join(`${dot}`)}${dot}</span>`;
  track.innerHTML = chunk;
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.after(clone);
}

/* Tarjeta de obra en curso sobre la imagen de portada */
function renderObraActiva() {
  const caja = $('#heroObra');
  if (!caja) return;

  const o = OBRA_ACTIVA;
  const p = o.proyecto ? PROYECTOS.find(x => x.id === o.proyecto) : null;
  const titulo = o.titulo || p?.nombre;
  const ciudad = o.ciudad || p?.ciudad;
  const estado = o.estado || p?.estado;
  const barra = '<span class="hero__prog" aria-hidden="true"><i></i></span>';

  if (!o.mostrar || !titulo) {
    caja.innerHTML = `
      <span class="pill pill--live"><i class="pill__dot"></i> Trabajos verticales</span>
      <b>Alturas y difícil acceso</b>
      ${barra}
      <div class="hero__badge-row"><span>Acceso por cuerdas</span><span>Sin andamios</span></div>`;
    return;
  }

  const lugar = [ciudad, estado && estado !== ciudad ? estado : null].filter(Boolean).join(', ');
  caja.innerHTML = `
    <span class="pill pill--live"><i class="pill__dot"></i> Obra en curso</span>
    <b>${titulo}</b>
    ${lugar ? `<span class="hero__badge-lugar">${ICON_PIN}${lugar}</span>` : ''}
    ${barra}
    <div class="hero__badge-row">
      <span>${o.servicio || 'Trabajos verticales'}</span>
      <span>Acceso por cuerdas</span>
    </div>`;
}

function renderNosotros() {
  $('#txt-intro').textContent = EMPRESA.intro;
  $('#txt-mision').textContent = EMPRESA.mision;
  $('#txt-vision').textContent = EMPRESA.vision;

  $('#valores').innerHTML = EMPRESA.valores.map((v, i) => `
    <li class="valor" data-reveal style="--d:${i * 80}ms">
      <button class="valor__head" type="button" aria-expanded="false" aria-controls="valor-${i}">
        <span class="valor__n">${String(i + 1).padStart(2, '0')}</span>
        <span class="valor__t">${v.t}</span>
        <span class="valor__plus" aria-hidden="true"></span>
      </button>
      <div class="valor__panel" id="valor-${i}">
        <div class="valor__panel-in"><p class="valor__d">${v.d}</p></div>
      </div>
    </li>`).join('');

  $('#fundadorTexto').innerHTML = `<p data-reveal>${EMPRESA.fundador.mensaje}</p>`;
  $('#fundadorCargo').textContent = EMPRESA.fundador.cargo;

  // Misión, visión y valores llegan plegados: cada uno abre por separado
  activarPlegables('.vm-card', '.vm-card__head');
  activarPlegables('.valor', '.valor__head');
}

/* Abre y cierra un bloque al pulsar su encabezado, manteniendo aria-expanded */
function activarPlegables(item, encabezado) {
  $$(item).forEach(el => {
    const boton = $(encabezado, el);
    boton?.addEventListener('click', () => {
      const abierto = el.classList.toggle('is-open');
      boton.setAttribute('aria-expanded', String(abierto));
    });
  });
}

function renderServicios() {
  const list = $('#serviciosList');
  if (!list) return;
  list.innerHTML = SERVICIOS.map(s => `
    <article class="srv" id="srv-${s.id}" data-reveal style="--d:60ms">
      <span class="srv__num">${s.num}</span>
      <div class="srv__main">
        <span class="srv__icon" aria-hidden="true"><svg viewBox="0 0 24 24">${s.icono}</svg></span>
        <h3 class="srv__title">${s.nombre}</h3>
        <p class="srv__claim">${s.claim}</p>
      </div>
      <button class="srv__plus" type="button" aria-expanded="false" aria-controls="panel-${s.id}">
        <span class="u-sr">Ver alcance de ${s.nombre}</span>
      </button>
      <div class="srv__panel" id="panel-${s.id}">
        <div class="srv__panel-in">
          <div class="srv__panel-grid">
            <p class="srv__desc">${s.desc}</p>
            <ul class="srv__puntos">
              ${s.puntos.map(p => `<li>${ICON_CHECK}<span>${p}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </article>`).join('');

  list.addEventListener('click', e => {
    const srv = e.target.closest('.srv');
    if (!srv) return;
    const open = srv.classList.contains('is-open');
    $$('.srv', list).forEach(s => {
      s.classList.remove('is-open');
      s.querySelector('.srv__plus')?.setAttribute('aria-expanded', 'false');
    });
    if (!open) {
      srv.classList.add('is-open');
      srv.querySelector('.srv__plus')?.setAttribute('aria-expanded', 'true');
    }
  });

  const sel = $('#f-servicio');
  if (sel) sel.innerHTML += SERVICIOS.map(s => `<option>${s.nombre}</option>`).join('');

  const foot = $('#footServicios');
  if (foot) foot.innerHTML = SERVICIOS.map(s => `<li><a href="#srv-${s.id}">${s.nombre}</a></li>`).join('');
}

function renderVerticales() {
  $('#ventajasList').innerHTML = VERTICALES.ventajas.map((v, i) => `
    <div class="vent" data-reveal style="--d:${i * 70}ms">
      <span class="vent__k">${v.k}</span>
      <span class="vent__t">${v.t}</span>
      <span class="vent__d">${v.d}</span>
    </div>`).join('');

  $('#tecnicasList').innerHTML = VERTICALES.tecnicas.map((t, i) => `
    <div class="tec" data-reveal style="--d:${i * 70}ms">
      <b>${t.t}</b><span>${t.d}</span>
    </div>`).join('');

  $('#seguridadList').innerHTML = VERTICALES.seguridad
    .map(s => `<li>${ICON_CHECK}<span>${s}</span></li>`).join('');
}

function renderProceso() {
  const track = $('#procesoTrack');
  if (!track) return;
  track.innerHTML = PROCESO.map(p => `
    <article class="paso" data-reveal="zoom">
      <div class="paso__top">
        <span class="paso__n t-num">${p.n}</span>
        <span class="paso__dur">${p.dur}</span>
      </div>
      <h3>${p.t}</h3>
      <p>${p.d}</p>
      <div class="paso__bar"><i></i></div>
    </article>`).join('');
}

function renderMetricas() {
  const grid = $('#metricasGrid');
  if (!grid) return;
  grid.innerHTML = METRICAS.map((m, i) => `
    <article class="metrica" data-reveal style="--d:${i * 90}ms">
      <div class="metrica__v t-num"><span class="u-sr">${m.v}</span><span aria-hidden="true" data-count="${m.v}">0</span><span>${m.suf}</span></div>
      <div class="metrica__t">${m.t}</div>
      <div class="metrica__d">${m.d}</div>
    </article>`).join('');
}

/* -----------------------------------------------------------------------------
   Formulario (maqueta — sin backend)
   -------------------------------------------------------------------------- */
function renderContacto() {
  const tels = EMPRESA.telefonos
    .map(t => `<a href="tel:${t.href}">${t.display}<em>${t.ciudad}</em></a>`).join('');
  const box = $('#datoTelefonos');
  if (box) box.innerHTML = tels;

  $$('[data-email]').forEach(a => {
    a.textContent = EMPRESA.email;
    a.href = 'mailto:' + EMPRESA.email;
  });
  $$('[data-tel-principal]').forEach(a => {
    a.textContent = EMPRESA.telefonos[0].display;
    a.href = 'tel:' + EMPRESA.telefonos[0].href;
  });
  $$('[data-dir]').forEach(el => { el.textContent = EMPRESA.dir; });

  const footTel = $('#footTelefonos');
  if (footTel) {
    footTel.innerHTML = EMPRESA.telefonos
      .map(t => `<li><a href="tel:${t.href}">${t.display} <span style="color:var(--tx-low)">· ${t.ciudad}</span></a></li>`)
      .join('') + `<li><a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a></li>`
      + `<li><span>${EMPRESA.dir}</span></li>`;
  }
}

function initForm() {
  const form = $('#form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = $('#f-nombre');
    const email = $('#f-email');
    let ok = true;
    [nombre, email].forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      f.style.borderBottomColor = bad ? '#E0685F' : '';
      if (bad) ok = false;
    });
    if (!ok) { nombre.focus(); return; }
    $('#formOk').classList.add('is-on');
    form.querySelector('button[type="submit"]').disabled = true;
  });
}

/* -----------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
function boot() {
  $('#year').textContent = new Date().getFullYear();

  renderMarquee();
  renderObraActiva();
  renderNosotros();
  renderServicios();
  renderVerticales();
  renderProceso();
  renderMetricas();
  renderContacto();
  initProyectos();
  initMapa();

  initReveals();
  initNav();
  initScrollFX();
  initCounters();
  initCursor();
  initMagnetic();
  initVertical();
  initForm();

  document.dispatchEvent(new CustomEvent('asap:rendered'));
}

initPreload();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
