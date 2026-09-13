import { useState } from 'react'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { undergroundAssets } from '../../data/mapData'
import { SceneStage } from './three/SceneStage'
import { UndergroundNetwork, type NetworkAssetProps } from './three/UndergroundNetwork'
import { Rise, UG_OFFSET, VZ, chipCls, clamp01 } from './three/sceneUtils'
import { UndergroundAssetPopup } from '../map/UndergroundAssetPopup'

const CORRIDOR_DEPTH = 8.5
const CABLE_X = 2

const rulerPoints: [number, number, number][] = [
  [-8.6, 4.5, 0],
  [-8.6, -13.5, 0],
]
const datumLine: [number, number, number][] = [
  [-8.2, 0.02, 0],
  [8.2, 0.02, 0],
]

function Ground() {
  const mat = useRef<Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mat.current) {
      const m = mat.current.material as MeshBasicMaterial
      m.opacity = clamp01((t - 0.15) / 0.7) * 0.35
    }
  })
  const grid: [number, number, number][][] = []
  for (let i = -6; i <= 6; i += 2) {
    grid.push([[i, 0.004, -5], [i, 0.004, 5]])
    grid.push([[-7.5, 0.004, i], [7.5, 0.004, i]])
  }
  return (
    <group>
      <mesh ref={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[15.6, 10.8]} />
        <meshBasicMaterial color={VZ.ground} transparent opacity={0.001} depthWrite={false} />
      </mesh>
      {/* Surface slab — the datum the parcel grid and buildings sit on */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[15.6, 0.06, 10.8]} />
        <meshStandardMaterial color={VZ.slab} roughness={0.95} metalness={0} transparent opacity={0.55} />
      </mesh>
      {grid.map((pts, i) => (
        <Line key={i} points={pts as [number, number, number][]} color={VZ.gridLine} lineWidth={0.7} transparent opacity={0.4} />
      ))}
      <Line points={datumLine} color="#38bdf8" lineWidth={1.8} />
      <Html position={[3.4, 0.35, 2.6]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]} distanceFactor={12}>
        <span className={`${chipCls} border-sky-500/40 text-sky-700`}>Surface · ±0 m datum</span>
      </Html>
    </group>
  )
}

function SurfaceContext() {
  const bx = 0.5
  const bz = -1.2
  const pad = 0.7
  const outline: [number, number, number][] = [
    [bx - pad, 0.02, bz - pad],
    [bx + 2.6 + pad, 0.02, bz - pad],
    [bx + 2.6 + pad, 0.02, bz + 2.0 + pad],
    [bx - pad, 0.02, bz + 2.0 + pad],
    [bx - pad, 0.02, bz - pad],
  ]
  return (
    <group>
      <Line points={outline} color={VZ.parcelLine} lineWidth={1.5} dashed dashScale={0.35} gapSize={0.4} />
      {Array.from({ length: 4 }, (_, i) => (
        <Rise key={i} delay={0.3 + i * 0.1} duration={0.7}>
          <mesh position={[bx + 1.3, i * 0.78 + 0.39, bz + 1.0]}>
            <boxGeometry args={[2.6, 0.74, 2.0]} />
            <meshStandardMaterial color={VZ.slab} roughness={0.8} metalness={0.05} transparent opacity={0.5} />
          </mesh>
        </Rise>
      ))}
      <Html
        position={[bx + 1.3, 4 * 0.78 + 0.55, bz + 1.0]}
        center
        style={{ pointerEvents: 'none' }}
        zIndexRange={[30, 0]}
        distanceFactor={12}
      >
        <span className={`${chipCls} border-sky-500/40 text-sky-700`}>Surface parcel · 3D ULPIN above</span>
      </Html>
    </group>
  )
}

function Corridor() {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -CORRIDOR_DEPTH + Math.sin(state.clock.elapsedTime * 1.0) * 0.04
    }
  })
  const cx = CABLE_X - UG_OFFSET[0]
  return (
    <group>
      <mesh ref={ref} position={[cx, -CORRIDOR_DEPTH, 0]}>
        <boxGeometry args={[0.85, 0.55, 9.2]} />
        <meshStandardMaterial color={VZ.selected} roughness={0.5} metalness={0.12} transparent opacity={0.92} />
      </mesh>
      <Html position={[cx, -6.8, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]} distanceFactor={10}>
        <div className="border-ai-500/40 bg-white/95 px-2.5 py-1.5">
          <p className="font-sans font-bold uppercase tracking-wider text-ai-600" style={{ fontSize: 8 }}>
            Utility Corridor
          </p>
          <p className="text-slate-700" style={{ fontSize: 9 }}>
            Elevation −8.5 m
          </p>
          <p className="text-slate-700" style={{ fontSize: 9 }}>
            Status: Validated · 3D Spatial ID UG-1024-Z085
          </p>
        </div>
      </Html>
    </group>
  )
}

