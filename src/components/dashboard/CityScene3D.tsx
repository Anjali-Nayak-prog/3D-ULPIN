import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref,
} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import type { MapBuilding } from '../../types/map'
import { STATUS_COLORS } from '../../utils/constants'

export interface CitySceneHandle {
  reset: () => void
  zoomIn: () => void
  zoomOut: () => void
  syncState?: () => void
}

interface CityScene3DProps {
  buildings: MapBuilding[]
  selectedId: string | null
  showLabels: boolean
  measureMode: boolean
  onSelect: (id: string | null) => void
  onMeasure: (building: MapBuilding) => void
  ref?: Ref<CitySceneHandle>
}

const COLS = 13
const ROWS = 11
const HALF_X = COLS / 2
const HALF_Z = ROWS / 2
const Y_SCALE = 0.012
const HEIGHT_LABEL_MIN_WIDTH = 0.95
const HOME_POS = new THREE.Vector3(8.5, 10.5, 14.5)

const STATUS_HEX: Record<string, string> = {
  verified: STATUS_COLORS.verified.hex,
  pending: STATUS_COLORS.pending.hex,
  conflict: STATUS_COLORS.conflict.hex,
  new: STATUS_COLORS.new.hex,
}

export function CityScene3D({
  buildings,
  selectedId,
  showLabels,
  measureMode,
  onSelect,
  onMeasure,
  ref,
}: CityScene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const syncRef = useRef<(() => void) | null>(null)
  const liveRef = useRef({ selectedId, showLabels, measureMode, onSelect, onMeasure })

  useEffect(() => {
    liveRef.current = { selectedId, showLabels, measureMode, onSelect, onMeasure }
  }, [selectedId, showLabels, measureMode, onSelect, onMeasure])

  const handle = useMemo<CitySceneHandle>(() => {
    const resetCamera = () => {
      const camera = cameraRef.current
      const controls = controlsRef.current
      if (!camera || !controls) return
      camera.position.copy(HOME_POS)
      controls.target.set(0, 0.6, 0)
      controls.update()
    }
    return {
      reset: resetCamera,
      zoomIn: () => {
        const controls = controlsRef.current
        if (!controls) return
        controls.dollyIn(1.35)
        controls.update()
      },
      zoomOut: () => {
        const controls = controlsRef.current
        if (!controls) return
        controls.dollyOut(1.35)
        controls.update()
      },
      syncState: () => syncRef.current?.(),
    }
  }, [])
  useImperativeHandle(ref, () => handle, [handle])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      const el = document.createElement('div')
      el.textContent = 'WebGL is not supported in this browser.'
      el.className =
        'flex h-full w-full items-center justify-center text-sm text-slate-500'
      mount.appendChild(el)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.touchAction = 'none'
    mount.appendChild(renderer.domElement)

    const labelLayer = new CSS2DRenderer()
    labelLayer.domElement.style.position = 'absolute'
    labelLayer.domElement.style.inset = '0'
    labelLayer.domElement.style.overflow = 'hidden'
    labelLayer.domElement.style.pointerEvents = 'none'
    mount.appendChild(labelLayer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060b14, 0.02)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200)
    cameraRef.current = camera

    // ---- Ground ----
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(44, 36),
      new THREE.MeshBasicMaterial({ color: 0x0b1424, transparent: true, opacity: 0.92 }),
    )
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    const grid = new THREE.GridHelper(36, 36, 0x1e3a5f, 0x16233c)
    grid.position.y = 0.01
    scene.add(grid)

    const boundary = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-HALF_X, 0.02, -HALF_Z),
        new THREE.Vector3(HALF_X, 0.02, -HALF_Z),
        new THREE.Vector3(HALF_X, 0.02, HALF_Z),
        new THREE.Vector3(-HALF_X, 0.02, HALF_Z),
      ]),
      new THREE.LineBasicMaterial({ color: 0x2e5f8a, transparent: true, opacity: 0.55 }),
    )
    scene.add(boundary)

    // ---- Underground utilities (below ground plane) ----
    const UTILS = [
      { color: 0x06b6d4, y: -0.75 },
      { color: 0xa855f7, y: -1.05 },
      { color: 0xf59e0b, y: -1.35 },
    ]
    UTILS.forEach((u) => {
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 30, 8),
        new THREE.MeshBasicMaterial({
          color: u.color,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
        }),
      )
      tube.rotation.z = Math.PI / 2
      tube.position.set(0, u.y, 0)
      scene.add(tube)

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshBasicMaterial({
          color: u.color,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
        }),
      )
      node.position.set(0, u.y, 0)
      scene.add(node)
    })

    // ---- Buildings ----
    interface Built {
      mesh: THREE.Mesh
      edge: THREE.LineSegments
      edgeMat: THREE.LineBasicMaterial
      label: CSS2DObject | null
    }
    const allBuilt: Built[] = []

    const makeLabelElement = (className: string, text?: string): HTMLDivElement => {
      const div = document.createElement('div')
      div.style.pointerEvents = 'none'
      div.style.fontFamily =
        "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      div.style.whiteSpace = 'nowrap'
      div.className = className
      if (text !== undefined) div.textContent = text
      return div
    }

    buildings.forEach((b) => {
      const h = b.height * Y_SCALE
      const geo = new THREE.BoxGeometry(b.width, Math.max(h, 0.05), b.depth)
      geo.translate(0, Math.max(h, 0.05) / 2, 0)

      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(STATUS_HEX[b.status] ?? 0x60a5fa),
        emissive: new THREE.Color(0x000000),
        transparent: true,
        opacity: 1,
        shininess: 24,
      })
      const mesh = new THREE.Mesh(geo, material)
      mesh.position.set(
        b.gridX + b.width / 2 - HALF_X,
        0,
        b.gridZ + b.depth / 2 - HALF_Z,
      )
      mesh.userData.buildingId = b.id
      scene.add(mesh)

      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(0xbfdbfe),
        transparent: true,
        opacity: 0.28,
      })
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat)
      edge.position.copy(mesh.position)
      scene.add(edge)

      let label: CSS2DObject | null = null
      if (b.width >= HEIGHT_LABEL_MIN_WIDTH && b.depth >= 0.6) {
        const el = makeLabelElement(
          'rounded-md border border-white/[0.06] bg-navy-900/80 px-1.5 py-0.5 text-center text-[9px] leading-none text-slate-300',
          String(b.height.toFixed(0)),
        )
        label = new CSS2DObject(el)
        label.position.set(mesh.position.x, h + 0.35, mesh.position.z)
        scene.add(label)
      }

      allBuilt.push({ mesh, edge, edgeMat, label })
    })

    // ---- Lights ----
    scene.add(new THREE.AmbientLight(0x8899cc, 0.8))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
    keyLight.position.set(8, 18, 10)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.7)
    rimLight.position.set(-10, 6, -12)
    scene.add(rimLight)

    // ---- Controls ----
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.target.set(0, 0.6, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 6
    controls.maxDistance = 32
    controls.maxPolarAngle = Math.PI / 2 - 0.06
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.autoRotateSpeed = 0.9
    camera.position.copy(HOME_POS)
    controls.update()

    // ---- Resize ----
    const resize = () => {
      const w = mount.clientWidth || 1
      const hgt = mount.clientHeight || 1
      camera.aspect = w / hgt
      camera.updateProjectionMatrix()
      renderer.setSize(w, hgt, false)
      labelLayer.setSize(w, hgt)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // ---- Interaction ----
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    const meshes = allBuilt.map((b) => b.mesh)

    const syncPointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointerNdc.y = -(((clientY - rect.top) / rect.height) * 2 - 1)
    }
    const findHit = () => {
      raycaster.setFromCamera(pointerNdc, camera)
      const hits = raycaster.intersectObjects(meshes, false)
      return hits.length ? (hits[0].object as THREE.Mesh) : null
    }

    const onPointerMove = (e: PointerEvent) => {
      syncPointer(e.clientX, e.clientY)
      const hit = findHit()
      renderer.domElement.style.cursor = liveRef.current.measureMode
        ? 'crosshair'
        : hit
          ? 'pointer'
          : 'default'
    }
    const onClick = (e: PointerEvent) => {
      syncPointer(e.clientX, e.clientY)
      const hit = findHit()
      if (hit) {
        const b = buildings.find((x) => x.id === hit.userData.buildingId)
        if (b) {
          liveRef.current.onSelect(b.id)
          if (liveRef.current.measureMode) liveRef.current.onMeasure(b)
          return
        }
      }
      liveRef.current.onSelect(null)
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('click', onClick)

    // ---- Selection / label sync ----
    let selectLabel: CSS2DObject | null = null
    const applyState = () => {
      const state = liveRef.current
      for (const built of allBuilt) {
        const isSel = built.mesh.userData.buildingId === state.selectedId
        const mat = built.mesh.material as THREE.MeshPhongMaterial
        mat.opacity = state.selectedId && !isSel ? 0.32 : 1
        mat.emissive.setHex(isSel ? 0x1d4ed8 : 0x000000)
        built.edgeMat.opacity = !state.selectedId ? 0.28 : isSel ? 0.9 : 0.12
        if (built.label) built.label.visible = !!state.showLabels && !isSel
      }

      const sel = state.selectedId
      const selected = sel ? buildings.find((x) => x.id === sel) : undefined
      if (selected) {
        const built = allBuilt.find(
          (x) => x.mesh.userData.buildingId === selected.id,
        )
        if (built) {
          if (!selectLabel) {
            const el = makeLabelElement(
              'rounded-lg border border-primary-300/50 bg-navy-900/90 px-2.5 py-1 shadow-glow-sm backdrop-blur-sm',
            )
            selectLabel = new CSS2DObject(el)
            scene.add(selectLabel)
          }
          const el = selectLabel.element as HTMLDivElement
          el.textContent = `${selected.name} — ${selected.height} m`
          el.style.fontSize = '11px'
          el.style.color = '#e0f2fe'
          selectLabel.position.set(
            built.mesh.position.x,
            selected.height * Y_SCALE + 1.15,
            built.mesh.position.z,
          )
          selectLabel.visible = true
        }
      } else if (selectLabel) {
        selectLabel.visible = false
      }
    }

    applyState()

    // ---- Render loop ----
    const clock = new THREE.Clock()
    let raf = 0
    let disposed = false
    const animate = () => {
      if (disposed) return
      clock.getDelta()
      controls.update()
      renderer.render(scene, camera)
      labelLayer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // ---- Handle API ----
    syncRef.current = applyState

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material as
          | THREE.Material
          | THREE.Material[]
          | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) mat.dispose()
      })
      labelLayer.domElement.remove()
      renderer.domElement.remove()
      renderer.dispose()
      cameraRef.current = null
      controlsRef.current = null
      syncRef.current = null
    }
    // Mount once; live props are read through liveRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Push latest selection / label visibility into the scene
  useEffect(() => {
    handle.syncState?.()
  }, [selectedId, showLabels, handle])

  return (
    <div
      ref={mountRef}
      className="relative h-[520px] w-full"
      role="img"
      aria-label="3D city overview of the cadastral corpus"
    />
  )
}