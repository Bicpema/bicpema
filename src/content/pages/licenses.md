+++
title = "サードパーティライセンス"
description = "Bicpemaのサイト・シミュレーションで利用しているサードパーティのライブラリ・フォントのライセンス表記です。"
date = "2026-09-27"
author = "Bicpema Developer Team"
+++

Bicpemaのサイト・シミュレーションは、以下のサードパーティのライブラリ・フォントを利用しています。各ライブラリの著作権は、それぞれの著作権者に帰属します。

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

## Zen Maru Gothic

一部のシミュレーションでは、フォント [Zen Maru Gothic](https://github.com/googlefonts/zen-marugothic) を利用しています。Zen Maru Gothicには **SIL Open Font License 1.1** が適用されます。

<details>
<summary>ライセンス全文</summary>

```text
Copyright 2021 The Zen Maru Gothic Project Authors (https://github.com/googlefonts/zen-marugothic)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

</details>

## バンドルしているライブラリ

シミュレーションのビルド時にバンドルしているライブラリと、そのライセンス全文です。この一覧はビルド時に自動生成しています。

{{< bundled-licenses >}}
