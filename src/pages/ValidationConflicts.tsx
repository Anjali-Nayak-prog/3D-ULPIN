import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Crosshair, Loader2, Map as MapIcon, RotateCcw } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { ValidationResults } from '../components/validation/ValidationResults'
import { useToast } from '../components/common/Toast'
import type { Conflict } from '../types/validation'

interface SpatialCheck {
  id: string
  name: string
  description: string
  details: string
}

const SPATIAL_CHECKS: SpatialCheck[] = [
  { id: 'sc-1', name: 'Horizontal Topology', description: 'No parcel overlaps or gaps', details: '4,148/4,182 parcels validated' },
  { id: 'sc-2', name: 'Vertical Stack Integrity', description: 'Floor ordering within legal bounds', details: '2,871/2,904 stacks validated' },
  { id: 'sc-3', name: 'Boundary Coherence', description: 'Adjacent parcels share boundaries', details: '3,512/3,560 parcels validated' },
  { id: 'sc-4', name: 'Encumbrance Clearance', description: 'No underground/utility intrusions', details: '1,216/1,240 assets validated' },
  { id: 'sc-5', name: 'Ownership Consistency', description: 'Registered owners match across floors', details: '5,207/5,231 records validated' },
  { id: 'sc-6', name: 'Coordinate Precision', description: 'All vertices within tolerance', details: 'All 12,450 parcels within ±15 cm' },
  { id: 'sc-7', name: 'ULPIN Uniqueness', description: 'No duplicate identifiers', details: '12,450 unique identifiers verified' },
]

const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: 'conflict-1',
    type: 'vertical-overlap',
    severity: 'high',
    status: 'open',
    affectedProperties: ['ULPIN-PN-2026-001245'],
    description:
      'Units 4B and 4C of Skyline Tower A share a 0.12 m vertical overlap at Floor 4, detected by the topology engine during floor segmentation.',
    createdAt: '2026-08-21',
    detectedBy: 'ai',
  },
  {
    id: 'conflict-2',
    type: 'boundary-error',
    severity: 'medium',
    status: 'open',
    affectedProperties: ['ULPIN-PN-2026-000954'],
    description:
      'Baner Commercial Tower B footprint extends 0.28 m beyond the registered parcel boundary on the eastern side.',
    createdAt: '2026-08-19',
    detectedBy: 'rule-engine',
  },
  {
    id: 'conflict-3',
    type: 'underground-utility',
    severity: 'critical',
    status: 'in-progress',
    affectedProperties: ['ULPIN-PN-2026-001301'],
    description:
      'Basement excavation at GreenValley Ph-3 Tower B intersects the Trunk Water Main H-18 utility corridor at depth −9.4 m.',
    createdAt: '2026-08-16',
    detectedBy: 'ai',
  },
  {
    id: 'conflict-4',
    type: 'outside-parcel',
    severity: 'low',
    status: 'resolved',
    affectedProperties: ['ULPIN-PN-2026-000866'],
    description:
      'Azure Residency Tower had a lift shaft polygon outside the parcel footprint; re-measured and corrected by surveyor.',
    createdAt: '2026-08-02',
    detectedBy: 'manual',
  },
]

export function ValidationConflicts() {
  const navigate = useNavigate()
  const toast = useToast()
  const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS)
  const [validating, setValidating] = useState(false)

  const openCount = useMemo(() => conflicts.filter((c) => c.status === 'open' || c.status === 'in-progress').length, [conflicts])
  const resolvedCount = useMemo(() => conflicts.filter((c) => c.status === 'resolved').length, [conflicts])

  const updateStatus = (id: string, status: Conflict['status'], message: string) => {
    setConflicts((list) => list.map((c) => (c.id === id ? { ...c, status } : c)))
    toast.success('Validation', message)
  }

  const handleView = (conflict: Conflict) => {
    const target = conflict.affectedProperties[0]
    navigate(target ? `/map?locate=${encodeURIComponent(target)}` : '/map')
  }

  const runValidation = () => {
    if (validating) return
    setValidating(true)
    window.setTimeout(() => {
      setValidating(false)
      toast.success('Validation', 'Re-validation complete — 7/7 spatial checks passed.')
    }, 1600)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Spatial Validation"
        subtitle="Topology, boundary and vertical integrity checks across the 3D cadastral register"
      >
        <button
          onClick={runValidation}
          disabled={validating}
          className="flex items-center gap-2 rounded-lg bg-primary-500 px-3.5 py-2 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {validating ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
          {validating ? 'Validating…' : 'Run Validation'}
        </button>
        <Link
          to="/map"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/70 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-primary-400/30 hover:text-slate-900"
        >
          <MapIcon size={14} />
          Inspect on 3D Map
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-navy-900/70 px-4 py-3.5">
          <p className="text-2xl font-bold text-emerald-600">{SPATIAL_CHECKS.length}/{SPATIAL_CHECKS.length}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Checks Passed</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-navy-900/70 px-4 py-3.5">
          <p className="text-2xl font-bold text-amber-600">{openCount}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Conflicts Open</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-navy-900/70 px-4 py-3.5">
          <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Resolved</p>
        </div>
      </div>

      <Card title="Spatial Integrity Checks" subtitle="Automated topology and boundary validation results">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SPATIAL_CHECKS.map((check) => (
            <div
              key={check.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-100/50 px-3.5 py-3"
            >
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900">{check.name}</p>
                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    Passed
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{check.description}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">{check.details}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Detected Conflicts" subtitle="Use View to inspect a conflict on the 3D map, then Resolve or Ignore">
        <ValidationResults
          conflicts={conflicts}
          onView={handleView}
          onResolve={(id) => updateStatus(id, 'resolved', 'Conflict marked as resolved.')}
          onIgnore={(id) => updateStatus(id, 'ignored', 'Conflict ignored and archived.')}
        />
      </Card>

      <div className="flex items-center gap-2 rounded-xl border border-primary-500/20 bg-primary-500/[0.05] px-4 py-3">
        <Crosshair size={14} className="shrink-0 text-primary-600" />
        <p className="text-[11px] text-slate-600">
          Actions update this prototype's conflict register instantly. Navigate to{' '}
          <span className="font-semibold text-primary-600">Spatial Validation</span> conflicts is fully
          stateful — View highlights the affected property on the 3D cadastral map.
        </p>
      </div>
    </div>
  )
}