# ADR 004: Astro 移行後の画像アップロード手段

## ステータス

提案中（2026-03-31）

## コンテキスト

Next.js 時代は `/admin` ページ上のドラッグ&ドロップ UI から Cloudinary へアップロードする仕組みがあった。
しかし Astro への移行（ADR 003）で `output: 'static'` を採用したため、サーバーサイドの POST エンドポイント（`/api/upload`）が使えなくなり、この機能は削除された（issue #20）。

Astro 移行後に画像をどのように管理・アップロードするかを決定する必要がある。

## 検討した選択肢

### 選択肢 1: リポジトリ直接配置

画像を `public/images/` または `src/assets/` に置いてコミットする。

**長所**
- ✅ 外部サービス不要・設定ゼロ
- ✅ `src/assets/` 配置なら Astro の `<Image />` でビルド時に WebP 変換・リサイズ最適化が効く
- ✅ 画像がコードと一緒にバージョン管理される
- ✅ Cloudflare の静的アセット CDN でそのまま配信される

**短所**
- ❌ 画像が増えるとリポジトリが肥大化（Git LFS が必要になる可能性）
- ❌ Cloudinary のようなオンデマンド変換（URL パラメータでリサイズ等）は使えない

**評価**: ⭐⭐⭐⭐（画像数が少ない個人ブログには最もシンプル）

---

### 選択肢 2: CLI スクリプトで Cloudinary へアップロード

`scripts/upload.ts` を作成し、コマンドラインから Cloudinary へアップロードする。

```bash
pnpm tsx scripts/upload.ts path/to/image.png
# → https://res.cloudinary.com/... を返す
```

**長所**
- ✅ `output: 'static'` を維持（Worker JS 不要のまま）
- ✅ Cloudinary の CDN・オンデマンド変換を引き続き利用できる
- ✅ 実装コストが低い（既存の `src/lib/cloudinary.ts` を再利用）

**短所**
- ❌ ブラウザ UI がなくなり、CLI 操作に慣れる必要がある
- ❌ アップロード結果の URL をコピペする手順が必要

**評価**: ⭐⭐⭐（シンプルだが UX が低下する）

---

### 選択肢 3: Astro hybrid モード + admin ページ復活

`astro.config.ts` を `output: 'hybrid'` に変更し、admin ページだけサーバーレンダリングにする。

```ts
// src/pages/admin/index.astro
export const prerender = false;
```

**長所**
- ✅ 既存のブラウザ UI（ドラッグ&ドロップ）をほぼそのまま復活できる
- ✅ Cloudinary 連携を維持できる

**短所**
- ❌ Worker JS が復活する（ただし Next.js のような肥大化はない）
- ❌ Astro の設定変更が必要
- ❌ `@astrojs/cloudflare` adapter の導入が必要

**評価**: ⭐⭐⭐（UI を維持できるが Astro 構成が複雑になる）

---

### 選択肢 4: ローカル専用 Node.js サーバー

Astro とは完全に独立した小さなサーバーをローカルで動かし、そこが Cloudinary へのアップロードを処理する。

```bash
# 画像をアップロードしたいときだけ起動
pnpm upload-server
# → ブラウザで http://localhost:3001/admin を開いてドラッグ&ドロップ
```

**長所**
- ✅ `output: 'static'` を維持（Worker JS 不要のまま）
- ✅ ブラウザ UI（ドラッグ&ドロップ）を維持できる
- ✅ Astro の設定に一切影響しない
- ✅ 既存の `ImageUploader` コンポーネントと `cloudinary.ts` を再利用できる

**短所**
- ❌ 画像アップロード時に別プロセスを起動する手間がある
- ❌ サーバーの実装・メンテナンスコストが発生する

**評価**: ⭐⭐⭐⭐（静的出力を維持しつつ UI も確保できるバランス型）

---

## 比較表

| | UI | output: static 維持 | 実装コスト |
|---|---|---|---|
| 1. リポジトリ直接配置 | 不要 | ✅ | 最低 |
| 2. CLI スクリプト | なし | ✅ | 低 |
| 3. hybrid モード | ブラウザ UI | ❌（Worker JS 復活） | 中 |
| 4. ローカル Node.js サーバー | ブラウザ UI | ✅ | 中 |

## 決定

未定

## 影響

未定
