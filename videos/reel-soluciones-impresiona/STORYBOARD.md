---
format: 1080x1920
duration: 30s
message: "Soluciones Impresiona crea la página web profesional que tu negocio necesita"
arc: Gancho → Solución → Proceso → Beneficios → Llamado a la acción → Logo
audience: dueños de negocios y emprendedores en Instagram
mode: autonomous
---

Ritmo: la música va a 120 BPM (1 compás = 2 s) y cada corte cae en un compás:
rápido (gancho) → GOLPE (drop en 4 s) → demostración larga → cuatro golpes
(beneficios) → clic → silencio → GOLPE final con el logo.

## Frame 1 — Gancho: la búsqueda vacía

- scene: Una barra de búsqueda escribe "tu negocio" y devuelve "0 resultados"
- duration: 4s
- poster: 3.5s
- transition_in: cut
- status: animated
- src: compositions/s1-hook.html
- blueprint: typewriter-reveal · rules: discrete-text-sequence, chromatic-glitch, kinetic-beat-slam

La barra aparece con rebote, el texto se escribe letra por letra, "0 resultados"
entra con un glitch RGB y el titular golpea en dos tiempos: "Si no te
encuentran, / no te eligen." Sale con un zoom hacia la cámara justo antes del drop.
Sonido: pop, tecleo, clic de enter, glitch, riser que culmina en 4 s.

## Frame 2 — La solución

- scene: "Creamos tu PÁGINA WEB que impresiona." sobre el drop
- duration: 4s
- poster: 7s
- transition_in: zoom-through
- status: animated
- src: compositions/s2-title.html
- blueprint: kinetic-type-beats · rules: kinetic-beat-slam, css-marker-patterns, spring-pop-entrance

"PÁGINA" golpea con el bombo (impacto grave), un bloque amarillo barre y revela
"WEB", y tres etiquetas (Diseño · Desarrollo · Lanzamiento) entran al pulso.

## Frame 3 — Diseñamos, desarrollamos, lanzamos

- scene: Un navegador pasa de boceto a página terminada, recibe un cliente y queda en línea; entra el celular
- duration: 8s
- poster: 13.9s
- transition_in: whip-up
- status: animated
- src: compositions/s3-build.html
- blueprint: device-surface-showcase · rules: waterfall-entry, cursor-click-ripple, press-release-spring, discrete-text-sequence

01 el boceto se arma por bloques · 02 una línea de escaneo amarilla convierte el
boceto en diseño · clic en "Contáctanos" → "¡Nuevo cliente!" · 03 se escribe
www.tunegocio.com y aparece "EN LÍNEA" · el navegador gira y entra la versión
para celular.

## Frame 4 — Lo que incluye

- scene: Cuatro beneficios entran uno por compás con su ícono y palomita
- duration: 6s
- poster: 21s
- transition_in: blur-through
- status: animated
- src: compositions/s4-benefits.html
- blueprint: grid-card-assemble · rules: spring-pop-entrance, svg-path-draw

Diseño a tu medida · Perfecta en celular · Lista para Google · Conectada a
WhatsApp. Un marco amarillo salta a cada fila nueva.

## Frame 5 — ¿Listo para impresionar?

- scene: Pregunta final y botón "COTIZA TU PÁGINA WEB" que el cursor presiona
- duration: 3.5s
- poster: 24.4s
- transition_in: push-up
- status: animated
- src: compositions/s5-cta.html
- blueprint: cta-morph-press · rules: press-release-spring, cursor-click-ripple

El clic cae exactamente en el compás de 24 s. Debajo: "Escríbenos por mensaje directo".

## Frame 6 — La idea se enciende

- scene: El logo vuela al centro, la bombilla se enciende y la luz llena la pantalla con el logo completo
- duration: 4s
- poster: 28.5s
- transition_in: light-iris
- status: animated
- src: compositions/s6-finale.html
- blueprint: logo-assemble-lockup · rules: ambient-glow-bloom, svg-path-draw

La marca fija de arriba (compositions/brand.html) viaja al centro y crece a
pantalla completa justo en el golpe final; un círculo de luz sale de la bombilla
y cubre todo, el logo pasa a sus colores originales y aparece el lema
"Páginas web que impresionan".
