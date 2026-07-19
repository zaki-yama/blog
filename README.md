# Technical Blog

A modern technical blog built with Astro and deployed on Cloudflare Workers, designed for sharing programming knowledge and learning experiences.

## Features

- ✅ **Static Site Generation**: Fast loading with pre-rendered pages
- ✅ **Markdown Support**: Write articles in pure Markdown with frontmatter
- ✅ **Syntax Highlighting**: Code blocks with Shiki highlighting
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **SEO Optimized**: Meta tags, sitemap, RSS feed, robots.txt
- ✅ **Google Analytics**: Integrated tracking with GA4
- ✅ **Edge Deployment**: Deployed on Cloudflare Workers for global performance

## Getting Started

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) to view the site

### Writing Articles

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter:
   ```markdown
   ---
   title: 'Your Article Title'
   date: '2024-06-28'
   category: 'Category Name'
   description: 'Article description'
   ---
   
   Your article content here...
   ```

3. The article will automatically appear on the homepage after build

## Configuration

### Google Analytics Setup

The GA4 measurement ID is defined as a constant in [`src/lib/site-config.ts`](src/lib/site-config.ts) (`SITE_CONFIG.analytics.gaId`). It is only injected into production builds (`import.meta.env.PROD`) — `pnpm dev` / `astro preview` never load the GA script, so local traffic is never tracked.

To change the measurement ID, edit `SITE_CONFIG.analytics.gaId` directly.

For details on why this is a build-time constant rather than an environment variable, see [docs/google-analytics-setup.md](docs/google-analytics-setup.md).

### Image Upload (local only)

Article images are hosted on Cloudflare R2. Uploading is done with a local-only tool (`tools/upload-server`) that never gets deployed — see [docs/image-upload-setup.md](docs/image-upload-setup.md) for setting up an R2 API token.

```bash
cp .env.local.example .env.local
# Edit .env.local and add your R2 credentials
pnpm upload
# Open http://localhost:3333
```

### Environment Variables

- `PUBLIC_SITE_URL`: Overrides the site URL used for canonical links (optional; falls back to `SITE_CONFIG.url.base` in `src/lib/site-config.ts`)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`: Cloudflare R2 credentials, used only by the local `pnpm upload` tool (not read by the Astro build)

Note: this project is a fully static Astro site (`output: 'static'`, no adapter). `astro build` runs entirely at build time, so only environment variables present in the shell (or an `.env` file) *at build time* take effect — values set in `wrangler.jsonc`'s `vars` are never read, since there is no server-side Worker script to read them.

## Deployment

This project is configured for Cloudflare Workers deployment:

```bash
# Build and deploy
pnpm run deploy

# Preview deployment
pnpm run preview
```

## Project Structure

```
├── src/
│   ├── pages/         # Astro pages (file-based routing)
│   ├── layouts/       # Astro layouts
│   ├── components/    # UI components
│   └── lib/           # Utility functions
├── posts/            # Blog articles (Markdown)
├── docs/             # Documentation and work logs
├── todo.md           # Task management
└── wrangler.jsonc    # Cloudflare Workers configuration
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm run deploy` - Build and deploy to Cloudflare Workers
- `pnpm preview` - Preview the built site locally
- `pnpm upload` - Start the local-only image upload tool (see [docs/image-upload-setup.md](docs/image-upload-setup.md))

### Favicon Generation

Generate favicon files from any image:

```bash
# Generate from image file
./scripts/generate-favicon.sh path/to/your/image.png

# Generate to specific directory
./scripts/generate-favicon.sh path/to/your/image.png public/

# Example
./scripts/generate-favicon.sh assets/logo.png
```

This script generates:
- `favicon.png` (original size)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `src/app/favicon.ico`

## Tech Stack

- **Framework**: Astro (static output)
- **Styling**: Tailwind CSS 4
- **Syntax Highlighting**: Shiki
- **Deployment**: Cloudflare Workers (static assets)
- **Analytics**: Google Analytics 4
- **Content**: Markdown with gray-matter

## License

MIT License - see LICENSE file for details.