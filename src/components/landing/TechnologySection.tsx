import {
  Drone,
  Radar,
  Globe,
  Satellite,
  Mountain,
  Building2,
  Cpu,
  Boxes,
} from 'lucide-react'
import { useReveal, revealStyle } from './useReveal'

interface Tech {
  icon: typeof Drone
  title: string
  desc: string
  accent: string
}

const TECHS: Tech[] = [
  { icon: Drone, title: 'Drone Imagery', desc: 'High-resolution aerial mapping.', accent: '#3b82f6' },
  { icon: Radar, title: 'LiDAR / Point Clouds', desc: 'Accurate 3D geometry.', accent: '#06b6d4' },
  { icon: Globe, title: 'GIS Parcel Layers', desc: 'Existing cadastral information.', accent: '#10b981' },
  { icon: Satellite, title: 'GNSS / CORS', desc: 'Precise positioning.', accent: '#8b5cf6' },
  { icon: Mountain, title: 'DEM / DSM', desc: 'Terrain and elevation models.', accent: '#f59e0b' },
  { icon: Building2, title: 'Building Floor Plans', desc: 'Vertical property structure.', accent: '#3b82f6' },
  { icon: Cpu, title: 'AI / ML', desc: 'Automated spatial extraction.', accent: '#06b6d4' },
  { icon: Boxes, title: '3D Spatial Engine', desc: 'Volumetric property modelling.', accent: '#10b981' },
]

export function TechnologySection() {
  const ref = useReveal()

  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-[#080d1a]/40 py-24 lg:py-32"
    >
      {/* Network background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-60">
          <div className="orbit-ring h-full w-full orbit-ring-rotate" />
          <div className="orbit-ring absolute inset-10" />
          <div className="orbit-ring absolute inset-20" />
          <span className="node-pulse absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400" />
          <span className="node-pulse absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-400" />
          <span className="node-pulse absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-400" />
          <span className="node-pulse absolute left-1/3 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-purple-400" />
          <span className="node-pulse absolute left-1/3 bottom-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-orange-400" />
        </div>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
            TECHNOLOGY STACK
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Powered by <span className="text-gradient-blue-cyan">Spatial Intelligence.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Every layer of reality — from airborne data to buried utilities —
            converges into one spatial model.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECHS.map((tech, i) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.title}
                className="reveal feature-card landing-surface group rounded-2xl p-6"
                style={revealStyle(i * 60)}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                  style={{ borderColor: `${tech.accent}44`, background: `${tech.accent}14` }}
                >
                  <Icon size={19} style={{ color: tech.accent }} />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{tech.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{tech.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}