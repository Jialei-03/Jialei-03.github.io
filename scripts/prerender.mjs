import { readFile, readdir, writeFile } from "node:fs/promises"
import { render } from "../.preview/ssr/entry-server.js"

const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8")
const font = (await readdir(new URL("../dist/assets/", import.meta.url))).find(file => file.startsWith("geist-latin-wght-normal") && file.endsWith(".woff2"))
let html = template.replace("<!--app-html-->", render())
if (font) html = html.replace("</head>", `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin /></head>`)
await writeFile(new URL("../dist/index.html", import.meta.url), html)
console.log("Pre-rendered homepage for search engines and browsers without JavaScript.")
