# Sass @if 和 @else

`@if` 规则的语法为 `@if <expression> { ... }`，它控制样式块内的内容是否被编译为 css。`expression` 表达式通常返回 `true` 或者 `false` 中的一个，如果返回 `true`，样式快将被编译，如果表达式返回 `false` 则不会。如下 scss 代码：

:::code-group

```scss
@mixin avatar($size, $circle: false) {
  width: $size;
  height: $size;

  @if $circle {
    border-radius: $size / 2;
  }
}

.square-av {
  @include avatar(100px, $circle: false);
}
.circle-av {
  @include avatar(100px, $circle: true);
}
```

```css
.square-av {
  width: 100px;
  height: 100px;
}

.circle-av {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
```

:::

## @else 规则

一个 `@if` 规则可以可选地跟 `@else` 规则，写作 `@else { ... }`。很好理解，和编程里的 if else 一样。如下 scss 代码：

:::code-group

```scss
$light-background: #f2ece4;
$light-text: #036;
$dark-background: #6b717f;
$dark-text: #d2e1dd;

@mixin theme-colors($light-theme: true) {
  @if $light-theme {
    background-color: $light-background;
    color: $light-text;
  } @else {
    background-color: $dark-background;
    color: $dark-text;
  }
}

.banner {
  @include theme-colors($light-theme: true);
  body.dark & {
    @include theme-colors($light-theme: false);
  }
}
```

```css
.banner {
  background-color: #f2ece4;
  color: #036;
}
body.dark .banner {
  background-color: #6b717f;
  color: #d2e1dd;
}
```

:::

条件表达式可以包含[boolean 运算符](../../operators/boolean.md)（and、or、not）。

## @else if 规则

同样可以通过 `@else if` 规则控制 else 里面的样式是否被生效，语法为 `@else if (<expression>) { ... }`。只有当 `@if` 条件表达式返回 false 并且 `@else if` 条件表达式返回 true，样式块内的规则才会生效。

事实上，也可以在 `@if` 之后链式调用多个 `@else if`。样式块的内容直到遇到条件表达式为 true 才会生效。如果在条件链的最后有 `@else`，并且前面的条件表达式都返回 false，则最后一个样式块生效。如下 scss 代码：

:::code-group

```scss
@use "sass:math";

@mixin triangle($size, $color, $direction) {
  height: 0;
  width: 0;

  border-color: transparent;
  border-style: solid;
  border-width: math.div($size, 2);

  @if $direction == up {
    border-bottom-color: $color;
  } @else if $direction == right {
    border-left-color: $color;
  } @else if $direction == down {
    border-top-color: $color;
  } @else if $direction == left {
    border-right-color: $color;
  } @else {
    @error "Unknown direction #{$direction}.";
  }
}

.next {
  @include triangle(5px, black, right);
}
```

```css
.next {
  height: 0;
  width: 0;

  border-color: transparent;
  border-style: solid;
  border-width: 2.5px;
  border-left-color: black;
}
```

:::

## 真值和假值

任何可以使用 true 或者 false 的地方，也可以使用其他值。`false` 和 `null` 是假值，意味着 Sass 认为它们表示假的将导致条件失败。其他任何值都会被认为真值，因此 Sass 会将它们当作 true 来工作，意味着条件成功。

例如，你想检查一个字符串是否包含空格，你可以写 `string.index($string, " ")`。`string.index()` 函数将会返回 null，如果这个字符串不能找到一个空格，否则返回一个数字。

:::danger 注意！
一些语言认为会有一些除了 `false` 和 `null` 以外更多的值被认为是假值。Sass 不这么认为。例如空字符串、空列表、数字 0，在 Sass 中都会被认为是真值。
:::
