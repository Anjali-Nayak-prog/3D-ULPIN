import { Line } from '@react-three/drei'
import { VZ } from './sceneUtils'

export interface ParcelProps {
  position?: [number, number, number]
  size?: [number, number]
  color?: string
  lineColor?: string
  lineWidth?: number
  y?: number
  fill?: boolean
}

export function Parcel({
  position = [0, 0, 0],
  size = [4, 3],
  color = VZ.parcel,
  lineColor = VZ.parcelLine,
  lineWidth = 1.5,
  y = 0,
  fill = true,
}: ParcelProps) {
  const [w, d] = size
  const hw = w / 2
  const hd = d / 2
  const pts: [number, number, number][] = [
    [-hw, y, -hd],
    [hw, y, -hd],
    [hw, y, hd],
    [-hw, y, hd],
    [-hw, y, -hd],
  ]
  return (
    <group position={position}>
      {fill && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
          <planeGeometry args={[w, d]} />
          <meshBasicMaterial color={color} transparent opacity={0.72} />
        </mesh>
      )}
      <Line points={pts} color={lineColor} lineWidth={lineWidth} dashed dashScale={0.55} gapSize={0.5} />
    </group>
  )
}