# ES6 知识点及常考面试题

本篇学习 ES6 相关内容。

## var、let 和 const 区别

常见面试题：什么是提升？什么是暂时性死区？`var`、`let` 及 `const` 区别？

首先先了解**提升：**

```js
console.log(a); // undefined
var a = 1;
```

上述代码可以发现：虽然 `a` 变量在打印前尚未声明，但是却可以使用并打印出 `undefined`，这种情况就是提升，并且提升的是声明。

对于这种情况，我们可以把代码这样看

```js
var a;
consoleconsole.log(a); // undefined
a = 1;
```

接着看这个例子

```js
var a = 10;
var a;
console.log(a);
```

对于这个例子，如果我们认为打印 `undefined` 就错了，答案应该是 `10`。对于这种情况，我们这样来看代码：

```js
var a;
var a;
a = 10;
console.log(a);
```

到这里为止，我们已经了解了 var 声明的变量会发生提升的情况，其实不仅变量会提升，函数也会被提升。

```js
console.log(a); // f a() {}
function a() {}
var a = 1;
```

对于这个例子，打印的结果是 `f a() {}`，即使变量声明在函数之后，这也说明了函数会被提升，并且优于变量提升。

了解了 `var` 存在的问题：使用 `var` 声明的变量会被提升到作用域的顶部，接下来看 `let` 和 `const`。

继续看例子：

```js
var a = 1;
let b = 1;
const c = 1;

console.log(window.b); // undefined
console.log(window.c); // undefined

function test() {
  console.log(a); // Uncaught ReferenceError: Cannot access 'a' before initialization
  let a = 1;
}

test();
```

首先在全局作用域下我们使用 `let` 和 `const` 声明变量，变量并不会被挂载到 `window` 上，这一点就和 `var` 有区别。

然后我们在 `test` 中使用 `a` 在 `a` 声明之前，结果抛出了错误。这里其实是**暂时性死区**。

我们不能在声明前就使用变量，这也是 `let` 和 `const` 优于 `var` 的一点。

总之，在代码块内，使用 `let` 命令声明变量之前，该变量都是不可用的。这种语法称为**暂时性死区**（temporal dead zone，简称 TDZ）。

我们知道了变量和函数存在提升，那么为什么存在提升这个事情？提示存在的根本就为了解决函数间互相调用的情况。

```js
function test1() {
  test2();
}

function test2() {
  test1();
}
```

假如不存在这个提升的情况，那么就实现不了上述的代码，因为不可能存在 `test1` 在 `test2` 之前并且 `test2` 又在 `test1` 之前。

### 总结

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- `var` 存在变量提升，可以在声明前使用。`let` 和 `const` 存在代码块内，如果使用 `let`、`const` 声明的变量在使用之前，都会报错
- `var` 在全局作用域下声明的变量会导致变量挂载在 `window` 上，其他两者不会
- `let` 和 `const` 作用基本一致，但是后者声明的变量不能再次赋值

## 继承

涉及面试题：原型如何实现继承？Class 如何实现继承？Class 本质是什么？

首先是 `class`，实际上 JS 中并不存在`类` 的概念，`class` 只是语法糖，本质上还是函数。

```js
class Person {}

Person instanceof Function; // true
```

然后我们复习 ES6 之前的继承和 ES6 之后的 `class` 继承。

