import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { VZ } from './sceneUtils'

export interface PropertyVolumeProps {
  position: [number, number, number]
  size?: [number, number, number]
  color?: string
  topColor?: string
  bob?: boolean
}

export function PropertyVolume({
  position,
  size = [1, 1, 1],
  color = VZ.selected,
  topColor = VZ.selectedLight,
  bob = false,
}: PropertyVolumeProps) {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (bob && ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.06
    }
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.01, 0]}>
        <boxGeometry args={[size[0] * 0.95, 0.025, size[2] * 0.95]} />
        <meshStandardMaterial color={topColor} roughness={0.42} metalness={0.2} />
      </mesh>
    </group>
  )
}