# TypeScript化の方針

[Issue #424](https://github.com/Bicpema/bicpema/issues/424) で提起された、`vite/simulations/` 配下のシミュレーション実装および `templates/js/` のTypeScript化について、方式（`.ts`化 or JSDoc + `checkJs`）と、関連Issue（#409 / #425 / #304）との役割分担を決定する。

## 現状（[PR #425](https://github.com/Bicpema/bicpema/pull/425) で導入済み）

Issue #424 作成時点では `tsconfig.json` が未導入という前提だったが、その後 #409（シミュレーションの型チェックとロジックテストを導入する）に対応した #425 で、以下がすでに導入されている。

- `tsconfig.json`（`allowJs: true` / `checkJs: true` によるJSDocベースの型チェック。`.ts`へのリネームは行っていない）
- `@types/p5`（`vite/types/p5-global.d.ts` / `assets.d.ts` のアンビエント宣言と併用）
- `npm run typecheck` と `.github/workflows/test.yml` でのCI実行
- `tsconfig.json` の `include` は `vite/_build/**/*.js` / `vite/simulations/free-fall/**/*.js` / `test/**/*.js` のみで、段階的に対象を拡張していく方針が明記されている

## 決定事項

### 1. 方式: `.ts`化ではなく、JSDoc + `checkJs` を継続する

Issue #424 が想定していた「`.js` → `.ts` への拡張子変更を伴うTypeScript化」ではなく、#425 が既に採用した「拡張子は`.js`のまま、JSDocコメントと `checkJs` で型チェックする」方式を正式な方針とする。

理由:

- `vite/simulations/` 配下220ファイルを一括で`.ts`にリネームすると差分が巨大になり、レビュー・動作確認が困難になる。
- p5.jsのグローバルモード記法（`function setup()` を直接定義するスタイル）は `.ts` 化との相性が悪く、個別対応が必要な箇所が多数ある（[#512](https://github.com/Bicpema/bicpema/issues/512) で記述スタイル統一を別途検討する）。
- #425 で基盤（`tsconfig.json` / `@types/p5` / CI）がJSDoc + `checkJs` 方式ですでに導入・稼働しており、これを覆すコストに見合うメリットがない。

これに伴い、#424本文の対応内容「既存シミュレーションを段階的に`.ts`へ移行する」は「JSDocコメントを付与し `tsconfig.json` の `include` に段階的に追加する」に読み替える。

### 2. 関連Issueとの役割分担

| Issue / PR | 状態 | 役割 |
| --- | --- | --- |
| [#409](https://github.com/Bicpema/bicpema/issues/409) シミュレーションの型チェックとロジックテストを導入する | Closed | 型チェック・単体テスト導入の要件定義 |
| [#425](https://github.com/Bicpema/bicpema/pull/425)（#409をClose） | Merged | 実装。`tsconfig.json`（JSDoc + `checkJs`）・`@types/p5`・Vitest・CI（`.github/workflows/test.yml`）を導入し、`free-fall` を型チェック対象の最初の実例として追加 |
| [#304](https://github.com/Bicpema/bicpema/issues/304) 単体テストを追加する | Closed | 各シミュレーションへの**単体テスト**（Vitest）の展開。型チェック対象（`tsconfig.json`の`include`）の拡張とは別軸で、[サブIssue](https://github.com/Bicpema/bicpema/issues/427)群として実施済み |
| [#424](https://github.com/Bicpema/bicpema/issues/424) p5.jsシミュレーションをTypeScript化する | Open（親Issue） | TypeScript化の方針決定・展開全体を追跡する親Issue |
| **#509（本Issue）** | - | #424が想定していた`.ts`化を、#425が採用したJSDoc + `checkJs`方式に合わせる方針決定 |
| [#510](https://github.com/Bicpema/bicpema/issues/510) | Open | `templates/js/` へのJSDoc型注釈追加、`tsconfig.json`の`include`への追加 |
| [#511](https://github.com/Bicpema/bicpema/issues/511) | Open | 既存217件のシミュレーションを`tsconfig.json`の`include`に段階的に追加 |
| [#512](https://github.com/Bicpema/bicpema/issues/512) | Open | p5.jsの記述スタイル（インスタンスモード/グローバルモード）統一 |

- **型チェック**（JSDoc + `checkJs`、`tsconfig.json`の`include`拡張）と、**単体テスト**（Vitestによるロジックのテストコード追加）は独立した軸であり、同じシミュレーションに対して両方を段階的に進めてよい。片方が完了していないともう片方に着手できない、という依存関係はない。
- 単体テストの書き方・対象範囲は [テスト方針](./testing/index.md) を参照。JSDoc型注釈の書き方は [.claude/skills/p5js-simulation-testing/SKILL.md](https://github.com/Bicpema/bicpema/blob/main/.claude/skills/p5js-simulation-testing/SKILL.md) の型チェック関連の記載を参照。

## 今後の進め方

1. `templates/js/` にJSDoc型注釈を追加し、`tsconfig.json`の`include`に加える（#510）。
2. 既存シミュレーションをテーマ・ディレクトリ単位などで分類し、`tsconfig.json`の`include`に段階的に追加してエラーを解消する（#511）。グローバルモード記法に起因するエラーが多い場合は、p5.jsの記述スタイル統一（#512）と合わせて計画する。
3. 全シミュレーションが`tsconfig.json`の`include`対象になり `npm run typecheck` を通過した時点で、#424をクローズする。
