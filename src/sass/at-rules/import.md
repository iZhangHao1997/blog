# Sass @import

Sass 扩展了 CSS 的 [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) 规则可以引入 Sass 和 CSS 的样式表，提供对 [mixins](./mixin.md)、[functions](./function.md) 和 [variables](../variables.md) 的访问，并结合多个样式表的 CSS 样式。

不同于原生的 CSS imports，CSS 需要浏览器在呈现页面时发出多个 HTTP 请求，Sass 导入完全在编译期间处理。

Sass imports 和 CSS imports 的语法一样，除了它们允许用逗号分隔多个导入，而不是要求每个导入都有自己的 @import。此外，在缩进语法中，导入的 URL 不需要有引号。

:::danger 注意！
Sass 团队不鼓励继续使用 `@import` 规则。Sass 将会在未来几年逐步淘汰它，并且最后完全从 Sass 语言中移除它。请使用 [@use](./use.md) 规则代替它（注意只有 Dart Sass 暂时支持 @use。其他实践的用户必须使用 @import 规则代替）。

那么 @import 规则出现了哪些问题？以下是 @import 规则一些比较严重的问题：

- @import 使所有的 variables、mixins 和 functions 全局化。这使人（或者工具）很难分辨这使哪里定义的。
- 因为所有都是全局的，所以库都必须对所有成员添加前缀来避免命名冲突。
- [@extend rules](./extend.md) 也是全局的，这将更难预测哪些样式规则将会被 extended。
- 每个样式表被 @imported 的时候都会被执行并且发出对应的 CSS，这意味着将会增加编译时间和产生臃肿的输出。
- 同时也没办法定义私有成员或者占位符选择器，同时无法访问下游样式表（感觉这里没理解到什么意思，原文：There was no way to define private members or placeholder selectors that were inaccessible to downstream stylesheets。）

新的模块系统和 @use 规则可以解决以上的问题。

