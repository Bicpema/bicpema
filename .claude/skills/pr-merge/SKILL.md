---
name: pr-merge
description: "PR マージの標準ワークフローを提供するスキルです。CI 完了を待ってから手動でマージし、古い PR は update-branch で再 CI します。--auto は使用しません。使用例: CI 通過後の PR マージ。"
argument-hint: "PR 番号（例: 899）"
---

# PR マージスキル

## 目的

CI 完了前にマージされることを避け、CI 成功とレビュー承認を確認してから安全にマージします。

## 前提

- `gh pr merge --auto` は使用しません。
- `main` への直接 push は行わず、マージは必ず PR 経由とします（[AGENTS.md](../../../AGENTS.md) の「ブランチ運用方針」）。
- マージはユーザーの依頼または承認を得てから実施します。
- 並列 worktree 運用中は `git stash` を使用しません。

## 手順

1. `gh pr view <番号> --json state,mergeable,mergeStateStatus,reviewDecision,baseRefName,headRefName` で状態を確認します。レビュー承認が得られていない場合は中断し、ユーザーに報告します。
2. `mergeStateStatus` が `BEHIND` の場合は `gh pr update-branch <番号>` で `main` を取り込み、再 CI を起動します（同じ SHA の rerun では代替しません）。
3. `gh pr checks <番号> --watch --fail-fast` をバックグラウンドで実行し、終了通知を待ちます。待機中に出力をポーリングしません。
4. 終了コードが 0 以外の場合はマージせず、失敗内容を報告して対応方針を確認します。
5. 終了コードが 0（全チェック成功）の場合に限り、`gh pr merge <番号> --squash` で手動マージします。
6. `gh pr view <番号> --json state,mergedAt` でマージ済みを確認し、紐付いた Issue がクローズされたことを確認します。
7. リモートブランチが残っていれば削除します。worktree・ローカルブランチが残っている場合は `issue-work` の後始末、または `branch-sync` で整理します。

## 非対象

- PR の作成（`pr-create` を使用します）。

## 完了条件

- [ ] 全チェックの成功とレビュー承認を確認してからマージしている
- [ ] `--auto` を使用していない
- [ ] マージ済みと Issue クローズを確認している
