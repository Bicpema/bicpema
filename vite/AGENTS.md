# シミュレーションの実装に関するカスタムインストラクション

このファイルは `vite/` 配下の開発者向けインストラクションの実体（唯一のソース）です。GitHub Copilot Coding Agent（`applyTo: "vite/**"` を指定した `.github/instructions/simulations.instructions.md` 経由）と Claude Code（`vite/CLAUDE.md` からの `@AGENTS.md` 読み込み）の両方から参照されます。

## 概要

このドキュメントは、Bicpema プロジェクトのシミュレーション実装に関するカスタムインストラクションを提供します。

## フォルダー構成

```text
.
├── js              ## 共通のJavaScriptコード
├── scss            ## 共通のSCSSコード
└── simulations     ## 各シミュレーションのコード
```
