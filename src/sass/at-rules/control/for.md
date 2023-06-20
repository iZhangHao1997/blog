# Sass @for

`@for` 规则语法为 `@for <variable> from <expression> to <expression>` 或者 `@for <variable> from <expression> through <expression>`，从第一个 `expression` 表达式的值开始数，遍历到第二个表达式的 `expression` 的值。遍历时的每个数字将会赋值给 `variable` 变量名称。如果使用 `to` 语法，最后一个数字将会被排除在外；如果使用 `through` 语法，最后一个值将会被包含在内。比如下面的 scss 代码：

```scss
$base-color: #036;

@for $i from 1 through 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}

@for $i from 1 to 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}
```

```scss
$base-color: #036;

@for $i from 1 to 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}
```

分别对应的 css 代码：

```css
ul:nth-child(3n + 1) {
  background-color: #004080;
}

ul:nth-child(3n + 2) {
  background-color: #004d99;
}

ul:nth-child(3n + 3) {
  background-color: #0059b3;
}
```

```css
ul:nth-child(3n + 1) {
  background-color: #004080;
}

ul:nth-child(3n + 2) {
  background-color: #004d99;
}
```
