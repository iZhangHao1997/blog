# Sass @warn

当编写混入和函数时，你可能想自制用户传递一些特定的参数或者值。这些参数或者值可能是旧版本的参数或已经废弃了，或者他们可能会以不太理想的方式调用你的 API。

@warn 规则就是为此服务的，语法为 `@warn <expression>`。和 @error 一样会打印错误信息以及对应的堆栈。和 @error 不同的是，它不会停止代码运行。

```scss
$known-prefixes: webkit, moz, ms, o;

@mixin prefix($property, $value, $prefixes) {
  @each $prefix in $prefixes {
    @if not index($known-prefixes, $prefix) {
      @warn "Unknown prefix #{$prefix}.";
    }

    -#{$prefix}-#{$property}: $value;
  }
  #{$property}: $value;
}

.tilt {
  // 当我们不小心将 "webkit" 打错为 "wekbit"!
  @include prefix(transform, rotate(15deg), wekbit ms);
}
```

因为 @warn 不会停止代码编译，因此编译生成的 css 代码：

```css
.tilt {
  -wekbit-transform: rotate(15deg);
  -ms-transform: rotate(15deg);
  transform: rotate(15deg);
}
```

错误和堆栈跟踪的确切格式因实现而异，也可能取决于你的构建系统。这是从命令行运行时在 Dart Sass 中的样子：

```
Warning: Unknown prefix wekbit.
    example.scss 6:7   prefix()
    example.scss 16:3  root stylesheet
```
