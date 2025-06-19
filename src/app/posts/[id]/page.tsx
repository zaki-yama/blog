import { getAllPostIds, getPostData } from '../../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {postData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
              <span>📅 {postData.date}</span>
              <span>•</span>
              <span>🏷️ {postData.category}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: postData.content }} />
          </div>
        </article>
      </div>
    </main>
  );
}