# Sass null

`null` 是 null 类型唯一一个值。它表示缺少值，常用于函数返回值表示没有预期的结果。

```scss
@use "sass:map";
@use "sass:string";

@debug string.index("Helvetica Neue", "Roboto"); // null
@debug map.get(
  (
    "large": 20px,
  ),
  "small"
); // null
@debug &; // null
```

如果一个列表包含 `null` 值，`null` 将会在生成 css 时被删除。

:::code-group

```scss
$fonts: (
  "serif": "Helvetica Neue",
  "monospace": "Consolas",
);

h3 {
  font: 18px bold map-get($fonts, "sans");
}
```

```css
h3 {
  font: 18px bold;
}
```

:::

如果属性值为 `null`，该属性直接被忽略。

:::code-group

```scss
$fonts: (
  "serif": "Helvetica Neue",
  "monospace": "Consolas",
);

h3 {
  font: {
    size: 18px;
    weight: bold;
    family: map-get($fonts, "sans");
  }
}
```

```css
h3 {
  font-size: 18px;
  font-weight: bold;
}
```

:::

`null` 同样为 `falsey` 假性的，意味着会被当做 `false` 处理。

:::code-group

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

:::
