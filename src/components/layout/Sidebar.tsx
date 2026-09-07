import { NavLink, useLocation } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Bell,
  Box,
  ChevronLeft,
  Database,
  FileText,
  Fingerprint,
  HelpCircle,
  LayoutDashboard,
  Map,
  ScrollText,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
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
    title: 'Main',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      { label: '3D Cadastral Map', to: '/map', icon: Map },
      { label: 'Property Search', to: '/properties', icon: Database },
      { label: 'ULPIN Generator', to: '/ulpin-generator', icon: Fingerprint },
      { label: 'Data Management', to: '/data-management', icon: Box },
      { label: 'AI Processing', to: '/ai-processing', icon: Sparkles },
      { label: 'Validation & Conflicts', to: '/validation', icon: ShieldAlert, badge: 24 },
      { label: 'Analytics', to: '/analytics', icon: BarChart3 },
      { label: 'Reports', to: '/reports', icon: FileText },
      { label: 'Notifications', to: '/notifications', icon: Bell, badge: 8 },
    ],
  },
  {
    title: 'Admin Panel',
    items: [
      { label: 'User Management', to: '/users', icon: Users },
      { label: 'Roles & Permissions', to: '/roles', icon: Shield },
      { label: 'System Settings', to: '/settings', icon: Settings },
      { label: 'Audit Logs', to: '/audit-logs', icon: ScrollText },
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
  const location = useLocation()

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-3 px-4 pt-5 pb-6', collapsed && 'justify-center px-2')}>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/40">
          <Box size={20} className="text-primary-400" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-[0.18em] text-white">3D ULPIN</h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Cadastral System
            </p>
          </div>
        )}
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
              {group.items.map((item) => {
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onCloseMobile}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30 shadow-glow-sm'
                          : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      <item.icon
                        size={17}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300',
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge ? (
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                            isActive
                              ? 'bg-primary-500/20 text-primary-300'
                              : 'bg-red-500/10 text-red-400',
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] px-3 py-3">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/settings"
              title={collapsed ? 'Help & Support' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white',
                collapsed && 'justify-center px-2',
              )}
            >
              <HelpCircle size={17} className="shrink-0 text-slate-500" />
              {!collapsed && <span>Help & Support</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              title={collapsed ? 'System Status' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white',
                collapsed && 'justify-center px-2',
              )}
            >
              <Activity size={17} className="shrink-0 text-slate-500" />
              {!collapsed && <span className="flex-1">System Status</span>}
              {!collapsed && (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                  Online
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      <button
        onClick={onToggleCollapse}
        className={cn(
          'mx-3 mb-4 flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] py-2 text-xs text-slate-400 transition-colors hover:border-primary-400/30 hover:text-primary-300',
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
          'glass-strong fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.06] transition-all duration-300 lg:block',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="glass-strong absolute inset-y-0 left-0 w-72 border-r border-white/[0.08] shadow-2xl animate-slide-in">
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
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