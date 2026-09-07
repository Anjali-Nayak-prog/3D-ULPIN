import { Box, Circle, Pencil, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/helpers'

export interface GeometryStepProps {
  value: {
    footprintArea: number
    volume: number
    boundarySource: string
  }
  onChange: (patch: Partial<GeometryStepProps['value']>) => void
}

const inputClass =
  'h-10 w-full rounded-lg border border-white/10 bg-navy-950 px-3 text-sm text-slate-200 outline-none transition-colors focus:border-primary-400/50'
const labelClass =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500'

export function GeometryStep({ value, onChange }: GeometryStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-navy-950/60 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Circle size={14} className="text-cyan-400" />
            2D Footprint
          </p>
          <svg viewBox="0 0 200 140" className="mx-auto h-36 w-full">
            <polygon
              points="40,105 88,24 160,30 178,108"
              fill="rgba(56,189,248,0.12)"
              stroke="#38bdf8"
              strokeWidth={1.4}
              strokeDasharray="6 4"
            />
            <circle cx="88" cy="24" r="2.5" fill="#38bdf8" />
            <circle cx="40" cy="105" r="2.5" fill="#38bdf8" />
            <circle cx="160" cy="30" r="2.5" fill="#38bdf8" />
            <circle cx="178" cy="108" r="2.5" fill="#38bdf8" />
            <text x="110" y="64" fontSize="11" fill="rgba(148,163,184,0.8)">
              {value.footprintArea.toLocaleString('en-IN')} m²
            </text>
          </svg>
          <label className="mt-3 block">
            <span className={labelClass}>Footprint Area (m²)</span>
            <input
              type="number"
              value={value.footprintArea}
              onChange={(e) => onChange({ footprintArea: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-navy-950/60 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Box size={14} className="text-purple-400" />
            3D Volume
          </p>
          <svg viewBox="0 0 200 150" className="mx-auto h-full max-h-40 w-full">
            <polygon points="70,110 130,85 170,105 110,130" fill="rgba(168,85,247,0.12)" stroke="#c084fc" strokeWidth={1.2} />
            <polygon points="70,110 70,35 130,10 130,85" fill="rgba(168,85,247,0.08)" stroke="#c084fc" strokeWidth={1.2} />
            <polygon points="130,85 130,10 170,30 170,105" fill="rgba(168,85,247,0.05)" stroke="#c084fc" strokeWidth={1.2} />
            <text x="120" y="118" fontSize="11" fill="rgba(148,163,184,0.8)">
              {value.volume.toLocaleString('en-IN')} m³
            </text>
          </svg>
          <label className="mt-3 block">
            <span className={labelClass}>Volumetric Envelope (m³)</span>
            <input
              type="number"
              value={value.volume}
              onChange={(e) => onChange({ volume: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <label className="block">
        <span className={labelClass}>Boundary Information Source</span>
        <div className="relative">
          <Pencil size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={value.boundarySource}
            onChange={(e) => onChange({ boundarySource: e.target.value })}
            className={cn(inputClass, 'pl-9')}
          >
            <option value="gis">GIS Parcel Layer (survey-integrated)</option>
            <option value="gnss">GNSS / CORS Field Survey</option>
            <option value="lidar">LiDAR Boundary Extract</option>
            <option value="drone">Drone Cadastral Image</option>
            <option value="manual">Manual Boundary Entry</option>
          </select>
        </div>
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
        <TrendingUp size={16} className="shrink-0 text-emerald-400" />
        <p className="text-xs leading-5 text-emerald-200">
          Geometry validation is performed against neighbouring parcels. Vertical overlaps and boundary
          conflicts will be flagged automatically during ULPIN generation.
        </p>
      </div>
    </div>
  )
}