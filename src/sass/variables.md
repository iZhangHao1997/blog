# Sass 变量

Sass 变量是简单的：你可以赋值给一个 `$` 开头的名字，然后你可以引用该名称代替值本身。但是尽管他们简单，它们是 Sass 带来最有用的工具之一。变量使代码减少冗余、做复杂数学计算、配置库等很多事情。

一个变量声明看起来很像一个属性声明：写作 `<variable>: <expression>`。不像一个属性只能在样式规则或者@规则里声明，变量可以在任何你想要的地方声明。

比如代码：

:::code-group

```scss
$base-color: #c6538c;
$border-dark: rgba($base-color, 0.88);

.alert {
  border: 1px solid $border-dark;
}
```

```css
.alert {
  border: 1px solid rgba(198, 83, 140, 0.88);
}
```

:::

::: danger 注意！
CSS 有它自己的变量，CSS 变量和 Sass 变量完全不同。以下是不同点：

- Sass 变量全部由 Sass 编译。CSS 变量会包含在 CSS 输出中。
- CSS 变量对于不同的元素有不同的值，但是 Sass 变量在一次只有一个值
- Sass 变量是命令式的，这意味着如果你使用一个变量然后改变它的值，之前的使用将保持不变。Css 变量是声明式的，意味着如果你改变变量值，它会影响之前或者之后的使用。

比如代码：

:::code-group

```scss
$variable: value 1;
.rule-1 {
  value: $variable;
}

$variable: value 2;
.rule-2 {
  value: $variable;
}
```

```css
.rule-1 {
  value: value 1;
}

.rule-2 {
  value: value 2;
}
```

:::

::: info 有趣的事实：
Sass 变量和所有 Sass 标志符一样，将连字符和下划线视为相同。这意味着 `$font-size` 和 `$font_size` 都指向相同的变量。这是 Sass 早期的历史遗留问题，当时 Sass 只允许在标志符名称中使用下划线。一旦 Sass 新增了连字符以匹配 CSS 语法的支持，这两者就等同了来使迁移更加容易。
:::

## 默认值

通常当你给一个变量赋值时，如果变量已经有了一个值，变量的旧值将会被覆盖。但是如果你正在写一个 Sass 库，你可能希望允许你的用户在你使用它们生成 CSS 之前配置你的库的变量。

为了使这变为可能，Sass 提供了 `!default` 标志符。仅当该变量未定义或其值为 `null` 时，才将值分配给该变量。否则，将使用现有值。

### 配置模块

兼容性：

- Dart Sass：since 1.23.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

只有 Dart Sass 现在支持 `@use` 语法。其他用户请使用 `@import` 语法代替。

使用 `!default` 定义的变量可以被配置当使用 `@use` 规则加载模块时。Sass 库经常使用 `!default` 变量来允许他们的用户配置库的 CSS。

要加载带有配置的模块，使用 `@use <url> with (<variable>: <value>, <variable>: <value>)` 语法。配置值将会重写变量的默认值。只有写在样式表顶层带有 `!default` 标志符定义的变量可以被配置。

例如：

:::code-group

```scss [library.scss]
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```

```scss [style.scss]
@use "library" with (
  $black: #222,
  $border-radius: 0.1rem
);
```

```css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(#222, 0.15);
}
```

:::

## 内置模块

定义在[内置模块](./modules/)里的变量不能被修改。

```scss
@use "sass:math" as math;

// 这个赋值将会失败
math.$pi: 0;
```

## 作用域

定义在样式表顶层的变量是全聚德。这意味着他们在声明后再它们模块的任何地方被访问。但并非所有变量都如此。那些在块中声明的（ SCSS 中的大括号或 Sass 中的缩进代码）通常是局部变量，并且只能在它们被声明的块内访问。

例如 scss 代码：

:::code-group

```scss
$global-variable: global value;

.content {
  $local-variable: local value;
  global: $global-variable;
  local: $local-variable;
}

.sidebar {
  global: $global-variable;

  // 这将会失败，因为 $local-variable 不在这个作用域
  // local: $local-variable;
}
```

```css
.content {
  global: global value;
  local: local value;
}

.sidebar {
  global: global value;
}
```

:::

### 阴影（不知道翻译有无问题，原文：Shadowing）

局部变量甚至可以和全局变量使用相同的名字。如果这发生了，这实际上有两个不同的变量使用同一个名字：一个是局部的一个是全局的。这有助于确保编写局部变量的作者不会意外更改他们甚至不知道的全局变量的值。

:::code-group

```scss
$variable: global value;

.content {
  $variable: local value;
  value: $variable;
}

.sidebar {
  value: $variable;
}
```

```css
.content {
  value: local value;
}

.sidebar {
  value: global value;
}
```

:::

如果您需要在局部范围内（例如在 mixin 中）设置全局变量的值，则可以使用该 `!global` 标志符。带 `!global` 标记符的变量声明将始终分配给全局范围。

例如代码：

:::code-group

```scss
$variable: first global value;

.content {
  $variable: second global value !global;
  value: $variable;
}

.sidebar {
  value: $variable;
}
```

```css
.content {
  value: second global value;
}

.sidebar {
  value: second global value;
}
```

:::

::: danger 注意！
兼容性：

- Dart Sass：since 2.0.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

更老的 Sass 版本允许 `!global` 可以用在一个不存在的变量上。这个语法被放弃了为了每个样式表声明相同的变量，无论它如何被执行。（没看懂这个原文：This behavior was deprecated to make sure each stylesheet declares the same variables no matter how it’s executed.）

`!global` 标志符只能被用来设置已经在文件顶层声明的变量。它不允许被用来声明一个新的变量。
:::

### 控制流作用域

在流量控制规则中声明的变量有特殊的作用域规则：它们不会隐藏与流量控制规则相同级别的变量。相反，他们只是分配给那些变量。这使得条件性地为变量赋值或在循环中构建值变得更加容易。

比如 scss 代码如下：
:::code-group

```scss
$dark-theme: true !default;
$primary-color: #f8bbd0 !default;
$accent-color: #6a1b9a !default;

@if $dark-theme {
  $primary-color: darken($primary-color, 60%);
  $accent-color: lighten($accent-color, 60%);
}

.button {
  background-color: $primary-color;
  border: 1px solid $accent-color;
  border-radius: 3px;
}
```

```css
.button {
  background-color: #750c30;
  border: 1px solid #f5ebfc;
  border-radius: 3px;
}
```

:::

::: danger 注意！
控制流中的变量可以赋值给已经存在于外层作用域的变量，但在流程控制范围内声明的新变量将无法在外部范围内访问。确保变量在赋值之前已经声明，即使您需要将其声明为 `null`。
:::

## 高级变量函数

Sass 核心库提供了一些处理变量的高级函数。`meta.variable-exists()` 函数返回在当前作用域中，变量名称是否存在，然后 `meta.global-variable-exists()` 函数同样检测全局作用域是否存在变量。

::: danger 注意！
用户偶尔会希望使用插值来根据另一个变量定义一个变量名。Sass 不允许这样做，因为它让人更难一眼看出哪些变量定义在哪里。不过，您可以做的是定义一个从名称到值的映射，然后您可以使用变量访问该映射。

如代码：

:::code-group

```scss
@use "sass:map";

$theme-colors: (
  "success": #28a745,
  "info": #17a2b8,
  "warning": #ffc107,
);

.alert {
  // 如下代替 $theme-color-#{warning}
  background-color: map.get($theme-colors, "warning");
}
```

```css
.alert {
  background-color: #ffc107;
}
```

:::
