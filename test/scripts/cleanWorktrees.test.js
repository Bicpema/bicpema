import { describe, it, expect } from "vitest";
import {
  classifyWorktree,
  filterManagedWorktrees,
  parseWorktreeList
} from "../../scripts/_lib/cleanWorktrees.js";

const PORCELAIN_OUTPUT = `worktree /repo
HEAD aaa
branch refs/heads/main

worktree /repo/.claude/worktrees/issue1
HEAD bbb
branch refs/heads/feature/機能の追加

worktree /repo/.claude/worktrees/detached
HEAD ccc
detached

worktree /other/place
HEAD ddd
branch refs/heads/fix/別の場所
`;

describe("parseWorktreeList", () => {
  it("porcelain形式の出力からパス・HEAD・ブランチを取得する", () => {
    expect(parseWorktreeList(PORCELAIN_OUTPUT)).toEqual([
      { path: "/repo", head: "aaa", branch: "main" },
      {
        path: "/repo/.claude/worktrees/issue1",
        head: "bbb",
        branch: "feature/機能の追加"
      },
      { path: "/repo/.claude/worktrees/detached", head: "ccc", branch: null },
      { path: "/other/place", head: "ddd", branch: "fix/別の場所" }
    ]);
  });
});

describe("filterManagedWorktrees", () => {
  it(".claude/worktrees/ 配下のworktreeのみを抽出する", () => {
    const entries = parseWorktreeList(PORCELAIN_OUTPUT);
    const paths = filterManagedWorktrees(
      entries,
      "/repo/.claude/worktrees"
    ).map((entry) => entry.path);

    expect(paths).toEqual([
      "/repo/.claude/worktrees/issue1",
      "/repo/.claude/worktrees/detached"
    ]);
  });
});

describe("classifyWorktree", () => {
  const entry = { path: "/repo/.claude/worktrees/a", head: "bbb", branch: "a" };

  it("マージ済みPRのheadとHEADが一致し変更がなければ削除対象とする", () => {
    const result = classifyWorktree({
      entry,
      mergedPullRequests: [{ number: 1, headRefOid: "bbb" }],
      isDirty: false
    });

    expect(result).toEqual({
      status: "removable",
      pullRequest: { number: 1, headRefOid: "bbb" }
    });
  });

  it("未コミットの変更があれば削除しない", () => {
    const result = classifyWorktree({
      entry,
      mergedPullRequests: [{ number: 1, headRefOid: "bbb" }],
      isDirty: true
    });

    expect(result.status).toBe("dirty");
  });

  it("マージ後に追加コミットがあれば削除しない", () => {
    const result = classifyWorktree({
      entry,
      mergedPullRequests: [{ number: 1, headRefOid: "old" }],
      isDirty: false
    });

    expect(result.status).toBe("diverged");
  });

  it("マージ済みPRがなければ未マージとする", () => {
    const result = classifyWorktree({
      entry,
      mergedPullRequests: [],
      isDirty: false
    });

    expect(result).toEqual({ status: "not-merged", pullRequest: null });
  });

  it("detached HEADのworktreeは対象外とする", () => {
    const result = classifyWorktree({
      entry: { ...entry, branch: null },
      mergedPullRequests: [],
      isDirty: false
    });

    expect(result.status).toBe("detached");
  });
});
