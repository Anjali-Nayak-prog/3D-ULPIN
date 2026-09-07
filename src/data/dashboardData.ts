import type {
  Activity,
  Alert,
  StatCardData,
  StatusSummary,
  SystemService,
} from '../types/dashboard'

export const dashboardStats: StatCardData[] = [
  {
    id: 'total',
    title: 'Total Parcels',
    value: '12,450',
    rawValue: 12450,
    change: 4.2,
    icon: 'map',
    color: 'blue',
  },
  {
    id: '3d',
    title: '3D Parcels',
    value: '8,742',
    rawValue: 8742,
    change: 9.1,
    icon: 'box',
    color: 'purple',
  },
  {
    id: 'buildings',
    title: 'Registered Buildings',
    value: '5,231',
    rawValue: 5231,
    change: 2.4,
    icon: 'building',
    color: 'cyan',
  },
  {
    id: 'units',
    title: 'Apartments / Units',
    value: '18,492',
    rawValue: 18492,
    change: 6.8,
    icon: 'door',
    color: 'green',
  },
  {
    id: 'underground',
    title: 'Underground Assets',
    value: '1,240',
    rawValue: 1240,
    change: 1.9,
    icon: 'drill',
    color: 'amber',
  },
  {
    id: 'conflicts',
    title: 'Ownership Conflicts',
    value: '24',
    rawValue: 24,
    change: -12.5,
    icon: 'alert',
    color: 'red',
  },
]

export const statusSummary: StatusSummary = {
  verified: 7835,
  verifiedPercent: 63,
  pending: 3142,
  pendingPercent: 25,
  conflict: 24,
  conflictPercent: 0.2,
  new: 1449,
  newPercent: 11,
}

export const recentActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'ulpin',
    time: '09:42 AM',
    title: 'ULPIN Generated',
    description: 'ULPIN-PN-2026-001245',
  },
  {
    id: 'act-2',
    type: 'upload',
    time: '09:31 AM',
    title: 'Building Data Uploaded',
    description: 'Drone Survey #DR-2026-045',
  },
  {
    id: 'act-3',
    type: 'conflict',
    time: '09:18 AM',
    title: 'Ownership Conflict Detected',
    description: 'ULPIN-PN-2026-001122',
  },
  {
    id: 'act-4',
    type: 'update',
    time: '08:55 AM',
    title: 'Property Updated',
    description: 'ULPIN-PN-2026-000985',
  },
  {
    id: 'act-5',
    type: 'floorplan',
    time: '08:42 AM',
    title: 'Floor Plan Processed',
    description: 'Building: Skyline Tower A',
  },
]

export const alerts: Alert[] = [
  {
    id: 'al-1',
    severity: 'critical',
    title: '24 Ownership Conflicts',
    description: 'Require immediate attention',
    time: '2h ago',
  },
  {
    id: 'al-2',
    severity: 'warning',
    title: '137 Parcels Pending Validation',
    description: 'Awaiting officer approval',
    time: '5h ago',
  },
  {
    id: 'al-3',
    severity: 'info',
    title: '32 New Properties Added',
    description: 'In the last 7 days',
    time: '1d ago',
  },
  {
    id: 'al-4',
    severity: 'success',
    title: 'System Backup Completed',
    description: '20 May 2026, 02:00 AM',
    time: '2d ago',
  },
]

export const systemServices: SystemService[] = [
  { id: 'srv-1', name: 'GIS Service', status: 'operational', latency: 42, uptime: 99.99 },
  { id: 'srv-2', name: 'Database', status: 'operational', latency: 18, uptime: 99.98 },
  { id: 'srv-3', name: 'AI Processing', status: 'operational', latency: 128, uptime: 99.95 },
  { id: 'srv-4', name: '3D Engine', status: 'operational', latency: 64, uptime: 99.97 },
  { id: 'srv-5', name: 'Storage', status: 'operational', latency: 23, uptime: 99.99 },
]

export const quickActions = [
  {
    id: 'qa-1',
    title: 'Generate ULPIN',
    description: 'Create a new 3D property identifier',
    icon: 'fingerprint',
    to: '/ulpin-generator',
    color: 'blue',
  },
  {
    id: 'qa-2',
    title: 'Upload Data',
    description: 'Add drone, LiDAR or GIS datasets',
    icon: 'upload',
    to: '/data-management',
    color: 'cyan',
  },
  {
    id: 'qa-3',
    title: 'AI Processing',
    description: 'Run building & floor extraction models',
    icon: 'sparkles',
    to: '/ai-processing',
    color: 'purple',
  },
  {
    id: 'qa-4',
    title: 'Validate Topology',
    description: 'Check vertical & horizontal integrity',
    icon: 'shield-check',
    to: '/validation',
    color: 'green',
  },
  {
    id: 'qa-5',
    title: 'View 3D Map',
    description: 'Explore the volumetric cadastral map',
    icon: 'orbit',
    to: '/map',
    color: 'amber',
  },
  {
    id: 'qa-6',
    title: 'Generate Report',
    description: 'Export lossless cadastral reports',
    icon: 'file-text',
    to: '/reports',
    color: 'pink',
  },
] as const