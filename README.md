# nowplaying-on-slack

Spotifyで現在聞いている楽曲をSlackのStatusに表示させるアプリ

## Start

```
$ yarn install
# create tokens.yaml
$ touch tokens.yaml
$ vim tokens.yaml
$ npm start
```

## tokens.yaml

下記のように `tokens.yaml` にAPIを列挙することで複数のチームに対してステータスを変更することができます。
- tokenは[ここから入手可能](https://api.slack.com/custom-integrations/legacy-tokens)。

```
- xoxp-xxxx-xxxx-xxxx-xxxx # hoge.slack.com
- xoxp-yyyy-yyyy-yyyy-yyyy # fuga.slack.com
```

## Status and stop

```
$ npx forever list
$ npm stop
```

## Ref.

- [Spotifyで再生中の曲をtmuxのステータスバーに表示する](https://qiita.com/j-un/items/cf544b3e131772f5f197)
- [iTunesで聞いている音楽をSlackのStatusに表示させるアプリを作った](https://qiita.com/narikei/items/5c847d2a4f4f10bff0ea)
