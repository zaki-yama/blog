# ADR 003: ホスティングプラットフォームとフレームワークの再選定

## ステータス

承認済み・実装完了（2026-03-31）

> ※ 当初の提案（2026-02-15）では **Astro + Netlify** を推奨していたが、実装時に **Astro + Cloudflare Workers (static output)** を採用した。詳細は「決定の修正」セクションを参照。

## コンテキスト

現在、Next.jsで構築した技術ブログを`@opennextjs/cloudflare`を使用してCloudflare Workersにデプロイしています。しかし、Cloudflare Workersには以下の制約があり、今後の運用に支障をきたす可能性があります。

### 現状の課題（Cloudflare Workers）

- **Workerサイズ制限**: 無料プランで3 MB、有料プランで10 MBまで
- **静的アセット制限**: 無料プランで20,000ファイル、有料プランで100,000ファイルまで
- **メモリ制限**: 128 MBのメモリ制限により大規模な処理が困難
- **CPUタイム制限**: 無料プランで10ms、有料プランでも5分（HTTPリクエスト）
- **リクエスト数制限**: 無料プランで100,000リクエスト/日、1,000リクエスト/分
- **サブリクエスト制限**: 無料プランで50/リクエスト、有料プランで10,000/リクエスト

### 要件

- 無料で利用可能であること（個人ブログのため）
- Markdownベースの記事執筆をサポート
- 高速なビルドとデプロイ
- 良好なパフォーマンス（Core Web Vitals）
- メンテナンスコストが低いこと

## 決定

当初の提案からの修正あり。

### 当初の提案（2026-02-15）: Astro + Netlify

フレームワークを Next.js から Astro に移行し、ホスティングを Cloudflare Workers から Netlify に変更する。

### 実際の決定（2026-03-31）: Astro + Cloudflare Workers (static output)

フレームワークを **Astro** に移行する点は同じだが、ホスティングは **Cloudflare Workers のまま**とする。

#### 修正の理由

- `@opennextjs/cloudflare` を使った Next.js 構成では Worker JS バンドルに記事コンテンツが埋め込まれていたが、**Astro の `output: 'static'` を使えば Worker JS 自体が不要になる**ことが判明
- Cloudflare Workers の Static Assets 配信を利用することで、Worker サイズ問題を根本解決できる
- カスタムドメイン（blog.zaki-yama.dev）や wrangler 設定など既存インフラをそのまま活用できる
- Netlify への移行は不要なコストとなる

#### 実測結果

| 指標 | 移行前 (Next.js) | 移行後 (Astro) |
|---|---|---|
| Worker Upload (raw) | 8,110 KiB | **0.34 KiB** |
| Worker Upload (gzip) | 2,208 KiB | **0.24 KiB** |
| デプロイ形式 | Worker JS + Static Assets | **Static Assets のみ** |

### リスク認識

- Astroへの移行作業が必要（実施済み）
- admin ページ + Cloudinary 画像アップロード機能は静的出力では動作しないため別途対応が必要（issue #20）

## 検討した選択肢

### フレームワークの選択肢

#### 1. Next.js（現状維持）

**概要**
Reactベースのメタフレームワーク。現在使用中。

**主な特徴**
- App Router、Server Components、ISRなどの先進的な機能
- 充実したエコシステムとコミュニティ
- Vercelによる公式サポート

**長所**
- ✅ React生態系の知識を活用可能
- ✅ 動的な機能が必要になった場合に対応しやすい
- ✅ 豊富なドキュメントとコミュニティサポート

**短所**
- ❌ 静的サイトでもReactランタイムが必要（~85KB gzipped）
- ❌ ビルド時間が比較的長い（1000ページで~52秒）
- ❌ 技術ブログには過剰な機能

**評価**
⭐⭐⭐（機能豊富だが、技術ブログには過剰）

---

#### 2. Astro

**概要**
ゼロJavaScriptを標準とする静的サイトジェネレーター。"Islands Architecture"により必要な部分だけインタラクティブにできる。

