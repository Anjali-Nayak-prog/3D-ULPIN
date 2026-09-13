import type { ReactNode } from 'react'
import { PipeJunctions, PipeRoute } from '../../cadastral/PipeRoute'
import { UG_OFFSET } from '../three/sceneUtils'

export interface NetworkAssetProps {
  name: string
  path: { x: number; z: number }[]
  depth: number
  color: string
  lineWidth?: number
  dashed?: boolean
  dashScale?: number
}

export function UndergroundNetwork({
  assets,
  onSelect,
  selectedName,
  onHover,
  renderLabel,
}: {
  assets: NetworkAssetProps[]
  onSelect?: (name: string) => void
  selectedName?: string | null
  onHover?: (name: string | null) => void
  renderLabel?: (asset: NetworkAssetProps, center: [number, number, number]) => ReactNode
}) {
  return (
    <group>
      {assets.map((a) => {
        const pts = a.path.map(
          (p) => [p.x - UG_OFFSET[0], -a.depth, p.z - UG_OFFSET[1]] as [number, number, number],
        )
        const center = pts[Math.floor(pts.length / 2)]
        const isSelected = selectedName === a.name
        return (
          <group key={a.name}>
            <PipeRoute
              points={pts}
              color={a.color}
              radius={Math.max(0.05, (a.lineWidth ?? 3.5) / 45)}
              opacity={isSelected ? 1 : 0.92}
              onSelect={onSelect ? () => onSelect(a.name) : undefined}
              onHover={onHover ? (h) => onHover(h ? a.name : null) : undefined}
            />
            <PipeJunctions points={pts} radius={Math.max(0.05, (a.lineWidth ?? 3.5) / 45)} color={a.color} />
            {renderLabel?.(a, center)}
          </group>
        )
      })}
    </group>
  )
}