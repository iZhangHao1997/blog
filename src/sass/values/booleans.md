# Sass Booleans

布尔值是逻辑值 `true` 和 `false`。操作符 [equality](../operators/equality.md) 和 [relational](../operators/relational.md) 返回布尔值，许多内置函数比如 `math.comparable()` 和 `map.has-key()` 等也返回布尔值。

```scss
@use "sass:math";

@debug 1px == 2px; // false
@debug 1px == 1px; // true
@debug 10px < 3px; // false
@debug math.comparable(100px, 3in); // true
```

你可以通过[布尔操作符](../operators/boolean.md)使用布尔值。`and` 返回 `true` 如果两边为 `true`，`or` 返回 `true` 如果两边有一边为 `true`。`not` 操作符返回布尔值的相反结果。

```scss
@debug true and true; // true
@debug true and false; // false

@debug true or false; // true
@debug false or false; // false

@debug not true; // false
@debug not false; // true
```

## 使用布尔值

在 Sass 中你可以通过布尔值来决定做不同的事情。[@if 规则](../at-rules/control/if.md) 将会触发样式块内的规则如果参数为 `true`。

:::code-group

```scss
@use "sass:math";

@mixin avatar($size, $circle: false) {
  width: $size;
  height: $size;

  @if $circle {
    border-radius: math.div($size, 2);
  }
}

.square-av {
  @include avatar(100px, $circle: false);
}
.circle-av {
  @include avatar(100px, $circle: true);
}
```

```css
.square-av {
  width: 100px;
  height: 100px;
}

.circle-av {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
```

:::

`if($condition, $if-true, $if-false)` if 函数返回 `$if-true` 如果 `$condition` 为 `truly`，反之 返回 `$if-false`。

```scss
@debug if(true, 10px, 30px); // 10px
@debug if(false, 10px, 30px); // 30px
```

## 真值和假值

任何可以使用 true 或者 false 的地方，也可以使用其他值。`false` 和 `null` 是假值，意味着 Sass 认为它们表示假的将导致条件失败。其他任何值都会被认为真值，因此 Sass 会将它们当作 true 来工作，意味着条件成功。

例如，你想检查一个字符串是否包含空格，你可以写 `string.index($string, " ")`。`string.index()` 函数将会返回 null，如果这个字符串不能找到一个空格，否则返回一个数字。

:::danger 注意！
一些语言认为会有一些除了 `false` 和 `null` 以外更多的值被认为是假值。Sass 不这么认为。例如空字符串、空列表、数字 0，在 Sass 中都会被认为是真值。
:::
