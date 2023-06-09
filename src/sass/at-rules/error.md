# Sass @error

当编写函数和混入的参数时，我们都想确保参数的类型和格式都是我们所希望的。如果参数出错，我们就要通知调用的用户并停止运行。

@error 就是做这个事情的，语法为 `@error <expression>`。它将会打印 `<expression>` 的值（通常是字符串）以及一个堆栈跟踪，指示当前的混入或函数是如何被调用的。一旦错误被打印出来，Sass 停止编译样式表并且将会告诉运行它的系统发生了一个错误。如下 scss 代码：

```scss
@mixin reflexive-position($property, $value) {
  @if $property != left and $property != right {
    @error "Property #{$property} must be either left or right.";
  }

  $left-value: if($property == right, initial, $value);
  $right-value: if($property == right, $value, initial);

  left: $left-value;
  right: $right-value;
  [dir="rtl"] & {
    left: $right-value;
    right: $left-value;
  }
}

.sidebar {
  @include reflexive-position(top, 12px);
  //       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Error: Property top must be either left or right.
}
```

错误和堆栈跟踪的确切格式因实现而异，也可能取决于你的构建系统。这是从命令行运行时在 Dart Sass 中的样子：

```
Error: "Property top must be either left or right."
  ╷
3 │     @error "Property #{$property} must be either left or right.";
  │     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
  example.scss 3:5   reflexive-position()
  example.scss 19:3  root stylesheet

```
