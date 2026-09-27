// .claude/worktrees/ 配下のworktreeのうち、対応するPRがマージ済みのものを
// 検出し、worktreeとローカルブランチを削除する。
//
// - 既定では一覧を表示するだけで削除しない（ドライラン）
// - マージ済みPRのheadコミットとworktreeのHEADが一致し、未コミットの変更が
//   ない場合のみ削除する（マージ後の追加コミットや作業中の変更は破棄しない）
// - PRのマージ状態はGitHub CLI（gh）で取得する
//
// 使い方:
//   npm run clean:worktrees              # 削除対象の一覧を表示する
//   npm run clean:worktrees -- --delete  # 削除対象のworktreeとブランチを削除する

import { execFileSync } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyWorktree,
  filterManagedWorktrees,
  parseWorktreeList
} from "./_lib/cleanWorktrees.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} [cwd]
 * @returns {string}
 */
function run(command, args, cwd) {
  return execFileSync(command, args, { cwd, encoding: "utf-8" }).trim();
}

// worktree内から実行された場合もリポジトリ本体を基準にする
const commonDir = resolve(
  __dirname,
  run("git", ["rev-parse", "--git-common-dir"], __dirname)
);
const rootDir = dirname(commonDir);
const worktreesDir = resolve(rootDir, ".claude", "worktrees");
const shouldDelete = process.argv.includes("--delete");

/**
 * @param {string} branch
 * @returns {import("./_lib/cleanWorktrees.js").MergedPullRequest[]}
 */
function fetchMergedPullRequests(branch) {
  const output = run(
    "gh",
    [
      "pr",
      "list",
      "--state",
      "merged",
      "--head",
      branch,
      "--json",
      "number,headRefOid"
    ],
    rootDir
  );
  return JSON.parse(output);
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isDirty(path) {
  return run("git", ["status", "--porcelain"], path).length > 0;
}

const STATUS_LABELS = {
  removable: "削除対象",
  dirty: "未コミットの変更あり（スキップ）",
  diverged: "マージ後に追加コミットあり（スキップ）",
  "not-merged": "未マージ",
  detached: "detached HEAD（スキップ）"
};

// 手動で削除されたworktreeの管理情報を先に掃除する
run("git", ["worktree", "prune"], rootDir);

const worktrees = filterManagedWorktrees(
  parseWorktreeList(run("git", ["worktree", "list", "--porcelain"], rootDir)),
  worktreesDir
);

if (worktrees.length === 0) {
  console.log(".claude/worktrees/ 配下にworktreeはありません。");
  process.exit(0);
}

const removable = [];
for (const entry of worktrees) {
  const mergedPullRequests =
    entry.branch === null ? [] : fetchMergedPullRequests(entry.branch);
  const { status, pullRequest } = classifyWorktree({
    entry,
    mergedPullRequests,
    isDirty: isDirty(entry.path)
  });
  const prLabel = pullRequest ? ` #${pullRequest.number}` : "";
  console.log(
    `[${STATUS_LABELS[status]}] ${relative(rootDir, entry.path)} (${entry.branch ?? "-"})${prLabel}`
  );
  if (status === "removable") removable.push(entry);
}

console.log("");
if (removable.length === 0) {
  console.log("削除対象のworktreeはありません。");
  process.exit(0);
}

if (!shouldDelete) {
  console.log(
    `削除対象: ${removable.length}件。削除するには \`npm run clean:worktrees -- --delete\` を実行してください。`
  );
  process.exit(0);
}

let hasError = false;
for (const entry of removable) {
  try {
    run("git", ["worktree", "remove", entry.path], rootDir);
    // squash mergeのため -d では削除できない。HEADがマージ済みPRのheadと
    // 一致することは classifyWorktree で確認済みのため -D で削除する
    run("git", ["branch", "-D", /** @type {string} */ (entry.branch)], rootDir);
    console.log(
      `削除しました: ${relative(rootDir, entry.path)} (${entry.branch})`
    );
  } catch (error) {
    hasError = true;
    console.error(`削除に失敗しました: ${relative(rootDir, entry.path)}`);
    console.error(error instanceof Error ? error.message : error);
  }
}

if (hasError) process.exit(1);
