import { Link } from 'react-router-dom'
import { LayoutTemplate, Map as MapIcon, Search, FileQuestion } from 'lucide-react'
import { Button } from '../components/common/Button'

const quickLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutTemplate },
  { to: '/map', label: 'Cadastral Map', icon: MapIcon },
  { to: '/properties', label: 'Property Search', icon: Search },
]

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-navy-900 shadow-card">
        <FileQuestion size={34} className="text-primary-400" />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Error 404</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          The route you requested does not exist in the 3D cadastral system. Verify the address or
          return to a known view.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link to="/">
          <Button size="sm">Back to Dashboard</Button>
        </Link>
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Button variant="outline" size="sm">
              <link.icon size={14} />
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}