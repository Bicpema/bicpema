#!/usr/bin/env node
/**
 * .github/skills/ と .github/agents/ (GitHub Copilot Coding Agent 用) から、
 * Claude Code が読み込める形式のスキル/サブエージェント定義を .claude/ 配下に生成する。
 *
 * - ソースは常に .github/skills/ と .github/agents/ 側。
 * - .claude/skills/ と .claude/agents/ は本スクリプトの生成物であり、直接編集しないこと。
 * - .github/skills/ 配下の examples ディレクトリはフロントマターを持たないため symlink で共有する。
 *
 * 使い方:
 *   node scripts/sync-claude-skills.mjs         # 生成
 *   node scripts/sync-claude-skills.mjs --check # 生成結果が最新か確認 (差分があれば exit 1)
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const GITHUB_SKILLS_DIR = path.join(ROOT, ".github", "skills");
const GITHUB_AGENTS_DIR = path.join(ROOT, ".github", "agents");
const CLAUDE_SKILLS_DIR = path.join(ROOT, ".claude", "skills");
const CLAUDE_AGENTS_DIR = path.join(ROOT, ".claude", "agents");

const GENERATED_NOTICE = (sourcePath) =>
  `# ⚠️ 自動生成ファイル: ${sourcePath} を元に scripts/sync-claude-skills.mjs が生成しています。\n` +
  `# 直接編集せず、${sourcePath} を編集した後 \`npm run sync:agent-config\` を実行してください。`;

// GitHub Copilot Coding Agent のツール名 → Claude Code のツール名
const TOOL_NAME_MAP = {
  shell: ["Bash"],
  read: ["Read"],
  search: ["Grep", "Glob"],
  edit: ["Edit", "Write"],
  task: ["Task"],
  skill: ["Skill"],
  web_search: ["WebSearch"],
  web_fetch: ["WebFetch"],
  ask_user: ["AskUserQuestion"],
};

function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("frontmatter (--- ... ---) が見つかりません");
  }
  return { frontmatter: match[1], body: match[2] };
}

function getFrontmatterField(frontmatterLines, key) {
  const line = frontmatterLines.find((l) => l.startsWith(`${key}:`));
  return line ? line.slice(key.length + 1).trim() : undefined;
}

function syncSkills() {
  rmSync(CLAUDE_SKILLS_DIR, { recursive: true, force: true });
  mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });

  const skillNames = readdirSync(GITHUB_SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const skillName of skillNames) {
    const srcSkillDir = path.join(GITHUB_SKILLS_DIR, skillName);
    const srcSkillMd = path.join(srcSkillDir, "SKILL.md");
    if (!existsSync(srcSkillMd)) continue;

    const relSourcePath = path.relative(ROOT, srcSkillMd);
    const { frontmatter, body } = splitFrontmatter(
      readFileSync(srcSkillMd, "utf8")
    );
    const frontmatterLines = frontmatter.split("\n");

    // Claude Code の SKILL.md frontmatter は name / description 等の既知キーのみ許可され、
    // Copilot 独自の `argument-hint` があると読み込みエラーになるため除去する。
    const name = getFrontmatterField(frontmatterLines, "name");
    const description = getFrontmatterField(frontmatterLines, "description");
    if (!name || !description) {
      throw new Error(
        `${relSourcePath}: name/description の取得に失敗しました`
      );
    }

    const outFrontmatter = [
      "---",
      GENERATED_NOTICE(relSourcePath),
      `name: ${name}`,
      `description: ${description}`,
      "---",
    ].join("\n");

    const outDir = path.join(CLAUDE_SKILLS_DIR, skillName);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      path.join(outDir, "SKILL.md"),
      `${outFrontmatter}\n${body}`,
      "utf8"
    );

    // examples/ 等の付随ファイルは frontmatter を持たないため、そのまま symlink で共有する。
    for (const entry of readdirSync(srcSkillDir, { withFileTypes: true })) {
      if (entry.name === "SKILL.md") continue;
      const target = path.relative(outDir, path.join(srcSkillDir, entry.name));
      symlinkSync(
        target,
        path.join(outDir, entry.name),
        entry.isDirectory() ? "dir" : "file"
      );
    }

    console.log(`skill synced: ${skillName}`);
  }
}

function syncAgents() {
  rmSync(CLAUDE_AGENTS_DIR, { recursive: true, force: true });
  mkdirSync(CLAUDE_AGENTS_DIR, { recursive: true });

  const agentFiles = readdirSync(GITHUB_AGENTS_DIR).filter((f) =>
    f.endsWith(".agent.md")
  );

  for (const fileName of agentFiles) {
    const srcPath = path.join(GITHUB_AGENTS_DIR, fileName);
    const relSourcePath = path.relative(ROOT, srcPath);
    const { frontmatter, body } = splitFrontmatter(
      readFileSync(srcPath, "utf8")
    );
    const frontmatterLines = frontmatter.split("\n");

    const name = getFrontmatterField(frontmatterLines, "name");
    const description = getFrontmatterField(frontmatterLines, "description");
    if (!name || !description) {
      throw new Error(
        `${relSourcePath}: name/description の取得に失敗しました`
      );
    }

    // tools: [\n "a",\n "b"\n] 形式の配列を取り出す
    const toolsMatch = frontmatter.match(/tools:\s*\[([\s\S]*?)\]/);
    if (!toolsMatch) {
      throw new Error(`${relSourcePath}: tools フィールドの取得に失敗しました`);
    }
    const copilotTools = [...toolsMatch[1].matchAll(/"([^"]+)"/g)].map(
      (m) => m[1]
    );

    const claudeTools = [];
    for (const copilotTool of copilotTools) {
      const mapped = TOOL_NAME_MAP[copilotTool];
      if (!mapped) {
        throw new Error(
          `${relSourcePath}: 未知のツール名 "${copilotTool}" (TOOL_NAME_MAP に追加してください)`
        );
      }
      for (const claudeTool of mapped) {
        if (!claudeTools.includes(claudeTool)) claudeTools.push(claudeTool);
      }
    }

    const outFrontmatter = [
      "---",
      GENERATED_NOTICE(relSourcePath),
      `name: ${name}`,
      `description: ${description}`,
      `tools: ${claudeTools.join(", ")}`,
      "---",
    ].join("\n");

    const outFileName = fileName.replace(/\.agent\.md$/, ".md");
    writeFileSync(
      path.join(CLAUDE_AGENTS_DIR, outFileName),
      `${outFrontmatter}\n${body}`,
      "utf8"
    );
    console.log(`agent synced: ${outFileName}`);
  }
}

syncSkills();
syncAgents();

if (process.argv.includes("--check")) {
  const diff = execFileSync(
    "git",
    ["status", "--porcelain", "--", ".claude/skills", ".claude/agents"],
    {
      cwd: ROOT,
      encoding: "utf8",
    }
  );
  if (diff.trim()) {
    console.error(
      "\n.claude/skills もしくは .claude/agents が .github 側と同期していません。"
    );
    console.error(
      "`npm run sync:agent-config` を実行し、差分をコミットしてください。\n"
    );
    console.error(diff);
    process.exit(1);
  }
  console.log("OK: .claude/skills と .claude/agents は最新です。");
}
