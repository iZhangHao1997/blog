# Sass 插值

插值可以被用在 Sass 样式表的几乎任何地方，用来将 SassScript 表达式的结果嵌入到 CSS 块中。只需要将表达式包裹在 `#{}` 在以下任何一个地方里面：

- 样式规则中的选择器
- 声明中的属性名
- 自定义属性值
- CSS @规则
- @extends
- 原生 CSS @imports
- 带引号或者不带引号的字符串
- 特别函数
- 原生 CSS 函数名称
- loud 注释

例如代码：

:::code-group

```scss
@mixin corner-icon($name, $top-or-bottom, $left-or-right) {
  .icon-#{$name} {
    background-image: url("/icons/#{$name}.svg");
    position: absolute;
    #{$top-or-bottom}: 0;
    #{$left-or-right}: 0;
  }
}

@include corner-icon("mail", top, left);
```

```css
.icon-mail {
  background-image: url("/icons/mail.svg");
  position: absolute;
  top: 0;
  left: 0;
}
```

:::

## 在 SassScript 中

兼容性（现代语法）：

- Dart Sass： :white_check_mark:
- LibSass：:negative_squared_cross_mark:
- Ruby Sass：since 4.0.0（未发布）

LibSass 和 Ruby Sass 现在使用更旧的语法来解析插值在 SassScript 中。对于大多数实际用途，它工作起来是一样的，但是它可能表现的奇怪起来如果周围有操作符。更详细的内容请参考[这个文档](https://github.com/sass/sass/blob/main/accepted/free-interpolation.md#old-interpolation-rules)。

可以在 SassScript 中使用插值将 SassScript 注入到未加引号的字符串中。这是非常有用的当动态生成名称（例如动画名称），或者使用斜杠分隔值。注意 SassScript 中的插值总是返回一个不带引号的字符串。

:::code-group

```scss
@mixin inline-animation($duration) {
  $name: inline-#{unique-id()};

  @keyframes #{$name} {
    @content;
  }

  animation-name: $name;
  animation-duration: $duration;
  animation-iteration-count: infinite;
}

.pulse {
  @include inline-animation(2s) {
    from {
      background-color: yellow;
    }
    to {
      background-color: red;
    }
  }
}
```

```css
.pulse {
  animation-name: inline-uhtghph2n;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
@keyframes inline-uhtghph2n {
  from {
    background-color: yellow;
  }
  to {
    background-color: red;
  }
}
```

:::

::: info 有趣的事实：
插值对于将值注入字符串很有用，但除此之外，它在 SassScript 表达式中很少需要。你绝对不需要它来仅在属性值中使用变量。不用写 `color: #{$accent}`，你可以直接写 `color: $accent`！
:::

::: danger 注意！
对于数字使用插值基本上是一个坏主意。插值返回不带引号的字符串，这些字符串不能被用来更进一步的任何数学运算，并且它避免了 Sass 的内置安全措施来确保正确使用单位。

Sass 有强大的单位算法，你可以用它代替。例如，与其写 `#{$width}px`，不如写 `$width * 1px` 声明 `$width` 变量。这样，如果 `$width` 已经有单位，你会得到一个友好的错误信息，而不是编译错误的 CSS。
:::

## 带引号的字符串

在大多数情况下，插值会注入与表达式用作属性值时将使用的完全相同的文本。但有一个例外：带引号的字符串周围的引号被删除（即使那些带引号的字符串在列表中）。这使得编写包含 SassScript 中不允许的语法（如选择器）的引用字符串并将它们插入样式规则成为可能。

::: danger 注意！
虽然使用这个功能来转换带引号的字符串为不带引号的字符串很诱人，但是使用 `string.unquote()` 函数才是聪明的选择。与其写 `#{$string}`，不如写 `string.unquote($string)` 更好！
:::
