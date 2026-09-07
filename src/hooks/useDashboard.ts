import { useEffect, useState } from 'react'
import {
  alerts,
  dashboardStats,
  recentActivities,
  statusSummary,
  systemServices,
} from '../data/dashboardData'
import { simulateLatency } from '../services/api'
import type { Activity, Alert, StatCardData, StatusSummary, SystemService } from '../types/dashboard'

export interface DashboardData {
  stats: StatCardData[]
  statusSummary: StatusSummary
  activities: Activity[]
  alerts: Alert[]
  systemServices: SystemService[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    void simulateLatency({
      stats: dashboardStats,
      statusSummary,
      activities: recentActivities,
      alerts,
      systemServices,
    }).then((result) => {
      if (mounted) {
        setData(result)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return { ...(data ?? { stats: [], statusSummary: null, activities: [], alerts: [], systemServices: [] }), loading }
}