# sass:color

```scss
color.adjust($color,
  $red: null, $green: null, $blue: null,
  $hue: null, $saturation: null, $lightness: null,
  $whiteness: null, $blackness: null,
  $alpha: null)
adjust-color(...) //=> color
```

按固定量增加或减少 `$color` 的一个或多个属性。

将为每个关键字参数传递的值添加到颜色的相应属性，并返回调整后的颜色。同时指定 RGB 属性（`$red`、`$green` 和/或 `$blue`）和 HSL 属性（`$hue`、`$saturation` 和/或 `$blue`），或同时指定其中任何一个和 HWB 属性（`$hue`、`$whiteness` 和/或 `$blackness`）都是错误的。

所有可选参数都必须是数字。`$red`、`$green` 和 `$blue` 参数必须无单位，且介于 -255 和 255 之间（含）。`$hue` 参数必须有单位 `deg` 或无单位。`$saturation`、 `$lightness`、`$whiteness` 和 `$blackness` 参数必须介于 `-100%` 和 `100%`（含）之间，且不能无单位。`$alpha` 参数必须无单位，且介于 `-1` 和 `1` 之间 （包含）。

也可以看看(后面会有更详细的介绍)：

- `color.scale()` 用于流畅地缩放颜色属性。
- `color.change()` 用于设置颜色的属性。

```scss
@use "sass:color";

@debug color.adjust(#6b717f, $red: 15); // #7a717f
@debug color.adjust(#d2e1dd, $red: -10, $blue: 10); // #c8e1e7
@debug color.adjust(
  #998099,
  $lightness: -30%,
  $alpha: -0.4
); // rgba(71, 57, 71, 0.6)
```

```scss
adjust-hue($color, $degrees) //=> color
```

提高或减少 `$color` 的 hue (色相角)值。

`$hue` 色相角必须是一个介于 `-360deg` 到 `360deg`(包含) 之间的值。它可以是无单位的但不能是除了 `deg` 之外的单位。

`color.adjust()` 可以调整颜色的任何属性。

:::danger 注意！
因为 `adjust-hue()` 和 `adjust()` 是重复的，所以它不会被新的模块系统直接包含。你可以使用 `color.adujst($color, $hue: $amount)` 代替 `adjust-hue($color, $amount)`。
:::

```scss
// Hue 222deg becomes 282deg.
@debug adjust-hue(#6b717f, 60deg); // #796b7f

// Hue 164deg becomes 104deg.
@debug adjust-hue(#d2e1dd, -60deg); // #d6e1d2

// Hue 210deg becomes 255deg.
@debug adjust-hue(#036, 45); // #1a0066
```

```scss
color.alpha($color)
alpha($color)
opacity($color) //=> number
```

`alpha()` 返回 `$color` 的 ahpha 值，介于 0-1 的数字。

作为一个特例，它支持 Internet Explorer 语法 `alpha(opacity=20)`，它返回一个不带引号的字符串。

还有更多：

- color.red() 获取颜色的红色通道。
- color.green() 获取颜色的绿色通道。
- color.blue() 获取颜色的蓝色通道。
- color.hue() 获取颜色的色调。
- color.saturation() 获取颜色饱和度。
- color.lightness() 获取颜色的亮度。
- color.whiteness() 获取颜色的白度。
- color.alpha() 获取颜色的透明度。

```scss
@use "sass:color";

@debug color.alpha(#e1d7d2); // 1
@debug color.opacity(rgb(210, 225, 221, 0.4)); // 0.4
@debug alpha(opacity=20); // alpha(opacity=20)
```

```scss
color.blackness($color) //=> number
```

`blackness()` 返回颜色的 HWB 黑色值——介于 `0%` 和 `100%` 的值。

```scss
@use "sass:color";

@debug color.blackness(#e1d7d2); // 11.7647058824%
@debug color.blackness(white); // 0%
@debug color.blackness(black); // 100%
```

```scss
color.blue($color)
blue($color) //=> number
```

`blue()` 返回颜色的 blue 值，介于 0 - 255 的数字。

