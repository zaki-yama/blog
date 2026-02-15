# ADR 001: 画像ホスティングサービスの選定

## ステータス

検討中（2026-01-20）

## コンテキスト

技術ブログにおける画像の保存・配信を最適化するため、画像ホスティングサービスの選定が必要です。現在はCloudinaryを使用していますが、Cloudflareのエコシステム内のサービス（R2、Cloudflare Images）も候補として検討します。

### 要件

- 無料枠または低コストでの運用
- 画像の最適化・変換機能
- CDN経由での高速配信
- Next.jsとの統合の容易さ
- Cloudflare Workersとの親和性（既存デプロイ環境）

## 検討した選択肢

### 1. Cloudinary

#### 概要
包括的なメディア管理プラットフォーム。画像・動画の管理、変換、配信を統合的に提供。

#### 料金体系
- **無料プラン**: 月25クレジット
  - 1クレジット = 1,000変換 または 1GB保存 または 1GB帯域幅
  - 実質25GBストレージ + 25GB帯域幅 + 25,000変換/月
- **有料プラン**: Plus $89/月〜、Advanced $224/月〜
- クレジットカード登録不要
- 無期限で無料プラン利用可能

#### 主な機能
- 自動画像最適化（WebP/AVIF対応）
- リアルタイム画像変換（リサイズ、クロップ、フィルター等）
- DAM（Digital Asset Management）機能
- 動画管理・変換
- 多数のSDK対応（Node.js、Python、React等）
- CMS連携（WordPress、Contentful、Sanity等）

#### Next.js統合
- 公式SDK（`cloudinary`）で簡単統合
- 豊富なドキュメント・チュートリアル
- Next.js Image Loaderのサポート
- React専用コンポーネントライブラリ

#### 長所
- ✅ 最も豊富な機能セット
- ✅ 優れた開発者体験（SDK、ドキュメント充実）
- ✅ 無料枠が比較的大きい
- ✅ DAM機能により画像管理が容易
- ✅ 本プロジェクトで既に統合済み

#### 短所
- ❌ Cloudflareエコシステム外のサービス
- ❌ 有料プランは比較的高額
- ❌ トラフィック増加時のコスト予測が複雑（クレジット制）

#### 推奨度
⭐⭐⭐⭐☆ (4/5)

**理由**: 機能性と開発者体験は最高レベル。既に統合済みで動作実績あり。Cloudflareエコシステム外である点のみが懸念。

---

### 2. Cloudflare R2

#### 概要
S3互換のオブジェクトストレージ。画像に特化していないが、汎用的なファイルストレージとして利用可能。

#### 料金体系
- **無料プラン**: 10GB保存、無制限帯域幅
- **有料**: $0.015/GB/月（ストレージ）
  - Class A操作（アップロード等）: $4.50/100万回（最初の100万回無料）
  - Class B操作（読み取り）: $0.36/100万回（最初の1,000万回無料）
- **最大の特徴**: エグレス料金（帯域幅）が完全無料

#### 主な機能
- S3互換API（AWS SDKで操作可能）
- Cloudflare CDNとの統合
- Cloudflare Imagesの変換機能と連携可能（月5,000回まで無料）
- Workers統合でエッジでの処理が可能

#### Next.js統合
- AWS S3 SDKを使用（`@aws-sdk/client-s3`）
- 複数の実装パターン
  - Presigned URL方式
  - Workers API経由
  - 一時認証情報方式
- 公式チュートリアル・サンプルコード豊富

#### 長所
- ✅ エグレス料金無料（高トラフィック時に有利）
- ✅ Cloudflareエコシステム内で完結
- ✅ Workers統合でエッジ処理が可能
- ✅ S3互換で将来の移行が容易
- ✅ 低コスト（ストレージ$0.015/GB）

#### 短所
- ❌ 画像変換機能が別途必要（Cloudflare Images併用または自前実装）
- ❌ DAM機能なし（画像管理UIが基本的）
- ❌ 画像最適化の追加実装が必要
- ❌ 開発者体験がCloudinaryより劣る

