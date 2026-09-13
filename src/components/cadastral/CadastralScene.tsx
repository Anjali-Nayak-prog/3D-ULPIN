import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import * as React from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Group, Object3D, Spherical, Vector3 } from 'three'
import type { MapBuilding, MapLayer, MeasureTool, UndergroundAsset, UndergroundMode } from '../../types/map'
import { SELECTED_PROPERTY_ULPIN } from '../../data/mapData'
import { PipeJunctions, PipeRoute } from './PipeRoute'
import { cn } from '../../utils/helpers'

export type CadastralSceneMode = 'overview' | 'interactive'

export interface CadastralSceneHandle {
  home: () => void
  zoomIn: () => void
  zoomOut: () => void
  rotate: () => void
  reset: () => void
}

interface CadastralSceneProps {
  mode: CadastralSceneMode
  buildings: MapBuilding[]
  underground?: UndergroundAsset[]
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  undergroundMode?: UndergroundMode
  selectedFloor?: number | null
  layers?: MapLayer[]
  measureTool?: MeasureTool
  onAssetSelect?: (asset: UndergroundAsset | null) => void
  className?: string
  style?: CSSProperties
}

const DEFAULT_VIEW = {
  position: [16, 14.5, 20] as [number, number, number],
  target: [6.4, 3.5, 4.9] as [number, number, number],
  fov: 40,
}

const FLOOR_H = 0.55
const FLOOR_GAP = 0.06
const FLOOR_PITCH = FLOOR_H + FLOOR_GAP
const UG_V_SCALE = 0.22
const MIN_DIST = 5
const MAX_DIST = 56

const statusPastel: Record<string, string> = {
  verified: '#a7f3d0',
  pending: '#fde68a',
  conflict: '#fecaca',
  new: '#bae6fd',
}

const UG_KIND_COLORS: Record<UndergroundAsset['kind'], string> = {
  water: '#38bdf8',
  sewer: '#a855f7',
  power: '#f59e0b',
  metro: '#f87171',
  parking: '#34d399',
  telecom: '#818cf8',
}

const SELECTED_COLOR = '#7c3aed'

const chipCls =
  'pointer-events-none select-none rounded-md border border-slate-200 bg-white/95 px-2 py-1 font-mono text-[9px] font-semibold leading-tight text-slate-600 shadow-sm backdrop-blur'

const layerVisible = (layers: MapLayer[] | undefined, type: MapLayer['type']) =>
  (layers ?? []).find((l) => l.type === type)?.visible ?? true

const layerOpacity = (layers: MapLayer[] | undefined, type: MapLayer['type']) =>
  (layers ?? []).find((l) => l.type === type)?.opacity ?? 1

