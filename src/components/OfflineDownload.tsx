import { useEffect, useState, useSyncExternalStore } from 'react'
import { CheckCircle2, CloudDownload, Download, Loader2, Smartphone, Trash2, WifiOff } from 'lucide-react'
import {
  downloadForOffline,
  installStore,
  isStandalone,
  offlineStore,
  offlineSupported,
  promptInstall,
  removeOfflineData,
  verifyOfflineData,
} from '@/offline/offline'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useHydrated } from '@/hooks/useHydrated'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/utils/cn'

function formatSize(bytes: number) {
  if (!bytes) return ''
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

function formatDay(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "Download for Offline" controls with live progress, plus the install button when available. */
export function OfflineDownload({ variant = 'card', className }: { variant?: 'card' | 'plain'; className?: string }) {
  const offline = useSyncExternalStore(offlineStore.subscribe, offlineStore.get, offlineStore.server)
  const canInstall = useSyncExternalStore(installStore.subscribe, installStore.get, installStore.server)
  const online = useOnlineStatus()
  const hydrated = useHydrated()
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    void verifyOfflineData()
    setInstalled(isStandalone())
  }, [])

  const supported = !hydrated || offlineSupported()
  const pct = offline.total ? Math.round((offline.done / offline.total) * 100) : 0
  const downloading = offline.status === 'downloading'

  return (
    <div className={cn(variant === 'card' && 'rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900', className)}>
      {offline.status === 'ready' ? (
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 animate-pop-in items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-900 dark:text-ink-50">Offline Mode Ready</p>
            <p className="mt-0.5 text-[13px] leading-5 text-ink-600 dark:text-ink-400">
              Grammar, lessons in English and বাংলা, practice, tests and articles are saved on this device
              {offline.readyAt ? ` (${formatDay(offline.readyAt)}${offline.bytes ? `, ${formatSize(offline.bytes)}` : ''})` : ''}.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300">
            {downloading ? <Loader2 size={20} className="animate-spin" /> : <CloudDownload size={20} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-900 dark:text-ink-50">
              {downloading ? 'Downloading for offline…' : 'Use Offline Mode'}
            </p>
            <p className="mt-0.5 text-[13px] leading-5 text-ink-600 dark:text-ink-400">
              Save all grammar topics, both lesson languages, practice questions, tests and articles so they work
              without a connection.
            </p>
          </div>
        </div>
      )}

      {downloading ? (
        <div className="mt-4" aria-live="polite">
          <ProgressBar value={pct} size="sm" />
          <p className="mt-2 text-[12.5px] tabular-nums text-ink-500 dark:text-ink-400">
            {offline.done} of {offline.total || '…'} files · {pct}%
          </p>
        </div>
      ) : null}

      {offline.status === 'error' || offline.status === 'unsupported' ? (
        <p role="alert" className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {offline.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {offline.status === 'ready' ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => void downloadForOffline()} disabled={!online}>
              <Download size={14} /> Update offline content
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void removeOfflineData()}>
              <Trash2 size={14} /> Remove
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => void downloadForOffline()} loading={downloading} disabled={!online || !supported}>
            {!downloading ? <Download size={14} /> : null}
            {downloading ? 'Downloading…' : 'Download for Offline'}
          </Button>
        )}
        {hydrated && canInstall && !installed ? (
          <Button size="sm" variant="secondary" onClick={() => void promptInstall().then(setInstalled)}>
            <Smartphone size={14} /> Install app
          </Button>
        ) : null}
        {!online && offline.status !== 'ready' ? (
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-500 dark:text-ink-400">
            <WifiOff size={13} /> Connect to download
          </span>
        ) : null}
      </div>
    </div>
  )
}
