import { useNavigate } from 'react-router-dom'
import { ArrowRight, Boxes, Fingerprint } from 'lucide-react'
import './landing.css'

const GROUND_LABELS = [
  'Apartment 1201',
  'Apartment 901',
  'Apartment 601',
  'Commercial Floor',
]

const BELOW_LABELS = [
  { label: 'Water Pipeline', color: '#06b6d4' },
  { label: 'Sewer Network', color: '#8b5cf6' },
  { label: 'Metro Tunnel', color: '#f59e0b' },
]

export function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      {/* Background layers */}
      <div className="landing-grid absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full bg-primary-500/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Left content */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-soft" />
            Next-Generation Land Administration
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Land Records,
            <br />
            Reimagined in{' '}
            <span className="text-gradient-blue-cyan">3D</span>.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            A next-generation 3D cadastral platform that uniquely identifies
            surface, vertical, and underground properties for smarter cities and
            conflict-free land governance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-primary-400 active:scale-[0.98]"
            >
              Explore the Platform
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() =>
                document
                  .querySelector('#how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-primary-400/40 hover:text-white"
            >
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8">
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold text-white">
                <Boxes size={18} className="text-cyan-400" />
                3
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                Dimensions
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Surface · Vertical · Underground
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold text-white">
                <span className="inline-block h-4 w-4 rounded-sm border-2 border-purple-400 bg-purple-500/30" />
                AI
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                Powered
              </p>
              <p className="mt-1 text-xs text-slate-600">Automated processing</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold text-white">
                <Fingerprint size={18} className="text-emerald-400" />
                ID
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                Spatial
              </p>
              <p className="mt-1 text-xs text-slate-600">Unique 3D identities</p>
            </div>
          </div>
        </div>

        {/* Right visual */}
        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto flex h-[520px] w-full max-w-[520px] items-center justify-center lg:mx-0 lg:justify-end">
      {/* Glow ring behind */}
      <div className="orbit-ring h-[440px] w-[440px] orbit-ring-rotate opacity-60" aria-hidden="true" />
      <div className="orbit-ring h-[340px] w-[340px] opacity-80" aria-hidden="true" />
      <div className="absolute h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" aria-hidden="true" />

      {/* Side dimension label */}
      <div className="absolute -left-2 top-8 flex -rotate-90 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:left-0">
        <span className="text-emerald-400">Surface</span>
        <span className="text-cyan-400">Vertical</span>
        <span className="text-orange-400">Underground</span>
      </div>

      {/* The scene */}
      <div className="hero-build-anim relative h-[440px] w-full max-w-[300px]">
        <BuildingScene />
      </div>
    </div>
  )
}

function BuildingScene() {
  return (
    <div className="relative flex h-full w-full flex-col">
      {/* ---- Above ground: stacked flats ---- */}
      <div className="relative flex flex-1 flex-col justify-end gap-1.5 px-2 pt-4">
        {GROUND_LABELS.map((label, i) => {
          const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#06b6d4']
          const color = colors[i % colors.length]
          return (
            <div
              key={label}
              className="hero-layer relative h-[52px] rounded-lg border"
              style={{
                borderColor: `${color}44`,
                background: `linear-gradient(135deg, ${color}22, rgba(15,23,38,0.2))`,
                boxShadow: `0 0 16px ${color}22`,
              }}
            >
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-300">
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Land parcel separator */}
      <div
        className="relative mt-2 flex h-11 items-center justify-center rounded-lg border border-emerald-400/40"
        style={{ background: 'rgba(16,185,129,0.08)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Land Parcel
        </span>
        <span className="absolute inset-0 rounded-lg border-t-2 border-emerald-400/20" />
      </div>

      {/* Ground line */}
      <div
        className="relative mt-1 h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
        aria-hidden="true"
      >
        <span
          className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 node-pulse"
          aria-hidden="true"
        />
      </div>

      {/* ---- Below ground: underground layers ---- */}
      <div className="relative flex flex-1 flex-col justify-end gap-1.5 px-2 pb-1 pt-5">
        {BELOW_LABELS.map(({ label, color }) => (
          <div
            key={label}
            className="hero-layer relative flex h-[46px] items-center rounded-lg border border-dashed"
            style={{
              borderColor: `${color}55`,
              background: `linear-gradient(90deg, ${color}18, rgba(15,23,38,0.15))`,
            }}
          >
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
              {label}
            </span>
            <span
              className="absolute right-3 h-2 w-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