#### 推奨度
⭐⭐⭐☆☆ (3/5)

**理由**: コストと柔軟性は優秀だが、画像特化機能がなく追加実装が必要。Cloudflare Images併用で補完可能。

---

### 3. Cloudflare Images

#### 概要
Cloudflareの画像最適化・配信特化サービス。画像の保存・変換・配信を一元管理。

#### 料金体系
- **無料プラン**: 月5,000ユニーク変換（外部ホスト画像の最適化のみ）
- **有料プラン**:
  - 変換: $0.50/1,000変換
  - 保存: $5/10万画像/月
  - 配信: $1/10万画像配信

#### 主な機能
- 自動画像最適化（WebP/AVIF対応）
- リアルタイム画像変換
- Cloudflare CDNでの配信
- Direct Creator Upload API（ユーザー直接アップロード）
- 署名付きURL（アクセス制限）
- 30日スライディングウィンドウでユニーク変換課金

#### Next.js統合
- OpenNext Cloudflareアダプター経由で統合
- `next/image`のカスタムローダーとして利用可能
- `wrangler.jsonc`でIMAGESバインディング設定
- 公式ドキュメントあり（やや限定的）

#### 長所
- ✅ Cloudflareエコシステム内で完結
- ✅ Workers/Pagesとのシームレスな統合
- ✅ 画像最適化機能が標準装備
- ✅ 変換課金が30日単位でユニーク（同じ変換は1回のみ課金）

#### 短所
- ❌ 無料プランは外部画像の変換のみ（保存不可）
- ❌ DAM機能が限定的
- ❌ SDK・ドキュメントがCloudinaryより少ない
- ❌ 有料プランは少量でも$5/月から開始

#### 推奨度
⭐⭐⭐⭐☆ (4/5)

**理由**: Cloudflareエコシステムとの親和性が高く、画像最適化機能も充実。無料プランが保存非対応な点が課題。

---

## 比較表

| 項目 | Cloudinary | Cloudflare R2 | Cloudflare Images |
|-----|-----------|---------------|-------------------|
| **無料プラン** | 25GB保存 + 25GB帯域 + 25K変換 | 10GB保存 + 無制限帯域 | 5K変換のみ（保存なし） |
| **有料開始価格** | $89/月 | 従量課金（$0.015/GB） | $5/10万画像/月 |
| **画像最適化** | ✅ 高機能 | ❌ 別途実装 | ✅ 標準装備 |
| **画像変換** | ✅ 豊富 | ❌ 別途実装 | ✅ 標準装備 |
| **DAM機能** | ✅ 充実 | ❌ なし | ⚠️ 限定的 |
| **SDK充実度** | ✅ 非常に高い | ⚠️ S3互換 | ⚠️ 限定的 |
| **Next.js統合** | ✅ 容易 | ⚠️ 中程度 | ⚠️ 中程度 |
| **Cloudflare親和性** | ❌ 低 | ✅ 高 | ✅ 高 |
| **エグレス料金** | 有料（クレジット消費） | ✅ 無料 | 含まれる |
| **動画対応** | ✅ あり | ✅ あり | ❌ なし |

## 検討事項

### トラフィック予測
- 個人技術ブログとして月間PV: 想定〜10,000PV
- 画像配信: 記事あたり平均5画像 → 月50,000画像配信
- 新規画像: 月10記事 × 5画像 = 50画像/月

### 各サービスでの月次コスト試算

#### Cloudinary（現行）
- 50,000配信 + 50アップロード ≈ 0.05クレジット
- **完全に無料枠内に収まる**

#### Cloudflare R2 + Images（変換機能併用）
- R2保存: 10GB以下 → 無料
- R2配信: 無制限無料
- Images変換: 5,000回以下 → 無料
- **完全に無料枠内に収まる**

#### Cloudflare Images単体
- 保存: 500画像 → $0.025/月（最低$5/月）
- 配信: 50,000回 → $0.50/月
- **最低$5.50/月の費用発生**

## 推奨案

