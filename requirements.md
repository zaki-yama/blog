# Blog RequirementsAdd commentMore actions

## Site Homepage (/)

### Layout
- The homepage displays articles in a chronological tile layout, inspired by https://mintlify.com/blog
- Each article tile includes:
  - OG image/thumbnail
  - Article title
  - Publication date

### Header
- Header contains icons for:
  - RSS feed
  - GitHub repository link
  - Dark mode toggle

### Categories
- Category listing is pending decision
- May include a link to category overview page

## Article Pages

### Article Header
- Article title
- Publication date and category displayed below the title
- Table of contents sidebar

### Content Features
- **Required**: Syntax highlighting for code blocks
- **Required**: X (Twitter) card embedding/expansion

## SEO & Analytics

### Required Features
- **Google Analytics** integration
- **OGP image auto-generation** - Dynamic generation from article title
- **Social share buttons** (Twitter, LinkedIn, Hatena Bookmark, etc.)

- **Required**: Structured data (JSON-LD) for rich snippets support

## Content Management

### Article Creation Workflow
- **Required**: Adding a new article should only require creating a single .mdx file
- **Required**: No manual HTML/JSX components in article content
- **Required**: No manual updates to mint.json navigation
- **Required**: Automatic metadata extraction from frontmatter
- **Required**: Automatic homepage updates when new articles are added

### Desired Workflow
1. Create new .mdx file in posts/ directory
2. Add frontmatter (title, date, category, description)
3. Write content in pure Markdown
4. Build → Article automatically appears on homepage and in navigation

## Media Management

### Image & Video Storage
- **Cloudinary** integration for image and video management
- Free tier: 25GB storage, 25,000 transformations/month
- Automatic image optimization and responsive delivery
