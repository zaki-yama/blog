# Google Analytics Setup Guide

## Prerequisites

This project includes Google Analytics 4 integration implemented directly in `src/layouts/BaseLayout.astro`, using the standard `gtag.js` snippet (no third-party framework package required).

## How it works

This is a fully static Astro site (`output: 'static'` in `astro.config.ts`, no server adapter). `astro build` runs entirely at build time — there is no server-side runtime that could read environment variables per request. Because of this:

- The GA4 Measurement ID is defined as a **build-time constant**: `SITE_CONFIG.analytics.gaId` in [`src/lib/site-config.ts`](../src/lib/site-config.ts).
- `src/layouts/BaseLayout.astro` only enables it when `import.meta.env.PROD` is `true`:
  ```ts
  const GA_ID = import.meta.env.PROD && SITE_CONFIG.analytics.gaId;
  ```
  This means `pnpm dev` and `astro preview` never load the GA script, so local/dev traffic is never sent to the production GA property.
- The value in `wrangler.jsonc`'s `vars` field is **not** used — Cloudflare Workers `vars` are runtime bindings for a server-side Worker script, and this project deploys pure static assets (no `main` field / Worker script in `wrangler.jsonc`). Setting a value there has no effect on the built HTML.

## Changing the Measurement ID

Edit `SITE_CONFIG.analytics.gaId` in `src/lib/site-config.ts` directly, then rebuild and redeploy (`pnpm run deploy`). Since a GA4 Measurement ID is not sensitive (it is already visible in the shipped HTML of any page that loads it), there is no need to keep it out of source control.

## Verification

1. Build for production:
   ```bash
   pnpm build
   ```
2. Check that the GA snippet was inlined:
   ```bash
   grep -c "googletagmanager.com/gtag/js" dist/index.html
   ```
   Should return a count greater than `0`.
3. After deploying, open the site in a browser, open DevTools → Network tab, and look for requests to `googletagmanager.com` / `google-analytics.com`.

## Background: why this isn't an environment variable

Earlier (Next.js era, before the Astro migration), this project used `NEXT_PUBLIC_GA_ID` read via `process.env` inside a Next.js Server Component, deployed on Cloudflare Workers via OpenNext. In that setup, `process.env` was evaluated **at request time**, and OpenNext's Cloudflare adapter shimmed the Workers runtime's `vars` (from `wrangler.jsonc`) into `process.env` on every request — so setting the value in `wrangler.jsonc` was sufficient.

After migrating to Astro static output, that runtime shim no longer exists. `import.meta.env.PUBLIC_*` variables in Astro/Vite are resolved once, at build time, from the environment the build process runs in (shell env vars or `.env` files) — never from `wrangler.jsonc`. This mismatch was the root cause of GA silently not firing in production after the migration. See `docs/adrs/005-static-build-public-env-vars.md` for the full decision record.
