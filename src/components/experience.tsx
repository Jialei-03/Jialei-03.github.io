import { authorship } from "@/components/publication"
import { experience, publications, type Language } from "@/data/site"

export function Experience({ lang, onNavigate }: { lang: Language; onNavigate: () => void }) {
  const t = lang === "en" ? { papers: "Papers from this internship" } : { papers: "实习期间的论文" }

  return <ul className="education-list" id="experience-list">
    {experience.map((item) => <li className="education-row" id={item.id} key={item.id} data-reveal="">
      <span className="row-logo is-filled"><img src={item.logo} alt="" width="44" height="44" loading="lazy" /></span>
      <div className="row-copy">
        <h3><a href={item.href} target="_blank" rel="noreferrer">{item.name[lang]}</a></h3>
        <p className="row-role">{item.role[lang]}<span className="row-about">{item.about[lang]}</span></p>
        <ul className="row-outputs" aria-label={t.papers}>
          {item.outputs.map((output) => {
            const paper = publications.find((entry) => entry.id === output.paperId)
            if (!paper) return null
            return <li key={paper.id}>
              <a className="output-name" href={`#publication-${paper.id}`} onClick={onNavigate}>{paper.name}</a>
              <span className="output-venue">{paper.venue} {paper.format[lang]}{paper.authorship && <span className="first-author">{authorship[paper.authorship][lang]}</span>}</span>
              <p className="output-summary">{output.summary[lang]}</p>
            </li>
          })}
        </ul>
      </div>
      <span className="row-period">{item.period[lang]}</span>
    </li>)}
  </ul>
}
