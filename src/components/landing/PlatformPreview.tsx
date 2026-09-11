import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Search,
  Fingerprint,
  ArrowUpRight,
  Box,
  Database,
  ShieldCheck,
} from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'

export function PlatformPreview() {
  const ref = useReveal()
  const navigate = useNavigate()

  return (
    <section
      id="platform"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="landing-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            THE PLATFORM
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Complete <span className="text-gradient-blue-cyan">3D Cadastral Platform.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 lg:text-lg">
            From property discovery to 3D ULPIN generation, manage the complete
            lifecycle of modern urban property data.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Dashboard preview */}
          <PreviewCard
            icon={LayoutDashboard}
            title="Dashboard"
            accent="#3b82f6"
            onClick={() => navigate('/dashboard')}
            style={revealStyle(0)}
          >
            <div className="grid grid-cols-3 gap-2" aria-hidden="true">
              {[
                { label: 'Parcels', value: '2.4K', c: 'text-blue-400' },
                { label: 'Buildings', value: '1.8K', c: 'text-cyan-400' },
                { label: 'ULPINs', value: '6.1K', c: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <p className={`text-sm font-bold ${s.c}`}>{s.value}</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-1.5" aria-hidden="true">
              <div className="h-2 w-4/5 rounded bg-blue-400/30" />
              <div className="h-2 w-3/5 rounded bg-cyan-400/30" />
              <div className="h-2 w-2/3 rounded bg-purple-400/30" />
              <div className="h-2 w-1/2 rounded bg-emerald-400/30" />
            </div>
          </PreviewCard>

          {/* Map preview */}
          <PreviewCard
            icon={Map}
            title="3D Cadastral Map"
            accent="#06b6d4"
            onClick={() => navigate('/map')}
            style={revealStyle(80)}
          >
            <div className="relative h-32 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0a0f1c]" aria-hidden="true">
              <div className="landing-grid-solid absolute inset-0" />
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-sm border border-cyan-400/40"
                  style={{
                    width: 36 - i * 5,
                    height: 36 - i * 5,
                    left: `${18 + i * 16}%`,
                    bottom: `${16 + i * 14}%`,
                    background: `rgba(6,182,212,${0.06 + i * 0.04})`,
                    boxShadow: '0 0 12px rgba(6,182,212,0.15)',
                  }}
                />
              ))}
              <span className="absolute bottom-2 left-2 rounded border border-white/10 bg-[#060b14]/80 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-slate-400">
                3D · Underground
              </span>
            </div>
          </PreviewCard>

          {/* Property Search preview */}
          <PreviewCard
            icon={Search}
            title="Property Search"
            accent="#10b981"
            onClick={() => navigate('/properties')}
            style={revealStyle(160)}
          >
            <div aria-hidden="true">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <Search size={13} className="text-slate-500" />
                <span className="text-xs text-slate-500">ULPIN-PN-2026-001245…</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                    <Database size={11} className="text-emerald-400" />
                    Apartment 1201
                    <span className="ml-auto rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-emerald-400">Verified</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] text-slate-500">3D-ULPIN-PN-2026-001245</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                    <Box size={11} className="text-cyan-400" />
                    Commercial Floor
                    <span className="ml-auto rounded bg-cyan-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-cyan-400">Pending</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] text-slate-500">3D-ULPIN-PN-2026-001244</p>
                </div>
              </div>
            </div>
          </PreviewCard>

          {/* ULPIN Generator preview */}
          <PreviewCard
            icon={Fingerprint}
            title="ULPIN Generator"
            accent="#8b5cf6"
            onClick={() => navigate('/ulpin-generator')}
            style={revealStyle(240)}
          >
            <div aria-hidden="true">
              <div className="flex items-center gap-1.5">
                {['Location', 'Type', 'Geometry', 'Extent', 'Generate'].map((s, i) => (
                  <span
                    key={s}
                    className={`flex-1 rounded px-1.5 py-1 text-center text-[8px] font-semibold uppercase tracking-wide ${
                      i < 4 ? 'bg-purple-500/15 text-purple-300' : 'bg-white/[0.04] text-slate-500'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-purple-400/25 bg-purple-500/[0.06] p-3 text-center">
                <p className="font-mono text-xs font-bold tracking-wider text-purple-300">
                  3D-ULPIN-PN-2026-001245
                </p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider text-slate-500">
                  <ShieldCheck size={10} className="text-emerald-400" />
                  Volume validated · No conflicts
                </p>
              </div>
            </div>
          </PreviewCard>
        </div>
      </div>
    </section>
  )
}

interface PreviewCardProps {
  icon: typeof LayoutDashboard
  title: string
  accent: string
  onClick: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}

function PreviewCard({
  icon: Icon,
  title,
  accent,
  onClick,
  children,
  style,
}: PreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="reveal feature-card landing-surface group flex flex-col rounded-2xl p-6 text-left"
      style={style}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{ borderColor: `${accent}44`, background: `${accent}14` }}
          >
            <Icon size={18} style={{ color: accent }} />
          </span>
          <span className="text-base font-bold text-white">{title}</span>
        </span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors group-hover:border-white/20 group-hover:text-white"
          aria-hidden="true"
        >
          <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="flex-1">{children}</div>
      <span
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
        style={{ color: accent }}
      >
        Open Platform
        <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  )
}
