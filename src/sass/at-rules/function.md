# Sass @function

@function 允许你定义对 SassScript 值进行复杂的操作，你可以在你的样式表里重复使用。这使以一种可读的方式抽象出通用的表达式或者行为变得简单。

函数通用使用 `@function` 规则定义，语法为：`@function <name>(<arguments...>)`。函数的名字可以是任何标志符。它只可以包含[通用语句](../syntax/structure#通用语句)，以及指示要用作函数调用结果的值的 [`@return` 规则](#return)。函数调用的语法和普通 CSS 函数一样。以下是示例代码：

:::code-group

```scss
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px;
}
```

```css
.sidebar {
  float: left;
  margin-left: 64px;
}
```

:::

:::info 有趣的事实：
函数名称，像所有 Sass 标志符，对连字符和下划线为同一个标志符。这意味着 `scale-color` 和 `scale_color` 都指向相同的函数。这是 Sass 早期的历史遗留问题，当时 Sass 只允许在标志符名称中使用下划线。一旦 Sass 新增了连字符以匹配 CSS 语法的支持，这两者就等同了来使迁移更加容易。
:::

:::danger 注意！
虽然从技术上讲函数可能具有副作用如设置全局变量等，强烈建议不要这样做。请使用 `mixin` 来处理副作用，使用函数来计算值。
:::

## 参数

### 概述

参数允许函数可以每次被调用的行为可以自定义。参数在函数名称后面被指定，被圆括号包围的一个列表。函数被调用时必须提供相同数量的给定参数。这些表达式的值在函数体内作为相应的可使用的变量值。

:::info 有趣的事实：
参数列表也可以有尾随逗号！这使得在重构样式表时更容易避免语法错误。
:::

### 可选参数

通常地，当函数被调用时声明的参数必须要传递。然而，你可以通过定义一个默认值使参数是可选的，当不传递参数时使用默认值。默认值使用和变量声明一样的语法：一个变量名，后面一个冒号和 SassScript 表达式。这使定义可扩展的函数 API 非常简单。示例代码如下：

:::code-group

```scss
@function invert($color, $amount: 100%) {
  $inverse: change-color($color, $hue: hue($color) + 180);
  @return mix($inverse, $color, $amount);
}

$primary-color: #036;
.header {
  background-color: invert($primary-color, 80%);
}
```

```css
.header {
  background-color: #523314;
}
```

:::
:::info 有趣的事实：
默认值可以是任何 Sass 表达式，并且可以引用更早的参数。
:::

### 关键字参数

当 function 被 include 时，参数在按参数列表传递的同时还可以按变量名称传参（变量名参数必须在参数列表(positional arguments)后面）。这对有可选参数或者意义不明显布尔类型参数时特别有用。关键字参数和变量声明与可选参数的语法一样。如下 scss 代码示例：

:::code-group

```scss
$primary-color: #036;
.banner {
  background-color: $primary-color;
  color: scale-color($primary-color, $lightness: +40%);
}
```

```css
.banner {
  background-color: #036;
  color: #0a85ff;
}
```

:::

:::danger 注意！
因为任何参数都可以通过名称传递，所以在重命名 function 的参数名称时要特别小心...这可能会使你的用户崩溃。将旧名称的参数作为可选参数并保持一段时间，如果有人传递旧名称，打印一个警告告知用户，让他们知道要迁移到新参数。
:::

### 采用任意参数

如果一个函数可以传递任何数量的参数也是有用的。如果 @function 的最后一个参数声明以 `...` 结尾，那么使用这个函数时所有的额外参数都会作为一个 list 传递给最后一个参数。这就是一个参数 list。如以下代码：

:::code-group

```scss
@function sum($numbers...) {
  $sum: 0;
  @each $number in $numbers {
    $sum: $sum + $number;
  }
  @return $sum;
}

.micro {
  width: sum(50px, 30px, 100px);
}
```

```css
.micro {
  width: 180px;
}
```

:::

### 采用任意关键字参数

参数列表也可以用任意关键字参数。`meta.keywords()` 函数传入一个参数列表然后返回作为从参数名称（不包括 `$`）到这些参数值的映射传递给函数的任何额外关键字。如 scss 代码：

```scss
// 仅做学习测试，没实际意义的代码
@use "sass:meta";

@function fn($args...) {
  @debug meta.keywords($args);
  // (width: 50px)

  @return black;
}

.test {
  color: fn(red, $width: 50px);
}
```

:::info 有趣的事实：
如果您从未将参数列表传递给函数 `meta.keywords()`，则该参数列表将不允许额外的关键字参数。这有助于你的 function 的调用者确保他们没有不小心拼错任何参数名称。
:::

### 传递任意参数

就像参数列表允许 mixin 接受任意位置或者关键字参数一样，相同的语法可用于将位置和关键字参数传递给 function。如果你调用函数时最后一个参数用 `...` 传递一个列表，列表的元素将会被当做额外的位置参数。相似的，一个 map 映射后面如果跟着 `...`，会被当做额外的关键字参数。你可以一次性全部传递。如下 scss 代码：

:::code-group

```scss
$widths: 50px, 30px, 100px;
.micro {
  width: min($widths...);
}
```

```css
.micro {
  width: 30px;
}
```

:::

:::info 有趣的事实：
因为参数列表将会对位置参数和关键字参数都保持追踪，所以你可以一次性将参数传递给另一个函数。这使得对函数定义一个别名非常容易。以下是使用参数列表追踪的代码例子：

```scss
@function fg($args...) {
  @warn "The fg() function is deprecated. Call foreground() instead.";
  @return foreground($args...);
}
```

:::

## @return

@return 规则指示函数调用的返回值。只允许在函数体内部使用，并且每个函数都必须以 @return 结尾。

当遇到了 @return，函数会立马结束并返回它的结果。早点返回结果对于处理边缘情况或者更加有效率的算法是有用的，没必要去跑整个函数。如下 scss 代码：

```scss
@use "sass:string";

@function str-insert($string, $insert, $index) {
  // 这里如果传入的 $string 长度为 0，就没必要走下面的代码了。
  @if string.length($string) == 0 {
    @return $insert;
  }

  $before: string.slice($string, 0, $index);
  $after: string.slice($string, $index);
  @return $before + $insert + $after;
}
Other Functions permalink
```

## 其他函数

除了用户定义的函数，Sass 还提供非常有用的内置函数在核心库里。Sass 插值也使在宿主语言中定义自定义函数成为可能。当然，你可以始终使用原生 css 函数（即使是使用奇怪的语法）。

### 原生 css 函数

任何不是用户定义函数或内置函数的函数调用都会被编译为原生 CSS 函数（除非它使用 Sass 参数语法）。参数将被编译为 CSS 并按原样包含在函数调用中。这确保了 Sass 支持所有 CSS 功能，而无需在每次添加新功能时都发布新版本。

```scss
@debug var(--main-bg-color); // var(--main-bg-color)

$primary: #f2ece4;
$accent: #e1d7d2;
@debug radial-gradient($primary, $accent); // radial-gradient(#f2ece4, #e1d7d2)
```

:::danger 注意！
因为任何未知函数都会被编译为 CSS，所以当你输入错误的函数名称时很容易被忽略。考虑在样式表的输出上运行 CSS linter，以便在发生这种情况时得到通知！
:::

:::info 有趣的事实：
有一些 css 函数，像 calc() 和 element() 有不通常的语法。Sasss 将这些[特殊函数](../syntax/special-functions.md)解析为不带引号的字符串。
:::
