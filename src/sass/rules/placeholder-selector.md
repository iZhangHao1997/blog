# Sass 占位符选择器

Sass 有一特别的选择器，称为”占位符“。它看起来和行为很像类选择器，但它以一个 `%` 开头并且不包含在 CSS 输出中。事实上，任何包含占位符选择器的复杂的选择器（逗号之间的选择器），都不会输出在 CSS 中，包含占位符的样式规则也不会输出 CSS。

例如：

:::code-group

```scss
.alert:hover,
%strong-alert {
  font-weight: bold;
}

%strong-alert:hover {
  color: red;
}
```

```css
.alert:hover {
  font-weight: bold;
}
```

:::

这种选择器有什么用？它仍然可以 [extended](../at-rules/extend)。与类选择器不同，如果占位符没有被 `extended` ，占位符不会使 CSS 混乱，并且它们不会强制库的用户为他们的 HTML 使用特定的类名。

例如：
:::code-group

```scss
%toolbelt {
  box-sizing: border-box;
  border-top: 1px rgba(#000, 0.12) solid;
  padding: 16px 0;
  width: 100%;

  &:hover {
    border: 2px rgba(#000, 0.5) solid;
  }
}

.action-buttons {
  @extend %toolbelt;
  color: #4285f4;
}

.reset-buttons {
  @extend %toolbelt;
  color: #cddc39;
}
```

```css
.action-buttons,
.reset-buttons {
  box-sizing: border-box;
  border-top: 1px rgba(0, 0, 0, 0.12) solid;
  padding: 16px 0;
  width: 100%;
}
.action-buttons:hover,
.reset-buttons:hover {
  border: 2px rgba(0, 0, 0, 0.5) solid;
}

.action-buttons {
  color: #4285f4;
}

.reset-buttons {
  color: #cddc39;
}
```

:::

占位符选择器在编写可能会或可能不会使用每个样式规则的 Sass 库时很有用。根据经验，如果您只是为自己的应用程序编写样式表，那么最好只扩展一个可用的类选择器。
