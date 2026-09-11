import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Menu, X, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Technology', href: '#technology' },
  { label: 'Platform', href: '#platform' },
]

export function LandingNavbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const launch = () => {
    setMobileOpen(false)
    navigate('/dashboard')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.06] bg-[#060b14]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-3"
          aria-label="3D ULPIN home"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary-400/40 bg-primary-500/15 shadow-glow-sm">
            <Box size={20} className="text-primary-400" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-[0.18em] text-white">
              3D ULPIN
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">
              3D Cadastral System
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right action */}
        <div className="flex items-center gap-2">
          <button
            onClick={launch}
            className="hidden items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-all hover:bg-primary-400 active:scale-[0.98] sm:inline-flex"
          >
            Launch Platform
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[#060b14]/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={launch}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Launch Platform
              <ArrowRight size={15} />
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
