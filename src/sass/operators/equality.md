# Sass 等式运算符 Equality Operators

等式运算符返回两个值是否相等。写作 `<expression> == <expression>`，返回两个表达式是否相等；`<expression> != <expression>` 返回两个值是否不相等。如果两个值的类型和值都相等，那就被认为是相等的，这意味着对不同的类型是不同的：

- [数字 numbers](../values/numbers.md)的值和单位如果都是相等的，或者它们的值单位相互转换后的值相等，则数字相等。
- [字符串 strings](../values/strings.md)比较不寻常，带引号的字符串和不带引号的字符串只要内容相等，都被视为相等。
- [颜色 colors](../values/colors.md)值在它们有相同红色、蓝色、绿色和 alpha 值时，被视为相等。
- [列表 lists](../values/lists.md)是相等的如果它们的内容是相等的（顺序要相同）。逗号分隔的列表和空格分隔的列表是不相等的，并且方括号列表和非方括号列表也是不相等的。
- [映射 maps](../values/maps.md)是相等的如果它们的键和值都对应相等。
- [计算 calculations](../values/calculations.md)被视为相等，如果它们的名字和参数是全部相等的。操作参数按文本进行比较。
- [true，false](../values/booleans.md) 和 [null](../values/null.md) 只和它们自己本身相等。
- [函数 functions](../values/functions.md)和相同的函数视为相等。函数是对比其引用，所以当两个函数有相同的名字和定义，它们是被认为是不同如果它们没有在定义在相同地方。

```scss
@debug 1px == 1px; // true
@debug 1px != 1em; // true
@debug 1 != 1px; // true
@debug 96px == 1in; // true

@debug "Helvetica" == Helvetica; // true
@debug "Helvetica" != "Arial"; // true

@debug hsl(34, 35%, 92.1%) == #f2ece4; // true
@debug rgba(179, 115, 153, 0.5) != rgba(179, 115, 153, 0.8); // true

@debug (5px 7px 10px) == (5px 7px 10px); // true
@debug (5px 7px 10px) != (10px 14px 20px); // true
@debug (5px 7px 10px) != (5px, 7px, 10px); // true
@debug (5px 7px 10px) != [5px 7px 10px]; // true

$theme: (
  "venus": #998099,
  "nebula": #d2e1dd,
);
@debug $theme == ("venus": #998099, "nebula": #d2e1dd); // true
@debug $theme != ("venus": #998099, "iron": #dadbdf); // true

@debug true == true; // true
@debug true != false; // true
@debug null != false; // true

@debug get-function("rgba") == get-function("rgba"); // true
@debug get-function("rgba") != get-function("hsla"); // true
```
