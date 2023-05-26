# Sass 属性声明

在 Sass 中和 CSS 一样，属性声明定义了如何设置与选择器匹配的元素的样式。但是 Sass 新增额外的特性来使这更加容易编写和更加自动化。首先，声明的值可以是任何 SassScript 表达式，它将被计算和包含在结果中。

例如 Sass 代码：

```scss
.circle {
  $size: 100px;
  width: $size;
  height: $size;
  border-radius: $size * 0.5;
}
```

生成的 css 代码如下：

```css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
```

## 插值

一个属性的名字可以包含插值，插值可以让需要动态生成属性值成为可能。你可以甚至使用插值在整个属性名字中。

如 sass 代码：

```scss
@mixin prefix($property, $value, $prefixes) {
  @each $prefix in $prefixes {
    -#{$prefix}-#{$property}: $value;
  }
  #{$property}: $value;
}

.gray {
  @include prefix(filter, grayscale(50%), moz webkit);
}
```

生成的 css 代码如下：

```css
.gray {
  -moz-filter: grayscale(50%);
  -webkit-filter: grayscale(50%);
  filter: grayscale(50%);
}
```

## 嵌套

许多 CSS 属性以相同的前缀开头，充当一种命名空间。例如，`font-famliy`、`font-size` 和 `font-weight` 全部以 `font-` 开头。Sass 为了使这种情况更加简单并且减少冗余，允许嵌套的属性声明。外层属性名字可以被加在内层属性名字上，用连字符分隔。

例如：

```scss
.enlarge {
  font-size: 14px;
  transition: {
    property: font-size;
    duration: 4s;
    delay: 2s;
  }

  &:hover {
    font-size: 36px;
  }
}
```

生成的 css 代码如下：

```css
.enlarge {
  font-size: 14px;
  transition-property: font-size;
  transition-duration: 4s;
  transition-delay: 2s;
}
.enlarge:hover {
  font-size: 36px;
}
```

其中一些 CSS 属性具有使用命名空间作为属性名称的速记版本。对于这些，您可以编写速记值和更明确的嵌套版本。

例如：

```scss
.info-page {
  margin: auto {
    bottom: 10px;
    top: 2px;
  }
}
```

即：

```css
.info-page {
  margin: auto;
  margin-bottom: 10px;
  margin-top: 2px;
}
```

## 隐式声明

有时你只想一个属性声明在某些情况展示。如果一个声明的值是 `null` 或者一个空的不带引号的字符串，Sass 根本不会将该声明编译成 CSS。

例如：

```scss
$rounded-corners: false;

.button {
  border: 1px solid black;
  border-radius: if($rounded-corners, 5px, null);
}
```

即：

```css
.button {
  border: 1px solid black;
}
```

## 自定义属性

兼容性（Sass 语法）：

- Dart Sass： :white_check_mark:
- LibSass：since 3.5.0
- Ruby Sass：since 3.5.0

旧版本的 LibSass 和 Ruby Sass 像任何其他属性声明一样解析自定义属性声明，允许将所有 SassScript 表达式作为值。即使在使用这些版本时，也建议您使用插值来注入 SassScript 值以实现向前兼容性。

有关详细信息，请参阅[breakging change](https://sass-lang.com/documentation/breaking-changes/css-vars)页面。

css 自定义属性，也称为 css 变量，有一个不常见的声明语法：它们允许任何文本在他们的声明表达式的值中。此外，这些值对于 JavaScript 来说是可以访问的，所以任何值可能都和用户相关。这包括通常会被解析为 SassScript 的值。

因此，Sass 解析自定义属性声明和解析其他属性声明是不同的。所有标记，包括那些看起来像 SassScript 的标记，都按原样传递给 CSS 。**唯一的例外是插值，这是将动态值注入自定义属性的唯一方法。**

如下 scss 代码：

```scss
$primary: #81899b;
$accent: #302e24;
$warn: #dfa612;

:root {
  --primary: #{$primary};
  --accent: #{$accent};
  --warn: #{$warn};

  // 尽管这看起来像一个 Sass 变量，但它是有效的 CSS 所以它将不会被转换
  --consumed-by-js: $primary;
}
```

生成的 CSS 代码如下：

```css
:root {
  --primary: #81899b;
  --accent: #302e24;
  --warn: #dfa612;
  --consumed-by-js: $primary;
}
```

::: danger 注意！
不幸的是，插值删除了字符串中的引号，这意味着很难去使用来自 SassScript 变量的带引号的字符串作为自定义属性的值。作为解决办法，你可以使用 `meta.inspect()` 函数来保持引号。

例如：

```scss
@use "sass:meta";

$font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
$font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas;

:root {
  --font-family-sans-serif: #{meta.inspect($font-family-sans-serif)};
  --font-family-monospace: #{meta.inspect($font-family-monospace)};
}
```

生成的 CSS 代码：

```css
:root {
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto;
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas;
}
```

:::
