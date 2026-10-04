import { Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react'
import { useBookmarks, type BookmarkKind } from '@/hooks/useBookmarks'
import { cn } from '@/utils/cn'

/** Save / unsave toggle. Bookmarks live in localStorage and work offline. */
export function BookmarkButton({
  kind,
  path,
  title,
  className,
}: {
  kind: BookmarkKind
  path: string
  title: string
  className?: string
}) {
  const { isSaved, toggle } = useBookmarks()
  const saved = isSaved(path)
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggle({ kind, path, title })}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[13.5px] font-semibold transition-all duration-200 ease-spring active:scale-[0.97] focus-ring',
        saved
          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
          : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:text-ink-50',
        className,
      )}
    >
      {saved ? <BookmarkCheck size={16} className="animate-pop-in" /> : <BookmarkIcon size={16} />}
      {saved ? 'Saved' : 'Save'}
      <span className="sr-only"> {title} to bookmarks</span>
    </button>
  )
}
