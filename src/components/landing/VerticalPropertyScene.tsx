import { useState } from 'react'
import { useRef } from 'react'
import * as React from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import type { Group, Mesh, MeshBasicMaterial, Object3D } from 'three'
import { SceneStage } from './three/SceneStage'
import { makeFloorSpecs, type FloorSpec } from './three/Building'
import { Rise, VZ, clamp01, chipCls } from './three/sceneUtils'

const W = 2.2
const D = 2.2
const FLOOR_H = 0.9
const FLOOR_GAP = 0.12
const PITCH = FLOOR_H + FLOOR_GAP
const TOTAL = 8
const DEFAULT_SELECTED = 5
const ULPIN = 'IND-PN-1024-V07-8F3A21'

const FLOOR_COLORS = ['#3b82f6', '#4f46e5', '#0284c7', '#0ea5e9', '#2563eb', '#3b82f6', '#4f46e5', '#0284c7']

const elevationRange = (i: number) => `${(i * 3.2).toFixed(1)} â†’ ${((i + 1) * 3.2).toFixed(1)} m`

const setCursor = (cursor: string) => {
  document.body.style.cursor = cursor
}

function Ground() {
  const mat = useRef<Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mat.current) {
      const m = mat.current.material as MeshBasicMaterial
      m.opacity = clamp01((t - 0.2) / 0.7) * 0.45
    }
  })
  const grid: [number, number, number][][] = []
  for (let i = -4; i <= 4; i++) {
    grid.push([
      [i, 0.004, -4],
      [i, 0.004, 4],
    ])
    grid.push([
      [-4, 0.004, i],
      [4, 0.004, i],
    ])
  }
  const outline: [number, number, number][] = [
    [-1.35, 0.006, -1.35],
    [1.35, 0.006, -1.35],
    [1.35, 0.006, 1.35],
    [-1.35, 0.006, 1.35],
    [-1.35, 0.006, -1.35],
  ]
  return (
    <group>
      <mesh ref={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial color={VZ.ground} transparent opacity={0.001} depthWrite={false} />
      </mesh>
      {/* Ground slab â€” the surface the building rises from and below which basements sit */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[2.9, 0.08, 2.9]} />
        <meshStandardMaterial color={VZ.ground} roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[2.9, 2.9]} />
        <meshStandardMaterial color={VZ.parcel} transparent opacity={0.6} roughness={1} metalness={0} />
      </mesh>
      {grid.map((pts, i) => (
        <Line key={i} points={pts as [number, number, number][]} color={VZ.gridLine} lineWidth={0.75} transparent opacity={0.5} />
      ))}
      <Line points={outline} color={VZ.parcelLine} lineWidth={1.5} dashed dashScale={0.35} gapSize={0.4} />
    </group>
  )
}

function Basements() {
  return (
    <group>
      <Rise delay={0.55} duration={0.8}>
        <mesh position={[0, -0.66, 0]}>
          <boxGeometry args={[2.5, 0.72, 2.5]} />
          <meshStandardMaterial color={VZ.basementDeep} roughness={0.6} metalness={0.1} transparent opacity={0.92} />
        </mesh>
      </Rise>
      <Rise delay={0.72} duration={0.8}>
        <mesh position={[0, -1.72, 0]}>
          <boxGeometry args={[2.05, 0.95, 2.05]} />
          <meshStandardMaterial color="#d97706" roughness={0.6} metalness={0.1} transparent opacity={0.92} />
        </mesh>
      </Rise>
      <Html position={[-1.45, -0.66, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]} distanceFactor={10}>
        <span className={`${chipCls} border-amber-500/40 text-amber-700`}>B1 Â· âˆ’3.2 m</span>
      </Html>
      <Html position={[-1.35, -1.75, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]} distanceFactor={10}>
        <span className={`${chipCls} border-amber-600/40 text-amber-700`}>B2 Â· âˆ’6.4 m</span>
      </Html>
    </group>
  )
}

