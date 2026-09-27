# 開発フロー

## ブランチ戦略

| ブランチ    | 用途                                                             |
| ----------- | ---------------------------------------------------------------- |
| `main`      | 本番リリース用。直接コミット禁止。マージ時に自動デプロイされる。 |
| `copilot/*` | GitHub Copilot エージェントが作業するブランチ                    |
| `feature/*` | 新機能の開発                                                     |
| `fix/*`     | バグ修正                                                         |
| `chore/*`   | その他のメンテナンス作業                                         |

## Issue の作成

1. [Issues](https://github.com/Bicpema/bicpema/issues) から「New issue」をクリックする
2. 目的に応じたテンプレートを選択する
    - **general template** — 汎用テンプレート
    - **simulation template** — シミュレーションの追加・メンテナンス
3. タイトルと内容を記入し、適切なラベルを付ける

## プルリクエストの作成

1. `main` から作業ブランチを切る
2. 変更を加えてコミットする
3. Pull Request を作成し、テンプレートに沿って記述する
    - 実施したこと
    - 実施していないこと
    - 関連 Issue・参考ページ
4. レビューを受けて修正する
5. `main` にマージすると自動デプロイが開始される

## worktreeの後始末

Issue単位の作業では `.claude/worktrees/` 配下に `git worktree` を作成します。マージ後は、使用したworktreeとローカルブランチを速やかに削除してください。

削除漏れがないか定期的に確認するには、以下を実行します。

```bash
# マージ済みPRに対応するworktreeを一覧表示する（削除はしない）
npm run clean:worktrees

# 一覧表示された削除対象のworktreeとローカルブランチを削除する
npm run clean:worktrees -- --delete
```

- マージ状態はGitHub CLI（`gh`）でPRを参照して判定します。squash mergeのため、`git branch --merged` では判定できません。
- 以下のworktreeは削除せずスキップします。
    - マージ済みPRのheadコミット以降に追加コミットがあるもの
    - 未コミットの変更・未追跡ファイルが残っているもの
- 実行時に `git worktree prune` も行い、手動で削除されたworktreeの管理情報を掃除します。

## コミットメッセージ

特定の規約は設けていませんが、変更内容が分かりやすい日本語または英語のメッセージを推奨します。

```text
feat: ドップラー効果シミュレーションを追加
fix: 波の反射シミュレーションで音が鳴らない不具合を修正
chore: dependabotによる依存関係の更新
```

## 掲載URLの維持とリダイレクト

教科書などの外部出版物には Bicpema のURLが掲載されており、出版物は約4年間改訂されません。その間にリンク切れを起こさないよう、以下の運用とします。

- シミュレーション名（`vite/simulations/` のフォルダー名）・記事スラッグ（`content/post/` のフォルダー名）の変更やページの移転を行う場合は、旧URLから新URLへのリダイレクトを `firebase.json` の `hosting.redirects` に**必ず**追加する
- 外部に掲載されたURLは `data/published-urls.yaml` に登録する。掲載先（出版物名・掲載年度）が判明したら `publications` に追記する
- 登録したURLがビルド成果物（`public/`）に存在するか、`firebase.json` のリダイレクト先が存在するかを `npm run check:published-urls` で検査する。CI（`check-published-urls.yml`）でもPRごとに実行され、掲載URLにアクセスできなくなる変更はCIが失敗する

ローカルで検査する場合は、Vite・Hugoのビルド後に実行します。

```bash
npm run build
hugo --minify
npm run check:published-urls
```

## GitHub Actions

| ワークフロー               | トリガー                                      | 処理                                                        |
| -------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| `deploy.yml`               | `workflow_dispatch` (手動) またはリリースタグ | Vite ビルド → Hugo ビルド → Firebase Hosting へデプロイ     |
| `create-release-note.yml`  | `v*.*.*` または `v*.*.*-Beta*` タグのプッシュ | GitHub Release を自動作成し、正式リリース時はデプロイを起動 |
| `check-published-urls.yml` | Pull Request、`main` へのプッシュ             | Vite ビルド → Hugo ビルド → 掲載URLのリンク切れチェック     |

## ラベル一覧

| ラベル                                             | 用途                                   |
| -------------------------------------------------- | -------------------------------------- |
| `シミュレーションの新規作成`                       | 新しいシミュレーションの追加           |
| `シミュレーションのメンテナンス`                   | 既存シミュレーションの修正             |
| `記事の新規作成`                                   | Hugo 記事の追加                        |
| `記事のメンテナンス`                               | 既存記事の修正                         |
| `依存関係` / `npm`                                 | npm 依存関係の更新                     |
| `開発環境改善` / `github actions` / `Agent Skills` | CI・ツール改善                         |
| `Hugo`                                             | Hugo テンプレートの変更                |
| `リリース`                                         | リリース関連（リリースノートから除外） |
| `not triaged`                                      | 未トリアージ（リリースノートから除外） |
