import { Globe, Building2, Network } from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'

export function SolutionSection() {
  const ref = useReveal()

  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-[#080d1a]/40 py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary-500/[0.06] blur-[120px]"
        aria-hidden="true"
      />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            The Solution
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            One Spatial Identity.
            <br />
            <span className="text-gradient-blue-cyan">Every Dimension.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 lg:text-lg">
            3D ULPIN unifies every physical layer of a city into a single,
            queryable volumetric identity.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Surface */}
          <article
            className="reveal feature-card landing-surface group rounded-3xl p-7 lg:p-8"
            style={revealStyle(0)}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.15)]">
              <Globe size={22} className="text-emerald-400" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">Surface</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Accurately identify land parcels, property boundaries, roads and
              surface-level infrastructure.
            </p>
            <SurfaceVisual />
          </article>

          {/* Vertical */}
          <article
            className="reveal feature-card landing-surface group rounded-3xl p-7 lg:p-8"
            style={revealStyle(120)}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_18px_rgba(6,182,212,0.15)]">
              <Building2 size={22} className="text-cyan-400" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">Vertical</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Map multi-storey buildings, floors, apartments, parking spaces and
              volumetric ownership rights.
            </p>
            <VerticalVisual />
          </article>

          {/* Underground */}
          <article
            className="reveal feature-card landing-surface group rounded-3xl p-7 lg:p-8"
            style={revealStyle(240)}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 shadow-[0_0_18px_rgba(139,92,246,0.15)]">
              <Network size={22} className="text-purple-400" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">Underground</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Map water pipelines, sewer networks, electricity infrastructure
              and underground transit systems.
            </p>
            <UndergroundVisual />
          </article>
        </div>
      </div>
    </section>
  )
}

function SurfaceVisual() {
  return (
    <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1c]">
      <div className="landing-grid-solid absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 grid w-5/6 -translate-x-1/2 -translate-y-1/2 grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded border border-emerald-400/20 bg-emerald-500/[0.05] transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ))}
      </div>
      <span className="absolute left-3 top-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
        Land Parcels
      </span>
    </div>
  )
}

function VerticalVisual() {
  return (
    <div className="relative mt-6 flex aspect-[16/9] items-end justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1c]">
      <div className="relative flex flex-col items-center" style={{ height: '92%' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-28 rounded-t border border-cyan-400/25 bg-cyan-500/[0.07] transition-all duration-500 hover:w-32 hover:bg-cyan-500/[0.14]"
            style={{
              height: `${100 / 5}%`,
              marginBottom: '3px',
              transform: `scaleX(${1 - i * 0.06})`,
            }}
          />
        ))}
        <div className="w-32 shrink-0 rounded border border-white/10 bg-white/[0.04] py-1 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Parcel
        </div>
      </div>
      <span className="absolute left-3 top-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-400">
        Floor Stack
      </span>
    </div>
  )
}

function UndergroundVisual() {
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b']
  return (
    <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1c]">
      <div className="landing-grid-solid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6">
        {colors.map((color, i) => (
          <div
            key={color}
            className="relative h-2 rounded-full transition-all duration-500 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
              opacity: 0.55 + i * 0.2,
            }}
            aria-hidden="true"
          >
            <span
              className="absolute -top-1 h-4 w-4 rounded-full border-2"
              style={{ borderColor: color, left: `${20 + i * 22}%` }}
            />
          </div>
        ))}
      </div>
      <span className="absolute left-3 top-3 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-purple-400">
        Utility Networks
      </span>
    </div>
  )
}