**主な特徴**
- デフォルトでゼロJS、必要に応じて部分的にハイドレーション
- Markdown/MDX完全サポート
- React、Vue、Svelteなど複数のUIフレームワークを同時使用可能
- 優れたパフォーマンス

**長所**
- ✅ Next.jsと比較して90%少ないJavaScript
- ✅ 40%高速なページロード
- ✅ ビルド時間が3倍速い（1000ページで~18秒）
- ✅ Lighthouse Performance score 95+
- ✅ Markdownファーストの設計
- ✅ 技術ブログに最適化された設計

**短所**
- ❌ Next.jsからの移行コストが発生
- ❌ 動的機能が必要になった場合の対応が限定的

**評価**
⭐⭐⭐⭐⭐（技術ブログに最適）

---

#### 3. Hugo

**概要**
Go言語で書かれた超高速な静的サイトジェネレーター。

**主な特徴**
- ミリ秒単位でのビルド（最速クラス）
- 豊富なテーマエコシステム
- Markdown完全サポート
- バイナリ一つで動作（依存関係なし）

**長所**
- ✅ 圧倒的なビルド速度
- ✅ シンプルで軽量
- ✅ 依存関係が少なく保守が容易
- ✅ 大規模サイトでも高速

**短所**
- ❌ Go Templatesの学習コストが高い
- ❌ JavaScriptフレームワークとの統合が弱い
- ❌ Next.jsからの移行コストが大きい

**評価**
⭐⭐⭐⭐（速度重視の場合の選択肢）

---

### ホスティングプラットフォームの選択肢

#### 1. Vercel

**概要**
Next.jsの開発元が提供するホスティングプラットフォーム。

**無料枠**
- 100GB 帯域幅/月
- 6,000分 ビルド時間/月
- 100 GB hours サーバーレス関数実行時間/月
- 50 ドメイン/プロジェクト

**長所**
- ✅ Next.jsとの完璧な統合
- ✅ 高速なEdge Network
- ✅ 優れた開発者体験
- ✅ 自動プレビューデプロイ
- ✅ 十分な無料枠

**短所**
- ❌ 商用利用は有料プランが必須
- ❌ 1M PV超えると高額（$500+/月）

**評価**
⭐⭐⭐⭐（Next.js継続なら最適、個人ブログなら無料枠で十分）

---

#### 2. Netlify

**概要**
Jamstackに最適化されたホスティングプラットフォーム。

**無料枠**
- 100GB 帯域幅/月
- 300分 ビルド時間/月
- サーバーレス関数対応
- フォーム処理、Identity機能

**長所**
- ✅ 個人ブログなら商用利用可能
- ✅ Astro、Hugoなど幅広いフレームワーク対応
- ✅ ビルトイン機能が豊富
- ✅ 優れたドキュメント

**短所**
- ❌ ビルド時間が月300分と少ない
- ❌ Vercelと比較するとNext.jsの統合が弱い

**評価**
⭐⭐⭐⭐⭐（バランスが良く、Astro/Hugoとの相性も良好）

---

#### 3. GitHub Pages

**概要**
GitHubが提供する静的サイトホスティングサービス。

**無料枠**
- 完全無料
- 1GB ストレージ
- 月100GB 帯域幅
- 月10ビルド（または手動デプロイ）

**長所**
- ✅ 完全無料
- ✅ GitHubリポジトリと統合
- ✅ シンプルで安定
- ✅ 個人ブログには十分

**短所**
- ❌ ビルド機能が限定的（GitHub Actionsと組み合わせる必要）
- ❌ サーバーレス関数非対応
- ❌ カスタムヘッダー設定が制限的

**評価**
⭐⭐⭐⭐（完全静的サイトなら最適、Hugoと相性良好）

---

#### 4. Cloudflare Pages

**概要**
Cloudflareが提供する静的サイトホスティング。Workers統合も可能。

**無料枠**
- 無制限のリクエスト数
- 無制限の帯域幅
- 500 ビルド/月
- Cloudflare Workersとの統合

**長所**
- ✅ 無制限の帯域幅
- ✅ グローバルCDN
- ✅ Workersの制限を回避できる
- ✅ 高速なデプロイ

