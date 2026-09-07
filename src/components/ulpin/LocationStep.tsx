import { DISTRICTS, TALUKAS, WARDS } from '../../utils/constants'
import { cn } from '../../utils/helpers'

export interface LocationStepProps {
  value: {
    latitude: number
    longitude: number
    elevation: number
    district: string
    taluka: string
    ward: string
  }
  onChange: (patch: Partial<LocationStepProps['value']>) => void
}

const inputClass =
  'h-10 w-full rounded-lg border border-white/10 bg-navy-950 px-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-primary-400/50'
const labelClass =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500'

export function LocationStep({ value, onChange }: LocationStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Latitude (WGS 84)</span>
          <input
            type="number"
            step="0.000001"
            value={value.latitude}
            onChange={(e) => onChange({ latitude: Number(e.target.value) })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Longitude (WGS 84)</span>
          <input
            type="number"
            step="0.000001"
            value={value.longitude}
            onChange={(e) => onChange({ longitude: Number(e.target.value) })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Elevation (m, MSL)</span>
          <input
            type="number"
            value={value.elevation}
            onChange={(e) => onChange({ elevation: Number(e.target.value) })}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>District</span>
          <select
            value={value.district}
            onChange={(e) => onChange({ district: e.target.value })}
            className={inputClass}
          >
            <option value="">Select district</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Taluka</span>
          <select
            value={value.taluka}
            onChange={(e) => onChange({ taluka: e.target.value })}
            className={inputClass}
          >
            <option value="">Select taluka</option>
            {TALUKAS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Ward</span>
          <select
            value={value.ward}
            onChange={(e) => onChange({ ward: e.target.value })}
            className={inputClass}
          >
            <option value="">Select ward</option>
            {WARDS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className={cn('h-2 w-2 rounded-full', value.latitude && value.longitude && value.district ? 'bg-emerald-400' : 'bg-amber-400')} />
        <p className="text-xs text-slate-400">
          {value.latitude && value.longitude
            ? `GNSS location locked at ${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`
            : 'Enter GNSS/CORS coordinates to lock the location'}
        </p>
      </div>
    </div>
  )
}