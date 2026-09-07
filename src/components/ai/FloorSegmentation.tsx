import { Check, Minus } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { Card } from '../common/Card'

const floorRows = [
  { floor: 'F-12', type: 'Penthouse', area: '620 m²', conf: 96.1, ok: true },
  { floor: 'F-11', type: 'Residential', area: '1,820 m²', conf: 95.4, ok: true },
  { floor: 'F-10', type: 'Residential', area: '1,820 m²', conf: 94.7, ok: true },
  { floor: 'F-09', type: 'Residential', area: '1,820 m²', conf: 93.9, ok: true },
  { floor: 'F-08', type: 'Residential', area: '1,820 m²', conf: 92.8, ok: false },
  { floor: 'F-07', type: 'Residential', area: '1,820 m²', conf: 94.3, ok: true },
  { floor: 'F-01', type: 'Retail', area: '2,410 m²', conf: 95.8, ok: true },
  { floor: 'G', type: 'Lobby & Retail', area: '2,200 m²', conf: 96.6, ok: true },
  { floor: 'B-1', type: 'Parking', area: '1,980 m²', conf: 91.2, ok: false },
  { floor: 'B-2', type: 'Parking / Plant', area: '1,980 m²', conf: 90.5, ok: false },
]

export function FloorSegmentation() {
  const okCount = floorRows.filter((f) => f.ok).length

  return (
    <Card
      title="Floor Segmentation"
      subtitle="Skyline Tower A · per-floor vertical delineation"
      className="h-full"
      action={
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
          <Check size={12} />
          {okCount}/{floorRows.length} floors clean
        </span>
      }
    >
      <div className="max-h-72 overflow-y-auto rounded-lg border border-white/[0.06]">
        {floorRows.map((row, index) => (
          <div
            key={row.floor}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-xs transition-colors hover:bg-white/[0.02]',
              index !== 0 && 'border-t border-white/[0.04]',
            )}
          >
            <span className="w-10 shrink-0 font-mono font-medium text-slate-300">{row.floor}</span>
            <span className="w-24 shrink-0 text-slate-400">{row.type}</span>
            <span className="hidden flex-1 text-slate-500 sm:block">{row.area}</span>
            <div className="flex h-1 w-24 shrink-0 overflow-hidden rounded-full bg-white/[0.06] sm:w-32">
              <div
                className={cn(
                  'h-full rounded-full',
                  row.ok ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-gradient-to-r from-amber-600 to-amber-400',
                )}
                style={{ width: `${row.conf}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-[11px] text-slate-400">
              {row.conf}%
            </span>
            {row.ok ? (
              <Check size={13} className="shrink-0 text-emerald-400" />
            ) : (
              <Minus size={13} className="shrink-0 text-amber-400" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-4 text-slate-500">
        Segmented by detected floor plates from point-cloud clustering. Amber floors have low
        confidence and require manual rooftop verification.
      </p>
    </Card>
  )
}