# Cloudinary Setup Guide

## Prerequisites

This project includes Cloudinary integration for optimized image management and delivery.

## Setup Steps

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address
4. Access your dashboard

### 2. Get API Credentials

1. In your Cloudinary dashboard, go to **Settings** → **API Keys**
2. Copy the following values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Cloudinary credentials:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

### 4. Deploy Configuration

For production deployment, set these environment variables in your hosting platform:

#### Cloudflare Workers

Add to `wrangler.jsonc`:
```json
{
  "vars": {
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": "your-cloud-name",
    "CLOUDINARY_API_KEY": "123456789012345",
    "CLOUDINARY_API_SECRET": "abcdefghijklmnopqrstuvwxyz123456"
  }
}
```

**Note**: For security, consider using Cloudflare Workers secrets for API credentials:
```bash
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
```

## Features Included

### Image Upload
- Drag & drop interface
- File selection dialog
- Progress indicator
- Error handling
- Automatic optimization

### Image Display
- Responsive images with srcSet
- Automatic format selection (WebP/AVIF when supported)
- Quality optimization
- Lazy loading
- Custom transformations

### Image Management
- Organized folder structure (`blog-images/`)
- Automatic backup and CDN delivery
- Image transformation APIs
- Analytics and usage tracking

## Usage

**Important**: The image upload feature is only available in development environment for security reasons.

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Upload Page
Navigate to `http://localhost:3000/admin` to access the image upload interface.

### 3. Upload Images
1. Drag and drop an image file or click "Choose File"
2. Wait for the upload to complete
3. Copy the generated Markdown code
4. Paste into your article's Markdown file

### 4. Example Workflow
1. Upload: `my-article-image.jpg`
2. Get Markdown: `![Image description](https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog-images/my-article-image.jpg)`
3. Paste into article: 
   ```markdown
   # My Article Title
   
   Here's some content with an image:
   
   ![My article illustration](https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog-images/my-article-image.jpg)
   
   More content here...
   ```

## Verification

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Create a test page with the ImageUploader component
3. Upload an image and verify it appears in your Cloudinary dashboard
4. Check that images load with optimized formats and sizes

## Pricing

Cloudinary free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ 25,000 transformations/month
- ✅ Basic image and video management

This is sufficient for most personal blogs and small projects.

## Security Considerations

- API Secret is only used server-side for uploads
- Public images are accessible via CDN URLs
- Consider implementing upload restrictions (file size, type, rate limiting)
- Use signed URLs for private content if needed