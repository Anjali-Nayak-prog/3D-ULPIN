import type { LucideIcon } from 'lucide-react'

export interface StatCardData {
  id: string
  title: string
  value: string
  rawValue: number
  change: number
  icon: 'map' | 'box' | 'building' | 'door' | 'drill' | 'alert'
  color: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red'
}

export interface Activity {
  id: string
  type:
    | 'ulpin'
    | 'upload'
    | 'conflict'
    | 'update'
    | 'floorplan'
    | 'drone'
    | 'ai'
    | 'validation'
  time: string
  title: string
  description: string
}

export interface Alert {
  id: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  title: string
  description: string
  time: string
}

export interface StatusSummary {
  verified: number
  verifiedPercent: number
  pending: number
  pendingPercent: number
  conflict: number
  conflictPercent: number
  new: number
  newPercent: number
}

export interface SystemService {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'down'
  latency: number
  uptime: number
}

export type IconName = LucideIcon