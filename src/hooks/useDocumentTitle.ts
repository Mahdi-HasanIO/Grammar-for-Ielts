import { useEffect } from 'react'

const SITE = 'Grammar for IELTS'

/** Sets the browser tab title for a page and restores the default on leave. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | ${SITE}` : `${SITE} - IELTS Writing Grammar for Band 7-8+`
    return () => {
      document.title = previous
    }
  }, [title])
}
