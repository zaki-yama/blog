# Astro 移行計画: Next.js → Astro

## Context

現在のブログは Next.js 15 + `@opennextjs/cloudflare` で構築されており、Markdown 記事が Worker JS バンドルに埋め込まれてしまう（現在 8.1MB raw / 2.2MB gzip）。記事増加とともに Cloudflare Workers Free プランの 3MB gzip 制限に近づく課題がある。

Astro に移行し `output: 'static'` を採用することで:
1. 記事コンテンツを Static Assets（HTML）として配信 → Worker JS 不要
2. Astro を実際に使ってみる（学習目的）

## 進め方

`astro-migration` ブランチを切り、同一ディレクトリ内で Next.js ファイルを Astro に置き換える。確認後 main にマージ。

---

## 移行後のアーキテクチャ

```
posts/*.md → astro build → dist/ (HTML + CSS + JS) → wrangler deploy → Cloudflare Workers (静的アセット配信)
```

Worker JS は不要になり、`wrangler.jsonc` の `main` フィールドを削除する。

---

## 実装ステップ

### Step 1: ブランチ作成・依存関係の入れ替え

```bash
git checkout -b astro-migration
```

**削除する依存関係:**
- `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `@next/third-parties`, `@opennextjs/cloudflare`
- `@vercel/og`
- 設定ファイル: `next.config.ts`, `open-next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`

**追加する依存関係:**
```bash
pnpm add astro @astrojs/react @astrojs/tailwind @astrojs/sitemap @astrojs/rss @astrojs/cloudflare
pnpm add satori @resvg/resvg-js
pnpm add -D @types/react @types/react-dom react react-dom  # React は peer dep として
```

> `react`/`react-dom` は `@astrojs/react` の peer dependency として必要

---

### Step 2: 新規ディレクトリ構造の作成

Next.js の `src/app/` を削除し、以下を作成:

```
src/
├── content/
│   ├── config.ts          ← Content Collections スキーマ
│   └── posts/             ← posts/ へのシンボリックリンク (ln -s ../../../posts src/content/posts)
├── layouts/
│   ├── BaseLayout.astro   ← layout.tsx に相当
│   └── PostLayout.astro   ← 記事ページレイアウト
├── pages/
│   ├── index.astro        ← ホームページ
│   ├── posts/
│   │   └── [id].astro     ← 記事詳細
│   ├── rss.xml.ts         ← RSS フィード
│   ├── robots.txt.ts      ← robots.txt（または public/robots.txt に静的配置）
│   └── og/
│       └── [id].png.ts    ← ビルド時 OG 画像生成
├── components/            ← 既存 React コンポーネントを移植
│   ├── Header.tsx
│   ├── SocialShareButtons.tsx
│   └── TableOfContents.tsx
└── styles/
    └── global.css         ← globals.css から移植
```

**削除するディレクトリ/ファイル:**
- `src/app/` (全体)
- `lib/posts.ts` (Content Collections で置き換え)
- `lib/rss.ts` (`@astrojs/rss` で置き換え)
- `lib/sitemap.ts` (`@astrojs/sitemap` で置き換え)
- `lib/meta-tags.ts` (Astro の `<head>` 管理に統合)

**残す lib ファイル (src/lib/ に移動):**
- `lib/site-config.ts` → `src/lib/site-config.ts`（`process.env.NEXT_PUBLIC_*` → `import.meta.env.PUBLIC_*` に変更）
- `lib/structured-data.ts` → `src/lib/structured-data.ts`（変更不要）
- `lib/cloudinary.ts` → `src/lib/cloudinary.ts`（admin 機能、将来対応）

---

### Step 3: 設定ファイル

**`astro.config.ts`:**
```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://blog.zaki-yama.dev',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',  // 既存の VSC Dark+ テーマに対応
      wrap: true,
    },
  },
});
```

> `output: 'static'` では `@astrojs/cloudflare` adapter は不要（純粋静的ファイル生成）

**`wrangler.jsonc` (更新):**
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "blog",
  "compatibility_date": "2025-03-01",
  "assets": {
    "directory": "./dist"
  },
  "routes": [{ "pattern": "blog.zaki-yama.dev", "custom_domain": true }],
  "vars": {
    "PUBLIC_SITE_URL": "https://blog.zaki-yama.dev",
    "PUBLIC_GA_ID": "G-WTRHNJ8JBX"
  }
}
```

変更点:
- `"main"` フィールドを**削除**（Worker JS 不要）
- `assets.directory` を `./dist` に変更
- `NEXT_PUBLIC_*` → `PUBLIC_*` に変更

