import type { Env } from '../config/env.js'
import type { Logger } from '../config/logger.js'

export interface EmailMessage {
  to: string
  subject: string
  /** Plain text body. May contain one-time links, so it is a secret. */
  text: string
}

export interface Mailer {
  /** Resolves once the provider accepted the message; rejects if it could not be sent. */
  send(message: EmailMessage): Promise<void>
}

/** l***@example.com: enough to tell recipients apart in logs without storing the address. */
export const maskEmail = (email: string) => email.replace(/^(.)[^@]*/, '$1***')

/**
 * Writes emails to the log instead of sending them: the default, for local
 * development and tests. The body (which holds one-time links) is logged
 * only when `includeContent` is true, which createMailer sets outside
 * production; in production only the subject and a masked recipient appear.
 */
export function createLogMailer({ logger, includeContent }: { logger: Logger; includeContent: boolean }): Mailer {
  return {
    async send({ to, subject, text }) {
      if (includeContent) logger.info({ mail: { to, subject, text } }, 'Email (log transport, not sent)')
      else logger.info({ mail: { to: maskEmail(to), subject } }, 'Email (log transport, not sent; content omitted in production)')
    },
  }
}

export interface ResendOptions {
  apiKey: string
  from: string
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
}

export const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/**
 * Sends through the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * Errors carry only the HTTP status, never the API key or the message body.
 */
export function createResendMailer({ apiKey, from, fetch = globalThis.fetch, timeoutMs = 10_000 }: ResendOptions): Mailer {
  return {
    async send({ to, subject, text }) {
      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [to], subject, text }),
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!response.ok) throw new Error(`Resend API responded with HTTP ${response.status}`)
    },
  }
}

/** The transport selected by MAIL_TRANSPORT. */
export function createMailer(env: Pick<Env, 'NODE_ENV' | 'MAIL_TRANSPORT' | 'MAIL_FROM' | 'RESEND_API_KEY'>, logger: Logger): Mailer {
  if (env.MAIL_TRANSPORT === 'resend') {
    // loadEnv guarantees both are set for this transport.
    return createResendMailer({ apiKey: env.RESEND_API_KEY ?? '', from: env.MAIL_FROM ?? '' })
  }
  return createLogMailer({ logger, includeContent: env.NODE_ENV !== 'production' })
}
