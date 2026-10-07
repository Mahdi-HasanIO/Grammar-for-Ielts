import { z } from 'zod'

/**
 * Example reusable schema: ?page=&limit= for list endpoints. Query values
 * arrive as strings, so they are coerced to integers and given defaults.
 * No route uses it yet; it is the pattern for future list endpoints.
 */
export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type PaginationQuery = z.output<typeof paginationQuery>
