const { removeBackground } = require('@imgly/background-removal-node')
const sharp = require('sharp')
const fs = require('fs')

async function main() {
  console.log('Running AI background removal...')
  const blob = await removeBackground('public/images/sanrio-group.png', {
    output: { format: 'image/png', quality: 1 },
  })
  const buffer = Buffer.from(await blob.arrayBuffer())
  await sharp(buffer)
    .trim()
    .png()
    .toFile('public/images/sanrio-group-transparent.png')
  const meta = await sharp('public/images/sanrio-group-transparent.png').metadata()
  console.log('AI result', meta.width, meta.height, meta.hasAlpha)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
