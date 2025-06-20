'use client';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center space-x-4 py-6 border-t border-gray-200 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Share:</span>
      
      {/* Twitter */}
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Twitter</span>
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare('linkedin')}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span>LinkedIn</span>
      </button>

      {/* Hatena Bookmark */}
      <button
        onClick={() => handleShare('hatena')}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        aria-label="Share on Hatena Bookmark"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.5 8.5h2v7h-2v-7zm1 8.5c-.828 0-1.5-.672-1.5-1.5S9.672 15 10.5 15s1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5-8.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
        </svg>
        <span>はてブ</span>
      </button>
    </div>
  );
}