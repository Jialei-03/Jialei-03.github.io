import sharp from "sharp"
import { fileURLToPath } from "node:url"

// Keep source images in assets/; publish lightweight derivatives.
const tasks = [
  ["github-avatar.jpg", "github-avatar.webp", 460, 86],
  ["github-avatar.jpg", "github-avatar-small.webp", 256, 84],
  ["unigrec-framework.png", "unigrec-framework.webp", 880, 90],
  ["isccn-framework.png", "isccn-framework.webp", 306, 90],
]
for (const [source, destination, width, quality] of tasks) {
  await sharp(fileURLToPath(new URL(`../assets/${source}`, import.meta.url)))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(fileURLToPath(new URL(`../public/assets/${destination}`, import.meta.url)))
}
for (const [destination, width] of [["favicon.png", 64], ["apple-touch-icon.png", 180]]) {
  await sharp(fileURLToPath(new URL("../assets/github-avatar.jpg", import.meta.url)))
    .resize(width, width)
    .png()
    .toFile(fileURLToPath(new URL(`../public/assets/${destination}`, import.meta.url)))
}
console.log("Optimized GitHub avatar, browser icons and publication figures.")