### シナリオ1: 現状維持（短期）⭐⭐⭐⭐⭐
**Cloudinaryを継続利用**

#### 理由
- 既に完全に動作している
- 無料枠で十分に収まる規模
- 優れた開発者体験
- 移行コストがゼロ

#### 推奨度: ⭐⭐⭐⭐⭐ (5/5)
現時点で移行する明確な理由がない。

---

### シナリオ2: Cloudflareエコシステム統合（中長期）⭐⭐⭐⭐☆
**Cloudflare R2 + Cloudflare Images（変換）の組み合わせ**

#### 理由
- Cloudflareエコシステム内で完結
- エグレス無料でスケーラブル
- 無料枠で継続可能
- Workers統合でエッジ処理可能

#### 実装方針
1. R2バケットで画像保存
2. Cloudflare Images変換機能で最適化
3. Workers経由で配信

#### 推奨度: ⭐⭐⭐⭐☆ (4/5)
将来的なトラフィック増加を見据えた場合に有力。ただし実装コストが発生。

---

### シナリオ3: Cloudflare Images単体 ⭐⭐☆☆☆
**推奨しない**

#### 理由
- 無料プランでは保存不可
- 最低$5/月のコスト発生
- 小規模ブログには過剰

#### 推奨度: ⭐⭐☆☆☆ (2/5)
コストメリットがない。

## 決定

### 現時点の推奨
**Cloudinaryの継続利用**

#### 決定理由
1. 現在完全に動作しており、無料枠内で運用可能
2. 優れた開発者体験とサポート
3. 小規模ブログではトラフィックコストが問題にならない
4. 移行コストを正当化する明確な理由がない

### 将来的な検討条件
以下のいずれかに該当する場合、Cloudflare R2 + Imagesへの移行を検討：

1. 月間帯域幅が25GBを超え始めた場合
2. Cloudflare Workersでのエッジ処理が必要になった場合
3. Cloudflareエコシステムとの統合による技術的メリットが明確になった場合
4. 動画コンテンツの大量配信が必要になった場合

## 結果・影響

### 短期的影響
- 変更なし
- 開発リソースを他の機能開発に集中可能

### 長期的影響
- トラフィック増加時の再評価が必要
- Cloudflare R2への移行パスは明確（S3互換API）
- 必要に応じて段階的な移行が可能

## 参考資料

### Cloudinary
- [Cloudinary Pricing](https://cloudinary.com/pricing)
- [Cloudinary Pricing Tiers & Costs (Updated for 2026)](https://thedigitalprojectmanager.com/tools/cloudinary-pricing/)

### Cloudflare R2
- [Cloudflare R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 | Zero Egress Fee Object Storage](https://www.cloudflare.com/developer-platform/products/r2/)
- [Complete Beginner's Guide to Cloudflare R2 Image Hosting (2025)](https://dev.to/leonwong282/the-complete-beginners-guide-to-cloudflare-r2-image-hosting-2025-2g4k)
- [How to Upload Files to Cloudflare R2 in a Next.js App](https://www.buildwithmatija.com/blog/how-to-upload-files-to-cloudflare-r2-nextjs)

### Cloudflare Images
- [Cloudflare Images Pricing](https://developers.cloudflare.com/images/pricing/)
- [Cloudflare Images Pricing - Complete Cost Guide for 2026](https://theimagecdn.com/docs/cloudflare-images-pricing)
- [Image optimization made simpler - Merging Images and Image Resizing](https://blog.cloudflare.com/merging-images-and-image-resizing/)

### 比較記事
- [Cloudflare vs Cloudinary: Comparing Two Approaches to Media Delivery](https://cloudinary.com/guides/vs/cloudflare-vs-cloudinary)
- [CDN Image - Netlify Vs Cloudflare Vs Cloudinary Vs Vercel](https://www.jondjones.com/frontend/jamstack/cdn-image-netlify-vs-cloudflare-vs-cloudinary-vs-vercel/)

## 更新履歴

- 2026-01-20: 初版作成、3サービスの比較検討実施
