'use strict'
/* eslint-disable no-console */
import shadowTiles from './lib/shadowtiles.js'
import audio from './lib/audio.js'
import Renderer from './superFast.js'

const loadingPageEl = document.querySelector('.page-loading')
const gamePageEl = document.querySelector('.page-game')
const mainMenuEl = document.querySelector('.page-main-menu')
const playButtonEl = document.querySelector('.playButton')

const audioToggleEl = document.querySelector('.audioToggle')

const canvasEl = document.querySelector('.gameCanvas')
const glCanvasEl = document.querySelector('.glCanvas')

let musicLoaded = false

const bigFont = '28px "Press Start 2P"'
const midFont = '14px "Press Start 2P"'
const smallFont = '7px "Press Start 2P"'

const renderer = new Renderer()

// represents the part of the canvas that displays the game world
const viewSize = { x: 0, y: 0 }
const screenSize = { x: 0, y: 0 }
let viewScale = 1

const defaultSidebarWidth = 350
let sidebarWidth = 0

const ctx = canvasEl.getContext('2d')
ctx.imageSmoothingEnabled = false

let currentPage = loadingPageEl

function resize () {
  canvasEl.width = document.body.clientWidth
  canvasEl.height = document.body.clientHeight
  glCanvasEl.width = canvasEl.width
  glCanvasEl.height = canvasEl.height
  sidebarWidth = defaultSidebarWidth
  screenSize.x = canvasEl.width
  screenSize.y = canvasEl.height
  viewSize.x = screenSize.x - sidebarWidth
  viewSize.y = screenSize.y
  ctx.imageSmoothingEnabled = false
  let scale = 1
  viewScale = 1 / scale
  // showing ${viewSize.x / viewScale / shared.baseScale}x${viewSize.y / viewScale / shared.baseScale}`)
  renderer.resize(viewSize, viewScale)
}
window.addEventListener('resize', resize)
resize()

function changePage (mode) {
  if (currentPage === mode) return
  currentPage = mode
  console.log('change page to ' + mode)
  showHideEl(loadingPageEl, mode === 'loading')
  showHideEl(mainMenuEl, mode === 'mainMenu')
  showHideEl(gamePageEl, mode === 'game')
}

const mousePos = { x: 0, y: 0 }

shadowTiles.init(renderer)

// client settings
const keyMappings = new Map([
  ['arrowup', 'Up'], ['arrowdown', 'Down'], ['arrowleft', 'Left'], ['arrowright', 'Right'],
  ['w', 'Up'], ['s', 'Down'], ['a', 'Left'], ['d', 'Right'], [' ', 'UseAbility'],
  ['r', 'Disconnect'], ['escape', 'Disconnect'], ['i', 'AutoFire']])

const preventDefaultKeys = ['arrowup', 'arrowleft', 'arrowright', 'arrowdown', ' ']

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
  changePage('game')
  audio.playHitSound() // to enable audio
  updateMusic()
})

const keysDown = {}
const keysHit = {}

window.addEventListener('keydown', function (e) {
  // todo: fix key (and mouse) hit and released within a single frame
  if (e.repeat) return
  const keyCode = e.key.toLowerCase()
  this.console.log(keyCode)
  if (keyMappings.has(keyCode)) {
    if (!keysDown[keyMappings.get(keyCode)]) {
      keysHit[keyMappings.get(keyCode)] = true
    }
    keysDown[keyMappings.get(keyCode)] = true

    // We want to prevent arrow keys and spacebar from scrolling the page
    // However we must not prevent anything if the user is typing in an input!
    if (e.target.tagName === 'BODY' && preventDefaultKeys.indexOf(keyCode) >= 0) {
      e.preventDefault()
    }
  }
})

window.addEventListener('keyup', function (e) {
  const keyCode = e.key.toLowerCase()
  if (keyMappings.has(keyCode)) {
    keysDown[keyMappings.get(keyCode)] = false
  }
})

window.addEventListener('mousedown', function (e) {
  keysDown['mouse'] = true
})

window.addEventListener('mouseup', function (e) {
  keysDown['mouse'] = false
})

document.addEventListener('contextmenu', function (e) {
  if (mousePos.x < canvasEl.width - sidebarWidth) {
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

requestAnimationFrame(tick)

function tick (what) {
  const isBackgroundTick = (what === 'background')
  if (!isBackgroundTick) requestAnimationFrame(tick)
}

changePage('mainMenu')

const worldSize = 100
const world = [].repeat(worldSize).map(x => [].repeat(worldSize))

const camera = { x: 50, y: 50}

const viewPort = {}
const tileSize = 40
viewPort.x = camera.x * tileSize - canvasEl.width / 2
viewPort.y = camera.y * tileSize - canvasEl.height / 2
viewPort.width = canvasEl.width
viewPort.height = canvasEl.height

shadowTiles.draw(viewPort, world, renderer)
