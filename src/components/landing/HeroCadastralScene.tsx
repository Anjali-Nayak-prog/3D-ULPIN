import { useMemo } from 'react'
import { Html, Line } from '@react-three/drei'
import type { MapBuilding } from '../../types/map'
import { landmarkBuildings } from '../../data/mapData'
import { SceneStage } from './three/SceneStage'
import { Building, makeFloorSpecs, type FloorSpec } from './three/Building'
import { PropertyVolume } from './three/PropertyVolume'
import { Parcel } from './three/Parcel'
import { Rise, VZ, chipCls } from './three/sceneUtils'

const UNITS = 1.05
const FLOOR_H = 0.34
const FLOOR_GAP = 0.05
const FLOOR_PITCH = FLOOR_H + FLOOR_GAP
const SELECTED_FLOOR = 6
const FEATURED_ID = 'landmark-1'
const COLORS = ['#3b82f6', '#6366f1', '#0ea5e9', '#2563eb', '#4f46e5', '#0284c7']

function HeroTower({ building, index }: { building: MapBuilding; index: number }) {
  const featured = building.id === FEATURED_ID
  const x = building.gridX * UNITS
  const z = building.gridZ * UNITS
  const cx = x + building.width / 2
  const cz = z + building.depth / 2
  const color = COLORS[index % COLORS.length]

  const spec: FloorSpec[] = useMemo(
    () =>
      makeFloorSpecs({
        x: cx,
        z: cz,
        w: building.width,
        d: building.depth,
        count: building.floors,
        floorHeight: FLOOR_H,
        gap: FLOOR_GAP,
        color,
        idPrefix: building.id,
      }),
    [building, cx, cz, color],
  )

  const slabs = featured ? spec.filter((_, idx) => idx !== SELECTED_FLOOR) : spec
  const sel = featured ? spec[SELECTED_FLOOR] : null
  const topY = building.floors * FLOOR_PITCH

  return (
    <group>
      <Parcel position={[cx, 0, cz]} size={[building.width + 0.8, building.depth + 0.8]} y={0.002} fill={false} />
      <Building specs={slabs} delay={0.2 + index * 0.12} duration={0.9} />
      {sel && (
        <Rise delay={1.05} duration={0.6}>
          <group position={[sel.x + sel.w * 0.75, sel.yBase + sel.h / 2, sel.z]}>
            <PropertyVolume position={[0, 0, 0]} size={[sel.w * 0.9, sel.h * 0.96, sel.d * 0.9]} bob />
          </group>
        </Rise>
      )}
      {sel && (
        <Html position={[cx + 0.4, topY + 0.9, cz]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]} distanceFactor={20}>
          <div className="min-w-[150px] border-ai-500/40 bg-white/95 px-2.5 py-1.5">
            <p className="font-sans font-bold uppercase tracking-wider text-ai-600" style={{ fontSize: 8 }}>Selected 3D volume</p>
            <p className="mt-0.5 text-slate-700">
              Floor 07 <span className="text-slate-400">·</span> Elevation +21.4 → +24.6 m
            </p>
            <p className="mt-0.5 text-primary-600">3D ULPIN · IND-PN-1024-V07-8F3A21</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function CityGround() {
  const roads: { position: [number, number, number]; size: [number, number, number] }[] = [
    { position: [3.2, 0.02, 5.2], size: [0.5, 0.05, 10.5] },
    { position: [5.2, 0.02, 7.35], size: [10.5, 0.05, 0.5] },
  ]
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.2, 0, 5.2]}>
        <planeGeometry args={[13.2, 11.4]} />
        <meshStandardMaterial color={VZ.ground} roughness={1} metalness={0} />
      </mesh>
      {roads.map((r, i) => (
        <mesh key={i} position={r.position}>
          <boxGeometry args={r.size} />
          <meshStandardMaterial color={VZ.road} roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

function GridLines() {
  const lines: [number, number, number][][] = []
  for (let i = 0; i <= 12; i += 2) {
    lines.push([
      [i, 0.005, -0.4],
      [i, 0.005, 11.0],
    ])
    lines.push([
      [-0.4, 0.005, i - 0.2],
      [13.6, 0.005, i - 0.2],
    ])
  }
  const mapped = lines.map((pts) => pts as [number, number, number][])
  return (
    <group>
      {mapped.map((pts, idx) => (
        <Line key={idx} points={pts} color={VZ.gridLine} lineWidth={0.75} transparent opacity={0.5} />
      ))}
    </group>
  )
}

export function HeroCadastralScene() {
  return (
    <SceneStage
      className="h-full w-full"
      camera={{ position: [15, 12.5, 19], target: [5.2, 3, 4.8], fov: 44 }}
      overlay={() => (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center px-4" aria-hidden="true">
          <span data-fade style={{ opacity: 0 }} className={chipCls}>
            Volumetric parcel city · one property volume isolated from its stack
          </span>
        </div>
      )}
    >
      <CityGround />
      <GridLines />
      {landmarkBuildings.map((b, i) => (
        <HeroTower key={b.id} building={b} index={i} />
      ))}
    </SceneStage>
  )
}