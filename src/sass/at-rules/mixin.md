# Sass @mixin 和 @include

Mixins 允许你定义可以在样式表中重复使用的样式。这可以很轻松的避免使用非语义类例如 `.float-left`，并且可以在库中分发样式集合。

Mixins 的定义语法为：`@mixin <name> { ... }` 或者 `@mixin <name>(<arguments...>) { ... }`。Mixin 的名称可以是任何 Sass 标志符，并且他可以包含除顶层语句之外的任何表达式。它们可用于封装可放入单个样式规则中的样式；它们可以包含自己的样式规则，这些规则可以嵌套在其他规则中或包含在样式表的顶层；或者它们只能用于修改变量。

Mixins 可以使用 @include 引入，语法为 `@include <name>` 或者 `@include <name>(<arguments...>)`。如下代码：

:::code-group

```scss
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin horizontal-list {
  @include reset-list;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: 2em;
    }
  }
}

nav ul {
  @include horizontal-list;
}
```

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul li {
  display: inline-block;
  margin: {
    left: -2px;
    right: 2em;
  }
}
```

:::

:::info 有趣的事实：
Sass 变量和所有 Sass 标志符一样，将连字符和下划线视为相同。这意味着 `reset-list` 和 `reset_list` 都指向相同的 mixin。这是 Sass 早期的历史遗留问题，当时 Sass 只允许在标志符名称中使用下划线。一旦 Sass 新增了连字符以匹配 CSS 语法的支持，这两者就等同了来使迁移更加容易。
:::

## 参数

Mixin 可以携带参数，这允许他们每次调用的时候都有自定义行为。在 @mixin 规则中，参数被指定在 mixin 名称的后面，用圆括号包围的一个列表。mixins 必须在被 include 的时候提供相同数量的给定参数。这些表达式的值在 mixin 的主体中作为相应的变量可用。

:::code-group

```scss
@mixin rtl($property, $ltr-value, $rtl-value) {
  #{$property}: $ltr-value;

  [dir="rtl"] & {
    #{$property}: $rtl-value;
  }
}

.sidebar {
  @include rtl(float, left, right);
}
```

```css
.sidebar {
  float: left;
}
[dir="rtl"] .sidebar {
  float: right;
}
```

:::

### 可选参数

通常 mixin 中声明的每个参数都必须有传值当被 include 的时候。然后你可以通过定义一个默认值生成一个可选参数，如果用户没有传参，默认值将被使用。默认值使用和变量声明一样的语法：一个变量名，后面一个冒号和 SassScript 表达式。这使定义可扩展的 mixin API 非常简单。示例代码如下：

:::code-group

```scss
@mixin replace-text($image, $x: 50%, $y: 50%) {
  text-indent: -99999em;
  overflow: hidden;
  text-align: left;

  background: {
    image: $image;
    repeat: no-repeat;
    position: $x $y;
  }
}

.mail-icon {
  @include replace-text(url("/images/mail.svg"), 0);
}
```

```css
.mail-icon {
  text-indent: -99999em;
  overflow: hidden;
  text-align: left;
  background-image: url("/images/mail.svg");
  background-repeat: no-repeat;
  background-position: 0 50%;
}
```

:::

:::info 有趣的事实：
默认值可以是任何 Sass 表达式，并且可以引用更早的参数。
:::

### 关键字参数

当 mixin 被 include 时，参数在按参数列表传递的同时还可以按变量名称传参（变量名参数必须在参数列表(positional arguments)后面）。这对有可选参数或者意义不明显布尔类型参数时特别有用。关键字参数和变量声明与可选参数的语法一样。如下代码示例：

:::code-group

```scss
@mixin square($size, $color: red, $radius: 0) {
  width: $size;
  height: $size;
  background-color: $color;

  @if $radius != 0 {
    border-radius: $radius;
  }
}

.avatar {
  @include square(100px, $radius: 4px, $color: black);
}
```

```css
.avatar {
  width: 100px;
  height: 100px;
  background-color: black;
  border-radius: 4px;
}
```

:::
:::danger 注意！
因为任何参数都可以通过名称传递，所以在重命名 mixin 的参数名称时要特别小心...这可能会使你的用户崩溃。将旧名称的参数作为可选参数并保持一段时间，如果有人传递旧名称，打印一个警告告知用户，让他们知道要迁移到新参数。
:::

### 任意数量参数

如果一个 mixin 可以传递任何数量的参数也是有用的。如果 @mixin 的最后一个参数声明以 `...` 结尾，那么使用这个 mixin 时所有的额外参数都会作为一个 list 传递给最后一个参数。这就是一个参数 list。如以下代码：

:::code-group

```scss
@mixin order($height, $selectors...) {
  @for $i from 0 to length($selectors) {
    #{nth($selectors, $i + 1)} {
      position: absolute;
      height: $height;
      margin-top: $i * $height;
    }
  }
}

