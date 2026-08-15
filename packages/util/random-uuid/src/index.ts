/**
 * Browser-safe UUID generation for the DeepSeek Harness.
 *
 * `crypto.randomUUID()` is only exposed in secure contexts (HTTPS or
 * localhost). When the Web UI is served over plain HTTP on a LAN or Tailscale
 * IP, `crypto.randomUUID` is `undefined` and any RPC/attachment id minting
 * throws `TypeError: crypto.randomUUID is not a function`. This package
 * prefers the native API and falls back to an RFC 4122 v4 generator backed by
 * `crypto.getRandomValues()`, which browsers expose on insecure origins.
 *
 * @module @deepseek-ai/dsh-random-uuid
 */

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u

/**
 * Generate an RFC 4122 version 4 UUID from `crypto.getRandomValues()`.
 * @returns a UUID string valid in both secure and insecure contexts.
 */
function randomUuidFromGetRandomValues(): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setUint8(6, (view.getUint8(6) & 0x0f) | 0x40)
  view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80)
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/**
 * Mint an RFC 4122 version 4 UUID in any runtime context.
 *
 * Uses `crypto.randomUUID()` when available (secure contexts and Node.js >= 19)
 * and otherwise falls back to a `getRandomValues()`-backed generator so the
 * Web UI keeps working when reached through plain-HTTP LAN origins.
 */
export function randomUuid(): string {
  const randomUUID = globalThis.crypto?.randomUUID
  if (typeof randomUUID === 'function') {
    return randomUUID.call(globalThis.crypto)
  }
  return randomUuidFromGetRandomValues()
}

/** Export the matcher for callers that want to assert the produced shape. */
export const UUID_V4_PATTERN = UUID_V4
