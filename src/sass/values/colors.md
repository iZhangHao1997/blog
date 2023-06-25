# Sass Colors 颜色值

Sass 对颜色值有内置支持。就像 CSS 颜色，它们代表着在 [sRGB 颜色空间](https://en.wikipedia.org/wiki/SRGB)内的点，尽管很多 Sass [颜色函数](../modules/color.md) 使用 [HSL 坐标](https://en.wikipedia.org/wiki/HSL_and_HSV)（实际上是 sRGB 颜色的另一种表达方式）操作。Sass 颜色值可以写作十六进制码（`#f2ece4` 或者 `b37399aa`）、css 颜色名称（`midnightblue`、`transparent`...）或者函数（`rgb()`、`rgba()`、`hsl()` 和 `hsla()`）。

```scss
@debug #f2ece4; // #f2ece4
@debug #b37399aa; // rgba(179, 115, 153, 67%)
@debug midnightblue; // #191970
@debug rgb(204, 102, 153); // #c69
@debug rgba(107, 113, 127, 0.8); // rgba(107, 113, 127, 0.8)
@debug hsl(228, 7%, 86%); // #dadbdf
@debug hsla(20, 20%, 85%, 0.7); // rgb(225, 215, 210, 0.7)
```

:::info 有趣的事实：
无论 Sass 最初是怎么编写的。都可以用基于 `hsl` 和 `RGB` 的函数。
:::

css 同一个颜色支持许多不同的格式：它的颜色名称、它的十六进制码和函数符号。Sass 如何编译生成颜色值取决于它本身的格式、样式表中最初的写法和当前的编译输出模式。由于样式表的变化很大，因此样式表作者不应依赖任何特定的输出格式来编写颜色。

Sass 支持很多有用的 [颜色函数](../modules/color.md) 可以用来基于已经存在的颜色创建一个新颜色，包括混入颜色、缩放其色调、饱和度或者亮度的方式。

```scss
@venus: #998099;

@debug scale-color($venus, $lightness: +15%); // #a893a8
@debug mix($venus, midnightblue); // #594d85
```