**短所**
- ❌ Cloudflare Workersの制限がPages Functions にも一部適用
- ❌ ビルド時間制限（20分/ビルド）

**評価**
⭐⭐⭐⭐（Cloudflareエコシステムを使い続けたい場合）

---

#### 5. AWS Amplify

**概要**
AWSが提供するフルマネージドホスティングサービス。Next.js SSRやSSGに対応。

**無料枠**
- 1,000 ビルド分/月
- 15GB データ転送/月
- 5GB ストレージ/月
- **新規ユーザー**: 6ヶ月間$200のクレジット（2025年7月15日以降）

**有料時の料金**
- ストレージ: $0.023/GB/月
- データ転送: $0.15/GB
- ビルド時間: $0.01/分

**長所**
- ✅ Next.js 12-15の完全サポート（SSR、画像最適化、Middleware）
- ✅ AWSエコシステムとの統合
- ✅ 新規ユーザー向けの充実したクレジット
- ✅ サイドプロジェクトに十分な無料枠

**短所**
- ❌ Vercel/Netlifyと比較して設定が複雑
- ❌ ビルド時間が無料枠1,000分と少ない
- ❌ データ転送料金が高め（$0.15/GB）

**評価**
⭐⭐⭐（AWSエコシステム利用者向け）

---

#### 6. AWS Lambda + S3 + CloudFront

**概要**
AWS Lambda（サーバーレス関数）とS3（静的ファイル）、CloudFront（CDN）を組み合わせた構成。

**無料枠（Always Free）**
- **Lambda**: 100万リクエスト/月、400,000 GB秒のコンピューティング時間/月
- **S3**: 5GB ストレージ、20,000 GETリクエスト、2,000 PUTリクエスト/月（12ヶ月間）
- **CloudFront**: 1TB データ転送/月（2026年拡張）、10,000,000 HTTPSリクエスト/月

**長所**
- ✅ Lambdaの無料枠が永久に利用可能
- ✅ 拡張性が非常に高い
- ✅ CloudFrontの1TB無料転送は非常に充実
- ✅ 軽量なアプリケーションなら無料枠で十分

**短所**
- ❌ 設定が複雑（複数のAWSサービスを組み合わせる必要）
- ❌ デプロイパイプラインを自分で構築する必要
- ❌ S3の無料枠は12ヶ月限定

**評価**
⭐⭐⭐（技術力があり、コスト最適化重視の場合）

---

#### 7. Firebase Hosting

**概要**
Googleが提供する静的サイトホスティングサービス。

**無料枠（Sparkプラン）**
- 1GB ストレージ
- 10GB データ転送/月

**長所**
- ✅ シンプルで使いやすい
- ✅ Googleエコシステムとの統合
- ✅ CDN自動配信
- ✅ カスタムドメイン対応

**短所**
- ❌ データ転送が10GB/月と少ない
- ❌ サーバーレス関数はCloud Run/Cloud Functionsが必要（別料金）
- ❌ 動的機能が必要な場合は有料プラン必須

**評価**
⭐⭐⭐（小規模な完全静的サイト向け）

---

#### 8. Google Cloud Run

**概要**
Googleのコンテナベースサーバーレスプラットフォーム。Next.jsなど動的アプリケーションに対応。

**無料枠（Always Free）**
- 180,000 vCPU秒/月（約50時間のCPU時間）
- 360,000 GiB秒/月（1GiBコンテナで約100時間）
- 200万リクエスト/月
- 1GB データ転送/月（北米内）

**注意事項**
- 無料枠は特定リージョン（us-central1, us-east1, us-west1）のみ

**長所**
- ✅ コンテナベースで柔軟性が高い
- ✅ Next.jsのSSRに完全対応
- ✅ スケーラビリティが高い
- ✅ 無料枠が永久に利用可能

**短所**
- ❌ データ転送が1GB/月と少ない
- ❌ 設定が複雑（Dockerfileが必要）
- ❌ 特定リージョンでないと無料枠が適用されない

