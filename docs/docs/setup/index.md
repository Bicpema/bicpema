# 環境構築

Bicpema の開発を始めるための環境構築手順を説明します。

## 必要なツール

| ツール                                     | バージョン         | 用途                                     |
| ------------------------------------------ | ------------------ | ---------------------------------------- |
| [Hugo](https://gohugo.io/installation/)    | 最新版（extended） | 静的サイトジェネレーター                 |
| [Node.js](https://nodejs.org/ja/download/) | 22.x               | JavaScript ランタイム                    |
| npm                                        | 11.x               | パッケージマネージャー（Node.js と同梱） |
| [Git](https://git-scm.com/)                | 最新版             | バージョン管理                           |

インストール確認コマンド:

```bash
hugo version
# hugo v0.140.2+extended+withdeploy darwin/arm64 ...

node -v
# v22.12.0

npm -v
# 11.0.0
```

## セクション一覧

- [シミュレーション開発手順](./simulation.md) — シミュレーションを新規作成・編集する手順
- [ドキュメント閲覧手順](./documentation.md) — この開発者ドキュメントをローカルで閲覧する手順
