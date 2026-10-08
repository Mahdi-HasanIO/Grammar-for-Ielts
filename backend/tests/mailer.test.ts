import { describe, expect, it, vi } from 'vitest'
import { createLogMailer, createMailer, createResendMailer, maskEmail, RESEND_ENDPOINT } from '../src/services/mailer.js'
import { capturingLogger } from './helpers.js'

const MESSAGE = { to: 'learner@example.com', subject: 'Reset your password', text: 'Open https://app.example.com/reset-password#token=SECRET123' }

describe('log transport', () => {
  it('logs the full message in development and test, so the link can be used locally', async () => {
    const { logger, lines } = capturingLogger()
    await createMailer({ NODE_ENV: 'test', MAIL_TRANSPORT: 'log' }, logger).send(MESSAGE)
    expect(JSON.parse(lines[0] ?? '{}')).toMatchObject({ mail: MESSAGE })
  })

  it('in production logs only the subject and a masked recipient, never the body or token', async () => {
    const { logger, lines } = capturingLogger()
    await createMailer({ NODE_ENV: 'production', MAIL_TRANSPORT: 'log' }, logger).send(MESSAGE)
    const entry = JSON.parse(lines[0] ?? '{}')
    expect(entry.mail).toEqual({ to: 'l***@example.com', subject: 'Reset your password' })
    expect(lines.join('\n')).not.toMatch(/SECRET123|token=|learner@/)
  })

  it('never fails', async () => {
    const { logger } = capturingLogger()
    await expect(createLogMailer({ logger, includeContent: false }).send(MESSAGE)).resolves.toBeUndefined()
  })

  it('masks addresses keeping the first letter and the domain', () => {
    expect(maskEmail('learner@example.com')).toBe('l***@example.com')
    expect(maskEmail('a@b.co')).toBe('a***@b.co')
  })
})

describe('resend transport (fetch adapter; not tested against the real service)', () => {
  it('posts the message to the Resend API with the key as a bearer token', async () => {
    const fetch = vi.fn(async () => new Response('{"id":"x"}', { status: 200 }))
    await createResendMailer({ apiKey: 're_key', from: 'App <no-reply@example.com>', fetch }).send(MESSAGE)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(RESEND_ENDPOINT)
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ Authorization: 'Bearer re_key', 'Content-Type': 'application/json' })
    expect(JSON.parse(String(init.body))).toEqual({ from: 'App <no-reply@example.com>', to: ['learner@example.com'], subject: MESSAGE.subject, text: MESSAGE.text })
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('rejects on a non-2xx response with only the status, never the key or body', async () => {
    const fetch = vi.fn(async () => new Response('{"message":"invalid key re_key"}', { status: 401 }))
    const send = createResendMailer({ apiKey: 're_key', from: 'a@b.co', fetch }).send(MESSAGE)
    await expect(send).rejects.toThrow('Resend API responded with HTTP 401')
    await send.catch((error: Error) => expect(error.message).not.toMatch(/re_key|SECRET123/))
  })

  it('is chosen by MAIL_TRANSPORT=resend', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
    try {
      const { logger, lines } = capturingLogger()
      await createMailer({ NODE_ENV: 'production', MAIL_TRANSPORT: 'resend', RESEND_API_KEY: 're_key', MAIL_FROM: 'a@b.co' }, logger).send(MESSAGE)
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(lines).toEqual([])
    } finally {
      fetch.mockRestore()
    }
  })
})
