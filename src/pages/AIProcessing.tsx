import { useEffect, useState } from 'react'
import {
  Box,
  Check,
  Fingerprint,
  Layers3,
  Loader2,
  Play,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { AIProcessingCard } from '../components/ai/AIProcessingCard'
import { BuildingExtraction } from '../components/ai/BuildingExtraction'
import { FloorSegmentation } from '../components/ai/FloorSegmentation'
import { ProcessingTimeline } from '../components/ai/ProcessingTimeline'
import { cn } from '../utils/helpers'

interface Stage {
  id: string
  label: string
  icon: typeof ScanSearch
}

const STAGES: Stage[] = [
  { id: 'extract', label: 'Building Extraction', icon: ScanSearch },
  { id: 'floor', label: 'Floor Segmentation', icon: Layers3 },
  { id: 'delineate', label: '3D Parcel Delineation', icon: Box },
  { id: 'topology', label: 'Topology Validation', icon: ShieldCheck },
  { id: 'ulpin', label: '3D ULPIN Generation', icon: Fingerprint },
]

const MODELS = [
  { name: 'YOLOv8-rooftop-v3', version: 'v3.2', task: 'Roof extraction' },
  { name: 'PointNet++-floor', version: 'v2.1', task: 'Floor plane clusters' },
  { name: 'UMAP-delineator', version: 'v1.9', task: 'Vertical parcel split' },
  { name: 'Twin-Mesh-recon', version: 'v4.0', task: 'Volumetric mesh build' },
]

export function AIProcessing() {
  const [stageIndex, setStageIndex] = useState(-1)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setStageIndex((i) => {
        if (i >= STAGES.length - 1) {
          window.clearInterval(timer)
          setRunning(false)
          return i
        }
        return i + 1
      })
    }, 1400)
    return () => window.clearInterval(timer)
  }, [running])

  const done = stageIndex >= STAGES.length - 1

  const run = () => {
    if (running) return
    setStageIndex(0)
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setStageIndex(-1)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Processing"
        subtitle="Prototype AI pipeline that turns spatial data into 3D parcels"
      >
        <Badge tone="purple">Prototype AI Pipeline</Badge>
      </PageHeader>

      <AIProcessingCard />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <BuildingExtraction />
        <FloorSegmentation />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProcessingTimeline />
        </div>
        <Card title="Model Information" subtitle="Deployed models">
          <div className="space-y-3">
            {MODELS.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-slate-700">{m.name}</p>
                  <p className="text-[10px] text-slate-600">{m.task}</p>
                </div>
                <Badge tone="purple">{m.version}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="rounded-xl border border-slate-200 bg-navy-900/70 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Run the Pipeline</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Cpu size={12} className="text-purple-600" />
              Simulates the end-to-end extraction → 3D ULPIN flow in the browser
            </p>
          </div>
          <div className="flex items-center gap-2">
            {done && !running && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600 transition-colors hover:border-primary-400/30 hover:text-slate-900"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
            <button
              onClick={run}
              disabled={running}
              className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-[11px] font-semibold text-white shadow-glow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
              {running ? 'Running…' : 'Run Pipeline'}
            </button>
          </div>
        </div>

        <ol className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center">
          {STAGES.map((s, i) => {
            const completed = stageIndex >= i
            const active = stageIndex === i && running
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    'flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-300',
                    completed
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : active
                        ? 'border-purple-500/40 bg-purple-500/10 shadow-glow-sm'
                        : 'border-slate-200 bg-slate-100/50 opacity-60',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                      completed
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    {completed && !active ? <Check size={13} /> : active ? <Loader2 size={13} className="animate-spin" /> : <s.icon size={13} />}
                  </span>
                  <span className={cn('text-[11px] font-medium', completed || active ? 'text-slate-900' : 'text-slate-500')}>
                    {s.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <span className={cn('hidden h-px w-4 shrink-0 sm:block', completed ? 'bg-emerald-400' : 'bg-slate-200')} />
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}