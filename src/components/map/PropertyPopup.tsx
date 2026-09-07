import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { MapBuilding } from '../../types/map'
import { PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

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

interface PropertyPopupProps {
  building: MapBuilding | null
  onClose: () => void
}

export function PropertyPopup({ building, onClose }: PropertyPopupProps) {
  const navigate = useNavigate()

  if (!building) return null

  const rows = [
    { label: '3D ULPIN', value: building.ulpin, mono: true },
    { label: 'Property Type', value: PROPERTY_TYPE_LABELS[building.propertyType] },
    { label: 'Number of Floors', value: String(building.floors) },
    { label: 'Height', value: `${building.height} m` },
    { label: 'Land Area', value: `${building.landArea.toLocaleString('en-IN')} m²` },
  ]

  return (
    <div className="pointer-events-auto absolute bottom-5 right-5 z-20 w-72 overflow-hidden rounded-xl border border-white/[0.1] bg-navy-900/95 shadow-2xl backdrop-blur-md animate-slide-in">
      <div className="flex items-start justify-between border-b border-white/[0.07] bg-white/[0.03] px-4 py-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-white">{building.name}</h4>
          <Badge tone={statusToneMap[building.status]} dot className="mt-1">
            {statusLabelMap[building.status]}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={15} />
        </button>
      </div>

      <div className="space-y-2.5 px-4 py-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">{row.label}</span>
            <span
              className={`text-xs font-medium text-slate-200 ${row.mono ? 'font-mono' : ''}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/properties?q=${encodeURIComponent(building.ulpin)}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}