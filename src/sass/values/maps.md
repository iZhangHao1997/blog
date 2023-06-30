# Sass Maps

Sass 中的 Maps 是键值对，通过相应的 `key` 值查找相应的值。语法为 `(<key>: <value>, <key>: <value>)`。`key` 代表键值，`value` 代表 `key` 的关联值。`key` 值必须是唯一的，`value` 值可以重复。不像列表的是，映射 Maps 必须用圆括号括起来。空映射写作 `()`。

:::info 有趣的事实：
精明的阅读者可能发现了空列表和空映射都是写作 `()`。那是因为它可以被同时当做列表和映射。实际上，所有的映射都可以当做列表。每个映射当做列表时，代表着列中标的每个元素是双元素。例如 `(1: 2, 3: 4)` 被当做 `(1 2, 3 4)`。
:::

映射允许 Sass 任何类型的值作为键值。[== 操作符](../operators/equality.md) 用来被判断两个键值是否是一样的。

:::danger 注意！
大多数时间来说，使用带引号的字符串而不是不带引号的字符串作为映射的键值是更好的主意。这是因为有些值，比如颜色的名字，可能看起来像不带引号的字符串，但实际上是其他类型的值而不是字符串。为了避免这些令人疑惑的问题，请使用带引号的字符串。
:::

## 使用 Maps

因为 maps 不有效的 css 值，因此它们本身不会做太多的事情。因此 sass 提供了一堆函数来创建 maps 和访问映射包含的值。

### 查找一个值

maps 是关于键值之间的联系，所以自然地就有一个方法通过键的值来查找对应的值：`map.get($map, $key)` 函数。这个函数返回所给定键的值所对应的值。如果该 maps 不包含这个 `key` 值则返回 `null`。

```scss
$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.get($font-weights, "medium"); // 500
@debug map.get($font-weights, "extra-bold"); // null
```

### 遍历 maps 键值对

这实际上不使用函数，但也是使用 maps 最常用的方法。使用 [@each 规则](../at-rules/control/each.md) 通过遍历 maps 中每一对键值对来触发样式块里的内容。`key` 和 `value` 的值将会被赋值给样式块中对应的变量。

:::code-group

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

```css
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

:::

### 往 maps 中添加新的值

对 maps 新增或者替换新的键值对也是非常有用的。`map.set($map, $key, $value)` 函数即可做到，它返回一个新的 map。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.set($font-weights, "extra-bold", 900);
// ("regular": 400, "medium": 500, "bold": 700, "extra-bold": 900)
@debug map.set($font-weights, "bold", 900);
// ("regular": 400, "medium": 500, "bold": 900)
```

与其一个一个地设置值，你也可以使用 `map.merge($map1, $map2)` 合并两个已经存在的 map。

```scss
@use "sass:map";

$light-weights: (
  "lightest": 100,
  "light": 300,
);
$heavy-weights: (
  "medium": 500,
  "bold": 700,
  "light": 500,
);

@debug map.merge($light-weights, $heavy-weights);
// ("lightest": 100, "light": 500, "medium": 500, "bold": 700)
```

如果两个 map 有相同的 key 值，则后面的 map 覆盖前者 map 对应 key 的值。

注意因为 Sass 的 maps 是不可变的，`map.set()` 和 `map.merge()` 都不会修改原有的 map。

## Maps 不变性

Sass 中的 maps 是不可变的，意味着 map 中的内容永远不会改变。Sass 中所有映射的函数都是返回一个新的列表而不是改变原有列表。不变性会帮助避免很多比较隐性的 bug，比如多个样式表共用同一个映射的时候，bug 就有可能悄悄出现了。

你可以通过赋值给那个变量一个新的映射来更新你的状态。这经常被用在函数和混入中，收集一堆值到一个映射中。

```scss
@use "sass:map";

$prefixes-by-browser: (
  "firefox": moz,
  "safari": webkit,
  "ie": ms,
);

@mixin add-browser-prefix($browser, $prefix) {
  $prefixes-by-browser: map.merge(
    $prefixes-by-browser,
    (
      $browser: $prefix,
    )
  ) !global;
}

@include add-browser-prefix("opera", o);
@debug $prefixes-by-browser;
// ("firefox": moz, "safari": webkit, "ie": ms, "opera": o)
```
