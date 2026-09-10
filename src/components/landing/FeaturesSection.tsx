import { useNavigate } from 'react-router-dom'
import {
  Map,
  Fingerprint,
  Search,
  Sparkles,
  Building2,
  Network,
  ShieldAlert,
  ShieldCheck,
  FileText,
} from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'
import { cn } from '../../utils/helpers'

interface Feature {
  icon: typeof Map
  title: string
  desc: string
  accent: string
  route?: string
}

const FEATURES: Feature[] = [
  {
    icon: Map,
    title: '3D Cadastral Map',
    desc: 'Visualize surface, vertical and underground property volumes.',
    accent: '#3b82f6',
    route: '/map',
  },
  {
    icon: Fingerprint,
    title: '3D ULPIN Generator',
    desc: 'Generate unique spatial identities.',
    accent: '#06b6d4',
    route: '/ulpin-generator',
  },
  {
    icon: Search,
    title: 'Property Search',
    desc: 'Search by ULPIN, owner, coordinates or property ID.',
    accent: '#10b981',
    route: '/properties',
  },
  {
    icon: Sparkles,
    title: 'AI Processing',
    desc: 'Automated building and floor extraction.',
    accent: '#8b5cf6',
  },
  {
    icon: Building2,
    title: 'Vertical Property Mapping',
    desc: 'Map apartments, floors and volumetric rights.',
    accent: '#06b6d4',
  },
  {
    icon: Network,
    title: 'Underground Asset Mapping',
    desc: 'Visualize utilities and underground infrastructure.',
    accent: '#f59e0b',
  },
  {
    icon: ShieldAlert,
    title: 'Conflict Detection',
    desc: 'Detect overlapping property rights and topology conflicts.',
    accent: '#ef4444',
    route: '/validation',
  },
  {
    icon: ShieldCheck,
    title: 'Spatial Validation',
    desc: 'Validate geometry and neighbour relationships.',
    accent: '#10b981',
    route: '/validation',
  },
  {
    icon: FileText,
    title: 'Reports & Analytics',
    desc: 'Generate property and governance insights.',
    accent: '#3b82f6',
    route: '/analytics',
  },
]

export function FeaturesSection() {
  const ref = useReveal()
  const navigate = useNavigate()

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#080d1a]/40 py-24 lg:py-32"
    >
      <div className="landing-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-300">
            PLATFORM FEATURES
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything Needed to Understand{' '}
            <span className="text-gradient-blue-cyan">Property in 3D.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            A complete toolkit for modern urban property intelligence.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            const Content = (
              <>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{ borderColor: `${feature.accent}44`, background: `${feature.accent}14` }}
                >
                  <Icon size={19} style={{ color: feature.accent }} />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </>
            )
            return (
              <button
                key={feature.title}
                type="button"
                onClick={() => feature.route && navigate(feature.route)}
                tabIndex={feature.route ? 0 : -1}
                className={cn(
                  'reveal feature-card landing-surface group rounded-2xl p-6 text-left',
                  feature.route ? 'cursor-pointer' : 'cursor-default',
                )}
                style={revealStyle(i * 60)}
                aria-label={feature.route ? `${feature.title} (open platform)` : feature.title}
              >
                {Content}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}