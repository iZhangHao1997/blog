# Sass @use

`@use` 用来从其他 Sass 样式表中加载 mixins、函数和变量，并且将其他样式表的 CSS 相结合。被 `@use` 加载的样式表被称为 “模块”。Sass 还提供了充满了实用功能的[内置模块](../modules/)。

最简单的 `@use` 规则是 `@use "<url>"`，将加载被给定 url 的模块。不论样式被加载多少次，只会被编译一次输出为 CSS。

::: danger 注意！
样式表的 `@use` 规则必须位于除 `@forward` 之外的任何规则之前，包括样式规则。但是，你可以在配置模块 `@use` 时使用的规则之前声明变量。
:::

如 scss 代码：

```scss
// foundation/_code.scss
code {
  padding: 0.25em;
  line-height: 0;
}
```

```scss
// foundation/_lists.scss
ul,
ol {
  text-align: left;

  & & {
    padding: {
      bottom: 0;
      left: 0;
    }
  }
}
```

```scss
// style.scss
@use "foundation/code";
@use "foundation/lists";
```

在 style.scss 编译生成的 css 代码为：

```css
code {
  padding: 0.25em;
  line-height: 0;
}

ul,
ol {
  text-align: left;
}
ul ul,
ol ol {
  padding-bottom: 0;
  padding-left: 0;
}
```

## 加载成员

### 概览

你可以通过写 `<namespace>.<variable>`、`<namespace>.<function>()` 或者 `<namespace>.<mixin>()` 来访问其他模块的变量、函数和 mixins。默认情况下，`namespace` 是模块 url 的最后一个组成部分。

被使用 `@use` 加载的成员（variables、functions 和 mixins）仅在加载它们的样式表可见。其他样式表需要写它们的 `@use` 规则如果也想访问成员。这使想搞清楚每个成员来自哪里更加容易。如果你想一次性从很多文件中加载很多成员，你可以使用 `@forward` 规则来转发他们全部从一个共享的文件。

:::info 有趣的事实：
因为 `@use` 规则对于成员的名称都添加了命名空间，所以在样式表里选择一个简单的变量名也是安全的，比如 `$radius`、`$width`。这是和旧的 [@import](./import.md) 规则不同的，@import 规则为了避免和其他库冲突，鼓励用户使用长命名比如 `$mat-corner-radius`，使用 `@use` 将让你的样式表更加清晰和易读。
:::

如如下 scss 代码：

```scss
// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}
```

```scss
// style.scss
@use "src/corners";

.button {
  @include corners.rounded;
  padding: 5px + corners.$radius;
}
```

生成的 css 代码：

```css
.button {
  border-radius: 3px;
  padding: 8px;
}
```

### 选择命名空间

默认情况下，模块的命名空间只是其 URL 的最后一个组成部分并且去掉文件扩展名。然而，有时你可能想要选择一个不同的命名空间——你可能想要为您经常引用的模块使用一个较短的名称，或者你可能正在加载具有相同文件名的多个模块。您可以通过编 `@use "<url>" as <namespace>` 写来做到这一点。

示例 scss 代码：

```scss
// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}
```

```scss
// style.scss
@use "src/corners" as c;

.button {
  @include c.rounded;
  padding: 5px + c.$radius;
}
```

在 style.scss 生成的 css 代码：

```css
.button {
  border-radius: 3px;
  padding: 8px;
}
```

你甚至可以不使用命名空间通过写 `@use "<url>" as *`。我们推荐你只有在你自己编写的样式表这么写，否则，可能会导致命名冲突。

不使用命名空间的写法：

```scss
// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}
```

```scss
// style.scss
@use "src/corners" as *;

.button {
  @include rounded;
  padding: 5px + $radius;
}
```

### 私有成员

作为样式表作者，糯米可能不希望你定义的所有成员都可以在样式表之外使用。Sass 通过以 `-` 或 `_` 开头的名称使定义私有成员变得容易。这些成员将在定义它们的样式表中正常工作，但它们不会成为模块公共 API 的一部分。这意味着加载模块的样式表看不到它们！

:::info 有趣的事实：
如果你想使一个成员对整个包（package）而不是仅仅一个文件隐藏，只是不要从你的包的任何入口点转发它的模块（你告诉你的用户加载的样式表来使用你的包）。您甚至可以在转发其模块的其余部分时隐藏该成员！
:::

私有成员 scss 示例：

```scss
// src/_corners.scss
$-radius: 3px;

@mixin rounded {
  border-radius: $-radius;
}
```

```scss
// style.scss
@use "src/corners";

.button {
  @include corners.rounded;

  // 这将会报错，因为 $-radius 并不是可见的
  padding: 5px + corners.$-radius;
}
```

## 配置

### 概览

样式表可以使用 `!default` 标志符定义变量使这些变量是可配置的。如果要使用配置加载一个模块，语法为 `@use <url> with (<variable>: <value>, <variable>: <value>)`。配置值将会覆盖模块的默认值。

示例 scss 代码：

```scss
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```

```scss
// style.scss
@use "library" with (
  $black: #222,
  $border-radius: 0.1rem
);
```

对应在 style.scss 最后编译生成的 css 代码：

```css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(34, 34, 34, 0.15);
}
```

### 使用 mixins

使用 `@use ... with` 来配置模块非常方便，尤其是对比在使用最初使用 `@import` 规则而编写的库时。但它不是特别灵活，我们不建议将它用于更高级的用例。如果你发现自己想要一次配置多个变量，将映射作为配置传递，或者在加载模块后更新配置，请考虑编写一个 mixin 来设置您的变量，另一个 mixin 来注入您的样式。

