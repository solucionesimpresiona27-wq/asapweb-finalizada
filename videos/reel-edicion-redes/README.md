# Reel — Soluciones Impresiona (edición de fotos y videos para redes)

Video promocional de 53 s para Instagram Reels, hecho con
[HyperFrames](https://hyperframes.heygen.com). Mismos colores, tipografía y
cierre del foco que los otros dos reels, con un ritmo más pausado.

**Video final:** [`renders/reel-edicion-redes.mp4`](renders/reel-edicion-redes.mp4)
— 1080×1920, 30 fps, H.264 + AAC, -15 LUFS.

> Esta carpeta no forma parte del sitio web: no la subas al hosting.

| Tiempo | Escena | Archivo |
|---|---|---|
| 0–6 s | Tus clientes te conocen primero en redes. ¿Qué impresión se llevan? | `compositions/s1-hook.html` |
| 6–12 s | Edición de FOTOS y VIDEOS para tus redes sociales | `compositions/s2-title.html` |
| 12–20 s | Fotos que detienen el scroll (antes / después) | `compositions/s3-photo.html` |
| 20–28 s | Videos que enganchan (cortes, subtítulos, música, efectos) | `compositions/s4-video.html` |
| 28–34 s | Para todas tus redes (9:16, 4:5, 1:1) | `compositions/s5-platforms.html` |
| 34–42 s | Mejor imagen, más clientes (perfil antes / después) | `compositions/s6-impact.html` |
| 42–47.5 s | Haz que tus redes IMPRESIONEN | `compositions/s7-cta.html` |
| 48–53 s | El foco se enciende y aparece el logo | `compositions/s8-finale.html` |

Las "fotos" de ejemplo son ilustraciones en `assets/scenes/`. Música original
(`scripts/compose_music.py`) y efectos en `assets/audio/sfx/` (licencia Pixabay).

```bash
cd videos/reel-edicion-redes
npx hyperframes@0.8.134 browser ensure
npm run dev
npm run check
npx hyperframes@0.8.134 render -o renders/reel-edicion-redes.mp4 --quality delivery --crf 12
```
