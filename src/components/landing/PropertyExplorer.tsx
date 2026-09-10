import { useState } from 'react'
import {
  Globe,
  Building2,
  Layers,
  Grid3x3 as Units,
  ChevronsDown,
} from 'lucide-react'
import { useReveal } from './useReveal'
import { cn } from '../../utils/helpers'

type Mode = 'surface' | 'building' | 'floors' | 'units' | 'underground'

const MODES: { id: Mode; label: string; icon: typeof Globe }[] = [
  { id: 'surface', label: 'SURFACE', icon: Globe },
  { id: 'building', label: 'BUILDING', icon: Building2 },
  { id: 'floors', label: 'FLOORS', icon: Layers },
  { id: 'units', label: 'UNITS', icon: Units },
  { id: 'underground', label: 'UNDERGROUND', icon: ChevronsDown },
]

const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b']

export function PropertyExplorer() {
  const ref = useReveal()
  const [mode, setMode] = useState<Mode>('building')

  return (
    <section
      id="explorer"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/[0.07] blur-[120px]"
        aria-hidden="true"
      />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">
            INTERACTIVE DEMO
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore Property{' '}
            <span className="text-gradient-blue-cyan">Beyond the Surface.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Switch between each spatial layer of a single property.
          </p>
        </div>

        <div className="reveal landing-surface mt-14 rounded-3xl p-6 lg:p-8">
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Property layers">
            {MODES.map((m) => {
              const Icon = m.icon
              const isActive = mode === m.id
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300',
                    isActive
                      ? 'border-primary-400/60 bg-primary-500/15 text-white shadow-glow-sm'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200',
                  )}
                >
                  <Icon size={14} className={isActive ? 'text-cyan-400' : ''} />
                  {m.label}
                </button>
              )
            })}
          </div>

          {/* Visual */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060b14]">
            <div className="landing-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative flex h-[440px] items-center justify-center sm:h-[520px]">
              <BuildingCutaway mode={mode} />
            </div>
            {/* Legend */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.06] bg-[#060b14]/80 px-4 py-2 backdrop-blur">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {mode === 'surface' && 'Land Parcel — Surface Layer'}
                {mode === 'building' && 'Full building volume'}
                {mode === 'floors' && 'Floors exploded'}
                {mode === 'units' && 'Individual apartment units'}
                {mode === 'underground' && 'Utilities below ground'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BuildingCutaway({ mode }: { mode: Mode }) {
  const showFloors = mode === 'floors' || mode === 'building' || mode === 'units'
  const showUnits = mode === 'units'
  const showUnderground = mode === 'underground' || mode === 'building'
  const isUndergroundMode = mode === 'underground'

  return (
    <div className="relative flex w-full max-w-[340px] items-end" style={{ height: 420 }}>
      {/* ---- Underground (below baseline) ---- */}
      <div
        className="absolute bottom-0 left-1/2 w-3/4 max-w-[224px] -translate-x-1/2 transition-all duration-700"
        style={{
          opacity: showUnderground ? 1 : 0,
          transform: `translateY(${
            isUndergroundMode ? '10px' : '60px'
          }) translateX(-50%)`,
          transitionDelay: isUndergroundMode ? '0ms' : '200ms',
          top: '58%',
        }}
      >
        <div className="space-y-2" aria-hidden="true">
          <div className="h-4 rounded border border-dashed border-cyan-400/50 bg-cyan-500/[0.08]" />
          <div className="h-4 rounded border border-dashed border-purple-400/50 bg-purple-500/[0.08]" />
          <div className="h-4 rounded border border-dashed border-orange-400/50 bg-orange-500/[0.08]" />
        </div>
        <span className="mt-2 block text-center text-[9px] font-semibold uppercase tracking-widest text-slate-500">
          Water · Sewer · Metro
        </span>
      </div>

      {/* ---- Baseline (land parcel) ---- */}
      <div
        className="absolute bottom-[42%] left-1/2 w-full max-w-[256px] -translate-x-1/2 rounded-xl border-2 border-emerald-400/50 transition-all duration-700"
        style={{
          background: 'rgba(16,185,129,0.08)',
          boxShadow: mode === 'surface' ? '0 0 24px rgba(16,185,129,0.35)' : '0 0 10px rgba(16,185,129,0.12)',
        }}
      >
        <div className="px-4 py-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-400">
            Land Parcel
          </p>
          {mode === 'surface' && (
            <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-5 rounded border border-emerald-400/20 bg-emerald-500/[0.06]" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---- Building above ground ---- */}
      <div
        className="absolute bottom-[50%] left-1/2 w-[70%] max-w-[208px] origin-bottom -translate-x-1/2 transition-all duration-700"
        style={{
          opacity: showFloors ? 1 : 0,
          transform: `scaleY(${showFloors ? 1 : 0.05}) translateX(-50%)`,
          transformOrigin: 'bottom',
        }}
      >
        <div className="relative space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-t border border-cyan-400/30"
              style={{
                background: `linear-gradient(135deg, ${colors[i % colors.length]}22, rgba(15,23,38,0.25))`,
                height: 52,
                overflow: 'hidden',
                transition: 'all 0.5s ease',
                marginLeft: i * 4,
                marginRight: i * 4,
                transform: showUnits ? `translateX(${(i % 2 === 0 ? 1 : -1) * 10}px)` : 'none',
              }}
            >
              {showUnits && (
                <div className="grid h-full grid-cols-2 gap-1 p-1.5" aria-hidden="true">
                  {Array.from({ length: 4 }).map((_, u) => (
                    <div
                      key={u}
                      className="flex items-center justify-center rounded border border-white/10 bg-white/[0.03] text-[8px] font-semibold text-slate-400 hover:bg-cyan-400/20"
                    >
                      {i * 100 + u + 1 + 100}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Roof */}
        <div className="mt-1 h-3 rounded-t bg-gradient-to-r from-cyan-400/40 to-blue-400/40" aria-hidden="true" />
      </div>

      {/* ---- Ground line ---- */}
      <div className="absolute bottom-[42%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" aria-hidden="true" />

      <span
        className="absolute right-3 top-2 rounded-full border border-white/10 bg-[#060b14]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-500 backdrop-blur"
        aria-hidden="true"
      >
        Cutaway · {mode.toUpperCase()}
      </span>
    </div>
  )
}