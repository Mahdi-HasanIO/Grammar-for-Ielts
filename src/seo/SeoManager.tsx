import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, headTags } from './meta'

/** Keeps <head> metadata in sync with the current route during client-side navigation. */
export function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const head = document.head
    head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
    // Also drop the generic defaults from the HTML shell so tags are never duplicated.
    head.querySelectorAll('title, meta[name="description"]').forEach((el) => el.remove())

    for (const t of headTags(getSeo(pathname))) {
      let el: HTMLElement
      if (t.tag === 'title') {
        el = document.createElement('title')
        el.textContent = t.text
      } else if (t.tag === 'jsonld') {
        el = document.createElement('script')
        el.setAttribute('type', 'application/ld+json')
        el.textContent = JSON.stringify(t.json)
      } else {
        el = document.createElement(t.tag)
        for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
      }
      el.setAttribute('data-seo', '')
      head.appendChild(el)
    }
  }, [pathname])

  return null
}
