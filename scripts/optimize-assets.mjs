import sharp from "sharp"
import { fileURLToPath } from "node:url"

// Keep source images in assets/; publish lightweight derivatives.
const tasks = [
  ["avatar.jpg", "avatar.webp", 640, 82],
  ["avatar.jpg", "avatar-small.webp", 256, 80],
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
console.log("Optimized portrait and publication figures.")
