import './lib/three.js'

const shared = { baseScale: 1 }

const textureLoader = new THREE.TextureLoader()

const maxSprites = 3000 // stress test: 800000

const spriteTypes = new Map()

function rotate (cx, cy, x, y, angle) {
  const radians = angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
  const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
  return [nx, ny]
}

const tileSpriteSize = { x: 16, y: 16 }
const tileSpritesToLoad = [ 'Plain Block', 'Stone Block', 'Dirt Block', 'Grass Block', 'Wood Block',
  'Wall Block',
  'Water Block',
  'Shadow North', 'Shadow East', 'Shadow South', 'Shadow West',
  'Shadow North East', 'Shadow South East', 'Shadow South West', 'Shadow North West',
  'Shadow Side West',
  'Wall Front', 'Grass2 Block']

function defineSprite (spriteDefinition) {
  spriteDefinition.xOff = spriteDefinition.xOff === undefined ? 0 : spriteDefinition.xOff
  spriteDefinition.yOff = spriteDefinition.yOff === undefined ? 0 : spriteDefinition.yOff

  if (spriteDefinition.sheet === 'duck') {
    spriteDefinition.y += 256
  }
  if (spriteDefinition.sheet === 'bullets') {
    spriteDefinition.x += 256
    spriteDefinition.y += 256
  }
  if (spriteDefinition.sheet === 'lilppl') {
    spriteDefinition.y += 245
  }

  spriteDefinition.width = spriteDefinition.w
  spriteDefinition.height = spriteDefinition.h

  spriteTypes.set(spriteDefinition.name, spriteDefinition)
}

