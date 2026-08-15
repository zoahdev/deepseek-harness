import { afterEach, describe, expect, it, vi } from 'vitest'
import { randomUuid, UUID_V4_PATTERN } from '@deepseek-ai/dsh-random-uuid'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('randomUuid', () => {
  it('returns a well-formed RFC 4122 v4 UUID', () => {
    expect(randomUuid()).toMatch(UUID_V4_PATTERN)
  })

  it('prefers crypto.randomUUID when the API is exposed', () => {
    const spy = vi
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('00000000-0000-4000-8000-000000000000')
    expect(randomUuid()).toBe('00000000-0000-4000-8000-000000000000')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('falls back to getRandomValues when randomUUID is undefined (insecure context)', () => {
    const original = globalThis.crypto.randomUUID
    Object.defineProperty(globalThis.crypto, 'randomUUID', { value: undefined, configurable: true })
    try {
      for (let i = 0; i < 100; i++) {
        expect(randomUuid()).toMatch(UUID_V4_PATTERN)
      }
    } finally {
      Object.defineProperty(globalThis.crypto, 'randomUUID', {
        value: original,
        configurable: true,
      })
    }
  })

  it('mints unique ids across many calls', () => {
    const seen = new Set(Array.from({ length: 1000 }, () => randomUuid()))
    expect(seen.size).toBe(1000)
  })
})
