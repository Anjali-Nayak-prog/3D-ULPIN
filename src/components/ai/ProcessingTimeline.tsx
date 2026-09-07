import {
  Box,
  Check,
  Cpu,
  Loader2,
  Orbit,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Layers3,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../utils/helpers'
import { Card } from '../common/Card'

type StageStatus = 'completed' | 'running' | 'pending' | 'error'

interface Stage {
  id: string
  label: string
  description: string
  icon: LucideIcon
  status: StageStatus
  detail: string
  progress?: number
}

const pipeline: Stage[] = [
  { id: 'input', label: 'Data Input', description: 'Ingest drone, LiDAR & GIS sources', icon: UploadCloud, status: 'completed', detail: '1,240 tiles + 2 point-clouds' },
  { id: 'pre', label: 'Pre-processing', description: 'Align, georeference & clean', icon: Cpu, status: 'completed', detail: 'Absolute error 3.2 cm' },
  { id: 'extract', label: 'Building Extraction', description: 'Detect rooftops & footprints', icon: ScanSearch, status: 'completed', detail: '184 buildings · 94.2%' },
  { id: 'floor', label: 'Floor Segmentation', description: 'Detect floor plates', icon: Layers3, status: 'running', detail: 'Segmenting levels…', progress: 68 },
  { id: 'delineate', label: 'Vertical Parcel Delineation', description: 'Define volumetric rights', icon: Box, status: 'pending', detail: 'Queued' },
  { id: 'recon', label: '3D Reconstruction', description: 'Build mesh & volume model', icon: Orbit, status: 'pending', detail: 'Queued' },
  { id: 'topology', label: 'Topology Validation', description: 'Check vertical & horizontal integrity', icon: ShieldCheck, status: 'pending', detail: 'Queued' },
  { id: 'ulpin', label: 'ULPIN Generation', description: 'Issue volumetric identifier', icon: Sparkles, status: 'pending', detail: 'Queued' },
]

export function ProcessingTimeline() {
  return (
    <Card
      title="Processing Pipeline"
      subtitle="End-to-end AI + geometry workflow"
    >
      <div className="relative">
        <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-emerald-500/40 via-purple-500/40 to-white/10" />
        <ol className="space-y-1">
          {pipeline.map((stage, index) => (
            <li
              key={stage.id}
              className="relative flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.02]"
            >
              <span
                className={cn(
                  'z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors',
                  stage.status === 'completed' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                  stage.status === 'running' && 'border-purple-500/40 bg-purple-500/10 text-purple-300 shadow-glow-sm',
                  stage.status === 'pending' && 'border-white/[0.08] bg-white/[0.03] text-slate-500',
                )}
              >
                {stage.status === 'completed' ? (
                  <Check size={15} />
                ) : stage.status === 'running' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <stage.icon size={15} />
                )}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {index + 1}. {stage.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      stage.status === 'completed' && 'text-emerald-400',
                      stage.status === 'running' && 'text-purple-300',
                      stage.status === 'pending' && 'text-slate-600',
                    )}
                  >
                    {stage.status === 'completed' ? 'Done' : stage.status === 'running' ? 'Processing' : 'Pending'}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{stage.description}</p>
                <p className="mt-0.5 font-mono text-[11px] text-slate-600">{stage.detail}</p>

                {stage.status === 'running' && stage.progress !== undefined && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}