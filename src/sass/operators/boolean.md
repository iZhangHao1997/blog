# Sass boolean 运算符

不像 JS 语言，Sass 使用单词代替符号作为它的的 boolean 运算符。

- `not <expression>` 返回表达式相反的值；如果是 `true` 则返回 `false`，如果是 `false` 则返回 `true`。
- `<expression> and <expression>` 返回 `true` 值如果两个表达式都为 `true`；返回 `false` 如果其中为 `false`。
- `<expression> or <expression>` 返回 `true` 值如果其中一个表达式的值为 `true`；返回 `false` 如果两个表达式都为 `false`。

```scss
@debug not true; // false
@debug not false; // true

@debug true and true; // true
@debug true and false; // false

@debug true or false; // true
@debug false or false; // false
```

## 真值和假值

`true` 和 `false` 允许使用或的任何位置，您也可以使用其他值。值 `false` 和 `null` 为 `falsey`，这意味着 Sass 认为它 ​​ 们表示假值并导致条件失败。其他所有值都被视为 `truthy` 真值，因此 Sass 认为它 ​​ 们的工作方式与 和 类似 true，并导致条件 成功。

例如，如果你想检查一个字符串是否包含空格，你只需写 `string.index($string, " ")`。如果未找到字符串，则 `string.index()` 函数返回 `null`，反之返回一个数字。

:::danger 注意！
有些语言认为除了 `false` 和 `null` 之外，还有更多值为假值。Sass 不是这样的语言！空字符串、空列表和数字 `0` 在 Sass 中都是真值 。
:::