```scss
color.change($color,
  $red: null, $green: null, $blue: null,
  $hue: null, $saturation: null, $lightness: null,
  $whiteness: null, $blackness: null,
  $alpha: null)
change-color(...) //=> color
```

`color.change()` 设置一个颜色值的一个或多个属性值。

将为每个关键字参数传递的值添加到颜色的相应属性，并返回调整后的颜色。同时指定 RGB 属性（`$red`、`$green` 和/或 `$blue`）和 HSL 属性（`$hue`、`$saturation` 和/或 `$blue`），或同时指定其中任何一个和 HWB 属性（`$hue`、`$whiteness` 和/或 `$blackness`）都是错误的。

所有可选参数都必须是数字。`$red`、`$green` 和 `$blue` 参数必须无单位，且介于 -255 和 255 之间（含）。`$hue` 参数必须有单位 `deg` 或无单位。`$saturation`、 `$lightness`、`$whiteness` 和 `$blackness` 参数必须介于 `-100%` 和 `100%`（含）之间，且不能无单位。`$alpha` 参数必须无单位，且介于 `-1` 和 `1` 之间 （包含）。

也可以看看：

- `color.scale()` 用于流畅地缩放颜色的属性值
- `color.adjust()` 根据固定的数值调整颜色的属性值

```scss
@use "sass:color";

@debug color.change(#6b717f, $red: 100); // #64717f
@debug color.change(#d2e1dd, $red: 100, $blue: 50); // #64e132
@debug color.change(
  #998099,
  $lightness: 30%,
  $alpha: 0.5
); // rgba(85, 68, 85, 0.5)
```

```scss
color.complement($color);
complement($color) // => color
```

`color.complement` 返回 `$color` 的补数。

这相当于 `color.adjust($color, $hue: 180deg)`。

```scss
@use "sass:color";

// Hue 222deg becomes 42deg.
@debug color.complement(#6b717f); // #7f796b

// Hue 164deg becomes 344deg.
@debug color.complement(#d2e1dd); // #e1d2d6

// Hue 210deg becomes 30deg.
@debug color.complement(#036); // #663300
```

```scss
darken($color, $amount); // => color
```

`darken()` 可以使颜色更暗。

`$amount` 参数必须是一个介于 `0%` 到 `100%`(包含) 之间的百分数。将根据 `$amount` 参数降低 `$color` HSL 的亮度 lightness 值。

:::danger 注意！
`darken()` 函数会按一个固定的数值降低亮度，这通常不是所需的效果。要使颜色比之前暗一定百分比，请使用 `color.scale()` 代替。

由于 `darken()` 通常不是使颜色变深的最佳方式，因此它不会直接包含在新模块系统中。但是，如果您必须保留现有行为，则 `darken($color, $amount)` 可以编写为 `color.adjust($color, $lightness: -$amount)`。

```scss
@use "sass:color";

// #036 has lightness 20%, so when darken() subtracts 30% it just returns black.
@debug darken(#036, 30%); // black

// scale() instead makes it 30% darker than it was originally.
@debug color.scale(#036, $lightness: -30%); // #002447
```

:::

```scss
// Lightness 92% becomes 72%.
@debug darken(#b37399, 20%); // #7c4465

// Lightness 85% becomes 45%.
@debug darken(#f2ece4, 40%); // #b08b5a

// Lightness 20% becomes 0%.
@debug darken(#036, 30%); // black
```

```scss
desaturate($color, $amount); // => color
```

`desatrurate` 用来降低 `$color` 的饱和度。

`$amount` 参数必须是一个介于 `0%` 到 `100%`(包含) 之间的百分数。将根据 `$amount` 参数降低 `$color` HSL 的饱和度 sturation 值。

:::danger 注意！
`desaturate()` 函数会按一个固定的数值降低饱和度，这通常不是所需的效果。要使颜色的饱和度比之前降低一定百分比，请使用 `color.scale()` 代替。

由于 `desaturate()` 通常不是降低颜色饱和度的最佳方式，因此它不会直接包含在新模块系统中。但是，如果您必须保留现有行为，则 `desaturate($color, $amount)` 可以编写为 `color.adjust($color, $saturation: -$amount)`。

