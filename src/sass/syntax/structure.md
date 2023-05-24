就像 CSS，大多数的 sass 样式表主要由包含属性声明的样式规则组成。但是 sass 样式表有许多更多能一起存在的的功能特性。

## 语句

一个 Sass 样式表由一系列的语句组成，这些语句被评估生成构建 CSS 结果。一些语句可能包含使用 { 和 } 定义的块，块中包含其他语句。例如，样式规则是一个包含块的语句。那个块包含其他语句，例如属性声明。

在 SCSS 语法中，语句由分号分隔（如果使用块，分号是可选的，即 {} 后可加可不加分号）。在缩进语法中，语句都由换行符分隔。

### 通用语句

这类型的语句可以在 Sass 样式表中的任何地方使用：

- 变量声明，如：`$var: value`
- @规则中的流控制，如：`@if` 和 `@each`
- `@error`、`@warn` 和 `@debug` 规则

### CSS 语句

这些语句生成 CSS。这些语句可以在除了 @function 之外的任何地方使用：

- 样式规则，如： h1 { /_..._/ }
- CSS 的 @规则，如 @media 和 @font-face
- mixin uses using @include（没读懂什么意思）
- `@at-root` 规则

### 顶层语句

这些语句只能用在样式表的顶层，或者嵌套在一个顶层的 css 语句里：

- 模块加载，如使用 `@use`
- 导入，如使用 `@import`
- mixin 定义，如使用 `@mixin`
- function 函数定义，如使用 `@function`

### 其他语句

- 属性声明，如 `width: 100px` 只在样式规则中和 css @规则使用（Property declarations like width: 100px may only be used within style rules and some CSS at-rules.）
- `@extend` 只能在样式规则中使用（The @extend rule may only be used within style rules.）

## 表达式

表达式是属性或变量声明右手边的任何内容。每个表达式产生一个值。任何有效的 CSS 值也是 Sass 表达式，但是 Sass 表达式比普通的 CSS 的值更加强大。它们可以被当作参数传递到 mixins 和 functions 中，也用在控制流使用 @if 规则里，并且用算术进行操作。我们把 Sass 表达式语法为 SassScript。

### 文字

最简单的表达式就是静态值，如：

- Numbers 数字，可以有单位也可以没有单位的数字：`100` 或者 `12px`。
- Strings 字符串，可以有引号也可以没有引号的字符串：`"Helvetica Neue"` 或者 `bold`。
- Colors 颜色，可以通过它们的 16 进制或者名称来引用：`#c6538c` 或者 `blue`。
- Booleans 布尔值，包括 `true` 和 `false`。
- 单例 null。
- List 列表，可以用空格或逗号分隔，可以用方括号括起来，也可以不带括号，例如`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`, 或 `[col1-start]`。
- Maps 映射，将值和键关联起来，如： `("background": red, "foreground": "pink")`。

### 操作符

Sass 定义了许多操作符的语法：

- `==` 和 `!=` 用来判断两个值是否一样。
- `+`、`-`、`*`、`/` 和 `%` 对数字具有它们通常的数学含义，具有与科学数学中的单位使用相匹配的单位的特殊行为。
- `<`、`<=`、`>` 和 `>=` 用来检查两个数字之间的大小。
- `and` 或者 `and not` 具有通常的布尔行为。Sass 认为每个值都为 “true” 除了 `false` 和 `null`。
- `+`、`-` 和 `/` 可以用来连接字符串。
- `(` 和 `)` 可以用来显示地控制操作的优先顺序。

### 其他表达式

- Variables 变量，如 `$var`。
- Functions calls 函数调用，如 `nth($list, 1)` 或者 `var(--main-bg-color)`，函数调用可以是 Sass 核心库里面的函数或者是用户定义的函数。
- Special Functions 特别函数，如 `calc(1px + 100%)` 或者 `url(http://myapp.com/assets/logo.png)`，这些特别函数有它们自己独特的解析规则。
- 父选择器 `&`
- 值 `!important`，将被解析为一个不带引号的字符串。
