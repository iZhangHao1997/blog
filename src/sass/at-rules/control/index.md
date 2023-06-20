# Sass 流控制规则

Sass 提供一些@规则来控制哪些样式规则被触发，或者多次触发它们以一个小的变化。这些@规则可以被用在 [mixins](../mixin.md) 和 [functions](../function.md) 里来编写小的算法逻辑来使编写 Sass 更加容易。Sass 提供四个流控制规则：

- [@if](./if.md) 控制一个内容块是否被触发
- [@each](./each.md) 用来遍历一个 [list](../../values/lists.md) 或者 [map](../../values/maps.md)
- [@for](./for.md) 遍历对一个内容块遍历指定次数
- [@while](./while.md) 遍历一个内容块直到达成指定条件
