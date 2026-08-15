/**
 * Startup runtime floor. `@deepseek-ai/dsh` depends on
 * `node:module.stripTypeScriptTypes` (code-runtime worker), which is present on
 * Node >= 22.6 but missing on older Node and on non-Node runtimes such as bun.
 * Without this gate those surfaces fail with a bare
 * `Export named 'stripTypeScriptTypes' not found in module 'node:module'`
 * (discussion #2081) instead of an actionable message.
 * @module @deepseek-ai/dsh/runtime-check
 */

/** Mirrors the `engines.node` range declared in the root `package.json`. */
export function nodeVersionSupported(version: string): boolean {
  const match = /^v?(\d+)\.(\d+)\./.exec(version.trim())
  if (match === null) return false
  const major = Number(match[1])
  const minor = Number(match[2])
  // ^22.19.0 -> 22.19.0 <= v < 23; >=24.0.0 -> 24+. Node 23 is intentionally
  // excluded (non-LTS bridge train).
  if (major === 22) return minor >= 19
  return major >= 24
}

/** Human-readable explanation when the current runtime is unsupported, else `null`. */
export function runtimeSupportError(version = process.version): string | null {
  if (nodeVersionSupported(version)) return null
  const reported = version === '' || version === undefined ? 'unknown' : version
  return `DeepSeek Harness requires Node.js ^22.19.0 || >=24.0.0 (running ${reported}). `
    + 'Older Node and non-Node runtimes (e.g. bun) lack node:module.stripTypeScriptTypes and are not supported.'
}
