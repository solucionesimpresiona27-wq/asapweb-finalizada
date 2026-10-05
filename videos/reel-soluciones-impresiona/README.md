# Reel — Soluciones Impresiona (páginas web)

Video promocional de 30 s para Instagram Reels, hecho con
[HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP renderizado a video).

**Video final:** [`renders/reel-soluciones-impresiona.mp4`](renders/reel-soluciones-impresiona.mp4)
— 1080×1920, 30 fps, H.264 + AAC, -14.7 LUFS.

> Esta carpeta no forma parte del sitio web: no la subas al hosting.

## Escenas

| Tiempo | Escena | Archivo |
|---|---|---|
| 0–4 s | Gancho: "tu negocio" → 0 resultados → *Si no te encuentran, no te eligen.* | `compositions/s1-hook.html` |
| 4–8 s | *Creamos tu PÁGINA WEB que impresiona.* | `compositions/s2-title.html` |
| 8–16 s | Diseñamos → Desarrollamos → Lanzamos (navegador y celular) | `compositions/s3-build.html` |
| 16–22 s | Beneficios: diseño, celular, Google, WhatsApp | `compositions/s4-benefits.html` |
| 22–25.5 s | *¿Listo para IMPRESIONAR?* + botón *Cotiza tu página web* | `compositions/s5-cta.html` |
| 26–30 s | El logo se enciende a pantalla completa + lema | `compositions/s6-finale.html` |
| 0–30 s | Logo fijo arriba que al final vuela al centro | `compositions/brand.html` |
| 0–30 s | Fondo (brillos, retícula, órbita) | `compositions/world.html` |

El guion completo está en `STORYBOARD.md` y el encargo en `BRIEF.md`.

## Audio

- **Música original** (`assets/audio/music.mp3`), generada con
  `scripts/compose_music.py`: 120 BPM, sin voz. Cada corte de escena cae en un
  compás; el drop entra en 4 s y el golpe final en 26 s.
- **Efectos de sonido** (`assets/audio/sfx/`, licencia Pixabay, ver
  `CREDITS.md`) sincronizados con cada movimiento: tecleo, clics, whooshes,
  pops de los elementos, impacto grave en el drop y en el logo.

## Editar y volver a renderizar

Requiere Node 22+ y FFmpeg.

```bash
cd videos/reel-soluciones-impresiona
npx hyperframes@0.8.134 browser ensure   # una sola vez: Chrome para renderizar
npm run dev                                # vista previa editable (Studio)
npm run check                              # validación completa
npx hyperframes@0.8.134 render -o renders/reel-soluciones-impresiona.mp4 --quality delivery
```

Para regenerar la música: `pip install numpy scipy && python3 scripts/compose_music.py`.

GSAP va incluido en `assets/vendor/gsap.min.js` para que el render funcione sin
conexión.
