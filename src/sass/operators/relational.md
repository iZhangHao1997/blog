# Sass 关系操作符 Relational Operators

关系操作用来符判断两个数字的大小。它们会自动转换为相同的单位。

- `<expression> < <expression>` 返回第一个表达式的值是否小于第二个表达式的值。
- `<expression> <= <expression>` 返回第一个表达式的值是否小于或者等于第二个表达式的值。
- `<expression> > <expression>` 返回第一个表达式的值是否大于第二个表达式的值。
- `<expression> >= <expression>` 返回第一个表达式的值是否大于或者等于第二个表达式的值。

```scss
@debug 100 > 50; // true
@debug 10px < 17px; // true
@debug 96px >= 1in; // true
@debug 1000ms <= 1s; // true
```

不带单位的数字可以和任何数字比对。它们会自动转化为另一个数字的单位。

```scss
@debug 100 > 50px; // true
@debug 10px < 17; // true
```

单位不兼容的数字不能被比较。

```scss
@debug 100px > 10s;
//     ^^^^^^^^^^^
// Error: Incompatible units px and s.
```