> 更加详细的继承学习请看 [JS ——继承篇](SUMMARY.md/#52-继承)，里面详细讲解了各种继承的实现及其优缺点，这里主要讲解组合继承、寄生组合继承和 class 继承。

### 组合继承

**组合继承**是最常用的继承方式，

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child("boy", "tony");
child.getName(); // "tony"
child instanceof Parent; // true
```

组合继承的核心是在子类的构造函数中通过 `Parent.call(this)` 继承父类属性，然后通过 `Child.prototype = new Parent()` 改变子类原型，继承父类原型上的属性和对象。

虽然继承方式的优点是可以向父类构造函数传参，不会与父类引用属性共享，可以复用父类的函数，但是存在的问题是继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，在内存上导致浪费。

<img src="/assets/img/javascript/ES6-组合继承内存浪费.png">

### 寄生组合继承

这种继承方式对组合继承进行了优化，组合继承的缺点在于两次调用父类构造函数，造成内存浪费，我们只需要优化这一点就好了。

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child = new Child("boy", "tony");
child.getName(); // "tony"
child instanceof Parent; // true
```

<img src="/assets/img/javascript/ES6-寄生组合继承.png">

以上继承实现的核心就是将父类的原型赋值给了子类，并且构造函数设置为子类，这样既解决了父类属性的问题，还能正确的找到子类的构造函数。

### class 继承

以上两种继承方式都是通过原型去解决的，在 ES6 中，我们可以使用 `class` 去实现继承，并且实现起来很简单

```js
class Parent {
  constructor(name) {
    this.name = name;
  }

  getName() {
    console.log(this.name);
  }
}

class Child extends Parent {
  constructor(sex, name) {
    super(name);
    this.sex = sex;
  }
}

const child = new Child("boy", "tony");
child.getName(); // "tony"
child instanceof Parent; // true
```

`class` 继承核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，这段代码可以堪称 `Parent.call(this)`。

当然了，开头就说了在 JS 中并不存在类，`class` 的本质就是函数。

## 模块化

涉及面试题：为什么要使用模块化？有哪几种方式可以实现模块化？各有什么特点？

因为使用模块化可以给我们带来以下好处：

- 解决命名冲突
- 提高代码复用性
- 提高代码可维护性

### 立即执行函数

在早期，使用立即执行函数实现模块化是非常常见的手段，通过函数作用域解决了命名冲突、污染全局作用域的问题

```js
(function (globalVariable) {
  globalVariable.test = function () {};
  // ... 声明各种变量、函数都不会污染全局作用域胡
})(globalVariable);
```

### AMD 和 CMD

AMD 是 ReqireJS 推广所引出的模块化规范，是异步加载，推崇**依赖前置**；CMD 是 SeaJS 推广引出的模块化规范，结合了 CommonJS 和 AMD 两种加载方式，推崇**就近依赖**。

且目前这两种实现方式已经比较少见到，不再对具体特性展开，只需要了解这两者是如何使用的。

```js
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});

// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 卸载函数体的任何地方实现延迟加载
  var a = require("./a");
  a.doSomething();
});
```

### CommonJS

CommonJS 最在是在服务端的 Node 使用，目前仍然广泛使用，比如在 webpack 中就能看见它，当然目前在 Node 中模块管理已经和 CommonJS 有一些区别了。

```js
// a.js
module.exports = {
  a: 1,
};

//or
exports.a = 1;

// b.js
var aModule = require("./a.js");
aModule.a; // 1
```

因为 CommonJS 还是会使用到的，所以这里会对一些疑难点进行解析

先说 `require` 吧

```js
var module = require("./a.js");
module.a;
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
  a: 1,
};
// module 基本实现
var module = {
  id: "xxxx", // 我总得知道怎么去找到他吧
  exports: {}, // exports 就是个空对象
};
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports;
var load = function (module) {
  // 导出的东西
  var a = 1;
  module.exports = a;
  return module.exports;
};
// 然后当我 require 的时候去找到独特的
// id，然后将要使用的东西用立即执行函数包装下，over
```

虽然 `exports` 和 `module.exports` 用法相似，但不能对 `exports` 直接赋值。因为 `var exports = module.exports` 代表了 `exports` 和 `module.exports` 享有相同的内存地址，通过改变对象的属性值对两者都会起效，但是如果直接对 `exports` 赋值就会导致 `exports` 指向新的地址，不再指向同一个地址，也就不会对 `module.exports` 起效了。

### ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

- CommonJS 支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但已有提案
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡在主线程影响也不大。而后者是异步导入，用于游览器，需要下载文件，如果也采用同步导入会对渲染有很大的影响
- CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，只能再导入一次；但是 ES Module 采用的是引用拷贝，导入导出的值指向同一个地址，所以导入的值会跟随导出的值变化
- ES Module 会被编译成 `require/exports` 来执行的

```js
/// 引入模块 API
import XXX from "./a.js";
import { XXX } from "./a.js";

// 导出模块 API
export function a() {}
export default function () {}
```

## Proxy

涉及面试题：`Proxy` 可以实现什么功能？

如果我们平时关注 Vue 的进展的话，可能已经知道了 Vue 3.0 中将会通过 `Proxy` 来替换原本的 `Object.defineProperty` 来实现数据响应式。Proxy 是 ES6 新增的功能，它可以用来自定义对象中的操作。

```js
let p = new Proxy(target, handler);
```

`target` 代表需要添加代理的对象，`handler` 用来自定义对象中的操作，比如可以用来自定义 `set` 和 `get` 函数。

接下来我们通过 `Proxy` 来实现一个响应式数据

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value, property);
      return Reflect.set(target, property, value);
    },
  };
  return new Proxy(obj, handler);
};

