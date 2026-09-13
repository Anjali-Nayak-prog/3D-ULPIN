import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Fingerprint, Menu } from 'lucide-react'
import { SearchInput, type SearchInputHandle } from '../common/SearchInput'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<SearchInputHandle>(null)

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

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/properties?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <header className="glass-strong sticky top-0 z-30 border-b border-slate-200">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:border-primary-400/30 hover:text-slate-900 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="hidden min-w-0 lg:block">
          <h2 className="truncate text-sm font-semibold text-slate-900">{pageTitle}</h2>
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
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 lg:inline">
              Ctrl+K
            </kbd>
          </form>

          <button
            onClick={() => navigate('/ulpin-generator')}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-600"
          >
            <Fingerprint size={14} />
            Generate 3D ULPIN
          </button>
        </div>
      </div>
    </header>
  )
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/map': '3D Cadastral Map',
    '/properties': 'Property Search',
    '/data-processing': 'Data Processing',
    '/ai-processing': 'AI Processing',
    '/ulpin-generator': 'ULPIN Generator',
    '/validation': 'Spatial Validation',
  }
  if (pathname.startsWith('/properties/')) return 'Property Details'
  return map[pathname] ?? 'Dashboard'
}