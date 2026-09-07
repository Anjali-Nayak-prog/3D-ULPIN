import { forwardRef, useImperativeHandle, useRef, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../utils/helpers'

export interface SearchInputHandle {
  focus: () => void
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void
}

export const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  function SearchInput({ className, onSearchChange, placeholder, ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }))

    return (
      <div className={cn('relative', className)}>
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'h-9 w-full rounded-lg border border-white/10 bg-navy-900/80 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-primary-400/50 focus:bg-navy-800',
          )}
          placeholder={placeholder ?? 'Search...'}
          onChange={(e) => onSearchChange?.(e.target.value)}
          {...props}
        />
      </div>
    )
  },
)