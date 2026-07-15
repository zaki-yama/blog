# PUBLIC_GA_ID が本番ビルドに注入されない問題の修正

## Context

本番サイト（https://blog.zaki-yama.dev/）で Google Analytics のデータが取得できていない。`wrangler.jsonc` には `PUBLIC_GA_ID` が定義されており、`src/layouts/BaseLayout.astro` も `import.meta.env.PUBLIC_GA_ID` を正しく参照しているにもかかわらず、実際にビルドされた `dist/index.html` には `gtag` / `googletagmanager` のスクリプトが一切含まれていないことを確認済み（`grep` で 0 件）。

原因は Next.js → Astro への移行（コミット `a35a303`、2026-03-31）に伴う環境変数の評価タイミングの変化。

- **Next.js 時代**（`@next/third-parties`、`process.env.NEXT_PUBLIC_GA_ID` を Server Component で参照）: OpenNext の Cloudflare アダプター経由で、Cloudflare Workers の `wrangler.jsonc` の `vars` が**リクエスト時（ランタイム）**に `process.env` へ注入されていた。そのため `wrangler.jsonc` に値を置くだけで動作していた（`docs/worklog/2026-03-20-google-analytics.md` に当時の調査記録あり）。
- **Astro 移行後**（`output: 'static'`、adapter なし）: `import.meta.env.PUBLIC_GA_ID` は Vite によって**ビルド時**に静的置換される。SSR ランタイムが存在しないため、`wrangler.jsonc` の `vars` を読む主体がそもそも存在しない。`wrangler.jsonc` に `main`（Worker スクリプト）フィールドが無いことからも、現状は純粋な静的アセット配信であることが確認できる。

つまり `wrangler.jsonc` の `vars.PUBLIC_GA_ID` は**完全なデッドコンフィグ**であり、ビルド時に値を注入する仕組みがどこにも存在しない。ローカルの `.env.local` にも `PUBLIC_GA_ID` は存在せず（コメントアウトされた旧名 `NEXT_PUBLIC_GA_ID` のみ）、GitHub Actions にもビルド・デプロイ用ワークフローが無い（デプロイは手元で `pnpm run deploy`＝`astro build && wrangler deploy` を実行する運用）。

なお、同じ静的ビルド時評価の問題を抱える `PUBLIC_SITE_URL` は `getBaseUrl()`（`src/lib/site-config.ts:33-35`）で `import.meta.env.PUBLIC_SITE_URL || SITE_CONFIG.url.base` というフォールバックを持っているため、実害なく動いていた。GA_ID にはこのフォールバックが無かったため、`GA_ID` が `undefined` になり `{GA_ID && (...)}` の条件分岐でスクリプト自体が出力されなかった。

対応方針はユーザーと相談の上、環境変数による上書き機構（`PUBLIC_GA_ID`）自体を廃止し、**`SITE_CONFIG` に GA 測定 ID を定数として持たせる**方式を採用する（GA 測定 ID はビルド後の HTML に平文で出力される非機密情報であり、`wrangler.jsonc` にも既に平文で存在しているため、ソースにハードコードしても機密性上の問題はない）。ただし、現状は開発時（`pnpm dev` / `astro preview`）には GA スクリプトが出力されない（＝開発中のアクセスが本番 Analytics に混入しない）という挙動になっているため、これを維持する。Astro/Vite のビルドモード判定 `import.meta.env.PROD` を使い、本番ビルド時のみ GA_ID を有効にする。

## 対応内容

### 1. コード修正

**`src/lib/site-config.ts`**
- `SITE_CONFIG` に `analytics: { gaId: 'G-WTRHNJ8JBX' }` を追加

**`src/layouts/BaseLayout.astro`**
- `const GA_ID = import.meta.env.PUBLIC_GA_ID;` を以下に置き換え:
  ```ts
  const GA_ID = import.meta.env.PROD ? SITE_CONFIG.analytics.gaId : undefined;
  ```

### 2. `wrangler.jsonc` のクリーンアップ
- `vars` ブロック（`PUBLIC_SITE_URL` / `PUBLIC_GA_ID`）を削除する。静的アセット配信のみの構成（`main` フィールドなし）ではこの `vars` を読むランタイムが存在せず、残しておくと「ここで設定すれば効く」という誤解を再生産するため。
- なお `PUBLIC_SITE_URL` 側（`getBaseUrl()`）は今回スコープ外とし、既存のフォールバック実装のまま変更しない。

### 3. `.env.local.example` の更新
- `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` の行を削除する（環境変数による上書きを廃止するため、GA 関連の設定項目自体が不要になる）

### 4. ドキュメント更新

**`README.md`**
- 「Next.js 15」等の技術スタック記述を Astro ベースに更新
- `npm run dev` 等のコマンドを `pnpm dev` に統一（CLAUDE.md の pnpm 方針に合わせる）
- GA 設定に関する記述を、実際の仕組み（`SITE_CONFIG.analytics.gaId` に直接定義、環境変数は使わない、本番ビルド時のみ有効）に修正

**`docs/google-analytics-setup.md`**
- Next.js 前提（`@next/third-parties`、Server/Client Component の話、`NEXT_PUBLIC_GA_ID` の設定手順）の内容を Astro 前提に書き直し
- GA ID は `src/lib/site-config.ts` の定数として管理すること、`import.meta.env.PROD` により本番ビルド時のみ有効になることを明記
- `wrangler.jsonc` の `vars` では効かないこと（static assets 配信ではランタイムが存在しないため）を明記

**新規 ADR: `docs/adrs/005-static-build-public-env-vars.md`**
- `docs/adrs/000-template.md` のフォーマットに従う
- 今回の根本原因（SSR ランタイム評価 vs. static ビルド時評価の違い、`wrangler.jsonc` の `vars` が static assets 構成では無効であること）と、非機密な公開設定値は `site-config.ts` に定数として持たせる、という決定を記録する。将来同じ問題を繰り返さないための記録として残す。

## 検証方法

1. `pnpm build` を実行し、`grep -c "gtag\|G-WTRHNJ8JBX" dist/index.html` が 0 より大きいことを確認する（現状は 0 件であることを確認済み）。
2. `pnpm dev` （または `astro build --mode development`）で `GA_ID` が `undefined` になり GA スクリプトが出力されないこと（開発時は計測されない挙動が維持されていること）を確認する。
3. 本番反映は `pnpm run deploy` の実行が必要（別途ユーザーの許可を得てから実施）。