**評価**
⭐⭐（動的機能が必要で技術力がある場合）

---

## 総合比較表

### 主要制限の詳細比較

| プラットフォーム | データ転送/月 | デプロイサイズ制限 | 個別ファイル制限 | ビルド時間/月 | ファイル数制限 | ストレージ | 関数サイズ制限 | 評価 |
|---|---|---|---|---|---|---|---|---|
| **Cloudflare Workers** (現在) | 無制限 | 3MB(無料)<br>10MB(有料) | 25MiB | - | 静的アセット:<br>無料20,000<br>有料100,000 | - | 3MB(無料)<br>10MB(有料) | ⭐⭐ |
| **Vercel** (無料) | 100GB | ソース100MB<br>出力16,000ファイル | 制限なし | 6,000分 | ソース12,500<br>出力16,000 | - | 250MB(解凍)<br>50MB(圧縮) | ⭐⭐⭐⭐ |
| **Netlify** (無料) | 100GB | 実質無制限 | 100MB(Large Media) | 300分 | 実質無制限 | 10GB | 250MB(解凍)<br>50MB(圧縮) | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | 100GB(soft) | 1GB(推奨) | 100MB | 10回/時<br>10分/ビルド | - | 1GB | 非対応 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | 無制限 | 無制限(ファイル数のみ) | 25MiB | 500回/月<br>20分/ビルド | 無料20,000<br>有料100,000 | - | 3MB(無料)<br>10MB(有料) | ⭐⭐⭐⭐ |
| **AWS Amplify** | 15GB | 220MB(SSR)<br>それ以外は大きい | 制限なし | 1,000分 | 制限なし | 5GB | - | ⭐⭐⭐ |
| **AWS Lambda+S3+CF** | 1TB(CF)<br>15GB(S3,12ヶ月) | 実質無制限 | 5TB(S3) | - | 制限なし | 5GB(S3) | 250MB(解凍)<br>50MB(圧縮) | ⭐⭐⭐ |
| **Firebase Hosting** | 10GB | 10GB | 2GB | - | 制限なし | 10GB | Cloud Functions別 | ⭐⭐⭐ |
| **Cloud Run** | 1GB(北米) | 実質無制限 | コンテナ依存 | - | 制限なし | - | メモリ制限のみ | ⭐⭐ |

### その他の重要な制限

| プラットフォーム | リクエスト制限 | CPUタイム/実行時間 | メモリ | リクエストボディ | その他の注意点 |
|---|---|---|---|---|---|
| **Cloudflare Workers** (現在) | 無料: 100,000/日<br>1,000/分<br>有料: 無制限 | 無料: 10ms<br>有料: 5分 | 128MB | - | サブリクエスト: 無料50/リクエスト、有料10,000/リクエスト |
| **Vercel** | 無制限 | - | - | 4.5MB | 商用利用は有料プラン必須 |
| **Netlify** | 無制限 | 10秒(26秒まで延長可) | - | 6MB | Edge Functions: 20MB圧縮、50ms CPU |
| **GitHub Pages** | 無制限 | 10分(ビルド) | - | - | 完全静的のみ、サーバーレス関数非対応 |
| **Cloudflare Pages** | 無制限 | 20分(ビルド) | - | - | Pages Functions: CPUタイム10ms(無料)、5分(有料) |
| **AWS Amplify** | 無制限 | - | - | - | SSRアプリは220MB制限あり |
| **AWS Lambda+S3+CF** | Lambda: 100万/月 | Lambda: 15分 | Lambda: 最大10GB | 6MB(Lambda) | 設定が複雑、複数サービス統合必要 |
| **Firebase Hosting** | 無制限 | - | - | - | Cloud Functions: 別料金、10MB(圧縮) |
| **Cloud Run** | 200万/月(無料枠) | - | 最大32GiB | 32MB(デフォルト) | 特定リージョンのみ無料枠適用 |

### 技術ブログに最適な選択

