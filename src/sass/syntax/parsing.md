# Sass 语法解析

Sass 样式表是从一系列 Unicode 代码点中解析出来的。它是直接解析的，无需先转换为令牌流。

## 输入编码

兼容性：

- Dart Sass :negative_squared_cross_mark: （当前 Sass 官方推荐使用的编译器，采用 dart (flutter 的编程语言) 实现）
- LibSass :white_check_mark:（也叫 Node Sass，采用 C++ 实现的编译器，维护速度、新功能支持已经跟不上了，目前官方也已经不推荐使用，意味着也会慢慢退出历史舞台）
- Ruby Sass :white_check_mark:（用 ruby (解释型语言，后面 Node.js 的出现发展，只支持 c++ 这种编译型语言的扩展包，所以出现了 node-sass) 开发的编译器，已于 2019-03 宣布不再维护）

Dart Sass 目前仅支持 UTF-8 编码。因此，最安全的做法是将 Sass 样式表都使用 UTF-8 进行编码。

通常情况下，文档最初仅作为字节序列提供，必须将其解码为 Unicode。Sass 按如下方式执行此解码：

- 如果字节序列以 U+FEFF BYTE ORDER MARK 的 UTF-8 或 UTF-16 编码开头，则使用相应的编码。
- 如果字节序列以纯 ASCII 字符串 @charset 开头，Sass 会使用 CSS 算法的第 2 步来确定编码，以确定回退编码。
- 否则使用 UTF-8

## 解析错误

当 Sass 在样式表中遇到无效语法时，解析将失败并向用户显示错误，其中包含有关无效语法位置和无效原因的信息。

请注意，这与 CSS 不同，后者指定如何从大多数错误中恢复而不是立即失败。这是 SCSS 严格来说不是 CSS 超集的少数情况之一 。但是，对于 Sass 用户来说，立即查看错误比让它们传递到 CSS 输出更有用。

可以通过特定实现的 APIs 访问解析错误的位置。例如，在 Dart Sass 中，您可以访问 SassException.span，在 Node Sass 和 Dart Sass 的 JS API 中，您可以访问 [file、line 和 column 属性](https://github.com/sass/node-sass#error-object)。
