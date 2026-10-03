import type { Lesson, ModuleMeta, Question, QuestionType } from '@/types'
import { normalize } from '@/utils/answers'

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
  'gemini-3.5-flash-lite', // cheap + fast, right size for a short practice set
  'gemini-3.8-flash', // current flagship flash
  'gemini-3.6-flash',
  'gemini-flash-latest', // rolling alias, survives the next rename
]

const MODEL_CACHE_KEY = 'gemini:resolved-model'

/** How many questions one generation asks for. */
export const AI_SET_SIZE = 5

/** Fewer valid questions than this and the set is treated as a failed generation. */
const MIN_USABLE = 3

export type AiDifficulty = 'mixed' | 'warm-up' | 'challenge'

export interface AiPracticeRequest {
  module: ModuleMeta
  lesson?: Lesson
  apiKey: string
  difficulty?: AiDifficulty
  /** Question stems already shown to this learner, so the model avoids repeating them. */
  avoid?: string[]
}

export type AiPracticeResult =
  | { ok: true; questions: Question[]; model: string }
  | { ok: false; message: string }

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
// Prompt building
// ---------------------------------------------------------------------------

/** Realistic IELTS settings; a random few are suggested per request so sets don't feel samey. */
const IELTS_CONTEXTS = [
  'a Task 1 line graph about energy consumption',
  'a Task 1 bar chart comparing countries',
  'a Task 1 process diagram',
  'a Task 1 table of survey results',
  'a Task 2 essay on remote work',
  'a Task 2 essay on public transport and car ownership',
  'a Task 2 essay on university tuition fees',
  'a Task 2 essay on social media and young people',
  'a Task 2 essay on climate change policy',
  'a Task 2 essay on urbanisation and housing',
  'a Task 2 essay on healthcare spending',
  'a Task 2 essay on tourism and local culture',
  'a Task 2 essay on artificial intelligence and jobs',
  'a Task 2 essay on online learning',
  'a formal workplace email',
  'a short academic report summary',
]

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const LEVEL_PLAN: Record<AiDifficulty, string> = {
  mixed:
    '1 easy question, 3 medium questions and 1 hard question, ordered from easiest to hardest',
  'warm-up':
    '3 easy questions and 2 medium questions, ordered from easiest to hardest. Keep sentences short and the distractors clearly wrong to someone who knows the rule',
  challenge:
    '1 medium question and 4 hard questions. Use longer academic sentences and distractors that reflect the subtle mistakes strong candidates still make',
}

/** Compresses the lesson into a short brief so the model tests exactly what was taught. */
function lessonBrief(lesson?: Lesson): string {
  if (!lesson) return ''

  const rules = lesson.rules
    .map((rule) => {
      const structure = rule.structure.slice(0, 4).join(' / ')
      return `- ${rule.heading}: ${structure}`
    })
    .join('\n')

  const mistakes = lesson.mistakes
    .slice(0, 5)
    .map((m) => `- "${m.wrong}" → "${m.right}"`)
    .join('\n')

  return `
Rules taught in this lesson (headings may be in Bangla; structures are in English):
${rules}

Typical learner mistakes for this lesson (wrong → right):
${mistakes}`
}

