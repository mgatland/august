'use strict'
/* eslint-disable no-console */
import shadowTiles from './lib/shadowtiles.js'
import audio from './lib/audio.js'
import Renderer from './superFast.js'

const loadingPageEl = document.querySelector('.page-loading')
const gamePageEl = document.querySelector('.page-game')
const mainMenuEl = document.querySelector('.page-main-menu')
const playButtonEl = document.querySelector('.playButton')
const restartButtonEl = document.querySelector('.restartButton')

const audioToggleEl = document.querySelector('.audioToggle')

const canvasEl = document.querySelector('.gameCanvas')
const glCanvasEl = document.querySelector('.glCanvas')

let musicLoaded = false

const renderer = new Renderer()

// represents the part of the canvas that displays the game world
const viewSize = { x: 0, y: 0 }
const screenSize = { x: 0, y: 0 }
let viewScale = 1

const words = `
hello world time to save the world from trouble and prepare to make it double 
the canvas provides a way to render artwork but not at high speeds unless you
use accelerated graphics instead but performance can be an issue with high framerate
until you optimise and send less data to the graphics card efficiently
`.replace(/[\n]/g, ' ').split(' ').filter(x => x.length > 0)

const ctx = canvasEl.getContext('2d')
ctx.imageSmoothingEnabled = false
const creatureFont = '32px "Lucida Console", Monaco, monospace'

let currentPage = loadingPageEl

function resize () {
  canvasEl.width = document.body.clientWidth
  canvasEl.height = document.body.clientHeight
  glCanvasEl.width = canvasEl.width
  glCanvasEl.height = canvasEl.height
  screenSize.x = canvasEl.width
  screenSize.y = canvasEl.height
  viewSize.x = screenSize.x
  viewSize.y = screenSize.y
  ctx.imageSmoothingEnabled = false
  viewScale = 1
  // showing ${viewSize.x / viewScale / shared.baseScale}x${viewSize.y / viewScale / shared.baseScale}`)
  renderer.resize(viewSize, viewScale)
}
window.addEventListener('resize', resize)
resize()

function changePage (mode) {
  if (currentPage === mode) return
  currentPage = mode
  showHideEl(loadingPageEl, mode === 'loading')
  showHideEl(mainMenuEl, mode === 'mainMenu')
  showHideEl(gamePageEl, mode === 'game')
}

const mousePos = { x: 0, y: 0 }

shadowTiles.init(renderer)

const preventDefaultKeys = ['backspace', 'tab', 'enter']

function showHideEl (el, show) {
  if (show) showEl(el)
  else hideEl(el)
}

function hideEl (el) {
  el.classList.add('hidden')
}

function showEl (el) {
  el.classList.remove('hidden')
}

const audioLevels = ['on', 'noMusic', 'off']
window.audioLevel = audioLevels[0]

audioToggleEl.addEventListener('click', function () {
  window.audioLevel = audioLevels[(audioLevels.indexOf(window.audioLevel) + 1) % audioLevels.length]
  audioToggleEl.classList.toggle('off', window.audioLevel === 'off')
  audioToggleEl.classList.toggle('noMusic', window.audioLevel === 'noMusic')
  updateMusic()
})

function updateMusic () {
  const shouldHaveMusic = window.audioLevel === 'on'
  if (!musicLoaded && !shouldHaveMusic) {
    // do nothing
  }
  if (!musicLoaded && shouldHaveMusic) {
    musicLoaded = true
    // var song = new Audio('audio/test-music.mp3')
    // song.loop = true
    // song.volume = 0.08
    // document.body.appendChild(song)
    // song.play()
  }
  if (musicLoaded && shouldHaveMusic) {
    // const song = document.querySelector('audio')
    // song.play()
  }
  if (musicLoaded && !shouldHaveMusic) {
    // const song = document.querySelector('audio')
    // song.pause()
  }
}

playButtonEl.addEventListener('click', function () {
  restart()
  changePage('game')
  audio.playHitSound() // to enable audio
  updateMusic()
})

restartButtonEl.addEventListener('click', restart)

const keysDown = {}
const keysHit = {}

