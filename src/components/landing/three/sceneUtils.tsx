import { type ReactNode, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

export const VZ = {
  ground: '#eef2f7',
  gridLine: '#dde5f0',
  parcel: '#dbeafe',
  parcelLine: '#93c5fd',
  road: '#d6dde8',
  slab: '#dbe7fb',
  unit: '#3b82f6',
  unitLight: '#60a5fa',
  unitIndigo: '#6366f1',
  sky: '#0ea5e9',
  valid: '#14b8a6',
  selected: '#7c3aed',
  selectedLight: '#a78bfa',
  water: '#38bdf8',
  sewer: '#a855f7',
  power: '#c084fc',
  telecom: '#f59e0b',
  basement: '#fca5a5',
  basementDeep: '#f59e0b',
} as const

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3)

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function useTween(duration: number) {
  const t0 = useRef<number | null>(null)
  const value = useRef(0)
  useFrame((state) => {
    if (prefersReduced) {
      value.current = 1
      return
    }
    if (t0.current === null) t0.current = state.clock.elapsedTime
    value.current = clamp01((state.clock.elapsedTime - t0.current) / duration)
  })
  return value
}

export function useTweenAt(delay: number, duration: number) {
  const t0 = useRef<number | null>(null)
  const value = useRef(0)
  useFrame((state) => {
    if (prefersReduced) {
      value.current = 1
      return
    }
    if (t0.current === null) t0.current = state.clock.elapsedTime
    value.current = clamp01((state.clock.elapsedTime - t0.current - delay) / duration)
  })
  return value
}

export function Rise({
  delay = 0,
  duration = 0.8,
  direction = 'up',
  children,
}: {
  delay?: number
  duration?: number
  direction?: 'up' | 'down'
  children: ReactNode
}) {
  const g = useRef<Group>(null)
  const tw = useTweenAt(delay, duration)
  useFrame(() => {
    if (g.current) {
      const k = Math.max(0.0001, easeOutCubic(tw.current))
      g.current.scale.y = k
      g.current.scale.x = direction === 'down' ? 1 : 1
      g.current.scale.z = 1
    }
  })
  return <group ref={g}>{children}</group>
}

export const UG_OFFSET: readonly [number, number] = [7.2, 4.5]

export const chipCls =
  'pointer-events-none select-none rounded-md border border-slate-200/80 bg-white/95 px-2 py-1 font-mono text-[9px] font-semibold leading-tight text-slate-600 shadow-sm backdrop-blur'