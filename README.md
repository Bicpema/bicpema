# Bicpema

**Bicpema**（ビックぺマ）は、中学生・高校生向けの物理シミュレーション教材サイト。「手元で動かしながら物理現象を観察する」をコンセプトに、教科書に出てくる物理現象をブラウザ上でインタラクティブに体験できる。

- サイト: <https://bicpema.com/>
- 使い方: トップページまたは記事一覧から見たいシミュレーションを選び、ブラウザで開いてパラメータを操作する。インストール不要で、スマートフォン・タブレット・PCのいずれでも利用できる。詳しくは[Bicpemaについて](https://bicpema.com/about/)を参照。

サイトは[Hugo](https://gohugo.io/)で構築し、シミュレーションは[p5.js](https://p5js.org/)と[Vite](https://vite.dev/)で実装している。

## Requirements

- [Hugo](https://gohugo.io/installation/)（extended、最新版。CIは`latest`を使用）
- [Node.js](https://nodejs.org/ja/download/) 24.x（CIと同じバージョン）
- npm 11.x（Node.jsに同梱）
- Python 3.x・pip（YAMLのリントに使うyamllint、開発者ドキュメントのZensicalで使用）

各種インストールできているかの確認

```bash
hugo version
# hugo v0.1xx.x+extended ...

node -v
# v24.x.x

npm -v
# 11.x.x
```

## Setup

リポジトリをクローンする  
※サブモジュールを使用しているため、`--recursive`オプションをつけること

```bash
git clone --recursive git@github.com:Bicpema/bicpema.git
```

npmパッケージをインストールする

```bash
npm install
```

Python製の開発ツール（yamllint）をインストールする

```bash
pip install -r requirements-dev.txt
```

E2Eテスト・ランタイム検証を実行する場合は、Playwrightのブラウザーをインストールする

```bash
npx playwright install --with-deps chromium
```

## Development

hugoのサーバーを立ち上げる

```bash
hugo server -D
```

simulationsのhtmlをビルドする（変更を監視して`static/vite/`へ出力し続ける）

```bash
npm run dev
```

TOPページ
<http://localhost:1313/>

シミュレーション（`vite/simulations/<シミュレーション名>/`が`/vite/simulations/<シミュレーション名>/`で配信される）
<http://localhost:1313/vite/simulations/wave-reflection/>

シミュレーションを一度だけビルドする（出力先は`static/vite/`）

```bash
npm run build
```

### npm scripts

| コマンド                            | 内容                                                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                       | シミュレーションを監視ビルドする                                                                                 |
| `npm run build`                     | シミュレーションをビルドする                                                                                     |
| `npm run new:simulation`            | 雛形から新しいシミュレーションを生成する                                                                         |
| `npm test`                          | Vitestで単体テストを実行する（`npm run test:watch`で監視実行）                                                   |
| `npm run test:e2e`                  | PlaywrightでE2Eテストを実行する（事前に自動でビルドされる）                                                      |
| `npm run typecheck`                 | TypeScriptの型チェックを実行する                                                                                 |
| `npm run lint`                      | oxlintでJavaScript/TypeScriptをリントする                                                                        |
| `npm run lint:md`                   | Markdownをリントする                                                                                             |
| `npm run lint:yaml`                 | YAMLをリントする（yamllintが必要）                                                                               |
| `npm run lint:spell`                | cspellでスペルチェックを実行する                                                                                 |
| `npm run format`                    | Prettierで整形する                                                                                               |
| `npm run format:check`              | Prettierの整形漏れをチェックする                                                                                 |
| `npm run check:template-compliance` | 各シミュレーションが雛形の必須構成に沿っているかをチェックする                                                   |
| `npm run check:article-links`       | 記事とシミュレーションのリンク整合性をチェックする                                                               |
| `npm run check:published-urls`      | 掲載URLがビルド成果物からアクセス可能かをチェックする                                                            |
| `npm run verify:runtime`            | 各シミュレーションをヘッドレスブラウザーで起動し、実行時エラーを検知する（事前に`npm run build`が必要）          |
| `npm run benchmark:performance`     | シミュレーションのframeRate・メモリ使用量を計測する（例: `npm run benchmark:performance -- --filter=free-fall`） |
| `npm run clean:worktrees`           | マージ済みPRに対応する`.claude/worktrees/`配下のworktreeを一覧表示する（`-- --delete`で削除）                    |

### 開発者ドキュメント

シミュレーションの実装方法・開発フロー・テスト方針などの開発者向けドキュメントを[`docs/`](./docs/)（[Zensical](https://zensical.org/)）で管理している。Markdownは[`docs/docs/`](./docs/docs/)にあり、GitHub上でもそのまま読める。ローカルで閲覧する場合は以下を実行し、<http://localhost:8000/>を開く。

```bash
pip install zensical
cd docs
zensical serve
```

## Blog

記事の追加

```bash
hugo new post/[post-name]/index.md
# 例
hugo new post/sample-post/index.md
```

タグ・カテゴリ・シリーズは、記事のフロントマター（`tags` / `categories` / `series`）で指定する（専用ページの作成は不要）。付け方のルールは[タグ付けルール](./docs/docs/simulation/index.md#タグ付けルール)を参照。

使用できるマークダウンの記法は以下を参照

プレビュー  
<https://hugo-theme-tailwind.tomo.dev/post/markdown-syntax/>

ソースコード  
<https://github.com/tomowang/hugo-theme-tailwind/blob/main/exampleSite/content/post/markdown-syntax/index.md?plain=1>

記事中で数式（KaTeX）を使う場合は、フロントマターに以下のいずれかを設定して有効化する。

```yaml
math: true # または katex: true
```

全記事で一括有効化する場合は`config/_default/params.toml`の`math`を`true`にする。

記法はインライン`\( ... \)`、ブロック`$$ ... $$`を使用する（参照: [KaTeX Supported Functions](https://katex.org/docs/supported.html)）。
インラインの`\( ... \)`はMarkdownのエスケープ処理で`\`が消えてしまうため、Markdown本文中では`\\( ... \\)`と2重バックスラッシュで記述すること（ブロックの`$$ ... $$`はそのままでよい）。

```markdown
インラインの例: \\( E = mc^2 \\)

ブロックの例:

$$
\mathbf{T}_1 + \mathbf{T}_2 + \mathbf{W} = \mathbf{0}
$$
```

記事とシミュレーションのリンク整合性（記事内のリンク切れ、対応する記事のないシミュレーション）をチェックする

```bash
npm run check:article-links
```

意図的に記事なしとするシミュレーションは`scripts/articleless-simulation-allowlist.js`に追加する。

教科書などに掲載されたURL（`data/published-urls.yaml`）がビルド成果物からアクセス可能かをチェックする（Vite・Hugoのビルド後に実行する）

```bash
npm run check:published-urls
```

シミュレーション名・記事スラッグの変更やページの移転を行う場合は、`firebase.json`の`hosting.redirects`に旧URLからのリダイレクトを必ず追加する。

## Simulation

[`vite/simulations/`](./vite/simulations/)にシミュレーションのHTML・CSS・TypeScriptを配置する。  
新規のシミュレーションを追加する場合は、以下のコマンドを実行し、対話形式で日本語名とハイフン区切りの英語名（例: `sample-simulation`）を入力する。[`vite/_templates/simulation/`](./vite/_templates/simulation/)の雛形から`vite/simulations/<英語名>/`が生成される。

```bash
npm run new:simulation
```

p5.jsはインスタンスモード（`new p5(sketch)`）で実装する。実装方針・共通UIコンポーネント・パフォーマンス方針は[シミュレーション実装方法](./docs/docs/simulation/index.md)と[AGENTS.mdの実装の注意点](./AGENTS.md#実装の注意点)を参照。

重いファイルは[Firebase Storage](https://console.firebase.google.com/project/bicpema/storage/bicpema.firebasestorage.app/files)にアップロードしてURLで参照すること。

## Structure

フォルダー構成は[AGENTS.mdのフォルダー構成](./AGENTS.md#フォルダー構成)に集約している（二重管理を避けるため、READMEには記載しない）。`public/`・`resources/`・`static/vite/`はビルド時に生成されるフォルダーで、git管理対象外。

## License

- ソースコードには[MIT License](./LICENSE)が適用される。
- 記事・画像・シミュレーションの画面などのコンテンツには、公開サイトの[利用規約](https://bicpema.com/terms/)が適用される（授業・自習での利用や改変は自由、出版物・商用教材への掲載は要連絡）。規約の本文は[`content/terms.md`](./content/terms.md)で管理する。
- サードパーティライブラリ・フォントのライセンスは[`content/licenses.md`](./content/licenses.md)を参照。
- サイトのテーマには[hugo-theme-tailwind](https://github.com/tomowang/hugo-theme-tailwind)（git submodule、`themes/hugo-theme-tailwind`）を使用しており、[MIT License](https://github.com/tomowang/hugo-theme-tailwind/blob/main/LICENSE)が適用される。ライセンス全文はsubmodule内の`themes/hugo-theme-tailwind/LICENSE`、または[`content/licenses.md`](./content/licenses.md)を参照。

## Others

- `main`ブランチにマージすると、GitHub Actionsで自動的にデプロイされる。
- デプロイの状況は[こちら](https://github.com/Bicpema/bicpema/actions)で確認できる。
- デプロイ先 URL → <https://bicpema.com/>
- 開発者向けインストラクション（フォルダー構成、実装手順、コミットメッセージのルールなど）は[AGENTS.md](./AGENTS.md)を参照。Claude Code（`CLAUDE.md`経由）とGitHub Copilot Coding Agentで共通の内容。
