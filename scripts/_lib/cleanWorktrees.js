import { relative, sep } from "node:path";

/**
 * @typedef {object} WorktreeEntry
 * @property {string} path worktreeの絶対パス
 * @property {string | null} head HEADのコミットSHA
 * @property {string | null} branch ブランチ名（refs/heads/ を除いたもの。detached HEADの場合はnull）
 */

/**
 * @typedef {object} MergedPullRequest
 * @property {number} number
 * @property {string} headRefOid マージ時点のPRのheadコミットSHA
 */

/**
 * @typedef {"removable" | "dirty" | "diverged" | "not-merged" | "detached"} WorktreeStatus
 */

/**
 * `git worktree list --porcelain` の出力を解析する。
 * @param {string} output
 * @returns {WorktreeEntry[]}
 */
export function parseWorktreeList(output) {
  return output
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) => {
      /** @type {WorktreeEntry} */
      const entry = { path: "", head: null, branch: null };
      for (const line of block.split("\n")) {
        const separatorIndex = line.indexOf(" ");
        const key =
          separatorIndex === -1 ? line : line.slice(0, separatorIndex);
        const value =
          separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
        if (key === "worktree") entry.path = value;
        if (key === "HEAD") entry.head = value;
        if (key === "branch") {
          entry.branch = value.replace(/^refs\/heads\//, "");
        }
      }
      return entry;
    });
}

/**
 * 指定ディレクトリ（.claude/worktrees/）配下のworktreeのみを抽出する。
 * リポジトリ本体（main）や、それ以外の場所に作成されたworktreeは対象外とする。
 * @param {WorktreeEntry[]} entries
 * @param {string} worktreesDir
 * @returns {WorktreeEntry[]}
 */
export function filterManagedWorktrees(entries, worktreesDir) {
  return entries.filter((entry) => {
    const relativePath = relative(worktreesDir, entry.path);
    return (
      relativePath.length > 0 &&
      !relativePath.startsWith("..") &&
      !relativePath.startsWith(sep)
    );
  });
}

/**
 * worktreeを削除してよいか判定する。
 * squash mergeを採用しているため `git branch --merged` では判定できず、
 * GitHub上でマージ済みのPRのheadコミットとworktreeのHEADが一致する場合のみ
 * 削除対象とする（マージ後に追加コミットがある場合は破棄しない）。
 * @param {object} options
 * @param {WorktreeEntry} options.entry
 * @param {MergedPullRequest[]} options.mergedPullRequests ブランチに対応するマージ済みPR
 * @param {boolean} options.isDirty 未コミットの変更・未追跡ファイルがあるか
 * @returns {{ status: WorktreeStatus, pullRequest: MergedPullRequest | null }}
 */
export function classifyWorktree({ entry, mergedPullRequests, isDirty }) {
  if (entry.branch === null) return { status: "detached", pullRequest: null };
  if (mergedPullRequests.length === 0) {
    return { status: "not-merged", pullRequest: null };
  }
  const pullRequest =
    mergedPullRequests.find((pr) => pr.headRefOid === entry.head) ?? null;
  if (pullRequest === null) {
    return { status: "diverged", pullRequest: mergedPullRequests[0] };
  }
  if (isDirty) return { status: "dirty", pullRequest };
  return { status: "removable", pullRequest };
}
