import { Link, NavLink } from 'react-router-dom'
import {
  Activity,
  Box,
  Boxes,
  ChevronLeft,
  Database,
  Fingerprint,
  LayoutDashboard,
  Map,
  ShieldAlert,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../utils/helpers'

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Cadastral Workflow',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: '3D Cadastral Map', to: '/map', icon: Map },
      { label: 'Property Search', to: '/properties', icon: Database },
      { label: 'Data Processing', to: '/data-processing', icon: Boxes },
      { label: 'AI Processing', to: '/ai-processing', icon: Sparkles },
      { label: 'ULPIN Generator', to: '/ulpin-generator', icon: Fingerprint },
      { label: 'Spatial Validation', to: '/validation', icon: ShieldAlert },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const content = (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-3 px-4 pt-5 pb-6', collapsed && 'justify-center px-2')}>
      <Link
        to="/"
        onClick={onCloseMobile}
        title="Go to homepage"
        className={cn(
          'group flex items-center gap-3 rounded-xl transition-all duration-200 hover:-translate-y-px hover:opacity-85 focus-visible:outline-none focus-visible:ring-2',
          collapsed && 'justify-center',
        )}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/40 transition-colors group-hover:bg-primary-500/20">
          <Box size={20} className="text-primary-600" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-[0.18em] text-slate-900">3D ULPIN</h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Cadastral System
            </p>
          </div>
        )}
      </Link>
    </div>

      <nav
        className={cn(
          'flex-1 space-y-5 overflow-y-auto px-3 pb-4',
          collapsed && 'px-2',
        )}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary-500/15 text-primary-600 border border-primary-500/30 shadow-glow-sm'
                          : 'border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                        collapsed && 'justify-center px-2',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={17}
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-600',
                          )}
                        />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && item.badge ? (
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                              isActive
                                ? 'bg-primary-500/20 text-primary-600'
                                : 'bg-red-500/10 text-red-600',
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-3 py-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500',
            collapsed && 'justify-center px-2',
          )}
        >
          <Activity size={17} className="shrink-0 text-slate-500" />
          {!collapsed && <span className="flex-1">System Status</span>}
          {!collapsed && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              Online
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onToggleCollapse}
        className={cn(
          'mx-3 mb-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs text-slate-500 transition-colors hover:border-primary-400/30 hover:text-primary-600',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={15}
          className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
        />
        {!collapsed && 'Collapse'}
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'glass-strong fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 transition-all duration-300 lg:block',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="glass-strong absolute inset-y-0 left-0 w-72 border-r border-slate-200 shadow-2xl animate-slide-in">
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}