defineSprites()
function defineSprites () {
  defineSprite({ name: 'test', sheet: 'duck', x: 4, y: 4, w: 2, h: 2 })
  defineSprite({ name: 'duckWhite', sheet: 'duck', x: 0, y: 18 * 0, w: 16, h: 18 })
  defineSprite({ name: 'duckBlue', sheet: 'duck', x: 0, y: 18 * 1, w: 16, h: 18 })
  defineSprite({ name: 'duckPurple', sheet: 'duck', x: 0, y: 18 * 5, w: 16, h: 18 })
  defineSprite({ name: 'ghost', sheet: 'duck', x: 62, y: 18 * 0, w: 16, h: 18 })
  defineSprite({ name: 'fox', sheet: 'duck', x: 78, y: 18 * 0, w: 16, h: 18 })
  defineSprite({ name: 'bag', sheet: 'duck', x: 0, y: 18 * 6, w: 16, h: 18 })
  defineSprite({ name: 'shadow', sheet: 'duck', x: 0, y: 55, w: 9, h: 3 })
  defineSprite({ name: 'snake', sheet: 'duck', x: 121, y: 0, w: 24, h: 35 })
  defineSprite({ name: 'cyclops', sheet: 'duck', x: 145, y: 0, w: 16, h: 16 })
  defineSprite({ name: 'wight', sheet: 'duck', x: 161, y: 0, w: 16, h: 16 })
  defineSprite({ name: 'thinker', sheet: 'duck', x: 177, y: 0, w: 15, h: 16 })

  let tempX = 0
  for (let tileSprite of tileSpritesToLoad) {
    defineSprite({ name: tileSprite,
      sheet: 'tiles',
      x: tempX,
      y: 0,
      w: tileSpriteSize.x,
      h: tileSpriteSize.y,
      xOff: 0,
      yOff: 0 })
    tempX += 16
  }
  defineSprite({ name: 'smallRedFireball', sheet: 'bullets', x: 90, y: 54, w: 20, h: 7, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallBlueFireball', sheet: 'bullets', x: 90, y: 63, w: 20, h: 7, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallRed', sheet: 'bullets', x: 1, y: 217, w: 14, h: 3, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallBlue', sheet: 'bullets', x: 2, y: 225, w: 12, h: 6, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallYellow', sheet: 'bullets', x: 1, y: 209, w: 14, h: 7, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallPurple', sheet: 'bullets', x: 1, y: 201, w: 14, h: 7, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'smallGrey', sheet: 'bullets', x: 1, y: 193, w: 14, h: 7, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'bigGreen', sheet: 'bullets', x: 65, y: 21, w: 20, h: 10, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'cyclopsShot', sheet: 'bullets', x: 68, y: 206, w: 18, h: 18, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'wightShot', sheet: 'bullets', x: 2, y: 237, w: 17, h: 17, xOff: 0.5, yOff: 0.5 })
  defineSprite({ name: 'thinkerShot', sheet: 'bullets', x: 48, y: 206, w: 18, h: 18, xOff: 0.5, yOff: 0.5 })

  defineSprite({ name: 'lilppl0', sheet: 'lilppl', x: 0, y: 0, w: 10, h: 10 })
  defineSprite({ name: 'lilppl1', sheet: 'lilppl', x: 10, y: 0, w: 10, h: 10 })
  defineSprite({ name: 'lilppl2', sheet: 'lilppl', x: 20, y: 0, w: 10, h: 10 })
  defineSprite({ name: 'lilppl3', sheet: 'lilppl', x: 30, y: 0, w: 10, h: 10 })
  defineSprite({ name: 'lilppl4', sheet: 'lilppl', x: 40, y: 0, w: 10, h: 10 })
}

class SpriteList {
  constructor (sheetName, scene, camera, maxSprites) {
    this.maxSprites = maxSprites
    this.camera = camera
    const geometry = new THREE.Geometry()
    const map = textureLoader.load(`art/${sheetName}.png`, () => {
      this.spriteSheetSize = { x: map.image.width, y: map.image.height }

      this.geometry = geometry
      const duckWidth = 16
      const duckHeight = 18

      for (let i = 0; i < this.maxSprites; i++) {
        const x = 0
        const y = 0
        const scale = 3
        this.addPlaceholderSprite(x, y, 0, duckWidth * scale, duckHeight * scale, duckWidth * 0, duckHeight * 0, duckWidth, duckHeight)
      }

      const bg = new THREE.BufferGeometry()
      bg.fromGeometry(geometry)
      const mesh = new THREE.Mesh(bg, material)
      mesh.position.set(0, 0, 0)
      mesh.frustumCulled = false // otherwise sprites disappear when camera scrolls away from origin!
      scene.add(mesh)
      this.geometry = bg
      bg.attributes.position.dynamic = true // use glBufferSubData for updates
      bg.attributes.uv.dynamic = true
      // bg.attributes.color.dynamic = true
    })

    const material = new THREE.MeshBasicMaterial({ 
      map: map,
      transparent: true,
      depthTest: true,
      alphaTest: 0.1
    })
    material.map.magFilter = THREE.NearestFilter

    this.currentSprite = 0
  }
  addPlaceholderSprite (x, y, z, width, height, tX, tY, tWidth, tHeight) {
    x = Math.floor(x)
    y = Math.floor(y)
    // fix blurring caused by even\non even screen width and height
    // if (fixX) x = x + 0.5
    // if (fixY) y = y + 0.5

    const imageSize = { width, height }
    const coords = { x, y, z }
    const src = this.getSpriteData(tX, tY, tWidth, tHeight)

    const geometry = this.geometry
    const vertices = this.geometry.vertices

    vertices.push(new THREE.Vector3(coords.x, coords.y, coords.z)) // top left -4
    vertices.push(new THREE.Vector3(coords.x + imageSize.width, coords.y, coords.z)) // top right -3
    vertices.push(new THREE.Vector3(coords.x + imageSize.width, coords.y + imageSize.height, coords.z)) // bottom right -2
    vertices.push(new THREE.Vector3(coords.x, coords.y + imageSize.height, coords.z)) // bottom left -1

    const faceOne = new THREE.Face3(
      geometry.vertices.length - 4,
      geometry.vertices.length - 2,
      geometry.vertices.length - 3
    )

    const faceTwo = new THREE.Face3(
      geometry.vertices.length - 4,
      geometry.vertices.length - 1,
      geometry.vertices.length - 2
    )

    geometry.faces.push(faceOne, faceTwo)

    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(src.x, src.y + src.height),
      new THREE.Vector2(src.x + src.width, src.y),
      new THREE.Vector2(src.x + src.width, src.y + src.height)
    ])

    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(src.x, src.y + src.height),
      new THREE.Vector2(src.x, src.y),
      new THREE.Vector2(src.x + src.width, src.y)
    ])
  }
  getSpriteData (x, y, width, height) {
    const spriteSheetSize = this.spriteSheetSize
    const src = { x: x / spriteSheetSize.x, y: y / spriteSheetSize.y, width: width / spriteSheetSize.x, height: height / spriteSheetSize.y }
    src.y = (1 - src.height - src.y)
    return src
  }
  reset () {
    this.currentSprite = 0
    this.geometry.setDrawRange(0, 0)
  }
  addSprite (spriteName, scale, pos, height = 0, options = {}) {
    const cameraTop = this.camera.position.y + this.camera.top
    const cameraHeight = this.camera.bottom - this.camera.top

    const def = spriteTypes.get(spriteName)
    const spriteData = this.getSpriteData(def.x, def.y, def.w, def.h, this.spriteSheetSize)
    if (!spriteData) {
      return false
    }
    if (this.currentSprite >= this.maxSprites) {
      return // too many sprites!
    }

    let z = (options.depth === undefined) ? pos.y : options.depth
    z /= shared.baseScale
    z -= cameraTop
    z = z * 900 / cameraHeight

    let n = this.currentSprite * 18
    const halfSize = { x: def.w * scale * shared.baseScale / 2, y: def.h * scale * shared.baseScale / 2 }
    pos = { x: pos.x - halfSize.x * (def.xOff - 0.5) * 2, y: pos.y - height - halfSize.y * (def.yOff - 0.5) * 2 }
    pos.x = Math.floor(pos.x / shared.baseScale) * shared.baseScale
    pos.y = Math.floor(pos.y / shared.baseScale) * shared.baseScale

    const positions = this.geometry.attributes.position.array

    function addPosition (x, y, z = 0) {
      positions[n++] = x / shared.baseScale
      positions[n++] = y / shared.baseScale
      positions[n++] = 0
    }
    let leftP = pos.x - halfSize.x
    let rightP = pos.x + halfSize.x
    let topP = pos.y - halfSize.y
    let bottomP = pos.y + halfSize.y

    if (options.angle) {
      const angle = -options.angle
      let [topLeftX, topLeftY] = rotate(pos.x, pos.y, leftP, topP, angle)
      let [bottomLeftX, bottomLeftY] = rotate(pos.x, pos.y, leftP, bottomP, angle)
      let [topRightX, topRightY] = rotate(pos.x, pos.y, rightP, topP, angle)
      let [bottomRightX, bottomRightY] = rotate(pos.x, pos.y, rightP, bottomP, angle)

      addPosition(topLeftX, topLeftY, z)
      addPosition(bottomRightX, bottomRightY, z)
      addPosition(topRightX, topRightY, z)

      addPosition(topLeftX, topLeftY, z)
      addPosition(bottomLeftX, bottomLeftY, z)
      addPosition(bottomRightX, bottomRightY, z)
    } else {
      addPosition(leftP, topP, z)
      addPosition(rightP, bottomP, z)
      addPosition(rightP, topP, z)

      addPosition(leftP, topP, z)
      addPosition(leftP, bottomP, z)
      addPosition(rightP, bottomP, z)
    }

    this.geometry.attributes.position.needsUpdate = true

    const uv = this.geometry.attributes.uv.array
    n = this.currentSprite * 12

    function addUv (u, v) {
      uv[n++] = u
      uv[n++] = v
    }

    let left = spriteData.x
    let right = spriteData.x + spriteData.width
    const top = spriteData.y
    const bottom = spriteData.y + spriteData.height
    if (options.flipped) {
      [left, right] = [right, left]
    }
    addUv(left, bottom)
    addUv(right, top)
    addUv(right, bottom)
    addUv(left, bottom)
    addUv(left, top)
    addUv(right, top)

    this.geometry.attributes.uv.needsUpdate = true

    /* n = this.currentSprite * 12
    const color = this.geometry.attributes.color.array
    for (let i = 0; i < 12; i++) {
      color[n + i] = Math.random()
    }
    this.geometry.attributes.color.needsUpdate = true */

    this.currentSprite++
    this.geometry.attributes.position.updateRange.count = this.currentSprite * 18
    this.geometry.attributes.uv.updateRange.count = this.currentSprite * 12
    this.geometry.setDrawRange(0, this.currentSprite * 6)
  }
}

