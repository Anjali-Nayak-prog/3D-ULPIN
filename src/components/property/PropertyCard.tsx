import { Building2, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Property } from '../../types/property'
import { PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { formatHeight } from '../../utils/formatters'
import { cn } from '../../utils/helpers'
import { Badge } from '../common/Badge'

const statusToneMap: Record<string, 'green' | 'amber' | 'red' | 'blue'> = {
  verified: 'green',
  pending: 'amber',
  conflict: 'red',
  new: 'blue',
}

const statusLabelMap: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending',
  conflict: 'Conflict',
  new: 'New',
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const typeLabel = PROPERTY_TYPE_LABELS[property.type]

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group flex flex-col rounded-xl border border-white/[0.06] bg-navy-900/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400/30 hover:shadow-glow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
            <Building2 size={18} className="text-primary-400" />
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-white">{property.name}</h4>
            <p className="truncate font-mono text-[11px] text-slate-500">{property.ulpin}</p>
          </div>
        </div>
        <Badge tone={statusToneMap[property.status] ?? 'slate'} dot>
          {statusLabelMap[property.status] ?? property.status}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-slate-400">
          {typeLabel}
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <MapPin size={11} />
          {property.district}
        </span>
        {property.building?.height && (
          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-slate-400">
            {formatHeight(property.building.height)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="text-[11px] text-slate-500">
          {property.owner.name}
        </span>
        <span className={cn(
          'flex items-center gap-1 text-xs font-medium text-primary-400 transition-all group-hover:gap-2',
        )}>
          View <ChevronRight size={13} />
        </span>
      </div>

      {property.status === 'conflict' && (
        <div className="mt-2 rounded-lg border border-red-500/25 bg-red-500/[0.06] px-3 py-1.5 text-[11px] text-red-300">
          Ownership conflict detected
        </div>
      )}
    </Link>
  )
}