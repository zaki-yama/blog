# TODO リスト

## 完了済み ✅

### プロジェクト基盤
- [x] 技術ブログの要件を整理し、適切な技術スタックを選択する
- [x] Mintlifyプロジェクトの初期セットアップを行う
- [x] 基本的な設定ファイル（mint.json）を作成する
- [x] サンプル記事を作成してテストする
- [x] CLAUDE.mdを更新してMintlifyプロジェクト情報を追加する
- [x] シンプルなブログレイアウトに変更する
- [x] ブログの追加要件を整理し実装する

### Next.js移行
- [x] MintlifyからNext.jsへの移行を実行する
- [x] Next.jsプロジェクトの初期セットアップ
- [x] Markdownファイル処理の設定
- [x] ブログレイアウトの実装
- [x] 記事一覧ページの実装
- [x] 記事詳細ページの実装
- [x] 既存記事の移行

### ドキュメント整備
- [x] 作業記録システムの設置（docs/YYYY-MM-DD.md形式）
- [x] TODO管理システムの設置（todo.md）
- [x] Next.jsプロジェクトをルートに移動し、Mintlifyファイルを清理する

### UI/UX改善
- [x] ヘッダーナビゲーションの実装
  - [x] RSSフィードへのリンク
  - [x] GitHubリポジトリへのリンク
  - [x] ダークモード切り替えボタン
- [x] ソーシャルシェアボタンを実装
  - [x] Twitter, LinkedIn, はてなブックマーク対応
  - [x] 記事詳細ページへの配置
  - [x] シェア時のOG情報最適化

### SEO & Analytics
- [x] 構造化データ（JSON-LD）の実装
  - [x] 記事用のJSON-LD生成関数作成
  - [x] ブログサイト全体のJSON-LD設定
  - [x] Article, WebSite, BreadcrumbList, Organization スキーマ実装

### サイト機能拡張
- [x] 目次サイドバーの実装
  - [x] 記事のHeading要素から自動生成
  - [x] スクロール位置に応じたハイライト
  - [x] スムーススクロール機能
  - [x] レスポンシブデザイン（モバイル対応）

### パフォーマンス & SEO
- [x] RSSフィードの生成
  - [x] RSS 2.0形式での出力
  - [x] 自動更新の仕組み構築（APIエンドポイント）
  - [x] RSS discovery メタデータ追加
- [x] サイトマップ自動生成
  - [x] XMLサイトマップの自動生成
  - [x] 全ページ（ホーム、記事）の包含
  - [x] robots.txt生成と統合
- [x] メタタグ最適化
  - [x] 各ページの適切なtitle, description設定
  - [x] OGP（Open Graph Protocol）の完全対応
  - [x] Twitter Cards対応
  - [x] robots meta tags設定

### デプロイメント
- [x] Cloudflareデプロイメント環境構築
  - [x] Cloudflare Workers設定
  - [x] 必要な設定ファイル作成
  - [x] デプロイ環境の準備完了
- [x] fs.readdirSync未実装エラーの修正
- [x] Shiki WebAssemblyエラーの修正
- [x] Cloudflare Workersへのデプロイ実行
- [x] カスタムドメイン設定（blog.zaki-yama.dev）
- [x] Google Analytics 4統合
  - [x] @next/third-partiesパッケージ導入
  - [x] 環境変数設定の準備（.env.local.example作成）
  - [x] Next.js App Routerでのトラッキングコード実装
  - [x] セットアップガイド作成（docs/google-analytics-setup.md）
- [x] ドキュメント整理
  - [x] docs/以下のディレクトリ構造整理
  - [x] 開発日誌をworklog/以下に移動
  - [x] 技術実装ドキュメントをimplementation/以下に移動
  - [x] 開発日誌のフォーマットを最新ルールに統一
  - [x] 2025-06-19開発日誌の日本語化完了
  - [x] READMEプロジェクト全体のドキュメント更新

## 進行中 🚧

## 未着手 ⏳

### 必須機能（優先度：高）

#### SEO & Analytics


#### メディア管理
- [ ] Cloudinaryを統合してメディア管理を設定する
  - [ ] Cloudinaryアカウント作成サポート
  - [ ] Next.jsアプリケーションへのCloudinary SDK統合
  - [ ] 画像アップロード・最適化の動作確認
  - [ ] 記事内での画像挿入ワークフローの構築

#### UI/UX改善
- [ ] faviconを追加する
  - [ ] ブログテーマに適したfaviconデザイン作成
  - [ ] 複数サイズ（16x16, 32x32, 180x180等）の生成
  - [ ] apple-touch-iconとmanifest.jsonの設定
  - [ ] Next.jsアプリケーションへの統合

- [ ] OG画像自動生成機能を実装する
  - [ ] 記事タイトルから動的OG画像生成
  - [ ] @vercel/og または Puppeteer での実装検討
  - [ ] テンプレートデザインの作成

### 追加機能（優先度：中）

#### サイト機能拡張
- [ ] シンタックスハイライトの再実装
  - [ ] Prism.js または highlight.js の検討
  - [ ] クライアントサイドでの実装
  - [ ] ダークモード対応
  - [ ] 主要言語のサポート確認


- [ ] X(Twitter)カード展開機能を実装する
  - [ ] 記事内のTwitter URLの自動検出
  - [ ] Twitter Embed APIの統合
  - [ ] レスポンシブ対応

#### コンテンツ管理
- [ ] カテゴリ機能の拡張
  - [ ] カテゴリ別記事一覧ページ
  - [ ] カテゴリナビゲーションの実装
  - [ ] カテゴリ別RSS生成

- [ ] 検索機能の実装
  - [ ] 記事タイトル・内容の全文検索
  - [ ] フロントエンド検索（Fuse.js等）
  - [ ] 検索結果ページの実装

#### パフォーマンス & SEO



### 品質向上（優先度：低）

#### コード品質
- [ ] TypeScript型定義の強化
- [ ] ESLint/Prettierの設定最適化
- [ ] ESLint -> Biomeへの移行
- [ ] 単体テストの実装（Jest + Testing Library）

#### ユーザビリティ
- [ ] 読了時間表示機能
- [ ] 関連記事の自動表示
- [ ] 記事内目次の自動生成
- [ ] パンくずリスト

#### アクセシビリティ
- [ ] スクリーンリーダー対応
- [ ] キーボードナビゲーション対応
- [ ] カラーコントラスト改善

## 備考

### 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **スタイリング**: Tailwind CSS
- **Markdownパーサー**: gray-matter + remark
- **デプロイ**: 未定（Vercel推奨）

### 作業の優先順位
1. **必須機能**: ブログとして最低限必要な機能（SEO、メディア管理）
2. **追加機能**: ユーザビリティ向上のための機能
3. **品質向上**: 長期運用のための基盤整備

### 次回着手予定
Google Analytics統合から開始予定。外部サービス連携の基盤を整えてから、その他の機能を順次実装していく方針。