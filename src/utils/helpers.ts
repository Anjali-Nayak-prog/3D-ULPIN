import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

const DISTRICT_CODES: Record<string, string> = {
  'Pune City': 'PN',
  Hinjewadi: 'HJ',
  Kothrud: 'KO',
  Hadapsar: 'HD',
  Wakad: 'WK',
  Baner: 'BN',
  'Viman Nagar': 'VN',
  Kharadi: 'KH',
  Aundh: 'AU',
  Bibwewadi: 'BB',
}

export function generateMockULPIN(
  district: string,
  year = new Date().getFullYear(),
): string {
  const code = DISTRICT_CODES[district] ?? 'PN'
  const sequence = Math.floor(1000 + Math.random() * 9000)
  return `ULPIN-${code}-${year}-${String(sequence).padStart(7, '0')}`
}

export function generateSequenceULPIN(
  district: string,
  sequence: number,
  year = new Date().getFullYear(),
): string {
  const code = DISTRICT_CODES[district] ?? 'PN'
  return `ULPIN-${code}-${year}-${String(sequence).padStart(7, '0')}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function hexWithOpacity(hex: string, alpha: number): string {
  const a = Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function formatRole(role: string): string {
  return role
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}