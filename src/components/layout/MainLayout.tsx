import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '../../utils/helpers'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <Header onToggleSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 pb-10 pt-6 lg:px-6">
          <Outlet />
        </main>

        <footer className="border-t border-white/[0.06] px-4 py-4 lg:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-slate-600 sm:flex-row">
            <p>
              3D ULPIN · Vertical Property Mapping System · Pune Municipal
              Corporation
            </p>
            <p>v1.0.0 — Demo build 2026</p>
          </div>
        </footer>
      </div>
    </div>
  )
}