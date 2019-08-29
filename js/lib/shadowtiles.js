const tileSize = { x: 64, y: 64 }
const tileScale = 4

let renderer = null

function init (newRenderer) {
  renderer = newRenderer
}

function setTile (name, depth, x, y, drawYAdjust = 0, viewScale, spriteScale, isWall = false) {
  const drawX = (x * tileSize.x)
  const groundY = (y * tileSize.y)
  const sprite = {}
  sprite.x = drawX
  sprite.y = groundY
  renderer.addSprite(name, tileScale, { x: sprite.x, y: sprite.y }, 0)
}

function draw (viewPort, world, renderer) {
  const viewScale = 1
  const spriteScale = 1

  function drawTile (name, depth, x, y, drawYAdjust = 0) {
    setTile(name, depth, x, y, drawYAdjust, viewScale, spriteScale)
  }

  let tileXStart = Math.floor(viewPort.x / tileSize.x)
  let tileYStart = Math.floor(viewPort.y / tileSize.y)
  let tileXEnd = Math.floor((viewPort.x + viewPort.width) / tileSize.x) + 1
  let tileYEnd = Math.floor((viewPort.y + viewPort.height) / tileSize.y) + 1
  // note that we draw one extra Y row, but we could exclude every block that is depth 0 or below. Only towers are visible.
  for (let x = tileXStart; x < tileXEnd; x++) {
    for (let y = tileYStart; y < tileYEnd; y++) {
      const [sprite, depth] = getTile(world, x, y)
      drawTile(sprite, depth, x, y)
    }
  }
}

export default { init, draw }

function getTile (world, x, y) {
  const cell = world[x] ? world[x][y] : -1
  if (cell === 0) return ['Dirt Block', 0]
  return ['Water Block', 0]
}
