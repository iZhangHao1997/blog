# Sass @debug

当我们编写样式表时，我们想要查看一些变量或者表达式的值。@debug 就是被设计来干这件事的，语法为 `@debug <expression>`，紧接着 `<expression>` 的值将会被打印出来，伴随着文件名和行号，例如：

```scss
@mixin inset-divider-offset($offset, $padding) {
  $divider-offset: (2 * $padding) + $offset;
  @debug "divider offset: #{$divider-offset}";

  margin-left: $divider-offset;
  width: calc(100% - #{$divider-offset});
}
```

错误和堆栈跟踪的确切格式因实现而异，也可能取决于你的构建系统。这是从命令行运行时在 Dart Sass 中的样子：

```
test.scss:3 Debug: divider offset: 132px
```

:::info 有趣的事实：
你可以 @debug 任何值，不单单是字符串。它将打印和 meta.inspect() 函数一样的值。
:::
