# new

## new 操作符

`new` 操作符用于创建一个给定构造函数的对象实例：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const my = Person("handsome", 23);

console.log(my); // Person {name: "handsome", age: 23}
```

我们定义了一个构造函数 `Person`，然后通过 `new` 操作符生成以 `Person` 为构造函数的一个实例 并将其引用赋值给变量 `my`，然后控制台打印出 `my` 变量，可以看到该实例对象具有 `name` 和 `age` 属性，它们的值就是我们调用构造函数时传入的值。

那么当我们使用 `new` 操作符的时候发生了哪些事情呢？

## new 操作符实际做了什么

为方便描述，`obj` 用来表示创建的空对象；

1. 创建了一个空对象 `obj`；
1. 将 `obj` 的 `[[prototype]]` 属性指向构造函数 `constructor` 的原型；（即 `obj.[[prototype]] === constructor.prototype`）
1. 将构造函数的 `constructor` 内部的 `this` 绑定到新建的对象 `obj`，执行 `constructor`;（和普通函数的调用一样，只是此时函数的 `this` 为新创建的对象 `obj` 对象而已，好比执行 `obj.constructor()`）
1. 若构造函数没有返回非原始值（即不是引用类型的值），则返回该新建对象的 `obj`（默认会添加 `return this`）。否则，返回引用类型的值

这里补充说明一下：`[[prototype]]` 属性是隐藏的，不过目前大部分新浏览器实现方式是使用 `__proto__` 来表示。构造函数的 `prototype` 属性我们是可以显式访问的。

用图片来展开上面的例子：

<img src="/img/javascript/WhatNewDo.png">

## 如何自己实现 new 操作符

```js
/**
 * 手写实现 new
 * @param {Function} constructor 构造函数
 * @param {Any} arg 构造函数的传入参数
 */
function myNew(constructor, ...arg) {
  // 新建一个空对象
  const obj = {};

  // 将新建对象的 __proto__ 属性指向构造函数的原型属性
  obj.__proto__ = constructor.prototype;

  // 将 constructor 的 this 指向 obj 并且执行 constructor 函数
  const result = constructor.apply(obj, arg);

  // 判断构造函数是否 return this，没有则返回 obj
  return result instanceof Object ? result : obj;
}
```

这里的关键两步就是：

- 将新创建对象的原型链设置正确，这样我们才能使用原型链上的方法。
- 将新创建的对象作为构造函数执行的上下文，这样我们才能正确地进行一些初始化操作。
