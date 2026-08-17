const sharp = require('sharp')
const fs = require('fs')

async function main() {
  fs.mkdirSync('public/images/characters', { recursive: true })

  await sharp('public/images/sanrio-sheet.png')
    .extract({ left: 0, top: 0, width: 559, height: 223 })
    .toFile('public/images/_top.png')

  await sharp('public/images/sanrio-sheet.png')
    .extract({ left: 0, top: 222, width: 559, height: 224 })
    .toFile('public/images/_bottom.png')

  console.log('halves written')

  const bottomMeta = await sharp('public/images/_bottom.png').metadata()
  console.log(bottomMeta.width, bottomMeta.height)

  const names = ['badtzmaru', 'mymelody', 'kuromi']
  const cw = 139
  for (let i = 0; i < 3; i++) {
    const out = `public/images/characters/${names[i]}.png`
    await sharp('public/images/_bottom.png')
      .extract({ left: i * cw, top: 0, width: cw, height: bottomMeta.height })
      .toFile(out + '.tmp.png')
    await sharp(out + '.tmp.png')
      .trim({ threshold: 15 })
      .toFile(out)
    fs.unlinkSync(out + '.tmp.png')
    console.log('ok', names[i])
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
