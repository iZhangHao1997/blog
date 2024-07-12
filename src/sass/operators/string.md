# Sass 字符串运算符 String Operators

Sass 支持一些生成字符串的运算符：

- `<expression> + <expression>` 返回一个包含两个表达式值的字符串。如果其中一个值是带引号的字符串，那么结果将会也带引号；否则它将不带引号。
- `<expression> - <expression>` 返回一个包含带引号的用 `-` 分隔开的两个表达式值。这是一个过时的操作服，应该用插值表达式生成替代这种做法。

```scss
@debug "Helvetica" + " Neue"; // "Helvetica Neue"
@debug sans- + serif; // sans-serif
@debug sans - serif; // sans-serif
```

这些运算符不仅适用于字符串！它们可以与任何可以写入 CSS 的值一起使用，但有一些例外：

- 数字不能用作左边的值，因为它们有自己的运算符。
- 颜色不能用作左边的值，因为它们有自己的运算符。

```scss
@debug "Elapsed time: " + 10s; // "Elapsed time: 10s";
@debug true + " is a boolean value"; // "true is a boolean value";
```

:::danger 注意！
通常来说，使用插值表达式生成字符串比运算符的方式简洁非常多。
:::

## 一元运算符

由于历史原因，Sass 还支持 `/` 和 `-` 作为仅接受一个值的一元运算符：

- `/<expression>` 返回一个不带引号的字符串，以表达式的值开头 `/`，后跟表达式的值。
- `-<expression>` 返回一个不带引号的字符串，以表达式的值开头 `-`，后跟表达式的 值。

```scss
@debug /15px; // /15px
@debug -moz; // -moz
```