function Tower({
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  hovered: number | null
  selected: number
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const slabs: FloorSpec[] = makeFloorSpecs({
    w: W,
    d: D,
    count: TOTAL,
    floorHeight: FLOOR_H,
    gap: FLOOR_GAP,
    color: VZ.slab,
    idPrefix: 'F',
  })
  const towerRef = useRef<Group>(null)
  return (
    <group ref={towerRef}>
      {slabs.map((s, i) => {
        const isSelected = i === selected
        const isHovered = i === hovered
        const color = isSelected
          ? VZ.selected
          : isHovered
            ? VZ.selectedLight
            : FLOOR_COLORS[i % FLOOR_COLORS.length]
        return (
          <Rise key={s.id} delay={0.25 + i * 0.07} duration={0.55}>
            <group
              onClick={(e) => {
                e.stopPropagation()
                onSelect(i)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setCursor('pointer')
                onHover(i)
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setCursor('auto')
                onHover(null)
              }}
            >
              <mesh position={[0, s.yBase + s.h / 2, 0]}>
                <boxGeometry args={[s.w, s.h, s.d]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.55}
                  metalness={0.12}
                  emissive={isHovered || isSelected ? '#7c3aed' : '#000000'}
                  emissiveIntensity={isSelected ? 0.22 : isHovered ? 0.4 : 0}
                />
              </mesh>
              <Html
                position={[-(W / 2 + 1.05), s.yBase + s.h / 2, 0]}
                center
                occlude={[towerRef as React.RefObject<Object3D>]}
                style={{ pointerEvents: 'none' }}
                zIndexRange={[30, 0]}
                distanceFactor={10}
              >
                <span
                  className={`${chipCls} ${
                    isSelected || isHovered ? 'border-ai-500/40 text-ai-600' : 'text-slate-500'
                  }`}
                >
                  F{String(i + 1).padStart(2, '0')} Â· +{((i + 1) * 3.2).toFixed(1)} m
                </span>
              </Html>
            </group>
          </Rise>
        )
      })}
      <Rise delay={0.25 + TOTAL * 0.07} duration={0.5}>
        <mesh position={[0, TOTAL * PITCH + 0.06, 0]}>
          <boxGeometry args={[W + 0.06, 0.12, D + 0.06]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.2} />
        </mesh>
      </Rise>
      <Html
        position={[W / 2 + 1.3, selected * PITCH + FLOOR_H / 2, 0]}
        center
        occlude={[towerRef as React.RefObject<Object3D>]}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[40, 0]}
        distanceFactor={10}
      >
        <div className="min-w-[170px] border-ai-500/40 bg-white/95 px-2.5 py-1.5">
          <p className="font-bold uppercase tracking-wider text-ai-600" style={{ fontSize: 8 }}>
            Selected 3D volume
          </p>
          <p className="text-slate-700" style={{ fontSize: 9 }}>
            F{String(selected + 1).padStart(2, '0')} Â· Elevation {elevationRange(selected)}
          </p>
          <p className="text-primary-600" style={{ fontSize: 9 }}>
            3D ULPIN Â· {ULPIN} Â· prototype
          </p>
        </div>
      </Html>
    </group>
  )
}

export function VerticalPropertyScene() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number>(DEFAULT_SELECTED)

  return (
    <SceneStage
      className="mx-auto h-[430px] w-full max-w-[440px] sm:h-[500px]"
      camera={{ position: [12.5, 8.5, 17.5], target: [0, 0.6, 0], fov: 40 }}
      overlay={() => (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          <div className="absolute right-1 top-2 bottom-12 flex flex-col justify-around text-right">
            {['+8m', '+6m', '+4m', '+2m', '0m', 'âˆ’2m'].map((label) => (
              <span
                key={label}
                data-fade
                style={{ opacity: 0 }}
                className="font-mono text-[9px] leading-none text-slate-400"
              >
                {label}
              </span>
            ))}
          </div>
          <span data-fade style={{ opacity: 0 }} className="absolute bottom-2 left-3">
            <span className={chipCls}>Ground Â· MSL +12.5 m</span>
          </span>
          <span
            data-fade
            style={{ opacity: 0 }}
            className={`absolute bottom-2 right-3 ${chipCls} border-amber-500/40 text-amber-700`}
          >
            B1 Â· B2 below footprint
          </span>
        </div>
      )}
      onPointerMissed={() => setSelected(DEFAULT_SELECTED)}
    >
      <Ground />
      <Tower hovered={hovered} selected={selected} onHover={setHovered} onSelect={setSelected} />
      <Basements />
    </SceneStage>
  )
}
