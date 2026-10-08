import type { Plan, UserRecord } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'

/*
 * Payment provider boundary (Phase 1H stub). No provider is chosen yet
 * (section 34 of the project context: Bangladesh merchant availability,
 * international cards, subscriptions, webhooks). When one is:
 * - implement PaymentProvider for it;
 * - add POST /api/payments/checkout (signed in) and a webhook route that
 *   reads the raw body, calls verifyWebhook, and only then grants the plan
 *   through EntitlementsService.grantPlan with the period end as expiry.
 * The frontend's "payment succeeded" page must never unlock anything.
 */

export interface CheckoutSession {
  /** Where to send the browser to pay. */
  url: string
  providerReference: string
}

export interface PaymentEvent {
  type: 'subscription_active' | 'subscription_ended'
  userId: string
  plan: Plan
  /** End of the paid period; the plan's expiry. */
  periodEnd: Date | null
  providerReference: string
}

export interface PaymentProvider {
  readonly name: string
  createCheckout(user: UserRecord, plan: Exclude<Plan, 'free'>): Promise<CheckoutSession>
  /** Verifies the provider's signature over the raw body. Returns null for events we do not handle; throws if the signature is invalid. */
  verifyWebhook(rawBody: Buffer, headers: Record<string, string | undefined>): Promise<PaymentEvent | null>
}

const notConfigured = () => new AppError(503, 'payments_not_configured', 'Payments are not available yet')

/** The only implementation for now: every call answers 503. */
export const unconfiguredPaymentProvider: PaymentProvider = {
  name: 'none',
  createCheckout: async () => Promise.reject(notConfigured()),
  verifyWebhook: async () => Promise.reject(notConfigured()),
}
