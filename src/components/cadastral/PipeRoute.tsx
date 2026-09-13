import { useMemo, useState } from 'react'
import { Curve, Vector3 } from 'three'

class PolylineCurve extends Curve<Vector3> {
  points: Vector3[]

  constructor(points: Vector3[]) {
    super()
    this.points = points
  }

  override getPoint(t: number, target: Vector3 = new Vector3()) {
    const segs = Math.max(1, this.points.length - 1)
    const raw = t * segs
    const idx = Math.min(segs - 1, Math.floor(raw))
    const frac = raw - idx
    return target.lerpVectors(this.points[idx], this.points[idx + 1], frac)
  }
}

export interface PipeRouteProps {
  points: [number, number, number][]
  color: string
  radius?: number
  opacity?: number
  onSelect?: () => void
  onHover?: (hovered: boolean) => void
}

const setCursor = (cursor: string) => {
  document.body.style.cursor = cursor
}

export function PipeRoute({
  points,
  color,
  radius = 0.07,
  opacity = 1,
  onSelect,
  onHover,
}: PipeRouteProps) {
  const curve = useMemo(() => {
    const pts = points.map(([x, y, z]) => new Vector3(x, y, z))
    return new PolylineCurve(pts)
  }, [points])
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      onClick={
        onSelect
          ? (e) => {
              e.stopPropagation()
              onSelect()
            }
          : undefined
      }
      onPointerOver={
        onHover
          ? (e) => {
              e.stopPropagation()
              setCursor('pointer')
              setHovered(true)
              onHover(true)
            }
          : undefined
      }
      onPointerOut={
        onHover
          ? () => {
              setCursor('auto')
              setHovered(false)
              onHover(false)
            }
          : undefined
      }
    >
      <tubeGeometry args={[curve, Math.max(24, (points.length - 1) * 8), radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        roughness={0.45}
        metalness={0.18}
        transparent
        opacity={opacity}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.6 : 0}
      />
    </mesh>
  )
}

export function PipeJunctions({
  points,
  radius,
  color = '#64748b',
}: {
  points: [number, number, number][]
  radius: number
  color?: string
}) {
  const nodes = points.filter((_, i) => i > 0 && i < points.length - 1)
  if (nodes.length === 0) return null
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[radius * 1.5, radius * 1.5, Math.max(0.18, radius * 2.2), 12]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.25} />
        </mesh>
      ))}
    </group>
  )
}