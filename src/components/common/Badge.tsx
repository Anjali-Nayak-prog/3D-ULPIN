import type { ReactNode } from 'react'
import { cn } from '../../utils/helpers'

type BadgeTone =
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'slate'
  | 'orange'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  dot?: boolean
  className?: string
}

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
}

const dotClasses: Record<BadgeTone, string> = {
  green: 'bg-emerald-400',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  cyan: 'bg-cyan-400',
  slate: 'bg-slate-400',
  orange: 'bg-orange-400',
}

export function Badge({ children, tone = 'slate', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} />}
      {children}
    </span>
  )
}