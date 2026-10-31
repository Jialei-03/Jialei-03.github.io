import { education, type Language } from "@/data/site"

export function Education({ lang }: { lang: Language }) {
  return <ul className="education-list" id="education-list">
    {education.map((school) => <li className="education-row" id={school.id} key={school.id} data-reveal="">
      <span className="row-logo"><img src={school.logo} alt="" width="44" height="44" loading="lazy" /></span>
      <div className="row-copy">
        <h3><a href={school.href} target="_blank" rel="noreferrer">{school.name[lang]}</a></h3>
        <p className="row-role">{school.degree[lang]}</p>
        {school.details && <p className="row-detail">{school.details[lang]}</p>}
        {school.honors && <p className="row-detail">{school.honors[lang]}</p>}
      </div>
      <span className="row-period">{school.period[lang]}</span>
    </li>)}
  </ul>
}
