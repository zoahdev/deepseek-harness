/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-random-uuid`.
 * @module @deepseek-ai/dsh-random-uuid/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-random-uuid'

/** Cordis companion plugin name. */
export const name = 'random-uuid-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: this pure utility owns no event stream or mutable runtime data; its value
 * algebra is enforced by unit tests.
 */
export const apply: InvariantInstaller = (_ctx: Context) => {
  // Reserved for future ownership checks; currently a no-op by design.
  void PACKAGE_NAME
}
/* jscpd:ignore-end */