如何迁移？Sass 官方写了一个 [迁移工具](https://sass-lang.com/documentation/cli/migrator) 可以在瞬间自动将大多数基于 @import 的代码转换为基于 @use 的代码。只需将它指向你的入口点并让它运行！
:::

@import 示例代码如下：

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
@import "foundation/code", "foundation/lists";
```

对应 style.scss 文件生成 CSS 代码：

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

当 Sass import 一个文件，该文件被评估（evaluted）为好像它的内容直接出现在 @import 地方。导入文件中的任何 mixins、functions 和 variables 都可用，并且它的所有 CSS 都包含在编写的确切 @import 位置。更重要的是，@import 之前定义的任何 mixins、functions 或 variables （包括来自其他 @imports 的）都可以在导入的样式表中使用。

:::danger 注意！
如果同一个样式表被 imported 超过一次，它每次都会被重复评估（evaluated）。如果样式表只是定义 functions 或者 mixins，那么这通常不是大问题，但是如果它包含样式规则，将会被多次编译为 CSS。
:::

## 查找文件

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

按照惯例， 以 `_` 开头的 Sass 文件仅作为模块加载而不是自行编译的文件（如*code.scss）。这些称为 `partials`，它们告诉 Sass 工具不要尝试自己编译这些文件。你可以在导入 partial 时省略 `*`。

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

### 自定义 importers

所有 Sass 实现都提供了一种定义自定义导入器的方法，它控制 `@import` 如何定位样式表：

- npm 上的 [Node Sass](https://www.npmjs.com/package/node-sass) 和 [Dart Sass](https://www.npmjs.com/package/sass) 提供了一个 [importer 选项](https://github.com/sass/node-sass#importer--v200---experimental) 作为其 JS API 的一部分。
- Pub 上的 [Dart Sass](https://pub.dartlang.org/packages/sass) 提供了一个抽象 [Importer 类](https://pub.dartlang.org/documentation/sass/latest/sass/Importer-class.html)，可以由自定义导入器扩展。
- [Ruby Sass](https://sass-lang.com/ruby-sass) 提供了一个可以由自定义导入器扩展的抽象 [Importers::Base 类](https://www.rubydoc.info/gems/sass/Sass/Importers/Base)。

## 嵌套

导入通常写在样式表的顶层，但并非必须如此。 它们也可以嵌套在样式规则或纯 CSS 规则中。导入的 CSS 嵌套在该上下文中，这使得嵌套导入对于将 CSS 块限定为特定元素或媒体查询非常有用。请注意，嵌套导入中定义的顶层 mixins、functions 和 variables 仍然是全局定义的。

如 scss 代码：

```scss
// _theme.scss
pre,
code {
  font-family: "Source Code Pro", Helvetica, Arial;
  border-radius: 4px;
}
```

```scss
// style.scss
.theme-sample {
  @import "theme";
}
```

```css
.theme-sample pre,
.theme-sample code {
  font-family: "Source Code Pro", Helvetica, Arial;
  border-radius: 4px;
}
```

:::info 有趣的事实：
嵌套导入对于确定第三方样式表的范围非常有用，但如果你是要导入的样式表的作者，通常更好的做法是将你的样式编写在一个混入中，并将该混入包含在嵌套上下文中。mixin 可以以更灵活的方式使用，并且在查看导入的样式表时会更清楚它的用途。
:::

:::danger 注意！
嵌套导入中的 CSS 像混合一样被评估，这意味着任何父选择器都将引用样式表嵌套在其中的选择器，如下代码：

```scss
// _theme.scss
ul li {
  $padding: 16px;
  padding-left: $padding;
  [dir="rtl"] & {
    padding: {
      left: 0;
      right: $padding;
    }
  }
}
```

```scss
// style.scss
.theme-sample {
  @import "theme";
}
```

那么在 style.scss 中对应的 CSS 代码为：

```css
.theme-sample ul li {
  padding-left: 16px;
}
[dir="rtl"] .theme-sample ul li {
  padding-left: 0;
  padding-right: 16px;
}
```

:::

## 导入 CSS

兼容性：

- Dart Sass：since 1.11.0
- LibSass：部分的
- Ruby Sass：:negative_squared_cross_mark:

除了导入 .sass 和 .scss 文件之外，Sass 还可以导入原生的旧 .css 文件。唯一的规则是导入不能显式包含 .css 扩展名，因为它用于表明这是原生 CSS @import。导入 css 文件示例代码：

```css
/* code.css */
code {
  padding: 0.25em;
  line-height: 0;
}
```

```scss
// style.scss
@import "code";
```

那么在 style.scss 文件中对应的 css 代码为：

```css
code {
  padding: 0.25em;
  line-height: 0;
}
```

作为模块加载的 CSS 文件不允许任何特殊的 Sass 功能，因此不能暴露任何 Sass 变量、函数或 mixins。为了确保作者不会不小心在他们的 CSS 中编写 Sass ，所有不是有效 CSS 的 Sass 特性都会产生错误。否则，CSS 将按原样呈现。它甚至可以被 [entended](./extend.md)！

## 原生 CSS @imports

### 概览

兼容性：

- Dart Sass：:white_check_mark:
- LibSass：部分的
- Ruby Sass：:white_check_mark:

默认情况下，LibSass 都能正确处理原生 CSS imports。然而，任何自定义 importers 都会不正确的应用到原生 css import 规则中，从而使这些规则有可能加载 Sass 文件。

因为 @import 也在 CSS 中定义了，Sass 需要一种编译原生 CSS @import 的方法，即无需在编译时尝试导入文件。为了实现这一点，并确保 SCSS 尽可能多地成为 CSS 的超集，Sass 会将具有以下特征的 @import 编译为原生 CSS import：

- imports url 以 .css 结尾
- imports url 以 `http://` 或者 `https://` 开头
- imports url 写法为 `url()`
- imports 有媒体查询 @media

如 scss 代码：

```scss
@import "theme.css";
@import "http://fonts.googleapis.com/css?family=Droid+Sans";
@import url(theme);
@import "landscape" screen and (orientation: landscape);
```

生成的 CSS 代码：

```css
@import url(theme.css);
@import "http://fonts.googleapis.com/css?family=Droid+Sans";
@import url(theme);
@import "landscape" screen and (orientation: landscape);
```

### 插值

尽管 Sass 导入不能使用插值（以确保始终可以分辨出 mixins、functions 和 variables 的来源），但原生 CSS 导入可以。这使得动态生成导入成为可能，例如基于 mixin 参数。例如 scss 代码如下：

```scss
@mixin google-font($family) {
  @import url("http://fonts.googleapis.com/css?family=#{$family}");
}

@include google-font("Droid Sans");
```

即 css 为：

```css
@import url("http://fonts.googleapis.com/css?family=Droid Sans");
```

## 加载与模块

### 概览

Sass 的模块系统与 @import 无缝集成，无论你是导入包含 @use 规则的文件还是加载包含作为模块导入的文件。我们希望尽可能顺利地完成从 @import 到 @use 的过渡。

### 加载模块系统文件

#### 概览

当你 import 包含 @use 规则的文件时，导入文件可以访问直接在该文件中定义的所有成员（甚至私有成员），但不能访问该文件已加载的模块中的任何成员。但是，如果该文件包含@forward 规则，则导入文件将有权访问转发的成员。这意味着你可以导入一个库，该库是为与模块系统一起使用而编写的。

:::danger 注意！
当 import 带有 @use 规则的文件时，所有由这些规则加载的 CSS 都包含在生成的样式表中，即使它已经被另一个导入包含在内。如果你不小心，这可能会导致 CSS 输出过大！
:::

#### 只可以使用 import 导入的文件

对 @use 有意义的 API 可能对 @import 没有。 例如，@use 默认为所有成员添加命名空间，这样你就可以安全地使用短名称，但 @import 如果不这样做，你可能需要更长的名称。如果你是库的作者，你可能会担心如果你使用新的模块系统（@use）更新你的库，你现有的基于 @import 的用户将会崩溃。

为了使这更容易，Sass 还支持 import-only files。如果你命名一个文件 `<name>.import.scss`，它只会被 @import 加载，而不是用于 @use。这样，你可以为 @import 用户保留兼容性，同时仍然为新模块系统的用户提供良好的 API。如下 scss 代码：

```scss
// _reset.scss

// 新模块系统的用户将会编写 `@include reset.list()`
@mixin list() {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
```

```scss
// _reset.import.scss

// 老的 import 用户可以保持 `@include reset-list()` 写法
@forward "reset" as reset-*;
```

#### 通过 imports 配置模块

兼容性：

- Dart Sass：since 1.24.0
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

你可以使用 @import 配置模块通过定义全局变量在 使用 @import 加载模块之前，如 scss 代码如下：

```scss
// _library.scss
$color: blue !default;

a {
  color: $color;
}
```

```scss
// _library.import.scss
@forward "library" as lib-*;
```

```scss
// style.sass
$lib-color: green;
@import "library";
```

对应 style.scss 文件 CSS 代码如下：

```css
a {
  color: green;
}
```

:::danger 注意！
模块只加载一次，因此如果你在第一次（即使是间接）@import 模块后更改配置，如果再次 @import 模块，更改将被忽略。
:::

### 加载一个包含 imports 的模块

当你使用 `@use`（或 `@forward`）加载使用了 @import 的模块时，该模块将包含你加载的样式表定义的所有公共成员以及样式表传递导入的所有内容。换句话说，导入的所有内容都被视为是在一个大样式表中编写的。

这使得转变为开始使用 `@use` 在样式表中变得容易，甚至在你依赖的所有库都转换为新模块系统之前。但是请注意，如果他们确实进行了转换，那么他们的 API 很可能会发生变化！
