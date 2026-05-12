import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SatoriNode = any;

const FONT_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files/noto-sans-jp-japanese-700-normal.woff';
const FALLBACK_FONT_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff';

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${res.status}`);
  }
  return res.arrayBuffer();
}

async function loadFont(): Promise<ArrayBuffer> {
  try {
    return await fetchFont(FONT_URL);
  } catch {
    return await fetchFont(FALLBACK_FONT_URL);
  }
}

function getLogoDataUrl(): string {
  const logoBuffer = readFileSync(resolve(process.cwd(), 'public/logo.png'));
  return `data:image/png;base64,${logoBuffer.toString('base64')}`;
}

function trafficLightDot(color: string): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: color,
      },
    },
  };
}

function terminalHeader(): SatoriNode {
  return {
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
            trafficLightDot('#ff5f56'),
            trafficLightDot('#ffbd2e'),
            trafficLightDot('#27c93f'),
          ],
        },
      },
    },
  };
}

function footer(text: string, logoDataUrl: string): SatoriNode {
  return {
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
            children: [
              {
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
                        children: text,
                      },
                    },
                  ],
                },
              },
              {
                type: 'img',
                props: {
                  src: logoDataUrl,
                  style: {
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function categoryBadge(category: string): SatoriNode {
  return {
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
  };
}

function titleFontSize(title: string, hasSubtitle: boolean): string {
  if (hasSubtitle) {
    return '72px';
  }
  if (title.length > 60) {
    return '42px';
  }
  if (title.length > 40) {
    return '48px';
  }
  return '54px';
}

function titleLineHeight(hasSubtitle: boolean): string {
  if (hasSubtitle) {
    return '1.2';
  }
  return '1.3';
}

function titleBlock(title: string, subtitle: string | undefined): SatoriNode {
  const hasSubtitle = Boolean(subtitle);
  const titleNode: SatoriNode = {
    type: 'div',
    props: {
      style: {
        fontSize: titleFontSize(title, hasSubtitle),
        fontWeight: '700',
        color: '#e5e7eb',
        lineHeight: titleLineHeight(hasSubtitle),
        letterSpacing: '-0.02em',
        wordBreak: 'break-word',
      },
      children: title,
    },
  };

  if (!subtitle) {
    return titleNode;
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', gap: '20px' },
      children: [
        titleNode,
        {
          type: 'div',
          props: {
            style: {
              fontSize: '28px',
              color: '#9ca3af',
              lineHeight: '1.4',
            },
            children: subtitle,
          },
        },
      ],
    },
  };
}

interface RenderOgImageOptions {
  title: string;
  subtitle?: string;
  category?: string;
  footerText: string;
}

export async function renderOgImage({
  title,
  subtitle,
  category,
  footerText,
}: RenderOgImageOptions): Promise<Response> {
  const logoDataUrl = getLogoDataUrl();
  const fontData = await loadFont();

  const bodyChildren: SatoriNode[] = [];
  if (category) {
    bodyChildren.push(categoryBadge(category));
  }
  bodyChildren.push({
    type: 'div',
    props: {
      style: { display: 'flex', flex: '1', alignItems: 'center' },
      children: titleBlock(title, subtitle),
    },
  });

  const body: SatoriNode = {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', flex: '1' },
      children: bodyChildren,
    },
  };

  const tree: SatoriNode = {
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
            terminalHeader(),
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1',
                  padding: '40px',
                },
                children: [body, footer(footerText, logoDataUrl)],
              },
            },
          ],
        },
      },
    },
  };

  const svg = await satori(tree, {
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
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
