---
name: p5js-simulation
description: "WORKFLOW SKILL — templates/ 配下のテンプレートを使って p5.js + Material Design でインタラクティブなシミュレーション教材を作成します。"
---

# p5.js シミュレーション (Material Design)

このスキルは、**p5.js** を使ったインタラクティブなシミュレーション教材を、**Material Design** で統一された見た目で、再利用可能なテンプレートから素早く作成したいときに使います。

このスキルは、`.github/skills/p5js-simulation/templates/` フォルダに `*.html`、`*.css`、`*.js` のスターターファイルがあり、Material Design + p5.js のプロジェクト規約に従っていることを前提としています。

---

## ✅ 目的

以下の要件を満たす動作するインタラクティブシミュレーションを作成します。

- **p5.js** を使って描画・アニメーションを行う。
- **Material Design** の見た目（MDC Web / Material Web Components / Material Design の配色・タイポグラフィ）を使う。
- `.github/skills/p5js-simulation/templates/` 配下のテンプレートから開始し、実行可能なシミュレーションを新しいフォルダ（例：`simulations/<name>/`）に出力する。

---

## 🧭 ワークフロー（手順）

1. **シミュレーションの狙いを定義する**
   - 何を教えたい / 何を示したいシミュレーションか？
   - 対象は誰か（学生、初心者、上級者など）？
   - どんな入力、出力、インタラクションが必要か？

2. **テンプレートを選ぶ**
   - `.github/skills/p5js-simulation/templates/` の中から、目的に合う HTML/CSS/JS の足場を探す。
   - 適切なものがなければ、既存パターンに従って新しいテンプレートを `.github/skills/p5js-simulation/templates/` に追加する。

3. **新しいシミュレーション用フォルダを作る**
   - 選んだテンプレートをコピーし、新しいディレクトリ（例：`simulations/<slug>/`）を作る。
   - 必要に応じてファイル名を変更する（例：`index.html`、`styles.css`、`sketch.js` など）。

4. **p5.js を組み込み**
   - `index.html` に正しい p5.js の読み込み（ローカル）が含まれていることを確認する。
   - テンプレートのスケッチファイルに p5.js の `setup()` / `draw()` コードを置く。
   - コードはモジュール化し、モデル（データ/状態）、ビュー（描画）、コントローラ（操作）を分ける。

5. **Material Design スタイルを適用する**
   - テンプレートが使っている Material Design の足場（MDC Web / Material Web Components）で UI コントロールを作る。
   - 配色、タイポグラフィ、余白などがデザインシステムに準拠していることを確認する。
   - 新しいコントロール（スライダー、ボタン、カードなど）が必要なら、テンプレート内の既存パターンに従って追加する。

6. **インタラクションを検証する**
   - ローカルでシミュレーションを動かす（例：`index.html` をブラウザで開く、または簡易サーバーを起動する）。
   - p5 のキャンバスが更新され、コントロールが動き、レスポンシブなレイアウトが維持されることを確認する。

7. **品質チェック（完了条件）**
   - コンソールにエラーが出ずにシミュレーションが起動する。
   - インタラクティブなコントロールが Material Design でスタイルされており、アクセシビリティも配慮されている。
   - p5 のスケッチがスムーズに動き（単純なシミュレーションで 30fps 以上）、UI が固まらない。
   - コードが整理されている：テンプレートコードは可能な限り変更せず、カスタムロジックはシミュレーション専用の JS に置く。

---

## 🧩 判断ポイント / 分岐

- **テンプレートが必要か？**
  - 目的のレイアウトに合うテンプレートが無ければ、`.github/skills/p5js-simulation/templates/` に新しいテンプレートを追加し、フォルダ命名規則に従う。

- **シミュレーションのバリエーションを複数作るか？**
  - `simulations/` 以下に別々のフォルダを作成し、共有 JS/CSS をインポートして再利用する。

- **コンポーネントライブラリを変更したいか？**
  - テンプレートの Material 設定（例：MDC → Material Web Components への切り替え）を更新するか、テンプレートはそのままにして `templates/` に補助ユーティリティを追加するかを判断する。

---

## 📦 テンプレートの追加・参照場所

- テンプレートは `.github/skills/p5js-simulation/templates/` に置く。
- 各テンプレートには以下を含めること：
  - `index.html`（エントリーポイント）
  - `styles.css`（Material Design スタイル + レイアウト）
  - `sketch.js`（p5.js スケッチコード）または同等の JS ファイル
  - テンプレートから参照される共有アセット（アイコン、フォントなど）

---

## 💡 試してみるプロンプト例

- `/p5js-simulation マウスの動きに反応するパーティクルシステムを、"material-card" テンプレートを使って作成して。`
- `/p5js-simulation 初速と角度のスライダー付きで放物運動シミュレータを作成して（テンプレート: .github/skills/p5js-simulation/templates/physics-basic）。`
- `/p5js-simulation 既存の .github/skills/p5js-simulation/templates/interactive-map シミュレーションにスコアカウンターとリセットボタンを追加して。`

---

## 🔭 次に追加するとよいカスタマイズ（任意）

- `templates/` の構成ルールを検証する linter/チェッカーを追加する。
- 説明からスケッチの雛形を生成する補助プロンプト（例: `p5js-sketch.prompt.md`）を追加する。
- 生成されたシミュレーションで Material Design のアクセシビリティチェックを強制する `instructions` ファイルを追加する。
