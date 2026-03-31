---
title: 'Claude Codeにブログを作ってもらった'
date: '2026-03-23'
category: 'Thoughts'
description: '個人ブログをはてなブログから引っ越しするためにClaude Codeに作ってもらった'
---

## モチベーション

これまではてなブログ（[https://dackdive.hateblo.jp/](https://dackdive.hateblo.jp/)）を愛用していたが、生成AIの台頭によってやっぱりローカルにファイルとして管理できてたほうがいいよな〜という気持ちが高まり、作ることにした。

ブログシステム、細かい機能を作り込んでくと途中でめんどくさくなりそうだなと思っていたけど  
今ならそのへんもClaude Codeが全部やってくれそうだったからというのもある。

## 技術スタック

- フロントエンドフレームワーク：[Next.js](https://nextjs.org/) + [OpenNext](https://opennext.js.org/)
- スタイリング：[Tailwind CSS](https://tailwindcss.com/)
- ホスティング先：[Cloudflare Workers](https://workers.cloudflare.com/)
- 画像ホスティングサービス：[Cloudinary](https://cloudinary.com/)

### [Next.js](https://nextjs.org/) + [OpenNext](https://opennext.js.org/)

慣れてるからというのと、使うことでNext.jsの継続的な勉強になるかなという理由で採用したが、一度土台ができたらNext.jsの機能使いこなすぜというモチベーションにはならないので正直これでなくて良かったように思う。
[Astro](https://astro.build/)や[Hono](https://hono.dev/)にいつか乗り換えてみたい。

### [Cloudflare Workers](https://workers.cloudflare.com/)

無料で運用できるので。  
PagesでなくWorkersなのは、昔「これからは基本Workers使ってね」みたいなポストを見かけたから。

ただ、構築した後で気づいたこととして、Workersは**freeプランだと3MB**までという制限がある。  
記事が増えるといつか上限に達しそう。

ので、どうしようかーというADRを作ってもらってた。保留中。  
[https://github.com/zaki-yama/blog/blob/0f12e696f895148068b38e21db5666827db242fb/docs/adrs/003-hosting-platform-migration.md](https://github.com/zaki-yama/blog/blob/0f12e696f895148068b38e21db5666827db242fb/docs/adrs/003-hosting-platform-migration.md)

### [Cloudinary](https://cloudinary.com/)

これはClaude Codeが画像ホスティング先として選定してくれたので使ってみることにした。  
無料プランだと月25クレジット使えて、1クレジット = 1,000変換 または 1GB保存 または 1GB帯域幅ということらしいのだがよくわからない。

Cloudflare R2にも無料プランに10GB

## 主な機能

- ライトモード／ダークモード
- コードのシンタックスハイライト
- RSSフィード
- OG（Open Graph）画像
- Google Analytics
- 目次
- ローカルから画像アップロード

## その他
