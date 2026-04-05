# ドキュメント閲覧手順

この開発者ドキュメント（Zensical サイト）をローカルで閲覧する方法を説明します。

## 必要なツール

- Python 3.x
- pip

## Zensical のインストール

```bash
pip install zensical
```

または仮想環境を使用する場合:

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install zensical
```

## ローカルサーバーの起動

`docs/` ディレクトリに移動してサーバーを起動します。

```bash
cd docs
zensical serve
```

ブラウザで <http://localhost:8000/> を開くとドキュメントが表示されます。

## ドキュメントのビルド

静的ファイルを生成する場合:

```bash
cd docs
zensical build --clean
```

`docs/site/` ディレクトリに HTML ファイルが生成されます。

## ドキュメントの編集

ドキュメントファイルは `docs/docs/` ディレクトリ以下の Markdown ファイルです。  
`zensical serve` を起動した状態でファイルを編集すると、ブラウザが自動でリロードされます。

!!! note
`docs/site/` はビルド生成物のため、`.gitignore` に追加することを推奨します。
