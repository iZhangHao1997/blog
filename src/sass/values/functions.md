# Sass Functions

函数也可以是一个值。你不能直接写一个函数作为一个值，但是你可以传递函数名称给函数 `meta.get-function()` 来获得它作为一个值。一旦你有了一个函数值，你可以将它传递给 `meta.call()` 函数来调用它。这对于编写调用其他函数的高阶函数非常有用。

:::code-group

```scss
@use "sass:list";
@use "sass:meta";
@use "sass:string";

/// Return a copy of $list with all elements for which $condition returns `true`
/// removed.
@function remove-where($list, $condition) {
  $new-list: ();
  $separator: list.separator($list);
  @each $element in $list {
    @if not meta.call($condition, $element) {
      $new-list: list.append($new-list, $element, $separator: $separator);
    }
  }
  @return $new-list;
}

$fonts: Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;

.content {
  @function contains-helvetica($string) {
    @return string.index($string, "Helvetica");
  }
  font-family: remove-where($fonts, meta.get-function("contains-helvetica"));
}
```

```css
.content {
  font-family: Tahoma, Geneva, Arial, sans-serif;
}
```

:::