**現在のCloudflare Workers (⭐⭐) の課題:**
- ❌ Workerサイズが非常に小さい（無料3MB、有料10MB）
- ❌ CPUタイムが極端に短い（無料10ms、有料でも5分）
- ❌ リクエスト制限が厳しい（無料: 100,000/日、1,000/分）
- ❌ Next.jsなど大規模フレームワークとの相性が悪い
- ⚠️ サブリクエスト制限（無料50/リクエスト）も制約となる

→ **移行が必要な理由**: プロジェクトが成長すると、これらの制限に容易に到達する可能性が高い

---

**データから見る推奨順位:**

1. **Netlify** ⭐⭐⭐⭐⭐
   - ✅ 100GBの十分なデータ転送
   - ✅ デプロイサイズ実質無制限
   - ✅ 10GBストレージ
   - ⚠️ ビルド時間300分（記事更新頻度が低ければ問題なし）

2. **Vercel** ⭐⭐⭐⭐
   - ✅ 6,000分の豊富なビルド時間
   - ✅ 100GBデータ転送
   - ⚠️ 商用利用制限（収益化ブログは要注意）
   - ⚠️ ファイル数制限あり

3. **Cloudflare Pages** ⭐⭐⭐⭐
   - ✅ 無制限のデータ転送
   - ✅ 500回/月のビルド
   - ⚠️ 個別ファイル25MiB制限
   - ⚠️ 無料プランは20,000ファイル制限

4. **GitHub Pages** ⭐⭐⭐⭐
   - ✅ 完全無料
   - ✅ シンプル
   - ❌ サーバーレス関数非対応
   - ⚠️ 1GBデプロイサイズ制限

5. **AWS/Google Cloud** ⭐⭐⭐〜⭐⭐
   - ❌ 設定が複雑
   - ❌ データ転送が少ない（特にCloud Run: 1GB）
   - ❌ 個人ブログには過剰

**結論**:
- 現在のCloudflare Workersは**Workerサイズ3MB**と**CPUタイム10ms**の制限が厳しく、技術ブログの成長を阻害する
- **Astro + Netlify** への移行が最適：デプロイサイズ実質無制限、100GBデータ転送、関数サイズ250MB（Workersの83倍以上）
- Cloudflare Workersと比較して、Netlifyは制限がはるかに緩く、Next.jsやAstroなどのモダンフレームワークとの相性が良い
- Vercelもビルド時間が豊富（6,000分）だが、商用利用制限に注意が必要

---

## 推奨される組み合わせ

技術ブログの要件とパフォーマンスを考慮し、以下の組み合わせを推奨します：

### 第一候補: Astro + Netlify

**理由**
1. **Cloudflare Workersの制限を大幅に解消**:
   - Workerサイズ3MB → デプロイサイズ実質無制限
   - CPUタイム10ms → 関数実行時間10秒（26秒まで延長可能）
   - 関数サイズ3MB → 250MB（解凍時、83倍以上）
2. **パフォーマンス**: AstroはデフォルトでゼロJS、技術ブログに最適化されている
3. **開発体験**: Markdownファーストで記事執筆が容易
4. **移行コスト**: Reactコンポーネントも使用可能で段階的な移行が可能
5. **ホスティング**: Netlifyの無料枠は個人ブログに十分、商用利用も可能
6. **将来性**: 必要に応じてインタラクティブ機能を追加可能

**移行の容易性**
- 既存のMarkdownファイルをそのまま使用可能
- 必要に応じてReactコンポーネントを移植可能
- ビルドスクリプトの変更程度で対応可能

---

### 第二候補: Astro + Vercel

**理由**
1. Vercelの優れた開発者体験
2. Astroの公式サポート
3. より多いビルド時間（6,000分 vs 300分）

**注意点**
- 商用利用の定義が厳しい（収益化ブログは有料プランが必要になる可能性）

---

### 第三候補: Hugo + GitHub Pages

**理由**
1. **完全無料**: GitHub Pagesは完全無料
2. **最速ビルド**: Hugoのビルド速度は最速クラス
3. **シンプル**: 依存関係が少なく保守が容易

