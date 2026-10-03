import type { Question, QuestionType } from '@/types'
import { getPracticeQuestions } from '@/data/questions'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

/**
 * Preferred models, best-fit first.
 * These are only *preferences* — resolveModel() checks them against what the
 * key can actually see, so a retired name degrades gracefully instead of 404ing.
 *
 * Avoid the 2.x and 2.5 families: 2.0 Flash shut down 2026-06-01, and 2.5 access
 * is restricted to accounts with prior usage history.
 */
const MODEL_CANDIDATES = [
  'gemini-3.5-flash-lite', // cheap + fast, right size for 3 MCQs
  'gemini-3.8-flash', // current flagship flash
  'gemini-3.6-flash',
  'gemini-flash-latest', // rolling alias, survives the next rename
]

const MODEL_CACHE_KEY = 'gemini:resolved-model'

// ---------------------------------------------------------------------------
// Model discovery
// ---------------------------------------------------------------------------

function readCachedModel(): string | null {
  try {
    return globalThis.sessionStorage?.getItem(MODEL_CACHE_KEY) ?? null
  } catch {
    return null
  }
}

function writeCachedModel(model: string): void {
  try {
    globalThis.sessionStorage?.setItem(MODEL_CACHE_KEY, model)
  } catch {
    // storage unavailable (private mode, SSR) — just skip caching
  }
}

function clearCachedModel(): void {
  try {
    globalThis.sessionStorage?.removeItem(MODEL_CACHE_KEY)
  } catch {
    // ignore
  }
}

type ModelResolution =
  | { ok: true; model: string }
  | { ok: false; status: number; reason: string }

/**
 * Asks the API which models this key can actually call, then picks the best
 * available one. This is what stops the hardcoded-name 404 from ever coming back.
 */
async function resolveModel(apiKey: string): Promise<ModelResolution> {
  const cached = readCachedModel()
  if (cached) return { ok: true, model: cached }

  let response: Response
  try {
    response = await fetch(`${API_BASE}/models?key=${encodeURIComponent(apiKey)}`)
  } catch {
    return { ok: false, status: 0, reason: 'network' }
  }

  if (!response.ok) {
    return { ok: false, status: response.status, reason: 'list-models-failed' }
  }

  const data = (await response.json().catch(() => null)) as {
    models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>
  } | null

  const usable = (data?.models ?? [])
    .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
    .map((model) => String(model.name ?? '').replace(/^models\//, ''))
    .filter(Boolean)

  if (!usable.length) {
    return { ok: false, status: 404, reason: 'no-models' }
  }

  const picked =
    MODEL_CANDIDATES.find((candidate) => usable.includes(candidate)) ??
    usable.find((name) => /flash-lite/.test(name)) ??
    usable.find((name) => /flash/.test(name)) ??
    usable[0]

  writeCachedModel(picked)
  return { ok: true, model: picked }
}

// ---------------------------------------------------------------------------
// Parsing / normalization
// ---------------------------------------------------------------------------

function normalizeType(value?: string): QuestionType {
  switch (value) {
    case 'fill-blank':
      return 'fill-blank'
    case 'error-correction':
      return 'error-correction'
    case 'rewrite':
      return 'rewrite'
    case 'choose-correct-sentence':
      return 'choose-correct-sentence'
    case 'multiple-choice':
    default:
      return 'multiple-choice'
  }
}

/**
 * responseSchema should make this unnecessary, but it stays as a safety net for
 * models that ignore it or wrap output in markdown fences.
 */
function parseJsonPayload(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed)
  } catch {
    // fall through to extraction
  }

  const start = trimmed.indexOf('[')
  const end = trimmed.lastIndexOf(']')
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      // ignore
    }
  }

  const objStart = trimmed.indexOf('{')
  const objEnd = trimmed.lastIndexOf('}')
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(trimmed.slice(objStart, objEnd + 1))
    } catch {
      // ignore
    }
  }

  return null
}

function normalizeQuestions(raw: unknown, moduleId: number): Question[] {
  const payload = (() => {
    if (Array.isArray(raw)) return raw
    if (raw && typeof raw === 'object') {
      const candidate = raw as Record<string, unknown>
      if (Array.isArray(candidate.questions)) return candidate.questions
      if (Array.isArray(candidate.data)) return candidate.data
      if (Array.isArray(candidate.items)) return candidate.items
    }
    return []
  })()

  return payload
    .flatMap((item, index) => {
      if (!item || typeof item !== 'object') return []

      const entry = item as Record<string, unknown>
      const options = Array.isArray(entry.options)
        ? entry.options.map((option) => String(option)).filter((option) => option.trim())
        : []
      const questionText = String(entry.question ?? entry.prompt ?? '').trim()
      const answerText = String(entry.answer ?? options[0] ?? '').trim()
      const explanationText = String(
        entry.explanation ?? 'Review the grammar rule to understand why this answer fits.',
      ).trim()

      if (!questionText || !answerText || options.length < 2) {
        return []
      }

      return [
        {
          id: `gemini-${moduleId}-${Date.now()}-${index + 1}`,
          moduleId,
          type: normalizeType(typeof entry.type === 'string' ? entry.type : undefined),
          question: questionText,
          prompt: typeof entry.prompt === 'string' ? entry.prompt : undefined,
          options,
          answer: answerText,
          acceptable:
            Array.isArray(entry.acceptable) && entry.acceptable.length
              ? entry.acceptable.map((value) => String(value))
              : undefined,
          explanation: explanationText,
        } satisfies Question,
      ]
    })
    .slice(0, 3)
}

