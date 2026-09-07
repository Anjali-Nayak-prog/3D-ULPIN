import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/helpers'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-400 focus-visible:ring-primary-400/50 shadow-glow-sm',
  secondary:
    'bg-navy-700 text-slate-200 hover:bg-navy-600 focus-visible:ring-primary-400/40',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/20',
  outline:
    'border border-white/10 bg-transparent text-slate-200 hover:border-primary-400/50 hover:text-white focus-visible:ring-primary-400/40',
  danger:
    'bg-danger-500 text-white hover:bg-danger-400 focus-visible:ring-danger-400/50',
  success:
    'bg-success-500 text-white hover:bg-success-400 focus-visible:ring-success-400/50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9.5 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
  icon: 'h-9 w-9 p-0',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 outline-none focus-visible:ring-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}