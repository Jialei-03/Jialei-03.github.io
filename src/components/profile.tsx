import { useEffect, useRef, useState } from "react"
import { IconArrowUpRight, IconBrandGithub, IconMail } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { profile, type Language } from "@/data/site"

export function Profile({ lang }: { lang: Language }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    // A pre-rendered image can fail before React attaches its error handler.
    const image = imageRef.current
    if (image?.complete && image.naturalWidth === 0) setImageFailed(true)
  }, [])
  return <aside className="profile-rail" aria-labelledby="profile-name">
    <div className="profile-photo">
      <img id="avatar" ref={imageRef} src={profile.avatar} srcSet={`${profile.avatarSmall} 256w, ${profile.avatar} 640w`} sizes="(max-width: 767px) 112px, (max-width: 1100px) 200px, 224px" alt="Jialei Li standing beside a panda sculpture" width="224" height="224" fetchPriority="high" hidden={imageFailed} onError={() => setImageFailed(true)} />
      {imageFailed && <span className="photo-fallback" aria-label="Jialei Li">JL</span>}
    </div>
    <div className="profile-identity">
      <h1 id="profile-name">{profile.name[lang]}</h1>
      <p className="other-name">{profile.otherName[lang]}</p>
      <p className="profile-role">{profile.role[lang]}</p>
      <a className="profile-affiliation" href="https://sai.ustc.edu.cn/" target="_blank" rel="noreferrer">
        {profile.affiliation[lang]} <IconArrowUpRight aria-hidden="true" />
      </a>
      <p className="profile-lab">{profile.lab[lang]}</p>
    </div>
    <div className="profile-contact">
      <Button variant="outline" size="sm" asChild>
        <a href={`mailto:${profile.email}`}><IconMail data-icon="inline-start" />{lang === "en" ? "Email me" : "邮件联系"}</a>
      </Button>
      <Button variant="outline" size="icon-sm" asChild>
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><IconBrandGithub data-icon="inline-start" /></a>
      </Button>
    </div>
    <Separator className="profile-separator" />
    <p className="profile-motto">{lang === "en" ? "Always improving." : "无限进步。"}</p>
  </aside>
}
