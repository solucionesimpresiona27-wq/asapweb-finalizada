# Reel — Soluciones Impresiona (asistentes de IA)

Video promocional de 52 s para Instagram Reels, hecho con
[HyperFrames](https://hyperframes.heygen.com). Mismo estilo que
`../reel-soluciones-impresiona/`.

**Video final:** [`renders/reel-asistentes-ia.mp4`](renders/reel-asistentes-ia.mp4)
— 1080×1920, 30 fps, H.264 + AAC, -15 LUFS.

> Esta carpeta no forma parte del sitio web: no la subas al hosting.

| Tiempo | Escena | Archivo |
|---|---|---|
| 0–4 s | 11:47 p. m.: mensajes sin responder | `compositions/s1-hook.html` |
| 4–8 s | Tu propio ASISTENTE de IA | `compositions/s2-title.html` |
| 8–16 s | ¿Qué es? Conversación que agenda una cita | `compositions/s3-chat.html` |
| 16–24 s | ¿Cómo funciona? Recibe → entiende y consulta → responde | `compositions/s4-how.html` |
| 24–30 s | Agenda, reagenda, cancela y recuerda citas | `compositions/s5-calendar.html` |
| 30–34 s | Y mucho más | `compositions/s6-more.html` |
| 34–40 s | Hecho a la medida de tu negocio | `compositions/s7-custom.html` |
| 40–44 s | Resuelve los problemas de tu negocio | `compositions/s8-solve.html` |
| 44–47.5 s | ¿Listo para tu ASISTENTE IA? | `compositions/s9-cta.html` |
| 48–52 s | El logo se enciende a pantalla completa | `compositions/s10-finale.html` |

Música original (`scripts/compose_music.py`, 120 BPM) y efectos de sonido
(`assets/audio/sfx/`, licencia Pixabay). Para editar y renderizar:

```bash
cd videos/reel-asistentes-ia
npx hyperframes@0.8.134 browser ensure
npm run dev      # vista previa editable
npm run check
npx hyperframes@0.8.134 render -o renders/reel-asistentes-ia.mp4 --quality delivery
```
