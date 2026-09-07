import { useMemo } from 'react'
import { Building2 } from 'lucide-react'
import type { MapBuilding } from '../../types/map'
import { cn } from '../../utils/helpers'
import { STATUS_COLORS } from '../../utils/constants'

interface FloorSelectorProps {
  building: MapBuilding | null
  selectedFloor: number | null
  onSelectFloor: (floor: number | null) => void
}

export function FloorSelector({ building, selectedFloor, onSelectFloor }: FloorSelectorProps) {
  const floors = useMemo(() => {
    if (!building) return []
    const list: { level: number; label: string; zone: 'below' | 'ground' | 'above' }[] = []
    for (let i = 2; i >= 1; i--) {
      list.push({ level: -i, label: `Basement ${i}`, zone: 'below' })
    }
    list.push({ level: 0, label: 'Ground', zone: 'ground' })
    for (let i = 1; i <= building.floors; i++) {
      list.push({ level: i, label: `Floor ${String(i).padStart(2, '0')}`, zone: 'above' })
    }
    return list
  }, [building])

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <Building2 size={20} className="text-slate-600" />
        <p className="px-4 text-xs text-slate-500">
          Select a building on the map to browse its vertical floors
        </p>
      </div>
    )
  }
  const zoneColor = STATUS_COLORS[building.status]

  return (
    <div className="rounded-xl border border-white/[0.07] bg-navy-900/80 p-2">
      <div className="px-2 pb-1.5 pt-1">
        <h4 className="truncate text-[11px] font-semibold text-slate-200">{building.name}</h4>
        <p className="text-[10px] text-slate-500">Vertical floor profile</p>
      </div>
      <div className="flex max-h-64 items-stretch gap-1 overflow-x-auto pb-2">
        {floors.map((floor) => {
          const active = selectedFloor === floor.level
          const aboveGround = floor.zone === 'above'
          const baseColor = active
            ? zoneColor.hex
            : aboveGround
              ? '#60a5fa'
              : floor.zone === 'ground'
                ? '#34d399'
                : '#a855f7'
          return (
            <button
              key={floor.label}
              onClick={() => onSelectFloor(active ? null : floor.level)}
              title={floor.label}
              className={cn(
                'flex h-full w-11 shrink-0 flex-col items-center justify-end rounded-lg border px-1 pb-1.5 pt-2 transition-all duration-200 hover:-translate-y-0.5',
                active
                  ? 'border-white/40 shadow-glow-sm scale-105'
                  : 'border-white/[0.07] hover:border-white/20',
              )}
            >
              <span
                className="w-full rounded-sm transition-all duration-200"
                style={{
                  height: `${Math.max(12, 64 - floor.level * 2)}px`,
                  background: active ? baseColor : `${baseColor}66`,
                }}
              />
              <span
                className={cn(
                  'mt-1.5 w-full text-center text-[9px] font-medium',
                  active ? 'text-white' : 'text-slate-500',
                )}
              >
                {floor.level > 0 ? floor.level : floor.zone === 'ground' ? 'G' : `B${Math.abs(floor.level)}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}