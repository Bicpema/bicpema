---
name: pr-create
description: "PR 作成の標準ワークフローを提供するスキルです。テンプレート構成での本文作成、Closes による Issue 紐付け、Issue と同じラベル・Milestone の付与を行います。使用例: Issue 対応後の PR 作成。"
argument-hint: "Issue 番号（例: 890）"
---

# PR 作成スキル

## 目的

[AGENTS.md](../../../AGENTS.md) の「Pull Requestの作成手順」に沿った PR を作成し、Issue を確実にクローズ紐付けします。

## 前提

- 変更が commit・push 済みであること。未 push の場合は先に push します（`main` への直接 push は行いません）。
- 変更領域に対応するチェック（`npm run lint:md` / `npm run lint:yaml` / `npm run format:check` / `npm run typecheck` / `npm test` など。詳細は [package.json](../../../package.json) の `scripts`）がローカルで成功済みであること。未実行・失敗が残っている場合は先に実行・修正します。
- 本文は日本語で、[pull_request_template.md](../../../.github/pull_request_template.md) の見出し・構成をそのまま使用します。
- PR タイトルは `<type>: <変更内容の要約>` 形式（[.vscode/commit-style.md](../../../.vscode/commit-style.md)）にします。

## 手順

1. `gh issue view <番号> --json title,body,labels,milestone` で Issue のクローズ条件・ラベル・Milestone を確認します。
2. 部分対応でクローズ条件を満たしきれない場合は、残作業を別 Issue に切り出し（`issue-create` を使用）、元の Issue は `Closes` でクローズします。
3. 本文を一時ファイルに書き出します。「実施したこと」「実施していないこと」「関連Issue・参考ページ（`Closes #番号`）」を省略せず記入します。実行したチェックは `- [x]`、実行できなかったものは `- [ ]` と理由を記載します。末尾に実行環境が指定する attribution を付けます。
4. `gh pr create --title ... --body-file ... --label ... --milestone ...` で、手順 1 で取得した Issue の値のみを作成時に付与します。Issue にラベル・Milestone がなければ PR にも付けません。
5. `gh pr view <番号> --json labels,milestone,closingIssuesReferences` で、Issue と同じ値であること、Issue 紐付けを確認します。不一致なら `gh pr edit` で修正します。
6. PR の URL を報告します。マージは `pr-merge` で行います。

Priority・Effort は PR に設定できないため設定しません（Issue 側のみで管理します）。

## 非対象

- マージ操作（`pr-merge` を使用します）。
- 実装・コミット作業（`issue-work` を使用します）。

## 完了条件

- [ ] 本文が日本語で、テンプレートの見出し・構成どおりに記述されている
- [ ] `Closes #番号` で Issue と紐付いている
- [ ] ラベル・Milestone が Issue と一致している
- [ ] 実行したチェックの結果が本文に記載されている
