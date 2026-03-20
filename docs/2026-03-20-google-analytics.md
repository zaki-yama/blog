# 2026-03-20 作業記録

## 今日やったこと
- Issue #5（Google Analytics 4 統合）の対応状況を確認
- `feat/google-analytics` ブランチの実装内容を確認
- 本番サイト（https://blog.zaki-yama.dev/）の HTML を確認し、GA が動作済みであることを確認
- `feat/google-analytics` ブランチを削除（作業不要と判断）

## 直面した課題

### NEXT_PUBLIC_ 変数のビルド時インライン展開について
当初、`wrangler.jsonc` の `vars` に設定した `NEXT_PUBLIC_GA_ID` がビルド時に参照されないのではと懸念した。実際に `pnpm build` / `opennextjs-cloudflare build` を実行したところ、ビルド出力に GA ID が含まれていなかった。

`.env.production` を作成して再ビルドしたところ GA ID がインライン化されたが、その後本番サイトを確認したところすでに GA が動作していた。

### 原因の理解
- `NEXT_PUBLIC_` 変数がビルド時にインライン展開されるのは **Client Component** の場合
- `layout.tsx` は **Server Component** であるため、`process.env` はランタイムに読まれる
- `wrangler.jsonc` の `vars` は Cloudflare Workers のランタイム環境変数として注入される
- そのため、`wrangler.jsonc` の設定だけで GA は正常に動作する

## 技術的な学び
- Next.js App Router の Server Component では `process.env` はビルド時ではなくランタイムに評価される
- `NEXT_PUBLIC_` プレフィックスはクライアントサイドへの露出を制御するものであり、Server Component のランタイム評価には影響しない
- `opennextjs-cloudflare` を使った Cloudflare Workers デプロイでは、`wrangler.jsonc` の `vars` が Server Component の `process.env` として利用可能

## 次回への引き継ぎ
- GA 対応は main ブランチにすでに実装済み・本番動作確認済み
- Issue #5 はクローズ可能
