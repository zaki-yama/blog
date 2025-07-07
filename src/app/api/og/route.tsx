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
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937', // dark gray
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle overlay for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          />
          
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '900px',
              padding: '80px 60px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Category Badge */}
            {category && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  fontWeight: '500',
                  marginBottom: '20px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                }}
              >
                {category}
              </div>
            )}
            
            {/* Main Title */}
            <div
              style={{
                fontSize: title.length > 50 ? '48px' : '60px',
                fontWeight: '800',
                color: 'white',
                lineHeight: '1.3',
                marginBottom: '30px',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textAlign: 'center',
                maxWidth: '800px',
                // 日本語の改行制御
                wordBreak: 'keep-all', // 単語の途中で改行しない
                overflowWrap: 'anywhere', // 必要に応じて改行
                lineBreak: 'strict', // 厳密な改行ルール
                hangingPunctuation: 'allow-end', // 句読点のぶら下がりを許可
              }}
            >
              {title}
            </div>
            
            {/* Blog Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            >
              <span style={{ marginRight: '12px' }}>&lt;/&gt;</span>
              zaki-yama&apos;s blog
            </div>
          </div>
          
          {/* Bottom Decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`Failed to generate the image`, e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}