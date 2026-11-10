---
name: release
description: "リリース作業の標準ワークフローを提供するスキルです。前回リリースからの差分確認、バージョン決定、タグ作成・push、GitHub Release とデプロイ結果の確認までを一貫して実施します。使用例: 正式リリース、Beta版リリース。"
argument-hint: "リリースするバージョン（例: v1.3.0、v1.3.0-Beta1）。省略時は候補を提示します"
---

# リリーススキル

## 目的

タグ push を契機とするリリース（GitHub Release 作成・Firebase Hosting へのデプロイ）を、事前確認から結果確認まで漏れなく安全に実施します。

## 前提

- リリースは [create-release-note.yml](../../../.github/workflows/create-release-note.yml) と `deploy.yml` で自動化されています。詳細は [リリースフロー](../../../docs/docs/release-flow.md) と[バージョニング規約](../../../docs/docs/versioning.md)を参照してください。
    - 本番: `vX.Y.Z`（例: `v1.2.1`）。GitHub Release 作成後、`deploy.yml` が品質チェックを経て Firebase Hosting へデプロイします。
    - Beta: `vX.Y.Z-BetaN`（例: `v1.2.0-Beta1`）。プレリリースとして作成され、デプロイは行いません。
- リリースノートは [.github/release.yml](../../../.github/release.yml) のラベル別カテゴリで自動生成されます。
- タグは `origin/main` の最新コミットに付与します。
- タグの push は本番デプロイを伴い取り消しが難しいため、push 前に必ずユーザーの承認を得ます。
- 引数でバージョンが指定されない場合は、手順 4 で候補を提示します。

## 手順

1. `git status` で作業ツリーがクリーンであることを確認します。そうでなければ中断し、ユーザーに確認します。
2. `git fetch origin --tags` の後、`git tag --sort=-creatordate | head` と `gh release list --limit 5` で前回リリースを把握します。`gh run list --branch main --limit 5` で `origin/main` の CI が成功していることを確認し、失敗・実行中があれば中断して報告します。
3. 前回の本番タグから `origin/main` までの差分を確認します。
    - `git log <前回タグ>..origin/main --oneline` で一覧化します。差分がなければリリース不要として終了します。
    - 期間内のマージ済み PR を `gh pr list --state merged --base main --search "merged:>=<前回タグの日時>" --json number,title,labels` で取得し、`release.yml` のカテゴリに対応するラベルが無い PR を列挙します。付与の要否をユーザーに確認し、承認されたら `gh pr edit <番号> --add-label <ラベル>` で付与します。
    - `data/published-urls.yaml` の URL に影響する名称変更があれば、`firebase.json` のリダイレクトが追加されているか確認します。
4. 差分から [バージョニング規約](../../../docs/docs/versioning.md) に沿ってバージョン候補を提示し、ユーザーに確定してもらいます。事前確認したい場合は Beta 版（同一バージョンの既存 Beta があれば連番を進める）を提案します。
5. `git tag -l <タグ名>` で既存タグと重複しないことを確認します。
6. タグ名、付与先コミット（`git rev-parse --short origin/main`）、デプロイの有無、差分の要約と注意事項を提示し、タグ作成・push の承認を得ます。
7. 承認後、`git tag -a <タグ名> origin/main -m "<タグ名>"` と `git push origin <タグ名>` を実行します。
8. `gh run list --workflow create-release-note.yml --limit 1` で実行を特定し、`gh run watch <run-id> --exit-status` で完了まで監視します。正式リリースの場合は続く `deploy.yml` も同様に監視します。
9. `gh release view <タグ名> --json name,isPrerelease,url,body` で Release が作成され、プレリリース判定がタグ名と一致することを確認し、URL とリリースノートの要約を報告します。正式リリースでは <https://bicpema.com/> の反映確認をユーザーに依頼します。

## 失敗時の対応

- ワークフローが失敗した場合は `gh run view <run-id> --log-failed` の内容を報告し、再実行（`gh run rerun <run-id> --failed`）の要否を確認します。
- 誤ったタグの削除（`gh release delete <タグ名> --cleanup-tag`）は、ユーザーの明示的な指示がある場合のみ行います。

## 非対象

- Firebase 側の設定変更。
- リリースに含めるコード変更（通常の PR で行います）。

## 完了条件

- [ ] `origin/main` の CI 成功を確認している
- [ ] 差分・ラベル未付与 PR をユーザーに提示している
- [ ] ユーザーの承認を得て、規則に沿った注釈付きタグを push している
- [ ] `create-release-note.yml`（正式リリースは `deploy.yml` も）が成功し、Release のプレリリース判定が正しい
