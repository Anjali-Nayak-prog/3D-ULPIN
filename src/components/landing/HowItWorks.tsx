import { useState } from 'react'
import {
  Database,
  Boxes,
  Sparkles,
  ShieldCheck,
  Fingerprint,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'
import { cn } from '../../utils/helpers'

interface Step {
  num: string
  title: string
  icon: typeof Database
  color: string
  details: string[]
  accent: string
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Data Collection',
    icon: Database,
    color: 'blue',
    accent: '#3b82f6',
    details: [
      'Drone Imagery',
      'LiDAR',
      'GIS Layers',
      'GNSS / CORS',
      'DEM / DSM',
      'Floor Plans',
    ],
  },
  {
    num: '02',
    title: 'AI Processing',
    icon: Sparkles,
    color: 'purple',
    accent: '#8b5cf6',
    details: ['Automated Building Extraction', 'Floor Segmentation', 'Object Detection'],
  },
  {
    num: '03',
    title: '3D Reconstruction',
    icon: Boxes,
    color: 'cyan',
    accent: '#06b6d4',
    details: ['Create volumetric property models'],
  },
  {
    num: '04',
    title: 'Topology Validation',
    icon: ShieldCheck,
    color: 'green',
    accent: '#10b981',
    details: ['Overlaps', 'Boundaries', 'Neighbour relationships', 'Ownership conflicts'],
  },
  {
    num: '05',
    title: '3D ULPIN Generated',
    icon: Fingerprint,
    color: 'orange',
    accent: '#f59e0b',
    details: ['Generate a unique spatial identity'],
  },
]

export function HowItWorks() {
  const ref = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[120px]"
        aria-hidden="true"
      />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            The Pipeline
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From Raw Data to a <span className="text-gradient-blue-cyan">Unique 3D Identity.</span>
          </h2>
        </div>

        {/* Desktop pipeline */}
        <div className="relative mt-14 hidden lg:block">
          <div className="flex items-stretch justify-between gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = active === i
              return (
                <div key={step.title} className="flex flex-1 flex-col">
                  <button
                    onClick={() => setActive(i)}
                    className={cn(
                      'pipeline-step group relative flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-300',
                      isActive
                        ? 'border-primary-400/50 bg-primary-500/[0.08] shadow-glow-sm -translate-y-1'
                        : 'border-white/[0.06] bg-white/[0.02] hover:-translate-y-1 hover:border-primary-400/30 hover:bg-white/[0.04]',
                    )}
                    aria-pressed={isActive}
                  >
                    <span
                      className={cn(
                        'pipeline-dot flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                        isActive
                          ? 'text-white'
                          : 'border-white/10 bg-white/[0.04] text-slate-400',
                      )}
                      style={
                        isActive
                          ? {
                              borderColor: `${step.accent}66`,
                              background: `${step.accent}22`,
                              color: '#fff',
                            }
                          : undefined
                      }
                    >
                      <Icon size={20} />
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: isActive ? step.accent : '#64748b' }}
                    >
                      Step {step.num}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {step.title}
                    </span>
                    {isActive && (
                      <ul className="mt-1 space-y-1.5">
                        {step.details.map((d) => (
                          <li
                            key={d}
                            className="flex items-center gap-1.5 text-xs text-slate-400"
                          >
                            <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>

                  {i < STEPS.length - 1 && (
                    <div className="pipeline-connector relative mx-auto h-6 w-px flex-1 overflow-visible">
                      <div
                        className={cn(
                          'pipeline-line absolute inset-0 w-px transition-all duration-500',
                          active >= i
                            ? 'bg-gradient-to-b from-cyan-400 to-primary-500'
                            : 'bg-white/[0.08]',
                        )}
                      />
                      <ArrowDown
                        size={14}
                        className={cn(
                          'absolute -bottom-0.5 left-1/2 -translate-x-1/2 transition-colors',
                          active >= i ? 'text-cyan-400' : 'text-slate-600',
                        )}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile/tablet vertical timeline */}
        <div className="relative mt-12 lg:hidden">
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-white/[0.08]" aria-hidden="true" />
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = active === i
              return (
                <div key={step.title} className="relative pl-12">
                  <span
                    className={cn(
                      'absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-all',
                      isActive
                        ? 'scale-110'
                        : 'border-white/10 bg-white/[0.04]',
                    )}
                    style={
                      isActive
                        ? {
                            borderColor: `${step.accent}66`,
                            background: `${step.accent}22`,
                            color: '#fff',
                          }
                        : { color: '#64748b' }
                    }
                  >
                    <Icon size={18} />
                  </span>
                  <button
                    onClick={() => setActive(i)}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-all duration-300',
                      isActive
                        ? 'border-primary-400/40 bg-primary-500/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02]',
                    )}
                    aria-expanded={isActive}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-200">
                        <span
                          className="mr-2 font-mono text-[10px] uppercase tracking-widest"
                          style={{ color: step.accent }}
                        >
                          {step.num}
                        </span>
                        {step.title}
                      </span>
                      <ArrowDown
                        size={14}
                        className={cn(
                          'text-slate-500 transition-transform',
                          isActive && 'rotate-180 text-cyan-400',
                        )}
                      />
                    </div>
                    {isActive && (
                      <ul className="mt-3 space-y-1.5">
                        {step.details.map((d) => (
                          <li
                            key={d}
                            className="flex items-center gap-2 text-xs text-slate-400"
                          >
                            <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="reveal mt-12 flex justify-center" style={revealStyle(200)}>
          <span className="inline-flex items-center gap-3 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3 font-mono text-sm font-semibold tracking-wider text-orange-300">
            <Fingerprint size={16} />
            3D-ULPIN-PN-2026-001245
          </span>
        </div>
      </div>
    </section>
  )
}