let obj = {
  a: 1,
  b: "hello",
};

let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性 ${property} 改变为 ${v}`);
  },
  (target, property) => {
    console.log(`${property} = ${target[property]}`);
  }
);

p.a = 2; // 监听到属性 a 改变为 2
p.a; // a = 2
```

在上面的代码中，我们通过自定义 `set` 和 `get` 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 `get` 中收集依赖，在 `set` 派发更新，之所以 Vue 3.0 要使用 `Proxy` 替换原本的 API 原因在于 `Proxy` 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 `Proxy` 可以完美监听到任何方式的数据改变，唯一缺陷可能就是游览器的兼容性不好了。

同时有我们对于 `Proxy` 无需一层层递归为每个属性添加代理有疑问，以下是实现代码。

```js
get(target, property, receiver) {
    getLogger(target, property)
    // 这句判断代码是新增的
    if (typeof target[property] === 'object' && target[property] !== null) {
        return new Proxy(target[property], handler);
    } else {
        return Reflect.get(target, property);
    }
}
```

## map，filter 和 reduce

### map

涉及面试题：map、filter 和 reduce 各有什么作用？

`map` 的作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些操作然后放入到新数组中：

```js
const arr = [1, 2, 5];
const newArr = arr.map(function (value, index, originArr) {
  return value * 2;
});
console.log(newArr); // [2, 4, 10]
```

`map` 有三个参数：第一个为当前值，第二个为当前索引，第三个为原数组。

面试题：

```js
const arr = ["1", "2", "3"];
const newArr = arr.map(parseInt);
console.log(newArr);
```

可以思考以下这道题会输出什么？

答案是：

```js
[1, NaN, NaN];
```

通过 `map` 语法我们知道我们对 `arr` 进行 `parseInt` 操作然后返回处理之后的数组，这里实际上是遍历调用 `parseInt` 方法，并传递三个参数进去。我们知道 `parseInt` 只会处理第一个和第二个参数，所以第三个参数原数组被忽略，然后我们得到伪代码：

```js
const newArr = [parseInt("1", 0), parseInt("2", 1), parseInt("3", 2)];
```

实际上就是打印这个数组，然后当 `parseInt` 方法的第二个参数：指定进制为 **0** 时，默认以 **10** 进制处理，所以以十进制解析 `'1'` 得到 `1`；当我们的第二个参数小于 **2** 或者大于 **36** 时，默认返回 `NaN`，所以第二个解析的结果为 `NaN`；最后一个我们以二进制解析 `'3'`，很明显没有哪一个数字的二进制是等于 `3` 的，所以返回 `NaN`，所以最后的结果是 `[1, NaN, NaN]`。

### filter

`filter` 的作用也是返回一个新数组，在遍历数组的时候将返回值为 `true` 的元素放入新数组，我们可以利用这个函数删除一些不需要的元素

```js
const arr = [1, 3, 5, 10, 22, 17];
const newArr = arr.filter(function (value, index, originArr) {
  if (value % 2 === 0) {
    return true;
  }
});
console.log(newArr); // [10, 22]
```

同样 `filter` 的回调函数也接收三个参数，含义和 `map` 的回调函数的参数是一样的。

### reduce

最后是 `reduce`，也是比较难理解的。

`reduce` 可以将数组中的元素通过回调函数最终转换为一个值。

如果我们想实现一个功能将函数里的元素全部相加得到一个值，可能我们会这样写代码：

```js
const arr = [1, 2, 3];
let totol = 0;
for (let i = 0; i < arr.length; i++) {
  totol += arr[i];
}
console.log(totol); // 6
```

但是如果我们使用 `reduce` 的话就可以将遍历部分的代码优化为一行代码

```js
const arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current, 0);
console.log(sum); // 6
```

