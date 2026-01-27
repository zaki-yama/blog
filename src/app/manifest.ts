import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "zaki-yama's blog",
    short_name: 'zaki-yama',
    description: 'A blog for sharing programming knowledge and learning experiences',
    start_url: '/',
    display: 'standalone',
    theme_color: '#a8cf45',
    background_color: '#ffffff',
    icons: [
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
