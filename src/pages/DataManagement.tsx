import { useState } from 'react'
import {
  CloudUpload,
  Database,
  FileCheck2,
  FileClock,
  HardDrive,
  Layers3,
  Map as MapIcon,
  Radar,
  ScanLine,
  Trash2,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { EmptyState } from '../components/common/EmptyState'
import { useToast } from '../components/common/Toast'
import { cn } from '../utils/helpers'
import { formatFileSize } from '../utils/formatters'

type DataKind = 'ortho' | 'lidar' | 'gis' | 'gnss' | 'floor-plan'

interface Dataset {
  id: string
  kind: DataKind
  name: string
  size: number
  source: string
  updated: string
  status: 'ready' | 'processing' | 'error'
  coverage: string
  accuracy: string
}

const datasetCatalogs: Record<DataKind, { label: string; icon: typeof Database }> = {
  ortho: { label: 'Orthomosaic', icon: ScanLine },
  lidar: { label: 'LiDAR Point Clouds', icon: Radar },
  gis: { label: 'GIS Vector Layers', icon: MapIcon },
  gnss: { label: 'GNSS Control Points', icon: Layers3 },
  'floor-plan': { label: 'Floor Plans', icon: FileCheck2 },
}

const initialDatasets: Dataset[] = [
  { id: 'd1', kind: 'ortho', name: 'Pune North Orthomosaic 2026', size: 48.2 * 1024 * 1024 * 1024, source: 'Drone NDS-T1 · 1,240 tiles', updated: '2h ago', status: 'ready', coverage: '42.1 km²', accuracy: '±3.2 cm' },
  { id: 'd2', kind: 'ortho', name: 'Pune CBD Orthomosaic 2026', size: 21.8 * 1024 * 1024 * 1024, source: 'Drone NDS-T2 · 640 tiles', updated: '1d ago', status: 'processing', coverage: '18.4 km²', accuracy: '±4.1 cm' },
  { id: 'd3', kind: 'lidar', name: 'City Core LiDAR Li1', size: 86.4 * 1024 * 1024 * 1024, source: 'Airborne LiDAR · 12 pts/m²', updated: '3d ago', status: 'ready', coverage: '36.9 km²', accuracy: '±1.1 cm' },
  { id: 'd4', kind: 'lidar', name: 'Underground Survey LS-04', size: 12.6 * 1024 * 1024 * 1024, source: 'GPR mobile survey', updated: '5d ago', status: 'ready', coverage: '9.2 km²', accuracy: '±6.0 cm' },
  { id: 'd5', kind: 'gis', name: 'Cadastral Parcel Base 2025', size: 4.1 * 1024 * 1024 * 1024, source: 'Survey of India', updated: '1w ago', status: 'ready', coverage: '78.3 km²', accuracy: '±15 cm' },
  { id: 'd6', kind: 'gis', name: 'Zoning Overlay Z-03', size: 352 * 1024 * 1024, source: 'Planning authority GIS', updated: '2w ago', status: 'ready', coverage: '78.3 km²', accuracy: 'advisory' },
  { id: 'd7', kind: 'gnss', name: 'CORS Stations 2026', size: 18 * 1024 * 1024, source: 'State GNSS network · 14 stations', updated: '1mo ago', status: 'ready', coverage: 'District', accuracy: '±0.8 cm' },
  { id: 'd8', kind: 'floor-plan', name: 'Area Floor Plans 2025', size: 2.9 * 1024 * 1024 * 1024, source: 'Approved building plans', updated: '3w ago', status: 'error', coverage: '214 buildings', accuracy: 'as-built' },
]

export function DataManagement() {
  const toast = useToast()
  const [activeKind, setActiveKind] = useState<DataKind | 'all'>('all')
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets)

  const filtered = activeKind === 'all' ? datasets : datasets.filter((d) => d.kind === activeKind)

  const removeDataset = (id: string) => {
    setDatasets((ds) => ds.filter((d) => d.id !== id))
    toast.info('Dataset removed', 'Removed from the active cadastral index.')
  }

  const storageUsedGB = datasets.reduce((acc, d) => acc + d.size, 0) / (1024 * 1024 * 1024)
  const readyCount = datasets.filter((d) => d.status === 'ready').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Management"
        subtitle="Ingest and govern the spatial data feeding the 3D cadastre"
      >
        <Button variant="outline" size="sm" onClick={() => toast.info('Upload portal', 'Drag & drop ingestion is available from the upload tile.')}>
          <CloudUpload size={14} />
          Ingest
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StorageTile icon={HardDrive} label="Storage Consumed" value={`${storageUsedGB.toFixed(0)} GB`} sub="of 2 TB allocation" />
        <StorageTile icon={Database} label="Active Datasets" value={String(datasets.length)} sub={`${readyCount} ready for processing`} />
        <StorageTile icon={FileClock} label="Last Synchronised" value="Today 06:14" sub="NDS-T1 upload completed" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip label="All" active={activeKind === 'all'} onClick={() => setActiveKind('all')} />
        {Object.entries(datasetCatalogs).map(([kind, meta]) => (
          <FilterChip
            key={kind}
            label={meta.label}
            active={activeKind === kind}
            onClick={() => setActiveKind(kind as DataKind)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            title="No datasets in this category"
            description="Upload raw captures or connect a government feed to begin."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((dataset) => {
            const meta = datasetCatalogs[dataset.kind]
            const Icon = meta.icon
            return (
              <div
                key={dataset.id}
                className="group rounded-xl border border-white/[0.07] bg-navy-900/70 p-4 transition-all duration-200 hover:border-primary-400/25 hover:shadow-glow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                    <Icon size={18} className="text-primary-400" />
                  </span>
                  <StatusBadge status={dataset.status} />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{dataset.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{dataset.source}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.05] pt-3 text-[11px]">
                  <Meta label="Coverage" value={dataset.coverage} />
                  <Meta label="Accuracy" value={dataset.accuracy} />
                  <Meta label="Size" value={formatFileSize(dataset.size)} />
                  <Meta label="Updated" value={dataset.updated} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge tone="slate">{meta.label}</Badge>
                  <button
                    onClick={() => removeDataset(dataset.id)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-150',
        active
          ? 'border-primary-400/50 bg-primary-500/15 text-primary-300'
          : 'border-white/[0.07] text-slate-500 hover:text-slate-300',
      )}
    >
      {label}
    </button>
  )
}

function StorageTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof HardDrive
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-navy-900/70 px-4 py-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
        <Icon size={18} className="text-primary-400" />
      </span>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-[10px] text-slate-600">{sub}</p>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-600">{label}</p>
      <p className="text-xs font-medium text-slate-300">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: Dataset['status'] }) {
  const map = {
    ready: { label: 'Ready', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    processing: { label: 'Processing', cls: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
    error: { label: 'Error', cls: 'border-red-500/30 bg-red-500/10 text-red-300' },
  } as const
  const entry = map[status]
  return (
    <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-medium', entry.cls)}>
      {entry.label}
    </span>
  )
}