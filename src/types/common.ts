export type UserRole = 'super-admin' | 'admin' | 'officer' | 'analyst' | 'viewer'

export type UserStatus = 'active' | 'inactive' | 'invited'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  status: UserStatus
  lastActive: string
  permissions: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  permissions: string[]
  color: string
}

export type ReportType =
  | 'property'
  | 'cadastral'
  | 'conflict'
  | 'infrastructure'
  | 'ai'
  | 'ulpin'

export type ReportStatus = 'ready' | 'processing' | 'failed'

export interface Report {
  id: string
  title: string
  description: string
  type: ReportType
  format: 'PDF' | 'CSV' | 'XLSX' | 'GeoJSON'
  size: string
  generatedAt: string
  status: ReportStatus
  pages: number
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  category: 'property' | 'system' | 'auth' | 'data' | 'security'
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
  ip: string
}