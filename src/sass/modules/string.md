# sass:string

```scss
string.quote($string)
quote($string) //=> string
```

返回 `$string` 的带引号形式的字符串。

```scss
@use "sass:string";

@debug string.quote(Helvetica); // "Helvetica"
@debug string.quote("Helvetica"); // "Helvetica"
```

```scss
string.index($string, $substring)
str-index($string, $substring) //=> number
```

返回 `$string` 中的 `$substring` 第一个索引，或返回 `null` 如果 `$string` 不包含 `$substring`。

```scss
@use "sass:string";

@debug string.index("Helvetica Neue", "Helvetica"); // 1
@debug string.index("Helvetica Neue", "Neue"); // 11
```

```scss
string.insert($string, $insert, $index)
str-insert($string, $insert, $index) //=> string
```

返回在 `$index` 位置插入 `$inset` 之后的 `$string` 拷贝。

```scss
@use "sass:string";

@debug string.insert("Roboto Bold", " Mono", 7); // "Roboto Mono Bold"
@debug string.insert("Roboto Bold", " Mono", -6); // "Roboto Mono Bold"
```

如果 `$index` 超过了 `$string` 这字符串的长度，`$insert` 会被添加到末尾。如果 `$index` 小于字符串长度的负数，`insert` 会添加到字符串的开头。

```scss
@use "sass:string";

@debug string.insert("Roboto", " Bold", 100); // "Roboto Bold"
@debug string.insert("Bold", "Roboto ", -100); // "Roboto Bold"
```

```scss
string.length($string)
str-length($string) //=> number
```

返回 `$string` 的字符数量。

```scss
@use "sass:string";

@debug string.length("Helvetica Neue"); // 14
@debug string.length(bold); // 4
@debug string.length(""); // 0
```

```scss
string.slice($string, $start-at, $end-at: -1)
str-slice($string, $start-at, $end-at: -1) //=> string
```

返回 `$string` 从索引 `$start-at` 开始到索引 `$end-at` 结束（包括两者）的切片。

```scss
@use "sass:string";

@debug string.slice("Helvetica Neue", 11); // "Neue"
@debug string.slice("Helvetica Neue", 1, 3); // "Hel"
@debug string.slice("Helvetica Neue", 1, -6); // "Helvetica"
```

```scss
string.split($string, $separator, $limit: null) //=> list
```

返回 `$string` 用 `$separator`分隔的括号内逗号分隔的子字符串列表。这些子字符串中不包含 `$separator`。

如果 `$limit` 是数字 `1` 或更高，则最多拆分多个 `$separators`（因此最多返回 `$limit + 1` 字符串）。最后一个子字符串包含字符串的其余部分，包括任何剩余的 `$separators`。

```scss
@use "sass:string";

@debug string.split("Segoe UI Emoji", " "); // ["Segoe", "UI", "Emoji"]
@debug string.split("Segoe UI Emoji", " ", $limit: 1); // ["Segoe", "UI Emoji"]
```

```scss
string.to-upper-case($string)
to-upper-case($string) //=> string
```

返回将 `$string` ASCII 字母转换为大写字母的副本。

```scss
@use "sass:string";

@debug string.to-upper-case("Bold"); // "BOLD"
@debug string.to-upper-case(sans-serif); // SANS-SERIF
```

```scss
@use "sass:string";

@debug string.to-upper-case("Bold"); // "BOLD"
@debug string.to-upper-case(sans-serif); // SANS-SERIF
```

```scss
string.to-lower-case($string)
to-lower-case($string) //=> string
```

返回将 `$string` ASCII 字母转换为小写字母的副本。

```scss
@use "sass:string";

@debug string.to-lower-case("Bold"); // "bold"
@debug string.to-lower-case(SANS-SERIF); // sans-serif
```

```scss
string.unique-id()
unique-id() //=> string
```

返回一个随机生成的不带引号的字符串，保证它是有效的 CSS 标识符，并且在当前 Sass 编译中是唯一的。

```scss
@use "sass:string";

@debug string.unique-id(); // uabtrnzug
@debug string.unique-id(); // u6w1b1def
```

```scss
string.unquote($string)
unquote($string) //=> string
```

返回 `$string` 不带引号的字符串。这可能会产生无效 CSS 字符串，因此请谨慎使用。

```scss
@use "sass:string";

@debug string.unquote("Helvetica"); // Helvetica
@debug string.unquote(".widget:hover"); // .widget:hover
```
