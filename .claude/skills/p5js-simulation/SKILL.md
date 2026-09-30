---
name: p5js-simulation
description: "WORKFLOW SKILL — src/simulations/_template/ のテンプレートを使って p5.js + Material Design でインタラクティブなシミュレーション教材を作成します。"
---

# p5.js シミュレーション (Material Design)

このスキルは、**p5.js** を使ったインタラクティブなシミュレーション教材を、**Material Design** で統一された見た目で、再利用可能なテンプレートから素早く作成したいときに使います。

このスキルは、`src/simulations/_template/` フォルダに `index.astro`・`ts/*.ts` のスターターファイルがあり、Material Design + p5.js のプロジェクト規約に従っていることを前提としています。

---

## ✅ 目的

以下の要件を満たす動作するインタラクティブシミュレーションを作成します。

- **p5.js** を使って描画・アニメーションを行う。
- **Material Design** の見た目（MDC Web / Material Web Components / Material Design の配色・タイポグラフィ）を使う。
- `src/simulations/_template/` のテンプレートから開始し（`npm run new:simulation`）、実行可能なシミュレーションを新しいフォルダ（例：`src/simulations/<name>/`）に出力する。

---

## 🧭 ワークフロー（手順）

1. **シミュレーションの狙いを定義する**
    - 何を教えたい / 何を示したいシミュレーションか？
    - 対象は誰か（学生、初心者、上級者など）？
    - どんな入力、出力、インタラクションが必要か？

2. **テンプレートを選ぶ**
    - `src/simulations/_template/` を足場にする（`_` で始まるフォルダーはページとして出力されない）。
    - 共通UIパーツは `src/components/simulation/` のAstroコンポーネント（`NavBar` / `LoadingSpinner` / `SettingsButton` / `SettingsModal` / `Icon`）を使う。

3. **新しいシミュレーション用フォルダを作る**
    - `npm run new:simulation` でテンプレートをコピーし、新しいディレクトリ（例：`src/simulations/<slug>/`）を作る。
    - ページは `index.astro`、ロジックは `ts/` 配下に置く。

4. **p5.js を組み込み**
    - `index.astro` の末尾で `<script src="./ts/index.ts"></script>` を読み込み（`src` 以外の属性を付けるとAstroがバンドルしない）、p5.jsは `ts/index.ts` で `import` する。
    - テンプレートのスケッチファイルに p5.js の `setup()` / `draw()` コードを置く。
    - コードはモジュール化し、モデル（データ/状態）、ビュー（描画）、コントローラ（操作）を分ける。
    - **ES Modules形式で実装することを必須とし、`import`/`export` を活用して機能を分割する。**

5. **Material Design スタイルを適用する**
    - テンプレートが使っている Material Design の足場（MDC Web / Material Web Components）で UI コントロールを作る。
    - 配色、タイポグラフィ、余白などがデザインシステムに準拠していることを確認する。
    - 新しいコントロール（スライダー、ボタン、カードなど）が必要なら、テンプレート内の既存パターンに従って追加する。
    - ボタン等のアイコンは `<svg>` をべた書きせず、`<Icon name="camera" size={20} />` のように共通コンポーネント（`src/components/Icon.astro`）で記述する（アイコン名は [Bootstrap Icons](https://icons.getbootstrap.com/) を参照）。アイコンのみのボタンには `aria-label` を付与する。詳細は [共通UIコンポーネント](../../../docs/docs/simulation/index.md#共通uiコンポーネント) を参照。

6. **インタラクションを検証する**
    - `npm run dev` で開発サーバーを起動し、`http://localhost:4321/vite/simulations/<slug>/` を開く。
    - p5 のキャンバスが更新され、コントロールが動き、レスポンシブなレイアウトが維持されることを確認する。

7. **品質チェック（完了条件）**
    - コンソールにエラーが出ずにシミュレーションが起動する。
    - インタラクティブなコントロールが Material Design でスタイルされており、アクセシビリティも配慮されている。
    - p5 のスケッチがスムーズに動き（単純なシミュレーションで 30fps 以上）、UI が固まらない。
    - コードが整理されている：テンプレートコードは可能な限り変更せず、カスタムロジックはシミュレーション専用の JS に置く。

---

## 🧩 判断ポイント / 分岐

- **テンプレートが必要か？**
    - 目的のレイアウトに合うテンプレートが無ければ、`src/simulations/` に `_` で始まる名前で新しいテンプレートを追加する。

- **シミュレーションのバリエーションを複数作るか？**
    - `src/simulations/` 以下に別々のフォルダを作成し、共有 TS（`src/lib/simulation/`）をインポートして再利用する。

- **コンポーネントライブラリを変更したいか？**
    - テンプレートの Material 設定（例：MDC → Material Web Components への切り替え）を更新するか、テンプレートはそのままにして `src/lib/simulation/` に補助ユーティリティを追加するかを判断する。

---

## 📦 テンプレートの追加・参照場所

- テンプレートは `src/simulations/` に `_` で始まる名前（標準は `_template/`）で置く。
- 各テンプレートには以下を含めること：
    - `index.astro`（ページ。`SimulationLayout` と共通コンポーネントを使う）
    - `ts/index.ts`（p5.js スケッチのエントリーポイント）と、分割したモジュール
    - スタイルは Tailwind CSS のクラスで記述する（`src/styles/simulation.css` を `SimulationLayout` が読み込む）

---

## 💡 試してみるプロンプト例

- `/p5js-simulation マウスの動きに反応するパーティクルシステムを、"material-card" テンプレートを使って作成して。`
- `/p5js-simulation 初速と角度のスライダー付きで放物運動シミュレータを作成して（テンプレート: src/simulations/_template）。`
- `/p5js-simulation 既存の src/simulations/pendulum シミュレーションにスコアカウンターとリセットボタンを追加して。`

---

## 🔭 次に追加するとよいカスタマイズ（任意）

- 説明からスケッチの雛形を生成する補助プロンプト（例: `p5js-sketch.prompt.md`）を追加する。
- 生成されたシミュレーションで Material Design のアクセシビリティチェックを強制する `instructions` ファイルを追加する。
