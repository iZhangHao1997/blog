# Sass Lists 列表

Lists 列表中包含了一系列的 Sass 值。在 Sass 中，lists 中的元素可以被逗号（`Helvetica, Arial, sans-serif`）、空格（10px 15px 0 0）或者斜杠分开，只要它们在列表中保持一致就行。不像其他大多数语言，Sass 中的 lists 不需要特别的方括号 `[]`；任何被空格、逗号分隔的表达式都被当做是一个列表。然而，你也被允许使用方括号 `[line1 line2]`，当使用 grid-template-columns 时是有用的。

Sass 列表可以包含一个甚至 0 个元素。单元素的列表写作 `(<expression>)` 或者 `[<expression>]`，0 元素列表可以写作 `()` 或者 `[]`。此外，所有列表函数都会将不在列表中的各个值视为包含该值的列表，这意味着您很少需要显式创建单元素列表。即用列表函数处理单值 `<expression>` 和处理 `(<expression>)` 是一样的。如下 scss 代码：

```scss
@use "sass:list";

$var: "abc";
@debug list.length($var); // 1
@debug list.append($var, "bcd"); // "abc" "bcd"
```

:::danger 注意！
不带括号的空列表不是合法的 CSS，所以 Sass 不会允许你在一个属性值中使用不带括号的空列表。
:::

## 斜杠分隔的列表

Sass 中的列表可以用斜杠分隔来表示值，如 `font: 12px/30px` 用于设置的简写 `font-size` 和 `line-height` 或 `hsl(80 100% 50% / 0.5)` 用于创建给定不透明度值的颜色的语法之类的值。**然而，斜杠分隔的列表目前不能按字面书写。**Sass 历史上使用 `/` 字符来表示除法，虽然现有样式表过渡到使用 `math.div()`，因此斜杠分隔列表只能使用 `list.slash()` 创建。

有关更多详细信息，请参阅[重大更改：斜线作为除法](https://sass-lang.com/documentation/breaking-changes/slash-div/)。

## 使用列表

Sass 提供了一些有用的函数，使使用列表编写强大的样式库成为可能，或者使你的应用样式表更加简洁、更易维护。

### 索引

许多函数接受或者返回一个称为索引的数字，指向列表中的某个元素。索引 1 指向列表中的第一个元素。注意这和许多编程语言不同，其他编程语言列表的第一个元素的索引是 0。Sass 通过索引指向列表的后面元素也很容易。索引 -1 代表元素的最后一个元素，索引 -2 指向列表的倒数第二个元素，以此类推。

### 访问元素

如果不从列表里面得到值，列表就没什么用。因此你可以使用 `list.nth($list, $n)` 函数通过给定索引 `n` 访问列表中的元素。第一个参数是列表本身，第二个参数是列表的元素索引。

```scss
@debug list.nth(10px 12px 16px, 2); // 12px
@debug list.nth([line1, line2, line3], -1); // line3
```

### 遍历元素

这实际上不是使用函数，但也是使用列表最常见的方式之一。[@each rule](../at-rules/control/each.md) 会触发样式块里的样式对每个列表中的元素，然后将元素的值赋值给 `@each` 中的变量。

:::code-group

```scss
$sizes: 40px, 50px, 80px;

@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}
```

```css
.icon-40px {
  font-size: 40px;
  height: 40px;
  width: 40px;
}

.icon-50px {
  font-size: 50px;
  height: 50px;
  width: 50px;
}

.icon-80px {
  font-size: 80px;
  height: 80px;
  width: 80px;
}
```

:::

### 添加元素

使用 `list.append($list, $val)` 函数可以往列表里面添加元素，第一个参数是想要添加元素的列表，第二个参数是要添加的值，该函数返回在末尾添加完元素之后的列表副本。注意因为 Sass 列表是不可修改的，所以不会改变原有数组。

```scss
@debug append(10px 12px 16px, 25px); // 10px 12px 16px 25px
@debug append([col1-line1], col1-line2); // [col1-line1, col1-line2]
```

### 查找列表中的元素

如果你想查找元素或者检查元素是否存在列表中，使用 `list.index($list,$value)` 函数。函数接收一个列表和一个值，如果该值存在于列表中返回该值在列表中的索引，不存在则返回 `null`。

```scss
@debug list.index(1px solid red, 1px); // 1
@debug list.index(1px solid red, solid); // 2
@debug list.index(1px solid red, dashed); // null
```

你可以和 `@if` 或者 `if()` 搭配使用，来检查所给值是否存在于列表中。

```scss
@use "sass:list";

$valid-sides: top, bottom, left, right;

@mixin attach($side) {
  @if not list.index($valid-sides, $side) {
    @error "#{$side} is not a valid side. Expected one of #{$valid-sides}.";
  }

  // ... do something else
}
```

## 列表不变性

Sass 中的列表是不可变的，意味着列表中的内容永远不会改变。Sass 中所有列表的函数都是返回一个新的列表而不是改变原有列表。不变性会帮助避免很多比较隐性的 bug，比如多个样式表共用同一个列表的时候，bug 就有可能悄悄出现了。

你可以通过赋值给那个变量一个新的列表来更新你的状态。这经常被用在函数和混入中，收集一堆值到一个列表中。

```scss
@use "sass:list";
@use "sass:map";

$prefixes-by-browser: (
  "firefox": moz,
  "safari": webkit,
  "ie": ms,
);

@function prefixes-for-browsers($browsers) {
  $prefixes: ();
  @each $browser in $browsers {
    $prefixes: list.append($prefixes, map.get($prefixes-by-browser, $browser));
  }
  @return $prefixes;
}

@debug prefixes-for-browsers("firefox" "ie"); // moz ms
```

## 参数列表

当你声明一个混入或者函数时可以接收一个任意参数，你所收到的值将会作为一个列表参数。表现起来就像所有传给混入或者函数的值都会被包含在这个参数列表中，还有一个额外的功能：如果用户传递关键字参数，将参数列表传递给 `meta.keywords()` 函数，函数返回值是一个 maps 映射。

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
