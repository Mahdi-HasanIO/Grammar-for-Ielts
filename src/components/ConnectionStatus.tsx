import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { cn } from '@/utils/cn'

/**
 * Small, quiet connection pill. Online it is just a dot (with the word on wider
 * screens); offline it always says "Offline Mode" so the learner knows why AI
 * is unavailable. Changes are announced politely to screen readers.
 */
export function ConnectionStatus({ className }: { className?: string }) {
  const online = useOnlineStatus()
  return (
    <span
      role="status"
      aria-live="polite"
      title={online ? 'Connected to the internet' : 'You are offline. Downloaded lessons, practice and progress still work.'}
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold transition-colors duration-300',
        online
          ? 'text-ink-500 dark:text-ink-400'
          : 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:ring-amber-800/60',
        className,
      )}
    >
      {online ? (
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
      ) : (
        <WifiOff size={13} aria-hidden />
      )}
      <span className={online ? 'sr-only sm:not-sr-only' : undefined}>{online ? 'Online' : 'Offline Mode'}</span>
    </span>
  )
}