window.addEventListener('keydown', function (e) {
  // todo: fix key (and mouse) hit and released within a single frame
  if (e.repeat) return
  const keyCode = e.key.toLowerCase()
  // We want to prevent arrow keys and spacebar from scrolling the page
  // However we must not prevent anything if the user is typing in an input!
  if (e.target.tagName === 'BODY' && preventDefaultKeys.indexOf(keyCode) >= 0) {
    e.preventDefault()
  }
  keysHit[keyCode] = true
  keysDown[keyCode] = true
})

window.addEventListener('keyup', function (e) {
  const keyCode = e.key.toLowerCase()
  keysDown[keyCode] = false
})

window.addEventListener('mousedown', function (e) {
  keysDown['mouse'] = true
})

window.addEventListener('mouseup', function (e) {
  keysDown['mouse'] = false
})

document.addEventListener('contextmenu', function (e) {
  if (mousePos.x < canvasEl.width) {
    e.preventDefault()
  }
})

window.addEventListener('mousemove', function (e) {
  // performance: assume canvas is always maximized
  // const rect = canvasEl.getBoundingClientRect()
  const x = e.pageX // - rect.left
  const y = e.pageY // - rect.top
  mousePos.x = x * canvasEl.width / canvasEl.offsetWidth
  mousePos.y = y * canvasEl.height / canvasEl.offsetHeight
})

function tick () {
  requestAnimationFrame(tick)
  update()
  draw()
}

function lerp (a, b) {
  return (a * 0.95 + b * 0.05)
}

changePage('mainMenu')

const worldSize = 100
const world = new Array(worldSize).fill(0).map(x => new Array(worldSize).fill(0))
const explosionRange = 200

for (let x = 0; x < world.length; x++) {
  for (let y = 0; y < world.length; y++) {
    world[x][y] = Math.random() > 0.5 ? 0 : 1
  }
}

class Attacker {
  constructor (isSpecial) {
    const isBad = (wasLastGood && Math.random() > 0.5)
    const isRescuer = (!wasLastGood && !isSpecial)
    const worstLetter = secretKeeper ? secretKeeper.text[secretKeeper.progress] : undefined
    let goodWords = words.filter(w => !w.includes(worstLetter))
    if (isBad) {
      goodWords = words.filter(w => !goodWords.includes(w))
    }
    if (goodWords.length === 0) goodWords = words // safety check
    this.text = pickRandom(goodWords)
    this.progress = 0
    this.x = -400
    this.y = -400
    this.xv = 0
    this.yv = 0
    let angle = Math.random() * Math.PI * 2
    if (isRescuer) {
      angle = lastAngle + Math.random() * Math.PI / 2 - Math.PI / 4
    }
    const distance = Math.random() * 200 + 600
    this.x = Math.cos(angle) * distance
    this.y = Math.sin(angle) * distance
    if (isSpecial) {
      this.isSpecial = true
      this.x = 0
      this.y = 300
      this.text = 'type this to lose'
    } else {
      lastAngle = angle
      wasLastGood = !isBad
    }
  }
}

function addAttacker (opts) {
  const newAttacker = new Attacker(opts)
  attackers.push(newAttacker)
  return newAttacker
}

let attackDelay
let minAttackDelay = 60
let attackTimer
let score

let lastAngle
let wasLastGood

let attackerSpeed
let maxAttackerSpeed = 0.6

const camera = { x: 0, y: 0 }
const player = { x: 0, y: 0 }
const attackers = []
const explosions = []
let secretKeeper

function draw () {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  const viewPort = {}
  viewPort.x = camera.x - canvasEl.width / 2
  viewPort.y = camera.y - canvasEl.height / 2
  viewPort.width = canvasEl.width
  viewPort.height = canvasEl.height

  // shadowTiles.draw(viewPort, world)
  drawThing('lilppl0', player)
  for (const a of attackers) {
    drawThing(a.isSpecial ? '' : 'lilppl1', a)
    drawText(a)
  }
  for (const e of explosions) {
    drawExplosion(e)
  }
  drawScore()
  renderer.moveCamera(camera)
  renderer.render()
  renderer.resetSprites()
}

function drawThing (name, pos) {
  renderer.addSprite(name, 4, { x: pos.x, y: pos.y })
}

function drawExplosion (e) {
  ctx.fillStyle = 'white'
  const { x, y } = drawPos(e)
  ctx.beginPath()
  ctx.arc(x, y, e.isKeeper ? 50 : explosionRange, 0, Math.PI * 2)
  if (e.isOutline) {
    ctx.stroke()
  } else if (e.isKeeper) {
    ctx.fillStyle = 'red'
    ctx.fill()
  } else {
    ctx.fill()
  }
}