```scss
@use "sass:color";

// #d2e1dd has saturation 20%, so when desaturate() subtracts 30% it just
// returns gray.
@debug desaturate(#d2e1dd, 30%); // #dadada

// scale() instead makes it 30% less saturated than it was originally.
@debug color.scale(#6b717f, $saturation: -30%); // #6e727c
```

:::

```scss
// Saturation 100% becomes 80%.
@debug desaturate(#036, 20%); // #0a335c

// Saturation 35% becomes 15%.
@debug desaturate(#f2ece4, 20%); // #eeebe8

// Saturation 20% becomes 0%.
@debug desaturate(#d2e1dd, 30%); // #dadada
```

```scss
color.graysale($color);
grayscale($color) // => color
```

`grayscale()` 返回一个和 `$color` 相同亮度的灰色颜色。

这相当于 `color.change($color, $saturation: 0%)`。

```scss
@use "sass:color";

@debug color.grayscale(#6b717f); // #757575
@debug color.grayscale(#d2e1dd); // #dadada
@debug color.grayscale(#036); // #333333
```

```scss
color.green($color)
green($color) //=> number
```

`color.green()` 以一个 `0` - `255` 的数字返回 `$color` 颜色的绿色通道值。

更多的同理方法：

- color.red() 获取颜色的红色通道。
- color.green() 获取颜色的绿色通道。
- color.blue() 获取颜色的蓝色通道。
- color.hue() 获取颜色的色调。
- color.saturation() 获取颜色饱和度。
- color.lightness() 获取颜色的亮度。
- color.whiteness() 获取颜色的白度。
- color.alpha() 获取颜色的透明度。

```scss
@use "sass:color";

@debug color.green(#e1d7d2); // 215
@debug color.green(white); // 255
@debug color.green(black); // 0
```

```scss
color.hue($color);
hue($color); // => number
```

`color.hue()` 以一个 `0deg` - `360deg` 的数字返回 `$color` 颜色的色调。

```scss
@use "sass:color";

@debug color.hue(#e1d7d2); // 20deg
@debug color.hue(#f2ece4); // 34.2857142857deg
@debug color.hue(#dadbdf); // 228deg
```

```scss
color.hwb($hue $whiteness $blackness)
color.hwb($hue $whiteness $blackness / $alpha)
color.hwb($hue, $whiteness, $blackness, $alpha: 1) //=> color
```

`color.hwb()` 根据给定的 `hue`、`whiteness`、`blackness` 和给定的 `alpha` 值返回一个颜色值。

`hue` 色相是一个介于 `0deg` - `360deg`（包含）的数字。`whiteness` 白度和 `blackness` 黑度是介于 `0%` 到 `100%`（包括）的数字。`hue` 可以是无单位的，但是 `whiteness` 和 `blackness` 必须有 `%` 单位。`alpha` 可以是 `0` 到 `1`（包含）的数字或者是 `0%` 到 `100%`（包含）的百分数。

:::danger 注意！
Sass 特殊的解析规则对于斜杠分割的参数值传递给 `$blackness` 或者 `$alpha` 变得变困难。考虑使用 `color.hwb($hue, $whiteness, $blackness, $alpha)` 代替 `color.hwb($hue $whiteness $blackness / $alpha)`。
:::

```scss
@use "sass:color";

@debug color.hwb(210, 0%, 60%); // #036
@debug color.hwb(34, 89%, 5%); // #f2ece4
@debug color.hwb(210 0% 60% / 0.5); // rgba(0, 51, 102, 0.5)
```

```scss
color.ie-hex-str($color);
ie-hex-str($color); // => unquoted string
```

`ie-hex-str()` 返回一个颜色不带引号的字符串，该字符串表示 Internet Explorer `-ms-filter` 属性所期望的 `#AARRGGBB` 格式。

```scss
@use "sass:color";

@debug color.ie-hex-str(#b37399); // #FFB37399
@debug color.ie-hex-str(#808c99); // #FF808C99
@debug color.ie-hex-str(rgba(242, 236, 228, 0.6)); // #99F2ECE4
```

```scss
color.invert($color, $weight: 100%);
invert($color, $weight: 100%) // => color
```

`invert($color, $weight)` 返回 `$color` 的相反或负值。

