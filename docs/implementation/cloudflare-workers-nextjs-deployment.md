# Cloudflare Workers Next.js Deployment Research

## Overview

This document investigates the deployment of Next.js applications on Cloudflare Workers, based on official Cloudflare documentation and current best practices for 2024/2025.

## Key Findings

### Cloudflare Workers vs Cloudflare Pages

**Cloudflare Workers:**
- Full-stack applications with server-side functionality
- Edge runtime for API routes and server components
- More complex setup but greater flexibility
- Suitable for applications with dynamic server-side logic

**Cloudflare Pages:**
- Primarily for static sites and JAMstack applications
- Simpler deployment process
- Better for static/mostly static sites
- Automatic builds from Git repositories

### Next.js Support Status

Based on official documentation research:

1. **Next.js App Router Support**: Supported with configuration
2. **Server Components**: Supported on Workers runtime
3. **API Routes**: Fully supported
4. **Static Assets**: Handled through Workers routing
5. **ISR (Incremental Static Regeneration)**: Limited support

## Required Configuration

### 1. Next.js Configuration

Create or update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
  // Enable static exports for static pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### 2. Wrangler Configuration

Create `wrangler.toml`:

```toml
name = "nextjs-blog"
compatibility_date = "2024-01-01"
pages_build_output_dir = "out"

[env.production]
name = "nextjs-blog-production"

[[env.production.vars]]
NEXT_PUBLIC_SITE_URL = "https://your-domain.workers.dev"
```

### 3. Package.json Scripts

Update deployment scripts:

```json
{
  "scripts": {
    "build": "next build",
    "deploy": "wrangler pages publish out",
    "dev": "next dev",
    "start": "next start"
  }
}
```

## Deployment Process

### Prerequisites

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare:**
   ```bash
   wrangler login
   ```

### Step-by-Step Deployment

1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Workers:**
   ```bash
   npx wrangler pages deploy out
   ```

3. **Set Environment Variables:**
   ```bash
   wrangler pages secret put NEXT_PUBLIC_SITE_URL
   ```

## Environment Variables Setup

### Local Development
Create `.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
Set via Wrangler CLI or Cloudflare Dashboard:
```bash
wrangler pages secret put NEXT_PUBLIC_SITE_URL
# Enter: https://your-domain.workers.dev
```

## Limitations and Considerations

### 1. Runtime Limitations
- **Node.js APIs**: Limited to Web APIs and Edge runtime
- **File System**: No access to traditional file system operations
- **Database**: Must use edge-compatible databases (D1, Durable Objects)

### 2. Build Considerations
- **Bundle Size**: Workers have size limitations
- **Cold Starts**: May experience brief delays on first request
- **Memory**: Limited memory compared to traditional servers

### 3. Next.js Features
- **Image Optimization**: Requires external service or manual handling
- **Server Actions**: Supported with edge runtime
- **Middleware**: Fully supported

## Recommended Architecture

For our blog application:

```
Blog Application
├── Static Assets (CSS, JS, Images) → Cloudflare CDN
├── API Routes → Cloudflare Workers
├── Static Pages → Pre-rendered and cached
└── Dynamic Content → Server-side rendering on Workers
```

## Alternative: Cloudflare Pages

For simpler deployment, consider Cloudflare Pages:

1. **Connect GitHub repository**
2. **Set build command:** `npm run build`
3. **Set build output directory:** `out`
4. **Deploy automatically on git push**

## Cost Analysis

- **Workers**: Pay-per-request after free tier (100,000 requests/day)
- **Pages**: Generous free tier (500 builds/month, unlimited requests)
- **Bandwidth**: Free for both options

## Updated Recommendation (2025)

Based on latest Cloudflare documentation:

**Official Cloudflare Stance**: 
> "We recommend using Cloudflare Workers for new projects. For existing Pages projects, see our migration guide and compatibility matrix."

1. **For New Projects (Our Blog)**: **Cloudflare Workers** is now recommended
   - Full Next.js App Router support
   - Better server-side rendering capabilities
   - More flexible for future feature additions
   - Unified platform approach

2. **Why the Change**:
   - Workers now has mature Next.js support
   - Better performance for dynamic content
   - Simpler long-term maintenance
   - Future-proof architecture

## Implemented Configuration

### Actual Implementation (OpenNext.js + Cloudflare Workers)

We have implemented the deployment using **OpenNext.js** which provides optimized Next.js support for Cloudflare Workers:

**Key Files:**
- `wrangler.jsonc`: Workers configuration with OpenNext.js integration
- `open-next.config.ts`: OpenNext.js specific configuration
- `next.config.ts`: Updated with Cloudflare compatibility settings

**Package Configuration:**
```json
{
  "scripts": {
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
  },
  "dependencies": {
    "@opennextjs/cloudflare": "^1.3.1"
  }
}
```

**Wrangler Configuration:**
```json
{
  "name": "nextjs-blog",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  }
}
```

## Deployment Commands

1. **Build and Preview Locally:**
   ```bash
   npm run preview
   ```

2. **Deploy to Production:**
   ```bash
   npm run deploy
   ```

3. **Monitor Deployment:**
   ```bash
   wrangler tail
   wrangler analytics
   ```

## Next Steps

1. **Test Local Build**: Run `npm run preview` to verify functionality
2. **Deploy to Workers**: Execute `npm run deploy`
3. **Verify Deployment**: Check all pages and features work correctly
4. **Configure Domain**: Set up custom domain if desired
5. **Monitor Performance**: Use Wrangler analytics for insights

## References

- [Cloudflare Workers Next.js Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**Created**: 2025-06-19  
**Status**: Research Complete  
**Recommendation**: Start with Cloudflare Pages, consider Workers for future enhancements