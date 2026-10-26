import { Fragment, type CSSProperties } from "react"
import { type Language, type Publication as Paper } from "@/data/site"

function Authors({ authors }: { authors: string[] }) {
  return <span className="author-list">{authors.map((author, index) => <span key={author}>
    {index > 0 && ", "}
    {author.startsWith("Jialei Li") ? <><strong>Jialei Li</strong>{author.slice(9)}</> : author}
  </span>)}</span>
}

function PaperLinks({ paper, lang }: { paper: Paper; lang: Language }) {
  const links = [
    { label: lang === "en" ? "Paper" : "论文", href: paper.paper },
    { label: "PDF", href: paper.pdf },
    ...(paper.code ? [{ label: lang === "en" ? "Code" : "代码", href: paper.code }] : []),
  ]
  return <p className="paper-links">
    {links.map((link, index) => <Fragment key={link.href}>
      {index > 0 && <span className="paper-links-sep" aria-hidden="true">/</span>}
      <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
    </Fragment>)}
  </p>
}

export function Publication({ paper, lang }: { paper: Paper; lang: Language }) {
  // The transition name lets each paper glide to its new place when the filter changes.
  return <article id={`publication-${paper.id}`} className="paper-item" aria-labelledby={`title-${paper.id}`} data-paper-type={paper.type} data-reveal="" style={{ "--paper-vt": `paper-${paper.id}` } as CSSProperties}>
    <a className="paper-visual" href={paper.pdf} target="_blank" rel="noreferrer" aria-label={`${paper.name} PDF`}>
      <img src={paper.image} alt={paper.imageAlt} loading="lazy" width="480" height="240" />
    </a>
    <div className="paper-copy">
      <h3 id={`title-${paper.id}`}><a href={paper.paper} target="_blank" rel="noreferrer">{paper.title}</a></h3>
      <p className="paper-authors"><Authors authors={paper.authors} /></p>
      <p className="paper-venue">
        <em>{paper.venue}</em>
        <span>{paper.format[lang]}</span>
        {paper.authors[0] === "Jialei Li" && <span className="first-author">{lang === "en" ? "First author" : "第一作者"}</span>}
      </p>
      {paper.description && <p className="paper-description">{paper.description[lang]}</p>}
      <PaperLinks paper={paper} lang={lang} />
    </div>
  </article>
}
