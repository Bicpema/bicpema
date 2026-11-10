---
name: issue-create
description: "Issue 起票の標準ワークフローを提供するスキルです。テンプレート選択、ラベル・Milestone・Type の付与、Priority/Effort・Blocked by の設定を行います。使用例: 新規 Issue の起票、残作業の Issue 切り出し。"
argument-hint: "起票内容（例: 定在波シミュレーションの減衰表示を追加）"
---

# Issue 起票スキル

## 目的

[AGENTS.md](../../../AGENTS.md) の「Issueの登録手順」に沿った Issue を、フィールドの設定漏れなく起票します。

## 前提

- `gh` での操作は本スキルの実行者（Claude Code本体）が行います。
- 本文は日本語で、種類に対応する [.github/ISSUE_TEMPLATE/](../../../.github/ISSUE_TEMPLATE/) のテンプレートの見出し構成に従います。

| 種類                           | テンプレート                       | Type       |
| ------------------------------ | ---------------------------------- | ---------- |
| シミュレーションの新規作成     | simulation-create-template.md      | Feature    |
| シミュレーションのメンテナンス | simulation-maintenance-template.md | Task / Bug |
| 記事の新規作成                 | article-create-template.md         | Feature    |
| 記事のメンテナンス             | article-maintenance-template.md    | Task / Bug |
| 上記以外・不具合               | general-template.md                | Task / Bug |

## 手順

1. 起票内容から種類を判断してテンプレートを選び、各見出しの内容を整理します。
2. `gh issue list --search "<キーワード>" --state all` で重複 Issue がないか確認します。
3. 不明確な仕様（要件・挙動・スコープ・クローズ条件）を洗い出し、`AskUserQuestion` でユーザーに確認します。AI が推測で仕様を決めて本文に書くことはしません。調べて確定できることは先に調べ、質問しません。
4. 整理した本文をユーザーに提示し、承認を得ます。
5. ラベルは `gh label list` で確認し、[development-flow.md のラベル一覧](../../../docs/docs/development-flow.md#ラベル一覧)から選びます。判断できない場合は `not triaged` とします。
6. Milestone は `gh api repos/{owner}/{repo}/milestones` で現在オープンなものを確認し、期限が最も近いものを選びます。なければ付与せず、その旨を報告します。
7. 本文を一時ファイルに書き出し、`gh issue create --title ... --body-file ... --label ... --milestone ...` で起票します。続けて `gh issue edit <番号> --type <Task|Bug|Feature>` で Type を設定します。
8. Priority・Effort・Blocked by が必要な場合は、AGENTS.md の「Priority/Effortの設定」「Blocked by / Blockingの設定」の GraphQL 手順で設定します。フィールド ID は都度取得します。
9. `gh issue view <番号> --json labels,milestone,type` で設定内容を確認し、Issue 番号と URL を報告します。

## 非対象

- Issue の実装作業（`issue-work` を使用します）。
- PR の作成（`pr-create` を使用します）。

## 完了条件

- [ ] 本文が日本語で、テンプレート構成に沿っている
- [ ] 不明点をユーザーに確認し、AI が独断で決めた仕様が含まれていない
- [ ] 起票前に本文をユーザーへ提示し、承認を得ている
- [ ] ラベル・Milestone・Type が設定されている（Milestone なしの場合は理由を報告済み）
