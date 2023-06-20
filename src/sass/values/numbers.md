# Sass 数字

Sass 里的数字由两个部分组成：数字本身和它的单位。例如 `16px` 的数字是 `16`，单位是 `px`。数字可以没有单位，并且它们也可以有复杂的单位。

```scss
@debug 100; // 100
@debug 0.8; // 0.8
@debug 16px; // 16px
@debug 5px * 2px; // 10px*px (read "square pixels" ”像素的平方“)
```

Sass 数字支持和 CSS 数字一样的格式化，包括科学计数法。由于历史上浏览器对科学计数法的支持一直不稳定，Sass 总是将其编译为完全展开的数字。

```scss
@debug 5.2e3; // 5200
@debug 6e-2; // 0.06
```

:::danger 注意！
Sass 不区分整数和小数，因此例如 `math.div(5, 2)` 返回 `2.5` 而不是 `2`. 这与 JavaScript 的行为相同，但与许多其他编程语言不同。
:::

## 单位

Sass 对基于[真实世界单位计算](https://en.wikipedia.org/wiki/Unit_of_measurement#Calculations_with_units_of_measurement)工作方式的操作单位有强大的支持。当两个数相乘时，它们的单位也相乘。当一个数字除以另一个数字时，结果采用第一个数字的单位当做分子和第二个数字的单位当做分母。一个数字在分子和/或分母中可以有任意数量的单位。

```scss
@debug 4px * 6px; // 24px*px (read "square pixels")
@debug math.div(5px, 2s); // 2.5px/s (read "pixels per second")

// 3.125px*deg/s*em (read "pixel-degrees per second-em")
@debug 5px * math.div(math.div(30deg, 2s), 24em);

$degrees-per-second: math.div(20deg, 1s);
@debug $degrees-per-second; // 20deg/s
@debug math.div(1, $degrees-per-second); // 0.05s/deg
```

:::danger 注意！
因为 CSS 是不支持复杂单位如像素的平方（px\*px），使用一个带有复杂单位的数字作为属性值将会产生一个错误。不过，这是伪装(in disguise)的功能；如果你最终没有得到正确的单位，这通常意味着你的计算有问题！请记住，你始终可以使用 `@debug` 规则来检查任何变量或表达式的单位。
:::

Sass 会自动在兼容的单位之间进行转换，尽管它会为结果选择哪个单位取决于你使用的 Sass 的实现。如果你尝试组合不兼容的单位，例如 ，`1in + 1em` Sass 将抛出错误。

```scss
// CSS defines one inch as 96 pixels.
@debug 1in + 6px; // 102px or 1.0625in

@debug 1in + 1s;
//     ^^^^^^^^
// Error: Incompatible units s and in.
```

在真实世界计算中，如果分子包含单位和分母包含的单位是相兼容的，它们会互相抵消。这使得定义可用于在单位之间进行转换的比率变得容易。在下面的例子中，我们设置想得到的速度为每像素花费一秒，然后乘以这个动画移动的距离来得到它将会花费的时间。

```scss
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

对应的 css 代码为：

```css
.slider {
  position: absolute;
  left: 10px;
  transition: left 2.2s;
}
.slider:hover {
  left: 120px;
}
```

:::danger 注意！
如果你的计算给了你一个错误的单位，你可能需要检查你的数学计算。你可能遗漏了本应该有的单位数量。保持单位干净 Sass 才会给你一个有用的报错提示。

你应该避免像 `#{$number}px` 这样使用插值。这实际上不会产生一个数字！它会产生一个不带引号的字符串，看起来像一个数字而已，不会再任何数字运算和函数中工作。尝试着去使你的数学计算单位干净，例如定义 `$number` 的时候带上单位或者写为 `$number * 1px`。
:::

:::danger 注意！
Sass 中的百分数工作的时候和其他单位一样。意味着它们和小数是不能相互转换的，因为在 CSS 中小数和百分数意味着不同的东西。例如，`50%` 是一个数字带有 `%` 作为它的单位，Sass 认为 `50%` 和 `0.5` 是不同的。

你可以通过使用 `math.div($percentage, 100%)` 来转换百分数和小数，并且 `$decimal * 100%` 将会返回一个相应的百分数。你也可以使用 `math.percentage()` 函数，比起 `$decimal * 100%` 来说更加易读。
:::

## 精度

兼容性（默认 10 位数字）：

- Dart Sass：:white_check_mark:
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：since 3.5.0

> LibSass 和更老版本的 Ruby Sass 默认的精度为 5 位，但是可以被配置为其他精度。它推荐用户配置精度为 10 位，为了准确性和向前的兼容性。

Sass 数字在内部表示为 64 位的浮点型数值。Sass 最多支持 10 位精度，这意味着有一些不同的事情：

- 只有小数后的十位数字将会出现在生成的 CSS 代码中
- 如果两个数字直到第十位都相同，那么操作符 `==` 和 `>=` 会将两数字视为相等
- 如果一个整数和另一个整数的差值比 `0.0000000001` 小，那么对于像 `list.nth()` 这样需要整数参数的函数来说，它被认为是一个整数。

```scss
@debug 0.012345678912345; // 0.0123456789
@debug 0.01234567891 == 0.01234567899; // true
@debug 1.00000000009; // 1
@debug 0.99999999991; // 1
```

:::info 有趣的事实：
当数字被用在一些精度相关的地方使用时，会被惰性地四舍五入为 10 位精度。这意味着数学函数内部会处理数字完整地，以避免四舍五入带来的累积误差。
:::
