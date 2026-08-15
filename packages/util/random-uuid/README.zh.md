# @deepseek-ai/dsh-random-uuid

面向 DeepSeek Harness 的浏览器安全 RFC 4122 v4 UUID 生成器。

`crypto.randomUUID()` 只在安全上下文（HTTPS 或 localhost）中可用。当 Web UI
通过明文 HTTP 在局域网或 Tailscale IP 上访问时，`crypto.randomUUID` 为
`undefined`，任何 id 生成都会抛出
`TypeError: crypto.randomUUID is not a function`。本包优先使用原生 API，
并回退到基于 `crypto.getRandomValues()` 的 RFC 4122 v4 生成器——浏览器在
非安全上下文中仍会暴露该 API。

```ts
import { randomUuid } from '@deepseek-ai/dsh-random-uuid'

const id = randomUuid() // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

所有浏览器侧 id 生成（RPC id、草稿附件 id、实例 token）都应使用该工具，
让 Web UI 在纯 HTTP 局域网部署下不崩溃。
