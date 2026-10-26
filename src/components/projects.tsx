import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { openResearchAgent as project, publications, researchProjects, sweClar, type Language } from "@/data/site"

export function Projects({ lang }: { lang: Language }) {
  const t = lang === "en"
    ? { source: "Source code", reader: "Paper reader", openSource: "Open source", inProgress: "In progress", codeAndData: "Code and data", paper: "Paper", firstAuthor: "First author" }
    : { source: "源代码", reader: "在线读论文", openSource: "开源项目", inProgress: "进行中", codeAndData: "代码与数据", paper: "论文", firstAuthor: "第一作者" }
  const sweClarPaper = publications.find((paper) => paper.id === sweClar.publicationId)

  return <div className="project-list">
    <article id="project-swe-clar" className="project-card" aria-labelledby="swe-clar-project-title" data-reveal="">
      <p className="project-kind">
        <a className="project-org" href={sweClar.organization.href} target="_blank" rel="noreferrer"><img src={sweClar.organization.logo} alt="" width="18" height="18" />{sweClar.kind[lang]}</a>
        <span className="first-author">{t.firstAuthor}</span>
      </p>
      <h3 id="swe-clar-project-title"><a href={sweClar.code} target="_blank" rel="noreferrer">{sweClar.name}</a></h3>
      <p className="project-summary">{sweClar.summary[lang]}</p>
      <p className="project-links">
        <a href={sweClar.code} target="_blank" rel="noreferrer"><IconBrandGithub aria-hidden="true" />{t.codeAndData}</a>
        {sweClarPaper && <a href={sweClarPaper.paper} target="_blank" rel="noreferrer">{t.paper}<IconArrowUpRight aria-hidden="true" /></a>}
      </p>
    </article>
    <article id="project-open-research-agent" className="project-card" aria-labelledby="open-research-agent-title" data-reveal="">
      <p className="project-kind">{t.openSource}</p>
      <h3 id="open-research-agent-title"><a href={project.repository} target="_blank" rel="noreferrer">{project.name}</a></h3>
      <p className="project-summary">{project.summary[lang]}</p>
      <p className="project-links">
        <a href={project.repository} target="_blank" rel="noreferrer"><IconBrandGithub aria-hidden="true" />{t.source}</a>
        <a href={project.reader} target="_blank" rel="noreferrer">{t.reader}<IconArrowUpRight aria-hidden="true" /></a>
      </p>
    </article>
    {researchProjects.map((research) => <article key={research.id} id={`research-${research.id}`} className="project-card is-wip" aria-labelledby={`research-${research.id}-title`} data-reveal="">
      <p className="project-kind"><span className="live-dot" aria-hidden="true" />{t.inProgress}</p>
      <h3 id={`research-${research.id}-title`}>{research.title}</h3>
      <p className="project-summary">{research.summary[lang]}</p>
    </article>)}
  </div>
}
