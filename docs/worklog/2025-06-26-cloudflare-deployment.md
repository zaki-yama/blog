# 2025-06-26 作業記録 - Cloudflare Workers デプロイ

## 今日やったこと

- Cloudflare Workers環境でのNext.jsアプリケーションデプロイ
- ファイルシステムAPI制限への対応
- シンタックスハイライトライブラリのWebAssembly問題解決
- カスタムドメイン（blog.zaki-yama.dev）の設定

## 直面した課題

### 1. fs.readdirSync未実装エラー

**エラー内容:**
```
✘ [ERROR] ⨯ Error: [unenv] fs.readdirSync is not implemented yet!
```

**原因:**
Cloudflare Workers環境では Node.js の `fs` API が制限されており、`fs.readdirSync()` が使用できない。

**解決策:**
- 静的ファイルリスト (`POST_FILES`) を定義
- `fs.readdirSync()` を `import('...?raw')` を使った動的インポートに変更
- 全ての記事取得関数を非同期化
- WebpackでMarkdownファイルを `asset/source` として処理するよう設定

**修正ファイル:**
- `lib/posts.ts`: ファイル読み込みロジックの変更
- `src/app/page.tsx`: `getSortedPostsData()` の非同期呼び出し
- `src/app/rss.xml/route.ts`: RSS生成の非同期対応
- `src/app/sitemap.xml/route.ts`: サイトマップ生成の非同期対応
- `next.config.ts`: Webpack設定追加

### 2. Shiki WebAssembly未対応エラー

**エラー内容:**
```ら
✘ [ERROR] ⨯ CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder

at Object.getWasmInstance (worker.js:130520:622306)
at createWasm (worker.js:8461:20)
at createOnigurumaEngine (worker.js:8509:22)
at createShikiInternal (worker.js:5550:33)
```

**原因:**
Cloudflare Workers環境ではWebAssemblyの実行が制限されており、Shikiライブラリの内部で使用されるWebAssemblyモジュールが動作しない。

**解決策:**
- `@shikijs/rehype` の使用を一時的に停止
- シンタックスハイライト機能を無効化
- 基本的なコードブロックスタイリングはTailwind CSSで対応
- 将来的にPrism.js等のクライアントサイド代替案を検討予定

**修正内容:**
```typescript
// 修正前
const processedContent = await remark()
  .use(remarkRehype)
  .use(rehypeShiki, { /* Shiki設定 */ })
  .use(rehypeStringify)
  .process(matterResult.content);

// 修正後
const processedContent = await remark()
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(matterResult.content);
```

### 3. カスタムドメイン設定の困惑

**問題:**
`wrangler domains add` コマンドが存在せず、Wranglerの最新版での設定方法が不明だった。

**解決策:**
- Cloudflare Dashboard経由でカスタムドメイン設定
- `wrangler.jsonc` の `routes` 設定で同期
- 最初のワイルドカード記述（`blog.zaki-yama.dev/*`）でエラーが発生
- 正しい記述方法：`"pattern": "blog.zaki-yama.dev"` （パスなし）

## 感情的な変化

- **最初の期待感**: Cloudflare Workersの高性能を期待してデプロイ開始
- **困惑**: `fs.readdirSync` エラーで予想外の制限に直面
- **焦り**: 複数のエラーが連続で発生し、デプロイが思うように進まない
- **学び**: Cloudflare WorkersのEdge Runtime制限について深く理解
- **達成感**: 全てのエラーを解決し、カスタムドメインでの公開成功

## 技術的な学び

### Cloudflare Workers の制限事項
1. **Node.js API制限**: `fs`, `path` の一部機能が使用不可
2. **WebAssembly制限**: WASM モジュールの実行が制限される
3. **Edge Runtime**: 従来のサーバーサイド環境とは異なる制約

### OpenNext.js の有用性
- Next.js を Cloudflare Workers で動かすための最適化ツール
- ビルド時に適切な変換を行い、Workers環境での動作を実現
- `npm run preview` でローカル環境での動作確認が可能

### エラー対応のアプローチ
1. **エラーメッセージの詳細確認**: スタックトレースから根本原因を特定
2. **代替手段の検討**: 制限された機能に対する代替実装
3. **段階的修正**: 一つずつエラーを解決し、各修正点で動作確認

## 次回への引き継ぎ

### 完了した項目
- [x] Cloudflare Workers デプロイ環境構築
- [x] blog.zaki-yama.dev でのカスタムドメイン公開
- [x] 基本的なブログ機能（記事一覧、記事詳細、RSS、サイトマップ）
- [x] ダークモード切り替え機能

### 今後の課題
- [ ] シンタックスハイライトの再実装（Prism.js または highlight.js）
- [ ] Google Analytics 4 統合
- [ ] Cloudinary メディア管理統合
- [ ] OG画像自動生成機能

### 技術的検討事項
- クライアントサイドでのシンタックスハイライト実装方法
- Cloudflare Workers 環境での画像最適化アプローチ
- パフォーマンス監視とログ収集の設定

### 学習ポイント
今回の作業で Cloudflare Workers の制約と利点を理解できた。特に Edge Runtime の制限を理解することで、今後のサーバーレス開発における技術選択の指標となった。