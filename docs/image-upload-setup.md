# Image Upload Setup Guide (Cloudflare R2)

Article images are stored in a Cloudflare R2 bucket and uploaded with a local-only tool (`tools/upload-server`). This tool is never deployed to Cloudflare Workers — it only runs on your machine.

## 1. R2 bucket

The bucket already exists (created via `wrangler r2 bucket create`):

- Bucket name: `blog-images`
- Public URL (r2.dev): `https://pub-82105e10155943639213a37345c35eb7.r2.dev`

If you need to recreate it:

```bash
npx wrangler r2 bucket create blog-images
npx wrangler r2 bucket dev-url enable blog-images
```

## 2. Create an R2 API token

The upload tool talks to R2 through its S3-compatible API, which requires an R2 API token (Access Key ID / Secret Access Key). This can't be created via `wrangler` — create it from the dashboard:

1. Go to the Cloudflare dashboard → **R2** → **Manage API tokens**
2. **Create API token**
3. Permissions: **Object Read & Write**
4. Scope it to the `blog-images` bucket only (avoid account-wide access)
5. Copy the **Access Key ID** and **Secret Access Key** shown after creation (the secret is shown only once)

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
R2_ACCOUNT_ID=a46d1dc43de379dd3295256651d6f077
R2_ACCESS_KEY_ID=<from step 2>
R2_SECRET_ACCESS_KEY=<from step 2>
R2_BUCKET_NAME=blog-images
R2_PUBLIC_URL=https://pub-82105e10155943639213a37345c35eb7.r2.dev
```

## 4. Upload images

```bash
pnpm upload
```

Open http://localhost:3333, drop an image in, and copy the generated Markdown snippet into your article.

See [ADR 001](adrs/001-image-hosting-service-selection.md) and [ADR 004](adrs/004-image-upload-approach.md) for why R2 and this local-tool approach were chosen.
