import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { IconBrandGithub, IconMail } from "@tabler/icons-react"
import { profile, type Language } from "@/data/site"
import { prefersReducedMotion } from "@/lib/motion"

const enter = (order: number) => ({ "--enter": order }) as CSSProperties

export function Profile({ lang, onNavigate }: { lang: Language; onNavigate: () => void }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // A pre-rendered image can fail before React attaches its error handler.
    const image = imageRef.current
    if (image?.complete && image.naturalWidth === 0) setImageFailed(true)
  }, [])

  // The portrait leans gently toward the pointer, with a soft highlight following it.
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    const photo = photoRef.current
    if (!photo || event.pointerType !== "mouse" || prefersReducedMotion()) return
    const rect = photo.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    photo.style.setProperty("--tilt-x", `${((.5 - y) * 9).toFixed(2)}deg`)
    photo.style.setProperty("--tilt-y", `${((x - .5) * 9).toFixed(2)}deg`)
    photo.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`)
    photo.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`)
    photo.dataset.tilting = ""
  }
  const settle = () => {
    const photo = photoRef.current
    if (!photo) return
    for (const property of ["--tilt-x", "--tilt-y"]) photo.style.removeProperty(property)
    delete photo.dataset.tilting
  }

  return <aside className="profile-rail" aria-labelledby="profile-name">
    <div className="profile-photo-wrap enter" style={enter(0)}>
      <div className="profile-photo" ref={photoRef} onPointerMove={tilt} onPointerLeave={settle}>
        <img id="avatar" ref={imageRef} src={profile.avatar} srcSet={`${profile.avatarSmall} 256w, ${profile.avatar} 460w`} sizes="(max-width: 820px) 112px, 248px" alt={lang === "en" ? "Jialei-03 GitHub avatar" : "Jialei-03 的 GitHub 头像"} width="248" height="248" fetchPriority="high" hidden={imageFailed} onError={() => setImageFailed(true)} />
        {imageFailed && <span className="photo-fallback" aria-label="Jialei Li">JL</span>}
      </div>
    </div>
    <div className="profile-identity enter" style={enter(1)}>
      <h1 id="profile-name">{profile.name[lang]}</h1>
      <p className="other-name" lang={lang === "en" ? "zh-CN" : "en"}>{profile.otherName[lang]}</p>
    </div>
    <ul className="profile-roles enter" style={enter(2)}>
      {profile.roles.map((role) => <li key={role.href}>
        <a href={role.href} onClick={onNavigate}><strong>{role.title[lang]}</strong><span>{role.place[lang]}</span></a>
      </li>)}
    </ul>
    <ul className="profile-links enter" style={enter(3)}>
      <li><a href={`mailto:${profile.email}`}><IconMail aria-hidden="true" />{profile.email}</a></li>
      <li><a href={profile.github} target="_blank" rel="noreferrer"><IconBrandGithub aria-hidden="true" />github.com/Jialei-03</a></li>
    </ul>
  </aside>
}
