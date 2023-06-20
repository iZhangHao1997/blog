# Sass @while

`@while` 规则，语法为 `@while <expression> { ... }`，遍历它的内容块如果 `expression` 表达式的返回值为 `true`，循环直到表达式返回 `false`。

```scss
@use "sass:math";

/// 将 `$value` 除以 `$ratio` 直到比 `$base` 小。
@function scale-below($value, $base, $ratio: 1.618) {
  @while $value > $base {
    $value: math.div($value, $ratio);
  }
  @return $value;
}

$normal-font-size: 16px;
sup {
  font-size: scale-below(20px, 16px);
}
```

对应生成的 css 代码：

```css
sup {
  font-size: 12.36094px;
}
```

:::danger 注意！
尽管 `@while` 对于一些特别复杂的样式表来说是必要的，但是你最好还是使用 `@each` 或者 `for` 如果这两者可以满足你的需求。它们是更加清晰和易读的，并且编译起来更快。
:::

## 真值和假值

任何可以使用 true 或者 false 的地方，也可以使用其他值。`false` 和 `null` 是假值，意味着 Sass 认为它们表示假的将导致条件失败。其他任何值都会被认为真值，因此 Sass 会将它们当作 true 来工作，意味着条件成功。

例如，你想检查一个字符串是否包含空格，你可以写 `string.index($string, " ")`。`string.index()` 函数将会返回 null，如果这个字符串不能找到一个空格，否则返回一个数字。

:::danger 注意！
一些语言认为会有一些除了 `false` 和 `null` 以外更多的值被认为是假值。Sass 不这么认为。例如空字符串、空列表、数字 0，在 Sass 中都会被认为是真值。
:::
