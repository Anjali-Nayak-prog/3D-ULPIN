import { type UndergroundMode } from '../../types/map'
import { cn } from '../../utils/helpers'

interface UndergroundToggleProps {
  mode: UndergroundMode
  onChange: (mode: UndergroundMode) => void
}

const options: { value: UndergroundMode; label: string }[] = [
  { value: 'surface', label: 'Surface' },
  { value: 'underground', label: 'Underground' },
  { value: 'combined', label: 'Combined' },
]

export function UndergroundToggle({ mode, onChange }: UndergroundToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.07] bg-navy-900/80 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
            mode === option.value
              ? 'bg-primary-500/15 text-primary-300 shadow-glow-sm'
              : 'text-slate-500 hover:text-slate-300',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}