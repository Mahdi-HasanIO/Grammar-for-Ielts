import { useRef, useState } from 'react'
import { Download, Monitor, Moon, Sun, Trash2, Upload } from 'lucide-react'
import { useProgress, DEFAULT_PREFERENCES } from '@/hooks/useProgress'
import type { Preferences, ProgressState } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const THEMES: { value: Preferences['theme']; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

const GOALS = [10, 20, 30, 45, 60]

export function Settings() {
  const { state, preferences, setPreferences, resetProgress, importState } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  function exportData() {
    const blob = new Blob([JSON.stringify({ state, preferences }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grammar-path-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Progress exported.')
  }

  function importData(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          state?: ProgressState
          preferences?: Preferences
        }
        if (!parsed.state?.modules) throw new Error('bad file')
        importState(parsed.state)
        if (parsed.preferences) setPreferences(parsed.preferences)
        setMessage('Progress restored from file.')
      } catch {
        setMessage('That file could not be read as a Grammar Path backup.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Preferences and data"
        description="Grammar Path runs entirely in your browser. Nothing is uploaded, and all progress lives in this device's local storage."
      />

      <Card>
        <CardHeader title="Theme" subtitle="Choose how the interface looks" />
        <CardBody className="flex flex-wrap gap-2 pt-1">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPreferences({ theme: value })}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors',
                preferences.theme === value
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800',
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Daily study goal"
          subtitle="A day counts toward your streak after 10 minutes"
        />
        <CardBody className="flex flex-wrap gap-2 pt-1">
          {GOALS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setPreferences({ dailyGoalMinutes: min })}
              className={cn(
                'rounded-xl border px-4 py-2.5 text-[13px] font-medium tabular-nums transition-colors',
                preferences.dailyGoalMinutes === min
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800',
              )}
            >
              {min} min
            </button>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Local data" subtitle="Back up or restore your progress" />
        <CardBody className="space-y-3 pt-1">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportData}>
              <Download size={15} /> Export progress
            </Button>
            <Button variant="secondary" onClick={() => fileInput.current?.click()}>
              <Upload size={15} /> Import progress
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) importData(file)
                e.target.value = ''
              }}
            />
          </div>
          {message ? (
            <p className="text-[13px] text-ink-600 dark:text-ink-400">{message}</p>
          ) : null}
        </CardBody>
      </Card>

      <Card className="border-rose-200 dark:border-rose-900/70">
        <CardHeader
          title="Reset progress"
          subtitle="Clears completed modules, test scores, streaks and activity"
          icon={<Trash2 size={16} />}
        />
        <CardBody className="pt-1">
          {!confirming ? (
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Reset all progress
            </Button>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
              <p className="text-[14px] font-medium text-rose-900 dark:text-rose-100">
                This cannot be undone.
              </p>
              <p className="mt-1 text-[13px] text-rose-800 dark:text-rose-200">
                Every module except Module 1 will be locked again. Export your progress first if you
                want a backup.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    resetProgress()
                    setPreferences(DEFAULT_PREFERENCES)
                    setConfirming(false)
                    setMessage('Progress reset. Module 1 is unlocked.')
                  }}
                >
                  Yes, reset everything
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
