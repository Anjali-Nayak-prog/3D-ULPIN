import {
  Building2,
  Car,
  Factory,
  Landmark,
  Layers3,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import type { PropertyType } from '../../types/property'
import { cn } from '../../utils/helpers'

const options: { type: PropertyType; label: string; description: string; icon: LucideIcon }[] = [
  { type: 'land', label: 'Land Parcel', description: 'Surface land with 2D extent', icon: Layers3 },
  { type: 'building', label: 'Building', description: 'Multi-storey structure', icon: Building2 },
  { type: 'apartment', label: 'Apartment', description: 'Individual vertical unit', icon: Warehouse },
  { type: 'parking', label: 'Parking', description: 'Surface or stacked parking', icon: Car },
  { type: 'underground', label: 'Underground Asset', description: 'Subterranean infrastructure', icon: Factory },
  { type: 'infrastructure', label: 'Infrastructure', description: 'Pipelines, utilities, elevated assets', icon: Landmark },
]

export interface PropertyTypeStepProps {
  value: PropertyType
  onChange: (type: PropertyType) => void
}

export function PropertyTypeStep({ value, onChange }: PropertyTypeStepProps) {
  return (
    <div>
      <p className="mb-4 text-xs leading-5 text-slate-500">
        Select the property class this ULPIN will represent. Vertical extents and geometry rules adjust automatically.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const active = value === option.type
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onChange(option.type)}
              className={cn(
                'group flex flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                active
                  ? 'border-primary-400/50 bg-primary-500/10 shadow-glow-sm'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-primary-400/30 hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  active ? 'bg-primary-500/20 text-primary-300' : 'bg-white/[0.04] text-slate-400 group-hover:text-slate-200',
                )}
              >
                <option.icon size={18} />
              </span>
              <span>
                <span className={cn('block text-sm font-semibold', active ? 'text-primary-300' : 'text-slate-100')}>
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{option.description}</span>
              </span>
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border transition-all',
                  active ? 'border-primary-400 bg-primary-500' : 'border-white/20',
                )}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}