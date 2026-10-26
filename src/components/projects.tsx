import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { openResearchAgent as project, researchProjects, type Language } from "@/data/site"

export function Projects({ lang }: { lang: Language }) {
  const t = lang === "en"
    ? { source: "Source code", reader: "Paper reader", openSource: "Open source", inProgress: "In progress" }
    : { source: "源代码", reader: "在线读论文", openSource: "开源项目", inProgress: "进行中" }

  return <div className="project-list">
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