`$weight` 参数必须是一个 `0%` 到 `100%`（包含）的数值。weight 的数值越高，意味着返回的颜色越接近 `$color` 的负值；数值越低意味着越接近 `$color` 值。weight 50% 将总会产生 `#808080`。

```scss
@use "sass:color";

@debug color.invert(#b37399); // #4c8c66
@debug color.invert(black); // white
@debug color.invert(#550e0c); // 663b3a
```

```scss
lighten($color, $amount); //=> color
```

`lighten()` 使颜色更亮。

`$amount` 参数必须是一个介于 `0%` 到 `100%`（包含）的数字。根据这个数值提升 HSL 的亮度。

:::danger 注意！
`lighten()` 函数会按一个固定的数值提高亮度，这通常不是所需的效果。要使颜色的亮度比之前亮度高一定的百分比，请使用 `color.scale()` 代替。

由于 `lighten()` 通常不是提高颜色亮度的最佳方式，因此它不会直接包含在新模块系统中。但是，如果您必须保留现有行为，则 `lighten($color, $amount)` 可以编写为 `color.adjust($color, $lightness: $amount)`。

```scss
@use "sass:color";

// #e1d7d2 has lightness 85%, so when lighten() adds 30% it just returns white.
@debug lighten(#e1d7d2, 30%); // white

// scale() instead makes it 30% lighter than it was originally.
@debug color.scale(#e1d7d2, $lightness: 30%); // #eae3e0
```

:::

```scss
// Lightness 46% becomes 66%.
@debug lighten(#6b717f, 20%); // #a1a5af

// Lightness 20% becomes 80%.
@debug lighten(#036, 60%); // #99ccff

// Lightness 85% becomes 100%.
@debug lighten(#e1d7d2, 30%); // white
```

```scss
color.lightness($color)
lightness($color) //=> number
```

`lightness()` 方法以 `0%` 到 `100%` 数值返回 `$color` 的亮度值。

```scss
@use "sass:color";

@debug color.lightness(#e1d7d2); // 85.2941176471%
@debug color.lightness(#f2ece4); // 92.1568627451%
@debug color.lightness(#dadbdf); // 86.4705882353%
```

```scss
color.mix($color1, $color2, $weight: 50%);
mix($color1, $color2, $weight: 50%); // => color
```

`mix()` 方法返回 `$color1` 和 `$color2` 的混合值。

`$weight` 参数和每种颜色的相对透明度决定了返回颜色中每种颜色的含量。`$weight` 参数必须是介于 `0%` 到 `100%` 的数值。更大的 `weight` 值代表着更大的 `$color1` 含量；反之是更高的 `$color2` 占比。

```scss
@use "sass:color";

@debug color.mix(#036, #d2e1dd); // #698aa2
@debug color.mix(#036, #d2e1dd, 75%); // #355f84
@debug color.mix(#036, #d2e1dd, 25%); // #9eb6bf
@debug color.mix(
  rgba(242, 236, 228, 0.5),
  #6b717f
); // rgba(141, 144, 152, 0.75)
```

```scss
opacify($color, $amount)
fade-in($color, $amount) //=> color
```

以上两个方法让颜色更加不透明。

`$amount` 必须是 `0` 到 `1`（包含）的数字。根据 `$amount` 参数提高 `$color` 的 alpha 通道。

:::danger 注意！
`opacify()` 函数会按一个固定的数值提高 alpha，这通常不是所需的效果。要使颜色以一定的百分比之前更加不透明，请使用 `color.scale()` 代替。

由于 `opacify()` 通常不是提高颜色 alpha 的最佳方式，因此它不会直接包含在新模块系统中。但是，如果您必须保留现有行为，则 `opacify($color, $amount)` 可以编写为 `color.adjust($color, $alpha: -$amount)`。

```scss
@use "sass:color";

// rgba(#036, 0.7) has alpha 0.7, so when opacify() adds 0.3 it returns a fully
// opaque color.
@debug opacify(rgba(#036, 0.7), 0.3); // #036

// scale() instead makes it 30% more opaque than it was originally.
@debug color.scale(rgba(#036, 0.7), $alpha: 30%); // rgba(0, 51, 102, 0.79)
```

