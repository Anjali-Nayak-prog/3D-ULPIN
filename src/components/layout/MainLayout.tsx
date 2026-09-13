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

        <footer className="border-t border-slate-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-center text-[11px] text-slate-600">
            <p>3D ULPIN · Vertical Property Mapping System — Demo Prototype · v1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  )
}