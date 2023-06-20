# Sass 中的值

Sass 提供了一些值的类型，大部分的类型都是直接从 CSS 中来的：

- [Numbers 数字](./numbers.md)，可以有也可以没有单位，如 `12` 和 `100px`。
- [Strings 字符串](./strings.md)，可以有引号也可以没有引号，如 `"Helvetica Neue"` 和 `bold`。
- [Colors 颜色](./colors.md)，可以通过 16 进制或者名称引用，例如 `#c6538c` 和 `blue`，或者来自函数返回，如 `rgb(107, 113, 127)` or `hsl(210, 100%, 20%)`。
- [Lists 列表](./lists.md)，用空格或者逗号分隔、可以带方括号也可以不带，如 `1.5em 1em 0 2em, Helvetica, Arial, sans-serif` 和 `[col1-start]`。

还有一些 Sass 里特有的：

- [boolean 值](./booleans.md) `true` 和 `false`。
- 单例 [null](./null.md) 值。
- [Maps 映射](./maps.md) 将值和键联系起来，如 `("background": red, "foreground": link)`。
- [Functions references 函数引用](./functions.md)，`get-function()` 返回和用 `call()` 调用的。
