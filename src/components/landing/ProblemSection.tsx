import { useState } from 'react'
import {
  Map,
  Building2,
  Triangle,
  X,
  Copy,
  CheckCircle2,
  EyeOff,
  GitBranch,
} from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'

const PROBLEMS_2D = [
  { icon: Triangle, label: 'Surface-only identification' },
  { icon: X, label: 'No floor-level ownership mapping' },
  { icon: EyeOff, label: 'Underground infrastructure ignored' },
  { icon: GitBranch, label: 'Difficult conflict detection' },
  { icon: Copy, label: 'Ownership ambiguity' },
]

const BENEFITS_3D = [
  { icon: CheckCircle2, label: 'Surface parcels' },
  { icon: Building2, label: 'Vertical property volumes' },
  { icon: CheckCircle2, label: 'Floor-wise identification' },
  { icon: CheckCircle2, label: 'Underground assets' },
  { icon: Copy, label: 'Spatial conflict detection' },
]

export function ProblemSection() {
  const ref = useReveal()
  const [show3D, setShow3D] = useState(false)

  return (
    <section id="problem" className="relative overflow-hidden py-24 lg:py-32">
      <div className="landing-grid absolute inset-0" aria-hidden="true" />
      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">
            The Challenge
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Cities Grow Vertically.
            <br />
            <span className="text-slate-500">Land Records Didn't.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 lg:text-lg">
            Traditional cadastral systems were designed for surface-level land
            parcels. Modern cities now contain apartments, underground
            utilities, elevated infrastructure and complex ownership rights that
            cannot be represented accurately in 2D.
          </p>
        </div>

        {/* Comparison grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 2D */}
          <div className="reveal landing-surface rounded-3xl p-7 lg:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10">
                <Map size={18} className="text-red-400" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Traditional 2D Records
                </h3>
                <p className="text-xs uppercase tracking-wider text-red-400/80">
                  Flat. Static. Incomplete.
                </p>
              </div>
            </div>

            {/* Flat 2D illustration */}
            <div className="relative mt-6 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1c]">
              <div className="landing-grid-solid absolute inset-0" aria-hidden="true" />
              <div className="relative h-40 w-56 rounded-lg border-2 border-red-400/40 bg-red-500/[0.06]">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-widest text-red-400/70">
                  Parcel
                </span>
                <span
                  className="absolute -right-2 top-1/2 h-8 w-8 -translate-y-1/2 border-y-2 border-r-2 border-red-400/60"
                  aria-hidden="true"
                />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-sm bg-red-500" aria-hidden="true" />
              </div>
            </div>

            <ul className="mt-6 space-y-2.5">
              {PROBLEMS_2D.map((p) => {
                const Icon = p.icon
                return (
                  <li
                    key={p.label}
                    className="flex items-center gap-3 rounded-lg border border-red-400/15 bg-red-500/[0.04] px-3.5 py-2.5 text-sm text-slate-400"
                  >
                    <Icon size={15} className="shrink-0 text-red-400/80" />
                    {p.label}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* 3D (with animated reveal transition) */}
          <div
            ref={(node) => {
              if (node && !show3D) {
                setShow3D(true)
              }
            }}
            className="reveal landing-surface rounded-3xl p-7 lg:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10">
                <Building2 size={18} className="text-emerald-400" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">3D ULPIN System</h3>
                <p className="text-xs uppercase tracking-wider text-emerald-400/80">
                  Volumetric. Layered. Complete.
                </p>
              </div>
            </div>

            {/* L3 illustration with animated layers */}
            <div className="relative mt-6 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1c]">
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  show3D ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-end gap-1" style={{ width: 150, height: 170 }}>
                  {/* Underground */}
                  <div
                    className="h-7 w-full rounded border border-dashed border-orange-400/50 bg-orange-500/[0.07]"
                    style={{ boxShadow: '0 0 14px rgba(245,158,11,0.12)' }}
                  />
                  <div
                    className="h-7 w-full rounded border border-dashed border-purple-400/50 bg-purple-500/[0.07]"
                    style={{ boxShadow: '0 0 14px rgba(139,92,246,0.12)' }}
                  />
                  {/* Ground */}
                  <div className="h-5 w-full rounded border border-emerald-400/40 bg-emerald-500/[0.08]">
                    <span className="flex h-full items-center justify-center text-[8px] font-bold uppercase text-emerald-400">
                      Land
                    </span>
                  </div>
                  {/* Above ground floors */}
                  <div
                    className="h-8 w-full rounded border border-cyan-400/40 bg-cyan-500/[0.08]"
                    style={{ boxShadow: '0 0 14px rgba(6,182,212,0.12)' }}
                  />
                  <div
                    className="h-8 w-full rounded border border-blue-400/40 bg-blue-500/[0.08]"
                    style={{ boxShadow: '0 0 14px rgba(59,130,246,0.12)' }}
                  />
                  <div
                    className="h-8 w-full rounded border border-purple-400/40 bg-purple-500/[0.08]"
                    style={{ boxShadow: '0 0 14px rgba(139,92,246,0.12)' }}
                  />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                3D Model
              </span>
            </div>

            <ul className="mt-6 space-y-2.5">
              {BENEFITS_3D.map((b) => {
                const Icon = b.icon
                return (
                  <li
                    key={b.label}
                    className="flex items-center gap-3 rounded-lg border border-emerald-400/15 bg-emerald-500/[0.04] px-3.5 py-2.5 text-sm text-slate-300"
                  >
                    <Icon size={15} className="shrink-0 text-emerald-400/90" />
                    {b.label}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* 2D → 3D transition label */}
        <div className="reveal mt-10 flex justify-center" style={revealStyle(150)}>
          <span className="inline-flex items-center gap-3 rounded-full border border-primary-400/30 bg-primary-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
            Flat 2D
            <span className="text-cyan-400">→</span>
            3rd Dimension
          </span>
        </div>
      </div>
    </section>
  )
}