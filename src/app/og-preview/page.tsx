export default function OGPreviewPage() {
  const previews = [
    {
      title: "デフォルト",
      params: { title: "zaki-yama's blog" },
    },
    {
      title: "短いタイトル + カテゴリ",
      params: { title: "Next.jsでブログを作成する方法", category: "Next.js" },
    },
    {
      title: "長いタイトル + カテゴリ",
      params: {
        title: "TypeScriptとReactを使った大規模アプリケーション開発のベストプラクティスとパフォーマンス最適化",
        category: "TypeScript",
      },
    },
    {
      title: "カテゴリなし",
      params: { title: "プログラミング学習の始め方" },
    },
    {
      title: "AWS",
      params: { title: "AWS Lambda と DynamoDB で作るサーバーレスアプリケーション", category: "AWS" },
    },
    {
      title: "React",
      params: { title: "React Hooks を使った状態管理の実践", category: "React" },
    },
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: '#1a1a1a' }}>
        OG画像プレビュー
      </h1>

      <div style={{ display: 'grid', gap: '40px' }}>
        {previews.map((preview, index) => {
          const params = new URLSearchParams(preview.params);
          const ogUrl = `/api/og?${params.toString()}`;

          return (
            <div key={index} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                {preview.title}
              </h2>
              <div style={{ marginBottom: '12px' }}>
                <code style={{ fontSize: '14px', color: '#6b7280', backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '4px' }}>
                  {ogUrl}
                </code>
              </div>
              <img
                src={ogUrl}
                alt={preview.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
