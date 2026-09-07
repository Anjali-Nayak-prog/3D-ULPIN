import { useState, type FormEvent } from 'react'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import type { PropertyFilters } from '../../types/property'
import { DISTRICTS, PROPERTY_TYPE_LABELS } from '../../utils/constants'
import { cn } from '../../utils/helpers'

interface PropertySearchFiltersProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
}

export function PropertySearchFilters({ filters, onChange, }: PropertySearchFiltersProps) {
  const [expanded, setExpanded] = useState(false)

  const update = (patch: Partial<PropertyFilters>) => onChange({ ...filters, ...patch })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void filters
  }

  const clearAll = () => {
    onChange({
      query: '',
      type: 'all',
      status: 'all',
      district: '',
      maxFloors: undefined,
      dateFrom: '',
      dateTo: '',
    })
  }

  const selectClass = 'h-9 rounded-lg border border-white/10 bg-navy-900 px-2.5 text-xs text-slate-200 outline-none transition-colors focus:border-primary-400/50'
  const inputClass = 'h-9 rounded-lg border border-white/10 bg-navy-900 px-3 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-primary-400/50 [color-scheme:dark]'

  return (
    <form onSubmit={submit} className="rounded-xl border border-white/[0.07] bg-navy-900/80 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search by ULPIN, Owner, Property ID, Survey Number, Apartment No., Coordinates..."
            className="h-10 w-full rounded-lg border border-white/10 bg-navy-950 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-primary-400/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className={cn(
              'flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors',
              expanded
                ? 'border-primary-400/40 bg-primary-500/10 text-primary-300'
                : 'border-white/10 text-slate-400 hover:text-white',
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount(filters) > 0 && (
              <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white">
                {activeFilterCount(filters)}
              </span>
            )}
          </button>
          {activeFilterCount(filters) > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-slate-500 transition-colors hover:text-white"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 animate-fade-in md:grid-cols-3 xl:grid-cols-6">
          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Property Type</span>
            <select
              value={filters.type}
              onChange={(e) => update({ type: e.target.value as PropertyFilters['type'] })}
              className={selectClass + ' w-full'}
            >
              <option value="all">All Types</option>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Status</span>
            <select
              value={filters.status}
              onChange={(e) => update({ status: e.target.value as PropertyFilters['status'] })}
              className={selectClass + ' w-full'}
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="conflict">Conflict</option>
              <option value="new">New</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">District</span>
            <select
              value={filters.district}
              onChange={(e) => update({ district: e.target.value })}
              className={selectClass + ' w-full'}
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Max Floors</span>
            <select
              value={filters.maxFloors ?? ''}
              onChange={(e) => update({ maxFloors: e.target.value ? Number(e.target.value) : undefined })}
              className={selectClass + ' w-full'}
            >
              <option value="">Any</option>
              <option value="5">≤ 5 floors</option>
              <option value="10">≤ 10 floors</option>
              <option value="20">≤ 20 floors</option>
              <option value="30">≤ 30 floors</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">From Date</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update({ dateFrom: e.target.value })}
              className={inputClass + ' w-full'}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-500">To Date</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update({ dateTo: e.target.value })}
              className={inputClass + ' w-full'}
            />
          </label>
        </div>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600">
        <Filter size={11} />
        Searching across {DISTRICTS.length} districts · WGS 84 coordinates · Survey & cadastral registers
      </p>
    </form>
  )
}

function activeFilterCount(filters: PropertyFilters): number {
  let count = 0
  if (filters.type && filters.type !== 'all') count += 1
  if (filters.status && filters.status !== 'all') count += 1
  if (filters.district) count += 1
  if (filters.maxFloors && filters.maxFloors > 0) count += 1
  if (filters.dateFrom) count += 1
  if (filters.dateTo) count += 1
  return count
}