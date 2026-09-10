import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      el.querySelectorAll<HTMLElement>('.reveal').forEach((n) =>
        n.classList.add('is-visible'),
      )
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    const nodes = el.querySelectorAll<HTMLElement>('.reveal')
    nodes.forEach((n) => observer.observe(n))

    return () => observer.disconnect()
  }, [])

  return ref
}

export function revealStyle(delay = 0): React.CSSProperties {
  return { transitionDelay: `${delay}ms` }
}
