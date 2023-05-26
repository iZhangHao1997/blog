# Sass 父选择器

父选择器——&，是 Sass 发明的一个特别的选择器，用于在嵌套的选择器里引用外层的选择器。这使得以更复杂的方式重用外部选择器成为可能，像新增一个伪类或者在父选择器之前新增一个选择器。

当一个父选择器被用在一个内部选择器里面，它将被替换为对应的外部选择器。这种写法出现在代替正常嵌套行为。

例如：

```scss
.alert {
  // 父选择器可以用来添加外层选择器的伪类
  &:hover {
    font-weight: bold;
  }

  // 父选择器也可以被用在特定的上下文中设置外层选择器的样式，例如使用从右到左的语言用于主体设置。
  [dir="rtl"] & {
    margin-left: 0;
    margin-right: 10px;
  }

  // 您甚至可以将它用作伪类选择器的参数。
  :not(&) {
    opacity: 0.8;
  }
}
```

生成的 CSS 代码

```css
.alert:hover {
  font-weight: bold;
}
[dir="rtl"] .alert {
  margin-left: 0;
  margin-right: 10px;
}
:not(.alert) {
  opacity: 0.8;
}
```

::: danger 注意！
因为父选择器可以用来替换选择器的类型比如 `h1`，所以它只被允许在复合选择器的开头，而父选择器也允许使用类型选择器。例如，`span&` 是不被允许的。
不过，我们正在研究放宽这一项限制。如果你也想放宽这个限制，请在 [Github issue—— Support "selector&"](https://github.com/sass/sass/issues/1425) 上查看。
:::

## 添加后缀

你也可以使用父选择器向外层选择器添加后缀。这在使用像 [BEM](https://getbem.com/) 这样使用高度结构化类名的方法时特别有用。只要外部选择器以字母数字名称结尾（如类、ID 和元素选择器），您就可以使用父选择器附加其他文本。

如 sass 代码：

```scss
.accordion {
  max-width: 600px;
  margin: 4rem auto;
  width: 90%;
  font-family: "Raleway", sans-serif;
  background: #f4f4f4;

  &__copy {
    display: none;
    padding: 1rem 1.5rem 2rem 1.5rem;
    color: gray;
    line-height: 1.6;
    font-size: 14px;
    font-weight: 500;

    &--open {
      display: block;
    }
  }
}
```

对应的 CSS 代码：

```css
.accordion {
  max-width: 600px;
  margin: 4rem auto;
  width: 90%;
  font-family: "Raleway", sans-serif;
  background: #f4f4f4;
}
.accordion__copy {
  display: none;
  padding: 1rem 1.5rem 2rem 1.5rem;
  color: gray;
  line-height: 1.6;
  font-size: 14px;
  font-weight: 500;
}
.accordion__copy--open {
  display: block;
}
```

## 在 SassScript 中

父选择器也可以被用在 SassScript 中。他是一个特别的表达式，它以选择器函数使用的相同格式返回当前父选择器：一个逗号分隔的列表（选择器列表），其中包含空格分隔的列表（复杂选择器），其中包含不带引号的字符串（复合选择器）。

例如：

```scss
.main aside:hover,
.sidebar p {
  parent-selector: &;
  // => ((unquote(".main") unquote("aside:hover")),
  //     (unquote(".sidebar") unquote("p")))
}
```

对应的 CSS 代码：

```css
.main aside:hover,
.sidebar p {
  parent-selector: .main aside:hover, .sidebar p;
}
```

如果 & 表达式在任何样式规则之外使用，则返回 null。由于 `null` 是 `falsey` 的，这意味着您可以轻松地使用它来确定是否在样式规则中调用了 mixin。

```scss
@mixin app-background($color) {
  #{if(&, '&.app-background', '.app-background')} {
    background-color: $color;
    color: rgba(#fff, 0.75);
  }
}

@include app-background(#036);

.sidebar {
  @include app-background(#c6538c);
}
```

对应的 CSS 代码：

```css
.app-background {
  background-color: #036;
  color: rgba(255, 255, 255, 0.75);
}

.sidebar.app-background {
  background-color: #c6538c;
  color: rgba(255, 255, 255, 0.75);
}
```

### 高级嵌套

你可以将 & 用作正常的 SassScript 表达式，这意味着你可以将它传递给函数或将其包含在插值中——甚至在其他选择器中。将它与选择器函数和 @at-root 规则结合使用可以让您以非常强大的方式嵌套选择器。

例如，假设您要编写一个匹配外部选择器和元素选择器的选择器。 您可以编写一个像这样的混合器，它使用 `selector.unify()` 函数将 `&` 与用户的选择器组合在一起。

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

对应的 CSS 代码

```css
.wrapper input.field {
  /* ... */
}

.wrapper select.field {
  /* ... */
}
```
