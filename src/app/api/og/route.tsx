import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import { SITE_CONFIG } from '../../../../lib/site-config';

// Export const runtime = 'edge'; // Disabled due to WASM compatibility issues

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const title = searchParams.get('title') || SITE_CONFIG.name;
    const category = searchParams.get('category') || '';
    const categories = category ? category.split(',').map((c) => c.trim()) : [];

    const logoUrl = SITE_CONFIG.url.logo;

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e14',
          padding: '40px',
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1d23',
            borderRadius: '12px',
            border: '1px solid #2d3139',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
        >
          {/* Terminal header - window chrome */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              backgroundColor: '#16181d',
              borderBottom: '1px solid #2d3139',
            }}
          >
            {/* Window controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#ff5f56',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#ffbd2e',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#27c93f',
                }}
              />
            </div>

            {/* Terminal title */}
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                fontFamily:
                  '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              }}
            />

            <div style={{ width: '60px' }} />
          </div>

          {/* Terminal content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              padding: '40px',
              fontFamily:
                '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            }}
          >
            {/* Category badges */}
            {categories.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(147, 197, 253, 0.15)',
                      padding: '8px 16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(147, 197, 253, 0.3)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '18px',
                        color: '#93c5fd',
                        fontWeight: '500',
                      }}
                    >
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Title output */}
            <div
              style={{
                display: 'flex',
                flex: '1',
                alignItems: 'center',
                paddingRight: categories.length > 0 ? '100px' : '0',
              }}
            >
              <div
                style={{
                  fontSize: title.length > 60 ? '42px' : title.length > 40 ? '48px' : '54px',
                  fontWeight: '700',
                  color: '#e5e7eb',
                  lineHeight: '1.3',
                  letterSpacing: '-0.02em',
                  fontFamily:
                    '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                }}
              >
                {title}
              </div>
            </div>

            {/* Bottom prompt - blog info */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}
            >
              <div
                style={{
                  height: '1px',
                  backgroundColor: '#2d3139',
                  marginBottom: '8px',
                }}
              />

              <div
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#6ee7b7',
                    }}
                  >
                    $
                  </span>
                  <span
                    style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#93c5fd',
                    }}
                  >
                    {SITE_CONFIG.name}
                  </span>
                </div>

                {/* Logo image */}
                <img
                  src={logoUrl}
                  alt="Logo"
                  width="128"
                  height="128"
                  style={{
                    borderRadius: '8px',
                  }}
                />
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
  } catch (error: unknown) {
    console.log(`Failed to generate the image`, error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
