# CLAUDE.md

このリポジトリの概要・開発手順は [README.md](./README.md) を参照してください。

## Agent Skills / Subagents について

このリポジトリには GitHub Copilot Coding Agent 向けのワークフロースキル（`.github/skills/`）とサブエージェント（`.github/agents/`）が定義されています。

Claude Code はこれらを直接読み込めない（`.claude/skills/`, `.claude/agents/` を参照する規約のため）ため、`.claude/skills/` と `.claude/agents/` は **`scripts/sync-claude-skills.mjs` によって `.github/skills/` と `.github/agents/` から自動生成しています**。

- **正（ソース・オブ・トゥルース）は常に `.github/skills/` と `.github/agents/`。**
- `.claude/skills/` の `SKILL.md` と `.claude/agents/*.md` は生成物です。**直接編集しないでください**（編集しても次回同期時に上書きされます）。
- `.claude/skills/<name>/examples/` 等の付随ファイルは symlink で `.github/skills/<name>/examples/` を共有しているため、二重管理にはなりません。

### スキル/エージェントを追加・変更したとき

1. `.github/skills/<name>/SKILL.md` または `.github/agents/*.agent.md` を編集する。
2. 以下を実行して `.claude/` 側を再生成する。

    ```bash
    npm run sync:agent-config
    ```

3. `.claude/skills/`, `.claude/agents/` の差分もあわせてコミットする。

CI（[.github/workflows/check-agent-skills-sync.yml](./.github/workflows/check-agent-skills-sync.yml)）が `npm run sync:agent-config:check` を実行し、`.claude/` 側の再生成結果に差分があれば失敗します。同期し忘れに気付ける仕組みなので、失敗した場合は手順1〜3をやり直してください。

### なぜ symlink 一本化にしていないか

`.claude/skills/*/SKILL.md` の frontmatter は Claude Code が認識できるキー（`name`, `description` 等）のみ許可されており、Copilot 側の `argument-hint` があると読み込みエラーになります。同様に `.github/agents/*.agent.md` の `tools` は Copilot 独自のツール名（`shell`, `read` など）で書かれており、Claude Code のツール名（`Bash`, `Read` など）とは互換性がありません。そのため `SKILL.md` 本体と agent 定義ファイルのみ、フロントマターを変換した生成物としています（本文・説明文はソースと同一です）。
