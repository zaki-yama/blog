import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['gray-matter', 'remark', 'remark-html'],
  images: {
    unoptimized: true,
  },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
