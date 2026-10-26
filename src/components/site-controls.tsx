import { useEffect, useState, type MouseEvent } from "react"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Language } from "@/data/site"
import { withViewTransition } from "@/lib/motion"

function readPreference(key: string) {
  try { return localStorage.getItem(key) } catch { return null }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Preferences remain usable in memory. */ }
}

function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.dataset.theme = dark ? "dark" : "light"
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0e1116" : "#ffffff")
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>("en")
  useEffect(() => {
    if (readPreference("lang") === "zh") setLang("zh")
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
    document.documentElement.dataset.lang = lang
    document.title = lang === "zh" ? "李嘉磊 · 学术主页" : "Jialei Li · Academic Homepage"
  }, [lang])
  const toggleLanguage = () => {
    const next = lang === "en" ? "zh" : "en"
    savePreference("lang", next)
    withViewTransition("language", () => setLang(next))
  }
  return { lang, toggleLanguage }
}

export function SiteControls({ lang, toggleLanguage }: { lang: Language; toggleLanguage: () => void }) {
  const [dark, setDark] = useState<boolean | null>(null)
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)")
    const preference = readPreference("theme")
    setDark(preference ? preference === "dark" : media.matches)
    const followSystem = (event: MediaQueryListEvent) => {
      if (!readPreference("theme")) setDark(event.matches)
    }
    media.addEventListener("change", followSystem)
    return () => media.removeEventListener("change", followSystem)
  }, [])
  useEffect(() => {
    if (dark !== null) applyTheme(dark)
  }, [dark])

  // The new theme spreads outward in a circle from the toggle.
  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !dark
    savePreference("theme", next ? "dark" : "light")
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const root = document.documentElement.style
    root.setProperty("--vt-x", `${x}px`)
    root.setProperty("--vt-y", `${y}px`)
    root.setProperty("--vt-r", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`)
    withViewTransition("theme", () => {
      applyTheme(next)
      setDark(next)
    })
  }

  const themeLabel = lang === "zh"
    ? (dark ? "切换到浅色模式" : "切换到深色模式")
    : (dark ? "Switch to light mode" : "Switch to dark mode")
  const languageLabel = lang === "en" ? "切换到中文" : "Switch to English"

  return <div className="site-controls">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" id="theme-toggle" aria-label={themeLabel} onClick={toggleTheme}>
          <span className="theme-icon" key={dark ? "sun" : "moon"}>{dark ? <IconSun /> : <IconMoon />}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{themeLabel}</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" id="lang-toggle" aria-label={languageLabel} onClick={toggleLanguage}>
          {lang === "en" ? "中" : "EN"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{languageLabel}</TooltipContent>
    </Tooltip>
  </div>
}
