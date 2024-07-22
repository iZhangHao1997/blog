# sass:meta

## Mixins 混入

```scss
meta.apply($mixin, $args...)
```

传入 `args` 引入 `mixin`。如果传入了 `@content block`，它会被加载到 `$mixin` 中。

`$mixin` 参数必须是一个 mixin，例如由 `meta.get-mixin()` 返回的值。

```scss
@use "sass:meta";
@use "sass:string";

/// Passes each element of $list to a separate invocation of $mixin.
@mixin apply-to-all($mixin, $list) {
  @each $element in $list {
    @include meta.apply($mixin, $element);
  }
}

@mixin font-class($size) {
  .font-#{$size} {
    font-size: $size;
  }
}

$sizes: [8px, 12px, 2rem];

@include apply-to-all(meta.get-mixin("font-class"), $sizes);
```

编译成 css 后：

```css
.font-8px {
  font-size: 8px;
}

.font-12px {
  font-size: 12px;
}

.font-2rem {
  font-size: 2rem;
}
```

```scss
meta.load-css($url, $with: null)
```

根据 `$url` 加载模块并包含其 CSS，就像它是作为此 mixin 的内容编写的一样。`$with` 参数为模块提供配置；如果传递了该参数，它必须是从变量名称（不带 `$`）到要在加载的模块中使用的这些变量的值的映射 。

类似 `@use` 规则的地方：

- 这将仅评估给定的模块一次，即使它以不同的方式加载多次。
- 这无法为已经加载的模块提供配置，无论该模块是否已经加载配置。

不像 `@use` 规则的地方：

- 这不会使已加载模块的任何成员在当前模块中可用。
- 它可以在样式表的任何地方使用。它甚至可以嵌套在样式规则中以创建嵌套样式！
- 加载模块的 `URL` 可以来自变量并包含插值。

:::danger 注意！
`$url` 参数应该是一个包含 URL 的字符串，就像你传递给 `@use` 规则那样。它不应该是一个 CSS url()。
:::

```scss
// dark-theme/_code.scss
$border-contrast: false !default;

code {
  background-color: #6b717f;
  color: #d2e1dd;
  @if $border-contrast {
    border-color: #dadbdf;
  }
}

// style.scss
@use "sass:meta";

body.dark {
  @include meta.load-css("dark-theme/code", $with: ("border-contrast": true));
}
```

编译为 css 后：

```css
body.dark code {
  background-color: #6b717f;
  color: #d2e1dd;
  border-color: #dadbdf;
}
```

## 函数

```scss
meta.accepts-content($mixin) //=> boolean
```

该函数返回 `$mixin` 是否可以接受 `@content` 块作为参数。

```scss
meta.calc-args($calc) //=> list
```

该函数返回所给计算 `$calc` 所接受的参数。

如果参数是数字或嵌套计算，则返回该类型。否则，返回不带引号的字符串。

```scss
@use "sass:meta";

@debug meta.calc-args(calc(100px + 10%)); // unquote("100px + 10%")
@debug meta.calc-args(
  clamp(50px, var(--width), 1000px)
); // 50px, unquote("var(--width)"), 1000px
```

```scss
meta.calc-name($calc) //=> quoted string
```

返回给定计算的名称。

```scss
@use "sass:meta";

@debug meta.calc-name(calc(100px + 10%)); // "calc"
@debug meta.calc-name(clamp(50px, var(--width), 1000px)); // "clamp"
```

```scss
meta.call($function, $args...)
calc($function, $args...)
```

使用参数 `$args` 调用 `$function` 并返回结果。

`$function` 必须是一个函数值，例如 `meta.get-function()` 返回的值。

```scss
@use "sass:list";
@use "sass:meta";
@use "sass:string";

/// Return a copy of $list with all elements for which $condition returns `true`
/// removed.
@function remove-where($list, $condition) {
  $new-list: ();
  $separator: list.separator($list);
  @each $element in $list {
    @if not meta.call($condition, $element) {
      $new-list: list.append($new-list, $element, $separator: $separator);
    }
  }
  @return $new-list;
}

$fonts: Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;

.content {
  @function contains-helvetica($string) {
    @return string.index($string, "Helvetica");
  }
  font-family: remove-where($fonts, meta.get-function("contains-helvetica"));
}
```

编译为 css 后：

```css
.content {
  font-family: Tahoma, Geneva, Arial, sans-serif;
}
```

```scss
meta.content-exists()
content-exists() //=> boolean
```

返回当前 mixin 是否传递了一个 `@content` 块。

如果在 mixin 之外调用则会引发错误。

```scss
@use "sass:meta";

@mixin debug-content-exists {
  @debug meta.content-exists();
  @content;
}

@include debug-content-exists; // false
@include debug-content-exists {
  // true
  // Content!
}
```

