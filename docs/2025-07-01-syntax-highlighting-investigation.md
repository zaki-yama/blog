# 2025-07-01 シンタックスハイライト実装調査記録

## 概要

技術ブログにおけるシンタックスハイライト機能の実装について、過去の経緯と現在の状況を調査し、最適な実装方法を検討した。

## 過去の実装履歴

### 2025-06-26: Shiki実装の試行と失敗

**実装内容:**
- `@shikijs/rehype` プラグインをMarkdown処理パイプラインに統合
- デュアルテーマ対応（light/dark）の設定

**実装コード:**
```typescript
const processedContent = await remark()
  .use(remarkRehype)
  .use(rehypeShiki, { /* Shiki設定 */ })
  .use(rehypeStringify)
  .process(matterResult.content);
```

**遭遇したエラー:**
```
✘ [ERROR] ⨯ CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder
at Object.getWasmInstance (worker.js:130520:622306)
at createWasm (worker.js:8461:20)
at createOnigurumaEngine (worker.js:8509:22)
at createShikiInternal (worker.js:5550:33)
```

**原因分析（当時）:**
- Cloudflare WorkersがWebAssembly実行を制限
- ShikiがOniguruma正規表現エンジン（WebAssembly）を内部使用
- サーバーサイド実行環境の制約により動作不可

**対処:**
- Shikiを完全に削除
- 基本的なコードブロックスタイリングに回帰

## 2025-07-01: 再調査と新たな発見

### Shikiの進化状況調査

**発見事項:**
1. **Cloudflare Workers対応が完了済み**
   - GitHub Issue #247: 2024年1月に解決
   - Shikiji（フォーク）がShiki本体にマージ
   - v1.0でCloudflare Workers正式サポート

2. **技術的改善**
   - WebAssembly制約が解決
   - 現在のバージョン（3.6.0）で対応済み

### 実装再試行の結果

**実装内容:**
```typescript
import rehypeShiki from '@shikijs/rehype';

const processedContent = await remark()
  .use(remarkRehype)
  .use(rehypeShiki, {
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    }
  })
  .use(rehypeStringify)
  .process(matterResult.content);
```

**ビルド結果:**
- ローカルビルド: ✅ 成功
- 開発サーバー: ✅ 正常起動

### 新たな問題の発見: バンドルサイズ制限

**デプロイ時エラー:**
```
✘ [ERROR] Your Worker exceeded the size limit of 3 MiB. 
Please upgrade to a paid plan to deploy Workers up to 10 MiB.

Total size: 18782.95 KiB (約18.3 MiB)
```

**根本原因:**
- **WebAssemblyの問題ではなく、バンドルサイズの問題**
- Shikiの全言語・テーマ定義が含まれ、極端にサイズが増大
- Cloudflare Workers無料プランの3MiB制限を大幅超過

## 代替案の検討

### 選択肢

1. **Shiki最適化アプローチ**
   - 特定言語のみ読み込み
   - テーマ限定
   - バンドルサイズ削減の可能性は不明

2. **rehype-prism-plus**
   - 軽量（Prism.js ベース）
   - サーバーサイドハイライト対応
   - 行番号・行ハイライト機能付き
   - Cloudflare Workers制限内

3. **クライアントサイド実装**
   - バンドル制限回避
   - ユーザー体験への影響あり

### GitHub統計比較

| ライブラリ | Stars | 状況 | 最終更新 |
|-----------|-------|------|----------|
| @mapbox/rehype-prism | 175 | ❌ アーカイブ済み | 2024-04-16 |
| rehype-prism-plus | 189 | ✅ アクティブ | 2024-04-05 |

## 決定事項

**選択: rehype-prism-plus**

**理由:**
1. Cloudflare Workers制限を満たす軽量性
2. サーバーサイド事前処理によるパフォーマンス
3. 継続的なメンテナンスとコミュニティサポート
4. 技術ブログに必要十分な機能

## 技術的教訓

1. **Cloudflare Workersの制約**
   - WebAssembly制限は解決済み
   - バンドルサイズ制限（3MiB）が主要制約
   - 大規模ライブラリ使用時は事前サイズ確認が必要

2. **Shikiの特性**
   - 高品質だが大容量
   - 全機能を使う場合はバンドルサイズに注意
   - エッジ環境では慎重な選択が必要

3. **実装戦略**
   - 環境制約を最初に確認
   - 段階的な実装とテスト
   - 代替案の事前調査の重要性

## 次のアクション

1. Shikiの設定を削除
2. rehype-prism-plusの実装
3. ダークモード対応の確認
4. 本番環境でのサイズ検証