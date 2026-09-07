import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import type { PropertyType } from '../../types/property'
import type { ULPINResult } from '../../types/ulpin'
import { generateULPIN } from '../../services/ulpinService'
import { PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { useToast } from '../common/Toast'
import { LocationStep } from './LocationStep'
import { PropertyTypeStep } from './PropertyTypeStep'
import { VerticalExtentStep } from './VerticalExtentStep'
import { GeometryStep } from './GeometryStep'
import { GeneratedULPIN } from './GeneratedULPIN'

const STEP_LABELS = [
  'Location',
  'Property Type',
  'Vertical Extent',
  'Geometry',
  'Generate',
]

export function ULPINForm() {
  const toast = useToast()

  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<ULPINResult | null>(null)

  const [location, setLocation] = useState({
    latitude: 18.52043,
    longitude: 73.85674,
    elevation: 560,
    district: 'Pune City',
    taluka: 'Haveli',
    ward: 'Kothrud',
  })

  const [propertyType, setPropertyType] = useState<PropertyType>('building')
  const [extent, setExtent] = useState({ minElevation: 0, maxElevation: 24, height: 24 })
  const [geometry, setGeometry] = useState({
    footprintArea: 1200,
    volume: 48000,
    boundarySource: 'gis',
  })

  const patchLocation = (patch: Partial<typeof location>) => setLocation((v) => ({ ...v, ...patch }))
  const patchExtent = (patch: Partial<typeof extent>) => setExtent((v) => ({ ...v, ...patch }))
  const patchGeometry = (patch: Partial<typeof geometry>) => setGeometry((v) => ({ ...v, ...patch }))

  const canProceed = () => {
    if (step === 0) return location.district !== '' && location.taluka !== '' && location.ward !== ''
    if (step === 2) return extent.height > 0
    if (step === 3) return geometry.footprintArea > 0 && geometry.volume > 0
    return true
  }

  const next = () => {
    if (step === 4) {
      void handleGenerate()
      return
    }
    if (canProceed()) setStep((s) => s + 1)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateULPIN({
        latitude: location.latitude,
        longitude: location.longitude,
        elevation: location.elevation,
        district: location.district,
        taluka: location.taluka,
        ward: location.ward,
        propertyType,
        minElevation: extent.minElevation,
        maxElevation: extent.maxElevation,
        height: extent.height,
        footprintArea: geometry.footprintArea,
        volume: geometry.volume,
      })
      setResult(res)
      toast.success('ULPIN generated', res.ulpin)
    } catch (err) {
      toast.error(
        'Generation failed',
        err instanceof Error ? err.message : 'Unexpected error',
      )
    } finally {
      setGenerating(false)
    }
  }

  if (result) {
    return (
      <Card padding="lg">
        <GeneratedULPIN result={result} onReset={() => { setResult(null); setStep(0) }} />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <Card padding="lg">
          {/* Stepper */}
          <ol className="mb-8 flex items-center gap-0 overflow-x-auto">
            {STEP_LABELS.map((label, index) => {
              const active = index === step
              const done = index < step
              return (
                <li key={label} className="flex shrink-0 items-center">
                  {index > 0 && (
                    <span className={cn('mx-2 h-px w-8 sm:w-12', done || active ? 'bg-primary-500/60' : 'bg-white/10')} />
                  )}
                  <button
                    onClick={() => index < step && setStep(index)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-200',
                        done && 'border-primary-500 bg-primary-500 text-white',
                        active && 'border-primary-400 bg-primary-500/20 text-primary-300 shadow-glow-sm',
                        !done && !active && 'border-white/15 text-slate-500',
                      )}
                    >
                      {done ? <Check size={13} /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        'hidden text-xs font-medium sm:block',
                        active ? 'text-primary-300' : done ? 'text-slate-300' : 'text-slate-500',
                      )}
                    >
                      {label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mb-6">
            <div key={step} className="animate-fade-in">
              {step === 0 && <LocationStep value={location} onChange={patchLocation} />}
              {step === 1 && <PropertyTypeStep value={propertyType} onChange={setPropertyType} />}
              {step === 2 && (
                <VerticalExtentStep
                  value={extent}
                  onChange={patchExtent}
                  surfaceElevation={location.elevation}
                  propertyTypeLabel={PROPERTY_TYPE_LABELS[propertyType]}
                />
              )}
              {step === 3 && <GeometryStep value={geometry} onChange={patchGeometry} />}
              {step === 4 && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20">
                    <Sparkles size={30} className="text-primary-400" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Ready to Generate</h3>
                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
                      The system will compute the geometric hash, verify against neighbouring
                      volumes, and issue a unique 3D ULPIN for
                      <span className="font-medium text-primary-300"> {location.district}</span>.
                    </p>
                  </div>
                  <div className="mt-2 grid w-full max-w-lg grid-cols-2 gap-2 text-left sm:grid-cols-3">
                    <SummaryChip label="Type" value={PROPERTY_TYPE_LABELS[propertyType]} />
                    <SummaryChip label="Height" value={`${extent.height} m`} />
                    <SummaryChip label="Footprint" value={`${geometry.footprintArea.toLocaleString('en-IN')} m²`} />
                    <SummaryChip label="Volume" value={`${(geometry.volume / 1000).toFixed(1)}K m³`} />
                    <SummaryChip label="District" value={location.district} />
                    <SummaryChip label="Elevation" value={`${location.elevation} m`} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft size={15} />
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={next} disabled={!canProceed()}>
                Next
                <ArrowRight size={15} />
              </Button>
            ) : (
              <Button onClick={next} loading={generating} icon={<Sparkles size={15} />}>
                Generate 3D ULPIN
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card
          title="Live Preview"
          subtitle="Vertical envelope summary"
          padding="none"
        >
          <div className="px-5 pb-5">
            <div className="relative mx-auto mt-2 flex h-56 w-44 items-end justify-center">
              <div className="absolute bottom-0 h-4 w-40 rounded-sm border border-white/10 bg-navy-800" />
              {Array.from({ length: Math.min(Math.max(extent.height / 3, 1), 12) }, (_, i) => (
                <div
                  key={i}
                  className="absolute bottom-4 w-40 rounded-sm border border-primary-400/30 bg-primary-500/15"
                  style={{ height: 10, transform: `translateY(-${i * 12}px) scaleY(1)` }}
                />
              ))}
              <div className="absolute bottom-4 h-24 w-40 rounded border border-primary-400/50 bg-primary-500/10" />
            </div>
          </div>
        </Card>

        <Card title="Generation Notes">
          <ul className="space-y-2 text-xs leading-5 text-slate-400">
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />Geometric hash uses district, coordinates and vertical envelope.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />Neighbour checks run automatically against the volumentric graph.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />Conflicts surfaced here block issuance until resolved.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-slate-200">{value}</p>
    </div>
  )
}