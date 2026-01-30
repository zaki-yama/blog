import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// export const runtime = 'edge'; // Disabled due to WASM compatibility issues

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const title = searchParams.get('title') || "zaki-yama's blog";
    const category = searchParams.get('category') || '';

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0f1419',
        }}
      >
        {/* Shoebill Blue Border Frame */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            border: '12px solid #8BA5B0',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle geometric background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            background: 'radial-gradient(circle at 20% 80%, rgba(139, 165, 176, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 165, 176, 0.06) 0%, transparent 50%)',
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Category badge in top-right */}
          {category && (
            <div
              style={{
                position: 'absolute',
                top: '80px',
                right: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#8BA5B0',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '500',
                  color: '#8BA5B0',
                  letterSpacing: '0.5px',
                  fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </div>
            </div>
          )}

          {/* Title - centered vertically with improved Japanese typography */}
          <div
            style={{
              display: 'flex',
              flex: '1',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingRight: '100px',
            }}
          >
            <div
              style={{
                fontSize: title.length > 60 ? '52px' : title.length > 40 ? '64px' : '72px',
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: '1.25',
                letterSpacing: '-0.02em',
                fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", YuGothic, "Meiryo", sans-serif',
                // Advanced Japanese line breaking
                wordBreak: 'normal',
                overflowWrap: 'break-word',
                lineBreak: 'strict',
                wordSpacing: '0.05em',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom-left: Logo + Blog name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Logo placeholder - using geometric shape since we can't load images in ImageResponse */}
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#8BA5B0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              🐦
            </div>

            {/* Blog name */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                }}
              >
                zaki-yama.dev
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#8BA5B0',
                  letterSpacing: '0.5px',
                  fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                }}
              >
                Technical Blog
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`Failed to generate the image`, e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
