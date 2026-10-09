import { useEffect, useState } from "react"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Language } from "@/data/site"

function readPreference(key: string) {
  try { return localStorage.getItem(key) } catch { return null }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Preferences remain usable in memory. */ }
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>("en")
  useEffect(() => {
    if (readPreference("lang") === "zh") setLang("zh")
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
    document.documentElement.dataset.lang = lang
    document.title = "Jialei Li | 李嘉磊"
  }, [lang])
  const toggleLanguage = () => {
    const next = lang === "en" ? "zh" : "en"
    savePreference("lang", next)
    setLang(next)
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
    if (dark === null) return
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#141820" : "#fafbfc")
  }, [dark])

  const themeLabel = lang === "zh"
    ? (dark ? "切换到浅色模式" : "切换到深色模式")
    : (dark ? "Switch to light mode" : "Switch to dark mode")
  const languageLabel = lang === "en" ? "切换到中文" : "Switch to English"

  return <div className="site-controls">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" id="theme-toggle" aria-label={themeLabel} onClick={() => {
          savePreference("theme", dark ? "light" : "dark")
          setDark(!dark)
        }}>
          {dark ? <IconSun data-icon="inline-start" /> : <IconMoon data-icon="inline-start" />}
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
