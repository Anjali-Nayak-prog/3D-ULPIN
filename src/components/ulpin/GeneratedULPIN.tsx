import { CheckCircle2, ClipboardCopy, Download, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ULPINResult } from '../../types/ulpin'
import { PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatters'
import { Button } from '../common/Button'
import { useToast } from '../common/Toast'

interface GeneratedULPINProps {
  result: ULPINResult
  onReset: () => void
}

export function GeneratedULPIN({ result, onReset }: GeneratedULPINProps) {
  const navigate = useNavigate()
  const toast = useToast()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.ulpin)
      toast.success('ULPIN copied', `${result.ulpin} copied to clipboard`)
    } catch {
      toast.error('Copy failed', 'Clipboard access was denied')
    }
  }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] px-6 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Prototype 3D ULPIN Generated</h3>
          <p className="mt-1 text-xs text-slate-500">
            Demo prototype identifier — not for official land administration use
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-navy-950/80 px-8 py-4 shadow-glow-sm">
          <p className="font-mono text-2xl font-bold tracking-wide text-primary-600">{result.ulpin}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ResultItem label="Generated" value={formatDateTime(result.generatedAt)} />
        <ResultItem label="District" value={result.district} />
        <ResultItem label="Property Type" value={PROPERTY_TYPE_LABELS[result.propertyType]} />
        <ResultItem label="Latitude" value={result.latitude.toFixed(6)} mono />
        <ResultItem label="Longitude" value={result.longitude.toFixed(6)} mono />
        <ResultItem label="Confidence" value={`${result.confidence}%`} />
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button onClick={() => navigate('/map')}>
          <MapPin size={15} />
          View on Map
        </Button>
        <Button variant="outline" onClick={() => toast.info('Download', 'Certificate document is being prepared')}>
          <Download size={15} />
          Download
        </Button>
        <Button variant="outline" onClick={copy}>
          <ClipboardCopy size={15} />
          Copy ULPIN
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Generate another
        </Button>
      </div>
    </div>
  )
}

function ResultItem({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 truncate text-xs font-medium text-slate-700 ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}