```scss
meta.feature-exists($feature)
feature-exists($feature) //=> boolean
```

返回当前 Sass 实现是否支持 `$feature` 功能。

必须 `$feature` 是字符串。当前可识别的关键字有：

- `global-variable-shadowing`，这意味着除非具有 `!global` 标志，否则局部变量将覆盖全局变量。
- `extend-selector-pseudoclass`，这意味着 `@extend` 规则将影响嵌套在伪类中的选择器，例如 `:not()`。
- `units-level3`，这意味着单位运算支持在 CSS 值和单位级别 3 中定义的单位。
- `at-error`，表示支持该 `@error` 规则 。
- `custom-property`，这意味着自定义属性声明值不支持除插值之外的任何表达式。

任何无法识别的 `$feature` 返回 `false` 。

```scss
@use "sass:meta";

@debug meta.feature-exists("at-error"); // true
@debug meta.feature-exists("unrecognized"); // false
```

```scss
meta.function-exists($name, $module: null)
function-exists($name) //=> boolean
```

返回名为 `$name` 的函数是否定义了，包括内置模块和用户定义的函数。

如果 `$module` 参数传递了，这还会检查函数定义命名为 `$module` 的模块。`$module` 必须是匹配当前文件中 `@use` 规则的命名空间的字符串。

```scss
@use "sass:meta";
@use "sass:math";

@debug meta.function-exists("div", "math"); // true
@debug meta.function-exists("scale-color"); // true
@debug meta.function-exists("add"); // false

@function add($num1, $num2) {
  @return $num1 + $num2;
}
@debug meta.function-exists("add"); // true
```

```scss
meta.get-function($name, $css: false, $module: null)
get-function($name, $css: false, $module: null) //=> function
```

返回名为 `$name` 的函数值。

如果 `$module` 是 `null`，则返回没有命名空间的 `$name` 函数（包括全局内置函数）。否则，`$module` 必须是与当前文件中 `@use` 规则的命名空间匹配的字符串，在这种情况下，这将返回该模块中名为 `$name` 的函数。

默认情况下，如果 `$name` 不是引用 Sass 函数，则会抛出错误。但是，如果 `$css` 是 `true`，它会返回一个原生的 CSS 函数。

可以使用 `meta.apply()` 来 include 返回的 mixin。

```scss
@use "sass:list";
@use "sass:meta";
@use "sass:string";

/// Return a copy of $list with all elements for which $condition returns `true`
/// removed.
@function remove-where($list, $condition) {
  $new-list: ();
  $separator: list.separator($list);
  @each $element in $list {
    @if not meta.call($condition, $element) {
      $new-list: list.append($new-list, $element, $separator: $separator);
    }
  }
  @return $new-list;
}

$fonts: Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;

.content {
  @function contains-helvetica($string) {
    @return string.index($string, "Helvetica");
  }
  font-family: remove-where($fonts, meta.get-function("contains-helvetica"));
}
```

编译为 css 后：

```css
.content {
  font-family: Tahoma, Geneva, Arial, sans-serif;
}
```

```scss
meta.get-mixin($name, $module: null) //=> function
```

返回名为 `$name` 的 mixin 值。

如果 `$module` 是 `null`，则返回当前模块名为 `$name` mixin。否则，`$module` 必须是与当前文件中 `@use` 规则的命名空间匹配的字符串，在这种情况下，这将返回该模块中名为 `$name` 的 mixin。

默认情况下，如果 `$name` 不是引用 Sass mixin，则会抛出错误。但是，如果 `$css` 是 `true`，它会返回一个原生的 CSS 函数。

可以使用 `meta.call()` 来调用返回的函数。

```scss
@use "sass:meta";
@use "sass:string";

/// Passes each element of $list to a separate invocation of $mixin.
@mixin apply-to-all($mixin, $list) {
  @each $element in $list {
    @include meta.apply($mixin, $element);
  }
}

@mixin font-class($size) {
  .font-#{$size} {
    font-size: $size;
  }
}

$sizes: [8px, 12px, 2rem];

@include apply-to-all(meta.get-mixin("font-class"), $sizes);
```

编译为 css 后：

```css
.font-8px {
  font-size: 8px;
}

.font-12px {
  font-size: 12px;
}

.font-2rem {
  font-size: 2rem;
}
```

```scss
meta.global-variable-exists($name, $module: null)
global-variable-exists($name, $module: null) //=> boolean
```

返回名为 `$name` 的全局变量是否存在。

如果 `$module` 为 `null`，则返回是否存在 `$name` 没有命名空间的变量。否则，`$module` 必须是与当前文件中 `@use` 规则的命名空间匹配的字符串，在这种情况下，返回该模块是否有名为 `$name` 的变量。

也可以看看 `meta.variable-exists()`。

