import { useState } from 'react'
import {
  FileBarChart,
  FileDown,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useToast } from '../components/common/Toast'
import type { Report, ReportType } from '../types/common'
import { cn } from '../utils/helpers'

const initialReports: Report[] = [
  { id: 'r1', title: 'Quarterly Cadastral Digest', description: 'Bundled register state, KPIs and district summaries', type: 'cadastral', format: 'PDF', size: '8.4 MB', generatedAt: '2026-09-05T09:00:00Z', status: 'ready', pages: 42 },
  { id: 'r2', title: 'All Property Records Export', description: 'Full property index with spatial attributes', type: 'property', format: 'CSV', size: '24.1 MB', generatedAt: '2026-09-04T18:22:00Z', status: 'ready', pages: 0 },
  { id: 'r3', title: 'Open Conflicts Register', description: 'Unresolved ownership and topology conflicts', type: 'conflict', format: 'XLSX', size: '1.2 MB', generatedAt: '2026-09-04T11:05:00Z', status: 'ready', pages: 0 },
  { id: 'r4', title: 'Underground Network Map', description: 'Utility, metro and parking volumes (GeoJSON)', type: 'infrastructure', format: 'GeoJSON', size: '12.8 MB', generatedAt: '2026-09-03T08:30:00Z', status: 'ready', pages: 0 },
  { id: 'r5', title: 'AI Processing Report – Sept', description: 'Model accuracy, throughput and confidence stats', type: 'ai', format: 'PDF', size: '3.6 MB', generatedAt: '2026-09-02T15:45:00Z', status: 'ready', pages: 24 },
  { id: 'r6', title: 'ULPIN Issuance Register', description: 'Sequential volumetric identifiers issued this month', type: 'ulpin', format: 'XLSX', size: '0.9 MB', generatedAt: '2026-09-01T10:00:00Z', status: 'ready', pages: 0 },
  { id: 'r7', title: 'Monthly Audit Snapshot', description: 'Reconciliation of register against source records', type: 'cadastral', format: 'PDF', size: '5.1 MB', generatedAt: '2026-08-31T22:00:00Z', status: 'processing', pages: 0 },
]

const typeLabels: Record<ReportType, string> = {
  property: 'Property',
  cadastral: 'Cadastral',
  conflict: 'Conflicts',
  infrastructure: 'Infrastructure',
  ai: 'AI',
  ulpin: 'ULPIN',
}

const typeTone: Record<ReportType, 'blue' | 'green' | 'red' | 'cyan' | 'purple' | 'orange' | 'slate'> = {
  property: 'blue',
  cadastral: 'cyan',
  conflict: 'red',
  infrastructure: 'orange',
  ai: 'purple',
  ulpin: 'green',
}

export function Reports() {
  const toast = useToast()
  const [reports] = useState<Report[]>(initialReports)

  const download = (report: Report) => {
    if (report.status !== 'ready') return
    toast.success('Download started', `${report.title} (${report.size}) queued.`)
  }

  const requestNew = () => {
    toast.info('Report requested', 'The report scheduler will generate it shortly.')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        subtitle="Generate and download cadastral, conflict and ULPIN reports"
      >
        <Button size="sm" onClick={requestNew}>
          <RefreshCw size={14} />
          New Report
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500">Filter by:</span>
        {Object.entries(typeLabels).map(([key, label]) => (
          <FilterChip key={key} label={label} active={false} />
        ))}
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="group flex flex-col rounded-xl border border-white/[0.07] bg-navy-900/70 p-4 transition-all duration-200 hover:border-primary-400/25 hover:shadow-glow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                  <FormatIcon format={report.format} />
                </span>
                <Badge tone={typeTone[report.type]}>{typeLabels[report.type]}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{report.title}</p>
              <p className="mt-1 flex-1 text-[11px] leading-5 text-slate-500">{report.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-600">
                  <span className="rounded-md border border-white/[0.06] px-1.5 py-0.5 font-mono">{report.format}</span>
                  <span>{report.size}</span>
                  {report.status === 'ready' && report.pages > 0 && <span>· {report.pages}pp</span>}
                </div>
                <button
                  onClick={() => download(report)}
                  disabled={report.status !== 'ready'}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                    report.status === 'ready'
                      ? 'border-primary-400/40 bg-primary-500/10 text-primary-300 hover:bg-primary-500/20'
                      : 'cursor-not-allowed border-white/[0.06] text-slate-600',
                  )}
                >
                  <FileDown size={12} />
                  {report.status === 'ready' ? 'Download' : report.status === 'processing' ? 'Processing' : 'Failed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center text-[11px] text-slate-600">
        Reports are rendered from the live cadastral index and expire after 30 days.
      </p>
    </div>
  )
}

function FormatIcon({ format }: { format: Report['format'] }) {
  const cls = 'text-primary-400'
  if (format === 'PDF') return <FileText size={18} className={cls} />
  if (format === 'CSV') return <FileSpreadsheet size={18} className={cls} />
  if (format === 'XLSX') return <FileSpreadsheet size={18} className={cls} />
  return <FileBarChart size={18} className={cls} />
}

function FilterChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-150',
        active ? 'border-primary-400/50 bg-primary-500/15 text-primary-300' : 'border-white/[0.07] text-slate-500',
      )}
    >
      {label}
    </span>
  )
}