function buildPrompt({ module, lesson, difficulty = 'mixed', avoid = [] }: AiPracticeRequest): string {
  const contexts = shuffle(IELTS_CONTEXTS).slice(0, 3).join('; ')
  const focusTopics = shuffle(module.topics).join(', ')
  const recent = avoid.slice(-15)

  return `You are an experienced IELTS Writing examiner and grammar teacher writing practice questions for Bangladeshi learners.

LESSON
Module ${module.id}: ${module.title}
Course level: ${module.difficulty}
Grammar points (cover several, not just one): ${focusTopics}
${lessonBrief(lesson)}

TASK
Write ${AI_SET_SIZE} NEW practice questions that test ONLY the grammar rules of this lesson.
Difficulty mix: ${LEVEL_PLAN[difficulty]}.
Base at least 3 questions on IELTS-style writing. For variety, consider settings such as: ${contexts}.

QUESTION TYPES (use at least two different types across the set)
1. "multiple-choice": "question" is one sentence with a single gap written as ___ . "options" are 4 words or phrases that could fill the gap.
2. "choose-correct-sentence": "question" is an instruction such as "Which sentence is grammatically correct?". "options" are 4 complete sentences; exactly one is correct and the other three each contain one realistic error from this lesson.
3. "error-correction": "question" is "Which part of the sentence contains the error?". "prompt" is the full sentence split into exactly 4 parts with " | " between them. "options" are those same 4 parts, in order, copied exactly. "answer" is the part that contains the error.

STRICT RULES
- Every question must have exactly ONE answer that is clearly correct under standard British or American academic English. If a native-speaking examiner could defend a second option, rewrite the question.
- "answer" must be copied character-for-character from "options".
- Distractors must be plausible and reflect real learner mistakes, not nonsense.
- Use natural, realistic English that a strong IELTS candidate would actually write. No childish or textbook-robotic sentences.
- Do not test vocabulary, spelling or punctuation unless it is the grammar point of this lesson.
- No two questions may test the same sentence or the same exact point in the same way.
- Do not number options and do not prefix them with letters.
${recent.length ? `- The learner has already seen these questions. Do NOT reuse them or close paraphrases:\n${recent.map((q) => `  • ${q}`).join('\n')}` : ''}

EXPLANATIONS
"explanation" is 1-2 short sentences in natural, conversational Bangla, the way a friendly Bangladeshi teacher would explain it in class. Keep grammar terms (Subject, Verb, Clause, Present Perfect, Article, etc.) and the key English words in English. Say why the answer is right and, where useful, why the most tempting wrong option fails. Do not translate word-for-word from English.

OTHER FIELDS
"level" is "easy", "medium" or "hard".
"context" is a short label: "IELTS Task 1", "IELTS Task 2", "Academic" or "General".

Return ONLY a JSON array of ${AI_SET_SIZE} objects.`
}

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      type: { type: 'STRING' },
      question: { type: 'STRING' },
      prompt: { type: 'STRING' },
      options: { type: 'ARRAY', items: { type: 'STRING' } },
      answer: { type: 'STRING' },
      explanation: { type: 'STRING' },
      level: { type: 'STRING' },
      context: { type: 'STRING' },
    },
    required: ['type', 'question', 'options', 'answer', 'explanation', 'level'],
  },
} as const

function buildBody(prompt: string, includeThinkingConfig: boolean) {
  return {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      // High enough that consecutive generations differ; the validator below
      // catches the occasional malformed item this produces.
      temperature: 1,
      topP: 0.95,
      // 3.x models are thinking models and reasoning tokens count against this.
      // Bangla explanations are also token-heavy, so leave plenty of headroom.
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      ...(includeThinkingConfig ? { thinkingConfig: { thinkingLevel: 'low' } } : {}),
    },
  }
}

// ---------------------------------------------------------------------------
// Parsing / validation
// ---------------------------------------------------------------------------

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

  for (const [open, close] of [
    ['[', ']'],
    ['{', '}'],
  ] as const) {
    const start = trimmed.indexOf(open)
    const end = trimmed.lastIndexOf(close)
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        // try the next shape
      }
    }
  }

  return null
}

const ALLOWED_TYPES: QuestionType[] = ['multiple-choice', 'choose-correct-sentence', 'error-correction']

/** Strips "A) ", "b. ", "(c) " style prefixes some models add despite instructions. */
function cleanOption(option: string): string {
  return option.replace(/^\s*\(?[A-Da-d][).:]\s+/, '').trim()
}

function toLevel(value: unknown): Question['level'] {
  return value === 'easy' || value === 'hard' ? value : 'medium'
}

