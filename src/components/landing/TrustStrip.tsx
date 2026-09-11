import { Globe, Satellite, Cpu, Radar, Boxes, Boxes as DigitalTwin } from 'lucide-react'

const BADGES = [
  { label: 'GIS', icon: Globe },
  { label: 'LiDAR', icon: Radar },
  { label: 'AI / ML', icon: Cpu },
  { label: 'GNSS', icon: Satellite },
  { label: '3D Spatial', icon: Boxes },
  { label: 'Digital Twin', icon: DigitalTwin },
]

export function TrustStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#080d1a]/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium tracking-wide text-slate-400">
          Built for the Future of{' '}
          <span className="text-white">Urban Land Administration</span>
        </p>

        <div className="marquee-mask mt-6 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-3">
            {[...BADGES, ...BADGES].map((badge, i) => {
              const Icon = badge.icon
              return (
                <div
                  key={`${badge.label}-${i}`}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-primary-400/30 hover:text-white"
                >
                  <Icon size={16} className="text-primary-400" />
                  {badge.label}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}