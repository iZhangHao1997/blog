# sass:math

## 变量

```scss
math.$e
```

数学常数 `e` 的最接近的 64 位浮点数近似值。

```scss
@use "sass:math";

@debug math.$e; // 2.7182818285
```

```scss
math.$epsilon
```

根据浮点比较 1 与大于 1 的最小 64 位浮点数之间的差。由于 Sass 数字的精度为 10 位，因此在许多情况下，该差将显示为 0。

```scss
math.$max-number
```

可以表示为 64 位浮点数的最大有限数 。

```scss
@use "sass:math";

@debug math.$max-number; // 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

```scss
math.$max-safe-integer
```

`n` 和 `n + 1` 都可以精确表示为 64 位浮点数 `n` 的最大整数。

```scss
@use "sass:math";

@debug math.$max-safe-integer; // 9007199254740991
```

```scss
math.$min-number
```

可以表示为 64 位浮点数的最小正数。由于 Sass 数字的精度为 10 位，因此在许多情况下，该数字将显示为 0。

```scss
math.$min-safe-integer
```

`n` 和 `n - 1` 可以精确表示为 64 位浮点数的最小整数 `n`。

```scss
@use "sass:math";

@debug math.$min-safe-integer; // -9007199254740991
```

```scss
math.$pi
```

数学常数 π 最接近的 64 位浮点近似值。

```scss
@use "sass:math";

@debug math.$pi; // 3.1415926536
```

## 边界函数

```scss
math.ceil($number)
ceil($number) //=> number
```

向上舍入，并返回大于等于给定数字的最小整数。

```scss
@use "sass:math";

@debug math.ceil(4); // 4
@debug math.ceil(4.2); // 5
@debug math.ceil(4.9); // 5
```

```scss
math.clamp($min, $number, $max) //=> number
```

限制 `$number` 的范围为 `$min` 到 `$max` 之间。如果 `$number` 比 `$min` 更小则返回 `$min`，如果比 `$max` 更大则返回 `$max`。

`$min`、`$number` 和 `$max` 都必须有相兼容的单位，或者都是无单位的。

```scss
@use "sass:math";

@debug math.clamp(-1, 0, 1); // 0
@debug math.clamp(1px, -1px, 10px); // 1px
@debug math.clamp(-1in, 1cm, 10mm); // 10mm
```

```scss
math.floor($number)
floor($number) //=> number
```

返回小于等于一个给定数字的最大整数。

```scss
@use "sass:math";

@debug math.floor(4); // 4
@debug math.floor(4.2); // 4
@debug math.floor(4.9); // 4
```

```scss
math.max($number...)
max($number...) //=> number
```

返回最大的一个或更多的数字。

```scss
@use "sass:math";

@debug math.max(1px, 4px); // 4px

$widths: 50px, 30px, 100px;
@debug math.max($widths...); // 100px
```

```scss
math.min($number...)
min($number...) //=> number
```

返回最小的一个或更多的数字。

```scss
@use "sass:math";

@debug math.min(1px, 4px); // 1px

$widths: 50px, 30px, 100px;
@debug math.min($widths...); // 30px
```

```scss
math.round($number)
round($number) //=> number
```

返回 `$number` 最接近的一个整数。

```scss
@use "sass:math";

@debug math.round(4); // 4
@debug math.round(4.2); // 4
@debug math.round(4.9); // 5
```

## 距离函数

```scss
math.abs($number)
abs($number) //=> number
```

返回 `$number` 的绝对值。

```scss
@use "sass:math";

@debug math.abs(10px); // 10px
@debug math.abs(-10px); // 10px
```

```scss
math.hypot($number...) //=> number
```

函数返回所有参数的平方和的平方根。`$numbers` 必须都是相兼容的单位或者都是无单位的。并且由于可能单位是不同的，输出结果将会采取第一个数字的单位。

```scss
@use "sass:math";

@debug math.hypot(3, 4); // 5

$lengths: 1in, 10cm, 50px;
@debug math.hypot($lengths...); // 4.0952775683in
```

## 指数函数

```scss
math.log($number, $base: null) //=> number
```

返回 `$number` 相对于 `$base` 的对数。如果 `$base` 为 `null`，则计算自然对数。

`$number` 和 `$base` 都必须是无单位的。

```scss
@use "sass:math";

@debug math.log(10); // 2.302585093
@debug math.log(10, 10); // 1
```

```scss
math.pow($base, $exponent) //=> number
```

返回基数（`$base`）的指数（`$exponent`）次幂，即 `base^exponent`。

`$base` 和 `$exponent` 都必须是无单位的。

```scss
@use "sass:math";

@debug math.pow(10, 2); // 100
@debug math.pow(100, math.div(1, 3)); // 4.6415888336
@debug math.pow(5, -2); // 0.04
```

```scss
math.sqrt($number) //=> number
```

函数返回一个数的平方根。

`$number` 必须是无单位的。

```scss
@use "sass:math";

@debug math.sqrt(100); // 10
@debug math.sqrt(math.div(1, 3)); // 0.5773502692
@debug math.sqrt(-1); // NaN
```

## 三角函数

```scss
math.cos($number) //=> number
```

函数返回一个数值的余弦值。

`$number` 必须是一个角度（其单位必须兼容 `deg`）或者是无单位的。如果 `$number` 没有单位，则假定为 `rad` 弧度。（一个完整圆的弧度是 2𝜋）。

```scss
@use "sass:math";

