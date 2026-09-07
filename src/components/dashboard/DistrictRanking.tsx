import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesByDistrict } from '../../data/analyticsData'
import { Card } from '../common/Card'

export function DistrictRanking() {
  const navigate = useNavigate()
  const topDistricts = propertiesByDistrict.slice(0, 5)
  const max = topDistricts[0].count

  return (
    <Card
      title="Top Districts by Parcels"
      subtitle="Parcel density across revenue districts"
      className="h-full"
      action={
        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-1 text-xs font-medium text-primary-400 transition-colors hover:text-primary-300"
        >
          View all <ChevronRight size={13} />
        </button>
      }
    >
      <div className="space-y-4">
        {topDistricts.map((district, index) => (
          <div key={district.district} className="group">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.04] text-[10px] font-bold text-slate-500">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-slate-200">{district.district}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {district.count.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 group-hover:from-primary-500 group-hover:to-cyan-400"
                style={{ width: `${(district.count / max) * 100}%`, animationDelay: `${index * 100}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}