import { IconArrowUpRight, IconBrandGithub, IconFileText } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type Language, type Publication as Paper } from "@/data/site"

function Authors({ authors }: { authors: string[] }) {
  return <span className="author-list">{authors.map((author, index) => <span key={author}>
    {index > 0 && ", "}
    {author.startsWith("Jialei Li") ? <><strong>Jialei Li</strong>{author.slice(9)}</> : author}
  </span>)}</span>
}

function PaperLinks({ paper, lang, featured }: { paper: Paper; lang: Language; featured: boolean }) {
  return <div className="paper-links">
    <Button asChild variant={featured ? "default" : "outline"} size="sm">
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
  const featured = paper.id === "soda"
  const image = <a className="paper-visual" href={paper.pdf} target="_blank" rel="noreferrer" aria-label={`${paper.name} PDF`}>
    <img src={paper.image} alt={paper.imageAlt} loading="lazy" width="480" height="240" />
  </a>
  const metadata = <div className="paper-metadata">
    <Badge variant={featured ? "default" : "secondary"}>{paper.venue}</Badge>
    <span>{paper.format[lang]}</span>
  </div>
  return <article id={`publication-${paper.id}`} className="paper-item" aria-labelledby={`title-${paper.id}`} data-paper-type={paper.type}>
    {featured ? <Card className="featured-paper">
      <CardHeader>
        {metadata}
        <p className="project-name">{paper.name}</p>
        <CardTitle><h3 id={`title-${paper.id}`}><a href={paper.paper} target="_blank" rel="noreferrer">{paper.title}</a></h3></CardTitle>
        <CardDescription><Authors authors={paper.authors} /></CardDescription>
      </CardHeader>
      <CardContent>
        {image}
        {paper.description && <p className="paper-description">{paper.description[lang]}</p>}
      </CardContent>
      <CardFooter><PaperLinks paper={paper} lang={lang} featured /></CardFooter>
    </Card> : <div className="standard-paper">
      {image}
      <div className="paper-copy">
        {metadata}
        <h3 id={`title-${paper.id}`}><a href={paper.paper} target="_blank" rel="noreferrer">{paper.title}</a></h3>
        <p><Authors authors={paper.authors} /></p>
        <PaperLinks paper={paper} lang={lang} featured={false} />
      </div>
    </div>}
  </article>
}
