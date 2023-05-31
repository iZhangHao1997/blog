# Sass @forward

`@forward` 用来加载样式表，使被加载样式表的 mixins、函数和变量是可用的，当你的样式表被使用 `@use` 规则加载。它使得跨多个文件组织 Sass 库成为可能，同时允许用户加载单个入口点文件。

这个规则的语法是 `@forward "<url>"`。它加载被给定 URL 的模块，和 `@use` 一样，但是它使被加载模块的公开的成员是可以获取的，就像直接在这个模块里被定义的一样。但是这些成员是不可以获取的在当前模块中，如果想使用 `@forard` 加载的模块成员，还是需要使用 `@use` 规则。别担心，同时使用 `@forward` 和 `@use` 也只会引入模块一次。

如果你确实需要同时使用 `@use` 和 `@forward` 在同一个文件的相同模块里，请把 `@forward` 写在前面。那样的话，如果你的用户想要配置 `@forward` 的转发模块，配置项将会被应用到转发模块里，在你使用 `@use` 不带配置项加载它之前。

:::info 有趣的事实：
该 `@forward` 规则的作用就像 `@use` 涉及到模块的 CSS 时一样。来自转发模块的样式将包含在编译的 CSS 输出中，并且带有的模块 `@forward` 可以扩展它，即使它不是 `@used`。
:::

`@forward` 代码例子：

```scss
// src/_list.scss
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

```scss
// bootstrap.scss
@forward "src/list";
```

```scss
// styles.scss
@use "bootstrap";

li {
  @include bootstrap.list-reset;
}
```

在 style.scss 中 CSS 代码：

```css
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

## 添加前缀

因为模块成员通常与命名空间一起使用，所以简短的名称通常是最易读的选项。但是这些名称在它们定义的模块之外可能没有意义，因此 `@forward` 可以选择为它转发的所有成员添加一个额外的前缀。

添加前缀的语法：`@forward "<url>" as <prefix>-*`，它将给定前缀添加到转发模块的每个 mixin、function 和 variable 前面。例如，如果一个模块里定义了一个成员名叫 `reset`，并且它被以 `as list-*` 转发，下流样式表将会以 `list-reset` 引用它。示例代码如下：

```scss
// src/_list.scss
@mixin reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

```scss
// bootstrap.scss
@forward "src/list" as list-*;
```

```scss
// styles.scss
@use "bootstrap";

li {
  @include bootstrap.list-reset;
}
```

在 style.scss 对应的 CSS 代码如下：

```css
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

## 控制可见性

有时你不想转发模块里的每个成员。你可能想让一些成员保持私有，以便只有你的包可以使用它们，或者你可能想让你的用户使用不同的方式加载那些成员。你可以使用 `@forward "<url>" hide <mumber1>, <mumber2>` 或者 `@forward "<url>" show <mumber1>, <mumber2>` 精确地控制你想转发的成员。

`hide` 形式意味着不想被转发的成员列表，列表之外的所有成员都应该被转发。`show` 形式意味着只有被列出名字的成员应该被转发。在两种形式，你应该是列出 mixins、functions 或者比 variables（包括 `$` 符号）的名称，如下 scss 代码：

```scss
// src/_list.scss
$horizontal-list-gap: 2em;

@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin list-horizontal {
  @include list-reset;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: $horizontal-list-gap;
    }
  }
}
```

```scss
// bootstrap.scss
@forward "src/list" hide list-reset, $horizontal-list-gap;
```

## 配置模块

兼容性：

- Dart Sass：since 1.24.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

`@forward` 规则同样可以通过配置项加载模块。大部分工作原理和 `@use` 一样，有一点不同：`@forward` 规则配置项可以使用 `!default` 标志符。这允许模块更改上游样式表的默认值，同时仍然允许下游样式表覆盖它们，如示例代码：

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
// _opinionated.scss
@forward "library" with (
  $black: #222 !default,
  $border-radius: 0.1rem !default
);
```

```scss
// style.scss
@use "opinionated" with (
  $black: #333
);
```

那么在 style.scss 中对应的 css 代码如下：

```css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(51, 51, 51, 0.15);
}
```
