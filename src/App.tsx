import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { IconArrowUpRight, IconArrowUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Profile } from "@/components/profile"
import { Publication } from "@/components/publication"
import { SiteControls, useLanguage } from "@/components/site-controls"
import { education, news, profile, publications } from "@/data/site"
import { cn } from "@/lib/utils"

type Filter = "all" | "conference" | "preprint"

const copy = {
  en: {
    skip: "Skip to main content", research: "Research", about: "About", news: "News",
    eyebrow: "Research & engineering", headlineStart: "Language, agents &", headlineEnd: "recommendation.",
    intro: "Exploring AI agents, large language models, and how intelligent systems connect people with the right information.",
    publications: "Selected publications", all: "All work", conference: "Conference", preprint: "Preprints",
    education: "Education", updated: "Updated", top: "Back to top",
  },
  zh: {
    skip: "跳到主内容", research: "研究", about: "关于", news: "动态",
    eyebrow: "研究与工程", headlineStart: "语言、智能体", headlineEnd: "与推荐系统。",
    intro: "探索智能体与大语言模型，以及智能系统如何连接人与合适的信息。",
    publications: "精选论文", all: "全部成果", conference: "会议论文", preprint: "预印本",
    education: "教育经历", updated: "更新于", top: "返回顶部",
  },
}

export default function App() {
  const { lang, toggleLanguage } = useLanguage()
  const t = copy[lang]
  const [filter, setFilter] = useState<Filter>("all")
  const [activeSection, setActiveSection] = useState("publications")

  useEffect(() => {
    const sections = ["publications", "about", "news"]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible.length) setActiveSection(visible[0].target.id)
    }, { rootMargin: "-80px 0px -60% 0px", threshold: 0 })
    sections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  return <TooltipProvider delayDuration={250}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label={`jl. Jialei Li, ${t.top}`}>jl<span aria-hidden="true">.</span></a>
        <nav className="top-nav" aria-label={lang === "en" ? "Primary navigation" : "主导航"}>
          {[
            { id: "publications", label: t.research },
            { id: "about", label: t.about },
            { id: "news", label: t.news },
          ].map((item) => <a key={item.id} href={`#${item.id}`} className={cn(activeSection === item.id && "active")} aria-current={activeSection === item.id ? "location" : undefined}>{item.label}</a>)}
        </nav>
        <SiteControls lang={lang} toggleLanguage={toggleLanguage} />
      </div>
    </header>

    <div className="page-shell" id="top">
      <Profile lang={lang} />
      <main id="main" tabIndex={-1}>
        <section className="intro" aria-labelledby="intro-heading">
          <p className="intro-eyebrow">{t.eyebrow}</p>
          <h2 id="intro-heading"><span>{t.headlineStart}</span><span className="accent-text">{t.headlineEnd}</span></h2>
          <p className="intro-copy">{t.intro}</p>
        </section>

        <section id="publications" className="content-section publications-section" aria-labelledby="publications-heading">
          <h2 id="publications-heading">{t.publications}</h2>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <TabsList aria-label={lang === "en" ? "Filter publications" : "筛选论文"}>
              {(["all", "conference", "preprint"] as const).map((value) => <TabsTrigger value={value} key={value}>
                {t[value]}<span className="tab-count" aria-hidden="true">{value === "all" ? publications.length : publications.filter((paper) => paper.type === value).length}</span>
              </TabsTrigger>)}
            </TabsList>
            {(["all", "conference", "preprint"] as const).map((value) => <TabsContent value={value} key={value}>
              <div className="publication-list" id={value === filter ? "publication-list" : undefined}>
                {publications.filter((paper) => value === "all" || paper.type === value).map((paper) => <Publication paper={paper} lang={lang} key={paper.id} />)}
              </div>
            </TabsContent>)}
          </Tabs>
        </section>

        <Separator className="section-separator" />

        <section id="about" className="content-section about-section" aria-labelledby="about-heading">
          <h2 id="about-heading">{t.about}</h2>
          <p id="bio">{profile.summary[lang]}</p>
          <div className="interest-tags" id="interest-inline" aria-label={lang === "en" ? "Research interests" : "研究兴趣"}>
            {profile.interests.map((interest) => <Badge key={interest.en} variant="outline">{interest[lang]}</Badge>)}
          </div>
        </section>

        <div className="background-grid">
          <section id="education" className="content-section" aria-labelledby="education-heading">
            <h2 id="education-heading">{t.education}</h2>
            <div className="education-list" id="education-list">
              {education.map((item) => <article className="education-item" key={item.href}>
                <div className="school-mark"><img src={item.logo} alt="" loading="lazy" width="60" height="60" /></div>
                <div>
                  <p className="education-period">{item.period[lang]}</p>
                  <h3><a href={item.href} target="_blank" rel="noreferrer">{item.school[lang]}</a></h3>
                  <p className="education-degree">{item.degree[lang]}</p>
                  {item.details[lang] && <p className="education-details">{item.details[lang]}</p>}
                </div>
              </article>)}
            </div>
          </section>

          <section id="news" className="content-section" aria-labelledby="news-heading">
            <h2 id="news-heading">{t.news}</h2>
            <ul className="news-list" id="news-list">
              {news.map((item) => <li key={item.date}>
                <time dateTime={item.date.replace(".", "-")}>{item.date}</time>
                <a href={item.href} {...(item.href.startsWith("#") ? {
                  onClick: () => flushSync(() => setFilter("all")),
                } : { target: "_blank", rel: "noreferrer" })}>
                  {item.text[lang]}<IconArrowUpRight aria-hidden="true" />
                </a>
              </li>)}
            </ul>
          </section>
        </div>

        <Separator className="footer-separator" />
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Jialei Li <span>{t.updated} {profile.updatedAt}</span></p>
          <Button variant="ghost" size="icon-sm" asChild><a href="#top" aria-label={t.top}><IconArrowUp data-icon="inline-start" /></a></Button>
        </footer>
      </main>
    </div>
  </TooltipProvider>
}
