import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ValidationResults } from '../components/validation/ValidationResults'
import { TopologyStatus } from '../components/validation/TopologyStatus'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { getConflicts, getValidationReports, updateConflictStatus, validateProperty } from '../services/validationService'
import type { Conflict, ValidationReport } from '../types/validation'
import { formatDateTime } from '../utils/formatters'

export function ValidationConflicts() {
  const toast = useToast()
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [reports, setReports] = useState<ValidationReport[]>([])
  const [loading, setLoading] = useState(true)
  const [runningId, setRunningId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      const [c, r] = await Promise.all([getConflicts(), getValidationReports()])
      if (mounted) {
        setConflicts(c)
        setReports(r)
        setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [])

  const headScore = useMemo(
    () => (reports.length ? Math.max(...reports.map((r) => r.score)) : 0),
    [reports],
  )

  const handleResolve = async (id: string) => {
    setConflicts((list) => list.map((c) => (c.id === id ? { ...c, status: 'resolved' as const } : c)))
    await updateConflictStatus(id, 'resolved')
    toast.success('Conflict resolved', 'Marked resolved in the volumetric register.')
  }

  const handleIgnore = async (id: string) => {
    setConflicts((list) => list.map((c) => (c.id === id ? { ...c, status: 'ignored' as const } : c)))
    await updateConflictStatus(id, 'ignored')
    toast.info('Conflict ignored', 'Suppressed from the active workflow.')
  }

  const runValidation = async () => {
    setRunningId('all')
    const report = await validateProperty('prop-001')
    setReports((reportsList) => [report, ...reportsList])
    setRunningId(null)
    toast.success('Validation complete', `Score ${report.score}/100`)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Validation & Conflicts"
        subtitle="Topology checks, ownership conflicts and vertical integrity reports"
      >
        <Button variant="outline" size="sm" onClick={() => void runValidation()} loading={runningId !== null}>
          <ShieldCheck size={14} />
          Run Full Validation
        </Button>
      </PageHeader>

      <TopologyStatus />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreTile label="Top Validation Score" value={`${headScore}/100`} tone="text-emerald-300" />
        <ScoreTile label="Open Conflicts" value={String(conflicts.filter((c) => c.status === 'open').length)} tone="text-red-300" />
        <ScoreTile label="Resolved" value={String(conflicts.filter((c) => c.status === 'resolved').length)} tone="text-white" />
        <ScoreTile label="Running Validations" value={String(runningId !== null ? 1 : 0)} tone="text-amber-300" />
      </div>

      {loading ? (
        <Card padding="lg">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-white/[0.05]" />
            <div className="h-24 rounded-lg bg-white/[0.03]" />
            <div className="h-24 rounded-lg bg-white/[0.03]" />
          </div>
        </Card>
      ) : reports.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            title="No validation reports yet"
            description="Run a validation to generate integrity scores for the register."
          />
        </Card>
      ) : (
        <Card
          title="Recent Validation Reports"
          subtitle="Most recent volumetric integrity scoring runs"
        >
          <div className="grid grid-cols-1 gap-2.5">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-200">{report.propertyName}</p>
                  <p className="font-mono text-[10px] text-slate-600">{report.ulpin}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    {report.checksPassed}/{report.checksTotal} checks
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-300">{report.score}</span>
                  <span className="hidden text-[10px] text-slate-600 sm:block">{formatDateTime(report.ranAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ValidationResults conflicts={conflicts} onResolve={handleResolve} onIgnore={handleIgnore} />
    </div>
  )
}

function ScoreTile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-navy-900/70 px-4 py-3.5">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
    </div>
  )
}