对于 `reduce` 来说，它接收两个参数，分别是回调函数和初始值，接下来我们开始分解上述代码的 `reduce` 过程

- 首先初始值为 `0`，该值会作为首次执行回调函数的第一个参数传入
- 回调函数接收四个参数，分别是**累计值**、**当前元素**、**当前索引**、**元素值**，主要的不同是**累计值**
- 在第一次执行回调函数时，当前值和初始值相加的结果为 `1`，该结果会作为第二次回调函数的第一个参数传入
- 在第二次执行回调函数时，累加值加当前值为 `1+2` 即 `3`，所以 `3` 会作为下一次回调参数的第一个参数传入，最后得出结果 `6`

所以 `reduce` 的作用就是通过回调函数将所有元素最终转换为一个值的，当然 `reduce` 还可以实现很多功能，比如实现 `map` 函数和阶乘：

```js
const arr = [1, 2, 3];
const mapArray = arr.map((value) => value * 2);
const reduceArray = arr.reduce((acc, current) => {
  acc.push(current * 2);
  return acc;
}, []);
console.log(mapArray, reduceArray); // [2, 4, 6]
```

最后，扩展一下数组遍历的方法：**for 循环**、**forEach(item, index, array) 循环**、**map 遍历**、**filter 遍历**、**reduce 遍历**、**some 遍历**、**for...of... 循环**、**every 遍历**、**find**、**findIndex**、**keys**、**values**、**entries**。