@include order(150px, "input.name", "input.address", "input.zip");
```

```css
input.name {
  position: absolute;
  height: 150px;
  margin-top: 0px;
}

input.address {
  position: absolute;
  height: 150px;
  margin-top: 150px;
}

input.zip {
  position: absolute;
  height: 150px;
  margin-top: 300px;
}
```

:::

### 采用任意关键字参数

参数列表也可以用任意关键字参数。`meta.keywords()` 函数传入一个参数列表然后返回作为从参数名称（不包括 `$`）到这些参数值的映射传递给混入的任何额外关键字。如代码：

:::code-group

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

:::

:::info 有趣的事实：
如果您从未将参数列表传递给函数 `meta.keywords()`，则该参数列表将不允许额外的关键字参数。这有助于你的 mixin 的调用者确保他们没有不小心拼错任何参数名称。
:::

### 传递任意参数

就像参数列表允许 mixin 接受任意位置或者关键字参数一样，相同的语法可用于将位置和关键字参数传递给 mixin。如果你 include 时最后一个参数用 `...` 传递一个列表，列表的元素将会被当做额外的位置参数。相似的，一个 map 映射后面如果跟着 `...`，会被当做额外的关键字参数。你可以一次性全部传递。如下 scss 代码：

```scss
$form-selectors: "input.name", "input.address", "input.zip" !default;

@include order(150px, $form-selectors...);
```

:::info 有趣的事实：
因为参数列表将会对位置参数和关键字参数都保持追踪，所以你可以一次性将参数传递给另一个 mixin。这使 mixin 定义一个别名非常容易。以下是使用参数列表追踪的代码例子：

```scss
@mixin btn($args...) {
  @warn "The btn() mixin is deprecated. Include button() instead.";
  @include button($args...);
}
```

:::

## 内容块 Content Block

除了接受参数之外，mixin 还可以接受整个样式块，称为内容块。mixin 可以在它内容内使用 `@content` 来接受 include 时所接受的内容块。内容块传递的时候以花括号的形式，和其他 Sass 里的块内容一样，在使用 `@content` 规则的地方被注入。例如：

:::code-group

```scss
@mixin hover {
  &:not([disabled]):hover {
    @content;
  }
}

.button {
  border: 1px solid black;
  @include hover {
    border-width: 2px;
  }
}
```

```css
.button {
  border: 1px solid black;
}

.button:not([disabled]):hover {
  border-width: 2px;
}
```

:::

:::info 有趣的事实：
一个 mixin 可以 include 多个 @content。如果使用了多个 @content，内容块将会被分别 included 在每个使用 @content 的地方。
:::

:::danger 注意！
内容块是词法作用域（lexically scoped）的，这意味着内容块也可以访问 mixin 被 included 所在作用域内的局部变量。它看不到任何在它传递给的 mixin 中定义的变量，即使它们是在调用内容块之前定义的。
:::

### 传递参数给内容块

兼容性：

- Dart Sass：since 1.15.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

mixin 可以通过 `@content(<arguments...>)` 语法传递参数给内容块。用户编写的内容块可以通过 `@include <name> using (<arguments...>)` 语法接收参数。内容块的参数列表和 mixin 的参数列表工作原理相同。

:::danger 注意！
如果 mixin 传递参数给它的内容块，则该内容块必须声明它接受这些参数。这意味着只按位置（而不是按名称）传递参数是个好主意，这意味着传递更多参数是一项重大更改。

如果您想灵活地传递给内容块的信息，请考虑向它传递一个包含它可能需要的信息的映射 map！
:::

传递参数给内容块的 scss 例子：

:::code-group

```scss
@mixin media($types...) {
  @each $type in $types {
    @media #{$type} {
      @content ($type);
    }
  }
}

@include media(screen, print) using ($type) {
  h1 {
    font-size: 40px;
    @if $type == print {
      font-family: Calluna;
    }
  }
}
```

```css
@media screen {
  h1 {
    font-size: 40px;
  }
}

@media print {
  h1 {
    font-size: 40px;
    font-family: Calluna;
  }
}
```

:::

## 缩进 mixin 语法

缩进语法除了标准的 @mixin 和 @include 之外，对定义和使用 mixins 有特别的语法。使用符号 `=` 也可以定义 mixins，并且可以使用 `+` 来 include。尽管这是很简短的语法，但是很难通过瞥一眼就明白所表达的意思，所以 Sass 不鼓励用户去使用这种语法。这是一个使用的例子：

:::code-group

```sass
=reset-list
  margin: 0
  padding: 0
  list-style: none

=horizontal-list
  +reset-list

  li
    display: inline-block
    margin:
      left: -2px
      right: 2em

nav ul
  +horizontal-list
```

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul li {
  display: inline-block;
  margin-left: -2px;
  margin-right: 2em;
}
```

:::
