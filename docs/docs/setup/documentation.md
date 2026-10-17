# ドキュメント閲覧手順

この開発者ドキュメント（Zensical サイト）をローカルで閲覧する方法を説明します。

## 必要なツール

- Python 3.x
- pip

## Zensical のインストール

```bash
pip install -r requirements-dev.txt
```

または仮想環境を使用する場合:

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
```

## ローカルサーバーの起動

`docs/` ディレクトリに移動してサーバーを起動します。

```bash
cd docs
zensical serve
```

ブラウザで <http://localhost:8000/> を開くとドキュメントが表示されます。

## ビルドの確認

CIと同じ条件（警告をエラー扱い）でビルドを確認するには、以下を実行します。`docs/` を変更したPull Requestでは、CI（`docs-build.yml`）でも同じビルドが実行されます。

```bash
cd docs
zensical build --clean --strict
```

## 公開方針

開発者ドキュメントはリポジトリ内の開発者向け資料のため、Webサイトとしての公開（GitHub Pages等へのデプロイ）は行いません。Markdownは `docs/docs/` にあり、GitHub上でそのまま閲覧できます。公開が必要になった場合は、別途Issueで検討してください。

## ドキュメントの編集

ドキュメントファイルは `docs/docs/` ディレクトリ以下の Markdown ファイルです。  
`zensical serve` を起動した状態でファイルを編集すると、ブラウザが自動でリロードされます。

!!! note
`docs/site/` はビルド生成物のため、`.gitignore` に追加することを推奨します。
