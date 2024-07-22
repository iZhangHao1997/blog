# sass:selector

## 选择器值

此模块中的函数检查和操作选择器。每当它们返回选择器时，它始终是一个逗号分隔的列表（选择器列表），其中包含空格分隔的列表（复杂选择器），其中包含未加引号的字符串（复合选择器）。例如，选择器 `.main aside:hover, .sidebar p` 将按以下方式返回：

```scss
@debug (
  (unquote(".main") unquote("aside:hover")),
  (unquote(".sidebar") unquote("p"))
);
// .main aside:hover, .sidebar p
```

这些函数的选择器参数可能具有相同的格式，但它们也可以只是普通字符串（带引号或不带引号），或者是组合。例如，".main aside:hover, .sidebar p" 是一个有效的选择器参数。

```scss
selector.is-superselector($super, $sub)
is-superselector($super, $sub) //=> boolean
```

返回选择器 `$super` 匹配的是否与选择器 `$sub` 所有元素匹配。

即使 `$super` 匹配的元素多于 `$sub` 仍然返回 `true` 。

`$super` 和选择器 `$sub` 可以包含占位符选择器，但不能包含父选择器。

```scss
@use "sass:selector";

@debug selector.is-superselector("a", "a.disabled"); // true
@debug selector.is-superselector("a.disabled", "a"); // false
@debug selector.is-superselector("a", "sidebar a"); // true
@debug selector.is-superselector("sidebar a", "a"); // false
@debug selector.is-superselector("a", "a"); // true
```

```scss
selector.append($selectors...)
selector-append($selectors...) //=> selector
```

组合时 `$selectors` 无需后代组合器。即， 它们之间没有空格。

如果中的任何选择器 `$selectors` 是选择器列表，则每个复杂选择器将单独组合。

可能 `$selectors` 包含占位符选择器，但不包含父选择器。

也可以看看 `selector.nest()`。

```scss
@use "sass:selector";

@debug selector.append("a", ".disabled"); // a.disabled
@debug selector.append(".accordion", "__copy"); // .accordion__copy
@debug selector.append(".accordion", "__copy, __image");
// .accordion__copy, .accordion__image
```

```scss
selector.extend($selector, $extendee, $extender)
selector-extend($selector, $extendee, $extender) //=> selector
```

和 `@extends` 规则一样继承选择器。

返回一份拷贝至根据修改后的选择器：

```scss
#{$extender} {
  @extend #{$extendee};
}
```

```scss
@use "sass:selector";

@debug selector.extend(
  "a.disabled",
  "a",
  ".link"
); // a.disabled, .link.disabled
@debug selector.extend("a.disabled", "h1", "h2"); // a.disabled
@debug selector.extend(".guide .info", ".info", ".content nav.sidebar");
// .guide .info, .guide .content nav.sidebar, .content .guide nav.sidebar
```

```scss
selector.nest($selectors...)
selector-nest($selectors...) //=> selector
```

组合起来 `$selectors` 就像在样式表中相互嵌套一样 。

`$selectors` 可以包含占位符选择器。与其他选择器函数不同，除第一个之外，其他所有函数都可以包含父选择器。

也可以看看 `selector.append()`。

```scss
@use "sass:selector";

@debug selector.nest("ul", "li"); // ul li
@debug selector.nest(".alert, .warning", "p"); // .alert p, .warning p
@debug selector.nest(".alert", "&:hover"); // .alert:hover
@debug selector.nest(".accordion", "&__copy"); // .accordion__copy
```

```scss
selector.parse($selector)
selector-parse($selector) //=> selector
```

返回 `$selector` 以选择器值格式。

```scss
@use "sass:selector";

@debug selector.parse(".main aside:hover, .sidebar p");
// ((unquote(".main") unquote("aside:hover")),
//  (unquote(".sidebar") unquote("p")))
```

```scss
selector.replace($selector, $original, $replacement)
selector-replace($selector, $original, $replacement) //=> selector
```

返回 `$selector` 的副本，其中所有 `$original` 实例均被 `$replacement` 替换。

这利用 `@extend` 规则的智能统一来确保 `$replacement` 无缝集成到中 `$selector`。如果 `$selector` 不包含 `$original`，则按原样返回。

`$selector`、`$original` 和选择器 `$replacement` 可以包含占位符选择器，但不能包含父选择器。

也可以看看 `selector.extend()`。

```scss
@use "sass:selector";

@debug selector.replace("a.disabled", "a", ".link"); // .link.disabled
@debug selector.replace("a.disabled", "h1", "h2"); // a.disabled
@debug selector.replace(".guide .info", ".info", ".content nav.sidebar");
// .guide .content nav.sidebar, .content .guide nav.sidebar
```

```scss
selector.unify($selector1, $selector2)
selector-unify($selector1, $selector2) //=> selector | null
```

返回仅同时匹配 `$selector1` 和 `$selector2` 元素的选择器。

如果 `$selector1` 和 `$selector2` 不匹配任何相同的元素，或者没有可以表达它们重叠的选择器，则返回 `null`。

与 `@extend` 规则生成的选择器一样，如果和都是复杂选择器，则返回的选择器不能保证与 `$selector1` 和 `$selector2` 匹配的所有元素相匹配。

```scss
@use "sass:selector";

@debug selector.unify("a", ".disabled"); // a.disabled
@debug selector.unify("a.disabled", "a.outgoing"); // a.disabled.outgoing
@debug selector.unify("a", "h1"); // null
@debug selector.unify(
  ".warning a",
  "main a"
); // .warning main a, main .warning a
```

```scss
selector.simple-selectors($selector)
simple-selectors($selector) //=> list
```

返回 `$selector` 中的简单选择器列表。

`$selector` 必须是包含复合选择器的单个字符串。这意味着它不能包含组合符（包括空格）或逗号。

返回以逗号分隔的列表，简单选择器是未加引号的字符串。

```scss
@use "sass:selector";

@debug selector.simple-selectors("a.disabled"); // a, .disabled
@debug selector.simple-selectors("main.blog:after"); // main, .blog, :after
```
