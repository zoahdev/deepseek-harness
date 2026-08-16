/**
 * Windows NTSTATUS fast-fail exit-code decoding. A child that dies at init
 * under the restricted-token runner (Cygwin/MSYS, V8) produces no output and
 * an opaque NTSTATUS; decoding it here converts a first-run Windows blocker
 * into a diagnosis (#1613).
 *
 * @module dsh-sandbox-windows-acl/fast-fail
 */

const FAST_FAIL_CODES: ReadonlyMap<number, string> = new Map([
  [0xC0000142, 'STATUS_DLL_INIT_FAILED'],
  [0xC0000409, 'STATUS_STACK_BUFFER_OVERRUN'],
  [0xC0000005, 'STATUS_ACCESS_VIOLATION'],
])

/** A human-readable hint for a known fast-fail exit code, else `undefined`. */
export function fastFailHint(exitCode: number): string | undefined {
  const name = FAST_FAIL_CODES.get(exitCode)
  if (name === undefined) return undefined
  return `${name} (${exitCode}) — the child fast-failed at init with no output. `
    + 'The Windows restricted-token sandbox can break programs that need init-time kernel objects/privileges '
    + '(Cygwin/MSYS, V8). Consider danger-full-access or a per-tool sandbox override (discussion #1613).'
}
