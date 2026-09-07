import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/helpers'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  isLoading?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export function Card({
  title,
  subtitle,
  action,
  padding = 'md',
  hoverable = false,
  isLoading = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.06] bg-navy-900/70 backdrop-blur-sm shadow-card transition-all duration-300',
        hoverable &&
          'hover:border-primary-500/30 hover:shadow-glow-sm hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(paddingMap[padding], !title && !action && 'pt-5')}>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}