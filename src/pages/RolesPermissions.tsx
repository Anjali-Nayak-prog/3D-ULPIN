import { useState } from 'react'
import { Check, Shield, ShieldCheck, ShieldOff, Users } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import type { Role } from '../types/common'
import { cn } from '../utils/helpers'

const availablePermissions = [
  { id: 'properties:read', label: 'Read properties', group: 'Properties' },
  { id: 'properties:write', label: 'Edit property records', group: 'Properties' },
  { id: 'ulpin:issue', label: 'Issue ULPINs', group: 'ULPIN' },
  { id: 'ulpin:verify', label: 'Verify 3D volumes', group: 'ULPIN' },
  { id: 'validation:manage', label: 'Manage conflicts', group: 'Validation' },
  { id: 'ai:run', label: 'Run AI pipelines', group: 'AI' },
  { id: 'reports:generate', label: 'Generate reports', group: 'Reports' },
  { id: 'users:manage', label: 'Manage users', group: 'Administration' },
  { id: 'system:manage', label: 'System settings', group: 'Administration' },
  { id: 'audit:view', label: 'View audit logs', group: 'Security' },
]

const initialRoles: Role[] = [
  { id: 'r1', name: 'Super Admin', description: 'Full system access including users, security and settings.', memberCount: 1, permissions: ['*'], color: '#f87171' },
  { id: 'r2', name: 'Admin', description: 'Manages properties, ULPIN issuance and validation.', memberCount: 4, permissions: ['properties:read', 'properties:write', 'ulpin:issue', 'validation:manage', 'reports:generate', 'users:manage'], color: '#fb923c' },
  { id: 'r3', name: 'Officer', description: 'Recommends verifications, resolves conflicts on the ground.', memberCount: 18, permissions: ['properties:read', 'ulpin:verify', 'validation:manage'], color: '#60a5fa' },
  { id: 'r4', name: 'Analyst', description: 'Runs AI models, analytics and report generation.', memberCount: 6, permissions: ['properties:read', 'ai:run', 'reports:generate'], color: '#c084fc' },
  { id: 'r5', name: 'Viewer', description: 'Read-only access to cadastral records and maps.', memberCount: 22, permissions: ['properties:read'], color: '#94a3b8' },
]

export function RolesPermissions() {
  const toast = useToast()
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [editingId, setEditingId] = useState<string | null>(null)

  const activeRole = roles.find((r) => r.id === editingId) ?? roles[0]
  const activePermissions = activeRole.permissions

  const toggleEdit = (role: Role) => setEditingId((current) => (current === role.id ? null : role.id))

  const togglePermission = (permissionId: string) => {
    const target = roles.find((r) => r.id === activeRole.id)
    if (!target) return
    const next = target.permissions.includes(permissionId)
      ? target.permissions.filter((p) => p !== permissionId)
      : [...target.permissions, permissionId]
    setRoles((list) => list.map((r) => (r.id === target.id ? { ...r, permissions: next } : r)))
  }

  const save = () => {
    toast.success('Role saved', `${activeRole.name} permissions updated.`)
    setEditingId(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Roles & Permissions" subtitle="Role-based access control for the 3D cadastre" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-3">
          {roles.map((role) => {
            const active = role.id === activeRole.id
            return (
              <button
                key={role.id}
                onClick={() => toggleEdit(role)}
                className={cn(
                  'w-full rounded-xl border p-4 text-left transition-all duration-200',
                  active
                    ? 'border-primary-400/40 bg-primary-500/10 shadow-glow-sm'
                    : 'border-white/[0.07] bg-navy-900/60 hover:border-white/[0.14]',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                    {role.name}
                  </span>
                  {role.permissions.includes('*') && <ShieldCheck size={15} className="text-red-400" />}
                </div>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{role.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                  <Users size={11} />
                  {role.memberCount} members
                  <span className="ml-auto rounded-md border border-white/[0.06] px-1.5 py-0.5 font-mono">
                    {role.permissions.length} grants
                  </span>
                </div>
              </button>
            )
          })}
          <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Create role', 'Custom role builder opens in the next release.')}>
            + New role
          </Button>
        </div>

        <Card
          className="xl:col-span-2"
          title={activeRole.name}
          subtitle="Permission matrix"
          action={
            <div className="flex items-center gap-2">
              <Badge tone="slate">
                {activePermissions.includes('*') ? 'Full access' : `${activePermissions.filter((p) => p !== '*').length} of ${availablePermissions.length} grants`}
              </Badge>
            </div>
          }
        >
          {activePermissions.includes('*') ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <Shield size={18} className="shrink-0 text-red-400" />
              <div>
                <p className="text-xs font-semibold text-red-300">Unrestricted access</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                  This role holds every permission in the system. Use with care — it bypasses all
                  workflow gates and audit scoping.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {availablePermissions.map((permission) => {
                const granted = activePermissions.includes(permission.id)
                return (
                  <button
                    key={permission.id}
                    onClick={() => togglePermission(permission.id)}
                    className={cn(
                      'flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all duration-150',
                      granted
                        ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]',
                    )}
                  >
                    <div className="min-w-0">
                      <p className={cn('text-xs font-medium', granted ? 'text-emerald-300' : 'text-slate-300')}>
                        {permission.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-600">{permission.id}</p>
                    </div>
                    <span
                      className={cn(
                        'flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border',
                        granted ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' : 'border-white/[0.1] text-transparent',
                      )}
                    >
                      <Check size={13} />
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldOff size={13} />
              Changes apply to all members of this role.
            </span>
            <Button size="sm" onClick={save}>
              Save permissions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}