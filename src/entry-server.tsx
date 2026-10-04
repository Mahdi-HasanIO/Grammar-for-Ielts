import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import App from './app/App'

export { getSeo, headTags, headTagsToHtml, indexableRoutes } from './seo/meta'
export { SITE_URL } from './config/site'

async function renderOnce(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    // Never outline large Suspense boundaries into script-swapped chunks: keep all content inline.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  const decoder = new TextDecoder()
  let html = ''
  for await (const chunk of prelude as unknown as AsyncIterable<Uint8Array | string>) {
    html += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
  }
  return html + decoder.decode()
}

/**
 * Renders a public route to static HTML at build time. The first pass loads the
 * route's lazy page component; the second renders it inline, so the HTML holds
 * the real content instead of a loading fallback swapped in by script.
 */
export async function render(url: string): Promise<string> {
  await renderOnce(url)
  return renderOnce(url)
}
