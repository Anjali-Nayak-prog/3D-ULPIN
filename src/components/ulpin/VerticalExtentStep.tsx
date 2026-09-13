import { MoveDown, MoveUp, Ruler } from 'lucide-react'
import { cn } from '../../utils/helpers'

export interface VerticalExtentStepProps {
  value: {
    minElevation: number
    maxElevation: number
    height: number
  }
  onChange: (patch: Partial<VerticalExtentStepProps['value']>) => void
  surfaceElevation: number
  propertyTypeLabel: string
}

const inputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-navy-950 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary-400/50'
const labelClass =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500'

export function VerticalExtentStep({
  value,
  onChange,
  surfaceElevation,
  propertyTypeLabel,
}: VerticalExtentStepProps) {
  const above = Math.max(0, value.maxElevation)
  const below = Math.max(0, 0 - value.minElevation)

  const updateMin = (v: number) => {
    const min = v
    const max = Math.max(value.maxElevation, v)
    onChange({ minElevation: min, maxElevation: max, height: max - min })
  }

  const updateMax = (v: number) => {
    const max = v
    const min = Math.min(value.minElevation, v)
    onChange({ minElevation: min, maxElevation: max, height: max - min })
  }

  const updateHeight = (v: number) => {
    const height = v
    onChange({ minElevation: value.minElevation, maxElevation: value.minElevation + height, height })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100/50 px-4 py-3">
        <span className="text-xs text-slate-500">Property class</span>
        <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-2.5 py-1 text-xs font-medium text-primary-600">
          {propertyTypeLabel}
        </span>
        <span className="ml-auto text-[11px] text-slate-500">
          Surface at {surfaceElevation} m MSL
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Minimum Elevation (m)</span>
          <div className="relative">
            <MoveDown size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" />
            <input
              type="number"
              value={value.minElevation}
              onChange={(e) => updateMin(Number(e.target.value))}
              className={cn(inputClass, 'pl-9')}
            />
          </div>
        </label>
        <label className="block">
          <span className={labelClass}>Maximum Elevation (m)</span>
          <div className="relative">
            <MoveUp size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
            <input
              type="number"
              value={value.maxElevation}
              onChange={(e) => updateMax(Number(e.target.value))}
              className={cn(inputClass, 'pl-9')}
            />
          </div>
        </label>
        <label className="block">
          <span className={labelClass}>Height (m)</span>
          <div className="relative">
            <Ruler size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="number"
              value={value.height}
              onChange={(e) => updateHeight(Number(e.target.value))}
              className={cn(inputClass, 'pl-9')}
            />
          </div>
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Vertical cross-section
        </p>
        <div className="flex h-44 items-stretch gap-0 rounded-lg bg-slate-100/50 p-2">
          <div className="flex w-10 flex-col items-center justify-between text-[9px] text-slate-600">
            <span>100 m</span>
            <span>0 m</span>
            <span>-100 m</span>
          </div>
          <div className="relative flex-1">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-300" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
              <div className="mx-auto h-24 w-20 rounded-lg border border-primary-400/40 bg-primary-500/10 animate-fade-in" />
            </div>
            <span className="absolute left-0 top-[48%] pl-2 text-[9px] text-slate-500">
              surface {surfaceElevation} m
            </span>
            <span className="absolute left-2 top-2 text-[9px] font-medium text-cyan-600">
              max {value.maxElevation} m
            </span>
            <span className="absolute bottom-2 left-2 text-[9px] font-medium text-purple-600">
              min {value.minElevation} m
            </span>
          </div>
          <div className="flex w-16 flex-col justify-center gap-1 border-l border-slate-200 pl-3">
            <p className="text-[10px] font-semibold text-slate-900">{value.height} m</p>
            <p className="text-[9px] text-slate-500">total vertical extent</p>
            <p className="mt-2 text-[9px] text-emerald-600">{above} m above ground</p>
            <p className="text-[9px] text-purple-600">{below} m below ground</p>
          </div>
        </div>
      </div>
    </div>
  )
}