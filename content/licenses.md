+++
title = "サードパーティライセンス"
description = "Bicpemaのサイト・シミュレーションで利用しているサードパーティのテーマ・ライブラリ・フォントのライセンス表記です。"
date = "2026-09-27"
author = "Bicpema Developer Team"
+++

Bicpemaのサイト・シミュレーションは、以下のサードパーティのテーマ・ライブラリ・フォントを利用しています。各ライブラリの著作権は、それぞれの著作権者に帰属します。

## hugo-theme-tailwind

サイトのテーマには [hugo-theme-tailwind](https://github.com/tomowang/hugo-theme-tailwind) を利用しています。hugo-theme-tailwindには **MIT License** が適用されます。

<details>
<summary>ライセンス全文</summary>

```text
MIT License

Copyright (c) [2023] [Xiaoliang Wang]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>

## p5.js

シミュレーションの描画には [p5.js](https://p5js.org/) を利用しています。p5.jsには **GNU Lesser General Public License v2.1（LGPL-2.1）** が適用されます。

- 利用バージョン: 下記「[バンドルしているライブラリ](#バンドルしているライブラリ)」の `p5` の項目を参照してください。
- ソースコードの入手先: <https://github.com/processing/p5.js>（各バージョンのソースコードは [Releases](https://github.com/processing/p5.js/releases) から入手できます）
- ライセンス全文: 下記「[バンドルしているライブラリ](#バンドルしているライブラリ)」の `p5` の項目を参照してください。
- p5.jsは、Bicpemaのシミュレーションのコードとは独立したファイル（`/vite/assets/p5.min-*.js`）として配信しており、改変したp5.jsへの差し替えが可能です。
- p5.jsに同梱されている p5.sound には MIT License が適用されます。

## math.js

数式処理には [math.js](https://mathjs.org/) を利用しています。math.jsには **Apache License 2.0** が適用されます。ライセンス全文は下記「[バンドルしているライブラリ](#バンドルしているライブラリ)」の `mathjs` の項目を参照してください。math.jsのNOTICEファイルの内容は以下のとおりです。

```text
math.js
https://github.com/josdejong/mathjs

Copyright (C) 2013-2026 Jos de Jong <wjosdejong@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Bootstrap Icons

一部のシミュレーションのボタン等のアイコンには [Bootstrap Icons](https://icons.getbootstrap.com/) を利用しています。Bootstrap Iconsには **MIT License** が適用されます。アイコンはビルド時にSVGとしてHTMLへ埋め込んでいるため、下記「[バンドルしているライブラリ](#バンドルしているライブラリ)」の一覧には含まれません。

<details>
<summary>ライセンス全文</summary>

```text
The MIT License (MIT)

Copyright (c) 2019-2024 The Bootstrap Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

</details>

## バンドルしているライブラリ

シミュレーションのビルド時にバンドルしているライブラリと、そのライセンス全文です。この一覧はビルド時に自動生成しています。

{{< bundled-licenses >}}
