import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { RotateCcw } from 'lucide-react'
import anime from 'animejs'
import { useInView } from '../../../hooks/useInView'
import { cn } from '../../../utils/helpers'

export interface SceneStageProps {
  children: ReactNode
  camera?: { position: [number, number, number]; target: [number, number, number]; fov?: number }
  className?: string
  style?: CSSProperties
  overlay?: (active: boolean) => ReactNode
  onPointerMissed?: () => void
}

function ControlsRegistration({
  target,
  controlsRef,
}: {
  target: [number, number, number]
  controlsRef: RefObject<OrbitControlsImpl | null>
}) {
  const inlineRef = useRef<OrbitControlsImpl>(null)
  useEffect(() => {
    controlsRef.current = inlineRef.current
  }, [controlsRef])
  return (
    <OrbitControls
      ref={inlineRef}
      target={target}
      enableDamping
      dampingFactor={0.12}
      enableZoom
      enablePan
      zoomSpeed={0.8}
      rotateSpeed={0.9}
      minDistance={3.5}
      maxDistance={36}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.52}
    />
  )
}

export function SceneStage({ children, camera, className, style, overlay, onPointerMissed }: SceneStageProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  useEffect(() => {
    if (!inView) return
    const host = ref.current
    const els = host ? Array.from(host.querySelectorAll<HTMLElement>('[data-fade]')) : []
    const showAll = () => {
      els.forEach((el) => {
        el.style.transition = 'none'
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    }
    if (els.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll()
      return
    }
    const t = anime.timeline({ easing: 'easeOutCubic' })
    t.add({
      targets: els,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 460,
      delay: anime.stagger(100),
    })
    return () => t.pause()
  }, [inView, ref])

  const resetView = () => controlsRef.current?.reset()

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} style={style}>
      <Canvas
        frameloop={inView ? 'always' : 'demand'}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={
          camera
            ? { position: camera.position, fov: camera.fov ?? 42, near: 0.1, far: 300 }
            : undefined
        }
        onPointerMissed={onPointerMissed}
        onCreated={({ camera: cam }) => {
          if (camera) cam.lookAt(...camera.target)
        }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[9, 15, 7]} intensity={1.15} />
        <hemisphereLight args={['#ffffff', '#dbeafe', 0.45]} />
        <ControlsRegistration target={camera?.target ?? [0, 0, 0]} controlsRef={controlsRef} />
        {children}
      </Canvas>
      {overlay?.(inView)}

      <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5">
        <span className="pointer-events-none hidden select-none rounded-md border border-slate-200/70 bg-white/90 px-2 py-1 font-mono text-[8px] uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur sm:block">
          Drag to orbit · Scroll to zoom
        </span>
        <button
          type="button"
          onClick={resetView}
          title="Reset view"
          aria-label="Reset view"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-500 opacity-80 shadow-card backdrop-blur transition-all hover:border-primary-400/50 hover:text-primary-600"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  )
}