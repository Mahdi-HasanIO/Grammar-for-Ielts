import { Link } from 'react-router-dom'
import { BookMarked, BookOpen, Library, Newspaper, Trash2 } from 'lucide-react'
import { useBookmarks, type BookmarkKind } from '@/hooks/useBookmarks'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelative } from '@/utils/date'

const KIND: Record<BookmarkKind, { label: string; icon: typeof BookOpen; tone: 'brand' | 'ai' | 'warning' }> = {
  grammar: { label: 'Grammar topic', icon: Library, tone: 'brand' },
  article: { label: 'Article', icon: Newspaper, tone: 'warning' },
  lesson: { label: 'Course lesson', icon: BookOpen, tone: 'ai' },
}

export function Bookmarks() {
  const { bookmarks, remove } = useBookmarks()

  return (
    <div>
      <PageHeader
        eyebrow="Bookmarks"
        title="Saved for later"
        description="Grammar topics, articles and lessons you saved. Bookmarks are stored on this device and are available offline."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<BookMarked size={22} />}
          title="No bookmarks yet"
          description="Use the Save button on any grammar topic, article or lesson to keep it here."
          action={
            <Link to="/grammar">
              <Button size="sm">Browse grammar</Button>
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {bookmarks.map((b, i) => {
            const meta = KIND[b.kind]
            const Icon = meta.icon
            return (
              <li key={b.path} className="animate-fade-up stagger" style={{ '--i': i } as React.CSSProperties}>
                <Card interactive className="flex h-full items-start gap-3 p-4">
                  <span className="icon-chip mt-0.5 h-10 w-10">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <Link
                      to={b.path}
                      className="mt-1.5 block rounded text-[15px] font-bold leading-snug text-ink-900 hover:text-brand-700 focus-ring dark:text-ink-50 dark:hover:text-brand-300"
                    >
                      {b.title}
                    </Link>
                    <p className="mt-1 text-[12px] text-ink-500 dark:text-ink-400">Saved {formatRelative(b.savedAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(b.path)}
                    aria-label={`Remove ${b.title} from bookmarks`}
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-ring dark:hover:bg-rose-950/40"
                  >
                    <Trash2 size={16} />
                  </button>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
