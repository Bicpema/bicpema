# シミュレーション開発手順

## リポジトリのクローン

サブモジュール（Hugo テーマ）を含むため、`--recursive` オプション付きでクローンします。

```bash
git clone --recursive git@github.com:Bicpema/bicpema.git
cd bicpema
```

## npm パッケージのインストール

```bash
npm install
```

## ローカルサーバーの起動

Hugo サーバーと Vite の watch ビルドを **別々のターミナル** で起動します。

**ターミナル 1 — Hugo サーバー**

```bash
hugo server -D
```

**ターミナル 2 — シミュレーション（Vite）のビルド**

```bash
npm run dev
```

| URL                                                            | 内容               |
| -------------------------------------------------------------- | ------------------ |
| <http://localhost:1313/>                                       | トップページ       |
| <http://localhost:1313/vite/simulations/{シミュレーション名}/> | 各シミュレーション |

## 新規シミュレーションの追加

`new_simulation.py` スクリプトを使って雛形を生成します。

```bash
python new_simulation.py
```

対話形式で日本語名と英語名（ハイフン区切り）を入力すると、`vite/simulations/` 配下に
新しいシミュレーション用のフォルダと基本テンプレートが生成されます。

## ビルド

本番向けにビルドする場合は以下を実行します。

```bash
npm run build
hugo --minify
```

生成物は `static/vite/` および `public/` に出力されます。

## コードフォーマット

Prettier を使用しています。

```bash
npm run format
```

!!! note
`.prettierignore` により、`themes/` や `static/` など一部ディレクトリは除外されます。
