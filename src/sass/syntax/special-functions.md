# 特殊函数

CSS 定义了许多 functions 函数，并且大部分都可以和 Sass 的正常函数语法一起正常工作。普通的函数会被解析（parsed）为函数调用，转换（resolved to）原生 CSS 函数，然后按原样编译为 CSS。不过也有一些例外，这些特殊的函数有不能被解析为 SassScript 表达式的特殊语法。所有特殊函数的调用将会返回不带引号的字符串。

## url()

url() 函数在 CSS 中很常用，但是它的语法和其他函数不同：它可以接受带引号或者不带引号的 URL。因为不加引号的 URL 不是一个有效的 SassSript 表达式，Sass 需要特殊逻辑去解析它。

如果 url() 函数的参数是一个不带引号的 URL，Sass 会按原样解析它，尽管可以使用插值来注入 SassCript 值。如果参数不是一个有效的的不带引号的 URL——例如，如果它包含变量或者函数调用——他将被解析为正常的原生 CSS 函数调用。

scss 代码：

```scss
$roboto-font-path: "../fonts/roboto";

@font-face {
  // This is parsed as a normal function call that takes a quoted string.
  src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2");

  font-family: "Roboto";
  font-weight: 100;
}

@font-face {
  // This is parsed as a normal function call that takes an arithmetic
  // expression.
  src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2");

  font-family: "Roboto";
  font-weight: 300;
}

@font-face {
  // This is parsed as an interpolated special function.
  src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2");

  font-family: "Roboto";
  font-weight: 400;
}
```

编译后生成的 css 代码：

```css
@font-face {
  src: url("../fonts/roboto/Roboto-Thin.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 100;
}
@font-face {
  src: url("../fonts/roboto/Roboto-Light.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 300;
}
@font-face {
  src: url(../fonts/roboto/Roboto-Regular.woff2) format("woff2");
  font-family: "Roboto";
  font-weight: 400;
}
```

## element(), progid: ...(), and expression()

calc() 兼容性：

- Dart Sass：since < 1.40.0
- LibSass（Node Sass）：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

LibSass，Ruby Sass 和 低于 1.40.0 版本的 Dart Sass 将解析 calc() 为特殊语法函数例如 element()。

高于 1.40.0 版本的 Dart Sass 解析 calc() 为计算。

clamp() 兼容性：

- Dart Sass: since >= 1.31.0 < 1.40.0
- LibSass（Node Sass）：:negative_squared_cross_mark:
- Ruby Sass：:negative_squared_cross_mark:

LibSass，Ruby Sass，和低于 1.31.0 版本的 Dart Sass 即系 calmp() 为原生 CSS 函数，而不是支持特殊语法。
介于 1.31.0 和 1.40.0 版本的 Dart Sass 解析 clamp() 为特殊语法函数如 element()。
高于 1.40.0 版本的 Dart Sass 解析 clamp() 为计算。

element() 函数定义在 CSS 规范中，并且其 ID 参数可以解析为颜色，因此需要特殊解析。

expression() 和其他以 progid: 开头的函数：是使用非标准语法的旧版 Internet Explorer 功能。虽然最近的浏览器不再支持它们，但 Sass 继续解析它们以实现向后兼容性。

Sass 在这些函数调用里面允许任何文本，包括嵌套括号。没有任何东西被解释为 SassScript 表达式，除了可以使用插值来注入动态值。

例 sass 代码如下：

```scss
$logo-element: logo-bg;

.logo {
  background: element(##{${logo-element}});
}
```

生成的 css 代码：

```css
.logo {
  background: element(#logo-bg);
}
```
