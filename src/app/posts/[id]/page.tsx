import { getAllPostIds, getPostData } from '../../../../lib/posts';
import Link from 'next/link';
import SocialShareButtons from '../../../components/SocialShareButtons';
import TableOfContents from '../../../components/TableOfContents';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '../../../../lib/structured-data';
import { generateArticleMetadata } from '../../../../lib/meta-tags';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/posts/${id}`;

  return generateArticleMetadata({
    title: postData.title,
    description: postData.description || postData.title,
    url: currentUrl,
    publishedTime: postData.date,
    category: postData.category,
    author: 'zaki-yama',
  });
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/posts/${id}`;

  const articleJsonLd = generateArticleJsonLd({
    title: postData.title,
    description: postData.description || postData.title,
    author: 'zaki-yama',
    datePublished: postData.date,
    category: postData.category,
    url: currentUrl,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: baseUrl },
    { name: postData.title, url: currentUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 inline-block">
        ← Back to Home
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {postData.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span>📅 {postData.date}</span>
            <span>•</span>
            <span>🏷️ {postData.category}</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: postData.content }} />
        </div>

        <SocialShareButtons 
          title={postData.title}
          url={currentUrl}
          description={postData.description}
        />
      </article>

      <TableOfContents content={postData.content} />
    </div>
    </>
  );
}