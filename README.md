# bicpema

### Setup

```bash
git clone git@github.com:Bicpema/bicpema.git
```

[Hugo](https://gohugo.io/)のインストールが必要。

<https://gohugo.io/installation/>

インストールが終わったら`hugo`コマンドが使えるか確認する。

```bash
$ hugo version
hugo v0.139.4+extended+withdeploy darwin/arm64 BuildDate=2024-12-09T17:45:23Z VendorInfo=brew
```

`hugo`のインストールが完了していれば、以下のコマンドでローカルサーバーが立ち上がる。

```
# hugoのサーバーを立ち上げる
hugo server -D
# simulationsのhtmlを生成する
npm run dev
```

BLOGのURLは`http://localhost:1313/`になる。
SimulationsのURLは`http://localhost:1313/simulations/{SIMULATION_NAME}/`になる。

### 使い方

記事の追加

```
hugo new post/[記事のタイトル(英語)]/index.md
```

タグの追加

```
hugo new tags/[記事のタイトル(英語)]/index.md
```

マークダウンの記法は以下が参考になる

<https://github.com/CaiJimmy/hugo-theme-stack/tree/master/exampleSite/content/post>

各投稿の`Suggest Changes`をクリックすることで記事の Markdown を確認できる。

<https://github.com/adityatelange/hugo-PaperMod/tree/exampleSite/content/posts>

公式 Docs
<https://stack.jimmycai.com/>

実験ごとのファイルは`simulations/public/{SIMULATION_NAME/}`に配置する。
HTMLは`simulations/simulations/{SIMULATION_NAME}/index.html`に配置する。
重いファイルは[Firebase Storage](https://console.firebase.google.com/project/bicpema/storage/bicpema.firebasestorage.app/files)にアップロードしてURLを貼る。

### その他

- push すると自動でデプロイされる。
- デプロイの状況は[こちら](https://github.com/Bicpema/bicpema/actions)で確認できる。
- デプロイ先 URL → <https://bicpema.web.app/>
