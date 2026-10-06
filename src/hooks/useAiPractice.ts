import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lesson, ModuleMeta, Question } from '@/types'
import { contentService, useContent } from '@/services/content'
// Bundled with the lesson page that uses this hook, so the built-in set is available immediately.
import '@/services/content/questionPack'
import { generateAiPractice, type AiDifficulty } from '@/utils/aiPractice'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

/** How many past question stems per module are sent to the model as "don't repeat". */
const HISTORY_LIMIT = 30

type Status = 'idle' | 'loading' | 'ready' | 'error'

interface StoredSet {
  questions: Question[]
  generation: number
}

const setKey = (moduleId: number) => `${STORAGE_KEYS.aiSetPrefix}${moduleId}`
const historyKey = (moduleId: number) => `${STORAGE_KEYS.aiHistoryPrefix}${moduleId}`

/* The current AI set lives in sessionStorage: it survives navigating away and
 * back within a visit, but a new visit starts with a fresh generation. */
function readSessionSet(moduleId: number): StoredSet | null {
  try {
    const raw = globalThis.sessionStorage?.getItem(setKey(moduleId))
    return raw ? (JSON.parse(raw) as StoredSet) : null
  } catch {
    return null
  }
}

function writeSessionSet(moduleId: number, value: StoredSet): void {
  try {
    globalThis.sessionStorage?.setItem(setKey(moduleId), JSON.stringify(value))
  } catch {
    // storage full or unavailable — the set just won't persist across navigation
  }
}

function readKey(): string {
  return readStorage<string>(STORAGE_KEYS.geminiApiKey, '').trim()
}

export function useAiPractice(module: ModuleMeta | undefined, lesson: Lesson | undefined) {
  const moduleId = module?.id ?? 0
  const [hasKey, setHasKey] = useState(() => Boolean(readKey()))
  const [aiSet, setAiSet] = useState<StoredSet | null>(() => readSessionSet(moduleId))
  const [status, setStatus] = useState<Status>(() => (readSessionSet(moduleId) ? 'ready' : 'idle'))
  const [message, setMessage] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<AiDifficulty>('mixed')
  const requestId = useRef(0)

  // Reset when the learner moves to another module.
  useEffect(() => {
    requestId.current += 1
    const stored = readSessionSet(moduleId)
    setAiSet(stored)
    setStatus(stored ? 'ready' : 'idle')
    setMessage(null)
    setHasKey(Boolean(readKey()))
  }, [moduleId])

  const generate = useCallback(
    async (level: AiDifficulty = difficulty) => {
      if (!module) return
      const apiKey = readKey()
      setHasKey(Boolean(apiKey))
      if (!apiKey) {
        setStatus('error')
        setMessage('Add a free Gemini API key in Settings to generate AI practice questions.')
        return
      }

      const id = ++requestId.current
      setStatus('loading')
      setMessage(null)

      const avoid = readStorage<string[]>(historyKey(module.id), [])
      const result = await generateAiPractice({ module, lesson, apiKey, difficulty: level, avoid })

      // A newer request (or a module change) superseded this one.
      if (id !== requestId.current) return

      if (!result.ok) {
        setStatus('error')
        setMessage(result.message)
        return
      }

      const next: StoredSet = {
        questions: result.questions,
        generation: (aiSet?.generation ?? 0) + 1,
      }
      setAiSet(next)
      writeSessionSet(module.id, next)
      writeStorage(
        historyKey(module.id),
        [...avoid, ...result.questions.map((q) => q.prompt ? `${q.question} ${q.prompt}` : q.question)].slice(
          -HISTORY_LIMIT,
        ),
      )
      setStatus('ready')
    },
    [module, lesson, difficulty, aiSet?.generation],
  )

  const staticQuestions = useContent(contentService.getPracticeQuestions(moduleId))
  const usingAi = Boolean(aiSet?.questions.length)

  return {
    /** The set currently on screen: AI questions when available, otherwise the built-in set. */
    questions: usingAi ? aiSet!.questions : staticQuestions,
    usingAi,
    generation: aiSet?.generation ?? 0,
    status,
    message,
    hasKey,
    difficulty,
    setDifficulty,
    generate,
  }
}