:::

```scss
@debug opacify(rgba(#6b717f, 0.5), 0.2); // rgba(107, 113, 127, 0.7)
@debug fade-in(rgba(#e1d7d2, 0.5), 0.4); // rgba(225, 215, 210, 0.9)
@debug opacify(rgba(#036, 0.7), 0.3); // #036
```

```scss
color.red($color)
red($color) //=> number
```

`red()` 方法以 `0` 到 `255` 的数值返回 `$color` 颜色的红色值。

后面类似的函数还有 `color.saturate($color, $amount)` 提高颜色的饱和度；对应的可以用 `color.saturation($color)` 获取颜色的饱和度。

```scss
color.scale($color,
  $red: null, $green: null, $blue: null,
  $saturation: null, $lightness: null,
  $whiteness: null, $blackness: null,
  $alpha: null)
scale-color(...) //=> color
```

`color.scale()` 流畅地缩放颜色 `$color` 一个或者多个属性值。

每个关键字参数都必须是介于 `-100%` 到 `100%`（包含）之间的百分数。这个参数意味着对应属性距离原始值到最大值应该偏离多远（如果这个参数是正数）或者到最小值应该偏离多远（如果这个参数是负数）。这意味着，例如，`lightness: 50%` 将会使所有颜色 50% 更接近最大亮度，而不会使它们完全变白。

同时指定 RGB 属性（`$red`、`$green` 和/或 `$blue`）和 HSL 属性（`$hue`、`$saturation` 和/或 `$blue`），或同时指定其中任何一个和 HWB 属性（`$hue`、`$whiteness` 和/或 `$blackness`）都是错误的。

其他方法：

- `color.adjust()` 根据固定的值改变颜色的属性。
- `color.change()` 设置颜色的多个属性。

```scss
@use "sass:color";

@debug color.scale(#6b717f, $red: 15%); // #81717f
@debug color.scale(#d2e1dd, $lightness: -10%, $saturation: 10%); // #b3d4cb
@debug color.scale(#998099, $alpha: -40%); // rgba(153, 128, 153, 0.6)
```

```scss
transparentize($color, $amount)
fade-out($color, $amount) //=> color
```

`transparentize($color, $amount)` 和 `fade-out($color, $amount)` 可以使 `$color` 更加透明。

`$amount` 参数必须是一个 `0` 到 `1`(包含) 的数值。根据这个数值降低 `$color` 的 `alpha` 通道值。

:::danger 注意！
`transparentize()` 函数会按一个固定的数值降低 alpha，这通常不是所需的效果。要使颜色以百分比的形式比之前降低透明度，请使用 `color.scale()` 代替。

由于 `transparentize()` 通常不是让颜色更加透明的最佳方式，因此它不会直接包含在新模块系统中。但是，如果您必须保留现有行为，则 `transparentize($color, $amount)` 可以编写为 `color.adjust($color, $alpha: -$amount)`。

```scss
@use "sass:color";

// rgba(#036, 0.3) has alpha 0.3, so when transparentize() subtracts 0.3 it
// returns a fully transparent color.
@debug transparentize(rgba(#036, 0.3), 0.3); // rgba(0, 51, 102, 0)

// scale() instead makes it 30% more transparent than it was originally.
@debug color.scale(rgba(#036, 0.3), $alpha: -30%); // rgba(0, 51, 102, 0.21)
```

:::

```scss
@debug transparentize(rgba(#6b717f, 0.5), 0.2); // rgba(107, 113, 127, 0.3)
@debug fade-out(rgba(#e1d7d2, 0.5), 0.4); // rgba(225, 215, 210, 0.1)
@debug transparentize(rgba(#036, 0.3), 0.3); // rgba(0, 51, 102, 0)
```

```scss
color.whiteness($color); // => number
```

`color.whiteness($color)` 返回 `$color` 颜色的 whiteness 值以 `0%` 到 `100%` 之间的数字。

```scss
@use "sass:color";

@debug color.whiteness(#e1d7d2); // 82.3529411765%
@debug color.whiteness(white); // 100%
@debug color.whiteness(black); // 0%
```
