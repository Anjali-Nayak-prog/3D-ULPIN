import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { easeOutCubic, useTweenAt } from './sceneUtils'

export interface FloorSpec {
  id: string
  x: number
  z: number
  w: number
  d: number
  yBase: number
  h: number
  color: string
}

export function makeFloorSpecs(opts: {
  x?: number
  z?: number
  w: number
  d: number
  count: number
  floorHeight?: number
  gap?: number
  color: string
  offset?: number
  idPrefix?: string
}): FloorSpec[] {
  const fh = opts.floorHeight ?? 0.9
  const gap = opts.gap ?? 0.1
  const off = opts.offset ?? 0
  return Array.from({ length: opts.count }, (_, i) => ({
    id: `${opts.idPrefix ?? 'f'}-${i}`,
    x: opts.x ?? 0,
    z: opts.z ?? 0,
    w: opts.w,
    d: opts.d,
    yBase: off + i * (fh + gap),
    h: fh,
    color: opts.color,
  }))
}

export function Building({
  specs,
  delay = 0,
  duration = 0.9,
}: {
  specs: FloorSpec[]
  delay?: number
  duration?: number
}) {
  const g = useRef<Group>(null)
  const tw = useTweenAt(delay, duration)
  useFrame(() => {
    if (g.current) g.current.scale.y = Math.max(0.0001, easeOutCubic(tw.current))
  })
  return (
    <group ref={g}>
      {specs.map((s) => (
        <mesh key={s.id} position={[s.x, s.yBase + s.h / 2, s.z]}>
          <boxGeometry args={[s.w, s.h, s.d]} />
          <meshStandardMaterial color={s.color} roughness={0.72} metalness={0.08} />
        </mesh>
      ))}
    </group>
  )
}