function drawPos (pos) {
  const x = pos.x - camera.x + screenSize.x / 2
  const y = pos.y - camera.y + screenSize.y / 2
  return { x, y }
}

function drawText (creature) {
  ctx.font = creatureFont
  const textSize = ctx.measureText(creature.text)
  let { x, y } = drawPos(creature)
  x -= textSize.width / 2
  y -= 32
  ctx.fillStyle = 'white'
  ctx.fillText(creature.text, x, y)
  ctx.fillStyle = 'black'
  ctx.fillText(creature.text.substr(0, creature.progress), x, y)
}

function drawScore () {
  ctx.fillStyle = 'white'
  ctx.fillText('score: ' + score, canvasEl.width / 2, canvasEl.height - 40)
}

function restart () {
  score = 0
  player.dead = false
  attackers.length = 0
  attackDelay = 60 * 3
  attackTimer = 60
  attackerSpeed = 0.3
  secretKeeper = addAttacker(true)
  explosions.length = 0
  restartButtonEl.classList.add('hidden')
  lastAngle = 0
  wasLastGood = false
}

function update () {
  if (player.dead) return
  attackTimer--
  if (attackTimer === 0) {
    addAttacker()
    attackDelay = Math.floor(attackDelay * 0.95) + 1
    attackDelay = Math.max(minAttackDelay, attackDelay)
    attackerSpeed = attackerSpeed * 1.01
    attackerSpeed = Math.min(attackerSpeed, maxAttackerSpeed)
    attackTimer = attackDelay
  }

  for (const a of attackers) {
    if (!a.isSpecial) {
      if (!a.dead) {
        const angle = angleTo(a, player)
        const dX = Math.cos(angle) * attackerSpeed
        const dY = Math.sin(angle) * attackerSpeed
        a.x += dX
        a.y += dY

        const dist = distance(a, player)
        if (dist < 3 && !player.dead) {
          endGame()
        }
      } else {
        a.y += 5
      }
    }
    const nextLetter = a.text[a.progress]
    if (keysHit[nextLetter]) {
      a.progress++
      // skip spaces
      if (a.text[a.progress] === ' ') a.progress++
      if (a.progress === a.text.length) {
        if (!a.dead) score++
        a.dead = true
        if (a.isSpecial) {
          endGame()
        } else {
          explode(a)
        }

      } else {
        if (a.isSpecial) {
          explosions.push(new Explosion(a, 'keeper'))
        } else {
          explosions.push(new Explosion(a, 'outline'))
        }
      }
    }
  }
  filterInPlace(attackers, (a) => a.y < 1000)
  for (const key in keysHit) keysHit[key] = false
  camera.x = lerp(camera.x, player.x)
  camera.y = lerp(camera.y, player.y)

  for (const e of explosions) {
    e.age++
    if (e.age > e.maxAge) e.dead = true
  }
  filterInPlace(explosions, e => !e.dead)
}

function endGame () {
  player.dead = true
  restartButtonEl.classList.remove('hidden')
}

function explode (a) {
  const targets = attackers.filter(x => distance(a, x) < explosionRange)
  for (const t of targets) {
    if (!t.dead && !t.isSpecial) {
      t.dead = true
      score++
    }
  }
  explosions.push(new Explosion(a, 'big'))
}

class Explosion {
  constructor (pos, type) {
    this.x = pos.x
    this.y = pos.y
    this.age = 0
    this.maxAge = type === 'outline' ? 3 : 15
    if (type === 'keeper') this.maxAge = 4
    this.isOutline = type === 'outline'
    this.isKeeper = type === 'keeper'
  }
}

// https://stackoverflow.com/questions/37318808/what-is-the-in-place-alternative-to-array-prototype-filter
function filterInPlace (a, condition) {
  let i = 0
  let j = 0

  while (i < a.length) {
    const val = a[i]
    if (condition(val, i, a)) a[j++] = val
    i++
  }
  a.length = j
  return a
}

function distance (a, b) {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return Math.sqrt(dx * dx + dy * dy)
}

function angleTo (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function pickRandom (list) {
  return list[Math.floor(Math.random() * list.length)]
}

secretKeeper = addAttacker(true)
requestAnimationFrame(tick)