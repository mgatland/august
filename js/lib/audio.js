'use strict'
import { AudioSampleLoader } from './AudioSampleLoader.js'

const audioCtx = new AudioContext()
let lastPlayedTimes = new Map()
// const gainNode = audioCtx.createGain()
// gainNode.connect(audioCtx.destination)

const loader = new AudioSampleLoader()

// todo: use this good hurt\kill pair: 'audio/bullet_impact_body_thump_02.wav'\'audio/bullet_impact_ice_06.wav'

loader.src = ['audio/bullet_impact_ice_06.mp3',
  'audio/Hand-to-Hand Combat - Body Hits - Deep Punch 02.mp3',
  'audio/msfx_explosion_1_explode.mp3',
  'audio/Gasp_Quick_Female_KB_04_SCREAM LIBRARY_BRFX-004.mp3',
  'audio/Grunt_Pain_Male_BB_10_SCREAM LIBRARY_BRFX-004.mp3',
  'audio/Monster_Pain_Death_121.mp3',
  'audio/ScreamsShouts2_Humans_Female_shout-of-pain_154.mp3',
  'audio/Male_Shout-of-Pain_132.mp3',
  'audio/G4F SFX05 - Casual - SLO sfx_unlock_level_02.mp3',
  'audio/SFX-ARCADIA_Error03.mp3',
  'audio/collect_item_hurry_out_of_time_01.mp3'
]
// unused
// old player shoot sound
// 'audio/CK_Blaster_Shot-226.mp3',
// additional pain sound: 'audio/ScreamsShouts2_Humans_Female_shout-of-pain_028.mp3',

loader.ctx = audioCtx
loader.onload = function () {
  const samples = loader.response
  audios.killSound = () => playSound(samples[0], 0.1)
  audios.playHitSound = () => playSound(samples[1], 0.1)
  audios.playShootSound = () => playSound(samples[2], 0.2)
  audios.playerHit1 = () => playSound(samples[3], 0.1)
  audios.playerHit2 = () => playSound(samples[4], 0.1)
  audios.bossKillSound = () => playSound(samples[5], 0.1)
  audios.playerDead1 = () => playSound(samples[6], 0.1)
  audios.playerDead2 = () => playSound(samples[7], 0.1)
  audios.levelUp = () => playSound(samples[8], 0.1)
  audios.abilityFailed = () => playSound(samples[9], 0.2)
  audios.pickup = () => playSound(samples[10], 0.2)
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
