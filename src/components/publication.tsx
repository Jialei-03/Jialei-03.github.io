import { IconArrowUpRight, IconBrandGithub, IconFileText } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Language, type Publication as Paper } from "@/data/site"

function Authors({ authors }: { authors: string[] }) {
  return <span className="author-list">{authors.map((author, index) => <span key={author}>
    {index > 0 && ", "}
    {author.startsWith("Jialei Li") ? <><strong>Jialei Li</strong>{author.slice(9)}</> : author}
  </span>)}</span>
}

export function PaperLinks({ paper, lang }: { paper: Paper; lang: Language }) {
  return <div className="paper-links">
    <Button asChild variant="outline" size="sm">
      <a href={paper.paper} target="_blank" rel="noreferrer">{lang === "en" ? "Paper" : "论文"}<IconArrowUpRight data-icon="inline-end" /></a>
    </Button>
    <Button asChild variant="ghost" size="sm">
      <a href={paper.pdf} target="_blank" rel="noreferrer"><IconFileText data-icon="inline-start" />PDF</a>
    </Button>
    {paper.code && <Button asChild variant="ghost" size="sm">
      <a href={paper.code} target="_blank" rel="noreferrer"><IconBrandGithub data-icon="inline-start" />{lang === "en" ? "Code" : "代码"}</a>
    </Button>}
  </div>
}

export function Publication({ paper, lang }: { paper: Paper; lang: Language }) {
  const image = <a className="paper-visual" href={paper.pdf} target="_blank" rel="noreferrer" aria-label={`${paper.name} PDF`}>
    <img src={paper.image} alt={paper.imageAlt} loading="lazy" width="480" height="240" />
  </a>
  const metadata = <div className="paper-metadata">
    {paper.id === "soda" && <span className="paper-alias">SODA</span>}
    <Badge variant={paper.id === "soda" ? "default" : "secondary"}>{paper.venue}</Badge>
    <span>{paper.format[lang]}</span>
    {paper.authors[0] === "Jialei Li" && <Badge variant="outline">{lang === "en" ? "First author" : "第一作者"}</Badge>}
  </div>
  return <article id={`publication-${paper.id}`} className="paper-item" aria-labelledby={`title-${paper.id}`} data-paper-type={paper.type}>
    <div className="standard-paper">
      {image}
      <div className="paper-copy">
        {metadata}
        <h3 id={`title-${paper.id}`}><a href={paper.paper} target="_blank" rel="noreferrer">{paper.title}</a></h3>
        <p><Authors authors={paper.authors} /></p>
        {paper.description && <p className="paper-description">{paper.description[lang]}</p>}
        <PaperLinks paper={paper} lang={lang} />
      </div>
    </div>
  </article>
}
