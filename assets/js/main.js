/* =============================================================================
   ASAP 369 — Orquestador de interfaz
   Precarga · cursor · navegación · revelados · parallax · secciones dinámicas
   ========================================================================== */
import { SERVICIOS, VERTICALES, PROCESO, METRICAS, EMPRESA, OBRA_ACTIVA, PROYECTOS, CINTAS } from './data.js?v=15';
import { initMapa } from './map.js?v=15';
import { initProyectos } from './projects.js?v=15';

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
   cuando no hay movimiento; la cubeta tiene su propio péndulo.

   Las dos cuerdas bajan de la azotea a la mano y al casco, y siguen desde la
   mano y el arnés hasta el pie de la ventana. Se tienden en cada cuadro desde
   la posición real —ya girada— de sus puntos de amarre, así que nunca se
   despegan del personaje. Al personaje solo se le escribe `transform`.
   -------------------------------------------------------------------------- */
function initVertical() {
  const caja = $('#vertical');
  if (!caja || REDUCED) return;

  const fig = $('.vertical__fig', caja);
  const lamina = $('.vertical__cuerdas', caja);
  const cubeta = $('.vertical__cubeta', caja);
  const colaRect = $('#vertColaRect', caja);
  const colaDeg = $('#vertColaDegradado', caja);
  const hero = $('#inicio');
  const mq = matchMedia('(min-width: 1440px)');

  const ENTRADA = 560;      // px de scroll que dura el descenso de entrada
  const SUAVE = t => 1 - Math.pow(1 - t, 3);

  /* Puntos del dibujo, en las unidades de su viewBox (36 18 148 272). */
  const VB = { x: 36, y: 18, w: 148, h: 272 };
  const PIVOTE = [100, 60];            // gira desde el pecho, entre las dos cuerdas
  const MANO = [73, 57];               // la cuerda A pasa por su puño
  const CASCO = [111, 40];             // la B baja por detrás de la cabeza…
  const ARNES = [106, 168];            // …y sale por el descensor del arnés
  const CUBETA = [155, 206];           // de aquí cuelga la cubeta

  /* Cada cuerda: sus dos trazos (borde y alma) */
  const cuerda = nombre => $$(`[data-cuerda="${nombre}"] line`, lamina);
  const arribaA = cuerda('arriba-a'), arribaB = cuerda('arriba-b');
  const colaA = cuerda('cola-a'), colaB = cuerda('cola-b');
  const tender = (lineas, x1, y1, x2, y2) => {
    const a = [x1.toFixed(1), y1.toFixed(1), x2.toFixed(1), y2.toFixed(1)];
    lineas.forEach(l => {
      l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]);
      l.setAttribute('x2', a[2]); l.setAttribute('y2', a[3]);
    });
  };

  let heroFin = 0, finPagina = 1, k = 0.5, alto = 140, pad = 140;
  let O = [0, 0];                      // pivote en px del personaje
  const local = ([u, v]) => [(u - VB.x) * k, (v - VB.y) * k];

  const medir = () => {
    heroFin = hero ? hero.offsetTop + hero.offsetHeight : innerHeight;
    finPagina = Math.max(heroFin + 1, document.documentElement.scrollHeight - innerHeight);
    const ancho = fig.getBoundingClientRect().width || 80;
    k = ancho / VB.w;
    alto = VB.h * k;
    pad = parseFloat(getComputedStyle(lamina).getPropertyValue('--cuerdas-pad')) || 140;
    O = local(PIVOTE);
    fig.style.transformOrigin = `${O[0].toFixed(1)}px ${O[1].toFixed(1)}px`;
    // las colas se desvanecen hacia el pie de la ventana
    colaRect.setAttribute('height', innerHeight);
    colaDeg.setAttribute('y2', innerHeight);
  };

  /* Posición en pantalla de un punto del dibujo, ya girado y desplazado */
  const punto = (p, y, rad) => {
    const [px, py] = local(p);
    const dx = px - O[0], dy = py - O[1];
    const c = Math.cos(rad), s = Math.sin(rad);
    return [O[0] + dx * c - dy * s + pad, O[1] + dx * s + dy * c + y];
  };

  let y = -400, destinoY = y, inicioY = y;
  let giro = 0, velGiro = 0;
  let pendulo = 0, velPendulo = 0;
  let arrastre = 0;
  let ultimoScroll = scrollY, velScroll = 0;
  let corriendo = false;

  const paso = t => {
    if (!corriendo) return;

    // --- posición: entra al pasar la portada y luego baja despacio ---
    const recorrido = scrollY - heroFin;
    const entrada = clamp(recorrido / ENTRADA);
    const reposo = 0.2 * innerHeight;
    const fondo = Math.min(0.7 * innerHeight, innerHeight - alto - 70);
    const resto = clamp((recorrido - ENTRADA) / Math.max(1, finPagina - heroFin - ENTRADA));

    inicioY = -alto - 24;              // completamente arriba, fuera de la vista
    destinoY = entrada < 1
      ? lerp(inicioY, reposo, SUAVE(entrada))
      : lerp(reposo, Math.max(reposo, fondo), resto);

    const delta = scrollY - ultimoScroll;
    ultimoScroll = scrollY;
    velScroll = lerp(velScroll, delta, 0.18);

    y = lerp(y, destinoY, 0.085);

    // --- balanceo del cuerpo: amortiguado, se queda atrás del movimiento ---
    const objetivo = clamp(-velScroll * 0.32, -5.5, 5.5);
    velGiro += (objetivo - giro) * 0.014;
    velGiro *= 0.9;
    giro += velGiro;
    const grados = giro + Math.sin(t / 1700) * 1.1;
    const rad = grados * Math.PI / 180;

    fig.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${grados.toFixed(2)}deg)`;

    // --- la cubeta es un péndulo propio: responde al cuerpo con retraso ---
    const empuje = -grados * 0.9 - clamp(velScroll * 0.22, -7, 7);
    velPendulo += (empuje - pendulo) * 0.02;
    velPendulo *= 0.93;
    pendulo += velPendulo;
    cubeta.setAttribute('transform', `rotate(${pendulo.toFixed(2)} ${CUBETA[0]} ${CUBETA[1]})`);

    // --- cuerdas de arriba: de la azotea a la mano y al casco ---
    const mano = punto(MANO, y, rad);
    const casco = punto(CASCO, y, rad);
    const manoReposo = local(MANO)[0] + pad;
    const cascoReposo = local(CASCO)[0] + pad;
    tender(arribaA, manoReposo, -12, mano[0], mano[1]);
    tender(arribaB, cascoReposo, -12, casco[0], casco[1]);

    // --- cuerdas de abajo: se despliegan con él al entrar y siguen hasta el
    //     pie de la ventana; al bajar rápido se quedan un poco atrás ---
    arrastre = lerp(arrastre, clamp(-velScroll * 1.4, -18, 18), 0.06);
    const despliegue = SUAVE(clamp((y - inicioY) / Math.max(1, reposo - inicioY)));
    const suelo = innerHeight + 40;
    const arnes = punto(ARNES, y, rad);
    const colgar = (lineas, desde, inclina) => {
      const largo = suelo - desde[1];
      const hastaX = desde[0] + inclina * largo + arrastre;
      tender(lineas, desde[0], desde[1],
        lerp(desde[0], hastaX, despliegue), desde[1] + largo * despliegue);
    };
    colgar(colaA, mano, -0.04);
    colgar(colaB, arnes, -0.025);

    // --- aparece al quedar la portada atrás, y se retira igual al subir ---
    caja.style.opacity = clamp(recorrido / 240).toFixed(3);

    requestAnimationFrame(paso);
  };

  const arrancar = () => {
    if (corriendo || !mq.matches) return;
    medir();
    corriendo = true;
    ultimoScroll = scrollY;
    y = destinoY = -alto - 24;
    requestAnimationFrame(paso);
  };
  const detener = () => {
    corriendo = false;
    caja.style.opacity = '0';
  };

  mq.addEventListener('change', () => (mq.matches ? arrancar() : detener()));
  addEventListener('resize', () => { if (corriendo) medir(); });
  document.addEventListener('asap:rendered', () => { if (corriendo) medir(); });
  arrancar();
}

/* -----------------------------------------------------------------------------
   Cintas: proveedores y con quienes hemos trabajado
   -----------------------------------------------------------------------------
   Cada fila es un grupo de frases repetido hasta cubrir la pantalla, y ese
   grupo va dos veces seguido: al recorrer el ancho de uno, el otro ocupa su
   lugar y el bucle no tiene costura. Solo se anima mientras la sección está a
   la vista, y solo se escribe `transform` y una variable de luz por palabra;
   las posiciones se miden una vez, no en cada cuadro.
   -------------------------------------------------------------------------- */
function initCintas() {
  const caja = $('#cintas');
  const filasBox = $('#cintasFilas');
  if (!caja || !filasBox || !CINTAS?.length) return;

  const BASE = [58, 46];                 // px/s de cada fila en reposo
  let filas = [];

  const itemHTML = (frase, i) => `
    <span class="cintas__item" style="--i:${i}">
      <span class="cintas__txt">${frase}</span><i class="cintas__sep"></i>
    </span>`;

  const rotuloHTML = c => `
    <div class="cintas__rotulo cintas__rotulo--${c.posicion === 'abajo' ? 'abajo' : 'arriba'}">
      <span class="cintas__rotulo-filo"></span>
      <span class="cintas__rotulo-txt">${c.rotulo}</span>
      <span class="cintas__rotulo-filo"></span>
    </div>`;

  // para lectores de pantalla: cada rótulo con su lista, una sola vez
  const lector = $('#cintasLector');
  if (lector) lector.innerHTML = CINTAS.map(c =>
    `<p>${c.rotulo}: ${(c.nombres ?? []).join(', ')}.</p>`).join('');

  const construir = () => {
    filasBox.innerHTML = CINTAS.map(c => {
      const fila = `<div class="cintas__fila cintas__fila--${c.estilo === 'hueca' ? 'hueca' : 'llena'}"><div class="cintas__pista"></div></div>`;
      const rotulo = c.rotulo ? rotuloHTML(c) : '';
      return c.posicion === 'abajo' ? fila + rotulo : rotulo + fila;
    }).join('');

    filas = $$('.cintas__fila', filasBox).map((fila, n) => {
      const cfg = CINTAS[n];
      const pista = $('.cintas__pista', fila);
      const frases = cfg.nombres?.length ? cfg.nombres : [cfg.rotulo ?? ''];

      // un grupo que por sí solo ya cubra la pantalla
      let grupo = '', i = 0;
      pista.innerHTML = frases.map(f => itemHTML(f, i++)).join('');
      const unidad = pista.scrollWidth || 1;
      const veces = Math.max(1, Math.ceil((innerWidth * 1.15) / unidad));
      for (let k = 0; k < veces; k++) grupo += frases.map(f => itemHTML(f, i++)).join('');
      pista.innerHTML = grupo + grupo;

      const items = $$('.cintas__item', pista);
      return {
        pista, items,
        sentido: cfg.sentido === 1 ? 1 : -1,
        base: BASE[n] ?? BASE[BASE.length - 1],
        ancho: pista.scrollWidth / 2,
        centros: items.map(el => el.offsetLeft + el.offsetWidth / 2),
        izq: fila.getBoundingClientRect().left,
        avance: Math.random() * 400       // que no arranquen alineadas
      };
    });
  };

  const encender = (f, desplazo) => {
    const mitad = innerWidth / 2, alcance = innerWidth * 0.36;
    f.items.forEach((el, k) => {
      const d = Math.abs(f.izq + desplazo + f.centros[k] - mitad) / alcance;
      const luz = 1 - Math.min(1, d);
      el.style.setProperty('--luz', (luz * luz * (3 - 2 * luz)).toFixed(3));
    });
  };

  const colocar = (f, inclinacion = 0) => {
    const t = ((f.avance % f.ancho) + f.ancho) % f.ancho;
    const desplazo = t - f.ancho;
    f.pista.style.transform = `translate3d(${desplazo.toFixed(2)}px, 0, 0) skewX(${inclinacion.toFixed(2)}deg)`;
    encender(f, desplazo);
  };

  const listo = () => {
    construir();
    filas.forEach(f => colocar(f));
  };

  // la entrada de las filas y los filos
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { caja.classList.add('is-in'); obs.disconnect(); }
  }, { threshold: 0.25 }).observe(caja);

  (document.fonts?.ready ?? Promise.resolve()).then(listo);
  let ancho = innerWidth;
  addEventListener('resize', () => {
    if (Math.abs(innerWidth - ancho) < 2) return;
    ancho = innerWidth; listo();
  });

  if (REDUCED) return;                    // quietas, pero completas y legibles

  let visible = false, corriendo = false, previo = 0;
  let ultimoScroll = scrollY, velScroll = 0, inclinacion = 0;
  let freno = 1, frenoDestino = 1;

  caja.addEventListener('pointerenter', () => { frenoDestino = 0.22; });
  caja.addEventListener('pointerleave', () => { frenoDestino = 1; });

  const paso = t => {
    if (!visible) { corriendo = false; return; }
    const dt = Math.min(0.05, (t - (previo || t)) / 1000);
    previo = t;

    velScroll = lerp(velScroll, scrollY - ultimoScroll, 0.12);
    ultimoScroll = scrollY;
    freno = lerp(freno, frenoDestino, 0.06);
    inclinacion = lerp(inclinacion, clamp(velScroll * 0.22, -7, 7), 0.1);

    // al bajar aceleran en su sentido; al subir, se invierten
    const empuje = clamp(velScroll * 11, -420, 420);
    filas.forEach(f => {
      f.avance += f.sentido * (f.base * freno + empuje) * dt;
      colocar(f, inclinacion * -f.sentido);      // se inclinan hacia donde corren
    });
    requestAnimationFrame(paso);
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !corriendo) {
      corriendo = true; previo = 0; ultimoScroll = scrollY;
      requestAnimationFrame(paso);
    }
  }).observe(caja);
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
  initCintas();
  initForm();

  document.dispatchEvent(new CustomEvent('asap:rendered'));
}

initPreload();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
