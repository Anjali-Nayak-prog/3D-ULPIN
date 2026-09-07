import {
  FileText,
  Map as MapIcon,
  Radar,
  Satellite,
  Scan,
  type LucideIcon,
} from 'lucide-react'
import type { DataSourceType, Property } from '../../types/property'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'

const sourceIconMap: Record<DataSourceType, LucideIcon> = {
  drone: Satellite,
  lidar: Radar,
  gis: MapIcon,
  gnss: Satellite,
  'floor-plan': FileText,
  survey: Scan,
}

const sourceLabelMap: Record<DataSourceType, string> = {
  drone: 'Drone Survey',
  lidar: 'LiDAR',
  gis: 'GIS Parcel Layer',
  gnss: 'GNSS / CORS',
  'floor-plan': 'Building Plan',
  survey: 'Field Survey',
}

const statusToneMap: Record<string, 'green' | 'amber' | 'cyan'> = {
  verified: 'green',
  processing: 'amber',
  pending: 'cyan',
}

const statusToneLabel: Record<string, string> = {
  verified: 'Verified',
  processing: 'Processing',
  pending: 'Pending',
}

interface DataProvenanceProps {
  property: Property
}

export function DataProvenance({ property }: DataProvenanceProps) {
  return (
    <Card
      title="Data Provenance"
      subtitle="Source datasets used for 3D reconstruction"
      className="h-full"
    >
      <div className="space-y-2">
        {property.dataSources.map((source) => {
          const Icon = sourceIconMap[source.type]
          return (
            <div
              key={source.id}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Icon size={15} className="text-slate-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-200">
                  {sourceLabelMap[source.type]}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">{source.provider}</p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[10px] text-slate-500">{source.lastUpdated}</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                  {source.confidence.toFixed(1)}% conf.
                </p>
              </div>
              <Badge tone={statusToneMap[source.status] ?? 'slate'}>
                {statusToneLabel[source.status] ?? source.status}
              </Badge>
            </div>
          )
        })}
      </div>
    </Card>
  )
}