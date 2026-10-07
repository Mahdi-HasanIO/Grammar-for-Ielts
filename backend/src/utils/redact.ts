/** Removes credentials from any MongoDB connection string inside a message: mongodb://user:pass@host → mongodb://***@host. */
export function redactConnectionStrings(message: string): string {
  return message.replace(/(mongodb(?:\+srv)?:\/\/)[^@\s/]+@/gi, '$1***@')
}
