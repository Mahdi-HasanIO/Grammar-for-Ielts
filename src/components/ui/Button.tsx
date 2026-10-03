import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'ai'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Shows a spinner and blocks clicks without changing the button's width much. */
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-glow shadow-inner-top hover:from-brand-500 hover:to-brand-700 hover:shadow-glow-lg disabled:from-brand-300 disabled:to-brand-300 disabled:shadow-none dark:disabled:from-brand-900 dark:disabled:to-brand-900',
  secondary:
    'border border-ink-200 bg-white text-ink-800 shadow-card hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:border-ink-600 dark:hover:bg-ink-800',
  ghost:
    'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-50',
  danger:
    'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_8px_24px_-8px_rgba(225,29,72,0.5)] hover:to-rose-700',
  subtle:
    'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950/70 dark:text-brand-200 dark:hover:bg-brand-900/70',
  ai:
    'bg-[linear-gradient(110deg,#4f46e5,#9333ea,#6366f1,#4f46e5)] bg-[length:250%_100%] text-white shadow-glow shadow-inner-top animate-gradient-pan hover:shadow-glow-lg disabled:opacity-80',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap font-semibold',
        'transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-200 ease-spring',
        'active:scale-[0.97] disabled:active:scale-100',
        'focus-ring disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" /> : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
