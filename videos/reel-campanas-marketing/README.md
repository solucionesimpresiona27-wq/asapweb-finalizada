# Reel — Soluciones Impresiona (campañas de marketing)

Video promocional de 53 s para Instagram Reels sobre campañas de publicidad en
Google Ads y Meta Ads, hecho con [HyperFrames](https://hyperframes.heygen.com).
Mismos colores, tipografía, ritmo pausado y cierre del foco que los otros reels.

**Video final:** [`renders/reel-campanas-marketing.mp4`](renders/reel-campanas-marketing.mp4)
— 1080×1920, 30 fps, H.264 + AAC.

> Esta carpeta no forma parte del sitio web: no la subas al hosting.

| Tiempo | Escena | Archivo |
|---|---|---|
| 0–6 s | Tienes un gran negocio, pero ¿te llegan clientes? | `compositions/s1-hook.html` |
| 6–12 s | Campañas que ATRAEN CLIENTES con Google Ads y Meta Ads | `compositions/s2-title.html` |
| 12–20 s | Cómo funciona: creamos la campaña → llega a tu público → te escriben | `compositions/s3-how.html` |
| 20–28 s | Dónde apareces: Google Ads y Meta Ads | `compositions/s4-platforms.html` |
| 28–36 s | Así llegan tus clientes (embudo) | `compositions/s5-funnel.html` |
| 36–42 s | Nosotros conseguimos los clientes; tú solo respondes | `compositions/s6-roles.html` |
| 42–47.5 s | ¿Listo para recibir MÁS CLIENTES? | `compositions/s7-cta.html` |
| 48–53 s | El foco se enciende y aparece el logo | `compositions/s8-finale.html` |

```bash
cd videos/reel-campanas-marketing
npx hyperframes@0.8.134 browser ensure
npm run dev
npm run check
npx hyperframes@0.8.134 render -o renders/reel-campanas-marketing.mp4 --quality delivery --crf 12
```
