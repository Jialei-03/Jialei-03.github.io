import { readFile, writeFile } from "node:fs/promises"
import { render } from "../.preview/ssr/entry-server.js"

const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8")
await writeFile(new URL("../dist/index.html", import.meta.url), template.replace("<!--app-html-->", render()))
console.log("Pre-rendered homepage for search engines and browsers without JavaScript.")
