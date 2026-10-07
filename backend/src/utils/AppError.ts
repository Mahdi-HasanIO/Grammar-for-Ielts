/**
 * An error with an HTTP status and a stable machine-readable code. Throw or
 * pass it to next() from any route; the error middleware turns it into
 * { error: { code, message, details? } }.
 */
export class AppError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { cause: options.cause })
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = options.details
  }
}
