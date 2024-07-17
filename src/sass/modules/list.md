# sass:list

:::info 有趣的事实
在 Sass 里面，每个映射对于每对键值对可以当作一个包含两个元素的列表。例如，`(1: 2, 3: 4)` 当作 `(1 2, 3 4)`。所以列表 list 的所有函数都可以用于映射 map。

单个值也可以当作列表。所有这些函数对待 `1px` 当作一个包含值 `1px` 的列表。
:::

```scss
list.append($list, $val, $separator: auto)
append($list, $val, $separator: auto) //=> list
```

返回 `$list` 在末尾添加了 `$val` 之后的拷贝列表。

如果 `$separator` 是 `comma`、`space` 或者 `slash`，那么返回的列表就是对应的逗号分隔、空格分隔或者斜线分割的。如果是默认参数 `auto`，那么列表会使用和参数 `$list` 相同的分隔符。

注意这不像 `list.join()` 函数，如果 `$val` 是一个列表，它将会被嵌套在返回的列表中，而不是将它所有的元素添加到返回列表的结尾。

```scss
@use "sass:list";

@debug list.append(10px 20px, 30px); // 10px 20px 30px
@debug list.append((blue, red), green); // blue, red, green
@debug list.append(10px 20px, 30px 40px); // 10px 20px (30px 40px)
@debug list.append(10px, 20px, $separator: comma); // 10px, 20px
@debug list.append((blue, red), green, $separator: space); // blue red green
```

```scss
list.index($list, $value)
index($list, $value) //=> number / null
```

返回 `$value` 值在 `$list` 列表中的索引。

如果 `$value` 不存在 `$list` 中，将返回 `null`。如果 `$value` 多次出现在 `$list` 列表中，将返回它第一次出现的索引。

```scss
@use "sass:list";

@debug list.index(1px solid red, 1px); // 1
@debug list.index(1px solid red, solid); // 2
@debug list.index(1px solid red, dashed); // null
```

```scss
list.is-bracketed($list)
is-bracketed($list) //=> boolean
```

`is-bracketed()` 函数返回 `$list` 列表是否包含方括号。

```scss
@use "sass:list";

@debug list.is-bracketed(1px 2px 3px); // false
@debug list.is-bracketed([1px, 2px, 3px]); // true
```

```scss
list.join($list1, $list2, $separator: auto, $bracketed: auto)
join($list1, $list2, $separator: auto, $bracketed: auto) //=> list
```

`join()` 函数返回一个包含 `$list1` 后跟着 `$list2` 两个列表所有元素的新列表。

:::danger 注意！
由于单个值算作单元素列表，因此可以使用 `list.join()` 将值添加到列表末尾。但是，不建议这样做，因为如果该值是列表，它将被连接起来，这可能不是您所期望的。

用 `list.append()` 向列表添加单个值。`list.join()` 仅用来将两个列表合并为一个。
:::

如果 `$separator` 是 `comma`、`space` 或者 `slash`，那么返回的列表就是对应的逗号分隔、空格分隔或者斜线分割的。如果是默认参数 `auto`，那么列表会使用和参数 `$list1` 相同的分隔符（如果有的话），否则返回 `$list2` 的分隔符（如果有的话），如果都没有则返回 `space` 空格。其他值是不被允许的。

如果 `$bracketed` 是 `auto`（默认值），返回的列表和 `$list1` 是否有方括号一样。如果不是默认参数，如果 `$bracketed` 为真值则带方括号，如果为假值则不带方括号。

```scss
@use "sass:list";

@debug list.join(10px 20px, 30px 40px); // 10px 20px 30px 40px
@debug list.join((blue, red), (#abc, #def)); // blue, red, #abc, #def
@debug list.join(10px, 20px); // 10px 20px
@debug list.join(10px, 20px, $separator: comma); // 10px, 20px
@debug list.join(
  (blue, red),
  (#abc, #def),
  #separator: space
); // blue red #abc #def
@debug list.join([10px], 20px); // [10px 20px]
@debug list.join(10px, 20px, $bracketed: true); // [10px, 20px]
```

```scss
list.length($list)
length($list) //=> number
```

返回 `$list` 列表的长度。

也可以返回映射中对的数量。

```scss
@use "sass:list";

@debug list.length(10px); // 1
@debug list.length(10px 20px 30px); // 3
@debug list.length(
  (
    width: 10px,
    height: 20px,
  )
); // 2
```

```scss
list.separator($list)
list-separator($list) //=> unquoted string
```

返回 `$list` 列表使用的分隔符名称——`space`、`comma` 或者 `slash`。

如果 `$list` 没有分隔符，则返回 `space`。

```scss
@use "sass:list";

@debug list.separator(1px 2px 3px); // space
@debug list.separator((1px, 2px, 3px)); // comma
@debug list.separator("Helvetica"); // space
@debug list.separator(()); // space
```

```scss
list.nth($list, $n)
nth($list, $n)
```

以上两个函数返回 `$list` 的第 `$n` 个元素。

如果 `$n` 是负数，它会从 `$list` 列表的最后开始数。如果没有该索引的元素，将会抛出错误。

```scss
@use "sass:list";

@debug list.nth(10px 12px 16px, 2); // 12px
@debug list.nth([line1, line2, line3], -1); // line3
```

```scss
list.set-nth($list, $n, $value)
set-nth($list, $n, $value) //=> list
```

将 `$list` 列表索引 `$n` 的元素替代成 `$value`，并返回其拷贝。

如果 `$n` 是负数，则从 `$list` 的末尾开始数。如果没有该索引的元素，将会抛出错误。

```scss
@use "sass:list";

@debug list.set-nth(10px 20px 30px, 1, 2em); // 2em 20px 30px
@debug list.set-nth(10px 20px 30px, -1, 8em); // 10px, 20px, 8em
@debug list.set-nth(
  (Helvetica, Arial, sans-serif),
  3,
  Roboto
); // Helvetica, Arial, Roboto
```

```scss
list.slash($elements...) //=> list
```

返回包含 `$elements` 元素的斜杠分隔列表。

:::danger 注意！
此功能是创建斜线分隔列表的临时解决方案。最终，它们将以斜线的形式逐字书写，如 `1px / 2px / solid`，但目前斜线是用于除法 ，因此在旧语法被删除之前，Sass 不能将它们用于新语法。
:::

```scss
@use "sass:list";

@debug list.slash(1px, 50px, 100px); // 1px / 50px / 100px
```

```scss
list.zip($lists...)
zip($lists...) //=> list
```

将 `$lists` 每个列表合并为一个子列表列表。

返回列表中的每个元素都包含 `$lists` 中该位置的所有元素。返回列表的长度与 `$lists` 中最短列表的长度相同。

返回的列表始终以逗号分隔，子列表始终以空格分隔。

```scss
@use "sass:list";

@debug list.zip(
  10px 50px 100px,
  short mid long
); // 10px short, 50px mid, 100px long
@debug list.zip(10px 50px 100px, short mid); // 10px short, 50px mid
```
