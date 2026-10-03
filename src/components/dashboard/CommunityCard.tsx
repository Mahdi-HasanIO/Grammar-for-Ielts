import { useState } from 'react'
import { Check, Link2, Share2, Users } from 'lucide-react'
import { useCountUp, useVisitorCount } from '@/hooks/useVisitorCount'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

const SHARE_TEXT =
  'I’m preparing for IELTS with Grammar for IELTS, a free step-by-step grammar course with AI practice. Join me:'

function shareUrl(): string {
  return typeof window === 'undefined' ? '' : window.location.origin
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.92 9.92 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.18 8.18 0 1 1 6.84 3.73Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04c0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7 1.56.68 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07Z" />
    </svg>
  )
}

export function CommunityCard() {
  const visitors = useVisitorCount()
  const count = useCountUp(visitors.status === 'ready' ? visitors.count : null)
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl()}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // clipboard blocked: nothing useful to do, the other buttons still work
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: 'Grammar for IELTS', text: SHARE_TEXT, url: shareUrl() })
    } catch {
      // user cancelled the share sheet
    }
  }

  const encoded = encodeURIComponent(`${SHARE_TEXT} ${shareUrl()}`)
  const chip =
    'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-all duration-200 ease-spring hover:-translate-y-0.5 active:scale-[0.97] focus-ring'

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-brand-50/60 p-5 shadow-card sm:p-7 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:via-ink-900 dark:to-brand-950/40">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Count */}
        <div className="flex items-center gap-4 lg:min-w-[240px]">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_28px_-10px_rgba(5,150,105,0.7)]">
            <Users size={24} />
          </span>
          <div>
            {visitors.status === 'loading' ? (
              <Skeleton className="h-9 w-28 rounded-xl" />
            ) : visitors.status === 'ready' ? (
              <p className="font-display text-[34px] font-extrabold leading-none tabular-nums tracking-tight text-ink-900 dark:text-white">
                {count.toLocaleString()}
              </p>
            ) : null}
            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {visitors.status === 'error' ? 'A growing community of learners' : 'learners have visited'}
            </p>
          </div>
        </div>

        {/* Message + share */}
        <div className="min-w-0 flex-1 lg:border-l lg:border-emerald-200/70 lg:pl-6 dark:lg:border-emerald-900/50">
          <h3 className="text-[17px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
            Share with your friends
          </h3>
          <p className="mt-1 text-[13.5px] leading-6 text-ink-600 dark:text-ink-300">
            Know someone preparing for IELTS? Send them Grammar for IELTS. It’s free, and practising
            together makes it much easier to keep your streak going.
          </p>
          <p className="bn-text mt-1 text-[13px] text-ink-500 dark:text-ink-400">
            আপনার বন্ধুদের সঙ্গে শেয়ার করুন, একসঙ্গে প্রস্তুতি নিলে পড়া চালিয়ে যাওয়া অনেক সহজ হয়।
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {canNativeShare ? (
              <button
                type="button"
                onClick={nativeShare}
                className={cn(chip, 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.7)]')}
              >
                <Share2 size={15} /> Share
              </button>
            ) : null}
            <a
              href={`https://wa.me/?text=${encoded}`}
              target="_blank"
              rel="noreferrer"
              className={cn(chip, 'bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.7)]')}
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`}
              target="_blank"
              rel="noreferrer"
              className={cn(chip, 'bg-[#1877F2] text-white shadow-[0_8px_20px_-8px_rgba(24,119,242,0.7)]')}
            >
              <FacebookIcon /> Facebook
            </a>
            <button
              type="button"
              onClick={copyLink}
              className={cn(
                chip,
                'border border-ink-200 bg-white text-ink-800 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100',
                copied && 'border-emerald-400 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
              )}
            >
              {copied ? <Check size={15} className="animate-pop-in" /> : <Link2 size={15} />}
              {copied ? 'Link copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
