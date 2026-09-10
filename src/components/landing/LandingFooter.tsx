import { useNavigate } from 'react-router-dom'
import { Box } from 'lucide-react'

export function LandingFooter() {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-white/[0.06] bg-[#060b14]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-400/40 bg-primary-500/15">
              <Box size={20} className="text-primary-400" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-[0.18em] text-white">3D ULPIN</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">
                3D Cadastral System
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            3D Cadastral &amp; Vertical Property Mapping System
          </p>
        </div>

        {/* Platform links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Platform
          </h3>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: 'Dashboard', to: '/dashboard' },
              { label: '3D Map', to: '/map' },
              { label: 'Property Search', to: '/properties' },
              { label: 'ULPIN Generator', to: '/ulpin-generator' },
            ].map((link) => (
              <li key={link.to}>
                <button
                  onClick={() => navigate(link.to)}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Technology
          </h3>
          <ul className="mt-4 space-y-2.5">
            {['GIS', 'AI/ML', 'LiDAR', 'GNSS'].map((tech) => (
              <li key={tech}>
                <span className="cursor-default text-sm text-slate-400">{tech}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-600 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 3D ULPIN System</p>
          <p className="flex items-center gap-2">
            Built for
            <span className="rounded border border-orange-400/25 bg-orange-500/[0.08] px-2 py-0.5 font-semibold text-orange-400">
              Smart India Hackathon
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}