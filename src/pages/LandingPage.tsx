import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Database,
  Fingerprint,
  Layers,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { HeroCadastralScene } from '../components/landing/HeroCadastralScene'
import { VerticalPropertyScene } from '../components/landing/VerticalPropertyScene'
import { UndergroundScene } from '../components/landing/UndergroundScene'
import { cn } from '../utils/helpers'

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Why 3D?', href: '#why-3d' },
  { label: 'Vertical Property', href: '#vertical' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Underground', href: '#underground' },
]

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-600">
      {children}
    </p>
  )
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-500">{subtitle}</p>}
    </div>
  )
}

const STEPS: { title: string; desc: string; icon: LucideIcon; number: string }[] = [
  { number: '01', title: 'Spatial Data Ingestion', desc: 'GIS parcel records, floor plans, DEM/DSM and LiDAR come together in one cadastral base.', icon: Database },
  { number: '02', title: 'AI Building Extraction', desc: 'Models detect footprints, roof heights and storey counts from imagery and point clouds.', icon: BrainCircuit },
  { number: '03', title: 'Floor Segmentation', desc: 'Each detected volume is split into floor slabs with elevations and usable areas.', icon: Layers },
  { number: '04', title: '3D Parcel Delineation', desc: 'X, Y and Z extents are combined into an enclosed legal 3D parcel volume.', icon: Boxes },
  { number: '05', title: 'Topology Validation', desc: 'Automatic checks catch vertical overlaps, gaps and basement conflicts.', icon: ShieldAlert },
  { number: '06', title: '3D ULPIN Generation', desc: 'A vertical identifier is appended to the parcel ULPIN for every floor and volume.', icon: Fingerprint },
]

