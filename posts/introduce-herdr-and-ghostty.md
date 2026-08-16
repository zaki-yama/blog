---
title: 'iTerm2 + tmuxからHerdr + Ghosttyに移行した'
date: '2026-08-16'
tags: ['開発環境']
description: '開発環境をHerdr + Ghosttyに移行したので、セットアップのメモ'
---

![](https://pub-82105e10155943639213a37345c35eb7.r2.dev/dd58bd4f-108f-4fa7-90c0-dfc08a1ffe2d.png)

## モチベーション

コーディングエージェントの台頭によって、普段の開発業務がリポジトリやブランチを行き来しながら複数のClaude Codeに指示を出し続けるお仕事になってしまった。
そうするとtmuxのどのタブでどのエージェントがどういう状態なのか、を把握するのが難しくなってしまったため、評判の良いHerdrを導入することにした。

https://herdr.dev/ja/docs/

また、ついでにターミナルエミュレーターもGhosttyに乗り換えることにした。

https://ghostty.org/

自分好みの使い勝手にするまでに少々設定が必要だったので、メモ。
Ghosttyは必要最低限の設定しかしていないため、Herdrの設定についてがメイン。

記事執筆時点でのherdrのバージョンは0.8.0、Ghosttyは1.3.1。

## インストール

どちらもHomebrewでインストールできる。

```bash
$ brew install herdr
$ brew install --cask ghostty
```

## 設定を始める前に

[エージェントスキルファイル | herdr](https://herdr.dev/ja/docs/agent-skill/)
に書かれているが、Herdrはエージェント向けのスキルファイル [`skills/herdr/SKILL.md`](https://github.com/herdrdev/herdr/blob/v0.8.0/skills/herdr/SKILL.md)に加え、

> 人間が Herdr を学習・セットアップ・トラブルシューティングするのをエージェントが手伝うための

ガイドも提供している。

[`herdr.dev/agent-guide.md`](https://herdr.dev/agent-guide.md)

そのため、一番初めにこのファイルをエージェントに渡して、「Herdrをセットアップしたいんだけどやり方教えて」みたいにするとスムーズ。

## Herdrの基本概念

ref. [コンセプト | herdr](https://herdr.dev/ja/docs/concepts/)

| 階層      | 内容                                                          |
| --------- | ------------------------------------------------------------- |
| Session   | herdrサーバーの名前空間（基本1つで運用）                      |
| Workspace | プロジェクト単位のコンテナ                                    |
| Tab       | Workspace内の画面（agents/logs/serverなど。Chromeのタブ相当） |
| Pane      | Tab内の分割ターミナル                                         |
| Agent     | Pane内のプロセス（Claude Codeなど）                           |

Workspace > Tab > Paneという階層構造。Sessionは基本意識することがない。
Workspaceについては

> リポジトリ、タスク、調査ごとにひとつのワークスペースを使ってください。

と記載があるので、複数タスク並列で回すときは基本Workspaceをばんばん立ち上げる運用になりそう。  
またPaneは自分はあまり使わなそう。

## 設定

ここから実際に行った設定をいくつか。

### HerdrのTabの作成/移動/削除をChromeのタブみたく操作したい

iTerm2 + tmuxのときもやっていたのだが、タブは`cmd+t`でシュッと立ち上げたいし、タブ間の移動は`cmd+shift+[` or `]`で行いたい。
そのために、まずHerdr側の設定では

```toml
# ~/.config/herdr/config.toml
[keys]
new_tab = "cmd+t"
next_tab = "cmd+shift+]"
previous_tab = "cmd+shift+["
close_tab = ["prefix+shift+x", "cmd+w"]
```

を割り当てる。次にGhostty側ではこれらのキーバインドを無効化しておく。

```ini
# ~/.config/ghostty/config.ghostty
keybind = super+t=unbind
keybind = super+shift+[=unbind
keybind = super+shift+]=unbind
keybind = super+w=unbind
```

---

### workspace navi内で`j/k`でworkspaceを選択したい

`prefix+w`で左上のworkspace一覧にフォーカスがあたるが、このとき`j/k`でカーソルを上下に移動してworkspaceを選びたい。

```toml
[keys]
navigate_workspace_up = "k"
navigate_workspace_down = "j"
```

### agentsにClaude Codeのセッション名を表示したい

Claude Code使ってるとき、こまめに`/rename`でセッション名をつけるようにしてるので
agents一覧の2行目のところに出したい。

![](https://pub-82105e10155943639213a37345c35eb7.r2.dev/2e7e77b2-ba64-42ec-9be5-179f1bccbbc8.png)

調べてみると、ここは`ui.sidebar.agents`という項目でカスタマイズできるらしい。
https://herdr.dev/docs/configuration/#sidebar-row-layouts

```toml
[ui.sidebar.agents]
row_gap = 0
rows = [
  ["state_icon", "workspace", "tab"],
  [{ token = "terminal_title_stripped", fg = "#89b4fa", dim = false }],
]
```

このように、表示したい項目（トークン）を行ごとに並べて`rows`に配列で指定する。
また、Claude Codeのセッション名は`terminal_title_stripped`で取れた。

### agentsもworkspace naviみたく選択したい → できなさそう😢

workspaceは`prefix+w`でフォーカスがあたるのだから、agentsも同じことやりたい。
と思ったがこれはできないらしい。

しかたないので、`prefix+j/k`で前/次のagentを開くようにした。

### iTerm2のようなHotkeyを割り当てたい

元々使っていたiTerm2にはHotkeyを設定することができ、`Ctrl+;`で表示非表示を頻繁に切り替えて使っていた。

<img width="480px" src="https://pub-82105e10155943639213a37345c35eb7.r2.dev/fb7bf9ad-d8f8-4a38-9287-07dd56a0c196.png">

これはGhostty、Herdrいずれも標準機能では無理だった。
そこで、こちらの記事を参考にRaycastで設定した。

https://engineering.konso.me/articles/iterm2-to-ghostty/

### tmuxのコピーモードをherdrでもやりたい

あります。キーバインドもtmuxと同じで`prefix+[`です。

https://herdr.dev/docs/keyboard/#copy-mode

## 使ってみた感想

1週間ぐらい使ってみたが、たしかに世間の評判通り便利。

- エージェントの一覧が状態とともに常にサイドバーに表示されるのは良い
- マウスでの操作(`ui.mouse_capture`)いらないかなと思ったけど、実際あるとちょっとした切り替えはマウスで済ませられて便利
- エージェントがこちらの入力待ちで止まったときに通知や音で気付ける
  - 一方、ただ完了してidle状態になったときに通知を出す方法はわからず...

未解決なこととしてはカラーテーマぐらいかな。標準で用意されてるテーマはどれもいまひとつだった。

## 完成したconfig

### Herdr

```toml:~/.config/herdr/config.toml
onboarding = false

[ui.toast]
delivery = "terminal"

[experimental]
switch_ascii_input_source_in_prefix = true

[ui]
agent_panel_sort = "spaces"
show_agent_labels_on_pane_borders = true

[ui.sidebar.agents]
row_gap = 0
rows = [
  ["state_icon", "workspace", "tab"],
  [{ token = "terminal_title_stripped", fg = "#89b4fa", dim = false }],
]

[ui.sidebar.spaces]
row_gap = 1

[theme]
name = "terminal"
auto_switch = false

[keys]
prefix = "ctrl+t"

# --- Workspace層（プロジェクト単位） ---
previous_workspace = "prefix+shift+["
next_workspace = "prefix+shift+]"
switch_workspace = "prefix+shift+1..9"

# --- Tab層（Workspace内の画面。Chromeのタブ相当） ---
new_tab = "cmd+t"
next_tab = "cmd+shift+]"
previous_tab = "cmd+shift+["
close_tab = ["prefix+shift+x", "cmd+w"]

# --- Pane層（Tab内の分割ターミナル） ---
# 方向移動(focus_pane_left/down/up/right)はh/j/lをレイヤー横断ジャンプに
# 明け渡すため廃止。pane間移動はcycle_pane_next/previousとlast_paneで代替。
cycle_pane_next = "prefix+tab"
cycle_pane_previous = "prefix+shift+tab"
last_pane = ["prefix+;", "prefix+l"]

# --- Agent層（サイドバーのプロセス一覧） ---
previous_agent = "prefix+k"
next_agent = "prefix+j"
focus_agent = "prefix+alt+1..9"

# --- Navigate mode内の移動（prefix+wで入るワークスペース選択面） ---
# j/kでworkspace選択を上下に動かす。衝突するnavigate_pane_down/upは外し、
# pane方向ジャンプはh/lの左右のみ残す。
navigate_workspace_up = "k"
navigate_workspace_down = "j"
navigate_pane_left = "h"
navigate_pane_right = "l"
```

### Ghostty

```text:~/.config/ghostty/config.ghostty
# herdrへタブ操作系のキーを素通しするため、Ghostty標準のタブ切り替えを解除
# unbind: バインドを削除し、印字可能なキーは子プロセス(herdr)まで送信されるようになる
keybind = super+t=unbind
keybind = super+shift+[=unbind
keybind = super+shift+]=unbind
keybind = super+w=unbind


# リガチャを無効化
font-feature = "-calt"
font-feature = "-dlig"
font-feature = "-liga"

window-padding-x = 20
window-padding-y = 50
window-padding-balance = true
```

## おわりに

過去のブログ記事を遡ると、2014年にはすでにiTerm2+tmuxという構成だったみたいなので、10年以上使い続けていた環境からの乗り換えだったらしい。感慨深い（そうでもない）。

https://dackdive.hateblo.jp/entry/2014/08/08/210000

## 参考リンク

公式ドキュメント

- Herdrコンフィグリファレンス：https://herdr.dev/docs/config-reference/
- Ghosttyオプションリファレンス：https://ghostty.org/docs/config/reference

参考にしたブログ記事

- [herdr がいい感じ - そこに仁義はあるのか(仮)](https://syobochim.hatenablog.com/entry/2026/07/15/103749)
- [AIエージェント時代のターミナルマルチプレクサ「Herdr」を使う - Don't Repeat Yourself](https://blog-dry.com/entry/2026/06/30/234346)
- [最近流行の Ghostty を試してみた（設定付き） | コードと音と香りの交差点](https://enjoydarts.blog/archives/888)
- [iTerm2 から Ghostty に乗り換える | Konsome Engineering](https://engineering.konso.me/articles/iterm2-to-ghostty/)
  - フォントのリガチャ無効化、参考にさせていただきました
