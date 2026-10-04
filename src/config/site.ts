/*
 * Site-wide settings. SITE_URL is the production origin used for canonical
 * URLs, Open Graph tags, structured data, sitemap.xml and robots.txt.
 * Override it with VITE_SITE_URL (for example in Vercel's environment
 * variables) if the site moves to a custom domain.
 */
const fromEnv = (import.meta.env?.VITE_SITE_URL as string | undefined)?.trim()

export const SITE_URL = (fromEnv || 'https://grammar-for-ielts.vercel.app').replace(/\/+$/, '')

export const SITE_NAME = 'Grammar for IELTS'

export const SITE_DESCRIPTION =
  'A structured grammar course for IELTS Writing Band 7-8+. Clear rules, common mistakes and practice for every topic, with every lesson in English and Bangla.'

/** 1200x630 image used when a page has no specific share image. */
export const DEFAULT_OG_IMAGE = '/og/og-default.jpg'

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
