# Sass 数字运算符 Numeric Operators

Sass 支持标准的数字数学运算符集。它们会自动在兼容的单位之间进行转换。

- `<expression> + <expression>` 将两个表达式的值相加
- `<expression> - <expression>` 表达式 1 - 表达式 2
- `<expression> * <expression>` 两个表达式的值相乘
- `<expression> % <expression>` 返回第一个表达式除以第二个表达式的余数，即取模运算，也称为模运算符。

```scss
@debug 10s + 15s; // 25s
@debug 1in - 10px; // 0.8958333333in
@debug 5px * 3px; // 15px*px
@debug 1in % 9px; // 0.0625in
```

没有单位的数字可以被用来和任何有单位的数字运算：

```scss
@debug 100px + 50; // 150px
@debug 4s * 10; // 40s
```

单位不兼容的数字不能用数字运算符。

```scss
@debug 100px + 10s;
//     ^^^^^^^^^^^
// Error: Incompatible units px and s.
```

## 一元运算符

你也可以将 `+` 和 `-` 作为一元运算符使用：

- `+<expression>` 原样返回表达式
- `-<expression>` 返回表达式的负值

```scss
@debug +(5s + 7s); // 12s
@debug -(50px + 30px); // -80px
@debug -(10px - 15px); // 5px
```

:::danger 注意！
因为 `-` 可以作为减法运算和一元否定，所以在空格分隔的列表里会比看起来令人疑惑。为了安全起见：

- 当作减法的时候在 `-` 运算符两边添加空格
- 当取负值或作一元否定时，在 `-` 之前添加空格但是后面不加
- 如果一元否定位于空格分隔的列表中，则将其括在括号中。

`-` 在 Sass 中的不同意义优先级采用以下顺序：

1. `-` 作为标志符的一部分，唯一的例外是单位；Sass 通常允许任何有效的标志符作为标志符，但是紧跟着数字的单位可能不包含连字符（没看明白，原文：Sass normally allows any valid identifier to be used as an identifier, but units may not contain a hyphen followed by a digit.）。
1. `-` 在一个表达式和一个数字之间并且没有空格的话，会被视为减法操作。
1. `-` 出现在一个数字的开头，这个数字会被视为负数。
1. `-` 在两个数字之间，将被视为减法。
1. `-` 出现在一个非字面量数字之前，将被视为一元操作符

```scss
@debug a-1; // a-1
@debug 5px-3px; // 2px
@debug 5-3; // 2
@debug 1 -2 3; // 1 -2 3

$number: 2;
@debug 1 -$number 3; // -1 3
@debug 1 (-$number) 3; // 1 -2 3
```

:::

## 除法

不像其他数学操作符，Sass 中的除法使用 `math.div()` 函数。尽管很多编程语言使用 `/` 作为除法操作符，但是在 css 里 `/` 是被用作分隔符的，例如 `font: 15px/32px` 或者 `hsl(120 100% 50% / 0.8)`。现在的 sass 语法确实支持使用 `/` 作为除法运算符，但将在将来的版本中被抛弃。

### 斜线分割值

暂时来说，Sass 仍支持 `/` 斜线分割符号座位除法运算符，然而必须有一个方法消除 `/` 斜线分割符作为一个分割符号还是除法运算符的歧义。为了达到这个目的，如果两个数值被 `/` 分隔符分开，Sass 会以斜线分割符的方式打印结果，而不是进行除法操作，除非满足以下其中之一的条件：

- 任一表达式都不是文字数字。
- 结果存储在变量中或由函数返回。
- 运算用括号括起来，除非括号位于包含该运算的列表之外。
- 结果被用作其他操作的一部分（除了 `/`）。
- 结果被一个计算(calculation)返回。

你也可以使用 `list.slash()` 强制将 `/` 作为分割符使用。

```scss
@use "sass:list";

@debug 15px / 30px; // 15px/30px
@debug (10px + 5px) / 30px; // 0.5
@debug list.slash(10px + 5px, 30px); // 15px/30px

$result: 15px / 30px;
@debug $result; // 0.5

@function fifteen-divided-by-thirty() {
  @return 15px / 30px;
}
@debug fifteen-divided-by-thirty(); // 0.5

@debug (15px/30px); // 0.5
@debug (bold 15px/30px sans-serif); // bold 15px/30px sans-serif
@debug 15px/30px + 1; // 1.5
```

## 单位

Sass 为根据现实世界单位计算的工作原理来操作单位提供了强大的支持。当两个数字相乘时，它们的单位也会相乘。当一个数字除以另一个数字时，结果会从第一个数字中获取其分子单位，从第二个数字中获取其分母单位。数字的分子或分母可以有任意数量的单位。

```scss
@use "sass:math";

@debug 4px * 6px; // 24px*px (read "square pixels")
@debug math.div(5px, 2s); // 2.5px/s (read "pixels per second")

// 3.125px*deg/s*em (read "pixel-degrees per second-em")
@debug 5px * math.div(math.div(30deg, 2s), 24em);

$degrees-per-second: math.div(20deg, 1s);
@debug $degrees-per-second; // 20deg/s
@debug math.div(1, $degrees-per-second); // 0.05s/deg
```

::: danger 注意！
由于 CSS 不支持像像素平方这样的复杂单位，因此使用具有复杂单位的数字作为属性值会产生错误。不过，这是一个伪装的功能；如果您最终得到的单位不正确，通常意味着您的计算出了问题！请记住，您始终可以使用 `@debug` 来检查任何变量或表达式的单位。
:::

Sass 会自动在兼容单位之间进行转换，但它为结果选择哪个单位取决于您使用的 Sass 实现。如果您尝试组合不兼容的单位，例如 `1in + 1em`，Sass 将抛出错误。

```scss
// CSS defines one inch as 96 pixels.
@debug 1in + 6px; // 102px or 1.0625in

@debug 1in + 1s;
//     ^^^^^^^^
// Error: Incompatible units s and in.
```

与真实世界的单位计算一样，如果分子包含与分母单位兼容的单位（如 `math.div(96px, 1in)`），它们将抵消。这样可以轻松定义可用于单位转换的比率。在下面的示例中，我们将所需速度设置为每 50 像素一秒，然后将其乘以过渡覆盖的像素数以获得应花费的时间。

```scss
@use "sass:math";

$transition-speed: math.div(1s, 50px);

@mixin move($left-start, $left-stop) {
  position: absolute;
  left: $left-start;
  transition: left ($left-stop - $left-start) * $transition-speed;

  &:hover {
    left: $left-stop;
  }
}

.slider {
  @include move(10px, 120px);
}
```

::: danger 注意！
如果您的算术给出了错误的单位，您可能需要检查您的数学。您可能遗漏了本应有单位的数量的单位！保持单位清晰可行可让 Sass 在出现问题时为您提供有用的错误 。

您尤其应该避免使用插值，例如。`#{$number}px` 这实际上不会创建一个数字！它会创建一个看起来像数字的不带引号的字符串，但不能用于任何数字运算或函数。尝试使您的数学单位清晰，例如写成 `$number * 1px`。
:::

::: danger 注意！
Sass 中的百分比与其他单位一样。它们不能与小数互换，因为在 CSS 中，小数和百分比的含义不同。例如，`50%` 是一个以 `%` 为单位的数字，而 Sass 认为它与 0.5 数字不同。

您可以使用单位算术在小数和百分比之间进行转换。 `math.div($percentage, 100%)` 将返回相应的小数，并将 `$decimal * 100%` 返回相应的百分比。 您还可以使用 `math.percentage()` 函数作为更明确的书写方式相较于 `$decimal * 100%`。
:::
