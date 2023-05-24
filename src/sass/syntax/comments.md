# Sass 语法注释

Sass 注释在 SCSS 语法和缩进语法中工作相当不同。两个语法都支持这两个类型的注释：使用定义的注释 `/* ... */` （通常）会编译为 CSS，并且使用定义的注释 `// ...` 不会编译到 CSS 中。

## 在 SCSS 语法中

SCSS 的注释和其他语言如 JavaScript 工作起来类似。单行注释以 `//` 开始，并且一直到行末尾。单行注释中的所有内容都不会存在于 CSS 中；就 Sass 而言，他们可能不会存在。他们也被称为沉默注释（silent comments），因为他们不会产生任何 CSS。

多行注释以 `/*` 开头并以下一个 `*/` 结束。如果一个多行注释被写在一个语句允许的地方，它会被编译成 CSS 注释。和沉默注释相比，它也被称为大声注释（loud comments）。一个被编译成 CSS 注释的多行注释可能包含插值，这个插值将在编译之前就被评估（evaluated）。

默认情况下，多行注释会在 CSS 压缩编译模式下被剥离。如果这个多行注释以 `/*!` 开头，他将会保存在 CSS 输出中。

比如这个 SCSS 代码：

```scss
// This comment won't be included in the CSS.

/* But this comment will, except in compressed mode. */

/* It can also contain interpolation:
 * 1 + 1 = #{1 + 1} */

/*! This comment will be included even in compressed mode. */

p /* Multi-line comments can be written anywhere
   * whitespace is allowed. */ .sans {
  font: Helvetica,
    // So can single-line comments.
    sans-serif;
}
```

生成的 CSS 代码：

```css
/* But this comment will, except in compressed mode. */
/* It can also contain interpolation:
 * 1 + 1 = 2 */
/*! This comment will be included even in compressed mode. */
p .sans {
  font: Helvetica, sans-serif;
}
```

## 在 Sass 语法中

在缩进语法中的注释工作有一点不同：它们是基于缩进的，就像其他的语法。和 SCSS 语法一样，以 `//` 开头的沉默注释从不作为 CSS 发出（emitted as），和 SCSS 不同的是，在 `//` 开头下方缩进的所有内容也会被注释掉。

以 `/*`开头的缩进语法注释工作起来和缩进语法一样，除了它们会被编译成 CSS。因为注释的范围是基于缩进的，所以结束的 `*/` 是可选的。同样和 SCSS 语法一样的是，`/*` 注释可以包含插值，并且以 `/*!` 开头可以避免在压缩编译模式下被去除。

注释也可以被用在缩进语法的表达式中。在这个例子中，在这种情况下，它们的语法与 SCSS 中的语法完全相同。

```sass
// This comment won't be included in the CSS.
   This is also commented out.

/* But this comment will, except in compressed mode.

/* It can also contain interpolation:
   1 + 1 = #{1 + 1}

/*! This comment will be included even in compressed mode.

p .sans
  font: Helvetica, /* Inline comments must be closed. */ sans-serif
```

生成的 CSS 代码：

```css
/* But this comment will, except in compressed mode. */
/* It can also contain interpolation:
 * 1 + 1 = 2 */
/*! This comment will be included even in compressed mode. */
p .sans {
  font: Helvetica, sans-serif;
}
```

## 文档注释

使用 Sass 编写样式库时，您可以使用注释来记录您的库提供的混入、函数、变量和占位符选择器，以及库本身。 这些注释由 SassDoc 工具读取，该工具使用它们生成漂亮的文档。

文档注释是无声注释，用三个斜杠 (///) 写在您正在记录的内容的正上方。 SassDoc 将注释中的文本解析为 Markdown，并支持许多有用的注释来对其进行详细描述。

SCSS 代码：

```scss
/// Computes an exponent.
///
/// @param {number} $base
///   The number to multiply by itself.
/// @param {integer (unitless)} $exponent
///   The number of `$base`s to multiply together.
/// @return {number} `$base` to the power of `$exponent`.
@function pow($base, $exponent) $result: 1 @for $_ from 1 through $exponent $result:
  $result * $base @return $result;
```

Sass 代码：

```sass
/// Computes an exponent.
///
/// @param {number} $base
///   The number to multiply by itself.
/// @param {integer (unitless)} $exponent
///   The number of `$base`s to multiply together.
/// @return {number} `$base` to the power of `$exponent`.
@function pow($base, $exponent)
  $result: 1
  @for $_ from 1 through $exponent
    $result: $result * $base

  @return $result

```
