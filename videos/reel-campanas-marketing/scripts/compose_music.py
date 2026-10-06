"""Original music bed for the Soluciones Impresiona marketing-campaigns reel.

Same sound as the other two reels (120 BPM, F major, same synths), arranged
for 53 s with a calmer pace. One bar = 2 s; every scene cut (6, 12, 20, 28,
34, 42, 48 s) lands on a bar line.

  0-6 s    intro: filtered pad + plucks, no drums
  6 s      drop
  12-20 s  lighter groove under the before/after photo
  46-48 s  build; 48 s final boom on F major, long tail under the logo

Run: python3 scripts/compose_music.py  ->  assets/audio/music.mp3
"""

import os
import subprocess

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
DUR = 53.0
N = int(SR * DUR)
BEAT = 0.5
BAR = 2.0
DROP = 6.0
LIGHT = (12.0, 20.0)   # lighter groove while the video explains how it works
SHAKER_FROM = 34.0
BUILD = 47.0           # drums stop here
FINAL = 48.0

rng = np.random.default_rng(41)
t_all = np.arange(N) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, sig, at):
    i = int(round(at * SR))
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def stereo(buf_l, buf_r=None):
    return np.stack([buf_l, buf_l if buf_r is None else buf_r])


# ---------------------------------------------------------------- harmony
F, C, Dm, Bb = "F", "C", "Dm", "Bb"
CHORDS = {
    "F": {"bass": 41, "pad": [53, 57, 60, 64], "arp": [65, 69, 72, 76]},   # Fmaj7
    "C": {"bass": 36, "pad": [52, 55, 60, 62], "arp": [64, 67, 72, 74]},   # Cadd9
    "Dm": {"bass": 38, "pad": [53, 57, 60, 64], "arp": [62, 65, 69, 72]},  # Dm9
    "Bb": {"bass": 34, "pad": [53, 57, 60, 62], "arp": [62, 65, 70, 74]},  # Bbmaj9
}
PROG = [(0, 2, Dm), (2, 4, Bb), (4, 5, Bb), (5, 6, C)]
LOOP = [F, C, Dm, Bb]
for k, a in enumerate(range(6, 46, 2)):
    PROG.append((a, a + 2, LOOP[k % 4]))
PROG += [(46, 47, Bb), (47, 48, C), (48, 53, F)]


def chord_at(t):
    for a, b, c in PROG:
        if a <= t < b:
            return c
    return F


def in_light(t):
    return LIGHT[0] <= t < LIGHT[1]


