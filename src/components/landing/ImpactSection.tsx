import { Fingerprint, ShieldCheck, Boxes, Landmark } from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'

const IMPACTS = [
  {
    num: '01',
    icon: Fingerprint,
    title: 'Unified Property Identity',
    desc: 'Every property volume receives a unique spatial identity.',
    accent: '#3b82f6',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Reduced Ownership Conflicts',
    desc: 'Detect overlaps before they become disputes.',
    accent: '#10b981',
  },
  {
    num: '03',
    icon: Boxes,
    title: 'Smarter Infrastructure Planning',
    desc: 'Understand surface and underground assets together.',
    accent: '#06b6d4',
  },
  {
    num: '04',
    icon: Landmark,
    title: 'Future-Ready Governance',
    desc: 'Build scalable cadastral systems for growing cities.',
    accent: '#8b5cf6',
  },
]

export function ImpactSection() {
  const ref = useReveal()

  return (
    <section className="relative overflow-hidden bg-[#080d1a]/40 py-24 lg:py-32">
      <div className="landing-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-300">
            THE IMPACT
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Better Maps. <span className="text-gradient-blue-cyan">Smarter Cities.</span>{' '}
            Fewer Conflicts.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACTS.map((impact, i) => {
            const Icon = impact.icon
            return (
              <div
                key={impact.num}
                className="reveal feature-card landing-surface rounded-2xl p-7"
                style={revealStyle(i * 80)}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-4xl font-extrabold tracking-tight text-white/10">
                    {impact.num}
                  </span>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${impact.accent}44`, background: `${impact.accent}14` }}
                  >
                    <Icon size={18} style={{ color: impact.accent }} />
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{impact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{impact.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}