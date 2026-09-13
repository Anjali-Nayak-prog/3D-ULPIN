import { X, Fingerprint } from 'lucide-react'
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
    { label: 'Property Type', value: PROPERTY_TYPE_LABELS[building.propertyType] },
    { label: 'Parcel / District', value: building.district },
    { label: 'Cadastral ID', value: building.id },
    { label: 'Floors', value: `${building.floors} (F1–F${building.floors})` },
    {
      label: 'Elevation (Z)',
      value: `+0.0 m → +${building.height.toFixed(1)} m MSL`,
    },
    { label: 'Land Area', value: `${building.landArea.toLocaleString('en-IN')} m²` },
  ]

  return (
    <div className="pointer-events-auto absolute bottom-5 right-5 z-20 w-72 overflow-hidden rounded-xl border border-slate-200 bg-navy-900/95 shadow-2xl backdrop-blur-md animate-slide-in">
      <div className="flex items-start justify-between border-b border-slate-200 bg-slate-100/70 px-4 py-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-900">{building.name}</h4>
          <Badge tone={statusToneMap[building.status]} dot className="mt-1">
            {statusLabelMap[building.status]}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close property details"
        >
          <X size={15} />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-primary-500/30 bg-primary-500/[0.06] px-3 py-2">
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary-600">
            <Fingerprint size={12} />
            3D ULPIN
          </span>
          <span className="truncate font-mono text-xs font-semibold text-primary-700">
            {building.ulpin}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 px-4 pb-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">{row.label}</span>
            <span className="text-right text-xs font-medium text-slate-700">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            navigate(
              building.propertyId
                ? `/properties/${building.propertyId}`
                : `/properties?q=${encodeURIComponent(building.ulpin)}`,
            )
          }
        >
          View Details
        </Button>
        <p className="text-[10px] text-slate-400">Vertical volume · prototype record</p>
      </div>
    </div>
  )
}