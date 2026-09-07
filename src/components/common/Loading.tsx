import { cn } from '../../utils/helpers'
import { Card } from './Card'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
    </div>
  )
}

interface SkeletonRowProps {
  rows?: number
  title?: boolean
}

export function SkeletonCard({ rows = 4, title = true }: SkeletonRowProps) {
  return (
    <Card className="animate-pulse">
      <div className="space-y-4">
        {title && (
          <div className="h-4 w-1/3 rounded bg-white/[0.06]" />
        )}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 w-full rounded bg-white/[0.06]" style={{ width: `${100 - i * 12}%` }} />
        ))}
      </div>
    </Card>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
          <div className="absolute inset-2 rounded-full border border-primary-400/30" />
        </div>
        <p className="text-xs text-slate-500">Loading...</p>
      </div>
    </div>
  )
}