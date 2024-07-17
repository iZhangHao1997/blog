# sass:map

:::info 有趣的事实：
Sass 库和设计系统倾向于共享和覆盖以嵌套映射（包含映射的映射的映射 ）表示的配置。

为了帮助您使用嵌套映射，一些映射函数支持深度操作。例如，如果您将多个键传递给 `map.get()`，它将按照这些键找到所需的嵌套映射：

```scss
@use "sass:map";

$config: (
  a: (
    b: (
      c: d,
    ),
  ),
);
@debug map.get($config, a, b, c); // d
```

:::

```scss
map.deep-merge($map1, $map2) //=> map
```

和 `map.merge()` 相同，只是嵌套映射值也是递归合并的。

```scss
@use "sass:map";

$helvetica-light: (
  "weights": (
    "lightest": 100,
    "light": 300,
  ),
);
$helvetica-heavy: (
  "weights": (
    "medium": 500,
    "bold": 700,
  ),
);

@debug map.deep-merge($helvetica-light, $helvetica-heavy);
// (
//   "weights": (
//     "lightest": 100,
//     "light": 300,
//     "medium": 500,
//     "bold": 700
//   )
// )
@debug map.merge($helvetica-light, $helvetica-heavy);
// (
//   "weights": (
//     "medium: 500,
//     "bold": 700
//   )
// )
```

```scss
map.deep-remove($map, $key, $keys...) //=> map
```

如果 `$keys` 为空，则返回不包含与 `$key` 之关联的值的 `$map` 副本。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.deep-remove($font-weights, "regular");
// ("medium": 500, "bold": 700)
```

如果 `$keys` 不为空，根据 `keys` 集合在嵌套 `$map`中从左到右找到中查找。

返回目标映射中没有与 `$keys` 中的最后一个键关联的值的 `$map` 副本。

```scss
@use "sass:map";

$fonts: (
  "Helvetica": (
    "weights": (
      "regular": 400,
      "medium": 500,
      "bold": 700,
    ),
  ),
);

@debug map.deep-remove($fonts, "Helvetica", "weights", "regular");
// (
//   "Helvetica": (
//     "weights: (
//       "medium": 500,
//       "bold": 700
//     )
//   )
// )
```

```scss
map.get($map, $key, $keys...)
map-get($map, $key, $keys...)
```

如果 `$keys` 为空，则返回 `$map` 中与 `$key` 关联的值。

如果 `$map` 中没有与 `$key` 关联的值，则返回 `null`。

```scss
@use "sass:map";
$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.get($font-weights, "medium"); // 500
@debug map.get($font-weights, "extra-bold"); // null
```

如果 `$keys` 不为空，根据 `keys` 集合在嵌套 `$map`中从左到右找到中查找。

返回目标映射中没有与 `$keys` 中的最后一个键关联的值的 `$map` 副本。

如果 `$map` 中没有对应关联的值则返回 `null`。

```scss
@use "sass:map";

$fonts: (
  "Helvetica": (
    "weights": (
      "regular": 400,
      "medium": 500,
      "bold": 700,
    ),
  ),
);

@debug map.get($fonts, "Helvetica", "weights", "regular"); // 400
@debug map.get($fonts, "Helvetica", "colors"); // null
```

```scss
map.has-key($map, $key, $keys...)
map-has-key($map, $key, $keys...) //=> boolean
```

如果 `$keys` 为空，则返回 `$map` 中是否包含 `$key` 关联的值。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.has-key($font-weights, "regular"); // true
@debug map.has-key($font-weights, "bolder"); // false
```

和上面几个函数相同，如果有 `$keys` 参数则嵌套查找。

```scss
@use "sass:map";

$fonts: (
  "Helvetica": (
    "weights": (
      "regular": 400,
      "medium": 500,
      "bold": 700,
    ),
  ),
);

@debug map.has-key($fonts, "Helvetica", "weights", "regular"); // true
@debug map.has-key($fonts, "Helvetica", "colors"); // false
```

```scss
map.keys($map)
map-keys($map) //=> list
```

