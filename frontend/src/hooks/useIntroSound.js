import { useEffect, useRef, useState } from 'react'

const MASTER_VOLUME = 1.6

const BEATS_PER_SCENE = 4

const SILENT_WAV = 'data:audio/wav;base64,UklGRvQHAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdAHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA=='

const NEW_LEVEL = 1.1
const CLASSIC_LEVEL = 1

const CLASSIC_SCENE_INDEX = 3

const CHORDS = {
  0: [440, 523.25, 659.25],
  1: [349.23, 440, 523.25],
  2: [392, 493.88, 587.33],
}

const ARP_PATTERN = [0, 2, 1, 2, 4, 2, 1, 2, 0, 2, 1, 5, 4, 2, 3, 1]

const CHIRP_STEPS = new Set([3, 7, 10, 14])

export function useIntroSound({ sceneIndex, sceneMs, glitch, exiting, fadeOutMs }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const beatSec = sceneMs / 1000 / BEATS_PER_SCENE

  useEffect(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return undefined

    let built = null
    let keepAlive = null

    function build() {
      const ctx = new AudioCtx()
      const master = ctx.createGain()
      master.gain.value = 0

      const limiter = ctx.createDynamicsCompressor()
      limiter.threshold.value = -8
      limiter.knee.value = 0
      limiter.ratio.value = 20
      limiter.attack.value = 0.003
      limiter.release.value = 0.25
      master.connect(limiter).connect(ctx.destination)

      const classicBus = ctx.createGain()
      classicBus.gain.value = 0
      classicBus.connect(master)
      const newBus = ctx.createGain()
      newBus.gain.value = 0

      const cyberHighpass = ctx.createBiquadFilter()
      cyberHighpass.type = 'highpass'
      cyberHighpass.frequency.value = 220
      newBus.connect(cyberHighpass).connect(master)

      const arpIn = ctx.createGain()
      const echo = ctx.createDelay(1)
      echo.delayTime.value = (sceneMs / 1000 / BEATS_PER_SCENE) * 0.75
      const echoFeedback = ctx.createGain()
      echoFeedback.gain.value = 0.35
      const echoOut = ctx.createGain()
      echoOut.gain.value = 0.4
      arpIn.connect(newBus)
      arpIn.connect(echo)
      echo.connect(echoFeedback).connect(echo)
      echo.connect(echoOut).connect(newBus)

      const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
      const data = noise.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

      const droneFilter = ctx.createBiquadFilter()
      droneFilter.type = 'lowpass'
      droneFilter.frequency.value = 380
      droneFilter.Q.value = 6
      const droneGain = ctx.createGain()
      droneGain.gain.value = 0.22
      droneFilter.connect(droneGain).connect(classicBus)

      const oscs = [55, 55.4, 82.4].map((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = i === 2 ? 'triangle' : 'sawtooth'
        osc.frequency.value = freq
        osc.connect(droneFilter)
        osc.start()
        return osc
      })

      const lfo = ctx.createOscillator()
      const lfoDepth = ctx.createGain()
      lfo.frequency.value = 0.08
      lfoDepth.gain.value = 180
      lfo.connect(lfoDepth).connect(droneFilter.frequency)
      lfo.start()
      oscs.push(lfo)

      audioRef.current = { ctx, master, noise, classicBus, newBus, arpIn }
      return { ctx, master, oscs }
    }

    const events = ['pointerdown', 'pointerup', 'mousedown', 'touchend', 'click', 'keydown']
    const removeListeners = () => events.forEach((e) => window.removeEventListener(e, onGesture))

    function routeToSpeaker() {
      try {
        if (navigator.audioSession) navigator.audioSession.type = 'playback'
        if (!keepAlive) {
          keepAlive = new Audio(SILENT_WAV)
          keepAlive.loop = true
        }
        keepAlive.play().catch(() => {})
      } catch {}
    }

    function onGesture() {
      routeToSpeaker()
      if (!built) built = build()
      const { ctx, master } = built
      ctx.resume().then(() => {
        if (ctx.state !== 'running') return
        master.gain.setTargetAtTime(MASTER_VOLUME, ctx.currentTime, 0.4)
        setPlaying(true)
        removeListeners()
      }).catch(() => {})
    }

    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }))
    if (navigator.userActivation?.hasBeenActive) onGesture()

    return () => {
      removeListeners()
      keepAlive?.pause()
      if (built) {
        built.oscs.forEach((o) => o.stop())
        built.ctx.close()
      }
      audioRef.current = null
    }
  }, [])

  const classic = sceneIndex === CLASSIC_SCENE_INDEX
  useEffect(() => {
    if (!playing || exiting || !classic) return undefined
    const id = setInterval(() => {
      const a = audioRef.current
      if (a) kick(a.ctx, a.classicBus, a.ctx.currentTime + 0.02)
    }, beatSec * 1000)
    return () => clearInterval(id)
  }, [playing, exiting, classic, beatSec])

  useEffect(() => {
    const a = audioRef.current
    if (!playing || exiting || !a) return
    const { ctx, master, noise, classicBus, newBus, arpIn } = a
    const t = ctx.currentTime + 0.02

    classicBus.gain.setTargetAtTime(classic ? CLASSIC_LEVEL : 0, ctx.currentTime, classic ? 0.12 : 0.04)
    newBus.gain.setTargetAtTime(classic ? 0 : NEW_LEVEL, ctx.currentTime, 0.12)

    if (glitch) {
      const s = sceneMs / 1000
      blip(ctx, master, noise, t + s * 0.31)
      blip(ctx, master, noise, t + s * 0.56)
    }

    if (classic) {
      impact(ctx, classicBus, noise, t)
      return
    }

    const chord = CHORDS[sceneIndex]
    if (!chord) return
    const sixteenth = beatSec / 4
    whoosh(ctx, newBus, noise, t)
    pad(ctx, newBus, chord, t, sceneMs / 1000 + 0.4)

    const pool = [...chord, ...chord.map((n) => n * 2)]
    ARP_PATTERN.forEach((idx, i) => {
      const when = t + i * sixteenth
      synthNote(ctx, arpIn, pool[idx], when, i % 4 === 0 ? 1 : 0.65)
      if (CHIRP_STEPS.has(i)) chirp(ctx, arpIn, when + sixteenth / 2)
    })

    for (let i = 0; i < 8; i++) hat(ctx, newBus, noise, t + i * beatSec / 2, i % 2 === 1)
    clap(ctx, newBus, noise, t + beatSec)
    clap(ctx, newBus, noise, t + beatSec * 3)
  }, [sceneIndex, playing, exiting, glitch, classic, sceneMs, beatSec])

  useEffect(() => {
    const a = audioRef.current
    if (!exiting || !a) return
    a.master.gain.cancelScheduledValues(a.ctx.currentTime)
    a.master.gain.setTargetAtTime(0, a.ctx.currentTime, fadeOutMs / 1000 / 4)
  }, [exiting, fadeOutMs])

  return { playing }
}

