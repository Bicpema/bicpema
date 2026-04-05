---
icon: lucide/home
---

# Bicpema 開発者ドキュメント

Bicpema は、物理や熱力学などの教育用インタラクティブシミュレーションを提供するウェブサイトです。  
このドキュメントは、Bicpema の開発に携わる方向けのリファレンスです。

## プロジェクト概要

| 項目             | 内容                                                             |
| ---------------- | ---------------------------------------------------------------- |
| フロントエンド   | [Hugo](https://gohugo.io/) + [Vite](https://vite.dev/)           |
| シミュレーション | [p5.js](https://p5js.org/)                                       |
| UIフレームワーク | [Bootstrap 5](https://getbootstrap.com/)                         |
| デプロイ先       | [Firebase Hosting](https://firebase.google.com/products/hosting) |
| デプロイ URL     | <https://bicpema.web.app/>                                       |

## ドキュメント構成

| ページ                                        | 内容                                   |
| --------------------------------------------- | -------------------------------------- |
| [環境構築](./setup/index.md)                  | 開発環境のセットアップ手順             |
| [開発フロー](./development-flow.md)           | ブランチ戦略・Issue/PRの流れ           |
| [シミュレーション実装](./simulation/index.md) | シミュレーションの作り方・ファイル構成 |
| [リリースフロー](./release-flow.md)           | タグ付け・自動デプロイの流れ           |
| [テスト方針](./testing/index.md)              | ユニットテスト・UIテストの方針         |
| [バージョニング規約](./versioning.md)         | バージョン番号の付け方                 |
| [Dependabot](./dependabot.md)                 | 依存関係の自動更新設定                 |
