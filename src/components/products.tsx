import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { products, type Language } from "@/data/site"

export function Products({ lang }: { lang: Language }) {
  const t = lang === "en" ? { visit: "Open", source: "Source code" } : { visit: "打开使用", source: "源代码" }

  return <div className="product-list">
    {products.map((product) => <article key={product.id} id={`product-${product.id}`} className="product-card" aria-labelledby={`product-${product.id}-title`} data-reveal="">
      <a className="product-shot" href={product.href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
        <img src={product.image[lang]} alt={product.imageAlt[lang]} loading="lazy" width="960" height="600" />
      </a>
      <div className="product-copy">
        <p className="project-kind"><span className="live-dot" aria-hidden="true" />{product.status[lang]}</p>
        <h3 id={`product-${product.id}-title`}><a href={product.href} target="_blank" rel="noreferrer">{product.name[lang]}</a></h3>
        <p className="project-summary">{product.summary[lang]}</p>
        <p className="project-links">
          <a href={product.href} target="_blank" rel="noreferrer">{t.visit}<IconArrowUpRight aria-hidden="true" /></a>
          {product.source && <a href={product.source} target="_blank" rel="noreferrer"><IconBrandGithub aria-hidden="true" />{t.source}</a>}
        </p>
      </div>
    </article>)}
  </div>
}
