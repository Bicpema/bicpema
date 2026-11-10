---
name: branch-sync
description: "ローカルブランチ・git worktree・リモートブランチを origin と同期し、マージ済みで不要になったものを安全に整理する標準ワークフローを提供するスキルです。使用例: マージ後の後始末漏れの解消、worktree・ブランチの棚卸し。"
argument-hint: "対象範囲（省略時は local / worktree / remote をすべて対象にします）"
---

# ブランチ同期スキル

## 目的

`issue-work` の後始末が行われないまま PR がマージされた場合などに残る、不要なローカルブランチ・worktree・リモートブランチを一覧化し、承認を得たうえで整理します。あわせて `main` を `origin` の最新に追従させます。

## 前提

- git 操作は本スキルの実行者（Claude Code本体）が行い、サブエージェントには委譲しません。
- 作業は、リポジトリルート（`main` をチェックアウトしている作業ツリー）で実施します。
- 削除は取り消しが難しいため、実行前に必ず一覧を提示して承認を得ます。
- `git stash` は使用しません。未コミットの変更がある worktree は、更新も削除もせず報告のみとします。
- 整理対象は「PR がマージ済み」のブランチだけです。オープン中の PR、PR のないブランチ、未 push のコミットを持つブランチは削除しません。

## 手順

1. `git status` で作業ツリーがクリーンで `main` をチェックアウトしていることを確認します。そうでなければ中断し、ユーザーに確認します。
2. `git fetch origin --prune` の後、`git pull --ff-only` で `main` を更新します。fast-forward できない場合は中断して報告します。
3. `npm run clean:worktrees` で、マージ済み PR に対応する `.claude/worktrees/` 配下の worktree を確認します。あわせて `git branch -vv`、`git worktree list`、`git branch -r` で現状を一覧化します。
4. 各ブランチ（`main` を除く）を `gh pr list --state all --head <ブランチ名> --json number,state,mergedAt,headRefOid` で分類します。マージ済みのみ候補、オープン中・PR なしは報告のみ、クローズ（マージなし）は破棄してよいか個別に確認します。
5. 候補ごとに、worktree は未コミットの変更と未 push のコミットがないこと、ローカルブランチは先頭が PR の `headRefOid` と一致することを確認します。リモートブランチは `main` と `dependabot/*` を常に対象外とします。
6. 整理対象（種別・名前・PR 番号・状態）と対象外の理由を提示し、承認を得ます。
7. 承認された項目を削除します。worktree は `git worktree remove <パス>`（`--force` 不使用）、ローカルブランチは `git branch -d`（squash マージで失敗する場合のみ、手順 5 で一致確認済みなら `-D`）、リモートは `git push origin --delete <ブランチ名>`（自動削除済みなら不要）。
8. `git fetch origin --prune` を再実行し、`git worktree list` と `git branch -vv` で結果を確認します。

## 非対象

- 特定 Issue の作業開始と後始末（`issue-work` を使用します）。
- リベース、マージ、コンフリクト解消、`main` へのコミット・push。

## 完了条件

- [ ] `main` が `origin/main` に追従している
- [ ] 承認された worktree・ローカルブランチ・リモートブランチが削除されている
- [ ] 残した項目とその理由が報告されている
