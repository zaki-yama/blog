# ADR 005: 静的ビルドにおける公開設定値の扱い

## ステータス

承認済み・実装完了（2026-07-15）

## コンテキスト

Astro移行（ADR 003、コミット `a35a303`）後、本番サイトでGoogle Analyticsのデータが取得できなくなっていることが判明した。`wrangler.jsonc` の `vars.PUBLIC_GA_ID` は正しく設定されており、`src/layouts/BaseLayout.astro` も `import.meta.env.PUBLIC_GA_ID` を正しく参照していたが、実際にビルドされた `dist/index.html` にはGAスクリプトが一切出力されていなかった。

### 現状の課題

- Next.js時代（`@next/third-parties`、OpenNext + Cloudflare Workers）では、`process.env.NEXT_PUBLIC_GA_ID` はNext.js Server Componentの**リクエスト時**に評価され、OpenNextのCloudflareアダプターが `wrangler.jsonc` の `vars` を `process.env` に注入していた。そのため `wrangler.jsonc` に値を置くだけで動作した（`docs/worklog/2026-03-20-google-analytics.md` 参照）。
- Astro移行時（`output: 'static'`、adapterなし）、`wrangler.jsonc` の `vars` の値はそのまま `NEXT_PUBLIC_*` → `PUBLIC_*` にリネームして引き継がれたが、**この値をビルド時に注入する手段が存在しないまま**放置された。
- 静的Astroサイトの `import.meta.env.PUBLIC_*` はViteによって**ビルド時**に静的置換される。SSRランタイムが存在しない（`wrangler.jsonc` に `main` フィールド＝Workerスクリプトが無く、静的アセット配信のみの構成）ため、`wrangler.jsonc` の `vars` を読む主体はどこにも存在しない。
- ビルド・デプロイ用のCI/CDワークフローも存在せず、デプロイは手元で `pnpm run deploy`（`astro build && wrangler deploy`）を実行する運用であるため、ビルド時環境変数を注入する自然な導線も無かった。
- 結果として `wrangler.jsonc` の `vars.PUBLIC_GA_ID` は「設定されているように見えるが実際には何も読まれないデッドコンフィグ」と化し、GAが本番で沈黙していることに長期間気づかれなかった。

## 決定

GA測定IDのような**非機密の公開設定値**は、環境変数ではなく `src/lib/site-config.ts` の `SITE_CONFIG` に定数として直接持たせる。

```ts
export const SITE_CONFIG = {
  // ...
  analytics: {
    gaId: 'G-WTRHNJ8JBX',
  },
};
```

開発中（`pnpm dev` / `astro preview`）にGAが発火して本番プロパティに開発トラフィックが混入するのを防ぐため、`import.meta.env.PROD` を用いて本番ビルド時のみ有効化する。

```ts
// src/layouts/BaseLayout.astro
const GA_ID = import.meta.env.PROD && SITE_CONFIG.analytics.gaId;
```

`wrangler.jsonc` の `vars` ブロック（`PUBLIC_SITE_URL` / `PUBLIC_GA_ID`）は削除する。静的アセット配信のみの構成ではこの値を読む主体が存在せず、残しておくと「ここで設定すれば効く」という誤解を再生産するため。

### 決定理由

- GA測定IDはビルド後のHTMLに平文で出力される非機密情報であり、ソースコードに直書きしても機密性上の問題はない。
- 環境変数による上書き機構を持たせると「ビルド時に注入されているはず」という暗黙の前提が生まれ、今回と同種の見えないバグを再発させるリスクがある。定数化すればビルド環境に依存せず常に同じ値がビルド出力に含まれることが保証される。
- 既存の `PUBLIC_SITE_URL` は `getBaseUrl()`（`src/lib/site-config.ts`）で `import.meta.env.PUBLIC_SITE_URL || SITE_CONFIG.url.base` というフォールバックを持っており、たまたま実害が出なかっただけで、根本的な設計上のリスクは同じだった。今回のGAの一件はこのリスクが顕在化した実例である。

## 検討した選択肢

### 1. `site-config.ts` にフォールバック値を追加（`import.meta.env.PUBLIC_GA_ID || 定数`）

#### 概要

既存の `getBaseUrl()` と同じパターンで、環境変数を優先しつつ定数をフォールバックとして持つ。

#### ✅ 長所

- 既存コードとパターンが統一される
- ローカルで別のGAプロパティ（検証用）に差し替える手段を残せる

#### ❌ 短所

- ローカル検証用GAプロパティの上書き需要は実際には無かった
- 環境変数の存在を前提とする設計自体が、今回のバグの温床になった構造を温存する

#### 評価

⭐⭐（検証用の上書き需要が無いため見送り）

---

### 2. 静的アセット配信ではなくAstroの `@astrojs/cloudflare` adapterを導入し、SSR経由でランタイム変数を読む

#### 概要

`wrangler.jsonc` の `vars` を活かすため、Astroをサーバーサイドレンダリング構成に変更し、Cloudflare Workersのランタイム環境変数を読めるようにする。

#### ✅ 長所

- `wrangler.jsonc` の `vars` という既存の仕組みをそのまま活かせる

#### ❌ 短所

- ADR 003で意図的に静的サイト化した経緯（ホスティング制約の回避、シンプルさ）に逆行する
- GA測定IDのような非機密な公開定数のためだけにSSR化するのは過剰

#### 評価

⭐（スコープに対して過剰な変更）

---

### 3. `site-config.ts` に定数として直接持たせる（採用）

#### 概要

環境変数を介さず、非機密の公開設定値はソースコードの定数として管理する。

#### ✅ 長所

- ビルド環境に依存せず常に正しい値がビルド出力に含まれることが保証される
- 環境変数の設定漏れという、今回発生したクラスの不具合が構造的に起こり得なくなる
- 実装がシンプル

#### ❌ 短所

- 値を変更する際にコード変更・デプロイが必要（Cloudinaryの認証情報のような真の機密情報とは異なり、GA IDの変更頻度は低いため許容）

#### 評価

⭐⭐⭐⭐⭐

## 影響

### ポジティブな影響

- GAが本番ビルドで確実に有効化される
- 今後 `PUBLIC_*` 環境変数を追加する際、「ビルド時に注入されるか」を都度検証する必要性が減り、非機密な公開値は `site-config.ts` に定数化するという判断基準が明確になった

### ネガティブな影響

- GA測定IDを変更する際は環境変数の書き換えではなくコード変更・再デプロイが必要になる（現状の運用頻度を踏まえると許容範囲）
