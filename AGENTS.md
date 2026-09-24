# AGENTS.md

このファイルはリポジトリ全体の開発者向けインストラクションです。GitHub Copilot Coding Agent（AGENTS.md対応）と Claude Code（`CLAUDE.md` からの `@AGENTS.md` 読み込み）の両方から参照される、内容の実体（唯一のソース）です。

## フォルダー構成

- `.github/` : GitHub関連の設定ファイルを格納するフォルダー
- `.vscode/` : VSCode関連の設定ファイルを格納するフォルダー
- `archetypes/` : コンテンツのアーキタイプ（テンプレート）を格納するフォルダー
- `config/` : Hugoの設定ファイルを格納するフォルダー
- `content/` : サイトのコンテンツ（記事やページ）を格納するフォルダー
- `i18n/` : 多言語対応の翻訳ファイルを格納するフォルダー
- `layouts/` : サイトのレイアウトテンプレートを格納するフォルダー
- `static/` : CSS、JavaScript、画像などの静的ファイルを格納するフォルダー
- `template/` : シミュレーションのテンプレートファイルを格納するフォルダー
- `vite/` : Viteを使用したフロントエンドのビルド設定やシミュレーションファイルを格納するフォルダー
    - `_build/` : Viteのビルド設定を格納するフォルダー
    - `css/` : 共通のCSSファイルを格納するフォルダー
    - `js/` : 共通のJavaScriptファイルを格納するフォルダー
    - `simulations/` : 各シミュレーションのファイルを格納するフォルダー

## シミュレーションの実装手順

1. `vite/simulations/` ディレクトリに新しいシミュレーション用のフォルダを作成します。作成には、以下のコマンドを実行してください。

    ```python
    python new_simulation.py
    ```

1. 手順に従って、日本語名とハイフン区切りの英語名のシミュレーション名を入力します。
1. vite/simulations/ フォルダ内に新しいシミュレーション用のフォルダが作成され、その中に基本的なHTMLテンプレートファイルが生成されます。
1. 生成されたHTMLテンプレートファイルを開き、シミュレーションの内容を実装します。
1. 実装が完了したら、ローカルサーバーを起動して、シミュレーションが正しく動作することを確認します。
1. シミュレーションを追加した後、現象とシミュレーションの説明をする記事を追加します。

## プロジェクト概要

`README.md` を参照してください。

## サーバーの起動方法

`README.md` を参照してください。

## シミュレーションのビルド方法

`README.md` を参照してください。

## シミュレーションのパス

`README.md` を参照してください。

## レビューの注意点

- p5.jsから提供される関数群については、利用されていないなどのレビューコメントは不要です。
- ファイルを跨いだメソッドやクラスの参照については、利用されていないなどのレビューコメントは不要です。

## 実装の注意点

