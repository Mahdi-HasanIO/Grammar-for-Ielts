import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { captureInstallPrompt } from './offline/offline'
import './index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Public pages arrive prerendered (see scripts/postbuild.mjs): hydrate them.
// The app shell used for the dashboard and course is empty: render from scratch.
if (container.firstElementChild) {
  hydrateRoot(container, app, {
    onRecoverableError(error) {
      // React re-renders on the client if the HTML ever differs; report it in dev or when debugging.
      if (import.meta.env.DEV || localStorage.getItem('gfi:debug')) console.warn('Hydration recovered:', error)
    },
  })
} else {
  createRoot(container).render(app)
}

captureInstallPrompt()

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Offline support is an enhancement; the site works without it. */
    })
  })
}

// After a new deploy, an open tab may ask for a chunk that no longer exists. Reload once to pick up the new build.
window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem('gfi:reloaded')) return
  sessionStorage.setItem('gfi:reloaded', '1')
  event.preventDefault()
  window.location.reload()
})
