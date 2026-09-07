import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { AIProcessingCard } from '../components/ai/AIProcessingCard'
import { BuildingExtraction } from '../components/ai/BuildingExtraction'
import { FloorSegmentation } from '../components/ai/FloorSegmentation'
import { ProcessingTimeline } from '../components/ai/ProcessingTimeline'
import { useToast } from '../components/common/Toast'

export function AIProcessing() {
  const toast = useToast()
  const [runs, setRuns] = useState(0)

  const coverage = {
    area: 42.1,
    buildings: 184,
    confidence: 94.2,
  }

  const startRun = () => {
    runCountRef.current += 1
    setRuns(runCountRef.current)
    toast.info('Pipeline started', `Batch #B${String(2417 + runCountRef.current)} queued for the AI cluster.`)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Processing"
        subtitle="Automated building extraction, floor segmentation and vertical parcel production"
      >
        <Button variant="outline" size="sm" onClick={() => toast.success('Cache cleared', 'Model inference cache has been refreshed')}>
          <RotateCcw size={14} />
          Reset cache
        </Button>
        <Button size="sm" onClick={startRun}>
          <Play size={14} />
          Run Pipeline
        </Button>
      </PageHeader>

      <AIProcessingCard />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <BuildingExtraction />
        <FloorSegmentation />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProcessingTimeline />
        </div>
        <div className="space-y-4">
          <RunSummary coverage={coverage} runCount={runs} />
          <Card title="Model Information" subtitle="Deployed models">
            <div className="space-y-3">
              <ModelRow name="YOLOv8-rooftop-v3" version="v3.2" task="Roof extraction" />
              <ModelRow name="PointNet++-floor" version="v2.1" task="Floor plane clusters" />
              <ModelRow name="UMAP-delineator" version="v1.9" task="Vertical parcel split" />
              <ModelRow name="Twin-Mesh-recon" version="v4.0" task="Volumetric mesh build" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const runCountRef: { current: number } = { current: 0 }

function RunSummary({
  coverage,
  runCount,
}: {
  coverage: { area: number; buildings: number; confidence: number }
  runCount: number
}) {
  return (
    <Card title="Latest Run" subtitle={runCount > 0 ? `Batch #B${2417 + runCount}` : 'No manual run yet'}>
      <div className="space-y-3">
        <Row label="Area processed" value={`${coverage.area} km²`} />
        <Row label="Buildings extracted" value={`${coverage.buildings}`} />
        <Row label="Confidence" value={`${coverage.confidence}%`} />
        <div className="border-t border-white/[0.05] pt-3">
          <p className="text-[11px] leading-5 text-slate-500">
            Automatic runs occur nightly via the spatial scheduler. Results are staged for
            validation before entering the cadastral index.
          </p>
        </div>
      </div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-mono text-xs font-semibold text-slate-200">{value}</span>
    </div>
  )
}

function ModelRow({ name, version, task }: { name: string; version: string; task: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
      <div>
        <p className="text-xs font-medium text-slate-200">{name}</p>
        <p className="text-[10px] text-slate-600">{task}</p>
      </div>
      <Badge tone="purple">{version}</Badge>
    </div>
  )
}