function kick(ctx, out, t) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.setValueAtTime(110, t)
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.35)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.55, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
  osc.connect(gain).connect(out)
  osc.start(t)
  osc.stop(t + 0.55)
}

function impact(ctx, out, noise, t) {
  const boom = ctx.createOscillator()
  const boomGain = ctx.createGain()
  boom.frequency.setValueAtTime(70, t)
  boom.frequency.exponentialRampToValueAtTime(28, t + 1.4)
  boomGain.gain.setValueAtTime(0.0001, t)
  boomGain.gain.exponentialRampToValueAtTime(0.7, t + 0.02)
  boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6)
  boom.connect(boomGain).connect(out)
  boom.start(t)
  boom.stop(t + 1.7)

  const src = ctx.createBufferSource()
  src.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.8
  filter.frequency.setValueAtTime(300, t)
  filter.frequency.exponentialRampToValueAtTime(2400, t + 0.6)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
  src.connect(filter).connect(g).connect(out)
  src.start(t)
  src.stop(t + 1)
}

function pad(ctx, out, freqs, t, dur) {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1800
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.07, t + 0.7)
  gain.gain.setValueAtTime(0.07, t + dur - 0.9)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  filter.connect(gain).connect(out)
  freqs.forEach((f) => {
    for (const detune of [-8, 8]) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      osc.detune.value = detune
      osc.connect(filter)
      osc.start(t)
      osc.stop(t + dur + 0.05)
    }
  })
}

function synthNote(ctx, out, freq, t, level) {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 7
  filter.frequency.setValueAtTime(3400, t)
  filter.frequency.exponentialRampToValueAtTime(600, t + 0.18)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.13 * level, t + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  filter.connect(gain).connect(out)
  for (const detune of [-7, 7]) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    osc.detune.value = detune
    osc.connect(filter)
    osc.start(t)
    osc.stop(t + 0.22)
  }
}

function chirp(ctx, out, t) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(1760, t)
  osc.frequency.setValueAtTime(2637, t + 0.035)
  gain.gain.setValueAtTime(0.045, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
  osc.connect(gain).connect(out)
  osc.start(t)
  osc.stop(t + 0.09)
}

function hat(ctx, out, noise, t, open) {
  const src = ctx.createBufferSource()
  src.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 7000
  const g = ctx.createGain()
  const dur = open ? 0.16 : 0.04
  g.gain.setValueAtTime(open ? 0.07 : 0.05, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(g).connect(out)
  src.start(t, Math.random() * 0.5)
  src.stop(t + dur + 0.02)
}

function clap(ctx, out, noise, t) {
  const src = ctx.createBufferSource()
  src.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1800
  filter.Q.value = 0.9
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.14, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
  src.connect(filter).connect(g).connect(out)
  src.start(t, Math.random() * 0.5)
  src.stop(t + 0.16)
}

function whoosh(ctx, out, noise, t) {
  const src = ctx.createBufferSource()
  src.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.9
  filter.frequency.setValueAtTime(400, t)
  filter.frequency.exponentialRampToValueAtTime(3000, t + 0.5)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.25)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
  src.connect(filter).connect(g).connect(out)
  src.start(t)
  src.stop(t + 0.8)
}

function blip(ctx, out, noise, t) {
  for (const offset of [0, 0.045]) {
    const src = ctx.createBufferSource()
    src.buffer = noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 3000
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.18, t + offset)
    g.gain.setValueAtTime(0, t + offset + 0.03)
    src.connect(filter).connect(g).connect(out)
    src.start(t + offset, Math.random() * 0.5)
    src.stop(t + offset + 0.04)
  }
}
