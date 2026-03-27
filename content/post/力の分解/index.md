---
title: "力の分解"
description: "本教材は力ベクトルを水平・垂直成分に分解する過程を視覚的に理解するためのシミュレーション教材です。"
author: "kenji"
date: "2026-03-25"
tags: ["物理", "力学", "高校", "力の分解", "ベクトル"]
image: "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fforce-decomposition%2Fthumbnail.png?alt=media&token=280645f4-ae15-4560-a194-e9099df90cf3"
categories: ["力学"]
series: ["力学入門"]
aliases: []
---

## シミュレーションのリンク

[力の分解シミュレーションを開く](/vite/simulations/force-decomposition/)

## 扱っている現象および本教材の説明

力の分解とは、1つの力ベクトルを互いに直交する2つの方向の成分に分けることです。力はベクトル量であり、方向と大きさをもちます。力を水平方向と垂直方向に分解することで、運動の解析が容易になります。

任意の力ベクトル <b>F</b> を、水平方向（x成分）と垂直方向（y成分）に分解します。

力 <b>F</b> の大きさを F、x軸正方向からの角度を θ とすると：

<p style="text-align: center;">F<sub>x</sub> = F cosθ</p>
<p style="text-align: center;">F<sub>y</sub> = F sinθ</p>

また、逆に成分から合力を求めることもできます：

<p style="text-align: center;">F = √(F<sub>x</sub><sup>2</sup> + F<sub>y</sub><sup>2</sup>)，θ = arctan(F<sub>y</sub> / F<sub>x</sub>)</p>

> 斜面上の重力分解については [斜面の力の分解](/post/斜面の力の分解/) を参照してください。

## 対象

- 高校物理で力学を学習している学生
- 力とベクトルの概念を視覚的に理解したい学習者

## 使用方法

1. キャンバス中央の力ベクトル（黄色）の**先端をドラッグ**して力の方向と大きさを変えます。
2. 赤い矢印が水平成分 F<sub>x</sub>、青い矢印が垂直成分 F<sub>y</sub> を表します。
3. 右下の数値パネルで F、F<sub>x</sub>、F<sub>y</sub>、θ の値を確認できます。

## 観察のポイント

- θ = 0° のとき F<sub>y</sub> = 0 になり、力はすべて水平方向に向くことを確認しましょう。
- θ = 90° のとき F<sub>x</sub> = 0 になり、力はすべて垂直方向に向くことを確認しましょう。
- F<sub>x</sub><sup>2</sup> + F<sub>y</sub><sup>2</sup> = F<sup>2</sup> の関係（三平方の定理）が常に成り立つことを確認しましょう。

## 参考文献

- 高校物理教科書（力学分野）
- 大学物理力学の教科書
