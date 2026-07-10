import {
  BlueskyIcon,
  BlueskyShareButton,
  HatenaIcon,
  HatenaShareButton,
  XIcon,
  XShareButton,
} from 'react-share';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-400 dark:text-gray-500">Share:</span>

      <XShareButton url={url} title={title}>
        <XIcon size={32} round />
      </XShareButton>

      <BlueskyShareButton url={url} title={title}>
        <BlueskyIcon size={32} round />
      </BlueskyShareButton>

      <HatenaShareButton url={url} title={title}>
        <HatenaIcon size={32} round />
      </HatenaShareButton>
    </div>
  );
}
