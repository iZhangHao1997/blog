# Sass 样式规则

样式规则是 Sass 的基础，就像 CSS 的样式规则一样。并且他们以相同的方式工作：你选择一个选择器来设置元素的样式，然后声明影响这些元素外观的属性。

例如：

```sass
.button {
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid #e1e4e8;
}
```

## 嵌套

### 概述

但是 Sass 想让你的生活更轻松。比起一遍又一遍重复一样的选择器，你可以写一个样式规则在另一个选择器的里面。Sass 将会自动结合外部规则的选择器和里面规则的选择器。

例如：
:::code-group

```sass
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

:::

::: danger 注意!
嵌套规则是非常有用的，但是这也让你很能想象到底实际生成了多少 CSS 代码。你嵌套的越深，为 CSS 提供服务所需的带宽就越多，游览器也会花费工多的工作去渲染它。所以保持选择器嵌套层级浅一些。
:::

### 选择器列表

嵌套规则在处理选择器列表时非常巧妙（那就是使用逗号分隔选择器）。每个复杂的选择器（逗号之间的选择器）是分别嵌套的，并且将他们组合返回到选择器列表里。

例如：

:::code-group

```scss
.alert,
.warning {
  ul,
  p {
    margin-right: 0;
    margin-left: 0;
    padding-bottom: 0;
  }
}
```

```css
.alert ul,
.alert p,
.warning ul,
.warning p {
  margin-right: 0;
  margin-left: 0;
  padding-bottom: 0;
}
```

:::

### 选择器组合器

你也可以用组合器嵌套选择器。你可以把组合器放在外层选择器的结尾、内部选择器的开头，甚至在两者之间单独放置。

如代码：

:::code-group

```scss
ul > {
  li {
    list-style-type: none;
  }
}

h2 {
  + p {
    border-top: 1px solid gray;
  }
}

p {
  ~ {
    span {
      opacity: 0.8;
    }
  }
}
```

```css
ul > li {
  list-style-type: none;
}

h2 + p {
  border-top: 1px solid gray;
}

p ~ span {
  opacity: 0.8;
}
```

:::

### 高级嵌套

如果你想关于嵌套规则做更多事情，不仅仅按顺序组合他们，用后代选择器，就是用一个空格分隔它们，Sass 也是支持的。可以查阅[父选择器文档](./parent-selector)参考更多细节。

## 插值

你可以用插值表达式例如变量和函数调用，来注入值到选择器中的。这是特别有用的当你编写 mixins，因为它允许你使用用户传入的参数来创造选择器。

如代码：

:::code-group

```scss
@mixin define-emoji($name, $glyph) {
  span.emoji-#{$name} {
    font-family: IconFont;
    font-variant: normal;
    font-weight: normal;
    content: $glyph;
  }
}

@include define-emoji("women-holding-hands", "👭");
```

```css
@charset "UTF-8";
span.emoji-women-holding-hands {
  font-family: IconFont;
  font-variant: normal;
  font-weight: normal;
  content: "👭";
}
```

:::

::: info 有趣的事实
Sass 仅在转换完插值之后解析选择器。这意味着你可以安全地使用插值来生成选择器中的任何部分，不需要担心它不会被解析。
:::

当要动态生成选择器时，你可以结合使用插值、父选择器 &、@规则和选择器函数来发挥强大的作用。关于更多信息，请参考[父选择器文档](./parent-selector)。
