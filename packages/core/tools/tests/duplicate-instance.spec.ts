import { describe, expect, it, vi } from 'vitest'
import { assertSchedulerProtocol, TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION } from '../src/index.ts'

/**
 * Regression test for
 * https://github.com/deepseek-ai/deepseek-harness/discussions/1697
 *
 * A profile with `nodeLinker: hoisted` can install a second physical copy of
 * `@deepseek-ai/dsh-tools` (same version) next to a plugin, shadowing the
 * host copy for bare-specifier resolution. `Symbol()` identity is per module
 * instance, so a ToolRuntime created by the shadowed copy was invisible to
 * agent-loop's scheduler lookup and every tool call crashed with
 * `Cannot read properties of undefined (reading 'prepare')`.
 *
 * `Symbol.for` keys live in the shared global registry, so all module
 * instances in one process agree on the scheduler entry point while the
 * namespaced key keeps the collision surface negligible.
 */
describe('TOOL_RUNTIME_SCHEDULER', () => {
  it('keeps the same identity across duplicate module instances', async () => {
    vi.resetModules()
    const first = await import('../src/index.ts')
    vi.resetModules()
    const second = await import('../src/index.ts?duplicate-instance=1')

    expect(first.TOOL_RUNTIME_SCHEDULER as symbol).toBe(second.TOOL_RUNTIME_SCHEDULER as symbol)
  })

  it('a scheduler written by one instance is readable through another instance symbol', async () => {
    vi.resetModules()
    const first = await import('../src/index.ts')
    vi.resetModules()
    const second = await import('../src/index.ts?duplicate-instance=2')

    const registry: Record<symbol, { prepare: () => string }> = {}
    registry[first.TOOL_RUNTIME_SCHEDULER as symbol] = { prepare: () => 'scheduled' }

    const scheduler = registry[second.TOOL_RUNTIME_SCHEDULER as symbol]
    expect(scheduler?.prepare()).toBe('scheduled')
  })

  it('exposes a stable scheduler protocol version', () => {
    expect(TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION).toBe(1)
  })

  it('accepts a scheduler whose protocol version matches', () => {
    const scheduler = { protocolVersion: TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION, prepare: () => 'ok' }
    expect(assertSchedulerProtocol(scheduler).prepare()).toBe('ok')
  })

  it('rejects a missing scheduler with an actionable duplicate-instance error', () => {
    expect(() => assertSchedulerProtocol(undefined)).toThrow(/duplicate @deepseek-ai\/dsh-tools instance/)
  })

  it('rejects a version-skewed scheduler instead of running an incompatible protocol', () => {
    const skewed = { protocolVersion: TOOL_RUNTIME_SCHEDULER_PROTOCOL_VERSION + 1, prepare: () => 'old' }
    expect(() => assertSchedulerProtocol(skewed)).toThrow(/protocol version mismatch/)
  })
})
