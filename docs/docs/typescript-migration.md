# TypeScript化の方針

[Issue #424](https://github.com/Bicpema/bicpema/issues/424) で提起された、`vite/simulations/` 配下のシミュレーション実装および `templates/js/` のTypeScript化について、方式（`.ts`化 or JSDoc + `checkJs`）と、関連Issue（#409 / #425 / #304）との役割分担を決定する。

## 現状（[PR #425](https://github.com/Bicpema/bicpema/pull/425) で導入済み）

Issue #424 作成時点では `tsconfig.json` が未導入という前提だったが、その後 #409（シミュレーションの型チェックとロジックテストを導入する）に対応した #425 で、以下がすでに導入されている。

- `tsconfig.json`（`allowJs: true` / `checkJs: true` によるJSDocベースの型チェック。`.ts`へのリネームは行っていない）
- `@types/p5`（`vite/types/p5-global.d.ts` / `vite/types/assets.d.ts` のアンビエント宣言と併用）
- `npm run typecheck` と `.github/workflows/test.yml` でのCI実行
- `tsconfig.json` の `include` は `vite/types/**/*.ts` / `vite/_build/**/*.js` / `vite/simulations/free-fall/**/*.js` / `test/**/*.js` のみで、段階的に対象を拡張していく方針が明記されている

## 決定事項

### 1. 方式: `.ts`化を採用する（`.js` → `.ts` のリネームを行う）

Issue #424 が元々想定していた「`.js` → `.ts` への拡張子変更を伴うTypeScript化」を正式方針として採用する。#425 で先行導入された「拡張子は`.js`のまま、JSDocコメントと `checkJs` で型チェックする」方式は、`.ts`化までの**暫定的な土台**（`tsconfig.json` / `@types/p5` / CI導入）として位置づけ、これ以降は各シミュレーションを実際の`.ts`ファイルへ段階的にリネームしていく。

理由:

- JSDocコメントによる型注釈は冗長になりやすく、実装とコメントの二重管理によるメンテナンスコストが継続的に発生する。`.ts`化すれば型注釈がコードの一部になり、エディタ補完・リファクタリング時の追従も含めて一貫した型安全性が得られる。
- `tsconfig.json` / `@types/p5` / CI（型チェック・Vitest）は #425 で既に整備済みのため、`include` パターンを `*.js` から `*.ts` に広げていくだけで済み、基盤を作り直す必要はない。
- 220ファイル全件を一度にリネームすることは行わず、[#511](https://github.com/Bicpema/bicpema/issues/511) の段階移行の枠組みの中で1シミュレーション（またはグループ）単位でリネームすることで、レビュー・動作確認の負荷を抑える。

これに伴い、#424本文の対応内容「既存シミュレーションを段階的に`.ts`へ移行する」は、そのままの意味（実際の拡張子変更）で有効とする。

#### 前提条件: p5.jsの記述スタイル統一

p5.jsのグローバルモード記法（`function setup()` を直接定義し `window` のグローバル関数に依存するスタイル）は、`checkJs`/`.ts`のいずれの型チェックとも相性が悪い。[#512](https://github.com/Bicpema/bicpema/issues/512) でインスタンスモードへの統一を進め、対象シミュレーションがインスタンスモード化されてから `.ts` へリネームする順序を基本とする（詳細は #511/#512 側で計画する）。

### 2. 関連Issueとの役割分担

| Issue / PR | 状態 | 役割 |
| --- | --- | --- |
| [#409](https://github.com/Bicpema/bicpema/issues/409) シミュレーションの型チェックとロジックテストを導入する | Closed | 型チェック・単体テスト導入の要件定義 |
| [#425](https://github.com/Bicpema/bicpema/pull/425)（#409をClose） | Merged | 実装。`tsconfig.json`・`@types/p5`・Vitest・CI（`.github/workflows/test.yml`）を導入し、`free-fall` を型チェック対象の最初の実例として追加（暫定的にJSDoc + `checkJs`で導入したが、基盤自体は`.ts`化後もそのまま利用する） |
| [#304](https://github.com/Bicpema/bicpema/issues/304) 単体テストを追加する | Closed | 各シミュレーションへの**単体テスト**（Vitest）の展開。`.ts`化（`tsconfig.json`の`include`拡張）とは別軸で、[サブIssue](https://github.com/Bicpema/bicpema/issues/427)群として実施済み |
| [#424](https://github.com/Bicpema/bicpema/issues/424) p5.jsシミュレーションをTypeScript化する | Open（親Issue） | TypeScript化の方針決定・展開全体を追跡する親Issue |
| **#509（本Issue）** | - | TypeScript化の方式（`.ts`化）と、関連Issueとの役割分担の決定 |
| [#510](https://github.com/Bicpema/bicpema/issues/510) | Open | `templates/js/` の`.ts`化、`tsconfig.json`の`include`への追加 |
| [#511](https://github.com/Bicpema/bicpema/issues/511) | Open | 既存シミュレーションを`.ts`へ段階的にリネームし、`tsconfig.json`の`include`に追加 |
| [#512](https://github.com/Bicpema/bicpema/issues/512) | Open | p5.jsの記述スタイル（インスタンスモード/グローバルモード）統一。`.ts`化の前提条件 |

- **型チェック/`.ts`化**（`tsconfig.json`の`include`拡張）と、**単体テスト**（Vitestによるロジックのテストコード追加）は独立した軸であり、同じシミュレーションに対して両方を段階的に進めてよい。片方が完了していないともう片方に着手できない、という依存関係はない。
- 単体テストの書き方・対象範囲は [テスト方針](./testing/index.md) を参照。

## 今後の進め方

1. `templates/js/` を`.ts`化し、`tsconfig.json`の`include`に加える（#510）。以降 `new_simulation.py` が生成するひな形は`.ts`ベースになる。
2. p5.jsの記述スタイルをインスタンスモードに統一する（#512）。グローバルモードのまま`.ts`化すると型チェックとの相性問題が出やすいため、対象シミュレーションは統一後にリネームする。
3. 既存シミュレーションをテーマ・ディレクトリ単位などで分類し、`.ts`へリネームして`tsconfig.json`の`include`に段階的に追加する（#511、`free-fall`を含む）。
4. 全シミュレーションが`.ts`化され`tsconfig.json`の`include`対象になり `npm run typecheck` を通過した時点で、#424をクローズする。
