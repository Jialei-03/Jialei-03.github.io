import { education, experience, type Language } from "@/data/site"
import { RichText } from "@/components/rich-text"
import { cn } from "@/lib/utils"

export function Background({ lang, onNavigate }: { lang: Language; onNavigate: () => void }) {
  return <ul className="background-list" id="background-list">
    {[...experience, ...education].map((item) => <li className="background-row" id={item.id} key={item.id} data-reveal="">
      <span className={cn("row-logo", item.logoFill && "is-filled")}>
        <img src={item.logo} alt="" width="44" height="44" loading="lazy" />
      </span>
      <div className="row-copy">
        <h3><a href={item.href} target="_blank" rel="noreferrer">{item.name[lang]}</a></h3>
        <p className="row-role">{item.role[lang]}</p>
        {item.highlights && <ul className="row-highlights">
          {item.highlights.map((highlight, index) => <li key={index}><RichText content={highlight[lang]} onNavigate={onNavigate} /></li>)}
        </ul>}
      </div>
      <span className="row-period">{item.period[lang]}</span>
    </li>)}
  </ul>
}