const PIPE: { title: string; desc: string; icon: LucideIcon; accent: boolean }[] = [
  { title: 'Data', desc: 'GIS · LiDAR · Floor Plans', icon: Database, accent: false },
  { title: 'AI', desc: 'Extraction · Segmentation', icon: BrainCircuit, accent: false },
  { title: '3D Volume', desc: 'X/Y/Z legal parcels', icon: Boxes, accent: false },
  { title: '3D ULPIN', desc: 'Unique vertical identifier', icon: Fingerprint, accent: true },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      {/* Top nav */}
      <header className="glass-strong sticky top-0 z-40 border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" title="3D ULPIN — Home" className="group flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px hover:opacity-85">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-white shadow-glow-sm transition-colors group-hover:bg-primary-600">
              <Boxes size={18} />
            </span>
            <span className="text-sm font-bold tracking-[0.16em] text-slate-900">
              3D ULPIN
              <span className="ml-2 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-amber-700">
                Prototype
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-glow-sm transition-colors hover:bg-primary-600"
            >
              Launch Platform
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="overview" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-20 lg:grid-cols-2 lg:pt-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Pune Municipal Corporation · Maharashtra · Demo Prototype
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Every plot has an address.
              <span className="block text-primary-600">Now every building does too.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              3D Cadastral Intelligence turns 2D parcels into registered 3D volumes — floors,
              basements and air-rights each carry their own vertical Universal Land Parcel
              Identification Number (3D ULPIN).
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-600"
              >
                Launch Platform
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-[660px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div
                className="w-full bg-slate-50"
                style={{ aspectRatio: '3 / 2' }}
              >
                <HeroCadastralScene />
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  2D parcel → footprint → floors → volume → ULPIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee band */}
      <div className="border-y border-primary-500/20 bg-primary-500/[0.04] py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 font-mono text-[11px] uppercase tracking-[0.24em] text-primary-700">
          <span className="text-slate-900">2D Parcels</span>
          <ArrowRight size={13} />
          <span className="text-slate-900">3D Volumes</span>
          <ArrowRight size={13} />
          <span className="text-slate-900">Vertical Ownership</span>
          <ArrowRight size={13} />
          <span className="rounded bg-primary-500 px-2 py-0.5 font-bold text-white">3D ULPIN</span>
        </div>
      </div>

      {/* Why 3D */}
      <section id="why-3d" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Reveal>
          <SectionLabel>Why 3D?</SectionLabel>
          <SectionHeading
            title="2D parcels can't describe a building"
            subtitle="A 2D cadastre records X and Y once, for the ground. A 3D cadastre also registers Z — elevation, floors, basements and air rights — so every vertical space is an addressable, ownable parcel."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Traditional 2D</p>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500">X · Y</span>
              </div>
              <div className="relative h-44 rounded-lg bg-slate-50 bg-grid">
                <svg viewBox="0 0 400 176" className="h-full w-full" aria-hidden="true">
                  <rect x="40" y="40" width="150" height="100" rx="0" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
                  <rect x="210" y="60" width="140" height="80" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
                  <text x="115" y="95" textAnchor="middle" fontSize="12" fill="#64748b">Plot A</text>
                  <text x="280" y="105" textAnchor="middle" fontSize="12" fill="#64748b">Plot B</text>
                </svg>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] text-slate-500">One record · ground only</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><span className="text-slate-400">—</span> No floor-level ownership records</li>
                <li className="flex gap-2"><span className="text-slate-400">—</span> Basements &amp; air rights invisible</li>
                <li className="flex gap-2"><span className="text-slate-400">—</span> Stacking conflicts unresolved</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full rounded-2xl border border-primary-500/30 bg-white p-6 shadow-glow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">3D Cadastre</p>
                <span className="rounded bg-primary-500/10 px-2 py-0.5 font-mono text-[10px] text-primary-600">X · Y · Z</span>
              </div>
              <div className="relative h-44 rounded-lg bg-slate-50">
                <svg viewBox="0 0 400 176" className="h-full w-full" aria-hidden="true">
                  {/* extruded volume */}
                  <polygon points="180,40 280,70 250,150 150,120" fill="#2563eb" opacity="0.9" />
                  <polygon points="180,40 280,70 280,92 180,62" fill="#60a5fa" />
                  <polygon points="150,120 250,150 250,170 150,142" fill="#1e40af" />
                  <polygon points="180,40 150,120 150,142 180,62" fill="#3b82f6" />
                  <text x="205" y="108" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">F2 · Office</text>
                  <text x="205" y="122" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">F1 · Retail</text>
                  <text x="205" y="138" textAnchor="middle" fontSize="9" fill="#dbeafe">B1 · Parking</text>
                  <line x1="175" y1="62" x2="285" y2="92" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="155" y1="120" x2="255" y2="150" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" />
                </svg>
                <span className="absolute top-3 right-3 rounded bg-primary-500 px-2 py-0.5 font-mono text-[10px] text-white">Z +6 m → +19 m</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><span className="text-primary-600">✓</span> A ULPIN per floor &amp; volume</li>
                <li className="flex gap-2"><span className="text-primary-600">✓</span> Basements &amp; utilities registered</li>
                <li className="flex gap-2"><span className="text-primary-600">✓</span> Vertical overlaps caught in validation</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vertical Property */}
      <section id="vertical" className="border-y border-slate-200 bg-white/60 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionLabel>Vertical Property</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Floor by floor, space becomes property
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                In dense urban land, the same footprint hosts many owners. A 3D ULPIN extends the
                parcel identifier with a vertical axis so each floor — and even the basement sharing
                the footprint — can be searched, registered and validated independently.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 space-y-3">
                {[
                  ['+12.5 m', 'Ground volume', 'Base of the parcel footprint'],
                  ['+19.5 m', 'Top of legal volume', 'Air-rights boundary'],
                  ['−11.0 m', 'Basement extent', 'Underground asset layer'],
                ].map(([v, t, d]) => (
                  <div key={t} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                    <span className="w-16 font-mono text-xs font-semibold text-primary-600">{v}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t}</p>
                      <p className="text-xs text-slate-500">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <VerticalPropertyScene />
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Reveal>
          <SectionLabel>How It Works</SectionLabel>
          <SectionHeading
            title="From raw data to a 3D ULPIN"
            subtitle="A prototype six-step pipeline turns spatial data into verified vertical parcel identifiers."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={(i % 3) * 90}>
              <div
                className={cn(
                  'group relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300',
                  'hover:-translate-y-1 hover:border-primary-400/40 hover:shadow-glow-sm',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <step.icon size={20} />
                  </span>
                  <span className="font-mono text-3xl font-bold text-slate-100">{step.number}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Data → AI → 3D → ULPIN */}
        <Reveal>
          <div className="mt-16 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch">
            {PIPE.map((p, i) => (
              <div key={p.title} className="contents">
                {i > 0 && (
                  <div className="hidden items-center justify-center text-slate-300 sm:flex">
                    <ArrowRight size={18} />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-xl border p-4 text-center shadow-sm',
                    p.accent
                      ? 'border-primary-500/40 bg-primary-500 text-white shadow-glow-sm'
                      : 'border-slate-200 bg-white',
                  )}
                >
                  <p.icon size={18} className={cn('mx-auto', p.accent ? 'text-white' : 'text-primary-600')} />
                  <p className={cn('mt-2 text-sm font-bold', p.accent ? 'text-white' : 'text-slate-900')}>{p.title}</p>
                  <p className={cn('mt-0.5 text-[10px]', p.accent ? 'text-blue-100' : 'text-slate-500')}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Underground */}
      <section id="underground" className="border-y border-slate-200 bg-white/60 scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionLabel>Underground Cadastre</SectionLabel>
            <SectionHeading
              title="The invisible floor"
              subtitle="Basements, metro corridors and utility easements are real property too. A 3D cadastre records them with depth alongside every surface parcel."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mx-auto mt-12 max-w-3xl">
              <UndergroundScene />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-primary-500/[0.05] px-6 py-14 text-center">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
            <div className="relative">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-glow">
                <Sparkles size={24} />
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to map vertical space?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                Open the full 3D cadastral platform to explore vertical properties, underground
                assets and prototype 3D ULPINs — select a property on the dashboard or map to begin.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-600"
                >
                  Launch Platform
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-white">
                <Boxes size={18} />
              </span>
              <div>
                <p className="text-sm font-bold tracking-[0.16em] text-slate-900">3D ULPIN</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Cadastral System</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-primary-600">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <p className="mt-8 border-t border-slate-200 pt-6 text-center text-[11px] leading-relaxed text-slate-500">
            Vertical Property Mapping System — Demo Prototype. Data, ULPIN encodings and statistics are illustrative and not
            real cadastral records.
          </p>
        </div>
      </footer>
    </div>
  )
}