function normalizeQuestions(raw: unknown, moduleId: number, avoid: string[]): Question[] {
  const payload = (() => {
    if (Array.isArray(raw)) return raw
    if (raw && typeof raw === 'object') {
      const candidate = raw as Record<string, unknown>
      for (const key of ['questions', 'data', 'items']) {
        if (Array.isArray(candidate[key])) return candidate[key] as unknown[]
      }
    }
    return []
  })()

  const seen = new Set(avoid.map(normalize))
  const batch = Date.now().toString(36)

  return payload
    .flatMap((item, index): Question[] => {
      if (!item || typeof item !== 'object') return []
      const entry = item as Record<string, unknown>

      const type = ALLOWED_TYPES.find((t) => t === entry.type) ?? 'multiple-choice'
      const question = String(entry.question ?? '').trim()
      const prompt = typeof entry.prompt === 'string' ? entry.prompt.trim() : ''
      const explanation = String(entry.explanation ?? '').trim()

      const options = Array.isArray(entry.options)
        ? entry.options.map((o) => cleanOption(String(o))).filter(Boolean)
        : []
      // Duplicate options would make two buttons share one correct state.
      if (new Set(options.map(normalize)).size !== options.length) return []
      if (options.length < 3 || options.length > 5) return []

      // The answer has to be one of the options, otherwise grading is impossible.
      const rawAnswer = cleanOption(String(entry.answer ?? ''))
      const answer =
        options.find((o) => o === rawAnswer) ??
        options.find((o) => normalize(o) === normalize(rawAnswer))
      if (!question || !answer || !explanation) return []

      if (type === 'error-correction' && !prompt) return []

      const stem = normalize(`${question} ${prompt}`)
      if (seen.has(stem)) return []
      seen.add(stem)

      return [
        {
          id: `ai-m${moduleId}-${batch}-${index + 1}`,
          moduleId,
          type,
          question,
          prompt: prompt || undefined,
          // Error-correction options mirror the sentence order, so only shuffle the others.
          // Shuffling also corrects models that habitually put the answer first.
          options: type === 'error-correction' ? options : shuffle(options),
          answer,
          explanation,
          source: 'ai',
          level: toLevel(entry.level),
          context: typeof entry.context === 'string' ? entry.context.trim() || undefined : undefined,
        },
      ]
    })
    .slice(0, AI_SET_SIZE)
}

function describeFailure(status: number, errorText: string): string {
  const lower = errorText.toLowerCase()

  if (status === 404) {
    return 'The Gemini model we picked is no longer available. Try again and a working model will be detected automatically.'
  }

  if (status === 429 || /quota|rate limit|limit reached|exceeded|too many requests/.test(lower)) {
    return 'Your Gemini key has hit its usage limit for now. Wait a minute and try again.'
  }

  if (status === 401 || status === 403 || /invalid api key|api key not valid/.test(lower)) {
    return 'Gemini rejected the API key. Check it in Settings, including any key restrictions in Google AI Studio.'
  }

  return `Gemini could not complete the request (error ${status}). Please try again.`
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a fresh, lesson-specific practice set. Never throws: failures come
 * back as { ok: false, message } so the caller can keep the current set.
 */
export async function generateAiPractice(request: AiPracticeRequest): Promise<AiPracticeResult> {
  const apiKey = request.apiKey.trim()
  if (!apiKey) {
    return { ok: false, message: 'Add a Gemini API key in Settings to generate AI practice questions.' }
  }

  try {
    const resolution = await resolveModel(apiKey)

    if (!resolution.ok) {
      if (resolution.status === 0) {
        return { ok: false, message: 'Could not reach Gemini. Check your internet connection and try again.' }
      }
      if (resolution.status === 400 || resolution.status === 401 || resolution.status === 403) {
        return {
          ok: false,
          message: 'Gemini rejected the API key. Check it in Settings, including any key restrictions in Google AI Studio.',
        }
      }
      return { ok: false, message: 'No Gemini models are available for this API key.' }
    }

    const model = resolution.model
    const url = `${API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
    const prompt = buildPrompt(request)

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

      if (includeThinkingConfig && unknownField) continue
      break
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 0
      // A 404 here means the cached model was retired between sessions.
      // Drop the cache so the next attempt re-detects a live model.
      if (status === 404) clearCachedModel()
      return { ok: false, message: describeFailure(status, errorText) }
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        finishReason?: string
        content?: { parts?: Array<{ text?: string; thought?: boolean }> }
      }>
    }

    const candidate = data?.candidates?.[0]
    const content =
      candidate?.content?.parts
        ?.filter((part) => !part.thought)
        .map((part) => part.text ?? '')
        .join('') ?? ''

    if (!content.trim()) {
      return {
        ok: false,
        message:
          candidate?.finishReason === 'MAX_TOKENS'
            ? 'Gemini ran out of space before finishing the questions. Please try again.'
            : 'Gemini returned an empty response. Please try again.',
      }
    }

    const questions = normalizeQuestions(parseJsonPayload(content), request.module.id, request.avoid ?? [])

    if (questions.length < MIN_USABLE) {
      return {
        ok: false,
        message: 'Gemini’s questions did not pass our quality checks this time. Please try again.',
      }
    }

    return { ok: true, questions, model }
  } catch (error) {
    console.error('AI practice generation failed:', error)
    return { ok: false, message: 'Something went wrong while generating questions. Please try again.' }
  }
}
