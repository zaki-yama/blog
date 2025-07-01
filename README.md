# Technical Blog

A modern technical blog built with Next.js 15 and deployed on Cloudflare Workers, designed for sharing programming knowledge and learning experiences.

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
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the site

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

1. Create a Google Analytics 4 property
2. Get your measurement ID (format: `G-XXXXXXXXXX`)
3. Set the environment variable:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your GA ID
   ```

For detailed setup instructions, see [docs/google-analytics-setup.md](docs/google-analytics-setup.md).

### Cloudinary Setup (for Image Upload)

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the Cloudinary dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Set the environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Cloudinary credentials
   ```

### Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Your site URL (required for SEO)
- `NEXT_PUBLIC_GA_ID`: Google Analytics measurement ID (optional)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (required for image upload)
- `CLOUDINARY_API_KEY`: Cloudinary API key (required for image upload)
- `CLOUDINARY_API_SECRET`: Cloudinary API secret (required for image upload)

## Deployment

This project is configured for Cloudflare Workers deployment:

```bash
# Build and deploy
npm run deploy

# Preview deployment
npm run preview
```

### Production Environment Variables

Set these in your Cloudflare Workers environment:
- `NEXT_PUBLIC_SITE_URL`: `https://your-domain.com`
- `NEXT_PUBLIC_GA_ID`: Your Google Analytics ID

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   └── lib/          # Utility functions
├── posts/            # Blog articles (Markdown)
├── docs/             # Documentation and work logs
├── todo.md           # Task management
└── wrangler.jsonc    # Cloudflare Workers configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run preview` - Preview Cloudflare deployment locally

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Syntax Highlighting**: Shiki
- **Deployment**: Cloudflare Workers via OpenNext
- **Analytics**: Google Analytics 4
- **Content**: Markdown with gray-matter

## License

MIT License - see LICENSE file for details.