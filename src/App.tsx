import { useEffect, useRef, useState, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import { IconArrowUp, IconArrowUpRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Profile } from "@/components/profile"
import { Publication } from "@/components/publication"
import { Education } from "@/components/education"
import { Projects } from "@/components/projects"
import { Products } from "@/components/products"
import { RichText } from "@/components/rich-text"
import { SiteControls, useLanguage } from "@/components/site-controls"
import { news, profile, publications } from "@/data/site"
import { useIndicator, useScrollReveal, withViewTransition } from "@/lib/motion"

type Filter = "all" | "conference" | "preprint"

const copy = {
  en: {
    skip: "Skip to main content", top: "Back to top", updated: "Updated",
    about: "About", news: "News", papers: "Papers", projects: "Projects", products: "Products", education: "Education",
    publications: "Publications", now: "Now", interests: "Research interests",
    all: "All work", conference: "Conference", preprint: "Preprints",
  },
  zh: {
    skip: "跳到主内容", top: "返回顶部", updated: "更新于",
    about: "关于", news: "动态", papers: "论文", projects: "项目", products: "产品", education: "教育",
    publications: "论文", now: "近况", interests: "研究兴趣",
    all: "全部成果", conference: "会议论文", preprint: "预印本",
  },
}

const sections = [
  { id: "about", label: "about" },
  { id: "news", label: "news" },
  { id: "publications", label: "papers" },
  { id: "projects", label: "projects" },
  { id: "products", label: "products" },
  { id: "education", label: "education" },
] as const

const enter = (order: number) => ({ "--enter": order }) as CSSProperties

export default function App() {
  const { lang, toggleLanguage } = useLanguage()
  const t = copy[lang]
  const [filter, setFilter] = useState<Filter>("all")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const navIndicator = useIndicator(navRef, "a.active", `${activeSection}-${lang}`)
  const tabIndicator = useIndicator(tabsRef, '[data-state="active"]', `${filter}-${lang}`)
  // Links into the paper list must not land on a paper hidden by the current filter.
  const showAllPapers = () => flushSync(() => setFilter("all"))
  useScrollReveal()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible.length) setActiveSection(visible[0].target.id)
    }, { rootMargin: "-90px 0px -60% 0px", threshold: 0 })
    for (const { id } of sections) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  return <TooltipProvider delayDuration={250}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label={`jl. Jialei Li, ${t.top}`}>jl<span aria-hidden="true">.</span></a>
        <nav className="top-nav" ref={navRef} aria-label={lang === "en" ? "Primary navigation" : "主导航"}>
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : undefined} aria-current={activeSection === id ? "location" : undefined}>{t[label]}</a>)}
          {navIndicator && <span className="nav-indicator" aria-hidden="true" style={{ transform: `translateX(${navIndicator.left}px)`, width: navIndicator.width }} />}
        </nav>
        <SiteControls lang={lang} toggleLanguage={toggleLanguage} />
      </div>
    </header>

    <div className="page-shell" id="top">
      <Profile lang={lang} onNavigate={showAllPapers} />
      <main id="main" tabIndex={-1}>
        <section id="about" className="main-section about-section" aria-labelledby="about-heading">
          <h2 id="about-heading" className="enter" style={enter(1)}>{t.about}</h2>
          <div id="bio" className="enter" style={enter(2)}>
            {profile.bio[lang].map((paragraph, index) => <p key={index}><RichText content={paragraph} onNavigate={showAllPapers} /></p>)}
          </div>
          <p className="now-note enter" style={enter(3)}>
            <span className="now-label"><span className="live-dot" aria-hidden="true" />{t.now}</span>
            <span><RichText content={profile.now[lang]} onNavigate={showAllPapers} /></span>
          </p>
          <ul className="interest-tags enter" style={enter(4)} aria-label={t.interests}>
            {profile.interests.map((interest) => <li key={interest.en}>{interest[lang]}</li>)}
          </ul>
        </section>

        <section id="news" className="main-section" aria-labelledby="news-heading">
          <h2 id="news-heading" className="enter" style={enter(5)}>{t.news}</h2>
          <ul className="news-list enter" id="news-list" style={enter(6)}>
            {news.map((item) => <li key={item.date}>
              <time dateTime={item.date.replace(".", "-")}>{item.date}</time>
              <a href={item.href} {...(item.href.startsWith("#") ? { onClick: showAllPapers } : { target: "_blank", rel: "noreferrer" })}>
                {item.text[lang]}{!item.href.startsWith("#") && <IconArrowUpRight aria-hidden="true" />}
              </a>
            </li>)}
          </ul>
        </section>

        <section id="publications" className="main-section publications-section" aria-labelledby="publications-heading">
          <Tabs value={filter} onValueChange={(value) => withViewTransition("filter", () => setFilter(value as Filter))}>
            <div className="section-head" data-reveal="">
              <h2 id="publications-heading">{t.publications}</h2>
              <TabsList ref={tabsRef} aria-label={lang === "en" ? "Filter publications" : "筛选论文"} data-indicator={tabIndicator ? "" : undefined}>
                {tabIndicator && <span className="tab-indicator" aria-hidden="true" style={{ transform: `translateX(${tabIndicator.left}px)`, width: tabIndicator.width }} />}
                {(["all", "conference", "preprint"] as const).map((value) => <TabsTrigger value={value} key={value}>
                  {t[value]}<span className="tab-count" aria-hidden="true">{value === "all" ? publications.length : publications.filter((paper) => paper.type === value).length}</span>
                </TabsTrigger>)}
              </TabsList>
            </div>
            {(["all", "conference", "preprint"] as const).map((value) => <TabsContent value={value} key={value}>
              <div className="publication-list" id={value === filter ? "publication-list" : undefined}>
                {publications.filter((paper) => value === "all" || paper.type === value).map((paper) => <Publication paper={paper} lang={lang} key={paper.id} />)}
              </div>
            </TabsContent>)}
          </Tabs>
        </section>

        <section id="projects" className="main-section" aria-labelledby="projects-heading">
          <h2 id="projects-heading" data-reveal="">{t.projects}</h2>
          <Projects lang={lang} />
        </section>

        <section id="products" className="main-section" aria-labelledby="products-heading">
          <h2 id="products-heading" data-reveal="">{t.products}</h2>
          <Products lang={lang} />
        </section>

        <section id="education" className="main-section" aria-labelledby="education-heading">
          <h2 id="education-heading" data-reveal="">{t.education}</h2>
          <Education lang={lang} />
        </section>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Jialei Li <span>{t.updated} {profile.updatedAt}</span></p>
          <Button variant="ghost" size="icon" asChild><a href="#top" aria-label={t.top}><IconArrowUp /></a></Button>
        </footer>
      </main>
    </div>
  </TooltipProvider>
}