示例 scss 代码：

```scss
// _library.scss
$-black: #000;
$-border-radius: 0.25rem;
$-box-shadow: null;

/// 如果用户配置了 `$-box-shadow` 变量，将返回配置值
/// 否则返回源自 `$-black` 变量的值.
@function -box-shadow() {
  @return $-box-shadow or (0 0.5rem 1rem rgba($-black, 0.15));
}

@mixin configure($black: null, $border-radius: null, $box-shadow: null) {
  @if $black {
    $-black: $black !global;
  }
  @if $border-radius {
    $-border-radius: $border-radius !global;
  }
  @if $box-shadow {
    $-box-shadow: $box-shadow !global;
  }
}

@mixin styles {
  code {
    border-radius: $-border-radius;
    box-shadow: -box-shadow();
  }
}
```

```scss
// style.scss
@use "library";

@include library.configure($black: #222, $border-radius: 0.1rem);

@include library.styles;
```

对应 style.scss 生成的 css 代码：

```css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(34, 34, 34, 0.15);
}
```

### 重新赋值变量

在加载一个模块之后，你可以重新赋值它的变量。

例如：

```scss
// _library.scss
$color: red;
```

```scss
// _override.scss
@use "library";
library.$color: blue;
```

```scss
// style.scss
@use "library";
@use "override";
@debug library.$color; //=> blue
```

如果您使用 `as *` 导入没有命名空间的模块，这甚至也可以工作。分配给该模块中定义的变量名将覆盖其在该模块中的值。

:::danger 注意！
内置模块变量（例如 math.$pi）不能被重新赋值。
:::

## 查找模块

### 概览

当加载的每个样式表都写出绝对路径不会有任何乐趣，因此 Sass 用于查找模块的算法使它更容易一些。对于初学者，你不必明确写出要加载的文件的扩展名；`@use "variables"` 将自动加载 variables.scss, variables.sass, 或 variables.css.

:::danger 注意！
为了确保样式表在每个操作系统都能正常工作，Sass 使用 url 而不是文件路径加载文件。这意味着你需要使用正斜杠（forward shashes），而不是反斜杠（backslashes），即使在 Windows 上也是如此。
:::

### 加载路径

所有 Sass 实现都允许用户提供加载路径：Sass 在定位模块时将查找的文件系统路径。例如，如果你传递 node_modules/susy/sass 作为加载路径，则可以使用 `@use "susy"` 加载 `node_modules/susy/sass/susy.scss`.

不过，模块将始终相对于当前文件先加载。只有在不存在相对路径匹配的文件时才会使用加载路径。这确保你在添加新库时不会意外地弄乱你的相关导入。

:::info 有趣的事实：
与其他一些语言不同，Sass 不要求你使用 `./` 相对导入。相对导入始终可用。
:::

### 偏音（Partials 直译，没理解这里要怎么翻译）

按照惯例， 以 `_` 开头的 Sass 文件仅作为模块加载而不是自行编译的文件（如*code.scss）。这些称为 `partials`，它们告诉 Sass 工具不要尝试自己编译这些文件。您可以在导入 partial 时省略 `*`。

### index 文件

当你在目录中编写 `_index.scss` 或者 `_index.sass`，index 文件会自动被加载当你加载目录 url，例如：

```scss
// foundation/_code.scss
code {
  padding: 0.25em;
  line-height: 0;
}
```

```scss
// foundation/_lists.scss
ul,
ol {
  text-align: left;

  & & {
    padding: {
      bottom: 0;
      left: 0;
    }
  }
}
```

```scss
// foundation/_index.scss
@use "code";
@use "lists";
```

```scss
// style.scss
@use "foundation";
```

那么在 style.scss 中生成的 css 代码为：

```css
code {
  padding: 0.25em;
  line-height: 0;
}

ul,
ol {
  text-align: left;
}
ul ul,
ol ol {
  padding-bottom: 0;
  padding-left: 0;
}
```

## 加载 CSS

除了加载 .scss 和 .sass 文件，Sass 也可以加载原生的 .css 文件，例如：

```css
/* code.css */
code {
  padding: 0.25em;
  line-height: 0;
}
```

```scss
// style.scss
@use "code";
```

那么在 style.scss 文件中对应的 css 代码为：

```css
code {
  padding: 0.25em;
  line-height: 0;
}
```

作为模块加载的 CSS 文件不允许任何特殊的 Sass 功能，因此不能暴露任何 Sass 变量、函数或 mixins。为了确保作者不会不小心在他们的 CSS 中编写 Sass ，所有不是有效 CSS 的 Sass 特性都会产生错误。否则，CSS 将按原样呈现。它甚至可以被 [entended](./extend.md)！

## 与 @import 的差异

`@use` 规则旨在取代旧的 `@import` 规则，但是它被有意设计成不同的工作方式。这里是它们之间主要的不同点：

- `@use` 只让变量、函数和 mixins 在当前文件作用域可用。`@use` 不会将它们添加到全局作用域。这可以很容易地找出您的 Sass 文件引用的每个名称的来源，并且意味着你可以使用较短的名称而没有任何冲突风险。
- `@use` 永远只加载每个文件一次。这确保了你不会偶然的多次加载 css 依赖。
- `@use` 必须出现在你文件的开头，并且不能签套在样式规则里。
- 每个 `@use` 只能有一个 URL。
- `@use` 需要引号在 URL 两边，即使在使用缩进语法。
