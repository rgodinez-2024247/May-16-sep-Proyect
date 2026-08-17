const sharp = require('sharp')

async function main() {
  // Start from last good transparent output if present, else rebuild from jpeg
  const src = 'public/images/sanrio-group-transparent.png'
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const n = width * height

  const lum = (i) => (data[i] + data[i + 1] + data[i + 2]) / 3
  const sat = (i) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    return Math.max(r, g, b) - Math.min(r, g, b)
  }

  const isCheckerOrPaper = (i) => {
    if (data[i + 3] < 10) return true // already clear acts as conduit
    const L = lum(i)
    const S = sat(i)
    // classic checker greys / flat paper, but NOT bright character white
    if (S < 14 && L >= 165 && L <= 230) return true
    if (S < 10 && L >= 231 && L <= 245) return true
    return false
  }

  const isProtected = (i) => {
    if (data[i + 3] < 10) return false
    const L = lum(i)
    const S = sat(i)
    // character white / color / outlines stay
    if (L > 245 && S < 20) return true
    if (S > 22) return true
    if (L < 130) return true
    return false
  }

  const remove = new Uint8Array(n)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (remove[p]) return
    const i = p * 4
    if (isProtected(i)) return
    if (!isCheckerOrPaper(i) && data[i + 3] >= 10) return
    remove[p] = 1
    stack.push(p)
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  while (stack.length) {
    const p = stack.pop()
    const x = p % width
    const y = (p / width) | 0
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  let cleared = 0
  for (let p = 0; p < n; p++) {
    if (!remove[p]) continue
    // only clear if it was opaque checkerish (keep already transparent)
    if (data[p * 4 + 3] > 0 && !isProtected(p * 4)) {
      data[p * 4 + 3] = 0
      cleared++
    }
  }

  // Trim empty margins
  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile('public/images/sanrio-group-transparent.png')

  console.log('cleanup cleared', cleared)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
