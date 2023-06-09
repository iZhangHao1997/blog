# Sass @extend

这种情况在设计一个页面的时候经常发生：一个 class 有另一个 class 的全部样式，同时也有它本身自己的样式。例如，[BEM 方法论](https://getbem.com/naming/) 鼓励在与块或元素类相同的元素上使用修饰符类。但这会产生混乱的 HTML，容易因忘记包含这两个类而出错，并且会在你的标记中带来非语义样式问题。如下代码：

```html
<div class="error error--serious">Oh no! You've been hacked!</div>
```

```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}

.error--serious {
  border-width: 3px;
}
```

Sass 的 @extend 规则可以解决这个问题。它的语法为 `@extend <selector>`，这告诉了 sass 这个选择器要包含另一个选择器的样式。如下 scss 代码：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;

  &--serious {
    @extend .error;
    border-width: 3px;
  }
}
```

对应的 css 代码：

```css
.error,
.error--serious {
  border: 1px #f00;
  background-color: #fdd;
}

.error--serious {
  border-width: 3px;
}
```

当一个 class 继承另一个 class，Sass 会为所有匹配继承 class 的元素设置样式，就好像它们也匹配被继承的 class 一样。当一个 class 继承另一个 class，它工作起来就像你将被继承的类添加到 HTML 中已经具有继承类的每个元素一样。你可以只写 `class="error--serious"`，Sass 会确保它的样式就像它和 `class="error"` 一样。

当然，选择器不仅仅在样式规则中使用。Sass 知道在使用选择器的任何地方进行继承。这确保你的元素的样式与被继承选择器完全匹配。

（个人觉得通过文字描述 extend 非常难理解，一些理论逻辑也很拗口，其实看代码就很容易明白。。。）

```scss
.error:hover {
  background-color: #fee;
}

.error--serious {
  @extend .error;
  border-width: 3px;
}
```

对应的 css 代码：

```css
.error:hover,
.error--serious {
  background-color: #fee;
}

.error--serious {
  border-width: 3px;
}
```

:::danger 注意
extend 在你的样式表其他部分被编译之后才会被解析。特别地，它解析发生父选择器被解析之后。这意味着如果你 `@extend .error`，这将不会影响里面的选择器 `.error { &__icon { ... } }`。这也意味着父选择器看不见继承的样式结果。
:::

## 它是如何工作的

不像 mixins 复制样式到当前样式规则中，@extend 更新包含被继承选择器的样式规则，以便继承者包含被继承选择器的样式。当继承选择器时，Sass 做到了智能统一：

- 它从不生成像 #main#footer 这样的选择器，这可能不会匹配任何元素
- 它确保复杂的选择器是交错的，这样无论 HTML 元素的嵌套顺序如何，它们都能正常工作。
- 它尽可能地修剪冗余选择器，同时仍然确保特异性大于或等于继承者的特异性。
- 它知道一个选择器何时匹配另一个选择器所做的一切，并且可以将它们组合在一起。
- 它智能地处理组合器、通用选择器和包含选择器的伪类。

```scss
.content nav.sidebar {
  @extend .info;
}

// 这将不会被继承，因为 p 和 nav 有冲突
p.info {
  background-color: #dee9fc;
}

// 不知道 `<div class="guide">` 将会在 `<div class="content">` 的外层还是里层, 所以 Sass 都会生成。
.guide .info {
  border: 1px solid rgba(#000, 0.8);
  border-radius: 2px;
}

// Sass 知道所有匹配 "main.content" 的元素也匹配  ".content"，避免生成不必要的交错选择器。
main.content .info {
  font-size: 0.8em;
}
```

对应生成的 css 代码：

```css
p.info {
  background-color: #dee9fc;
}

.guide .info,
.guide .content nav.sidebar,
.content .guide nav.sidebar {
  border: 1px solid rgba(#000, 0.8);
  border-radius: 2px;
}

main.content .info,
main.content nav.sidebar {
  font-size: 0.8em;
}
```

:::info 有趣的事实：
你可以使用选择器功能直接访问 Sass 的智能统一！该 `selector.unify()` 函数返回一个与两个选择器的交集相匹配的选择器，而该 `selector.extend()` 函数的工作方式与 @extend 类似，但在单个选择器上。
:::

:::danger 注意！
因为 @extend 更新包含扩展选择器的样式规则，所以它们的样式在级联中的优先级基于扩展选择器的样式规则出现的位置，而不是基于 @extend 出现的位置。这可能会造成混淆，但请记住：如果将扩展类添加到 HTML 中，这些规则的优先级相同 ！
:::

## 占位符选择器

### 概述

有时你只想写一个被用于继承的样式规则，而不想作为 css 输出，可以使用占位符选择器，以 `%` 开头。

```scss
.alert:hover,
%strong-alert {
  font-weight: bold;
}

%strong-alert:hover {
  color: red;
}
```

生成的 css 代码：

```css
.alert:hover {
  font-weight: bold;
}
```

### 私有占位符

像模块成员，如果占位符选择器以 `-` 或 `_` 开头，那么会被标记为私有。私有占位符选择器只能用于定义的样式表。对于其他样式表，就是不存在的。

## 强制性和可选继承

通常，如果一个 `@extend` 不匹配样式表中的任何选择器，Sass 将产生错误。这有助于防止拼写错误或重命名选择器而不重命名从它继承的选择器。要求扩展选择器存在的扩展是强制性的。

不过，这可能并不总是你想要的。如果你希望@extend 在扩展选择器不存在时什么也不做，只需添加 `!optional` 到末尾即可。

## 选 @extend 还是 @mixin

extends 和 mixins 都是 Sass 中对样式进行封装和复用的方式，这自然就产生了什么时候使用哪一种的问题。当你需要使用参数配置样式时，mixins 显然是必需的，但是如果它们只是一堆样式怎么办？

根据经验，当你表达语义类（或其他语义选择器）之间的关系时，extends 是最佳选择。因为带有 .error--serious class 的元素就是一个 error，所以它的样式继承于 `.error` 是有道理的。但是对于非语义的样式集合，编写一个 mixin 可以避免级联问题并使配置更容易。

:::info 有趣的事实：
大多数网络服务器使用一种非常擅长处理重复的相同文本块的算法来压缩它们所服务的 CSS。这意味着，虽然 mixins 可能会产生比 extends 更多的 CSS，但它们可能不会显着增加用户需要下载的数量。因此，选择对你的用例最有意义的功能，而不是生成最少 CSS 的功能 ！
:::
