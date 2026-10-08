/**
 * The AI model behind /api/ai. One implementation talks to Gemini
 * (gemini.ts); tests use a fake. Callers never see provider messages: every
 * failure is an AiProviderError with a coarse kind.
 */
export interface AiRequest {
  /** Fixed instructions for this feature. */
  system: string
  /** The user's input, already capped and wrapped by the caller. */
  prompt: string
  /** Ask for a JSON response (application/json). */
  json: boolean
  /** Includes the model's thinking tokens. */
  maxOutputTokens: number
}

export interface AiResponse {
  text: string
  usage: { promptTokens: number; outputTokens: number; totalTokens: number }
}

export interface AiProvider {
  /** For logs and diagnostics only. */
  readonly model: string
  generate(request: AiRequest): Promise<AiResponse>
}

/**
 * - unavailable: overloaded, rate limited by the provider, timed out or unreachable (try again later).
 * - blocked: the provider refused the input or output (safety and similar).
 * - bad_response: an answer we cannot use (empty, cut off, not the JSON we asked for).
 * - failed: anything else, including our own misconfiguration (bad key or model).
 */
export type AiFailure = 'unavailable' | 'blocked' | 'bad_response' | 'failed'

export class AiProviderError extends Error {
  readonly kind: AiFailure
  /** Provider HTTP status, for the server log only. */
  readonly providerStatus?: number

  constructor(kind: AiFailure, detail: string, providerStatus?: number) {
    super(detail)
    this.name = 'AiProviderError'
    this.kind = kind
    this.providerStatus = providerStatus
  }
}
