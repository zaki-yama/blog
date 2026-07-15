# 2026-07-15 作業ログ

## 今日やったこと

- 本番サイトでGoogle Analyticsが計測できていない問題を調査し、原因と対応方針を確定
- Explore agentと自分の調査を並行させ、`wrangler.jsonc` の `vars.PUBLIC_GA_ID` がAstro静的ビルドでは完全に無効なデッドコンフィグになっていることを特定
- ユーザーと相談し、環境変数による上書き機構自体を廃止して `site-config.ts` に定数化する方針に決定
- `src/lib/site-config.ts` に `SITE_CONFIG.analytics.gaId` を追加、`BaseLayout.astro` を `import.meta.env.PROD && SITE_CONFIG.analytics.gaId` に変更
- `wrangler.jsonc` の `vars` ブロックを削除、`.env.local.example` からGA関連行を削除
- `README.md` と `docs/google-analytics-setup.md` をNext.js前提の記述からAstro前提に書き直し
- 新規ADR `005-static-build-public-env-vars.md` を作成し、根本原因と決定を記録
- `pnpm build` で本番ビルドにGAスクリプトが出力されること、`astro dev` では出力されないこと（開発トラフィックが混入しない）を実機確認

## 直面した課題

- ユーザーが「Nestから移行した」と言っていたが、実際には NestJS ではなく Next.js からの移行だった。`git log` で確認して訂正。ユーザー自身の記憶違い・言い間違いだった可能性が高い。
- 当初、既存の `getBaseUrl()` パターン（`import.meta.env.PUBLIC_GA_ID || 定数`）を踏襲する案で計画したが、ユーザーから「ローカル上書きが不要なら定数だけにできないか」と指摘され、よりシンプルな設計に倒した。ただしその際、開発時にGAが発火してしまう副作用に気づき、`import.meta.env.PROD` によるガードを追加する必要があった。
- `astro build --mode development` では `import.meta.env.PROD` が変化しないことに気づかず、最初の検証方法が誤っていた。`PROD`/`DEV` はVite的には「ビルドかdevサーバーか」で決まり、`--mode` フラグとは独立していることを実際に `astro dev` を起動して確認して理解した。

## 感情的な変化

- `docs/worklog/2026-03-20-google-analytics.md` という過去の作業ログが、まさに「Next.js Server Componentのランタイム評価だからwrangler.jsoncのvarsで動く」という結論を出していたのを見つけたとき、移行時にこの前提が引き継がれずに壊れた瞬間が特定できて腑に落ちた。過去の自分（Claude）の調査ログが今回の調査の決定的な証拠になったのは面白かった。
- 実際に `dist/index.html` をgrepしてGAスクリプトが0件であることを最初に確認できたのが大きく、仮説ベースではなく実証ベースで原因を詰められた。

## 技術的な学び

- OpenNext + Cloudflare WorkersでのNext.js Server Componentは、`process.env` をリクエスト時に評価し、Workersの`vars`をランタイムで注入できる。一方、Astroの静的ビルド（`output: 'static'`、adapterなし）は `import.meta.env.PUBLIC_*` をビルド時にVarsで静的置換するため、両者は全く異なる評価タイミングを持つ。同じ「環境変数っぽい書き方」でもフレームワーク移行で意味が変わる典型例だった。
- `wrangler.jsonc` の `vars` は、Workerスクリプト（`main`フィールド）が存在する場合にのみ意味を持つランタイムバインディングであり、静的アセットのみの配信構成では完全に無視される。
- Viteの `import.meta.env.PROD` / `DEV` は `--mode` フラグとは独立していて、`vite build` / `astro build` は常に `PROD: true`、`vite dev` / `astro dev` のみ `DEV: true` になる。

## 次回への引き継ぎ

- `pnpm run deploy` の実行によるデプロイ自体はユーザーの承認前提でまだ実施していない。次回セッション、もしくはこのセッションの続きでユーザーに確認の上、本番反映する。
- README.mdのFavicon生成セクション（`scripts/generate-favicon.sh`）が実際には存在しないスクリプトを参照している、Cloudinary関連の環境変数（`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`等）もコード内に実際の参照箇所が見当たらず未使用の可能性がある、という2点はスコープ外として今回は触れなかった。別issueとして対応を検討してもよい。