[遍历数组的各方法具体说明](https://www.cnblogs.com/woshidouzia/p/9304603.html)

## JS 异步编程及常考面试题

> [异步编程面试题](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

这里我们会学习面试中异步编程的相关内容。

### 并发(concurrency)和并行(parallelism)区别

涉及面试题：并发和并行的区别？

异步和这小节的知识点其实并不是一个概念，但是这两个名词确实是很多人都常会混淆的知识点。其实混淆的原因可能只是两个名词在中文上的相似，在英文上来说完全是不同的单词。

并发是**宏观概念**，我分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

并行是**微观概念**，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

### 回调函数(callback)

涉及面试题：什么是回调函数？回调函数有什么缺点？如何解决回调地狱问题？

回调函数作为参数传递给另一个函数，比如定时器中的函数参数、比如 ajax 请求

```js
ajax(url, () => {
  // 处理逻辑
});
```

但是回调函数有个致命弱点，容易些属回调地狱（Callback hell），假设多个请求存在依赖关系，就会写出如下的代码：

```js
ajax(url, () => {
  // 处理逻辑
  ajax(url1, () => {
    // 处理逻辑
    ajax(url2, () => {
      // 处理逻辑
    });
  });
});
```

以上代码看起来不利于阅读和维护，当然，你可能会想说解决这个问题还不简单，把函数分开来写不就得了

```js
function firstAjax() {
  ajax(url1, () => {
    // 处理逻辑
    secondAjax();
  });
}
function secondAjax() {
  ajax(url2, () => {
    // 处理逻辑
  });
}
ajax(url, () => {
  // 处理逻辑
  firstAjax();
});
```

以上的代码虽然看上去利于阅读了，但是还是没有解决根本问题。

回调地狱的根本问题就是：

1. 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
1. 嵌套函数一多，就很难处理错误

当然，回调函数还存在着别的几个缺点，比如不能使用 `try catch` 捕获错误，不能直接 `return`。在接下来的几小节中，我们将来学习通过别的技术解决这些问题。

### Generator

涉及面试题：你理解的 Generator 是什么？

`Generator` 算是 ES6 中难理解的概念之一了，`Generator` 最大的特点就是可以控制函数的执行。在这一小节中我们不会去讲什么是 `Generator`，而是把重点放在 `Generator` 的一些容易困惑的地方。

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
console.log(it.next()); // => {value: 6, done: false}
console.log(it.next(12)); // => {value: 8, done: false}
console.log(it.next(13)); // => {value: 42, done: true}
```

你也许会疑惑为什么会产生与你预想不同的值，接下来就让我为你逐行代码分析原因

- 首先 `Generator` 函数调用和普通函数不同，它会返回一个迭代器
- 当执行第一次 `next` 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
- 当执行第二次 `next` 时，传入的参数等于上一个 `yield` 的返回值，如果你不传参，`yield` 永远返回 `undefined`。此时 `let y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`
- 当执行第三次 `next` 时，传入的参数会传递给 `z`，所以 `z = 13, x = 5, y = 24`，相加等于 `42`

`Generator` 函数一般见到的不多，其实也于他有点绕有关系，并且一般会配合 co 库去使用。当然，我们可以通过 `Generator` 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
function* fetch() {
  yield ajax(url, () => {});
  yield ajax(url1, () => {});
  yield ajax(url2, () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

### Promise

涉及面试题：Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？

`Promise` 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，分别是：

1. 等待中(pending)
1. 完成了(resolved)
1. 拒绝了(rejected)

这个承诺**一旦从等待状态变成其他状态就永远不能改变状态**了，也就是说一旦状态变为 `resolved` 后，就不能再次改变。

```js
new Promise((resolve, reject) => {
  resolve("success");
  // 无效
  reject("error");
});
```

当我们在构造 `Promise` 的时候，构造函数内部的代码是立即执行的

```js
new Promise((resolve, reject) => {
  console.log("new Promise");
  resolve("success");
});
console.log("finish");
// new Promise -> finish
```

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个全新的 `Promise`，原因是因为状态不可变。如果你在 `then` 中使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装。

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res); // 1
    return 2;
  })
  .then((res) => {
    console.log(res); // 2
  });
```

当然了，`Promise` 也很好地解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
ajax(url)
  .then((res) => {
    console.log(res);
    return ajax(url1);
  })
  .then((res) => {
    console.log(res);
    return ajax(url2);
  })
  .then((res) => console.log(res));
```

前面都是在讲述 `Promise` 的一些优点和特点，其实它也是存在一些缺点的，比如无法取消 `Promise`，错误需要通过回调函数捕获。

### async 及 await

涉及面试题：async 和 await 的特点，它们的优点和缺点分别是什么？await 原理是什么？

一个函数如果加上 `async`，那么该函数就会返回一个 `Promise`

```js
async function test() {
  return "1";
}
console.log(test()); // Promise {<resolved>: "1"}
```

`async` 就是将函数返回值用 `Promise.resolve()` 包裹了一下，和 `then` 中处理返回值一样，并且 `await` 只能配套 `async` 使用：

```js
async function test() {
  let value = await sleep();
}
```

`async` 和 `await` 可以说是异步终极解决方案了，相比直接用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确地写出代码，毕竟写一大堆 `then` 也很恶心，并且也能够优雅地解决回调地狱问题。当然也存在一些缺点，因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖却使用了 `await` 会导致性能上的降低。

```js
async function test() {
  // 以下代码如果没有依赖，完全可以使用 Promise.all 的方式
  // 如果有依赖关系则很好地解决了回调地狱的问题
  await fetch(url);
  await fetch(url1);
  await fetch(url2);
}
```

下面再来看一个使用 `await` 的例子：

```js
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log("2", a); // -> '2' 10
};

b();
a++;
console.log("1", a); // -> '1' 1
```

过程解析：

1. 首先函数 `b` 先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为 `await` 内部实现了 `generator`，`generator` 会保留堆栈中东西，所以这时候 `a = 0` 被保存下来
1. 因为 `await` 是异步操作，后面的表达式不返回 `Promise` 的话，就会被包装成 `Promise.reslove(10)`，然后去执行函数外的同步代码
1. 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 0 + 10`

上述解释提到了 `await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise` 的语法糖，且内部自动执行了 `generator`。

### 常用定时器函数

涉及面试题：setTimeout、setInterval、requestAnimationFrame 各有什么特点？

异步编程当然少不了定时器，常见的定时器有 `setTimeout`、`setInterval`、`requestAnimationFrame`。先讲最常见的 `setTimeout`，很多人认为 `setTimeout` 是延时多久，那就应该是多久后执行。

其实这个观点是错误的，因为 JS 是单线程执行的，如果前面的代码影响了性能，就会导致 `setTimeout` 不会按期执行。当然了，我们可以通过代码去修正 `setTimeout`，从而使定时器相对准确。

```js
let period = 60 * 1000 * 60 * 2;
let startTime = new Date().getTime();
let count = 0;
let end = new Date().getTime() + period;
let interval = 1000;
let currentInterval = interval;

function loop() {
  count++;
  // 代码执行所消耗的时间
  let offset = new Date().getTime() - (startTime + count * interval);
  let diff = end - new Date().getTime();
  let h = Math.floor(diff / (60 * 1000 * 60));
  let hdiff = diff % (60 * 1000 * 60);
  let m = Math.floor(hdiff / (60 * 1000));
  let mdiff = hdiff % (60 * 1000);
  let s = mdiff / 1000;
  let sCeil = Math.ceil(s);
  let sFloor = Math.floor(s);
  // 得到下一次循环所消耗的时间
  currentInterval = interval - offset;
  console.log(
    "时：" + h,
    "分：" + m,
    "毫秒：" + s,
    "秒向上取整：" + sCeil,
    "代码执行时间：" + offset,
    "下次循环间隔" + currentInterval
  );

  setTimeout(loop, currentInterval);
}

setTimeout(loop, currentInterval);
```

接下来是 `setInterval`，其实这个函数的作用和 `setTimeout` 基本一致，只是该函数是每隔一段时间执行一次回调函数。

通常来说不建议使用 `setInterval`。第一，它和 `setTimeout` 一样，不能保证在预期的时间执行任务。第二，它存在执行累计的问题，请看以下伪代码：

```js
function demo() {
  setInterval(function () {
    console.log(2);
  }, 1000);
  sleep(2000);
}
demo();
```

以上代码在浏览器环境中，如果定时器执行过程中出现了耗时操作，多个回调函数会在耗时操作结束以后同时执行，这样可能就会带来性能上的问题。

如果你有循环定时器的需求，其实完全可以通过 `requestAnimationFrame` 来实现

```js
function setInterval(callback, interval) {
  let timer;
  const now = Date.now;
  let startTime = now();
  let endTime = startTime;
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    endTime = now();
    if (endTime - startTime >= interval) {
      startTime = endTime = now();
      callback(timer);
    }
  };
  timer = window.requestAnimationFrame(loop);
  return timer;
}

let a = 0;
setInterval((timer) => {
  console.log(1);
  a++;
  if (a === 3) cancelAnimationFrame(timer);
}, 1000);
```

首先 `requestAnimationFrame` 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题，当然你也可以通过该函数来实现 `setTimeout。`

## Promise 相关面试题

### Promise 实现相关功能面试题

#### 使用 Promise 实现每隔 1 秒输出 1、2、3

```js
// 嵌套写法实现实际上要的效果：
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    resolve();
  }, 1000);
}).then(() => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2);
      resolve();
    }, 1000);
  }).then(() => {
    setTimeout(() => {
      console.log(3);
    }, 1000);
  });
});

// reduce 遍历实现
arr.reduce((p, current) => {
  return p.then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(current);
        resolve();
      }, 1000);
    });
  });
}, Promise.resolve());
```

#### 使用 Promise 实现红绿灯交替重复亮

红灯 3 秒亮一次，黄灯 2 秒亮一次，绿灯 1 秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promise 实现）三个亮灯函数已经存在：

```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
```

```js
// 简陋版实现效果（灯多了就不行，需要改善）
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

const light = function () {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      red();
      resolve();
    }, 3000);
  }).then(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        yellow();
        resolve();
      }, 2000);
    }).then(() => {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          green();
          light();
          resolve();
        }, 1000);
      });
    });
  });
};

light();
```

另一种方法

```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

const light = function (light, waitTime) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      light();
      resolve();
    }, waitTime);
  });
};

const start = function () {
  Promise.resolve()
    .then(() => {
      return light(red, 3000);
    })
    .then(() => {
      return light(yellow, 2000);
    })
    .then(() => {
      return light(green, 1000);
    })
    .then(() => {
      start();
    });
};

start();
```

#### 封装一个异步加载图片的方法

这个相对简单一些，只需要在图片的 `onload` 函数中，使用 `resolve` 返回一下就可以了。

来看看具体代码：

```js
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      console.log("图片加载完成");
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error("cloud not load image at" + url));
    };
    img.src = url;
  });
}
```

### 手写实现符合 Promise/A+ 规范的 Promise

sorry，现在的技术级别水平不够。/(ㄒ o ㄒ)/~~

## Event Loop

Event Loop 决定了 JS 代码中异步代码的执行顺序，比如 `setTimeout` 为什么会比 `Promise` 后执行，理解 Event Loop 才能知道 JS 运行异步代码的原理，同时也是面试常考知识点。

### 进程与线程

涉及面试题：进程与线程的区别？JS 单线程带来的好处？

大家都知道 JS 是**单线程**执行的，但是我们是否知道什么是线程呢？

讲到线程，那么肯定也得说一下进程。本质上来说，两个名词都是 CPU **工作时间片**的一个描述。

**进程**描述了 CPU **在运行指令及加载和保存上下文所需的时间**，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间。

把这些概念拿到浏览器中来说，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

上文说到了 JS 引擎线程和渲染线程，大家应该都知道，在 JS 运行的时候可能会阻止 UI 渲染，这说明了两个线程是**互斥**的。这其中的原因是因为 JS 可以修改 DOM，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处。当然前面两点在服务端中更容易体现，对于锁的问题，形象的来说就是当我读取一个数字 15 的时候，同时有两个操作对数字进行了加减，这时候结果就出现了错误。解决这个问题也不难，只需要在读取的时候加锁，直到读取完毕之前都不能进行写入操作。

### 执行栈

涉及面试题：什么是执行栈？

可以把执行栈认为是存储函数调用的**栈结构**，遵循先进后出的原则。

<img src="/assets/img/javascript/执行栈可视化.gif">

当开始执行 JS 代码时，首先会执行一个 `main` 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现，`foo` 函数后执行，当执行完毕后就从栈中弹出了。

平时在开发中，大家也可以在报错中找到执行栈的痕迹

```js
function foo() {
  throw new Error("error");
}
function bar() {
  foo();
}
bar();
```

<img src="/assets/img/javascript/函数执行顺序.png">

大家可以在上图清晰的看到报错在 `foo` 函数，`foo` 函数又是在 `bar` 函数中调用的。

当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

```js
function bar() {
  bar();
}
bar();
```

<img src="/assets/img/javascript/爆栈.png">

### 游览器中的 Event Loop

涉及面试题：异步代码执行顺序？解释一下什么是 Event Loop？

上面我们讲到了什么是执行栈，大家也知道了当我们执行 JS 代码的时候其实是往执行栈放入函数，那么遇到异步代码的时候该怎么办？其实当遇到异步代码的时候，会被**挂起**并在需要执行的时候加入到**Task**队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

<img src="/assets/img/javascript/事件循环.png">

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为**微任务（microtask）**和 **宏任务（macrotask）**。在 ES6 规范中，microtask 称为 `jobs`，macrotask 称为 `task`。下面来看以下代码的执行顺序：

```js
console.log("script start");

async function async1() {
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2 end");
}
async1();

setTimeout(function () {
  console.log("setTimeout");
}, 0);

new Promise((resolve) => {
  console.log("Promise");
  resolve();
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });

console.log("script end");
// script start -> async2 end -> Promise -> script end -> async1 end -> promise1 -> promise2 -> setTimeout
```

> 注意：新的浏览器中不是如上打印的，因为 await 变快了，具体内容可以往下看

具体为什么这样执行，请自行学习 `promise`、`async/await` 相关内容知识，或者看下面改造成更容易理解的代码：

```js
new Promise((resolve, reject) => {
  console.log("async2 end");
  // Promise.resolve() 将代码插入微任务队列尾部
  // resolve 再次插入微任务队列尾部
  resolve(Promise.resolve());
}).then(() => {
  console.log("async1 end");
});
```

所以 Event Loop 执行顺序如下：

1. 首先将整个代码视为一个宏任务，执行同步代码，即执行宏任务
1. 当执行完所有同步代码后，执行栈为空，检查是否还有异步代码需要执行
1. 执行所有微任务
1. 当执行完所有微任务后，如有必要会进行渲染页面
1. 然后开始下一轮 Event Loop，执行宏任务代码，也就是 `setTimeout` 中的回调函数

所以以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务，所以会有以上的打印。

微任务包括 `process.nextTick` `，promise` ，`MutationObserver`，其中 `process.nextTick` 为 Node 独有。

宏任务包括 `script` ， `setTimeout` `，setInterval` `，setImmediate` ，`I/O` ，`UI rendering`。

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 script ，**浏览器会先执行一个宏任务**，接下来有异步代码的话才会先执行微任务。

### Node 中的 Event Loop

未完待续。。。