**注意点**
- Go Templatesの学習コスト
- Next.jsからの移行コストが最も大きい

---

## 影響

### ポジティブな影響

- **Worker サイズ問題を解決**: 8,110 KiB → 0.34 KiB（Worker JS が不要になった）
- **記事追加によるサイズ増加がなくなる**: Static Assets として配信されるため Worker 制限と無関係
- **パフォーマンス向上**: Astro の Islands Architecture により JS は最小限
- **シンタックスハイライト**: Shiki 組み込みにより設定がシンプルになった
- **ビルド成果物のシンプル化**: `dist/` 以下の静的ファイルのみ、Worker JS ビルド不要

### ネガティブな影響

- **admin / Cloudinary アップロード機能の喪失**: 静的出力では POST エンドポイントが使えない（issue #20 で別途対応）
- **移行作業コスト**: 実施済み（PR #19）

---

## 参考資料

### ホスティングプラットフォーム比較
- [10 Best Next.js Hosting Providers in 2026](https://makerkit.dev/blog/tutorials/best-hosting-nextjs)
- [Vercel vs Netlify in 2026: Features, Pricing & Use Cases](https://www.clarifai.com/blog/vercel-vs-netlify)
- [6 best free static website hosting services compared](https://appwrite.io/blog/post/best-free-static-website-hosting)
- [Vercel vs Netlify vs AWS Amplify: Which Jamstack Hosting Pricing Model Is Right for You?](https://www.getmonetizely.com/articles/vercel-vs-netlify-vs-aws-amplify-which-jamstack-hosting-pricing-model-is-right-for-you)

### Vercel
- [Vercel Limits (公式ドキュメント)](https://vercel.com/docs/limits)
- [Vercel Functions Limitations](https://vercel.com/docs/functions/limitations)
- [Vercel Pricing](https://vercel.com/pricing)

### Netlify
- [Netlify Functions Overview](https://docs.netlify.com/build/functions/overview/)
- [Netlify Edge Functions Limits](https://docs.netlify.com/build/edge-functions/limits/)
- [Netlify Pricing](https://www.netlify.com/pricing/)

### GitHub Pages
- [GitHub Pages Limits (公式ドキュメント)](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Repository Limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits)

### Cloudflare
- [Cloudflare Workers Limits (公式ドキュメント)](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Pages Limits (公式ドキュメント)](https://developers.cloudflare.com/pages/platform/limits/)
- [Best Cloudflare Workers alternatives in 2026](https://northflank.com/blog/best-cloudflare-workers-alternatives)

### AWS
- [AWS Amplify Pricing](https://aws.amazon.com/amplify/pricing/)
- [AWS Amplify Service Quotas (公式ドキュメント)](https://docs.aws.amazon.com/amplify/latest/userguide/quotas-chapter.html)
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [How to Deploy a Next.js App to AWS with Amplify](https://oneuptime.com/blog/post/2026-02-12-deploy-nextjs-app-to-aws-with-amplify/view)

### Google Cloud
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Hosting Usage Quotas and Pricing (公式ドキュメント)](https://firebase.google.com/docs/hosting/usage-quotas-pricing)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Google Cloud Free Tier](https://cloud.google.com/free)

### フレームワーク比較
- [Astro vs Next.js: The Technical Truth Behind 40% Faster Static Site Performance](https://eastondev.com/blog/en/posts/dev/20251202-astro-vs-nextjs-comparison/)
- [Astro vs NextJS 2026 : Comparison, Features](https://www.aalpha.net/blog/astro-vs-nextjs-comparison/)
- [Our Top 12 picks for Static Site Generators (SSGs) in 2026](https://hygraph.com/blog/top-12-ssgs)
- [Complete Static Site Generators Guide 2026: Best Tools & Tips](https://bloghunter.se/blog/complete-static-site-generators-guide-2026-best-tools-tips)
- [Top 5 Static Site Generators in 2026](https://kinsta.com/blog/static-site-generator/)

### 技術ドキュメント
- [Astro Documentation](https://docs.astro.build/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Hugo Documentation](https://gohugo.io/documentation/)
