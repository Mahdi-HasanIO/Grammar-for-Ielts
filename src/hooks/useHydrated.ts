import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * False while React hydrates prerendered HTML, true afterwards (and always true
 * for pages rendered only in the browser). Gate anything that depends on
 * localStorage or the URL query so the first render matches the static HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
