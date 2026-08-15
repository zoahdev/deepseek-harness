import { describe, expect, it } from 'vitest'
import { nodeVersionSupported, runtimeSupportError } from '../src/runtime-check.ts'

describe('nodeVersionSupported', () => {
  it('accepts the declared Node floor and newer trains', () => {
    expect(nodeVersionSupported('v22.19.0')).toBe(true)
    expect(nodeVersionSupported('v22.25.1')).toBe(true)
    expect(nodeVersionSupported('v24.3.0')).toBe(true)
    expect(nodeVersionSupported('v25.0.0')).toBe(true)
  })

  it('rejects Node 22 below 22.19 and the Node 23 bridge train', () => {
    expect(nodeVersionSupported('v22.18.0')).toBe(false)
    expect(nodeVersionSupported('v22.6.0')).toBe(false)
    expect(nodeVersionSupported('v23.9.0')).toBe(false)
  })

  it('rejects non-Node runtimes such as bun', () => {
    expect(nodeVersionSupported('v1.3.0')).toBe(false)
    expect(nodeVersionSupported('')).toBe(false)
  })
})

describe('runtimeSupportError', () => {
  it('is null on a supported runtime', () => {
    expect(runtimeSupportError('v22.19.0')).toBeNull()
  })

  it('names the requirement and the failing runtime', () => {
    const message = runtimeSupportError('v1.3.0')
    expect(message).toContain('^22.19.0')
    expect(message).toContain('v1.3.0')
    expect(message).toContain('stripTypeScriptTypes')
  })
})
