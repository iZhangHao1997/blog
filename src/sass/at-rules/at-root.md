# Sass @at-root

@at-root 规则的语法为 `@at-root <selector> { ... }`。它将正常嵌套里的任何东西放在文档的根部。它通常被用来和父选择器、选择器函数做一些高级嵌套。

例如，假设你想写一个选择器匹配外部选择器和元素选择器。你可以写一个像这个使用 `selector.unify()` 和父选择器相结合的 mixin。

注：`selector.unify()` 函数返回匹配参数中所有选择器的组合选择器，如 `selector.unify("a.disabled", "a.outgoing")` 返回 `a.disabled.outgoing`。

:::code-group

```scss
@use "sass:selector";

@mixin unify-parent($child) {
  @at-root #{selector.unify(&, $child)} {
    @content;
  }
}

.wrapper .field {
  @include unify-parent("input") {
    /* ... */
  }
  @include unify-parent("select") {
    /* ... */
  }
}
```

```css
.wrapper input.field {
  /* ... */
}

.wrapper select.field {
  /* ... */
}
```

:::

@at-root 规则在这里是必须的，因为 Sass 不知道执行选择器嵌套时不知道使用什么插值来生成选择器。这意味着它会自动将外部选择器添加到内部选择器，即使使用 & 作 SassScript 表达式也是如此。@at-root 明确告诉 Sass 不要包含外部选择器。也就是说，如果这里不添加 @at-root 规则，将会生成如下 css 代码：

```css
.wrapper .field .wrapper input.field {
  /* ... */
}
.wrapper .field .wrapper select.field {
  /* ... */
}
```

:::info 有趣的事实：
@at-root 规则也可以写作 `@at-root { ... }` 来将多个样式规则设置于文档根部。事实上，`@at-root <selector> { ... }` 是 `@at-root { <selector> {...} }` 的简写。
:::

## 样式规则之外

就 @at-root 规则而言，它会摆脱样式规则的束缚。任何@规则，如 @media 或者 @supports 都会被留着。如果你不想这样，你可以通过编写 `@at-root (with: <rules...>) { ... }` 或者 `@at-root (<without: <rules...>) { ... }` 语法来精确地控制什么规则应该被包含或者排除之外。`(without: ...)` 语句告诉 Sass 哪些规则应该被排除在外；`(with: ...)` 语句将排除所有的规则除了被列出来的这些。如下 scss 代码：

:::code-group

```scss
@media print {
  .page {
    width: 8in;

    @at-root (without: media) {
      color: #111;
    }

    @at-root (with: rule) {
      font-size: 1.2em;
    }
  }
}
```

```css
@media print {
  .page {
    width: 8id;
  }
}

.page {
  color: #111;
}

.page {
  font-size: 1.2em;
}
```

:::

除了@规则的名称外，还有两个特殊值可用于 with/without 的关键字里：

- `rule` 指的是样式规则。例如，`@at-root (with: rule)` 将排除所有@规则除了提供的样式规则
- `all` 指的是所有@规则和样式规则都会被排除在外
