const { removeBackground } = require('@imgly/background-removal-node')
const sharp = require('sharp')

async function main() {
  const blob = await removeBackground('public/images/characters/chococat-src.png', {
    output: { format: 'image/png', quality: 1 },
  })
  const buffer = Buffer.from(await blob.arrayBuffer())
  await sharp(buffer)
    .trim({ threshold: 8 })
    .png()
    .toFile('public/images/characters/chococat-party.png')
  const meta = await sharp('public/images/characters/chococat-party.png').metadata()
  console.log('chococat', meta.width, 'x', meta.height, 'alpha', meta.hasAlpha)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
