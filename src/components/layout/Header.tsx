import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  ChevronDown,
  Download,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCircle2,
  type LucideIcon,
} from 'lucide-react'
import { SearchInput, type SearchInputHandle } from '../common/SearchInput'
import { getInitials, cn } from '../../utils/helpers'

interface HeaderProps {
  onToggleSidebar: () => void
}

interface MenuItem {
  label: string
  icon: LucideIcon
  action: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<SearchInputHandle>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const pageTitle = getPageTitle(location.pathname)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/properties?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const menuItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: UserCircle2,
      action: () => navigate('/settings'),
    },
    {
      label: 'Account Settings',
      icon: Settings,
      action: () => navigate('/settings'),
    },
    {
      label: 'Manage Roles',
      icon: ShieldCheck,
      action: () => navigate('/roles'),
    },
    {
      label: 'Sign Out',
      icon: LogOut,
      action: () => {
        localStorage.removeItem('ulp3d_token')
        setProfileOpen(false)
      },
    },
  ]

  return (
    <header className="glass-strong sticky top-0 z-30 border-b border-white/[0.06]">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-white/[0.06] p-2 text-slate-300 transition-colors hover:border-primary-400/30 hover:text-white lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="hidden min-w-0 lg:block">
          <h2 className="truncate text-sm font-semibold text-white">{pageTitle}</h2>
          <p className="text-[11px] text-slate-500">Pune Municipal Corporation · Maharashtra</p>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <SearchInput
              ref={searchRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearchChange={(v) => setSearchValue(v)}
              placeholder="Search ULPIN, Owner, Property..."
              className="w-72 lg:w-96"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 lg:inline">
              Ctrl+K
            </kbd>
          </form>

          <button
            className="hidden items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-xs text-slate-400 transition-colors hover:border-white/15 hover:text-white xl:flex"
            title="Date selector"
          >
            <Calendar size={14} className="text-slate-500" />
            <span>Today</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="hidden items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-400 lg:flex"
          >
            <Download size={14} />
            Export Report
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="relative rounded-lg border border-white/[0.06] p-2 text-slate-300 transition-colors hover:border-primary-400/30 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              8
            </span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] py-1.5 pl-1.5 pr-2.5 transition-colors hover:border-white/15"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-ai-500 text-xs font-bold text-white">
                {getInitials('Admin User')}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-medium text-white">Admin User</span>
                <span className="block text-[10px] text-slate-500">Super Admin</span>
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  'hidden text-slate-500 transition-transform duration-200 sm:block',
                  profileOpen && 'rotate-180',
                )}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-navy-900 shadow-2xl animate-slide-up">
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-500">admin@pmc.gov.in</p>
                </div>
                <div className="p-1.5">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <item.icon size={15} className="text-slate-500" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/map': '3D Cadastral Map',
    '/properties': 'Property Search',
    '/ulpin-generator': 'ULPIN Generator',
    '/data-management': 'Data Management',
    '/ai-processing': 'AI Processing',
    '/validation': 'Validation & Conflicts',
    '/analytics': 'Analytics',
    '/reports': 'Reports',
    '/notifications': 'Notifications',
    '/users': 'User Management',
    '/roles': 'Roles & Permissions',
    '/settings': 'System Settings',
    '/audit-logs': 'Audit Logs',
  }
  if (pathname.startsWith('/properties/')) return 'Property Details'
  return map[pathname] ?? 'Dashboard'
}