export default class Renderer {
  constructor (netGraphSize) {
    if (WEBGL.isWebGL2Available() === false) {
      alert(WEBGL.getWebGL2ErrorMessage())
    }

    const scene = new THREE.Scene()

    const width = window.innerWidth
    const height = window.innerHeight
    // let fixX = false // (width % 2 !== 0)
    // let fixY = false // (height % 2 !== 0)
    const nearPlane = -1000
    const farPlane = 100
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2, nearPlane, farPlane)
    this.camera = camera
    window.camera = camera

    const canvas = document.querySelector('.glCanvas')
    const context = canvas.getContext('webgl2')
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context })
    renderer.setSize(window.innerWidth, window.innerHeight, false)

    this.mainSprites = new SpriteList('spritesheet', scene, camera, maxSprites)
    this.renderer = renderer
    this.scene = scene
    this.canvas = canvas
  }
  render () {
    this.renderer.render(this.scene, this.camera)
  }
  resetSprites () {
    this.mainSprites.reset()
  }
  moveCamera (center) {
    this.camera.position.x = Math.floor(center.x / shared.baseScale)
    this.camera.position.y = Math.floor(center.y / shared.baseScale)
  }
  resize (viewSize, viewScale) {
    this.camera.left = -(viewSize.x / viewScale / shared.baseScale / 2)
    this.camera.right = (viewSize.x / viewScale / shared.baseScale / 2)
    this.camera.top = -(viewSize.y / viewScale / shared.baseScale / 2)
    this.camera.bottom = (viewSize.y / viewScale / shared.baseScale / 2)
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.renderer.setViewport(0, 0, viewSize.x, viewSize.y)
    this.camera.updateProjectionMatrix()
  }
  addSprite (name, scale, pos, height, options = {}) {
    const spriteType = spriteTypes.get(name)
    if (spriteType) {
      this.mainSprites.addSprite(name, scale, pos, height, options)
    }
  }
  getSprite (name) {
    return spriteTypes.get(name)
  }
}