```scss
@use "sass:meta";

@debug meta.global-variable-exists("var1"); // false

$var1: value;
@debug meta.global-variable-exists("var1"); // true

h1 {
  // $var2 is local.
  $var2: value;
  @debug meta.global-variable-exists("var2"); // false
}
```

```scss
meta.inspect($value)
inspect($value) //=> unquoted string
```

返回 `$value` 的字符串表示形式。

返回任何 Sass 值的表示形式，而不仅仅是那些可以用 CSS 表示的值。因此，其返回值不能保证是有效的 CSS。

:::danger 注意！
此功能用于调试；其输出格式不能保证在各个 Sass 版本或实现中保持一致。
:::

```scss
@use "sass:meta";

@debug meta.inspect(10px 20px 30px); // unquote("10px 20px 30px")
@debug meta.inspect(
  (
    "width": 200px,
  )
); // unquote('("width": 200px)')
@debug meta.inspect(null); // unquote("null")
@debug meta.inspect("Helvetica"); // unquote('"Helvetica"')
```

```scss
meta.keywords($args)
keywords($args) //=> map
```

返回传递给 mixin 或 function 接受任意参数的函数的关键字。`$args` 参数必须是参数列表。

关键字作为从参数名称（未加引号的字符串，不包括 `$`）到这些参数的值的映射返回。

```scss
@use "sass:meta";

@mixin syntax-colors($args...) {
  @debug meta.keywords($args);
  // (string: #080, comment: #800, variable: #60b)

  @each $name, $color in meta.keywords($args) {
    pre span.stx-#{$name} {
      color: $color;
    }
  }
}

@include syntax-colors($string: #080, $comment: #800, $variable: #60b);
```

编译为 css 后：

```css
pre span.stx-string {
  color: #080;
}

pre span.stx-comment {
  color: #800;
}

pre span.stx-variable {
  color: #60b;
}
```

```scss
meta.mixin-exists($name, $module: null)
mixin-exists($name, $module: null) //=> boolean
```

返回名为 `$name` 的 mixin 是否存在。

如果 `$module` 为 `null`，则返回是否存在 `$name` 没有命名空间的 mixin。否则，`$module` 必须是与当前文件中 `@use` 规则的命名空间匹配的字符串，在这种情况下，返回该模块是否有名为 `$name` 的 mixin。

```scss
@use "sass:meta";

@debug meta.mixin-exists("shadow-none"); // false

@mixin shadow-none {
  box-shadow: none;
}

@debug meta.mixin-exists("shadow-none"); // true
```

```scss
meta.module-functions($module) //=> map
```

返回模块中定义的所有函数，作为从函数名称到函数值的映射。

该 `$module` 参数必须是与当前文件中 `@use` 规则的命名空间匹配的字符串。

```scss
// _functions.scss
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}
```

```scss
@use "sass:map";
@use "sass:meta";

@use "functions";

@debug meta.module-functions("functions"); // ("pow": get-function("pow"))

@debug meta.call(
  map.get(meta.module-functions("functions"), "pow"),
  3,
  4
); // 81
```

```scss
meta.module-mixins($module) //=> map
```

返回模块中定义的所有 mixin，作为从 mixin 名称到 mixin 值的映射。

该 `$module` 参数必须是与当前文件中 `@use` 规则的命名空间匹配的字符串。

```scss
// _mixins.scss
@mixin stretch() {
  align-items: stretch;
  display: flex;
  flex-direction: row;
}
```

```scss
@use "sass:map";
@use "sass:meta";

@use "mixins";

@debug meta.module-mixins("mixins"); // => ("stretch": get-mixin("stretch"))

.header {
  @include meta.apply(map.get(meta.module-mixins("mixins"), "stretch"));
}
```

```scss
meta.module-variables($module) //=> map
```

和上面两个函数同理。

```scss
// _variables.scss
$hopbush: #c69;
$midnight-blue: #036;
$wafer: #e1d7d2;
```

```scss
@use "sass:meta";

@use "variables";

@debug meta.module-variables("variables");
// (
//   "hopbush": #c69,
//   "midnight-blue": #036,
//   "wafer": #e1d7d2
// )
```

```scss
meta.type-of($value)
type-of($value) //=> unquoted string
```

返回 `$value` 的类型。

可以是以下值：

- number
- string
- color
- list
- map
- calculation
- bool
- null
- function
- arglist

```scss
@use "sass:meta";

@debug meta.type-of(10px); // number
@debug meta.type-of(10px 20px 30px); // list
@debug meta.type-of(()); // list
```

返回变量名为 `$name` 是否存在在当前作用域。

```scss
@use "sass:meta";

@debug meta.variable-exists("var1"); // false

$var1: value;
@debug meta.variable-exists("var1"); // true

h1 {
  // $var2 is local.
  $var2: value;
  @debug meta.variable-exists("var2"); // true
}
```
