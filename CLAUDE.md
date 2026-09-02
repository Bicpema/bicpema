# CLAUDE.md

このリポジトリの概要・開発手順は [README.md](./README.md) を参照してください。

## Agent Skills / Subagents について

p5.js シミュレーション開発のワークフロースキル（`.claude/skills/`）とサブエージェント（`.claude/agents/`）は、Claude Code と GitHub Copilot Coding Agent の両方から読み込まれる共通の置き場所です。

- 置き場所は `.claude/skills/` と `.claude/agents/` の**一箇所のみ**（旧 `.github/skills/`, `.github/agents/` は廃止済み）。
- 両ツールがこのディレクトリを直接参照するため、変更はここを編集するだけで両方に反映される。複製や同期スクリプトは不要。
- SKILL.md の frontmatter は Claude Code が認識できるキー（`name`, `description` など）のみを使うこと。未知のキー（例: `argument-hint`）があると Claude Code 側で読み込みエラーになる。
- サブエージェント（`.claude/agents/*.md`）の `tools` は Claude Code のツール名（`Bash`, `Read`, `Grep` など）で記述する。
