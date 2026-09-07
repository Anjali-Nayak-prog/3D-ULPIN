import { Box, Crosshair, MapPinned, Mountain } from 'lucide-react'
import type { Property } from '../../types/property'
import { formatCoordinates, formatElevation, formatVolume } from '../../utils/formatters'
import { Card } from '../common/Card'

interface SpatialInfoProps {
  property: Property
}

function InfoRow({ icon: Icon, label, value, mono = false }: { icon: typeof Crosshair; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
        <Icon size={15} className="text-primary-400" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className={`mt-0.5 truncate text-sm font-medium text-slate-200 ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function SpatialInfo({ property }: SpatialInfoProps) {
  const spatial = property.spatial

  return (
    <Card
      title="Spatial Information"
      subtitle="WGS 84 · UTM 43N · MSL datum"
      className="h-full"
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <InfoRow icon={Crosshair} label="Latitude" value={spatial.latitude.toFixed(6)} mono />
        <InfoRow icon={MapPinned} label="Longitude" value={spatial.longitude.toFixed(6)} mono />
        <InfoRow icon={Mountain} label="Elevation" value={formatElevation(spatial.elevation)} />
        <InfoRow icon={Mountain} label="Minimum Height" value={formatElevation(spatial.minHeight)} />
        <InfoRow icon={Mountain} label="Maximum Height" value={formatElevation(spatial.maxHeight)} />
        <InfoRow icon={Box} label="Volume" value={formatVolume(spatial.volume)} />
      </div>

      <div className="mt-3 rounded-lg border border-white/[0.06] px-3 py-2 text-center">
        <p className="font-mono text-xs text-slate-400">
          {formatCoordinates(spatial.latitude, spatial.longitude)}
        </p>
      </div>
    </Card>
  )
}