// ---------------------------------------------------------------------------
// Request building
// ---------------------------------------------------------------------------

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      question: { type: 'STRING' },
      options: { type: 'ARRAY', items: { type: 'STRING' } },
      answer: { type: 'STRING' },
      explanation: { type: 'STRING' },
      type: { type: 'STRING' },
    },
    required: ['question', 'options', 'answer', 'explanation'],
  },
} as const

function buildBody(prompt: string, includeThinkingConfig: boolean) {
  return {
    contents: [
      {
        parts: [
          {
            text:
              'You are a strict IELTS grammar tutor. Return ONLY valid JSON with an array of 3 question objects. ' +
              prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      // Generous budget: 3.x models are thinking models and reasoning tokens
      // count against this. Too low and `parts[0].text` comes back empty.
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      ...(includeThinkingConfig ? { thinkingConfig: { thinkingLevel: 'low' } } : {}),
    },
  }
}

function describeFailure(status: number, errorText: string): string {
  const lower = errorText.toLowerCase()

  if (status === 404) {
    return 'The selected Gemini model is no longer available. Reopen Settings to re-detect a working model.'
  }

  const tokenProblem =
    status === 401 ||
    status === 403 ||
    status === 429 ||
    /quota|rate limit|limit reached|exceeded|too many requests|invalid api key/.test(lower)

  if (tokenProblem) {
    return 'Gemini token limit reached or API key is invalid. Using the built-in practice questions instead.'
  }

  return `Gemini rejected the request (${status}). Using the built-in practice questions instead.`
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateGeminiPractice(
  moduleId: number,
  moduleTitle: string,
  topics: string[],
  apiKey: string,
): Promise<{ questions: Question[]; source: 'ai' | 'fallback'; message?: string }> {
  const fallbackQuestions = getPracticeQuestions(moduleId)
  const trimmedKey = apiKey.trim()

  const fallback = (message?: string) =>
    ({ questions: fallbackQuestions, source: 'fallback', message }) as const

  if (!trimmedKey) {
    return fallback('Add a Gemini API key in Settings to enable AI-generated quick practice.')
  }

  const prompt = `You are an IELTS grammar coach creating a replacement practice set for Module ${moduleId}: ${moduleTitle}. Focus on these grammar areas: ${topics.join(', ')}. Replace the current practice set entirely with 3 fresh questions. Return ONLY a valid JSON array of 3 objects and nothing else. Each object must use this exact shape: {"question":"...","options":["...","...","...","..."],"answer":"...","explanation":"...","type":"multiple-choice"}. Use realistic IELTS contexts, keep each question concise, and avoid duplicate questions.`

  try {
    const resolution = await resolveModel(trimmedKey)

    if (!resolution.ok) {
      if (resolution.status === 0) {
        return fallback('Could not reach Gemini. Using the built-in practice questions instead.')
      }
      if (resolution.status === 401 || resolution.status === 403) {
        return fallback(
          'Gemini rejected the API key. Check the key and any key restrictions in Google AI Studio.',
        )
      }
      return fallback(
        'No Gemini models are available for this API key. Using the built-in practice questions instead.',
      )
    }

    const model = resolution.model
    const url = `${API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(trimmedKey)}`

    // First attempt with thinkingConfig; retry without it if the model's API
    // surface doesn't recognise the field (older stable models return 400).
    let response: Response | null = null
    let errorText = ''

    for (const includeThinkingConfig of [true, false]) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody(prompt, includeThinkingConfig)),
      })

      if (response.ok) break

      errorText = await response.text().catch(() => '')

      const unknownField =
        response.status === 400 && /thinking|unknown name|invalid json payload/i.test(errorText)

      if (includeThinkingConfig && unknownField) {
        continue // retry without thinkingConfig
      }

      break
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 0

      // A 404 here means the cached model was retired between sessions.
      // Drop the cache so the next attempt re-detects a live model.
      if (status === 404) clearCachedModel()

      return fallback(describeFailure(status, errorText))
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        finishReason?: string
        content?: { parts?: Array<{ text?: string }> }
      }>
    }

    const candidate = data?.candidates?.[0]
    const content = candidate?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''

    if (!content.trim()) {
      const truncated = candidate?.finishReason === 'MAX_TOKENS'
      return fallback(
        truncated
          ? 'Gemini ran out of output tokens before finishing. Using the built-in practice questions instead.'
          : 'Gemini returned an empty response. Using the built-in practice questions instead.',
      )
    }

    const questions = normalizeQuestions(parseJsonPayload(content), moduleId)

    if (!questions.length) {
      return fallback(
        'Gemini returned no usable questions. Using the built-in practice questions instead.',
      )
    }

    return { questions, source: 'ai' }
  } catch (error) {
    console.error('Gemini quick practice failed:', error)
    return fallback('AI generation failed. Using the built-in practice questions instead.')
  }
}