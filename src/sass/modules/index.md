# Sass 内置模块

Sass 提供了许多内置模块，其中包含有用的函数。这些模块可以像任何用户定义的样式表一样使用 `@use` 规则加载，并且可以像任何其他模块成员一样调用它们的函数。所有内置模块 URL 都以 `sass:` 开头，表示它们是 Sass 本身的一部分。

:::danger 注意!
在引入 Sass 模块系统之前，所有 Sass 函数都是全局可用的。许多函数仍然有全局别名（这些别名在其文档中列出）。Sass 团队不鼓励使用它们，并最终会弃用它们，但目前它们仍然可用，以便与旧版 Sass 和 LibSass（尚不支持模块系统）兼容。

即使在新模块系统中，一些函数也只能全局使用，因为它们具有特殊的求值行为（如 `if()`），或者因为它们在内置 CSS 函数之上添加了额外的行为（如 `rgb()` 和 `hsl()`）。这些函数不会被弃用，可以自由使用。
:::

```scss
@use "sass:color";

.button {
  $primary-color: $6b717f;
  color: $primary-color;
  border: 1px solid color.scale($primary-color, $lightness: 20%);
}
```

Sass 提供以下内置模块：

- [sass:math 模块](./math.md)提供对数字进行操作的函数。
- [sass:string 模块](./string.md)可以轻松地组合、搜索或拆分字符串。
- [sass:color 模块](./color.md)根据现有的颜色生成新的颜色，从而可以轻松构建颜色主题。
- [sass:list 模块](./list.md)允许您访问和修改列表中的值。
- [sass:map 模块](./map.md)使得在映射中查找与键关联的值成为可能。
- [sass:selector 模块](./selector.md)提供对 Sass 强大的选择器引擎进行访问。
- [sass:meta 模块](./meta.md)公开了 Sass 内部运作的细节 。

## 全局函数

```scss
hsl($hue $saturation $lightness);
hsl($hue $saturation $lightness / $alpha);
hsl($hue, $saturation, $lightness, $alpha: 1);
hsla($hue $saturation $lightness);
hsla($hue $saturation $lightness / $alpha);
hsla($hue, $saturation, $lightness, $alpha: 1); //=> color
```

根据给定色调、饱和度和亮度和透明度返回颜色。

色调是介于 `0deg` 和 `360deg`（含）之间的数字，可以无单位。饱和度和亮度是介于 `0%` 和 `100%` （含）之间的数字，可以无单位。透明度可以指定为介于 `0` 和 `1` （含）之间的无单位数字，也可以指定为介于 `0%` 和 `100%`（含）之间的百分数。

::: info 有趣的事实：
您可以将特殊函数（如 `calc()` 或 `var()`）代替任何参数传递给 `hsl()`。您甚至可以使用 `var()` 来代替多个参数，因为它可能被多个值替换！当以这种方式调用颜色函数时，它会使用与调用时相同的签名返回一个未加引号的字符串 。

```scss
@debug hsl(
  210deg 100% 20% / var(--opacity)
); // hsl(210deg 100% 20% / var(--opacity))
@debug hsla(var(--peach), 20%); // hsla(var(--peach), 20%)
```

:::

::: danger 注意！
Sass 对于斜杠分割的值特殊的解析规则使得在传递变量 `$lightness` 亮度或者 `$alpha` 透明度给 `hsl($hue $saturation $lightness / $alpha)` 时变得困难。请考虑使用 `hsl($hue, $saturation, $lighteness, $alpha)`替代。
:::

```scss
if($condition, $if-true, $if-false)
```

如果 `$condition` 为真值返回 `$if-true`，反之返回 `$if-false`。

此函数的特殊之处在于它甚至不评估未返回的参数，因此即使未使用的会引发错误参数，也可以安全地调用它。

```scss
@debug if(true, 10px, 15px); // 10px
@debug if(false, 10px, 15px); // 15px
@debug if(variable-defined($var), $var, null); // null
```

```scss
rgb($red $green $blue)
rgb($red $green $blue / $alpha)
rgb($red, $green, $blue, $alpha: 1)
rgb($color, $alpha)
rgba($red $green $blue)
rgba($red $green $blue / $alpha)
rgba($red, $green, $blue, $alpha: 1)
rgba($color, $alpha) //=> color
```

如果传了 `$red`、`$green`、`$blue` 和可选参数 `$alpha`，根据所给的 red、green、blue 和 alpha 返回颜色。

每个通道都可以指定为 0 到 255（含）之间的无单位数或者一个 0% 到 100%（含） 的百分数。alpha 通道可以指定为 0 到 1（含）之间的无单位数，或 0% 到 100%（含）之间的百分比。

:::info
您可以将特殊函数（如 `calc()` 或 `var()` ） 给来代替任何一个参数传递 `rgb()`。您甚至可以使用 `var()` 来代替多个参数，因为它可能被多个值替换！当以这种方式调用颜色函数时，它会使用与调用时相同的签名返回一个未加引号的字符串 。

```scss
@debug rgb(0 51 102 / var(--opacity)); // rgb(0 51 102 / var(--opacity))
@debug rgba(var(--peach), 0.2); // rgba(var(--peach), 0.2)
```

:::

:::danger 注意！
Sass 对斜杠分隔值的特殊解析规则使得在使用签名 `$alphargb($red $green $blue / $alpha)` 时传递 `$blue` 变量变得困难。请考虑使用 `rgb($red, $green, $blue, $alpha)` 替代。
:::

```scss
@debug rgb(0 51 102); // #036
@debug rgb(95%, 92.5%, 89.5%); // #f2ece4
@debug rgb(0 51 102 / 50%); // rgba(0, 51, 102, 0.5)
@debug rgba(95%, 92.5%, 89.5%, 0.2); // rgba(242, 236, 228, 0.2)
```

如果 `$color` 和 `$alpha` 被传递，这将返回 `$color` 给定的 `$alpha` 通道而不是其原始的 alpha 通道。

```scss
@debug rgb(#f2ece4, 50%); // rgba(242, 236, 228, 0.5);
@debug rgba(rgba(0, 51, 102, 0.5), 1); // #003366
```