# ---------------------------------------------------------------- instruments
def supersaw(freq, dur, voices=7, spread=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for v in range(voices):
        det = (v - (voices - 1) / 2) / ((voices - 1) / 2) * spread  # semitones
        f = freq * 2 ** (det / 12)
        ph = rng.random()
        out += 2 * ((t * f + ph) % 1.0) - 1
    return out / voices


def pad_note(freq, dur, attack=0.35, release=0.6):
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    sig_l = supersaw(freq, dur + release)
    sig_r = supersaw(freq, dur + release)
    env = np.minimum(1, t / attack)
    env *= np.where(t > dur, np.exp(-(t - dur) / (release / 3)), 1)
    return sig_l * env, sig_r * env


def pluck(freq, dur=0.45, bright=1.0):
    """Additive pluck: upper partials die faster (marimba / harp feel)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, 14):
        if freq * k > 16000:
            break
        amp = (1 / k) * (0.55 if k % 2 == 0 else 1.0)
        decay = 7 + 5 * k ** 1.1 / bright
        out += amp * np.sin(2 * np.pi * freq * k * t) * np.exp(-decay * t)
    out *= np.minimum(1, t / 0.002)
    return out * 0.5


def bell(freq, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    idx = 2.2 * np.exp(-t * 5)
    mod = np.sin(2 * np.pi * freq * 2 * t) * idx
    out = np.sin(2 * np.pi * freq * t + mod) * np.exp(-t * 3.2)
    out += 0.25 * np.sin(2 * np.pi * freq * 4.01 * t) * np.exp(-t * 9)
    return out * np.minimum(1, t / 0.003)


def kick(level=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 46 + 115 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(n), 2500) * np.exp(-t * 400) * 0.25
    return np.tanh((body + click) * 1.6) * level


def clap(level=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 900, 5200)
    env = np.zeros(n)
    for off in (0.0, 0.011, 0.022):
        tt = np.clip(t - off, 0, None)
        env += np.where(t >= off, np.exp(-tt * 140), 0)
    env += np.exp(-np.clip(t - 0.03, 0, None) * 18) * (t >= 0.03) * 0.55
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.3
    return (noise * env * 0.5 + body) * level


def snare(level=1.0):
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 26)
    body = np.sin(2 * np.pi * 200 * t) * np.exp(-t * 35)
    return (noise * 0.55 + body * 0.45) * level


def hat(open_=False, level=1.0):
    dur = 0.28 if open_ else 0.06
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = hp(rng.standard_normal(n), 7500, 4)
    env = np.exp(-t * (11 if open_ else 70))
    return noise * env * level


def sub(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.18 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 2.2)
    rel = np.minimum(1, (dur - t) / 0.02)
    return np.tanh(s * 1.4) * env * rel


# ---------------------------------------------------------------- buses
pad_l = np.zeros(N); pad_r = np.zeros(N)
arp_l = np.zeros(N); arp_r = np.zeros(N)
lead = np.zeros(N)
bass = np.zeros(N)
drums = np.zeros(N)
perc_l = np.zeros(N); perc_r = np.zeros(N)
fx = np.zeros(N)

# pads: one held chord per PROG entry
for a, b, c in PROG:
    for note in CHORDS[c]["pad"]:
        sl, sr_ = pad_note(midi(note), b - a, attack=0.4 if (a < DROP or in_light(a)) else 0.08,
                           release=2.6 if a >= FINAL else 0.5)
        lvl = 1.25 if in_light(a) else 1.0
        add(pad_l, sl * lvl, a)
        add(pad_r, sr_ * lvl, a)

# arpeggio: 16ths over chord tones (8ths while explaining, so it breathes)
ARP_SHAPE = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 3, 1, 2]
step = BEAT / 4
i = 0
t0 = 0.0
while t0 < BUILD - 0.01:
    light = in_light(t0)
    if not (light and i % 2 == 1):
        c = chord_at(t0 + 1e-6)
        notes = CHORDS[c]["arp"]
        k = ARP_SHAPE[i % 16]
        up = 12 if (i // 16) % 2 == 1 and k in (2, 3) else 0
        vel = 1.0 if i % 4 == 0 else (0.72 if i % 2 == 0 else 0.55)
        if t0 < DROP:
            vel *= 0.55 + 0.45 * (t0 / DROP)
        if light:
            vel *= 0.8
        p = pluck(midi(notes[k] + up), 0.42, bright=0.7 if (t0 < DROP or light) else 1.0) * vel
        pan = 0.5 + 0.3 * np.sin(i * 0.9)
        add(arp_l, p * (1 - pan) * 1.4, t0)
        add(arp_r, p * pan * 1.4, t0)
    i += 1
    t0 = i * step

# bell hook: two-bar motif in F pentatonic; an octave up from 34 s
MOTIF = [
    (0, 72), (1, 69), (1.5, 65), (2, 67), (2.5, 69),
    (4, 72), (5, 74), (5.5, 72), (6, 69), (7, 67),
]
for start in range(12, 44, 4):
    octave = 12 if start >= 34 else 0
    for off, note in MOTIF:
        add(lead, bell(midi(note + octave), 1.1) * (0.9 if off % 2 == 0 else 0.7) * (0.8 if octave else 1.0),
            start + off * BEAT)
# finale bell: rising arpeggio over the logo
for off, note in [(0, 72), (0.5, 76), (1.0, 79), (1.5, 84)]:
    add(lead, bell(midi(note), 2.4) * 0.8, FINAL + 0.25 + off * BEAT)

# drums
for b in np.arange(DROP, BUILD, BEAT):
    light = in_light(b)
    add(drums, kick(0.72 if light else 1.0), b)
    beat_in_bar = round((b % BAR) / BEAT)
    if beat_in_bar in (1, 3) and not light:
        add(drums, clap(0.55), b)
    if light and beat_in_bar == 3:
        add(drums, clap(0.3), b)
# hats: quiet 16ths in the intro, 8ths while explaining, 16ths otherwise
for k, h in enumerate(np.arange(2.0, BUILD, BEAT / 4)):
    light = in_light(h)
    if light and k % 2 == 1:
        continue
    acc = 1.0 if k % 4 == 2 else 0.45
    lvl = (0.08 if h < DROP else (0.11 if light else 0.16)) * acc
    add(perc_l if k % 2 else perc_r, hat(False, lvl), h)
for h in np.arange(DROP + BEAT / 2, BUILD, BEAT):
    if in_light(h):
        continue
    add(perc_l, hat(True, 0.06), h)
    add(perc_r, hat(True, 0.06), h + 0.004)
# shaker for the last stretch (extra energy)
for k, h in enumerate(np.arange(SHAKER_FROM, BUILD, BEAT / 4)):
    n = int(0.09 * SR)
    tt = np.arange(n) / SR
    sh = bp(rng.standard_normal(n), 5000, 12000) * np.exp(-tt * 45) * (0.06 if k % 2 else 0.035)
    add(perc_r if k % 2 else perc_l, sh, h + 0.01)
# fills into the scene changes
for fill_at in (11.5, 19.5, 27.5, 35.5, 41.5):
    for k, s in enumerate(np.arange(fill_at, fill_at + 0.5, BEAT / 4)):
        add(drums, snare(0.22 + 0.08 * k), s)
# build: accelerating snare roll 46-48
times = list(np.arange(46.0, 47.0, BEAT / 2)) + list(np.arange(47.0, 47.75, BEAT / 4)) \
    + list(np.arange(47.75, 48.0, BEAT / 8))
for k, s in enumerate(times):
    add(drums, snare(0.12 + 0.5 * (k / len(times)) ** 1.5), s)
# final boom
add(drums, kick(1.25), FINAL)
boom_n = int(2.5 * SR)
tb = np.arange(boom_n) / SR
boom = np.sin(2 * np.pi * (38 + 30 * np.exp(-tb * 8)) * tb) * np.exp(-tb * 1.6)
add(drums, boom * 0.8, FINAL)

# sub bass: rolling 8ths on the root (quarter notes while explaining), long note at the end
for b in np.arange(DROP, BUILD, BEAT / 2):
    light = in_light(b)
    if light and round(b / (BEAT / 2)) % 2 == 1:
        continue
    c = chord_at(b + 1e-6)
    root = CHORDS[c]["bass"]
    dur = (BEAT if light else BEAT / 2) * 0.95
    add(bass, sub(midi(root + 12 if root < 36 else root), dur) * 0.85, b)
add(bass, sub(midi(41), 3.5) * 0.9, FINAL)


# noise sweeps: intro into the drop, and the build into the boom
def sweep(start, end, level):
    n = int((end - start) * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 64
    for bi in range(blocks):
        a = bi * n // blocks
        z = (bi + 1) * n // blocks
        frac = bi / blocks
        fc = 400 * (20 ** frac)
        out[a:z] = bp(x[a:z], fc * 0.6, min(fc * 1.6, 18000), 1)
    env = (t / t[-1]) ** 2.2
    return out * env * level


add(fx, sweep(2.0, 6.0, 0.18), 2.0)
add(fx, sweep(46.0, 48.0, 0.22), 46.0)

# ---------------------------------------------------------------- sidechain + filters
side = np.ones(N)
for b in np.arange(DROP, BUILD, BEAT):
    i0 = int(b * SR)
    n = int(BEAT * SR)
    tt = np.arange(n) / SR
    depth = 0.35 if in_light(b) else 0.55
    side[i0:i0 + n] = np.minimum(side[i0:i0 + n], 1 - depth * np.exp(-tt / 0.11))
pre = (t_all > FINAL - 0.25) & (t_all < FINAL)
side[pre] *= np.linspace(1, 0.35, pre.sum())


def sweep_lp(x, f_from, f_to, t_from, t_to):
    out = x.copy()
    a, z = int(t_from * SR), int(t_to * SR)
    blocks = 48
    seg = x[a:z]
    res = np.zeros_like(seg)
    for bi in range(blocks):
        s0 = bi * len(seg) // blocks
        s1 = (bi + 1) * len(seg) // blocks
        fc = f_from * (f_to / f_from) ** (bi / blocks)
        res[s0:s1] = lp(seg[s0:s1], fc)
    out[a:z] = res
    out[z:] = lp(x[z:], f_to)
    return out


pad_l = hp(sweep_lp(pad_l, 380, 2600, 0, DROP), 160) * side
pad_r = hp(sweep_lp(pad_r, 380, 2600, 0, DROP), 160) * side
arp_l = sweep_lp(arp_l, 900, 9000, 0, DROP) * side
arp_r = sweep_lp(arp_r, 900, 9000, 0, DROP) * side
bass = lp(bass, 220) * side

# ping-pong delay on the arp (dotted eighth)
d = int(0.375 * SR)
dl, dr = np.zeros(N), np.zeros(N)
src_l, src_r = arp_l.copy(), arp_r.copy()
fb = 0.33
for rep in range(1, 5):
    g = fb ** rep
    sh = d * rep
    if rep % 2:
        dl[sh:] += src_r[:-sh] * g
        dr[sh:] += src_l[:-sh] * g
    else:
        dl[sh:] += src_l[:-sh] * g
        dr[sh:] += src_r[:-sh] * g
arp_l += lp(dl, 4000) * 0.6
arp_r += lp(dr, 4000) * 0.6

# ---------------------------------------------------------------- reverb
ir_n = int(2.4 * SR)
ti = np.arange(ir_n) / SR
ir_l = rng.standard_normal(ir_n) * np.exp(-ti / 0.42)
ir_r = rng.standard_normal(ir_n) * np.exp(-ti / 0.42)
ir_l = lp(ir_l, 5200); ir_r = lp(ir_r, 5200)
pd = int(0.022 * SR)
ir_l = np.concatenate([np.zeros(pd), ir_l]); ir_r = np.concatenate([np.zeros(pd), ir_r])
ir_l /= np.sqrt((ir_l ** 2).sum()); ir_r /= np.sqrt((ir_r ** 2).sum())

send = (pad_l + pad_r) * 0.5 * 0.35 + (arp_l + arp_r) * 0.5 * 0.35 + lead * 0.55 + fx * 0.3
send_drums = lp(drums, 6000) * 0.08
wet_l = fftconvolve(send + send_drums, ir_l)[:N]
wet_r = fftconvolve(send + send_drums, ir_r)[:N]

# ---------------------------------------------------------------- mix
L = (pad_l * 0.20 + arp_l * 0.30 + lead * 0.16 + bass * 0.55 + drums * 0.62
     + perc_l * 1.0 + fx * 0.9 + wet_l * 0.38)
R = (pad_r * 0.20 + arp_r * 0.30 + lead * 0.16 + bass * 0.55 + drums * 0.62
     + perc_r * 1.0 + fx * 0.9 + wet_r * 0.38)

mix = np.stack([L, R])
mix = hp(mix, 28)
# fade in the first 30 ms, fade the tail over the last 1.6 s
fade_in = np.minimum(1, t_all / 0.03)
fade_out = np.clip((DUR - t_all) / 1.6, 0, 1) ** 1.5
mix *= fade_in * fade_out
# glue + soft limit
mix = np.tanh(mix * 1.25) / np.tanh(1.25)
mix *= 0.89 / np.abs(mix).max()

out_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "audio")
os.makedirs(out_dir, exist_ok=True)
wav = os.path.join(out_dir, "music.wav")
pcm = (mix.T * 32767).astype(np.int16)
import wave
with wave.open(wav, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
mp3 = os.path.join(out_dir, "music.mp3")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "256k", mp3], check=True)
os.remove(wav)
print("wrote", os.path.normpath(mp3))
