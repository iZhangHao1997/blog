# Sass 中的 CSS @规则

兼容性（名称插值）：

- Dart Sass：since 1.15.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

> LibSass、Ruby Sass 和更老版本的 Dart Sass 不支持 @规则名称里使用插值。但是它们支持在值里使用插值。

Sass 支持所有 CSS 的 @规则。为了保持扩展性和对 CSS 未来版本的向前兼容性，Sass 对所有@规则都有通用的支持。CSS @规则语法为 `@<name> <value>`、`@<name> {...}` 或者 `@<name> <value> { ... }`。名称必须为一个标志符，值（如果存在）几乎可以是任何东西。名字 `name` 和值 `value` 都可以包含插值。如下代码：

::: code-group

```scss
@namespace svg url(http://www.w3.org/2000/svg);

@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
}

@counter-style thumbs {
  system: cyclic;
  symbols: "\1F44D";
}
```

```css
@namespace svg url(http://www.w3.org/2000/svg);
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
}
@counter-style thumbs {
  system: cyclic;
  symbols: "\1F44D";
}
```

:::

如果一个 CSS @规则嵌套在一个样式规则里面，这两个规则会交换位置以至于@规则可以在 CSS 输出的顶层。这使得添加条件样式变得容易，而无需重写样式规则的选择器。如下代码：

::: code-group

```scss
.print-only {
  display: none;

  @media print {
    display: block;
  }
}
```

```css
.print-only {
  display: none;
}
@media print {
  .print-only {
    display: block;
  }
}
```

:::

## @media

兼容性（范围语法）：

- Dart Sass：since 1.11.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：since 3.7.0

> LibSass 、更老版本的 Dart Sass 和 Ruby Sass 都不支持[带范围媒体查询语法](https://www.w3.org/TR/mediaqueries-4/#mq-range-context)。它们支持其他标准的媒体查询。

::: code-group

```scss
@media (width <= 700px) {
  body {
    background: green;
  }
}
```

```css
@media (width <= 700px) {
  body {
    background: green;
  }
}
```

:::

`@media` 支持所有的[媒体查询规则](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) 。除此外还允许插值，也允许 SassScript 表达式被用在[媒体查询特性](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#targeting_media_features)的任何地方。如下代码：

::: code-group

```scss
$layout-breakpoint-small: 960px;

@media (min-width: $layout-breakpoint-small) {
  .hide-extra-small {
    display: none;
  }
}
```

```css
@media (min-width: 960px) {
  .hide-extra-small {
    display: none;
  }
}
```

:::

当可能的时候，Sass 也会允许合并媒体查询当它们互相嵌套时，以便更轻松地支持尚未支持原生 `@media` 嵌套规则的游览器。如下代码：

:::code-group

```scss
@media (hover: hover) {
  .button:hover {
    border: 2px solid black;

    @media (color) {
      border-color: #036;
    }
  }
}
```

```css
@media (hover: hover) {
  .button:hover {
    border: 2px solid black;
  }
}
@media (hover: hover) and (color) {
  .button:hover {
    border-color: #036;
  }
}
```

:::

## @supports

[@supports 规则](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)也允许在声明查询时使用 Sasscript 表达式。如下代码：

:::code-group

```scss
@mixin sticky-position {
  position: fixed;
  @supports (position: sticky) {
    position: sticky;
  }
}

.banner {
  @include sticky-position;
}
```

```css
.banner {
  position: fixed;
}
@supports (position: sticky) {
  .banner {
    position: sticky;
  }
}
```

:::

## @keyframes

[@keyframes 规则](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)和普通的@规则一样工作，除了它的子规则必须是合法的 keyframe 规则（`<number>%`、`from` 或者 `to`）。如下代码：

:::code-group

```scss
@keyframes slide-in {
  from {
    margin-left: 100%;
    width: 300%;
  }

  70% {
    margin-left: 90%;
    width: 150%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
```

```css
@keyframes slide-in {
  from {
    margin-left: 100%;
    width: 300%;
  }
  70% {
    margin-left: 90%;
    width: 150%;
  }
  to {
    margin-left: 0%;
    width: 100%;
  }
}
```

:::
