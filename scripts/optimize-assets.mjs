import sharp from "sharp"
import { fileURLToPath } from "node:url"

// Keep source images in assets/; publish lightweight derivatives.
const tasks = [
  ["github-avatar.jpg", "github-avatar.webp", 460, 86],
  ["github-avatar.jpg", "github-avatar-small.webp", 256, 84],
  ["swe-clar-framework.svg", "swe-clar-framework.webp", 880, 90],
  ["unigrec-framework.png", "unigrec-framework.webp", 880, 90],
  ["isccn-framework.png", "isccn-framework.webp", 306, 90],
  // Figure 1 of the MESA submission.
  ["mesa-framework.png", "mesa-framework.webp", 880, 90],
  // Upwork's app icon, from the avatar of its GitHub organization (github.com/upwork).
  ["upwork-logo.jpg", "upwork-logo.webp", 128, 92],
  // Product screenshots: dougao.online's workbench, and the reader from the ORA repository docs.
  ["dougao-workbench.png", "dougao-workbench.webp", 960, 82],
  ["ora-reader.zh.png", "ora-reader.zh.webp", 960, 82],
  ["ora-reader.en.png", "ora-reader.en.webp", 960, 82],
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
console.log("Optimized GitHub avatar, browser icons, logos, publication figures and product screenshots.")
