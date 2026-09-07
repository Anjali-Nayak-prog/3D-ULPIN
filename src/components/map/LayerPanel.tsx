import type { MapLayer } from '../../types/map'
import { cn } from '../../utils/helpers'

const categoryLabels = {
  surface: 'Surface Layers',
  underground: 'Underground Layers',
  base: 'Base Data',
} as const

interface LayerPanelProps {
  layers: MapLayer[]
  onToggle: (id: string) => void
  onOpacityChange: (id: string, opacity: number) => void
}

export function LayerPanel({ layers, onToggle, onOpacityChange }: LayerPanelProps) {
  const groups = (['surface', 'underground', 'base'] as const)
    .map((category) => ({
      category,
      layers: layers.filter((l) => l.category === category),
    }))
    .filter((g) => g.layers.length > 0)

  return (
    <div className="rounded-xl border border-white/[0.07] bg-navy-900/80 p-2">
      <div className="px-2 pb-1 pt-1.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Layers
        </h4>
      </div>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.category}>
            <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-slate-600">
              {categoryLabels[group.category]}
            </p>
            <div className="space-y-0.5">
              {group.layers.map((layer) => (
                <div
                  key={layer.id}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => onToggle(layer.id)}
                    className="h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-white/20 bg-transparent transition-all checked:border-transparent checked:bg-primary-500"
                    style={{
                      ...(layer.visible
                        ? { backgroundImage: `linear-gradient(${layer.color}, ${layer.color})` }
                        : {}),
                    }}
                  />
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: layer.color }}
                  />
                  <span className="flex-1 truncate text-xs text-slate-300">{layer.name}</span>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={Math.round(layer.opacity * 100)}
                    onChange={(e) => onOpacityChange(layer.id, Number(e.target.value) / 100)}
                    className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-primary-400"
                    aria-label={`${layer.name} opacity`}
                  />
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] text-slate-500">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}