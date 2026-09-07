import { useMemo, useState } from 'react'
import { FileClock, Filter, Lock, Search } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import type { AuditLogEntry } from '../types/common'
import { formatDateTime } from '../utils/formatters'
import { cn } from '../utils/helpers'

const initialLogs: AuditLogEntry[] = [
  { id: 'a1', actor: 'arjun.kale@gov.in', action: 'ulpin.issue', target: '2210…0581', category: 'property', severity: 'info', timestamp: '2026-09-07T06:40:00Z', ip: '10.4.12.7' },
  { id: 'a2', actor: 'priority.d@pune.gov.in', action: 'defreezer', target: 'Plot GK-44', category: 'data', severity: 'info', timestamp: '2026-09-07T06:12:00Z', ip: '10.4.12.9' },
  { id: 'a3', actor: 'system', action: 'conflict.autoflag', target: '2200-2026-0707', category: 'property', severity: 'warning', timestamp: '2026-09-07T05:58:00Z', ip: 'internal' },
  { id: 'a4', actor: 'rahul.patil@gov.in', action: 'login.success', target: 'Session 90ac', category: 'auth', severity: 'info', timestamp: '2026-09-07T05:20:00Z', ip: '203.0.113.42' },
  { id: 'a5', actor: 'system', action: 'audit.retention.start', target: 'Log archive', category: 'security', severity: 'info', timestamp: '2026-09-07T00:00:00Z', ip: 'internal' },
  { id: 'a6', actor: 'vikram.mehta@gov.in', action: 'export.create', target: 'quarterly-digest.pdf', category: 'data', severity: 'info', timestamp: '2026-09-06T18:30:00Z', ip: '203.0.113.77' },
  { id: 'a7', actor: 'unknown', action: 'login.failed', target: 'pr_admin', category: 'security', severity: 'critical', timestamp: '2026-09-06T17:15:00Z', ip: '198.51.100.9' },
  { id: 'a8', actor: 'sneha.iyer@analytics.gov.in', action: 'ai.pipeline.run', target: 'Batch #B2416', category: 'system', severity: 'info', timestamp: '2026-09-06T16:00:00Z', ip: '10.4.14.2' },
  { id: 'a9', actor: 'anita.rao@gov.in', action: 'role.update', target: 'Analyst grants', category: 'security', severity: 'warning', timestamp: '2026-09-05T11:40:00Z', ip: '10.4.12.3' },
  { id: 'a10', actor: 'kiran.joshi@gov.in', action: 'profile.invite', target: 'invite#821', category: 'auth', severity: 'info', timestamp: '2026-09-04T09:30:00Z', ip: '203.0.113.120' },
]

const severityIcon = {
  info: FileClock,
  warning: Lock,
  critical: Lock,
}

export function AuditLogs() {
  const [logs] = useState<AuditLogEntry[]>(initialLogs)
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      logs.filter(
        (log) =>
          query === '' ||
          log.actor.toLowerCase().includes(query.toLowerCase()) ||
          log.action.toLowerCase().includes(query.toLowerCase()) ||
          log.target.toLowerCase().includes(query.toLowerCase()),
      ),
    [logs, query],
  )

  const critical = logs.filter((l) => l.severity === 'critical').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable trail of actions across the cadastral system"
      >
        <span className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
          <Lock size={14} />
          {critical} critical events
        </span>
      </PageHeader>

      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-navy-900/70 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action or target…"
            className="h-9 w-full rounded-lg border border-white/10 bg-navy-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-primary-400/50"
          />
        </div>
        <span className="flex items-center gap-1.5 pl-1 text-[11px] text-slate-500">
          <Filter size={12} />
          {filtered.length} of {logs.length} events
        </span>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((log) => {
                const Icon = severityIcon[log.severity]
                return (
                  <tr key={log.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-500">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-300">{log.actor}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-cyan-400">{log.action}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-400">{log.target}</td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <Badge tone="slate">{capitalize(log.category)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <Icon size={11} className={severityClass(log.severity)} />
                        <span className={cn('text-[11px] font-medium', severityClass(log.severity))}>
                          {capitalize(log.severity)}
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-600">{log.ip}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-xs text-slate-500">No audit events match the search.</p>
        )}
      </Card>
    </div>
  )
}

function severityClass(severity: AuditLogEntry['severity']): string {
  return severity === 'critical' ? 'text-red-400' : severity === 'warning' ? 'text-amber-400' : 'text-slate-500'
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}