import { useMemo, useState } from 'react'
import { Mail, MoreHorizontal, Search, UserPlus, Users } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useToast } from '../components/common/Toast'
import type { User, UserRole } from '../types/common'
import { cn } from '../utils/helpers'
import { timeAgo } from '../utils/formatters'

const roleTone: Record<UserRole, 'red' | 'orange' | 'blue' | 'purple' | 'slate'> = {
  'super-admin': 'red',
  admin: 'orange',
  officer: 'blue',
  analyst: 'purple',
  viewer: 'slate',
}

const roleLabel: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  officer: 'Officer',
  analyst: 'Analyst',
  viewer: 'Viewer',
}

const initialUsers: User[] = [
  { id: 'u1', name: 'Arjun Kale', email: 'arjun.kale@gov.in', role: 'super-admin', department: 'Cadastral Directorate', status: 'active', lastActive: '2026-09-07T06:55:00Z', permissions: ['*'] },
  { id: 'u2', name: 'Priya Deshmukh', email: 'priya.d@pune.gov.in', role: 'admin', department: 'GIS Cell', status: 'active', lastActive: '2026-09-07T05:20:00Z', permissions: ['properties:write', 'ulpin:issue', 'users:manage'] },
  { id: 'u3', name: 'Rahul Patil', email: 'rahul.patil@gov.in', role: 'officer', department: 'Survey Office', status: 'active', lastActive: '2026-09-06T18:40:00Z', permissions: ['properties:read', 'ulpin:verify'] },
  { id: 'u4', name: 'Sneha Iyer', email: 'sneha.iyer@analytics.gov.in', role: 'analyst', department: 'Data Analytics', status: 'active', lastActive: '2026-09-06T16:10:00Z', permissions: ['properties:read', 'reports:generate'] },
  { id: 'u5', name: 'Vikram Mehta', email: 'vikram.mehta@gov.in', role: 'viewer', department: 'Planning Authority', status: 'active', lastActive: '2026-09-05T12:30:00Z', permissions: ['properties:read'] },
  { id: 'u6', name: 'Kiran Joshi', email: 'kiran.joshi@gov.in', role: 'officer', department: 'Revenue Dept.', status: 'invited', lastActive: '', permissions: ['properties:read'] },
  { id: 'u7', name: 'Anita Rao', email: 'anita.rao@gov.in', role: 'admin', department: 'IT Services', status: 'inactive', lastActive: '2026-08-20T09:00:00Z', permissions: ['system:manage'] },
]

export function UserManagement() {
  const toast = useToast()
  const [users] = useState<User[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (roleFilter === 'all' || u.role === roleFilter) &&
          (query === '' ||
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())),
      ),
    [users, query, roleFilter],
  )

  const inviteUser = () => toast.info('Invite flow', 'Opening secured invite portal for new officials.')
  const openMenu = (user: User) => toast.info('More actions', `${user.name} — role, permissions and activity tools.`)

  const activeCount = users.filter((u) => u.status === 'active').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management"
        subtitle="Manage officials, roles and access to the cadastral register"
      >
        <span className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-navy-900 px-3 py-2 text-xs text-slate-400">
          <Users size={14} />
          {activeCount} active
        </span>
        <Button size="sm" onClick={inviteUser}>
          <UserPlus size={14} />
          Invite user
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-navy-900/70 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="h-9 w-full rounded-lg border border-white/10 bg-navy-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-primary-400/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <RoleChip label="All" active={roleFilter === 'all'} onClick={() => setRoleFilter('all')} />
          {(Object.keys(roleLabel) as UserRole[]).map((role) => (
            <RoleChip key={role} label={roleLabel[role]} active={roleFilter === role} onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)} />
          ))}
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-white/[0.05]">
          {filtered.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 font-semibold text-primary-300">
                  {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{user.name}</p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-slate-500">
                    <Mail size={11} />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden w-32 truncate text-xs text-slate-500 lg:block">{user.department}</span>
                <Badge tone={roleTone[user.role]}>{roleLabel[user.role]}</Badge>
                <Badge tone={statusTone(user.status)}>{capitalize(user.status)}</Badge>
                <span className="hidden w-20 text-right text-[11px] text-slate-600 sm:block">
                  {user.lastActive ? `active ${timeAgo(user.lastActive)}` : '—'}
                </span>
                <button onClick={() => openMenu(user)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-slate-500 transition-colors hover:text-white">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-xs text-slate-500">No users match the current filters.</p>
        )}
      </Card>
    </div>
  )
}

function statusTone(status: User['status']): 'green' | 'amber' | 'slate' {
  return status === 'active' ? 'green' : status === 'invited' ? 'amber' : 'slate'
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function RoleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150',
        active ? 'border-primary-400/50 bg-primary-500/15 text-primary-300' : 'border-white/[0.07] text-slate-500 hover:text-slate-300',
      )}
    >
      {label}
    </button>
  )
}