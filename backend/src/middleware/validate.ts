import type { RequestHandler, Response } from 'express'
import type { z } from 'zod'
import { AppError } from '../utils/AppError.js'

export interface RequestSchemas {
  params?: z.ZodType
  query?: z.ZodType
  body?: z.ZodType
}

export type Validated<S extends RequestSchemas> = {
  [K in keyof S]: S[K] extends z.ZodType ? z.output<S[K]> : never
}

export interface ValidationIssue {
  location: 'params' | 'query' | 'body'
  path: string
  message: string
}

const PARTS = ['params', 'query', 'body'] as const

/**
 * Validates params, query and/or body with Zod. On success the parsed (and
 * coerced) values are stored for the handler: read them with getValidated().
 * On failure it responds 400 { error: { code: 'validation_error', details } }.
 * Express 5 makes req.query read-only, so parsed values are not written back
 * onto the request.
 */
export function validate<S extends RequestSchemas>(schemas: S): RequestHandler {
  return (req, res, next) => {
    const issues: ValidationIssue[] = []
    const validated: Record<string, unknown> = {}
    for (const part of PARTS) {
      const schema = schemas[part]
      if (!schema) continue
      const result = schema.safeParse(req[part])
      if (result.success) {
        validated[part] = result.data
      } else {
        for (const issue of result.error.issues) {
          issues.push({ location: part, path: issue.path.map(String).join('.'), message: issue.message })
        }
      }
    }
    if (issues.length) {
      next(new AppError(400, 'validation_error', 'Request validation failed', { details: issues }))
      return
    }
    res.locals.validated = validated
    next()
  }
}

/** The values validated by validate() for this request. */
export function getValidated<S extends RequestSchemas>(res: Response): Validated<S> {
  return res.locals.validated as Validated<S>
}
