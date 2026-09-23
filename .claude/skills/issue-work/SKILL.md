---
name: issue-work
description: "WORKFLOW SKILL — Issue番号を指定してgit worktreeと専用ブランチを作成し、内容に応じたスキル・サブエージェントへ実装作業を委譲したうえで、完了後にworktreeとブランチを削除する標準ワークフローを提供する。使用例: Issue対応の開始、Issue単位の実装依頼。"
argument-hint: "対象Issue番号（例: 590）"
---

# Issue対応スキル

## 目的

Issue単位の作業を、[AGENTS.md](../../../AGENTS.md) の「ブランチ運用方針」「Pull Requestの作成手順」に準拠したworktreeと専用ブランチ上で一貫して実施し、完了後の後始末までを標準化する。

## 前提

- git操作（worktree作成・削除、ブランチ作成・削除、commit、push、PR作成）は本スキルの実行者（Claude Code本体）が行う。委譲先のスキル・サブエージェントはGit操作をしないため、実装作業のみを委譲する。
- 引数としてIssue番号を受け取る。未指定の場合はユーザーに確認する。

## 手順

1. `gh issue view <Issue番号> --json title,body,labels,milestone` でIssue内容を取得し、実装対象・変更範囲（シミュレーション実装／記事／設計書／テスト／その他）を把握する。
2. `git status` で作業ツリーがクリーンであることを確認する。未コミットの変更がある場合は中断し、ユーザーに確認する。
3. `git fetch origin` して `origin/main` を最新化する。
4. Issue内容から種別（`feature` / `fix` / `chore` 等。[コミットメッセージ](../../../AGENTS.md#コミットメッセージ)のtypeと対応）と内容を表す日本語スラッグ（体言止め）を決め、[AGENTS.mdのブランチ命名規則](../../../AGENTS.md#ブランチ運用方針)に従いブランチ名を `<type>/<日本語スラッグ>` の形式で決定する。ブランチ名にIssue番号は含めない。
5. `git worktree add .claude/worktrees/issue<Issue番号> -b <ブランチ名> origin/main` でworktreeとブランチを作成する。作成先はリポジトリルート直下の `.claude/worktrees/` 配下（`.gitignore` によりgit管理対象外）に限定する。
6. 以降の実装作業は、作成したworktreeディレクトリ内で実施する。変更範囲に応じて以下へ委譲する。
    - シミュレーションの新規実装: `p5js-simulation-dev` サブエージェント（[p5js-simulation](../p5js-simulation/SKILL.md) スキルも参照）
    - シミュレーションの設計書の実装・修正: [p5js-design-doc-implementation](../p5js-design-doc-implementation/SKILL.md) スキル
    - 既存実装からの設計書の逆生成: [p5js-design-doc-reverse-engineering](../p5js-design-doc-reverse-engineering/SKILL.md) スキル
    - テストの生成・整備: [p5js-simulation-testing](../p5js-simulation-testing/SKILL.md) スキル
    - コードレビュー・簡素化: `code-review` / `simplify` スキル
    - 記事の追加・修正、上記に当てはまらない変更: `general-purpose` エージェントまたは自身で対応する
7. 実装後、変更範囲に応じたチェックが成功することを確認する（[package.json](../../../package.json) の `scripts` を参照）。
    - Markdown: `npm run lint:md` / `npm run format:check`
    - JavaScript/TypeScript: `npm run lint` / `npm run typecheck` / `npm test`
    - シミュレーション全般: `npm run build` / `npm run check:template-compliance`
    - 記事: `npm run check:article-links`
8. 変更をコミットし、worktree内から `origin` にpushする。
9. [AGENTS.mdのPull Requestの作成手順](../../../AGENTS.md#pull-requestの作成手順)に従いPRを作成し、`Closes #<Issue番号>` でIssueと紐付ける。Labels・Milestoneは対応するIssueと同じ値を設定する。
10. ユーザーに完了を報告し、後始末（worktree・ブランチ削除）を実施してよいか確認する。承認後、リポジトリルートに戻り以下を実施する。
    - `git worktree remove .claude/worktrees/issue<Issue番号>`
    - `git branch -d <ブランチ名>`（push済みでマージ待ちのブランチを誤って破棄しないよう、強制削除の `-D` は使用しない）
11. `git worktree list` で後始末後の一覧を確認し、削除漏れがないことを報告する。

## 中断時の後始末

- 途中でエラーや方針転換により作業を中止する場合も、放置せず手順10〜11の後始末を実施する。
- 未コミットの変更が残っている場合は、削除前に必ずユーザーへ破棄してよいか確認する。

## 非対象

- worktreeを使わない単発の小さな確認作業（単一ファイルの参照など）には使用しない。
- 対応するIssueが存在しない、または番号が不明な依頼には使用しない。先に[Issueの登録手順](../../../AGENTS.md#issueの登録手順)に従ったIssue作成を案内する。

## 完了条件

- [ ] Issueの内容をもとに `.claude/worktrees/issue<番号>` へworktreeと専用ブランチが作成されている
- [ ] 対象領域の実装が完了し、該当するチェック（lint/typecheck/test/build等）が成功している
- [ ] 変更がpushされ、Issueと紐付いたPRが作成されている
- [ ] 作業完了後、worktreeとローカルブランチが削除されている
- [ ] `git worktree list` から削除漏れが確認されない
