import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Building2, ChevronRight, LayoutGrid, List, MapPin } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertySearchFilters } from '../components/property/PropertySearchFilters'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { Badge } from '../components/common/Badge'
import { useProperties } from '../hooks/useProperties'
import type { Property, PropertyFilters } from '../types/property'
import { PROPERTY_TYPE_LABELS } from '../utils/constants'
import { formatHeight } from '../utils/formatters'
import { cn } from '../utils/helpers'

const defaultFilters: PropertyFilters = {
  query: '',
  type: 'all',
  status: 'all',
  district: '',
  maxFloors: undefined,
  dateFrom: '',
  dateTo: '',
}

export function PropertySearch() {
  const [params] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    ...defaultFilters,
    query: params.get('q') ?? '',
  }))

  useEffect(() => {
    const q = params.get('q')
    if (q !== null) {
      const t = setTimeout(() => setFilters((f) => ({ ...f, query: q })), 0)
      return () => clearTimeout(t)
    }
  }, [params])

  const { properties, loading } = useProperties(filters)

  const summary = useMemo(() => {
    if (!properties.length) return null
    return {
      verified: properties.filter((p) => p.status === 'verified').length,
      pending: properties.filter((p) => p.status === 'pending').length,
      conflict: properties.filter((p) => p.status === 'conflict').length,
    }
  }, [properties])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Property Search"
        subtitle="Search parcels, buildings, apartments and underground assets across the state"
      >
        <span className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-navy-900 px-3 py-2 text-xs text-slate-400">
          {loading ? 'Searching…' : `${properties.length} results`}
        </span>
      </PageHeader>

      <PropertySearchFilters filters={filters} onChange={setFilters} />

      {summary && (
        <div className="flex flex-wrap items-center gap-2">
          <SummaryPill label="Verified" count={summary.verified} dot="bg-emerald-400" />
          <SummaryPill label="Pending" count={summary.pending} dot="bg-amber-400" />
          <SummaryPill label="Conflict" count={summary.conflict} dot="bg-red-400" />
        </div>
      )}

      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-300">{properties.length}</span> records
            {filters.query && (
              <>
                {' '}for “<span className="text-primary-300">{filters.query}</span>”
              </>
            )}
          </p>
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] p-1">
            <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <LayoutGrid size={14} />
            </ViewButton>
            <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <List size={14} />
            </ViewButton>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.02]" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10">
            <EmptyState
              title="No properties match your search"
              description="Try a different ULPIN, owner name, or relax the filters above."
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {properties.map((property) => (
              <ListRow key={property.id} property={property} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

const listStatusTone: Record<string, 'green' | 'amber' | 'red' | 'blue'> = {
  verified: 'green',
  pending: 'amber',
  conflict: 'red',
  new: 'blue',
}

const listStatusLabel: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending',
  conflict: 'Conflict',
  new: 'New',
}

function ListRow({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-navy-900">
          {property.type === 'land' || property.type === 'infrastructure' ? (
            <MapPin size={15} className="text-primary-400" />
          ) : (
            <Building2 size={15} className="text-cyan-400" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-200 group-hover:text-white">{property.name}</p>
          <p className="truncate font-mono text-[11px] text-slate-600">{property.ulpin}</p>
        </div>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <span className="w-20 text-xs text-slate-500">{PROPERTY_TYPE_LABELS[property.type]}</span>
        <span className="w-20 text-right text-xs text-slate-500">{formatHeight(property.spatial.maxHeight)}</span>
        <Badge tone={listStatusTone[property.status]}>{listStatusLabel[property.status]}</Badge>
      </div>
      <ChevronRight size={15} className="shrink-0 text-slate-700 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
    </Link>
  )
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
        active ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300',
      )}
    >
      {children}
    </button>
  )
}

function SummaryPill({ label, count, dot }: { label: string; count: number; dot: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-navy-900/70 px-3 py-1.5 text-[11px] text-slate-400">
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
      <span className="font-mono font-semibold text-slate-200">{count}</span>
    </span>
  )
}