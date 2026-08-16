import { describe, expect, it } from 'vitest'
import { fastFailHint } from '../src/fast-fail.ts'

describe('fastFailHint', () => {
  it('decodes the restricted-token init-time fast-fail family', () => {
    expect(fastFailHint(0xC0000142)).toContain('STATUS_DLL_INIT_FAILED')
    expect(fastFailHint(0xC0000409)).toContain('STATUS_STACK_BUFFER_OVERRUN')
    expect(fastFailHint(0xC0000005)).toContain('STATUS_ACCESS_VIOLATION')
    expect(fastFailHint(0xC0000142)).toContain('restricted-token sandbox')
    expect(fastFailHint(0xC0000142)).toContain('1613')
  })

  it('returns undefined for ordinary exit codes', () => {
    expect(fastFailHint(0)).toBeUndefined()
    expect(fastFailHint(1)).toBeUndefined()
    expect(fastFailHint(127)).toBeUndefined()
  })
})
