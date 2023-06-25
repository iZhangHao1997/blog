# Sass Strings

字符串是字符序列（unicode 码位）。Sass 支持两种字符串，两种内部结构是一样的，但是渲染不同：带引号的字符串（如 `"Helvetica Neue"`）和不带引号的字符串（也称为标志符，如 `bold`）。这些共同涵盖了出现在 CSS 中的不同类型。

:::info 有趣的事实：
你可以通过 `string.unquote()` 函数将一个带引号的字符串转化为一个不带引号的字符串，然后你也可以通过 `string.quote()` 函数将不带引号的字符串转成带引号的字符串。如下 scss 代码：

```scss
@use "sass:string";

@debug string.unquote(".diget:hover"); // .widget:hover
@debug string.quote(bold); // "bold"
```

:::

## 转义（Escapes）

所有 Sass 字符串支持标准 CSS 转义码：

- 任何除了 A-F、0-9 以外的字符都可以通过在前面加 `\` 使其成为字符串的一部分。
- 任何字符都可以成为字符串的一部分通过编写 `\` 紧接着其十六进制的 unicode 编码。你可以选项式地在编码后面添加空格表示该编码的结束。

```scss
@debug '"'; // '"'
@debug \.widget; // \.widget
@debug "\a"; // "\a" (a string containing only a newline)
@debug "line1\a line2"; // "line1（换行） line2"
@debug "Nat + Liz \1F46D"; // "Nat + Liz 👭"
```

:::info 有趣的事实：
对于允许出现在字符串里面的字符来说，编写 unicode 转义符会产生与编写字符本身完全相同的字符串。
:::

## 带引号字符串

带引号的字符串写在单引号或者双引号之间，例如 `"Helvetica Neue"`。带引号的字符串可以包含插值，也可以包含所有非转义字符，除了：

- `\`，需要转义： `\\`
- `'` 或者 `"`，需要转义：`\'` 和 `\"`
- 换行符也需要转义：`\a`（包括一个尾随空格）

带引号的字符串保证会被编译成和原来 Sass 字符串一样的 css 字符串。确切的格式可能根据实现和配置有所不同——一个包含双引号的字符串可能被编译成 `"\""` 或者 `'"'`，一个非 ASCII 编码字符可能被也可能不被转义。但在任何符合标准的 CSS 实现中，包括所有浏览器，都应该对其进行相同的解析。

```scss
@debug "Helvetica Neue"; // "Helvetica Neue"
@debug "C:\\\\Program Files"; // "C:\\Program Files"
@debug '"Don\'t Fear the Reaper"'; // ""Don't Fear the Reaper""
@debug "line1\a line2"; // "line1（换行） line2"

$roboto-variant: "Mono";
@debug "Roboto #{$roboto-variant}"; // "Roboto Mono"
```

:::info 有趣的事实：
当一个带引号的字符串通过插值注入了另一个值，那个值的引号将会被去掉。这使编写字符串包含选择器变得简单，例如，选择器可以被注入到样式规则中，而不需要添加引号。
:::

## 不带引号字符串

不带引号的字符串就是 CSS 标志符，跟随下面的语法图表。它们可以在任何地方包含插值。

![Sass unquoted strings](/img/sass/SassUnquotedStrings.png)

```scss
@debug bold; // bold
@debug -webkit-flex; // -webkit-flex
@debug --123; // --123

$prefix: ms;
@debug -#{$prefix}-flex; // -ms-flex
```

:::danger 注意！
不是所有的标志符都会被解析为不带引号的字符串：

- [CSS 颜色名称](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords) 将会被解析为[Colors 颜色值](./colors.md)
- `null` 被解析为 [Sass null 值](./null.md)
- `true` 和 `false` 被解析为[Booleans 布尔值](./booleans.md)
- `not`、`and` 和 `or` 被解析为 [Booleans 操作符](../operators/boolean.md)

因此，编写字符串时带上引号是更好的，除非你指定编写一个不带引号的 css 属性。
:::

### 不带引号字符串的转义

当解析未加引号的字符串时，转义的文字文本将作为字符串的一部分。例如，`\a` 被解析为字符 `\`、`a` 和`空格`。为了确保在 CSS 中具有相同含义的未加引号的字符串以相同的方式解析，这些转义都是规范化的。对于每个代码点，不管是转义的还是未转义的：

- 如果它是是一个有效的标志符字符，它将不转义地被包含在不带引号的字符串中。例如，`\1F46D` 返回不带引号的字符串 `👭`。
- 如果它是除了换行符和`tab`缩进符之外的可打印的字符，它将被包含在 `\` 之后。例如，`\21` 返回不带引号的字符串 `\!`。
- 否则，小写的 Unicode 码转义将包含在紧跟着的空格之后。例如，`\7Fx` 返回未加引号的字符串 `\7f x`。

```scss
@use "sass:string";

@debug \1F46D; // 👭
@debug \21; // \!
@debug \7Fx; // \7f x
@debug string.length(\7Fx); // 5
```

## 字符串索引

Sass 有许多[字符串函数](../modules/string.md)会接受或者返回数字，这些数字称为索引，索引指向一个字符串中的字符。索引 1 指向字符串的第一个字符。注意这和其他语言不同，它们的起始索引是 0！Sass 中 -1 指向最后一个字符，-2 指向倒数第二个字符，以此类推。

```scss
@use "sass:string";

@debug string.index("Helvetica Neue", "Helvetica"); // 1
@debug string.index("Helvetica Neue", "Neue"); // 11
@debug string.slice("Roboto Mono", -4); // "Mono"
```
