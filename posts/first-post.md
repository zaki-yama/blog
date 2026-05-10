---
title: 'Claude Codeにブログを作ってもらった'
date: '2026-05-11'
category: '雑記'
description: '個人ブログをはてなブログから引っ越しするためにClaude Codeに作ってもらった'
---

## モチベーション

これまではてなブログ（[https://dackdive.hateblo.jp/](https://dackdive.hateblo.jp/)）を愛用していたが、生成AIの台頭によってやっぱりローカルにファイルとして管理できてたほうがいいよな〜という気持ちが高まり、作ることにした。

ブログシステム、細かい機能を作り込んでくと途中でめんどくさくなりそうだなと思っていたけど  
今ならそのへんもClaude Codeが全部やってくれそうだったからというのもある。

## 主な機能

- 目次
- ライトモード／ダークモード
- コードのシンタックスハイライト
- RSSフィード
- OG（Open Graph）画像の自動生成
- Google Analytics

検索とかカテゴリ（タグ）ごとのページとかが今後欲しい。

## 技術スタック

- フロントエンドフレームワーク：[Astro](https://astro.build/)
- スタイリング：[Tailwind CSS](https://tailwindcss.com/)
- ホスティング先：[Cloudflare Workers](https://workers.cloudflare.com/)
- 画像ホスティングサービス：検討中

### [Astro](https://astro.build/)

最初、[Next.js](https://nextjs.org/) + [OpenNext](https://opennext.js.org/)を採用した。慣れてるからというのと、使うことでNext.jsの継続的な勉強になるかなというのが主な理由。が、ブログシステムは一度土台ができたらそんなに手を入れることがなさそうだったのでせっかくだし知らないフレームワークをと思いAstroに乗り換えた。
ただ、今だと[Hono](https://hono.dev/)にしたい気持ちになってるし、Lumeも気になる。  
参考：[このブログをLumeで作った話 - 逆瀬川ちゃんのブログ](https://nyosegawa.com/posts/hello-lume/)

### [Cloudflare Workers](https://workers.cloudflare.com/)

無料で運用できるので。  
PagesでなくWorkersなのは、昔「これからは基本Workers使ってね」みたいなポストを見かけたから。

構築した後で気づいたこととして、Workersは**無料プランだと3MB**までという制限がある。  
https://developers.cloudflare.com/workers/platform/limits/#worker-size

Next.js+OpenNextでやってたときはこの制限に引っかかりそうだったけど、Astroはどうなんだろ。

### 画像ホスティングサービス

これはまだ検討中。リポジトリに画像を直接コミットでもいいが、だんだんリポジトリが肥大化していきそう。

最初、Claude Codeが選定してくれたのは[Cloudinary](https://cloudinary.com/)というSaaSだった。  
無料プランだと月25クレジット使えて、1クレジットにつき、以下のいずれかの処理にあてられるらしい。

- 1,000回の画像変換
- 1GBのストレージ
- 1GB帯域幅

こちらの記事が詳しい：[Cloudinaryの無料プランでどこまでやれるか？料金プラン調べてみた](https://zenn.dev/price/articles/fe1a06c7b04472)

純粋にストレージだけで考えても無料枠では25GBが上限で、かつその他の操作が行われることを考えると実際はもっと上限は低くなるはず。

Cloudflare R2も無料プランで10GBまでは使える。

## その他

Claude Codeとのやり取りはなるべくドキュメントに残すようにしていて、  
https://github.com/zaki-yama/blog/tree/main/docs  
にADRやら開発ログやらを置いている。

## おわりに

2026年も折り返しに差し掛かっているが、ブログ書いていきたい。
