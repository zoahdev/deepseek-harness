# @deepseek-ai/dsh-random-uuid

Browser-safe RFC 4122 v4 UUID generator for the DeepSeek Harness.

`crypto.randomUUID()` is only exposed in secure contexts (HTTPS or localhost).
When the Web UI is served over plain HTTP on a LAN or Tailscale IP,
`crypto.randomUUID` is `undefined` and id minting throws
`TypeError: crypto.randomUUID is not a function`. This package prefers the
native API and falls back to a `crypto.getRandomValues()`-backed RFC 4122 v4
generator, which browsers expose on insecure origins.

```ts
import { randomUuid } from '@deepseek-ai/dsh-random-uuid'

const id = randomUuid() // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

Use this helper for every browser-facing id mint (RPC ids, draft attachment
ids, instance tokens) so the Web UI survives plain-HTTP LAN deployments.
