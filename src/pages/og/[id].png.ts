import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE_CONFIG } from '../../lib/site-config';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { id: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
    },
  }));
}

interface Props {
  title: string;
  category: string;
}

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  return res.arrayBuffer();
}

export async function GET({ props }: { props: Props }) {
  const { title, category } = props;

  let fontData: ArrayBuffer;
  try {
    // Noto Sans JP for Japanese text support
    fontData = await fetchFont(
      'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files/noto-sans-jp-japanese-700-normal.woff',
    );
  } catch {
    // Fallback to Inter if Japanese font fails
    fontData = await fetchFont(
      'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff',
    );
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e14',
          padding: '40px',
        },
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1d23',
              borderRadius: '12px',
              border: '1px solid #2d3139',
              overflow: 'hidden',
            },
            children: [
              // Terminal header
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    backgroundColor: '#16181d',
                    borderBottom: '1px solid #2d3139',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: { display: 'flex', gap: '8px' },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#ff5f56',
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#ffbd2e',
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#27c93f',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              // Terminal content
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    padding: '40px',
                  },
                  children: [
                    // Category badge
                    category
                      ? {
                          type: 'div',
                          props: {
                            style: { display: 'flex', marginBottom: '32px' },
                            children: {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  backgroundColor: 'rgba(147, 197, 253, 0.15)',
                                  padding: '8px 16px',
                                  borderRadius: '16px',
                                  border: '1px solid rgba(147, 197, 253, 0.3)',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '18px',
                                      color: '#93c5fd',
                                      fontWeight: '500',
                                    },
                                    children: category,
                                  },
                                },
                              },
                            },
                          },
                        }
                      : null,
                    // Title
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flex: '1',
                          alignItems: 'center',
                        },
                        children: {
                          type: 'div',
                          props: {
                            style: {
                              fontSize:
                                title.length > 60 ? '42px' : title.length > 40 ? '48px' : '54px',
                              fontWeight: '700',
                              color: '#e5e7eb',
                              lineHeight: '1.3',
                              letterSpacing: '-0.02em',
                              wordBreak: 'break-word',
                            },
                            children: title,
                          },
                        },
                      },
                    },
                    // Footer
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          marginTop: '32px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                height: '1px',
                                backgroundColor: '#2d3139',
                                marginBottom: '8px',
                              },
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                              },
                              children: {
                                type: 'div',
                                props: {
                                  style: { display: 'flex', alignItems: 'center', gap: '12px' },
                                  children: [
                                    {
                                      type: 'span',
                                      props: {
                                        style: { fontSize: '18px', color: '#6ee7b7' },
                                        children: '$',
                                      },
                                    },
                                    {
                                      type: 'span',
                                      props: {
                                        style: {
                                          fontSize: '22px',
                                          fontWeight: '600',
                                          color: '#93c5fd',
                                        },
                                        children: SITE_CONFIG.name,
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansJP',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
