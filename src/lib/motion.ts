import { useEffect, useLayoutEffect, useState, type RefObject } from "react"
import { flushSync } from "react-dom"

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> } }

export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Applies a state change inside a View Transition when the browser supports one. `kind` is
// exposed as html[data-transition] so CSS can pick the animation; otherwise the change is instant.
export function withViewTransition(kind: string, update: () => void) {
  const doc = document as ViewTransitionDocument
  const root = document.documentElement
  // While the attribute is set, CSS can also hold back per-element transitions (see the theme rule).
  root.dataset.transition = kind
  const done = () => {
    if (root.dataset.transition === kind) delete root.dataset.transition
  }
  if (!doc.startViewTransition || prefersReducedMotion()) {
    flushSync(update)
    // Keep the attribute until the new styles have been painted once.
    requestAnimationFrame(() => requestAnimationFrame(done))
    return
  }
  const transition = doc.startViewTransition(() => flushSync(update))
  // A transition interrupted by another one is skipped; the update itself still applies.
  transition.ready.catch(() => {})
  transition.finished.finally(done)
}

// Elements marked data-reveal that start below the fold glide in when they scroll into view.
// Content stays visible when JavaScript is off or reduced motion is requested.
export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return
    const pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]")]
      .filter((element) => element.getBoundingClientRect().top > innerHeight * .92)
    if (!pending.length) return
    const observer = new IntersectionObserver((entries) => {
      let order = 0
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const element = entry.target as HTMLElement
        element.style.setProperty("--reveal-delay", `${Math.min(order++, 6) * 70}ms`)
        element.dataset.reveal = "shown"
        observer.unobserve(element)
      }
    }, { rootMargin: "0px 0px -6% 0px" })
    for (const element of pending) {
      element.dataset.reveal = "pending"
      observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])
}

// Measures the active child of a container so an indicator can slide beneath it.
export function useIndicator(container: RefObject<HTMLElement | null>, selector: string, key: unknown) {
  const [box, setBox] = useState<{ left: number; width: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const active = container.current?.querySelector<HTMLElement>(selector)
      setBox(active ? { left: active.offsetLeft, width: active.offsetWidth } : null)
    }
    measure()
    document.fonts?.ready.then(measure)
    addEventListener("resize", measure)
    return () => removeEventListener("resize", measure)
  }, [container, selector, key])
  return box
}