@debug math.cos(100deg); // -0.1736481777
@debug math.cos(1rad); // 0.5403023059
@debug math.cos(1); // 0.5403023059
```

```scss
math.sin($number) //=> number
```

返回一个数值的正弦值。

`$number` 必须是一个角度（其单位必须兼容 `deg`）或者是无单位的。如果 `$number` 没有单位，则假定为 `rad` 弧度。（一个完整圆的弧度是 2𝜋）。

```scss
@use "sass:math";

@debug math.sin(100deg); // 0.984807753
@debug math.sin(1rad); // 0.8414709848
@debug math.sin(1); // 0.8414709848
```

```scss
math.tan($number) //=> number
```

函数返回一个数值的正切值。

`$number` 必须是一个角度（其单位必须兼容 `deg`）或者是无单位的。如果 `$number` 没有单位，则假定为 `rad` 弧度。（一个完整圆的弧度是 2𝜋）。

```scss
@use "sass:math";

@debug math.tan(100deg); // -5.6712818196
@debug math.tan(1rad); // 1.5574077247
@debug math.tan(1); // 1.5574077247
```

```scss
math.acos($number) //=> number
```

以 `deg` 的形式返回 `$number` 的反余弦值。

`$number` 必须是无单位的。

```scss
@use "sass:math";

@debug math.asin(0.5); // 30deg
@debug math.asin(2); // NaNdeg
```

```scss
math.atan($number) //=> number
```

以 `deg` 的形式返回 `$number` 的反正弦值。

`$number` 必须是无单位的。

```scss
@use "sass:math";

@debug math.atan(10); // 84.2894068625deg
```

```scss
math.atan2($y, $x) //=> number
```

返回从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)。

`$y` 和 `$x` 都必须是兼容单位或者是无单位的。

:::info 有趣的事实：
`math.atan2($y, $x)` 不同于 `atan(math.div($y, $x))`，因为它保留了所讨论点的象限。例 如 `math.atan2(1, -1)` 对应于点 `(-1, 1)` 并返回 `135deg`。相反， `math.atan(math.div(1, -1))` 和 `math.atan(math.div(-1, 1))` 首先解析为 `atan(-1)`，因此两者都返回 `-45deg`。
:::

```scss
@use "sass:math";

@debug math.atan2(-1, 1); // 135deg
```

## 单位函数

```scss
math.compatible($number1, $number2)
comparable($number1, $number2) //=> boolean
```

返回是否 `$number1` 和 `$number2` 有相兼容的单位。

如果返回 `true`，那么 `$number1` 和 `$number2` 可以安全地相加、相减和比较。否则，做以上操作都会产生错误。

:::danger 注意！
这个函数的全局方法名为 `comparable`，但是它被添加到 `sass:math` 内置模块中，函数名就改为了 `compatible`，可以更清楚地表达函数的作用。
:::

```scss
@use "sass:math";

@debug math.compatible(2px, 1px); // true
@debug math.compatible(100px, 3em); // false
@debug math.compatible(10cm, 3mm); // true
```

```scss
math.is-unitless($number)
unitless($number) //=> boolean
```

返回 `$number` 是否是无单位的。

```scss
@use "sass:math";

@debug math.is-unitless(100); // true
@debug math.is-unitless(100px); // false
```

```scss
math.unit($number)
unit($number) //=> quoted string
```

以字符串的形式返回 `$number` 对应的单位。

:::danger 注意！
此功能用于调试；其输出格式不能保证在各个 Sass 版本或实现中保持一致。
:::

```scss
@use "sass:math";

@debug math.unit(100); // ""
@debug math.unit(100px); // "px"
@debug math.unit(5px * 10px); // "px*px"
@debug math.unit(math.div(5px, 1s)); // "px/s"
```

## 其他函数

```scss
math.div($number1, $number2) //=> number
```

返回 `$number1` 除以 `$number2` 的结果。

两个数字共享的任何单位都将被抵消。

:::danger 注意！
出于向后兼容的目的，这将返回与弃用运算符 `/` 完全相同的结果，包括用字符 `/` 连接两个字符串 。但是，此行为最终将被删除，不应在新样式表中使用。
:::

```scss
@use "sass:math";

@debug math.div(1, 2); // 0.5
@debug math.div(100px, 5px); // 20
@debug math.div(100px, 5); // 20px
@debug math.div(100px, 5s); // 20px/s
```

```scss
math.percentage($number)
percentage($number) //=> number
```

将一个 `$number` （通常是一个 0 到 1 的小数）转为百分数。

:::info 有趣的事实：
这个函数相当于 `$number * 100%`。
:::

```scss
@use "sass:math";

@debug math.percentage(0.2); // 20%
@debug math.percentage(math.div(100px, 50px)); // 200%
```

```scss
math.random($limit: null)
random($limit: null) //=> number
```

如果 `$limit` 为 `null`，返回一个介于 0 到 1 之间的浮点数。

```scss
@use "sass:math";

@debug math.random(); // 0.2821251858
@debug math.random(); // 0.6221325814
```

如果 `$limit` 是一个大于等于 1 的数字，将会返回一个介于 1 和 `$limit` 之间的整数。

:::danger 注意！
`random()` 将会忽略 `$limit` 里的单位。将返回与 `$limit` 参数具有相同单位的随机整数。

```scss
@use "sass:math";

@debug math.random(100px); // 42
```

:::

```scss
@use "sass:math";

@debug math.random(10); // 4
@debug math.random(10000); // 5373
```
