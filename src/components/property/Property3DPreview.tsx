import type { Property } from '../../types/property'
import { STATUS_COLORS, PROPERTY_TYPE_HEX } from '../../utils/constants'
import { isoBoxGeometry, shadeHex } from '../../utils/isometric'

interface Property3DPreviewProps {
  property: Property
}

export function Property3DPreview({ property }: Property3DPreviewProps) {
  const color = PROPERTY_TYPE_HEX[property.type] ?? STATUS_COLORS.verified.hex
  const floorCount = Math.min(property.building?.floors ?? 2, 12)

  const blocks = Array.from({ length: floorCount }, (_, i) => {
    const geom = isoBoxGeometry(0, 0, 4, 3, 3 * (i + 1), { tile: 36, heightScale: 0.12 })
    return { i, geom }
  })

  const width = 360
  const height = 210

  return (
    <div
      className="bg-grid relative flex items-center justify-center overflow-hidden"
      style={{ height }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <g transform={`translate(${width / 2 - 40}, ${height - 26})`}>
          {blocks.map(({ i, geom }) => (
            <g key={i} opacity={0.5 + (i / (floorCount + 2)) * 0.5}>
              <polygon
                points={geom.left}
                fill={shadeHex(color, 0.6)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={0.4}
              />
              <polygon
                points={geom.right}
                fill={shadeHex(color, 0.76)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={0.4}
              />
              <polygon
                points={geom.top}
                fill={i === floorCount - 1 ? shadeHex(color, 1.15) : color}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={0.5}
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute left-3 top-3 flex flex-col gap-1">
        <span className="rounded-md border border-white/[0.07] bg-navy-900/80 px-2 py-1 text-[10px] text-slate-300">
          {property.building?.floors ?? 1} floors
        </span>
        <span className="rounded-md border border-white/[0.07] bg-navy-900/80 px-2 py-1 text-[10px] text-slate-300">
          {property.building?.height
            ? `${property.building.height} m`
            : `${(property.spatial.maxHeight - property.spatial.minHeight).toFixed(0)} m height`}
        </span>
        <span className="rounded-md border border-white/[0.07] bg-navy-900/80 px-2 py-1 text-[10px] text-slate-300">
          {property.spatial.volume.toLocaleString('en-IN')} m³
        </span>
      </div>
    </div>
  )
}