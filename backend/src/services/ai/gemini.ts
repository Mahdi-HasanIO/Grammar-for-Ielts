import { AiProviderError, type AiProvider } from './provider.js'

/*
 * Gemini through its REST API with fetch (no SDK), as documented at
 * https://ai.google.dev/api/generate-content and
 * https://ai.google.dev/gemini-api/docs/generate-content/text-generation:
 *
 *   POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 *   x-goog-api-key: <key>
 *   { system_instruction: { parts: [{ text }] },
 *     contents: [{ role: 'user', parts: [{ text }] }],
 *     generationConfig: { maxOutputTokens, responseMimeType, thinkingConfig: { thinkingLevel } } }
 *
 * The key goes in the header, never in the URL, so it cannot end up in
 * proxy or access logs. Temperature is left at the default, as Google
 * recommends for Gemini 3 models.
 */

export const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[]
  promptFeedback?: { blockReason?: string }
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number; totalTokenCount?: number }
}

/** Finish reasons that mean the provider refused the content. */
const BLOCKED = new Set(['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII', 'LANGUAGE'])

export function createGeminiProvider({
  apiKey,
  model,
  fetch = globalThis.fetch,
  timeoutMs = 30_000,
}: {
  apiKey: string
  model: string
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
}): AiProvider {
  return {
    model,
    async generate({ system, prompt, json, maxOutputTokens }) {
      let response: Response
      try {
        response = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST',
          headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens,
              // Short, structured answers need little reasoning; keeps latency and cost down.
              thinkingConfig: { thinkingLevel: 'low' },
              ...(json ? { responseMimeType: 'application/json' } : {}),
            },
          }),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        const timedOut = error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')
        throw new AiProviderError('unavailable', timedOut ? 'Gemini request timed out' : 'Gemini request failed to send')
      }

      if (!response.ok) {
        // The body may echo the prompt; only the status is kept.
        const kind = response.status === 429 || response.status >= 500 ? 'unavailable' : 'failed'
        throw new AiProviderError(kind, `Gemini responded with HTTP ${response.status}`, response.status)
      }

      let body: GeminiResponse
      try {
        body = (await response.json()) as GeminiResponse
      } catch {
        throw new AiProviderError('bad_response', 'Gemini returned a body that is not JSON', response.status)
      }
      if (body.promptFeedback?.blockReason) throw new AiProviderError('blocked', `Prompt blocked (${body.promptFeedback.blockReason})`)
      const candidate = body.candidates?.[0]
      const finish = candidate?.finishReason
      if (finish && BLOCKED.has(finish)) throw new AiProviderError('blocked', `Response blocked (${finish})`)
      if (finish === 'MAX_TOKENS') throw new AiProviderError('bad_response', 'Response cut off at maxOutputTokens')
      const text = (candidate?.content?.parts ?? [])
        .filter((part) => !part.thought && typeof part.text === 'string')
        .map((part) => part.text)
        .join('')
      if (!text.trim()) throw new AiProviderError('bad_response', `Empty response${finish ? ` (${finish})` : ''}`)
      const usage = body.usageMetadata ?? {}
      return {
        text,
        usage: {
          promptTokens: usage.promptTokenCount ?? 0,
          outputTokens: (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
          totalTokens: usage.totalTokenCount ?? 0,
        },
      }
    },
  }
}
