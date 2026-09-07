import { ArrowUpDown, Building2, Layers3, MapPin, Ruler, Trees } from 'lucide-react'
import type { Property } from '../../types/property'
import { PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { formatArea, formatHeight } from '../../utils/formatters'
import { cn } from '../../utils/helpers'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { Property3DPreview } from './Property3DPreview'
import { OwnershipPanel } from './OwnershipPanel'
import { SpatialInfo } from './SpatialInfo'
import { DataProvenance } from './DataProvenance'

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-white">
      {children}
    </h3>
  )
}

interface FieldRowProps {
  label: string
  value: string
  mono?: boolean
}

function FieldRow({ label, value, mono = false }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-2.5 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-right text-xs font-medium text-slate-200 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}

interface PropertyDetailsProps {
  property: Property
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-5">
      {/* Header status strip */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-navy-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/15">
            <Building2 size={22} className="text-primary-400" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">{property.name}</h2>
            <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={12} />
              {property.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusToneMap[property.status] ?? 'slate'} dot>
            {statusLabelMap[property.status] ?? property.status}
          </Badge>
          <Badge tone="blue">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <SectionLabel>
              <Ruler size={15} className="text-primary-400" />
              Property Information
            </SectionLabel>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <FieldRow label="Property Name" value={property.name} />
              <FieldRow label="Property Type" value={PROPERTY_TYPE_LABELS[property.type]} />
              <FieldRow label="3D ULPIN" value={property.ulpin} mono />
              <FieldRow label="Status" value={statusLabelMap[property.status] ?? property.status} />
              <FieldRow label="District" value={property.district} />
              <FieldRow label="Taluka" value={property.taluka} />
              <FieldRow label="Ward" value={property.ward} />
              <FieldRow label="Registered" value={formatDateShort(property.createdAt)} />
            </div>
            {property.description && (
              <p className="mt-4 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-xs leading-5 text-slate-400">
                {property.description}
              </p>
            )}
          </Card>

          {property.building && (
            <Card>
              <SectionLabel>
                <Layers3 size={15} className="text-cyan-400" />
                Building Information
              </SectionLabel>
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <FieldRow label="Floors" value={String(property.building.floors)} />
                <FieldRow label="Units" value={String(property.building.units)} />
                <FieldRow label="Height" value={formatHeight(property.building.height)} />
                <FieldRow label="Built-up Area" value={formatArea(property.building.builtUpArea)} />
                <FieldRow label="Year Built" value={String(property.building.yearBuilt ?? '—')} />
                <FieldRow label="Type" value={property.building.isHighRise ? 'High-rise' : 'Low-rise'} />
              </div>
            </Card>
          )}

          {property.apartment && (
            <Card>
              <SectionLabel>
                <Building2 size={15} className="text-sky-400" />
                Apartment Information
              </SectionLabel>
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <FieldRow label="Unit Number" value={property.apartment.unitNumber} mono />
                <FieldRow label="Floor" value={String(property.apartment.floor)} />
                <FieldRow label="Built-up Area" value={formatArea(property.apartment.builtUpArea)} />
                <FieldRow label="Carpet Area" value={formatArea(property.apartment.carpetArea)} />
              </div>
            </Card>
          )}

          {property.underground && (
            <Card>
              <SectionLabel>
                <ArrowUpDown size={15} className="text-purple-400" />
                Underground Asset Information
              </SectionLabel>
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <FieldRow label="Asset Type" value={property.underground.assetType} />
                <FieldRow label="Depth" value={`${property.underground.depth} m`} />
                {property.underground.diameter && (
                  <FieldRow label="Diameter" value={`${property.underground.diameter} m`} />
                )}
                {property.underground.material && (
                  <FieldRow label="Material" value={property.underground.material} />
                )}
                {property.underground.utilityOwner && (
                  <FieldRow label="Utility Owner" value={property.underground.utilityOwner} />
                )}
              </div>
            </Card>
          )}

          <Card>
            <SectionLabel>
              <Trees size={15} className="text-emerald-400" />
              Land Information
            </SectionLabel>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {property.land && (
                <>
                  <FieldRow label="Parcel Area" value={formatArea(property.land.parcelArea)} />
                  <FieldRow label="Survey Number" value={property.land.surveyNumber} mono />
                  <FieldRow label="District" value={property.land.district} />
                  <FieldRow label="Zone" value={property.land.zone} />
                </>
              )}
              <FieldRow label="Taluka" value={property.taluka} />
              <FieldRow label="Ward" value={property.ward} />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className={cn('overflow-hidden')}>
            <h3 className="px-5 pt-5 text-sm font-bold tracking-wide text-white">
              3D Preview
            </h3>
            <p className="px-5 pb-3 text-xs text-slate-500">
              Volumetric reconstruction from source data
            </p>
            <Property3DPreview property={property} />
          </Card>

          <SpatialInfo property={property} />
          <OwnershipPanel property={property} />
          <DataProvenance property={property} />
        </div>
      </div>
    </div>
  )
}

function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}