import { STATUS_COLORS } from '../../utils/constants'
import { Card } from '../common/Card'

const data = [
  { key: 'verified' as const, label: 'Verified', count: 7835 },
  { key: 'pending' as const, label: 'Pending', count: 3142 },
  { key: 'new' as const, label: 'New', count: 1449 },
  { key: 'conflict' as const, label: 'Conflict', count: 24 },
]

export function PropertyStatus() {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card
      title="Property Status"
      subtitle="Across all surface & volumetric parcels"
      className="h-full"
    >
      <div className="space-y-4">
        {data.map((d) => {
          const color = STATUS_COLORS[d.key]
          const percent = (d.count / total) * 100
          return (
            <div key={d.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                  {d.label}
                </span>
                <span className="text-xs text-slate-500">
                  {d.count.toLocaleString('en-IN')} · {percent.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className={`h-full rounded-full ${color.solid} transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <span className="text-xs text-slate-400">Total recorded parcels</span>
        <span className="text-sm font-bold text-white">{total.toLocaleString('en-IN')}</span>
      </div>
    </Card>
  )
}