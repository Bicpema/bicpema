# TypeScript strict化の方針

[#667](https://github.com/Bicpema/bicpema/issues/667) にて `tsconfig.json` の `strict` 系オプションを有効化する対応を進めるにあたり、[#673](https://github.com/Bicpema/bicpema/issues/673) で決定した方針を記録します。

## 調査結果

`npx tsc --noEmit --strict` を実行すると2,611件のエラーが検出されます。内訳を確認するため、`strict` 系の各サブオプションを個別に有効化して調査しました。

| サブオプション                 | エラー件数             | 備考                                                                                                                                         |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictNullChecks`             | 2,611                  | 全て `vite/simulations/` 配下に分布（テーマ別の内訳は#667の子Issue一覧を参照）                                                               |
| `noImplicitAny`                | 2,580                  | `strictNullChecks` とほぼ同規模。詳細は下記「調査結果の補正」を参照                                                                          |
| `strictFunctionTypes`          | 0                      | 単独で有効化可能                                                                                                                             |
| `strictBindCallApply`          | 0                      | 単独で有効化可能                                                                                                                             |
| `noImplicitThis`               | 0                      | 単独で有効化可能                                                                                                                             |
| `alwaysStrict`                 | 0                      | 単独で有効化可能                                                                                                                             |
| `useUnknownInCatchVariables`   | 0                      | 単独で有効化可能                                                                                                                             |
| `strictPropertyInitialization` | (要`strictNullChecks`) | `strictNullChecks` を指定しないと `TS5052` でエラーになる仕様上の制約。`strictNullChecks: true` と同時に有効化しても追加のエラーは発生しない |

### 調査結果の補正

[#673](https://github.com/Bicpema/bicpema/issues/673) の起票時点では「`strictNullChecks` 以外の `strict` 系オプションは既存コードに対してエラーなく有効化できる」という前提でしたが、これは `tsconfig.json` に既に明示されていた `"noImplicitAny": false` の設定が、CLIの `--strict` フラグ経由での有効化を打ち消していたことによる誤検知でした（TypeScriptはCLI/tsconfig.json双方に明示された値のうち、より個別のオプション指定を優先するため、`--strict` を渡しても既存の明示的な `"noImplicitAny": false` は上書きされません）。

`--noImplicitAny true` を明示的に指定して検証した結果、`noImplicitAny` の有効化だけで2,580件のエラー（`TS7006`/`TS7018`/`TS7005`/`TS7053`/`TS7034`/`TS7031`）が新たに発生することを確認しました。`noImplicitAny` は `strictNullChecks` と同等規模の対応が必要なため、本Issueの対象（`strictNullChecks` の段階適用）には含めず、別途方針を決定します。

## 決定事項

1. **即時有効化するサブオプション**: 上記調査でエラーが0件だった `strictFunctionTypes` / `strictBindCallApply` / `noImplicitThis` / `alwaysStrict` / `useUnknownInCatchVariables` は、[tsconfig.json](../../tsconfig.json) 本体で即時に有効化します（本Issueで対応済み）。
2. **保留するサブオプション**: `noImplicitAny` は前述の通り大規模な対応が必要なため、`strict: true` 化とは別の方針決定・Issueに委ねます。`strictPropertyInitialization` は `strictNullChecks` に依存するため、後述の段階適用が完了した時点でまとめて有効化します。
3. **`strictNullChecks` の段階適用の仕組み**: `tsconfig.json` を継承する [tsconfig.strict.json](../../tsconfig.strict.json) を追加し、`strictNullChecks: true` / `strictPropertyInitialization: true` を設定します。`include` には対応済みのファイル・ディレクトリのみを列挙し、未対応の `vite/simulations/**` 配下は対応が完了したテーマから順に追加します。
    - `vite/js/**/*.ts` などから対応未了のシミュレーションファイルが `import` されている場合、`include` に含めていなくても型チェックの対象に含まれてしまう（TypeScriptは到達可能なモジュールを走査してプログラムを構成するため）。実際に `test/**/*.js` を含めると、テストコードから参照されている一部シミュレーション（free-fall / slope-cart-motion / uniformly-accelerated-linear-motion / velocity-composition / vertical-throw-down / wave-machine）でエラーが再現しました。そのため初期状態の `include` からは `test/**/*.js` を除外しています。各テーマの子Issueでシミュレーションの対応が完了した際は、対応するテストファイルも合わせてエラーが解消していることを確認したうえで `include` に追加してください。
    - `npm run typecheck:strict`（`tsc --noEmit -p tsconfig.strict.json`）をCI（[.github/workflows/typecheck.yml](../../.github/workflows/typecheck.yml)）に追加し、既存の `npm run typecheck` と併用してリグレッションを防ぎます。

## 子Issueでの進め方

[#667](https://github.com/Bicpema/bicpema/issues/667) の各テーマ別子Issue（弾性力・振動系 / 運動学系 / 力の合成・分解・つり合い系 / 波動・音波系 / 熱力学系 / セロファン系 / 光学・電磁気系 / その他）では、以下の手順で対応してください。

1. 対象テーマのシミュレーションについて `npx tsc --noEmit -p tsconfig.strict.json` （対象ディレクトリを一時的に `include` に追加して実行）で検出されるエラーを解消する。
2. 対応が完了したディレクトリ（および参照しているテストファイル）を [tsconfig.strict.json](../../tsconfig.strict.json) の `include` に追加する。
3. `npm run typecheck:strict` がエラーなく通ることを確認してPRを作成する。

## 最終対応

全テーマの子Issueが完了し `tsconfig.strict.json` の `include` が全シミュレーションを網羅した時点で、`tsconfig.json` 本体に `strictNullChecks: true` / `strictPropertyInitialization: true` を統合し、[tsconfig.strict.json](../../tsconfig.strict.json) を削除します（`.ts` 化における `include` 段階拡張から一括統合への移行（[#652](https://github.com/Bicpema/bicpema/issues/652) → [#671](https://github.com/Bicpema/bicpema/issues/671)）と同様の進め方）。この最終対応は #667 側で直接行います。