function ParkingSlab() {
  const cx = 10 - UG_OFFSET[0]
  const cz = 7 - UG_OFFSET[1]
  return (
    <mesh position={[cx + 0.8, -3.2, cz + 0.5]}>
      <boxGeometry args={[2.6, 0.35, 1.6]} />
      <meshStandardMaterial color={VZ.basementDeep} roughness={0.65} metalness={0.08} transparent opacity={0.45} />
    </mesh>
  )
}

export function UndergroundScene() {
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const assets: NetworkAssetProps[] = undergroundAssets
    .filter((a) => a.kind !== 'metro')
    .map((a) => ({
      name: a.name,
      path: a.path,
      depth: a.depth,
      color: a.kind === 'water' ? VZ.water : a.kind === 'sewer' ? VZ.sewer : a.kind === 'power' ? VZ.power : VZ.telecom,
      lineWidth: a.kind === 'sewer' ? 4.5 : a.kind === 'power' ? 3.5 : 3.5,
    }))

  const selectedAsset = undergroundAssets.find((a) => a.name === selectedName) ?? null

  const legend = [
    { name: 'Water Main', depth: 6.5, color: VZ.water },
    { name: 'Power Cable', depth: 9.0, color: VZ.power },
    { name: 'Sewer Trunk', depth: 11.0, color: VZ.sewer },
    { name: 'Telecom Duct', depth: 3.2, color: VZ.telecom },
    { name: 'Utility Corridor', depth: 8.5, color: VZ.selected },
  ]

  return (
    <SceneStage
      className="h-[340px] w-full sm:h-[380px]"
      camera={{ position: [15, 11, 19.5], target: [0, -3, 0], fov: 44 }}
      onPointerMissed={() => setSelectedName(null)}
      overlay={() => (
        <>
          <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
            <span data-fade style={{ opacity: 0 }} className={`absolute left-2 top-2 ${chipCls} border-sky-500/40 text-sky-700`}>
              Subsurface Utility Network
            </span>

            <div className="absolute left-1.5 top-12 bottom-10 flex flex-col justify-between">
              {['+10m', '0m', '−5m', '−10m', '−15m'].map((l) => (
                <span
                  key={l}
                  data-fade
                  style={{ opacity: 0 }}
                  className="text-right font-mono text-[9px] leading-none text-slate-400"
                >
                  {l}
                </span>
              ))}
            </div>

            <div className="absolute bottom-2 left-1.5 right-1.5 flex flex-wrap justify-center gap-1.5 max-[480px]:grid max-[480px]:grid-cols-2">
              {legend.map((l) => (
                <span
                  key={l.name}
                  data-fade
                  style={{ opacity: 0 }}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white/95 px-2 py-1 shadow-sm"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="truncate font-mono text-[9px] leading-tight text-slate-600">
                    {l.name} · −{l.depth} m
                  </span>
                </span>
              ))}
            </div>
          </div>

          {selectedAsset && (
            <div className="absolute right-2 top-2 z-20 max-w-[250px]">
              <UndergroundAssetPopup
                asset={selectedAsset}
                onClose={() => setSelectedName(null)}
                className="shadow-2xl"
              />
            </div>
          )}
        </>
      )}
    >
      <Ground />
      <SurfaceContext />
      <Line points={rulerPoints} color="#cbd5e1" lineWidth={1.2} />
      <UndergroundNetwork
        assets={assets}
        selectedName={selectedName}
        onSelect={(name) => setSelectedName((prev) => (prev === name ? null : name))}
        renderLabel={(asset, center) => (
          <Html
            position={center}
            center
            style={{ pointerEvents: 'none' }}
            zIndexRange={[40, 0]}
            distanceFactor={9}
          >
            <span
              className={`${chipCls} ${
                selectedName === asset.name
                  ? 'border-ai-500/40 text-ai-600'
                  : 'border-slate-200/80 text-slate-600'
              }`}
            >
              {asset.name}
            </span>
          </Html>
        )}
      />
      <Corridor />
      <ParkingSlab />
    </SceneStage>
  )
}