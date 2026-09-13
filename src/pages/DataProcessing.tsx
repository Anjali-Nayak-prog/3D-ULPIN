import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CloudUpload,
  Database,
  FileCheck2,
  Layers3,
  Map as MapIcon,
  Radar,
  ScanLine,
  Globe,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { useToast } from '../components/common/Toast'
import { cn } from '../utils/helpers'

interface InputDataset {
  id: string
  name: string
  kind: string
  icon: typeof Database
  source: string
  coverage: string
  accuracy: string
  status: 'loaded'
  color: string
}

const inputDatasets: InputDataset[] = [
  { id: 'gis', name: 'GIS Vector Layers', kind: 'GIS', icon: MapIcon, source: 'Survey of India', coverage: '78.3 km²', accuracy: '±15 cm', status: 'loaded', color: 'text-blue-600 bg-blue-500/10' },
  { id: 'lidar', name: 'LiDAR Point Clouds', kind: 'LiDAR', icon: Radar, source: 'Airborne survey · 12 pts/m²', coverage: '36.9 km²', accuracy: '±1.1 cm', status: 'loaded', color: 'text-purple-600 bg-purple-500/10' },
  { id: 'drone', name: 'Drone Orthomosaic', kind: 'Drone', icon: ScanLine, source: 'NDS-T1 · 1,240 tiles', coverage: '42.1 km²', accuracy: '±3.2 cm', status: 'loaded', color: 'text-cyan-600 bg-cyan-500/10' },
  { id: 'dem', name: 'DEM / DSM Rasters', kind: 'DEM/DSM', icon: Layers3, source: 'SRTM + local DSM', coverage: '78.3 km²', accuracy: '±5.0 cm', status: 'loaded', color: 'text-amber-600 bg-amber-500/10' },
  { id: 'floor', name: 'Floor Plans', kind: 'Floor Plans', icon: FileCheck2, source: 'Approved building plans', coverage: '214 buildings', accuracy: 'as-built', status: 'loaded', color: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'gnss', name: 'GNSS / CORS Network', kind: 'GNSS/CORS', icon: Globe, source: 'State GNSS network · 14 stations', coverage: 'District', accuracy: '±0.8 cm', status: 'loaded', color: 'text-rose-600 bg-rose-500/10' },
]

export function DataProcessing() {
  const toast = useToast()
  const [activeKind, setActiveKind] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Processing"
        subtitle="Six input datasets feed the 3D cadastre. Processing happens in the AI pipeline."
      >
        <button
          onClick={() => toast.info('Upload', 'Drag-and-drop ingestion available in the full system.')}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-primary-400/30 hover:text-slate-900"
        >
          <CloudUpload size={14} />
          Ingest Data
        </button>
      </PageHeader>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Input Datasets</h3>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600">
            {inputDatasets.length} sources loaded
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {inputDatasets.map((ds) => (
            <button
              key={ds.id}
              onClick={() => setActiveKind(activeKind === ds.id ? null : ds.id)}
              className={cn(
                'group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                activeKind === ds.id
                  ? 'border-primary-400/30 bg-primary-500/[0.06] shadow-glow-sm'
                  : 'border-slate-200 bg-navy-900/70 hover:border-primary-400/15',
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', ds.color)}>
                <ds.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{ds.name}</p>
                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    Loaded
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{ds.source}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-slate-500"><span className="font-medium text-slate-600">{ds.coverage}</span> coverage</span>
                  <span className="text-slate-500"><span className="font-medium text-slate-600">{ds.accuracy}</span> accuracy</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-500/20 bg-primary-500/[0.05] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Datasets ready for processing</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            These sources are consumed by the AI extraction pipeline to produce 3D parcels.
          </p>
        </div>
        <Link
          to="/ai-processing"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-semibold text-white shadow-glow-sm transition-colors hover:bg-primary-600"
        >
          Open AI Pipeline
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}