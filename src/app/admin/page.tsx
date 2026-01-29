import { notFound } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function AdminPage() {
  // Only allow access in development environment
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Blog Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Upload images for your blog articles</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Image Upload
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload images to Cloudinary and get Markdown code to paste into your articles.
          </p>

          <ImageUploader className="w-full" />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How to use
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Upload an image using the uploader above</li>
            <li>Copy the generated Markdown code</li>
            <li>Paste it into your article&apos;s Markdown file</li>
            <li>The image will be automatically optimized and served via CDN</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