function CadastralBuilding({
  building,
  highlightFloor,
  selected,
  onActivate,
}: {
  building: MapBuilding
  highlightFloor: number | null
  selected: boolean
  onActivate: (building: MapBuilding) => void
}) {
  const { gridX, gridZ, width, depth } = building
  const cx = gridX + width / 2
  const cz = gridZ + depth / 2
  const color = statusPastel[building.status] ?? statusPastel.verified
  const groupRef = useRef<Group>(null)

  const floorCenterY = (i: number) => {
    const lift = highlightFloor === i ? 0.22 : 0
    return i * FLOOR_PITCH + FLOOR_H / 2 + lift
  }

  const roofTop = building.floors * FLOOR_PITCH + 0.02 + (FLOOR_H * 0.14) / 2

  return (
    <group ref={groupRef}>
      {/* Ground plinth — anchors the volume to its parcel footprint */}
      <mesh position={[cx, 0.045, cz]}>
        <boxGeometry args={[width + 0.22, 0.09, depth + 0.22]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.92} metalness={0.02} />
      </mesh>

      {Array.from({ length: building.floors }, (_, i) => {
        const isHighlighted = highlightFloor === i
        return (
          <group key={i}>
            <mesh
              position={[cx, floorCenterY(i), cz]}
              onClick={(e) => {
                e.stopPropagation()
                onActivate(building)
              }}
            >
              <boxGeometry args={[width, FLOOR_H - 0.02, depth]} />
              <meshStandardMaterial
                color={isHighlighted ? SELECTED_COLOR : color}
                roughness={0.85}
                metalness={0.04}
              />
            </mesh>
            <FacadeWindows
              building={building}
              levelCenterY={floorCenterY(i)}
              tinted={isHighlighted}
            />
          </group>
        )
      })}

      {/* Roof slab */}
      <mesh position={[cx, building.floors * FLOOR_PITCH + 0.02, cz]}>
        <boxGeometry args={[width + 0.08, FLOOR_H * 0.14, depth + 0.08]} />
        <meshStandardMaterial color={stageRoofColor(building, selected)} roughness={0.6} metalness={0.08} />
      </mesh>

      {/* Parapet ring + rooftop plant (AHU) */}
      <RoofStructure building={building} roofTop={roofTop} />

      {selected && (
        <Html
          position={[cx, building.floors * FLOOR_PITCH + 1.2, cz]}
          center
          occlude={[groupRef as React.RefObject<Object3D>]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[20, 0]}
          distanceFactor={22}
        >
          <div className="min-w-[140px] rounded-md border border-slate-200 bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{building.name}</p>
            <p className="mt-0.5 font-mono text-[8px] text-primary-600">{building.ulpin}</p>
            <p className="mt-0.5 text-[8px] text-slate-500">{building.floors} floors · {building.height.toFixed(0)} m</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function FacadeWindows({
  building,
  levelCenterY,
  tinted,
}: {
  building: MapBuilding
  levelCenterY: number
  tinted: boolean
}) {
  const { width, depth } = building
  const cx = building.gridX + width / 2
  const cz = building.gridZ + depth / 2
  const longFace = width >= depth
  const faceLen = longFace ? width : depth
  const winW = 0.15
  const winH = FLOOR_H * 0.4
  const wing = 0.016
  const y = levelCenterY + (tinted ? 0.22 : 0)
  const count = Math.min(3, Math.max(2, Math.floor(faceLen / 0.55)))
  const mat = (
    <meshStandardMaterial
      color={tinted ? '#ede9fe' : '#ffffff'}
      roughness={0.35}
      metalness={0.05}
    />
  )
  const els: ReactNode[] = []
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1)
    const off = faceLen * t - faceLen / 2
    if (longFace) {
      const x = cx + off
      els.push(
        <mesh key={`f1-${i}`} position={[x, y, cz + depth / 2 + wing]}>
          <boxGeometry args={[winW, winH, 0.02]} />
          {mat}
        </mesh>,
        <mesh key={`f2-${i}`} position={[x, y, cz - depth / 2 - wing]}>
          <boxGeometry args={[winW, winH, 0.02]} />
          {mat}
        </mesh>,
      )
    } else {
      const z = cz + off
      els.push(
        <mesh key={`f1-${i}`} position={[cx + width / 2 + wing, y, z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[winW, winH, 0.02]} />
          {mat}
        </mesh>,
        <mesh key={`f2-${i}`} position={[cx - width / 2 - wing, y, z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[winW, winH, 0.02]} />
          {mat}
        </mesh>,
      )
    }
  }
  return <>{els}</>
}

function RoofStructure({
  building,
  roofTop,
}: {
  building: MapBuilding
  roofTop: number
}) {
  const cx = building.gridX + building.width / 2
  const cz = building.gridZ + building.depth / 2
  const w = building.width
  const d = building.depth
  const pw = 0.05
  const wallY = roofTop + 0.08
  const wallH = 0.16
  const parapet = (
    <meshStandardMaterial color="#e2e8f0" roughness={0.75} metalness={0.05} />
  )
  return (
    <group>
      <mesh position={[cx - w / 2 - pw / 2, wallY, cz]}>
        <boxGeometry args={[pw, wallH, d + pw * 2]} />
        {parapet}
      </mesh>
      <mesh position={[cx + w / 2 + pw / 2, wallY, cz]}>
        <boxGeometry args={[pw, wallH, d + pw * 2]} />
        {parapet}
      </mesh>
      <mesh position={[cx, wallY, cz - d / 2 - pw / 2]}>
        <boxGeometry args={[w + pw * 2, wallH, pw]} />
        {parapet}
      </mesh>
      <mesh position={[cx, wallY, cz + d / 2 + pw / 2]}>
        <boxGeometry args={[w + pw * 2, wallH, pw]} />
        {parapet}
      </mesh>
      <mesh position={[cx - w * 0.22, wallY + wallH / 2 + 0.09, cz]}>
        <boxGeometry args={[w * 0.3, 0.2, d * 0.34]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.08} />
      </mesh>
    </group>
  )
}

function stageRoofColor(building: MapBuilding, selected: boolean) {
  if (building.status === 'conflict') return '#f87171'
  if (building.status === 'pending') return '#fbbf24'
  if (selected) return SELECTED_COLOR
  return '#f1f5f9'
}

function ParcelBoundary({
  x,
  z,
  w,
  d,
  opacity = 0.55,
}: {
  x: number
  z: number
  w: number
  d: number
  opacity?: number
}) {
  const pad = 0.24
  const pts: [number, number, number][] = [
    [x - pad, 0.03, z - pad],
    [x + w + pad, 0.03, z - pad],
    [x + w + pad, 0.03, z + d + pad],
    [x - pad, 0.03, z + d + pad],
    [x - pad, 0.03, z - pad],
  ]
  return (
    <Line
      points={pts}
      color="#64748b"
      lineWidth={1.2}
      transparent
      opacity={opacity}
      dashed
      dashScale={0.6}
      gapSize={0.35}
    />
  )
}

function UndergroundLayer({
  assets,
  undergroundMode,
  layers,
  onAssetSelect,
  showNameChips = false,
}: {
  assets: UndergroundAsset[]
  undergroundMode: UndergroundMode
  layers?: MapLayer[]
  onAssetSelect?: (asset: UndergroundAsset | null) => void
  showNameChips?: boolean
}) {
  if (undergroundMode === 'surface') return null
  if (assets.length === 0) return null

  const includeKind = (asset: UndergroundAsset): boolean => {
    if (layerVisible(layers, 'underground')) return true
    if (asset.kind === 'water') return layerVisible(layers, 'water')
    if (asset.kind === 'sewer') return layerVisible(layers, 'sewer')
    if (asset.kind === 'power') return layerVisible(layers, 'electricity')
    return false
  }

  const filtered = assets.filter(includeKind)
  if (filtered.length === 0) return null

  const radiusFor = (kind: UndergroundAsset['kind']) =>
    kind === 'sewer' ? 0.14 : kind === 'water' ? 0.11 : kind === 'power' ? 0.08 : 0.07

  return (
    <group>
      {filtered.map((asset) => {
        const depth = -asset.depth * UG_V_SCALE
        const color = UG_KIND_COLORS[asset.kind]

        if (asset.kind === 'parking') {
          const cx = asset.path.reduce((s, p) => s + p.x, 0) / asset.path.length
          const cz = asset.path.reduce((s, p) => s + p.z, 0) / asset.path.length
          return (
            <group key={asset.id}>
              <mesh
                position={[cx, depth - 0.1, cz]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation()
                  onAssetSelect?.(asset)
                }}
              >
                <circleGeometry args={[0.9, 24]} />
                <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
              </mesh>
              <Line
                points={[
                  ...asset.path.map((p) => [p.x, depth, p.z] as [number, number, number]),
                  [asset.path[0].x, depth, asset.path[0].z],
                ]}
                color={color}
                lineWidth={1.6}
                transparent
                opacity={0.9}
              />
              <Html
                position={[cx, depth - 0.9, cz]}
                center
                style={{ pointerEvents: 'none' }}
                zIndexRange={[20, 0]}
                distanceFactor={16}
              >
                <span className={chipCls}>Basement parking · −{asset.depth} m</span>
              </Html>
            </group>
          )
        }

        const pts = asset.path.map((p) => [p.x, depth, p.z] as [number, number, number])
        return (
          <group key={asset.id}>
            <PipeRoute
              points={pts}
              color={color}
              radius={radiusFor(asset.kind)}
              opacity={0.9}
              onSelect={() => onAssetSelect?.(asset)}
            />
            <PipeJunctions points={pts} radius={radiusFor(asset.kind)} color={color} />
            {showNameChips && (
              <Html
                position={[pts[Math.floor(pts.length / 2)][0], depth + 0.22, pts[Math.floor(pts.length / 2)][2]]}
                center
                style={{ pointerEvents: 'none' }}
                zIndexRange={[25, 0]}
                distanceFactor={14}
              >
                <span className={chipCls} style={{ color, borderColor: `${color}55` }}>
                  {asset.name}
                </span>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

function GroundPlane({ showUnderground }: { showUnderground: boolean }) {
  const roadStrips: { position: [number, number, number]; size: [number, number, number] }[] = [
    { position: [6.4, 0.02, 2.9], size: [13.6, 0.04, 0.5] },
    { position: [9.0, 0.02, 4.5], size: [0.5, 0.04, 9.2] },
    { position: [6.2, 0.02, 7.5], size: [4.35, 0.04, 0.5] },
  ]
  const gridLines: [number, number, number][][] = []
  for (let i = -1; i <= 14; i += 2) {
    gridLines.push([
      [i, 0.005, -0.5],
      [i, 0.005, 9.6],
    ])
    gridLines.push([
      [-0.6, 0.005, i],
      [13.6, 0.005, i],
    ])
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.4, 0, 4.5]}>
        <planeGeometry args={[19, 14]} />
        <meshStandardMaterial
          color="#e9eef6"
          roughness={1}
          metalness={0}
          transparent
          opacity={showUnderground ? 0.35 : 1}
        />
      </mesh>
      {gridLines.map((pts, idx) => (
        <Line key={idx} points={pts} color="#d7e0ee" lineWidth={0.8} transparent opacity={0.6} />
      ))}
      {roadStrips.map((r, i) => (
        <mesh key={i} position={r.position}>
          <boxGeometry args={r.size} />
          <meshStandardMaterial color="#cbd5e1" roughness={1} metalness={0} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  )
}

function SelectedFloorTag({ building, highlightFloor }: { building: MapBuilding; highlightFloor: number }) {
  const cx = building.gridX + building.width / 2
  const cz = building.gridZ + building.depth / 2
  const y = (highlightFloor + 1) * FLOOR_PITCH + 0.35
  const floorNo = highlightFloor + 1

  return (
    <Html position={[cx, y, cz]} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]} distanceFactor={20}>
      <div className="min-w-[160px] rounded-md border border-violet-500/40 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur">
        <p className="text-[9px] font-bold uppercase tracking-wider text-violet-600">Selected 3D volume</p>
        <p className="mt-0.5 text-slate-700">
          Floor {String(floorNo).padStart(2, '0')} <span className="text-slate-400">·</span> Elevation
          +{(highlightFloor * 3.2).toFixed(1)} → +{(highlightFloor + 1) * 3.2} m
        </p>
      </div>
    </Html>
  )
}

function SceneContent({
  buildings,
  underground,
  selectedId,
  onActivate,
  undergroundMode,
  selectedFloor,
  layers,
  mode,
  onAssetSelect,
}: {
  buildings: MapBuilding[]
  underground: UndergroundAsset[]
  selectedId: string | null
  onActivate: (building: MapBuilding) => void
  undergroundMode: UndergroundMode
  selectedFloor: number | null
  layers?: MapLayer[]
  mode: CadastralSceneMode
  onAssetSelect?: (asset: UndergroundAsset | null) => void
}) {
  const showUnderground = undergroundMode !== 'surface'
  const subsurfaceOnly = mode === 'interactive' && undergroundMode === 'underground'
  const buildingsVisible = layerVisible(layers, 'buildings')
  const parcelOpacity = subsurfaceOnly ? 0.5 : 1
  const parcelsVisible = layerVisible(layers, 'parcels')
  const parcelsOpacity = layerOpacity(layers, 'parcels') * parcelOpacity

  return (
    <group>
      <GroundPlane showUnderground={showUnderground} />

      {buildings.map((building) => {
        const selected = building.id === selectedId
        const floorIndex =
          selected && selectedFloor !== null && selectedFloor >= 0 && selectedFloor < building.floors
            ? selectedFloor
            : null
        const highlightFloor =
          selected && floorIndex === null && building.ulpin === SELECTED_PROPERTY_ULPIN && selectedFloor === null
            ? 6
            : floorIndex
        return (
          <group key={building.id}>
            {parcelsVisible && (
              <ParcelBoundary x={building.gridX} z={building.gridZ} w={building.width} d={building.depth} opacity={parcelsOpacity} />
            )}
            <group visible={buildingsVisible && !subsurfaceOnly}>
              <CadastralBuilding
                building={building}
                highlightFloor={highlightFloor}
                selected={selected}
                onActivate={onActivate}
              />
            </group>
            {highlightFloor !== null && <SelectedFloorTag building={building} highlightFloor={highlightFloor} />}
          </group>
        )
      })}

      <UndergroundLayer
        assets={underground}
        undergroundMode={undergroundMode}
        layers={layers}
        onAssetSelect={onAssetSelect}
        showNameChips={mode === 'interactive'}
      />
    </group>
  )
}

const SceneController = forwardRef<CadastralSceneHandle, { mode: CadastralSceneMode }>(function SceneController(
  { mode },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const camera = useThree((s) => s.camera)

  useImperativeHandle(ref, () => ({
    home: () => controlsRef.current?.reset(),
    zoomIn: () => {
      const controls = controlsRef.current
      if (!controls) return
      const target = controls.target
      const dir = new Vector3().subVectors(camera.position, target)
      const next = Math.max(dir.length() * 0.8, MIN_DIST)
      camera.position.copy(target).add(dir.setLength(next))
      camera.lookAt(target)
      controls.update()
    },
    zoomOut: () => {
      const controls = controlsRef.current
      if (!controls) return
      const target = controls.target
      const dir = new Vector3().subVectors(camera.position, target)
      const next = Math.min(dir.length() * 1.25, MAX_DIST)
      camera.position.copy(target).add(dir.setLength(next))
      camera.lookAt(target)
      controls.update()
    },
    rotate: () => {
      const controls = controlsRef.current
      if (!controls) return
      const target = controls.target
      const sph = new Spherical().setFromVector3(new Vector3().subVectors(camera.position, target))
      sph.theta += Math.PI / 12
      camera.position.copy(target).add(new Vector3().setFromSpherical(sph))
      camera.lookAt(target)
      controls.update()
    },
    reset: () => controlsRef.current?.reset(),
  }))

  return (
    <OrbitControls
      ref={controlsRef}
      target={DEFAULT_VIEW.target}
      enableZoom
      enableDamping
      dampingFactor={0.12}
      enableRotate
      enablePan={mode === 'interactive'}
      minDistance={MIN_DIST}
      maxDistance={MAX_DIST}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2 - 0.02}
    />
  )
})

export const CadastralScene = forwardRef<CadastralSceneHandle, CadastralSceneProps>(
  function CadastralScene(
    {
      mode,
      buildings,
      underground = [],
      selectedId = null,
      onSelect,
      undergroundMode = 'surface',
      selectedFloor = null,
      layers,
      measureTool = null,
      onAssetSelect,
      className,
      style,
    },
    ref,
  ) {
    const [measureLabel, setMeasureLabel] = useState<string | null>(null)

    const handleActivate = useCallback(
      (building: MapBuilding) => {
        if (mode === 'interactive' && measureTool) {
          const label =
            measureTool === 'height'
              ? `${building.name}: ${building.height.toFixed(1)} m`
              : measureTool === 'area'
                ? `${building.name}: ${building.landArea.toLocaleString('en-IN')} m²`
                : `${building.name}: ~${(building.width * 4.5).toFixed(1)} m`
          setMeasureLabel(label)
        }
        onSelect?.(selectedId === building.id ? null : building.id)
      },
      [mode, measureTool, selectedId, onSelect],
    )

    return (
      <div className={cn('relative overflow-hidden', className)} style={style}>
        <Canvas
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: DEFAULT_VIEW.position, fov: DEFAULT_VIEW.fov, near: 0.1, far: 400 }}
          onCreated={({ camera: cam }) => {
            cam.lookAt(...DEFAULT_VIEW.target)
            cam.updateProjectionMatrix()
          }}
          onPointerMissed={() => {
            if (mode === 'interactive') {
              onSelect?.(null)
              onAssetSelect?.(null)
            }
          }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[10, 18, 8]} intensity={1.25} />
          <hemisphereLight args={['#ffffff', '#dbeafe', 0.5]} />
          <SceneContent
            buildings={buildings}
            underground={underground}
            selectedId={selectedId}
            onActivate={handleActivate}
            undergroundMode={undergroundMode}
            selectedFloor={selectedFloor}
            layers={layers}
            mode={mode}
            onAssetSelect={onAssetSelect}
          />
          <SceneController ref={ref} mode={mode} />
        </Canvas>

        {measureLabel && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
            <span className="rounded-lg border border-primary-400/40 bg-navy-900/90 px-3 py-1.5 font-mono text-[11px] text-primary-600 shadow-glow-sm backdrop-blur-sm">
              {measureLabel}
            </span>
          </div>
        )}
      </div>
    )
  },
)