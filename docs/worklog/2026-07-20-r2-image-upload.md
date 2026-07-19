# 2026-07-20 作業ログ

## 今日やったこと

- ADR 001（画像ホスティング選定）を「検討中」から「決定」に更新し、Cloudflare R2への移行を確定
- ADR 004（画像アップロード方式）を「提案中」から「決定」に更新し、案4「ローカル専用Node.jsサーバー」を採用（アップロード先はCloudinaryではなくR2に変更）
- wrangler CLIでR2バケット `blog-images` を作成し、r2.dev公開URLを有効化
- `tools/upload-server/` にローカル専用のアップロードサーバーを実装（Express + multer + `@aws-sdk/client-s3`）
  - `pnpm upload` で起動、`http://localhost:3333` にブラウザでアクセスして使う
  - 旧`ImageUploader.tsx`と同等のドラッグ&ドロップUI、アップロード後にMarkdown記法をコピーする機能
- 使われなくなったCloudinary関連コードを削除（`src/components/ImageUploader.tsx`、`docs/cloudinary-setup.md`、`cloudinary`系npmパッケージ）
- `docs/image-upload-setup.md` を新規作成し、R2 APIトークンの発行手順などをまとめた
- README.md / requirements.md のCloudinary関連記述をR2ベースに更新

## 直面した課題

- R2バケットの作成・公開URL有効化はwrangler CLIでできたが、S3互換API用のAccess Key ID/Secret Access Key（R2 APIトークン）はCLIから発行するコマンドが存在せず、Cloudflareダッシュボードでの手動発行が必要だった。これは今回のセッションでは完了できておらず、ユーザー自身の作業として残っている
- そのため `pnpm upload` の実アップロード（実際にR2へPUTする部分）は未検証。サーバー起動・静的ページ配信・バリデーションエラーのハンドリングまではダミー環境変数でスモークテスト済み

## 感情的な変化

- ADR 001・004がどちらも「検討中」「提案中」のまま放置されていたが、今回ユーザーの一言（「R2で、ローカルだけで使えればいい」）で両方の意思決定が同時に片付いた。ADR同士が依存関係にあり、片方が決まらないともう片方も決められない状態だったことが整理しててよくわかった

## 技術的な学び

- R2の公開URL（r2.dev）は `wrangler r2 bucket dev-url enable <bucket>` で有効化できる。バケット作成自体もwrangler CLIで完結する
- 一方でR2のS3互換API用トークン（Access Key ID/Secret）はwrangler CLIのコマンド一覧に存在せず、ダッシュボードの「R2 → Manage API tokens」からのみ発行できる。バケット管理とAPIトークン管理で必要な権限・手段が分かれている
- Node.js 20.6+の `node --env-file=.env.local` フラグを使うと、`dotenv` パッケージを追加せずに素朴なNode.jsスクリプトへ環境変数を読み込める。ローカル専用ツールなのでdevDependenciesを増やさずに済んだ

## 次回への引き継ぎ

- ユーザーがCloudflareダッシュボードでR2 APIトークン（Object Read & Write、`blog-images`バケットにスコープ）を発行し、`.env.local` の `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` を埋める必要がある
- 実際に `pnpm upload` で画像をアップロードして、R2への保存・r2.dev URLでの表示・Markdown記法の生成まで一通り動作確認する
