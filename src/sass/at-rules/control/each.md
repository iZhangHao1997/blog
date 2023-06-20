# Sass @each

@each 规则可以通过遍历一个 [list](../../values/lists.md) 的元素、[map](../../values/maps.md)的每对值来生成样式代码。这对于只有少量变量的重复性样式来说是很方便的。语法为 `@eatch <variable> in <expression> { ... }`，其中 `expression` 返回一个列表。依次地遍历列表中的每一个元素，然后将元素赋值给对应的变量名。如下 scss 代码：

```scss
$sizes: 40px, 50px, 80px;

@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}
```

对应生成的 css 代码为：

```css
.icon-40px {
  font-size: 40px;
  height: 40px;
  width: 40px;
}

.icon-50px {
  font-size: 50px;
  height: 50px;
  width: 50px;
}

.icon-80px {
  font-size: 80px;
  height: 80px;
  width:
```

## 遍历 Maps

你也可以使用 `@each` 遍历 map 中的的每一组键/值，语法为 `@each <variable>, <variable> in <expression> { ... }`。键值被赋予在第一个变量，值被赋予在第二个变量。如下 scss 代码：

```scss
$icons: (
  "eye": "\f112",
  "start": "\f12e",
  "stop": "\f12f",
);

@each $name, $glyph in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
  }
}
```

对应生成的 css 代码：

```css
@charset "UTF-8";
.icon-eye:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f112";
}

.icon-start:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f12e";
}

.icon-stop:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f12f";
}
```

## 解构

如果你的 lists 中的元素是一个列列表，你可以使用 `@each` 自动地将元素列表的值赋值解构赋值给变量，语法为 `@each <variable...> in expression { ... }`。每个值都会通过位置解构给对应位置的变量名，如果没有足够的值，变量会被赋与 `null`。如下 scss 代码：

```scss
$icons: "eye" "\f112"12px, "start" "\f12e"16px, "stop" "\f12f"10px;

@each $name, $glyph, $size in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
    font-size: $size;
  }
}
```

对应生成的 css 代码：

```css
.icon-eye:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f112";
  font-size: 12px;
}

.icon-start:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f12e";
  font-size: 16px;
}

.icon-stop:before {
  display: inline-block;
  font-family: "Icon Font";
  content: "\f12f";
  font-size: 10px;
}
```

:::info 有趣的事实：
因为 `@each` 支持解构并且将 map 当作列表元素列表，`@each` 的 map 支持工作不需要专门的支持。其实列表元素列表和 maps 映射是可以等价的，如上面的代码例子，`$icons` 也可以写作 `$icons: ("eye": "\f112" 12px, "start": "\f12e" 16px, "stop": "\f12f" 10px)`
:::
