::: tip 前言
目前 [Sass 官网文档](https://sass-lang.com/documentation/)只有英文，没有汉化版（有几个直接机翻的汉化 sass 文档，且版本比较久），所以决定自己翻译来学习 Sass，同时也亲密接触自己比较抗拒的英文（有中文文档必看中文，但其实可能英文文档更好理解）。开始吧～ :tada:
:::

Sass 支持两种不同的语法。每个都能加载另一个（我的理解是 .scss 和 .sass 可以互相 import 和 use），所以选择哪一种语法取决于你和你的团队。

## SCSS

SCSS 语法使用的是 `.scss` 文件扩展名。除了一些小的例外，它是 CSS 的超集，意味着本质上所有合法的 CSS 语法在 SCSS 里也是合法的。由于它和 CSS 的相似性，它是最容易上手和最流行的语法。

SCSS 看起来像这样：

```scss
@mixin button-base() {
  @include typography(button);
  @include ripple-surface;
  @include ripple-radius-bounded;

  display: inline-flex;
  position: relative;
  height: $button-height;
  border: none;
  vertical-align: middle;

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    color: $mdc-button-disabled-ink-color;
    cursor: default;
    pointer-events: none;
  }
}
```

## The Indented Syntax - 缩进语法

缩进语法是 Sass 的原始语法，所以它使用 `.sass` 文件扩展名。由于这个扩展名，它有时就被称为“Sass”。缩进语法和 SCSS 一样支持所有相同的功能，但是它是使用缩进代替花括号和分号来描述文档的格式。

一般来说，任何时候你在 CSS 或 SCSS 中写花括号，都可以在缩进语法中使用一层缩进。并且缩进语法在任何一行的结束，都相当于一个分号。文档中缩进语法有一些和 SCSS 语法不同的地方都会被标注和引用出来。

::: danger 注意！
缩进语法当前不支持跨行换行的表达式。参考 [issue #216](https://github.com/sass/sass/issues/216)。
:::

缩进语法看起来像：

```sass
@mixin button-base()
  @include typography(button)
  @include ripple-surface
  @include ripple-radius-bounded

  display: inline-flex
  position: relative
  height: $button-height
  border: none
  vertical-align: middle

  &:hover
    cursor: pointer

  &:disabled
    color: $mdc-button-disabled-ink-color
    cursor: default
    pointer-events: none
```

::: tip 语法偏好
我自己是在项目中使用 SCSS 语法，花括号和分号更适合我自己的编程习惯，所以学习重心会放在 SCSS 语法，所以后面语法的学习我都会拿 SCSS 语法代码作为例子。但是缩进语法的简洁肯定也会受人喜欢，就得自己参考官方文档的缩进语法的代码了，萝卜青菜各有所爱吧～
:::