- 各シミュレーションは、他のシミュレーションに影響を与えないように実装してください。
- 共通のJavaScriptやCSSファイルを利用して、コードの重複を避けてください。
- シミュレーションのパフォーマンスを考慮し、必要に応じて最適化を行ってください。`frameRate`・`pixelDensity`・一時停止中の描画抑制・毎フレームの生成物回避については[パフォーマンス方針](docs/docs/simulation/index.md#パフォーマンス方針)に従ってください。
- シミュレーションはスクロールができないように実装してください。
- シミュレーションのUIはシンプルで直感的に操作できるように設計してください。
- 基本的には左下に再生・停止ボタンを配置してください。
- 基本的には、右上に設定表示ボタンを配置してください。
- シミュレーションの設定パネルは、ユーザーが簡単にアクセスできるように設計してください。
- p5.jsの記述スタイルはインスタンスモード（`new p5(sketch)`）に統一します。新規シミュレーションは`new_simulation.py`が生成するひな形（ESモジュール + インスタンスモード）に従い、グローバルモード（`function setup()`の直接定義）では実装しないでください。詳細は[シミュレーション実装方法](docs/docs/simulation/index.md#実装パターン)を参照してください。

## コミットメッセージ

`.vscode/commit-style.md` の接頭辞ルール（`feat:` / `fix:` / `docs:` など）に従って、日本語でコミットメッセージを書いてください。

## ブランチ運用方針

- ブランチの種類とプレフィックスは [development-flow.md のブランチ戦略](docs/docs/development-flow.md#ブランチ戦略)（`feature/` / `fix/` / `chore/` 等）に従います。`docs/` ・`style/` ・`refactor/` ・`test/` ・`perf/` が必要な場合も、対応する[コミットメッセージ](#コミットメッセージ)のtypeに合わせて使用してください。
- ブランチは `main` から、`<type>/<内容を表す簡潔な日本語スラッグ>` の形式で作成します（例: `feature/シミュレーション結果一覧の追加`）。スラッグは体言止めの日本語とし、固有名詞・技術用語はそのまま英数字で構いません。ブランチ名にIssue番号は含めず、対応するIssueとの紐付けはコミットメッセージやPRの説明で行います。
- 複数のブランチ・Issueを並行して扱う場合は、他の作業ディレクトリと衝突しないよう `git worktree` を使用します。worktreeはリポジトリ直下の `.claude/worktrees/` 配下に作成してください（`.gitignore` によりgit管理対象外です）。

    ```bash
    git worktree add .claude/worktrees/<作業内容を表す英数字の略称> -b <type>/<日本語スラッグ> origin/main
    ```

    作業完了後は `git worktree remove <path>` で作業ディレクトリを削除してください。

- `main` へのマージは必ずPull Request経由で行い、`main` への直接pushは行いません。CIのグリーンとレビュー承認を確認してからマージしてください。
- マージ後、作業ブランチ（リモート・ローカルおよび使用したworktree）は速やかに削除してください。
- 本リポジトリでは[スタックプルリクエスト](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests)（`gh stack`）は採用していません。

## Pull Requestの作成手順

1. 作業前に、対応するIssueが存在することを確認してください（なければ「[Issueの登録手順](#issueの登録手順)」に従って作成します）。
1. 「[ブランチ運用方針](#ブランチ運用方針)」に従いブランチを作成します。
1. 変更内容に応じて該当するチェックを実行してください（`npm run lint:md` / `npm run format:check` / `npm run typecheck` / `npm test` など。詳細は [package.json](package.json) の `scripts` を参照）。
1. [.github/pull_request_template.md](.github/pull_request_template.md) に従い、以下の項目を省略せず記入してPRを作成します。
    - 本プルリクエストで実施したこと
    - 本プルリクエストで実施していないこと
    - 関連Issue、参考ページ（`Closes #<Issue番号>` の形式でIssueを紐付けます）
    - `gh pr create` などCLIでPRを作成する場合、テンプレートは本文に自動反映されません。`gh pr create --body-file .github/pull_request_template.md` などでテンプレートを読み込んでから各項目を記入してください。
    - 本リポジトリにはPRテンプレートの記入漏れを検知するCIは存在しないため、レビュー時に目視で確認してください。
1. PRタイトルは[コミットメッセージ](#コミットメッセージ)と同様の `<type>: <変更内容の要約>` 形式にしてください。
1. 関連Issueと情報を紐付けるため、PRにも以下のフィールドを設定してください。
    - Labels・Milestoneは関連Issueと同じ値を設定します。他Issue対応時の値を誤って引き継がないよう、設定前に必ず `gh issue view <Issue番号> --json labels,milestone` で対象Issueの現在の値を取得し、その値のみを設定してください（例: `gh pr edit <PR番号> --add-label "<名前>" --milestone "<名前>"`）。Issueにラベルが付いていない場合はPRにもラベルを付けず、Issueにマイルストーンが設定されていない場合はPRにもマイルストーンを設定しません。
    - 設定後は `gh pr view <PR番号> --json labels,milestone` で実際の設定値を確認し、対象Issueの値と一致しない場合は `gh pr edit` で修正してください。
    - Priority・Effort（[Issue Fields](#priorityeffortの設定issue-fields-api)）はPull Requestには設定できません（GraphQL APIの`setIssueFieldValue`がPRのノードIDを解決できないため）。Issue側の値のみで管理します。
    - プロジェクトボードのStatusは、Issueがマージ・クローズに連動して自動更新されるため、通常は手動設定不要です。
1. CIが全てグリーンであることを確認し、レビュー承認を得てからマージしてください。

## Issueの登録手順

1. [Issues](https://github.com/Bicpema/bicpema/issues) から「New issue」をクリックし、目的に応じたテンプレートを選択します。
    - `general-template.md` — 汎用テンプレート（不具合報告も含む）
    - `simulation-create-template.md` / `simulation-mentenance-template.md` — シミュレーションの新規作成／メンテナンス
    - `article-create-template.md` / `article-mentenance-template copy.md` — 記事の新規作成／メンテナンス
    - `copilot-issue.md` — GitHub Copilot Coding Agentへの依頼用
1. 作成前に、既存の重複Issueがないか検索して確認してください。
1. タイトルと内容を記入し、[development-flow.md のラベル一覧](docs/docs/development-flow.md#ラベル一覧)から適切なラベルを付与してください。
1. 必要に応じて以下の標準フィールドを設定してください。

    | フィールド                 | 目的・判断基準                                                            | 設定方法                                                                                                |
    | -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
    | Type                       | Issueの種類（`Task` / `Bug` / `Feature`）。テンプレートの内容と一致させる | `gh issue edit <番号> --type <Task\|Bug\|Feature>`                                                      |
    | Milestone                  | どのリリース（例: `v1.2.0`）に含めるかを示す                              | `gh issue create --milestone "<名前>"` / `gh issue edit <番号> --milestone "<名前>"`                    |
    | Labels                     | 領域・性質を示す分類（development-flow.mdの一覧から選択）                 | `gh issue create --label "<名前>"` / `gh issue edit <番号> --add-label "<名前>"`                        |
    | プロジェクトボードのStatus | 着手状況（未着手／着手中／レビュー中／完了 等）                           | プロジェクトボード画面から設定（`gh project item-edit`でも可）                                          |
    | Priority                   | 対応の緊急度（`Urgent` / `High` / `Medium` / `Low`）                      | 下記「[Priority/Effortの設定](#priorityeffortの設定issue-fields-api)」の手順でGraphQL APIを直接呼び出す |
    | Effort                     | 想定作業量（`High` / `Medium` / `Low`）                                   | 同上                                                                                                    |
    | Blocked by / Blocking      | 他Issueが完了するまで着手できない依存関係があるか                         | 下記「[Blocked by / Blockingの設定](#blocked-by--blockingの設定)」の手順でGraphQL APIを直接呼び出す     |

### Priority/Effortの設定（Issue Fields API）

Priority・Effortは、プロジェクトボードの画面上ではProjectV2の項目のように表示されますが、実体はリポジトリ直下の **Issue Fields** という別のGraphQL API体系（`Repository.issueFields` / `setIssueFieldValue`）のフィールドです。`gh issue create` / `gh issue edit` や `gh project item-edit --field` では設定できないため、GraphQL APIを直接呼び出す必要があります。

```bash
# 1. フィールド定義・選択肢のIDを取得する（IDは変更されうるため都度確認する）
gh api graphql -f query='
query {
  repository(owner: "Bicpema", name: "bicpema") {
    issueFields(first: 20) {
      nodes {
        __typename
        ... on IssueFieldSingleSelect { id name options { id name } }
      }
    }
  }
}'

# 2. IssueのノードIDを取得する
gh issue view <番号> --json id --jq .id

# 3. Issueに値を設定する
gh api graphql -f query='
mutation($issueId: ID!, $fieldId: ID!, $optionId: ID!) {
  setIssueFieldValue(input: {
    issueId: $issueId,
    issueFields: [{ fieldId: $fieldId, singleSelectOptionId: $optionId }]
  }) {
    issue { number }
  }
}' -f issueId="<手順2で取得したID>" -f fieldId="<手順1で取得したフィールドID>" -f optionId="<手順1で取得したオプションID>"
```

### Blocked by / Blockingの設定

Blocked by（依存先）・Blocking（依存されている側）も、Priority/Effortと同様にProjectV2フィールドとは別の仕組み（`addBlockedBy` / `removeBlockedBy` ミューテーション）で設定するIssue自体の関係です。

```bash
# 依存する側・依存先双方のノードIDを取得する
gh issue view <依存する側の番号> --json id --jq .id
gh issue view <依存先の番号> --json id --jq .id

# issueId に依存する側、blockingIssueId に依存先（完了を待つ側）を指定する
gh api graphql -f query='
mutation($issueId: ID!, $blockingIssueId: ID!) {
  addBlockedBy(input: { issueId: $issueId, blockingIssueId: $blockingIssueId }) {
    issue { number }
    blockingIssue { number }
  }
}' -f issueId="<依存する側のID>" -f blockingIssueId="<依存先のID>"
```

解除する場合は同じ引数で `removeBlockedBy` を呼び出してください。本リポジトリには依存関係を示す専用ラベル（例: 「ブロック中」）は用意していないため、ラベル付与は行いません。

## コードレビューの観点

PRのレビューを実施・支援する際は、以下の観点を確認してください。

- **正しさ**: 意図通りに動作するか、エッジケースが考慮されているか
- **可読性**: 変数名・関数名が適切か、処理の意図が読み取れるか
- **一貫性**: 既存のコードのスタイルや設計方針（[実装の注意点](#実装の注意点)を含む）に沿っているか
- **テスト**: 必要なテストが追加されているか
- **ドキュメント**: 仕様変更に伴うドキュメント更新の要否

指摘はコードに対して行い、断定的な表現は避けて理由を添えてください。重要度が異なる指摘は区別し（例: 些細な指摘には `nit:` を付ける）、良い点も積極的にコメントしてください。なお、p5.jsから提供される関数群やファイルを跨いだメソッド・クラス参照についての指摘は「[レビューの注意点](#レビューの注意点)」のとおり不要です。

## Agent Skills / Subagents

ワークフロースキルは `.claude/skills/`、サブエージェントは `.claude/agents/` に配置されています。Claude Code・GitHub Copilot Coding Agent共通の置き場所です。
