import type { Rich } from "@/data/site"

// Renders text with inline links. Links into the page call onNavigate first, so a paper hidden
// by the publication filter is shown before the browser scrolls to it.
export function RichText({ content, onNavigate }: { content: Rich; onNavigate?: () => void }) {
  return <>{content.map((part, index) => typeof part === "string"
    ? part
    : part.href.startsWith("#")
      ? <a key={index} className="text-link" href={part.href} onClick={onNavigate}>{part.text}</a>
      : <a key={index} className="text-link" href={part.href} target="_blank" rel="noreferrer">{part.text}</a>)}</>
}
