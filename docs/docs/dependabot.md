# Dependabot

## 概要

[Dependabot](https://docs.github.com/ja/code-security/dependabot) は、依存関係の脆弱性を検出し、自動的に更新 PR を作成する GitHub の機能です。  
Bicpema では `.github/dependabot.yml` で設定を管理しています。

## 設定内容

```yaml title=".github/dependabot.yml"
version: 2
updates:
  # npm (JavaScript) の依存関係
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"

  # GitHub Actions の依存関係
  - package-ecosystem: "github-actions"
    directory: "/.github/workflows"
    schedule:
      interval: "weekly"
```

| 項目                      | 設定値 |
| ------------------------- | ------ |
| npm 依存関係の更新頻度    | 毎週   |
| GitHub Actions の更新頻度 | 毎週   |

## 自動更新の対象

### npm パッケージ

`package.json` に定義されている依存パッケージ（`dependencies` / `devDependencies`）が対象です。

| パッケージ  | 用途                         |
| ----------- | ---------------------------- |
| `p5`        | シミュレーション描画エンジン |
| `bootstrap` | UI フレームワーク            |
| `chart.js`  | グラフ描画                   |
| `matter-js` | 物理エンジン                 |
| `mathjs`    | 数学演算ライブラリ           |
| `vite`      | ビルドツール                 |
| `sass`      | CSS プリプロセッサ           |
| `prettier`  | コードフォーマッター         |

### GitHub Actions

`.github/workflows/` 内のワークフローで使用しているアクション（例: `actions/checkout`, `peaceiris/actions-hugo`）が対象です。

## Dependabot PR の対応手順

1. Dependabot が自動的に更新 PR を作成する
2. PR の内容を確認し、**破壊的変更がないか**チェックする
3. ローカルで動作確認を行う（`npm install && npm run build`）
4. 問題がなければ `main` にマージする

!!! warning
メジャーバージョンアップ（例: `p5` の v1 → v2）は破壊的変更を含む可能性があります。  
 必ずシミュレーションの動作を確認してからマージしてください。

## Dependabot アラートの確認

依存パッケージに脆弱性が検出された場合、[Security タブ](https://github.com/Bicpema/bicpema/security/dependabot) で確認できます。  
重大な脆弱性は優先的に対応してください。
