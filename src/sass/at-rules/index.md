# Sass @规则 At-Rules

许多 CSS 之上的 Sass 的额外功能都来自新的 @规则。

- [@use](./use.md) 用来从其他 Sass 样式表中加载 mixins、函数和变量，并且将其他样式表的 CSS 相结合。
- [@forward](./forward.md) 用来加载样式表，使被加载样式表的 mixins、函数和变量是可用的，当你的样式表被使用 `@use` 规则加载。
- [@import](./import.md) 扩展了 CSS 的 @规则来从其他样式表加载样式、mixins、函数和变量。
- [@mixin and @include](./mixin.md) 让重用样式块代码更加容易。
- [@function](./function.md) 定义可以在 SassScript 中使用的自定义函数。
- [@extend](./extend.md) 允许选择器集成另一个选择器的样式。
- [@at-root](./at-root.md) 将样式放在 CSS 的根目录中。
- [@error](./error.md) 使编译失败并显示错误信息。
- [@warn](./warn.md) 在编译完全不停止的情况下打印一个警告。
- [@debug](./debug.md) 打印信息用作调试目的。
- 控制流如 [@if](./control/if.md)、[@each](./control/each.md)、[@for](./control/for.md) 和 [@while](./control//while.md) 控制了样式是否发出（emitted）或者发出多少次。

Sass 对原生 CSS 的@规则有一些特别的行为：它们可以包含插值，并且它们可以嵌套在样式规则中。

例如 CSS @规则中的 `@media` 和 `@supports` 还允许直接在规则本身中使用 SassScript 而无需插值。
