import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, Eye, EyeOff, Monitor, Moon, Palette, Sparkles, Sun, Target, Trash2, Upload } from 'lucide-react'
import { useProgress, DEFAULT_PREFERENCES } from '@/hooks/useProgress'
import type { Preferences, ProgressState } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { DeveloperCard } from '@/components/DeveloperInfo'
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

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
  const [geminiKey, setGeminiKey] = useState('')
  const [geminiStatus, setGeminiStatus] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [savedKey, setSavedKey] = useState(() => readStorage<string>(STORAGE_KEYS.geminiApiKey, ''))
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setGeminiKey(readStorage<string>(STORAGE_KEYS.geminiApiKey, ''))
  }, [])

  function saveGeminiKey() {
    const nextKey = geminiKey.trim()
    if (!nextKey) {
      removeStorage(STORAGE_KEYS.geminiApiKey)
      setSavedKey('')
      setGeminiStatus('Gemini API key removed. Lessons will use the built-in practice questions.')
      return
    }

    writeStorage(STORAGE_KEYS.geminiApiKey, nextKey)
    setSavedKey(nextKey)
    setGeminiStatus(
      'Saved in this browser only. Open any lesson and AI practice questions will be generated automatically.',
    )
  }

  function clearGeminiKey() {
    removeStorage(STORAGE_KEYS.geminiApiKey)
    setGeminiKey('')
    setSavedKey('')
    setGeminiStatus('Gemini API key cleared. Lessons will use the built-in practice questions.')
  }

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
        <CardHeader title="Theme" subtitle="Choose how the interface looks" icon={<Palette size={16} />} />
        <CardBody className="grid grid-cols-3 gap-2 pt-4 sm:flex sm:flex-wrap">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPreferences({ theme: value })}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ease-spring focus-ring active:scale-95',
                preferences.theme === value
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_rgba(99,102,241,0.12)] dark:border-brand-600 dark:bg-brand-950 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-700 hover:-translate-y-px hover:border-ink-300 hover:shadow-card dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800',
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
          icon={<Target size={16} />}
        />
        <CardBody className="flex flex-wrap gap-2 pt-4">
          {GOALS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setPreferences({ dailyGoalMinutes: min })}
              className={cn(
                'rounded-xl border px-4 py-2.5 text-[13px] font-semibold tabular-nums transition-all duration-200 ease-spring focus-ring active:scale-95',
                preferences.dailyGoalMinutes === min
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_rgba(99,102,241,0.12)] dark:border-brand-600 dark:bg-brand-950 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-700 hover:-translate-y-px hover:border-ink-300 hover:shadow-card dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800',
              )}
            >
              {min} min
            </button>
          ))}
        </CardBody>
      </Card>

      <Card id="ai" className="scroll-mt-24 overflow-hidden">
        <CardHeader
          title="AI Practice Questions"
          subtitle="Fresh, lesson-specific questions generated by Gemini whenever you want them"
          icon={<Sparkles size={16} />}
          action={
            savedKey ? (
              <Badge tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
              </Badge>
            ) : (
              <Badge tone="muted">Not connected</Badge>
            )
          }
        />
        <CardBody className="space-y-5 pt-4">
          <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50 to-purple-50/60 p-4 text-[13.5px] leading-6 text-ink-800 dark:border-brand-800/60 dark:from-brand-950/50 dark:to-purple-950/30 dark:text-ink-100">
            <p className="font-bold">Set up in under a minute (free)</p>
            <ol className="mt-2 space-y-1.5">
              {[
                <>
                  Open{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600 dark:text-brand-300"
                  >
                    Google AI Studio <ExternalLink size={12} />
                  </a>{' '}
                  and create an API key.
                </>,
                'Copy the key and paste it below.',
                'Save it. Every lesson will now generate AI practice questions for its own grammar rule.',
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-ink-900 dark:text-brand-300 dark:ring-brand-800">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <label htmlFor="gemini-key" className="label-xs mb-2 block">
              Gemini API key
            </label>
            <div className="relative">
              <input
                id="gemini-key"
                type={showKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(event) => setGeminiKey(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') saveGeminiKey()
                }}
                placeholder="AIza..."
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-4 pr-11 font-mono text-sm text-ink-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-400 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-200"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-2 text-[12px] text-ink-500 dark:text-ink-400">
              Stored only in this browser&apos;s local storage and sent only to Google&apos;s Gemini API.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={saveGeminiKey}>Save key</Button>
            <Button variant="ghost" onClick={clearGeminiKey} disabled={!savedKey && !geminiKey}>
              Clear key
            </Button>
          </div>

          {geminiStatus ? (
            <p
              key={geminiStatus}
              className="animate-fade-down rounded-xl bg-ink-50 px-3.5 py-2.5 text-[13px] text-ink-700 dark:bg-ink-800/60 dark:text-ink-300"
            >
              {geminiStatus}
            </p>
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Local data"
          subtitle="Back up or restore your progress"
          icon={<Download size={16} />}
        />
        <CardBody className="space-y-3 pt-4">
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
            <p key={message} className="animate-fade-down text-[13px] text-ink-600 dark:text-ink-400">
              {message}
            </p>
          ) : null}
        </CardBody>
      </Card>

      <Card className="border-rose-200 dark:border-rose-900/70">
        <CardHeader
          title="Reset progress"
          subtitle="Clears completed modules, test scores, streaks and activity"
          icon={<Trash2 size={16} />}
        />
        <CardBody className="pt-4">
          {!confirming ? (
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Reset all progress
            </Button>
          ) : (
            <div className="animate-scale-in rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
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

      <DeveloperCard />
    </div>
  )
}
