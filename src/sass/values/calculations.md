# Sass Calculations 计算

计算是 Sass 如何表达 `calc()` 函数，还有类似函数 `clamp()`、`min()` 和 `max()`。Sass 会尽可能简化它们，甚至相结合。

```scss
@debug calc(400px + 10%); // calc(400px + 10%)
@debug calc(400px / 2); // 200px
@debug min(100px, calc(1rem + 10%)); // min(100px, 1rem + 10%)
```

计算使用一个特殊的语法，和其他正常的 SassScript 不同。它和 css 的 `calc()` 语法一样，不过有使用 Sass 变量和调用 Sass 函数的额外能力。这意味着 `/` 在一个计算中总是除法操作符。

:::info 有趣的事实
Sass 函数调用的参数使用普通的 Sass 语法，而不是特殊的计算语法！
:::

你也可以在计算中使用插值。然而如果您这样做，围绕该插值的括号中的任何内容都不会被简化或类型检查，因此很容易导致额外的冗长甚至无效的 CSS。与其写 `calc(10px + #{$var})` ，不如写 `calc(10px + $var)`！

## 简化

如果计算中的相邻操作使用可以在编译时组合的单位，例如 `1in + 10px` 或 `5s * 2`，Sass 将简化计算中的相邻操作。如果可能的话，它甚至会将整个计算简化为单个数字。例如， `clamp(0px, 30px, 20px)` 将返回 `20px`。

:::danger 注意！
这意味着计算表达式不是总会返回计算结果。如果你在编写 Sass 库，你可以使用 `meta.type-of()` 函数来确定你正在处理的类型。
:::

如果一个计算在另一个计算的里面。特别来说，计算函数将被移除，被原来的旧操作代替。

:::code-group

```scss
$width: calc(400px + 10%);

.sidebar {
  width: $width;
  padding-left: calc($width / 4);
}
```

```css
.sidebar {
  width: calc(400px + 10%);
  padding-left: calc((400px + 10%) / 4);
}
```

:::

## 操作符

你不能对计算使用正常的 SassScript 操作符如 `+` 和 `*`。如果你想做一些数学操作，计算允许你把操作符写在计算表达式里面，如果它们传递了一堆具有兼容单位的数字，它们也会返回纯数字，如果它们传递了计算，它们将返回计算结果。

此限制的目的是确保如果不需要计算，它们会尽快抛出错误。计算不能在普通数字可以使用的任何地方使用：例如，它们不能注入 CSS 标识符（例如 `.item-#{$n}`），也不能传递给 Sass 的内置数学函数。保留纯数字 SassScript 操作可以清楚地明确哪些地方允许计算，哪些地方不允许计算。

```scss
$width: calc(100% + 10px);
@debug $width * 2; // Error!
@debug calc($width * 2); // calc((100% + 10px) * 2);
```

## 常量

计算也能包含常量，常量写作 css 标志符。为了向前兼容 css，所有标志符都是被允许的，并且默认情况下它们只是被视为按原样传递的不带引号的字符串。

```scss
@debug calc(h + 30deg); // calc(h + 30deg);
```

## min() 和 max()

如果 `min()` 或者 `max()` 函数调用是一个有效的计算表达式，它将会被解析为计算。但是一旦在计算中调用中包含的 SassScript 功能任何一部分没有被支持，例如模计算符，它都会被解析为对 Sass 核心 `min()` 或者 `max()` 函数的调用。

由于计算无论如何都会尽可能简化为数字，唯一的实质性区别是 Sass 函数仅支持可以在构建时组合单位，因此 `min(12px % 10, 10%)` 会抛出错误。

:::danger 注意！
其他计算不允许将无单位的数字与有单位的数字相加、减去或比较。`min()` 但 `max()` 不同的是：为了与全局 Sass `min()` 和 `max()` 函数向后兼容，由于历史原因允许单位/无单位混合，只要这些单位直接包含在 `min()` 或者 `max()` 计算中。
:::

:::code-group

```scss
$padding: 12px;

.post {
  // Since these max() calls are valid calculation expressions, they're
  // parsed as calculations.
  padding-left: max($padding, env(safe-area-inset-left));
  padding-right: max($padding, env(safe-area-inset-right));
}

.sidebar {
  // Since these use the SassScript-only modulo operator, they're parsed as
  // SassScript function calls.
  padding-left: max($padding % 10, 20px);
  padding-right: max($padding % 10, 20px);
}
```

```css
.post {
  padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(12px, env(safe-area-inset-right));
}

.sidebar {
  padding-left: 20px;
  padding-right: 20px;
}
```

:::