以逗号分隔的列表形式，返回 `$map` 中所有的键值。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.keys($font-weights); // "regular", "medium", "bold"
```

```scss
map.merge($map1, $map2)
map-merge($map1, $map2)
map.merge($map1, $keys..., $map2)
map-merge($map1, $keys..., $map2) //=> map
```

:::danger 注意！
实际上，传递给 `map.merge($map1, $keys..., $map2)` 的实际参数。这里将它们描述为 `$map1, $keys..., $map2` 仅用于解释目的。
:::

如果 `$keys` 没有传递，返回一个由 `$map1` 和 `$map2` 组成新的映射。

如果 `$map1` 和 `$map2` 具有相同的键，`$map2` 则的值优先 。

返回映射中所有出现在 `$map1` 中的键的顺序与 `$map1` 中的相同。 来自 `$map2` 的新键出现在映射的末尾 。

```scss
@use "sass:map";

$light-weights: (
  "lightest": 100,
  "light": 300,
);
$heavy-weights: (
  "medium": 500,
  "bold": 700,
);

@debug map.merge($light-weights, $heavy-weights);
// ("lightest": 100, "light": 300, "medium": 500, "bold": 700)
```

如果 `$keys` 不为空，则按照 `$keys` 查找要合并的嵌套映射。如果 `$keys` 中的任何键在映射中缺失或引用了非映射的值，则将该键的值设置为空映射。

返回 `$map1` 的副本，其中目标映射被新映射替换，该新映射包含目标映射和 `$map2` 的所有键和值。

```scss
@use "sass:map";

$fonts: (
  "Helvetica": (
    "weights": (
      "lightest": 100,
      "light": 300,
    ),
  ),
);
$heavy-weights: (
  "medium": 500,
  "bold": 700,
);

@debug map.merge($fonts, "Helvetica", "weights", $heavy-weights);
// (
//   "Helvetica": (
//     "weights": (
//       "lightest": 100,
//       "light": 300,
//       "medium": 500,
//       "bold": 700
//     )
//   )
// )
```

```scss
map.remove($map, $keys...)
map-remove($map, $keys...) //=> map
```

返回 `$map` 的副本，但不包含任何与之 `$keys` 关联的值。

如果 `$map` 中的键 `$keys`没有关联值，则会被忽略。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.remove($font-weights, "regular"); // ("medium": 500, "bold": 700)
@debug map.remove($font-weights, "regular", "bold"); // ("medium": 500)
@debug map.remove($font-weights, "bolder");
// ("regular": 400, "medium": 500, "bold": 700)
```

```scss
map.set($map, $key, $value)
map.set($map, $keys..., $key, $value) //=> map
```

:::danger 注意！
实际上，作为 `map.set($map, $keys..., $key, $value)` 的实际参数传递 `map.set($map, $args...)` 。这里仅将 `$map, $keys..., $key, $value` 它们描述为用于解释目的。
:::

如果 `$keys` 未传递，则返回 `$map` 的副本，并将 `$key` 的值设置为 `$value`。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.set($font-weights, "regular", 300);
// ("regular": 300, "medium": 500, "bold": 700)
```

如果 `$keys` 传递了，则按照 `$keys` 查找要更新的嵌套映射。如果 `$keys` 映射中缺少任何键或引用了非映射的值，则将该键的值设置为空映射。

返回一个 `$map` 副本，其中目标映射的值 `$key` 设置为 `$value`。

```scss
@use "sass:map";

$fonts: (
  "Helvetica": (
    "weights": (
      "regular": 400,
      "medium": 500,
      "bold": 700,
    ),
  ),
);

@debug map.set($fonts, "Helvetica", "weights", "regular", 300);
// (
//   "Helvetica": (
//     "weights": (
//       "regular": 300,
//       "medium": 500,
//       "bold": 700
//     )
//   )
// )
```

```scss
map.values($map)
map-values($map) //=> list
```

返回一个 `$map` 中的值组成的由逗号分隔的映射。

```scss
@use "sass:map";

$font-weights: (
  "regular": 400,
  "medium": 500,
  "bold": 700,
);

@debug map.values($font-weights); // 400, 500, 700
```
