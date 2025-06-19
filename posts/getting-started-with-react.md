---
title: 'React入門 - 基本概念を理解する'
date: '2024-06-18'
category: 'プログラミング'
description: 'Reactの基本概念であるコンポーネント、props、stateについて詳しく解説します。'
---

# React入門 - 基本概念を理解する

Reactを学び始める際に最初に理解すべき基本概念について説明します。

## Reactとは

ReactはFacebook（現Meta）が開発したJavaScriptライブラリで、ユーザーインターフェース（UI）を構築するために使用されます。

### 主な特徴

- **コンポーネントベース**: UIを再利用可能なコンポーネントに分割
- **宣言的**: 「どのように」ではなく「何を」表示するかを記述
- **Virtual DOM**: 効率的なDOM更新

## 基本概念

### 1. コンポーネント

Reactアプリケーションは複数のコンポーネントで構成されます。

```jsx
// 関数コンポーネント
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// 使用例
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}
```

### 2. Props（プロパティ）

親コンポーネントから子コンポーネントにデータを渡すために使用します。

```jsx
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

> **注意**: propsは読み取り専用です。子コンポーネント内でpropsの値を変更することはできません。

### 3. State（状態）

コンポーネント内で変化するデータを管理するために使用します。

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
      <button onClick={() => setCount(count - 1)}>
        -1
      </button>
    </div>
  );
}
```

## フック（Hooks）

React 16.8で導入されたフックにより、関数コンポーネントでもstateやライフサイクルを扱えるようになりました。

### よく使用されるフック

| フック | 用途 |
|--------|------|
| `useState` | stateの管理 |
| `useEffect` | 副作用の処理 |
| `useContext` | コンテキストの使用 |
| `useMemo` | 値のメモ化 |
| `useCallback` | 関数のメモ化 |

### useEffectの例

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]); // userIdが変更された時に実行

  if (loading) return <div>読み込み中...</div>;
  if (!user) return <div>ユーザーが見つかりません</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## まとめ

Reactの基本概念を理解することで、効率的なWebアプリケーションを構築できるようになります。

> **注意**: この記事は基礎的な内容を扱っています。実際のプロジェクトでは、パフォーマンス最適化やエラーハンドリングなど、より高度なトピックも重要になります。

次回は、Reactのパフォーマンス最適化について詳しく解説する予定です。

---

## 参考リンク

- [React公式ドキュメント](https://react.dev/)
- [React Hooks](https://react.dev/reference/react/hooks)