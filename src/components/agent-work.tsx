import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { openResearchAgent as project, researchProjects, type Language } from "@/data/site"

export function AgentWork({ lang }: { lang: Language }) {
  const t = lang === "en"
    ? { heading: "Agent research & projects", openSource: "Open source", source: "Source code", reader: "Paper reader" }
    : { heading: "智能体研究与项目", openSource: "开源项目", source: "源代码", reader: "在线读论文" }

  return <section id="agents" className="content-section agents-section" aria-labelledby="agents-heading">
    <h2 id="agents-heading">{t.heading}</h2>
    <article id="project-open-research-agent" aria-labelledby="open-research-agent-title">
      <Card className="agent-project">
        <CardHeader>
          <div className="agent-project-meta"><Badge variant="secondary">{t.openSource}</Badge></div>
          <CardTitle><h3 id="open-research-agent-title" className="agent-project-title"><a href={project.repository} target="_blank" rel="noreferrer">{project.name}</a></h3></CardTitle>
          <CardDescription>{project.summary[lang]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="project-capabilities">
            {project.capabilities.map((capability) => <Badge variant="outline" key={capability.en}>{capability[lang]}</Badge>)}
          </div>
        </CardContent>
        <CardFooter className="project-actions">
          <Button asChild size="sm"><a href={project.repository} target="_blank" rel="noreferrer"><IconBrandGithub data-icon="inline-start" />{t.source}</a></Button>
          <Button asChild variant="outline" size="sm"><a href={project.reader} target="_blank" rel="noreferrer">{t.reader}<IconArrowUpRight data-icon="inline-end" /></a></Button>
        </CardFooter>
      </Card>
    </article>
    <div className="research-projects">
      {researchProjects.map((research) => <article className="research-project" id={`research-${research.id}`} key={research.id} aria-labelledby={`research-${research.id}-title`}>
        <Badge variant="outline">{research.kind[lang]}</Badge>
        <h3 id={`research-${research.id}-title`}>{research.title}</h3>
        <p>{research.summary[lang]}</p>
      </article>)}
    </div>
  </section>
}
