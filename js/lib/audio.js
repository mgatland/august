'use strict'
import { AudioSampleLoader } from './AudioSampleLoader.js'

const audioCtx = new AudioContext()
let lastPlayedTimes = new Map()

const loader = new AudioSampleLoader()

loader.src = [
  'audio/Hand-to-Hand Combat - Body Hits - Deep Punch 02.mp3',
]

loader.ctx = audioCtx
loader.onload = function () {
  const samples = loader.response
  audios.playHitSound = () => playSound(samples[0], 0.1)
}
loader.send()

function playSound (sound, volume) {
  if (window.audioLevel === 'off') volume = 0
  // prevent double-ups in a single frame
  const lastPlayed = lastPlayedTimes.get(sound)
  const now = new Date()
  if (lastPlayed && now - lastPlayed < 15) return
  lastPlayedTimes.set(sound, now)

  const source = audioCtx.createBufferSource()
  source.buffer = sound

  const gain = audioCtx.createGain()
  gain.gain.value = volume

  source.connect(gain)
  gain.connect(audioCtx.destination)
  source.start()
}

const audios = {}

export default audios