**`package.json` スクリプト更新:**
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "astro build && wrangler deploy",
    "lint": "oxlint src",
    "format": "oxfmt src"
  }
}
```

---

### Step 4: Content Collections の設定

**`src/content/config.ts`:**
```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts };
```

シンボリックリンク:
```bash
ln -s ../../../posts src/content/posts
```

---

### Step 5: レイアウト (`src/layouts/BaseLayout.astro`)

Next.js の `layout.tsx` に相当。以下を担う:
- `<html>`, `<head>`, `<body>` の構造
- FOUC 対策インラインスクリプト（dark mode）
- Google Analytics スクリプト（`@next/third-parties` の代替として手動埋め込み）
- JSON-LD 構造化データ

FOUC 対策（`<head>` 内にブロッキングスクリプト）:
```html
<script is:inline>
  const theme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (theme === 'dark' || (!theme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

---

### Step 6: React コンポーネントの移植

**変更が必要な箇所のみ:**

| コンポーネント | 変更点 |
|---|---|
| `Header.tsx` | `import Link from 'next/link'` → `<a>` タグ、`'use client'` 削除 |
| `SocialShareButtons.tsx` | `'use client'` 削除のみ |
| `TableOfContents.tsx` | `'use client'` 削除のみ |

Astro のページで使用する際は `client:load` ディレクティブを付与:
```astro
<Header client:load />
<TableOfContents client:load headings={headings} />
<SocialShareButtons client:load url={url} title={title} />
```

---

### Step 7: ページの移行

**`src/pages/index.astro`** (ホームページ):
- `getCollection('posts')` で記事一覧取得
- `className` → `class`
- `<Link>` → `<a>`
- JSON-LD は `<script type="application/ld+json" set:html={json} />`

**`src/pages/posts/[id].astro`** (記事詳細):
- `getStaticPaths()` + `getCollection('posts')` で静的パス生成
- `post.render()` で Markdown → HTML 変換（remark パイプラインは Astro 組み込み）
- `<Content />` コンポーネントでレンダリング
- `TableOfContents` は DOM から見出し取得（既存実装がそのまま使える）

**`src/pages/rss.xml.ts`**:
- `@astrojs/rss` の `rss()` 関数を使用
- 既存の `lib/rss.ts` は不要

**Sitemap**:
- `@astrojs/sitemap` が自動生成（設定不要）

**`public/robots.txt`** (静的ファイルとして配置):
```
User-agent: *
Allow: /
Sitemap: https://blog.zaki-yama.dev/sitemap-index.xml
```

---

### Step 8: OG 画像のビルド時生成

**`src/pages/og/[id].png.ts`**:
- `satori` + `@resvg/resvg-js` で build time に PNG 生成
- 既存の `api/og/route.tsx` のターミナル風デザインを移植
- フォント（日本語対応）として Noto Sans JP を `public/fonts/` に配置

```typescript
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({ params: { id: post.slug }, props: { post } }));
}

export async function GET({ props }) {
  const fontData = await fetch('/fonts/NotoSansJP-Regular.ttf').then(r => r.arrayBuffer());
  const svg = await satori(/* デザイン */, {
    width: 1200, height: 630,
    fonts: [{ name: 'Noto Sans JP', data: fontData, weight: 400 }],
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
```

---

### Step 9: シンタックスハイライトの切り替え

現行の `rehype-prism-plus` + Prism CSS → Astro 組み込みの `shiki` に切り替え。

- `globals.css` から `.token.*`、`pre[class*='language-']` 等の Prism CSS を**削除**
- shiki はインラインスタイルで色を付けるため CSS 不要
- `.prose` スタイル群（見出し、リスト、テーブル、blockquote）は**維持**

---

### Step 10: 削除対象ファイル一覧

```
src/app/              (全体)
next.config.ts
open-next.config.ts
postcss.config.mjs
next-env.d.ts
cloudflare-env.d.ts   (wrangler が再生成)
lib/posts.ts
lib/rss.ts
lib/sitemap.ts
lib/meta-tags.ts
.open-next/           (ビルド成果物)
```

---

## スコープ外（将来対応）

- **admin ページ + Cloudinary 画像アップロード**: 開発専用機能のため本番に影響しない。別途 Node.js スクリプトとして切り出す。
- `og-test` ページ: 開発用のため移行不要

---

## 検証方法

1. `pnpm build` でビルドエラーがないことを確認
2. `pnpm preview` でローカル動作確認:
   - ホームページに記事一覧が表示される
   - 記事詳細ページが正しくレンダリングされる
   - シンタックスハイライトが機能する
   - ダークモード切り替えが動作する
   - RSS フィード (`/rss.xml`) が取得できる
   - Sitemap (`/sitemap-index.xml`) が生成される
3. `dist/` ディレクトリに Worker JS がなく HTML/CSS/JS のみであることを確認
4. `wrangler deploy --dry-run` で Static Assets のみアップロードされることを確認
5. ステージング or 本番 deploy 後、Google Analytics が動作していることを確認

## 参考ドキュメント

### Astro 本体
- Getting Started: https://docs.astro.build/en/getting-started/
- Content Collections: https://docs.astro.build/en/guides/content-collections/
- Rendering Modes (static): https://docs.astro.build/en/basics/rendering-modes/
- Pages (ルーティング): https://docs.astro.build/en/basics/astro-pages/
- Layouts: https://docs.astro.build/en/basics/layouts/
- Markdown サポート: https://docs.astro.build/en/guides/markdown-content/
- シンタックスハイライト (Shiki): https://docs.astro.build/en/guides/syntax-highlighting/
- 環境変数: https://docs.astro.build/en/guides/environment-variables/

### Astro Integrations
- @astrojs/react: https://docs.astro.build/en/guides/integrations-guide/react/
- @astrojs/tailwind: https://docs.astro.build/en/guides/integrations-guide/tailwind/
- @astrojs/sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- @astrojs/rss: https://docs.astro.build/en/guides/rss/
- @astrojs/cloudflare: https://docs.astro.build/en/guides/integrations-guide/cloudflare/

### Cloudflare
- Astro on Cloudflare Workers: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
- Static Assets (Workers): https://developers.cloudflare.com/workers/static-assets/

### OG 画像生成
- satori: https://github.com/vercel/satori
- @resvg/resvg-js: https://github.com/yisibl/resvg-js

### 移行ガイド
- Next.js → Astro 公式移行ガイド: https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/

---

## 重要ファイル

| ファイル | 対応 |
|---|---|
| `wrangler.jsonc` | `main` 削除、`assets.directory` → `./dist` |
| `src/app/api/og/route.tsx` | OG 画像デザイン参照元（satori に移植） |
| `src/app/globals.css` | Prism CSS 削除、`.prose` スタイル維持 |
| `lib/site-config.ts` | `NEXT_PUBLIC_*` → `PUBLIC_*` |
| `src/components/Header.tsx` | `next/link` 除去、`'use client'` 削除 |
