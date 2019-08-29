
// the size of the top square of a tile
const tileSize = 40
const spriteTopOffset = 0 // distance from top of sprite to top of square. there is no side offset.
const spriteLayerHeight = 40
const tileScale = 4

let renderer = null

function init (newRenderer) {
  renderer = newRenderer
}

function setTile (name, depth, x, y, drawYAdjust = 0, viewScale, spriteScale, isWall = false) {
  const drawX = (x * tileSize.x)
  const groundY = (y * tileSize.y - spriteTopOffset * spriteScale)
  const sprite = {}
  sprite.x = drawX
  sprite.y = groundY - depth * spriteLayerHeight * spriteScale
  sprite._depth = groundY + spriteTopOffset * spriteScale * viewScale + drawYAdjust
  // hack: shots that hit us from above pass through us and end up slightly below - but we don't want them to draw over us.
  if (depth > 0) {
    sprite._depth += 25 * spriteScale * viewScale + 200 // must be greater than greatest shot speed per frame
    // fixme: the 200 here is a magic number and not viewScale adaptive
  }
  if (isWall) {
    sprite.y = groundY
    sprite._depth -= 1
  } else if (depth > 0) {
    setTile('Wall Front', depth, x, y, 0, viewScale, spriteScale, true)
  }
  sprite._depth -= 20 // fixme: magic number, zoom dependant
  renderer.addSprite(name, tileScale, { x: sprite.x, y: sprite.y }, 0, { depth: sprite._depth })
}

function draw (viewPort, world, renderer) {
  const viewScale = 1
  const spriteScale = 1

  function drawTile (name, depth, x, y, drawYAdjust = 0) {
    setTile(name, depth, x, y, drawYAdjust, viewScale, spriteScale)
  }

  function drawShadow (name, depth, x, y, drawYAdjust = 1) {
    setTile(name, depth, x, y, drawYAdjust, viewScale, spriteScale)
  }

  let tileXStart = Math.floor(viewPort.x / tileSize.x)
  let tileYStart = Math.floor(viewPort.y / tileSize.y)
  let tileXEnd = Math.floor((viewPort.x + viewPort.width) / tileSize.x)
  let tileYEnd = Math.floor((viewPort.y + viewPort.height) / tileSize.y)
  // note that we draw one extra Y row, but we could exclude every block that is depth 0 or below. Only towers are visible.
  for (let x = tileXStart; x < tileXEnd; x++) {
    for (let y = tileYStart; y < tileYEnd; y++) {
      const [spriteSheet, depth] = getTile(x, y)
      drawTile(spriteSheet, depth, x, y)

      const [, northDepth] = getTile(x, y - 1)
      if (northDepth == depth + 1) {
        drawShadow('Shadow North', depth, x, y)
      }

      const [, eastDepth] = getTile(x + 1, y)
      if (eastDepth == depth + 1) {
        drawShadow('Shadow East', depth, x, y)
      }

      const [, southDepth] = getTile(x, y + 1)
      if (southDepth == depth + 1) {
        drawShadow('Shadow South', depth, x, y)
      }

      const [, westDepth] = getTile(x - 1, y)
      if (westDepth == depth + 1) {
        drawShadow('Shadow West', depth, x, y)
      }

      const [, southEastDepth] = getTile(x + 1, y + 1)
      if (southEastDepth == depth + 1 && eastDepth <= depth) {
        drawShadow('Shadow South East', depth, x, y)
      }

      const [, southWestDepth] = getTile(x - 1, y + 1)
      if (southWestDepth == depth + 1 && northDepth <= depth) {
        drawShadow('Shadow South West', depth, x, y)
      }

      const [, northEastDepth] = getTile(x + 1, y - 1)
      if (northEastDepth == depth + 1 && northDepth <= depth && eastDepth <= depth) {
        drawShadow('Shadow North East', depth, x, y)
      }

      const [, northWestDepth] = getTile(x - 1, y - 1)
      if (northWestDepth == depth + 1 && northDepth <= depth && westDepth <= depth) {
        drawShadow('Shadow North West', depth, x, y)
      }

      // special cases
      if (southWestDepth == depth && southDepth < depth) {
        drawShadow('Shadow Side West', depth, x, y + 1)
      }
      // todo: place Shadow South when there is no tile in north and we are the top tile in the stack
    }
  }
}

export default { init, draw }
