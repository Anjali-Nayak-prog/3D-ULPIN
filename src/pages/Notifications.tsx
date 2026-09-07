import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  FileCheck2,
  Info,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { cn } from '../utils/helpers'
import { timeAgo } from '../utils/formatters'

type NoticeKind = 'conflict' | 'system' | 'approval' | 'update'

interface Notice {
  id: string
  kind: NoticeKind
  title: string
  body: string
  timestamp: string
  read: boolean
}

const initial: Notice[] = [
  { id: 'n1', kind: 'conflict', title: 'Critical conflict detected', body: 'Vertical overlap between ULPIN 2210…0484 and 2210…0511 on plot GK-44, Kothrud.', timestamp: '2026-09-07T06:40:00Z', read: false },
  { id: 'n2', kind: 'approval', title: 'ULPIN issuance approved', body: 'Three volumetric ULPINs in Hinjewadi batch #B2417 are now live.', timestamp: '2026-09-06T17:12:00Z', read: false },
  { id: 'n3', kind: 'system', title: 'Scheduled maintenance', body: 'The volumetric index will be read-only on Sunday 02:00–04:00 IST.', timestamp: '2026-09-06T09:00:00Z', read: true },
  { id: 'n4', kind: 'update', title: 'Orthomosaic refresh complete', body: '1,240 new tiles ingested for Pune North; accuracy ±3.2 cm.', timestamp: '2026-09-05T14:30:00Z', read: true },
  { id: 'n5', kind: 'conflict', title: 'Boundary error flagged', body: 'Parcel 3412-KH07 boundary deviates from GNSS ground truth by 1.9 m.', timestamp: '2026-09-04T11:05:00Z', read: true },
  { id: 'n6', kind: 'approval', title: 'Underground asset registered', body: 'Metro tunnel segment MT-14 registered with ULPIN 2210…0920.', timestamp: '2026-09-03T10:15:00Z', read: true },
]

const kindMeta: Record<NoticeKind, { label: string; tone: 'red' | 'amber' | 'green' | 'blue'; icon: typeof Bell }> = {
  conflict: { label: 'Conflict', tone: 'red', icon: ShieldAlert },
  system: { label: 'System', tone: 'amber', icon: AlertTriangle },
  approval: { label: 'Approval', tone: 'green', icon: FileCheck2 },
  update: { label: 'Update', tone: 'blue', icon: Info },
}

export function Notifications() {
  const [notices, setNotices] = useState<Notice[]>(initial)
  const [filter, setFilter] = useState<'all' | NoticeKind>('all')

  const unread = useMemo(() => notices.filter((n) => !n.read).length, [notices])
  const filtered = filter === 'all' ? notices : notices.filter((n) => n.kind === filter)

  const markAllRead = () => setNotices((list) => list.map((n) => ({ ...n, read: true })))
  const toggleRead = (id: string) => setNotices((list) => list.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  const clearAll = () => setNotices([])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        subtitle="System alerts, approvals and cadastral updates"
      >
        <span className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-navy-900 px-3 py-2 text-xs text-slate-400">
          <Bell size={14} />
          {unread} unread
        </span>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck size={14} />
          Mark all read
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <TabChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        {Object.entries(kindMeta).map(([kind, meta]) => (
          <TabChip key={kind} label={meta.label} active={filter === kind} onClick={() => setFilter(kind as NoticeKind)} />
        ))}
        <button
          onClick={clearAll}
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 size={12} />
          Clear all
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Bell size={22} className="text-slate-600" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-300">All caught up</p>
              <p className="mt-1 text-xs text-slate-500">No notifications in this view.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notice) => {
            const meta = kindMeta[notice.kind]
            const Icon = meta.icon
            return (
              <button
                key={notice.id}
                onClick={() => toggleRead(notice.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200',
                  notice.read
                    ? 'border-white/[0.05] bg-navy-900/40 hover:border-white/[0.09]'
                    : 'border-primary-400/20 bg-navy-900/80 shadow-card hover:border-primary-400/40',
                )}
              >
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', notice.read ? 'bg-white/[0.04]' : 'bg-primary-500/15')}>
                  <Icon size={16} className={notice.read ? 'text-slate-500' : 'text-primary-400'} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn('truncate text-sm', notice.read ? 'text-slate-400' : 'font-medium text-slate-100')}>
                      {notice.title}
                    </p>
                    {!notice.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />}
                  </div>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{notice.body}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="text-[10px] text-slate-600">{timeAgo(notice.timestamp)}</span>
                  </div>
                </div>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-slate-600">
                  <Check size={12} />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-150',
        active ? 'border-primary-400/50 bg-primary-500/15 text-primary-300' : 'border-white/[0.07] text-slate-500 hover:text-slate-300',
      )}
    >
      {label}
    </button>
  )
}