---
---

# JavaScript 基础知识

本篇为 JavaScript 的基础篇，主要围绕 JavaScript 的语法/ES6 标准进行理解学习，主要围绕：基础类型、作用域、闭包、原型、继承、this 指向、深浅拷贝、字符串和数组的方法、节流防抖手写、函数式编程等知识展开的。

## 1. 基础类型

### 1.1 数据类型

JavaScript 的数据类型主要分为两类：**原始类型(基本类型)**和**引用类型(对象类型)**。

#### 1.1.1 原始类型包括以下 **7** 种

- **String**
  - 转换方法：数值、布尔值、对象和字符串值都有 `toString()` 方法。
- **Number**
  - 双精度 64 位二进制格式的值——数字、±Infinity(如果超过(5e-324, 1.7976931348623157e+308))、NaN(与任何值都不相等，包括本身，请使用 `isNaN()`)；
  - 可使用零（0）开头表示八进制，如 `const num = 070; // 八进制的 56`（严格模式无效）；
  - 可用 `0x` 开头表示十六进制，进行运算时所有八进制和十六进制表示的数值最终都会被转化为十进制；
  - 数值转换的方法：`Number()`、`parseInt()`和 `parseFloat()`，用法/区别请自行查阅；
  - 注意：由于浮点数值的精度问题，`0.1 + 0.2 = 0.30000000000000004`。
- **Boolean**
- **null**
  - JS 的数据底层都是用二进制进行存储的，前三位为 0 会被判断成对象，null 是全部为 0；
  - 表示空对象的指针，所以使用 `typeof` 操作符检测 `null` 值会返回 `'object'`。
- **undefined**
  - 不管是否定义/初始化，使用 `typeof` 操作符均返回 `'undefined'` ，注意 `null == undefined` 将返回 true。
- **Symbol**
  - ES6 新增定义，实例是唯一且不可变的；
  - [学习地址](https://es6.ruanyifeng.com/#docs/symbol)
- **BigInt**
  - BigInt 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数。这原本是 Javascript 中可以用 Number 表示的最大数字。BigInt 可以表示任意大的整数。
  - 可以用在一个整数字面量后面加 n 的方式定义一个 BigInt ，如：10n，或者调用函数 BigInt()。

##### 面试官：为什么 typeof null 等于 Object?

回答：不同的对象在底层原理的存储是用二进制表示的，在 javaScript 中，如果二进制的前三位都为 0 的话，系统会判定为是 Object 类型。null 的存储二进制是 000，也是前三位，所以系统判定 null 为 Object 类型。

这个 bug 个第一版的 javaScript 留下来的。扩展一下其他的几个类型标志位：

- 000：对象类型。
- 1：整型，数据是 31 位带符号整数。
- 010：双精度类型，数据是双精度数字。
- 100：字符串，数据是字符串。
- 110：布尔类型，数据是布尔值。

##### JS 中的精度问题，如 0.1 + 0.2 为什么不等于(===) 0.3

[精度问题相关文章](https://xwjgo.github.io/2018/03/17/js%E4%B8%AD%E7%B2%BE%E5%BA%A6%E9%97%AE%E9%A2%98%E5%8F%8A%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/)

[为什么 JavaScript 最大安全整数是 2^53-1](https://juejin.cn/post/6880143057930190855)

JS 中的数字按照 IEEE 754 标准，使用 64 位双精度浮点型来表示。其中符号位 S（Sign），指数位 E（Exponent），尾数位 F（fraction） 分别占了 1、11、52 位，并且在 ES5 规范中指出了指数位 E 的取值范围是 `[-1074, 971]`。

<img src="/assets/img/javascript/双精度数字存储结构.png" />

| 位置  | 位数 | 作用   | 表示     |
| ----- | ---- | ------ | -------- |
| 0-51  | 52   | 尾数位 | 原码表示 |
| 52-62 | 11   | 指数位 | 移码表示 |
| 63    | 1    | 符号位 | 0/1      |

想用有限的位数表示无穷的数字，显然是不可能的，因此会出现一系列精度问题：

1. 浮点数精度问题，比如：0.1 + 0.2 !== 0.3
1. 大数精度问题，比如 9999 9999 9999 9999 === 1000 0000 0000 0000 1
1. toFixed 四舍五入结果不准确，比如 1.335.toFixed(2) === 1.33

浮点数精度和 toFixed 其实属于同一类问题，都是由于浮点数无法精确表示引起的，如下：

```js
(1.335).toPrecision(20); // '1.3349999999999999645'
```

而关于大数精度问题，可以先看下面的代码片段：

```js
// 能准确表示的整数范围上限， S为0， E为11个0，S为52个1
Math.pow(2, 53) - 1 === Number.MAX_SAFE_INTEGER; // true

// 能精确表示的整数范围下限,S为1个1，E为11个0，S为53个1
-(Math.pow(2, 53) - 1) === Number.MIN_SAFE_INTEGER; // true

// 能表达的最大数组：S为0，E为971，S为53个1
```

##### 出现 null 和 undefined 的情况

- null 出现的情况
  1. 手动设置变量的值或对象某一个属性值为 null
  1. 在 JS 的 DOM 元素获取中，如果没有获取到指定的元素对象，结果一般是 null
  1. Object.prototype.**proto** 的值也是 null
  1. 正则捕获的时候，如果没有捕获到的结果，默认也是 null
- undefined 出现的情况
  1. 变量提升：只声明未定义默认值就是 undefined
  1. 严格模式下：没有明确的执行主体，this 指向 undefined
  1. 对象没有这个属性名，属性值是 undefined
  1. 函数定义形参不传值，默认就是 undefined
  1. 函数没有返回值（没有 return，或者 return;），默认返回就是 undefined

#### 1.1.2 引用类型

其实除了基本类型以外都是引用类型，包括但不限于以下：

- **Function**
- **Array**
- **Object**
- **Date**
- **RegExp**

### 1.2 存储形式

- 原始类型因为在内存种占固定大小的空间，所以保存在**栈内存种**；
- 引用类型的大小不固定，所以是按引用访问的，保存在**堆内存**中。（在栈内存中存一个基本类型值保存对象在堆内存中的地址，用于引用这个对象。）

<img src="/assets/img/javascript/StackandHeap.png">

> 基本类型在当前执行环境结束时销毁，而引用类型不会随执行环境结束而销毁，只有当所有引用它的变量不存在时这个对象才被垃圾回收机制回收。

### 1.3 数据类型的判断

###### 面试官：typeof 与 instanceof 有什么区别？

typeof 是一元运算符，同样返回一个字符串类型。一般用来判断一个变量是否为空或者是什么类型。
除了 null 类型以及 Object 类型不能准确判断外，其他数据类型都可能返回正确的类型。

```js
typeof undefined; // 'undefined'
typeof "10"; // 'String'
typeof 10; // 'Number'
typeof false; // 'Boolean'
typeof Symbol(); // 'Symbol'
typeof Function; // ‘function'
typeof null; // ‘Object’
typeof []; // 'Object'
typeof {}; // 'Object'
```

既然 `typeof` 对 null 、数组和数组类型都返回 `Object` 类型情况的局限性，我们可以使用 `instanceof` 来进行判断**某个对象是不是另一个对象的实例**。返回值的是一个布尔类型。

`instanceof` 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype` 属性。

那么 ES6 语法中的 `class` 语法糖是什么类型：

```js
class A {}
console.log(A instanceof Function); // true
```

假设有 `a instanceof b` 语句，则在 `instanceof` 内部实际做了如下判断：

```js
while (a.__proto__ !== null) {
  if (a.__proto__ === b.prototype) {
    return true;
  }
  a.__proto__ = a.__proto__.proto__;
}
return false;
```

`a` 会一直沿着隐式原型链 `__proto__` 向上查找直到 `a.__proto__.__proto__ ...... === b.prototype` 为止，如果找到则返回 `true`，也就是 `a` 为 `b` 的一个实例。否则返回 `false`，`a` 不是 `b`的实例。

> 注意：原型链中的 prototype 随时可以被改动的，改变后的值可能不存在于 object 的原型链上，instanceof 返回的值可能就返回 false。

### 1.4 双等和三等有什么区别

对于 `==` 来说，如果对比双方的类型**不一样**的话，就会进行类型转换。

假如我们需要对比的 `x` 和 `y` 是否相同，就会进行如下判断流程：

1. 首先会判断两者类型是否**相同**，相同的话就是比大小
1. 类型不相同的话，就会进行类型转换
1. 会判断是否在比对 `null` 和 `undefined`，如果是的话返回 `true`
1. 判断两者类型是否为 `string` 和 `number`，是的话将字符串转为 `number`

```js
1 == '1'
      ⬇
1 ==  1
```

1. 判断其中一方是否为 `boolean`，是的话就会将 `boolean` 转为 `number` 再进行判断

```js
'1' == true
        ⬇
'1' ==  1
 ⬇
 1  ==  1
```

1. 判断一方是否为 `object` 且另一方为为 `string`、`number` 或者 `symbol`，是的话就会把 `object` 转为原型类型再进行判断

```js
'1' == { name: 'yck' }
        ↓
'1' == '[object Object]'
```

这里提供流程图：

<img src="/assets/img/javascript/图1.4.png">

对于 `===` 来说就简单多了，就是判断两者类型和值是否相同。

思考题： [] == ![] 会输出什么？

1. 两个操作数的数据类型相同，== 直接进行判断；数据类型不同，则要对操作数进行类型转换（大多数的面试题既然考 ==，本质上就是考类型转换）
2. 判断操作数的数据类型：
3. 如果都是原始类型(`string`/`number`/`boolean`，除去特殊值 `null`/`undefined`/`NaN`)，两者都转为数值进行判断；
4. 特殊值的话，`null`/`undefied`/`NaN` 和任何值(不包括自身) `==` 都为 `false`；`null` 和 undefined == 为 true，分别与自身 == 也为 true；NaN 与自身 == 为 false；
5. 原始类型和引用类型进行比较，原始类型是数值引用类型转为数值，原始类型是字符串引用类型转为字符串，原始类型是布尔值两者都转为数值；
6. 引用类型和引用类型进行比较，比较的是内存地址。

`[] == ![]` 的判断本质上是**原始类型**和**引用类型**的判断，一元运算符 `!` 优先级高于二元运算符 `==`，实际 `==` 判断时表达式已经转为 `[] == false`，然后 `==` 导致的隐式转换，二者都转为数值 `0 == 0` 就返回 `true` 了。

## 2. 执行上下文/作用域链/闭包

- [执行上下文和作用域的理解](https://segmentfault.com/a/1190000011843356)
- [执行上下文和作用域的区别](https://www.cnblogs.com/wangfupeng1988/p/3991995.html)

### 2.1 执行上下文

执行上下文（Execution Context），也就是程序代码执行时候的环境，决定了变量或函数有权访问的其他数据：分为**全局执行上下文**、**函数执行上下文**以及**eval 执行上下文**（一般不涉及，不讨论）。

每个函数都有自己的执行环境。当代码在一个环境中执行的时候，会创建变量对象的一个**作用域链（scope chain）**。

#### 2.1.1 全局执行上下文

全局执行上下文只有一个，在客户端中**一般由游览器创建**，也就是 `window` 对象，我们可以通过 `this` 直接访问它。

全局对象 `window` 上预定义了大量的方法和属性，我们在全局环境的任何一个地方都可以直接访问这些属性和方法；同时，`window` 对象还是 `var` 声明的全局变量的载体，我们通过 `var` 创建的全局变量，都可以通过 `window` 直接访问。

#### 2.1.2 函数执行上下文

函数执行上下文可以存在无数个，每个函数被调用的时候都会创建一个函数上下文；需要注意的是，**同一个函数被多次调用，都会创建一个新的上下文**。

那么上下文种类不同，数量多，它们之间的关系是怎样的，又是如何管理的呢？这就关系到**执行上下文栈**。

#### 2.1.3 执行上下文栈

执行上下文栈（简称执行栈），也称调用栈，**执行栈用于存储代码执行期间所创建的所有上下文**，具有 LIFO（Last In First Out 后进先出，也就是先进后出）的特性。

JS 代码首次运行，都会**先创建一个全局执行下文并压入到执行栈中**，之后每当有函数被调用，都会创建一个新的函数执行上下文并压入栈内；由于执行栈的 LIFO 后进先出特性，所以可以理解为，JS 代码执行完毕前在执行栈底部永远有一个全局执行上下文。

### 2.2 作用域链

#### 2.2.1 什么是作用域

JS 在 ES6 之前并没有块级作用域，除了全局作用域，函数会创建自己的作用域。作用域在函数定义时就已经确定了，不是在函数调用时确定（区别于执行上下文环境，当然 `this` 也是属于上下文环境）

```js
// 全局作用域
let x = 100;

// fn作用域
function fn(x) {
  // bar作用域
  function bar(x) {
    console.log(x);
  }
}

let f1 = fn(5);
let f2 = fn(10);

f1(); // 5
f2(); // 10
```

作用域只是一个“地盘”，其中没有变量。**变量是通过作用域对应的执行上下文环境中的变量对象来实现的**。所以作用域是静态观念的，而执行上下文环境是动态上的，两者并不一样。有闭包存在时，一个作用域存在两个上下文环境也是有的。

同一个作用域下，对同一个函数的不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值，**所以，作用域中变量的值是在执行过程中确定的，而作用域是在函数创建时就确定的。**

**如果要查找一个作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中找到变量的值。**

#### 2.2.2 什么是作用域链

函数在定义的时候（不是调用的时候）就已经确定了函数体内部自由变量的作用域。

比如上例，当我们调用 `bar` 函数时，先会从 `bar` 作用域取值，如果 `bar` 作用域没有，就到创建 `bar` 的 `fn` 作用域寻找，如果 `fn` 也没有，就到了全局作用域，找到这里就结束了。

作用域只是一个“地盘”，一个抽象的概念，其中没有变量。要通过作用域对应的执行上下文环境来获取变量的值。

### 2.3 闭包

JS 的“闭包”也是面试几乎必问的概念，那么什么是闭包？

如果一句话解释: **能够读取其他函数内部变量的函数**

> 但是你只需要知道应用的两种情况即可——函数作为返回值，函数作为参数传递。

稍全面的回答：**在 js 中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁。**

#### 2.3.1 闭包的应用场景

在开发中, 其实我们随处可见闭包的身影, 大部分前端 JavaScript 代码都是“事件驱动”的，即一个事件绑定的回调方法; 发送 ajax 请求成功/失败的回调；setTimeout 的延时回调；或者一个函数内部返回另一个匿名函数，这些都是闭包的应用。

1. 读取值问题：

   ```js
   for (var i = 0; i < 10; i++) {
     setTimeout(function () {
       console.log(i); // 10个10
     }, 1000);
   }
   ```

   如何读取到正确的值：

   ```js
   // 使用 let 变量声明 i
   for (let i = 0; i < 10; i++) {
     setTimeout(function () {
       console.log(i); // 10个10
     }, 1000);
   }
   ```

   或者

   ```js
   // 声明了 10 个自执行函数，保存当时的值到内部
   for (var i = 0; i < 10; i++) {
     ((j) => {
       setTimeout(function () {
         console.log(j); //1-10
       }, 1000);
     })(i);
   }
   ```

1. 使用闭包模拟私有变量

   ```js
   var counter = (function () {
     var privateCounter = 0;

     function changeBy(val) {
       privateCounter += val;
     }
     return {
       increment: function () {
         changeBy(1);
       },
       decrement: function () {
         changeBy(-1);
       },
       value: function () {
         return privateCounter;
       },
     };
   })();
   counter.value(); //0
   counter.increment(); //1
   counter.increment(); //2
   counter.decrement(); //1
   ```

   匿名函数已经定义就立即执行, 创建出一个词法环境包含 `counter.increment`、`counter.decrement`、`counter.value` 三个方法，还包含了两个私有项：`privateCounter` 变量和 `changeBy` 函数。这两个私有项无法在匿名函数外部直接访问，必须通过匿名包装器返回的对象的三个公共函数访问。

#### 2.3.2 闭包的缺点

1. 由于闭包会是的函数中的变量都被保存到内存中,滥用闭包很容易造成内存消耗过大,导致网页性能问题。解决方法是在退出函数之前，将不再使用的局部变量全部删除。
1. 闭包可以使得函数内部的值可以在函数外部进行修改。所有，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

## 3. this 指向

`this` 的指向也是面试中的高频问题，通常会根据题目判断 `this` 指向，提问如何改变 `this` 等。

### 3.1 this 指向问题

##### 面试官：什么是 this 指针？以及各种情况下 this 指向问题

`this` 就是一个对象，`this` 的指向是根据函数的执行环境确定的。
不同情况下 `this` 的指向不同，其绑定规则大概如下：

1. 默认绑定【严格 | 非严格】
   - 默认模式下，this 指向全局对象
   - 严格模式下，this 指向 undefined
2. 隐式绑定：函数调用时会有一个上下文对象，this 指向调用它的这个对象
3. 显示绑定：通过 apply、call 和 bind 的方式显式改变 this 的指向
4. new 绑定：JS 构造函数通过 new 操作符进行调用，此处的 this 指向新创建的对象实例
5. 箭头函数绑定：引用外层的上下文 this
   - 箭头函数的 this，相当于普通变量
   - 寻找箭头函数的 this，就相当于寻找外层作用域
   - 如果改变了外层作用域的 this，就可以改变箭头函数的 this

this 的指向优先级，依次按照 **箭头函数** > **new 操作符** > **显示绑定** > **隐式绑定** > **默认绑定**

#### 3.1.1 this 指向调用对象

```js
const message = "hello";

const obj = {
  message: "JS",
  say: function () {
    console.log(this.message);
  },
};

obj.say(); // 'JS'
```

#### 3.1.2 直接调用的函数，`this` 指向的是全局 window 对象

```js
function say() {
  console.log(this);
}

say(); // this 指向 window 对象(严格模式下为 undefined)
```

#### 3.1.3 通过 `new` 的方式，`this` 永远指向新创建的对象

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  console.log(this);
}

var xiaolu = new Person("小张", 23); // this = > Person { name: '小张', age: 23 }
```

#### 3.1.4 箭头函数中的 `this`

由于箭头函数没有单独的 this 值。箭头函数的 this 与声明所在的上下文相同。也就是说调用箭头函数的时候，不会隐式的调用 this 参数，而是从定义时的函数继承上下文。

```js
const obj = {
  a: () => {
    console.log(this);
  },
};
// 对象调用箭头函数
obj.a(); // window
```

**加深理解：** 请问以下代码有几个 `this`？输出什么内容

```js
function foo() {
  return () => {
    return () => {
      return () => {
        console.log("id:", this.id);
      };
    };
  };
}

var f = foo.call({ id: 1 });

var t1 = f.call({ id: 2 })()();
var t2 = f().call({ id: 3 })();
var t3 = f()().call({ id: 4 });
```

上面的代码中，只有一个 `this`，就是函数 `foo()` 的 `this`，所以 `ti`、`t2`、`t3`都输出同样的结果。因为内层的三个箭头函数都是没有自己的 `this`，所以改变 `this` 指向也是没用的，他们的 `this` 都是最外层的 `foo()` 函数的 `this`。

### 3.2 call、apply 和 call

我们可以通过 `call、apply、bind` 来改变 `this` 的指向。

```js
var obj = {
  name: "小张",
  age: "23",
  adress: "小张学编程",
};

function print() {
  console.log(this); // 打印 this 的指向
  console.log(arguments); // 打印传递的参数
}

// 通过 call 改变 this 指向
print.call(obj, 1, 2, 3);

// 通过 apply 改变 this 指向
print.apply(obj, [1, 2, 3]);

// 通过 bind 改变 this 的指向
let fn = print.bind(obj, 1, 2, 3);
fn();
```

**共同点：**

- 三者都能改变 `this` 指向，且第一个传递的参数都是 `this` 指向的对象。
- 三者都采用的后续传参的形式。

**不同点：**

- `apply` 只能接受两个参数，其中后一个参数可以是数组、类数组、对象
- `call` 可以接受多个参数，参数需一个一个传递
- `bind` 返回一个新函数，`apply、call` 在函数执行时调用

### 3.3 如何手写实现 call、apply 和 bind

原理及实现思路请自行百度/谷歌，以下仅提供实现代码（如有错误请指正）。

#### 3.3.1 实现 apply

```js
/**
 * 手写实现 apply
 */
Function.prototype.myApply = function (thisArg, arrArg) {
  // 检测类型
  if (typeof this !== "function") {
    throw new TypeError(`${this}.apply is not a function`);
  }

  // 判断 this 是否为 null 或 undefined
  thisArg = thisArg || window;

  // 判断参数是否为 null 或 undefined
  arrArg = arrArg || [];

  // 创建对象
  const obj = new Object(thisArg);

  // 创建 symbol，避免覆盖原有变量
  const symbol = Symbol();
  obj[symbol] = this;

  // 调用对象方法
  const result = obj[symbol](...arrArg);
  delete obj[symbol];

  return result;
};
```

#### 3.3.2 实现 call

```js
/**
 * 一、手写实现 call
 */
Function.prototype.myCall = function (thisArg) {
  // 检测类型
  if (typeof this !== "function") {
    throw new TypeError(`${this}.apply is not a function`);
  }

  // 判断 this 是否为 null 或 undefined
  thisArg = thisArg || window;

  // 调整参数
  const arrArg = Array.prototype.splice.call(arguments, 1);
  // 或者可以用 for 循环的方式调整
  // const arrArg  = [];
  // for (let i = 1; i < arguments.length; i++) {
  // arrArg.push(arguments[i]);
  // }

  // 创建对象
  const obj = new Object(thisArg);

  // 创建 symbol，避免覆盖原有变量
  const symbol = Symbol();
  obj[symbol] = this;

  // 调用对象方法
  const result = obj[symbol](...arrArg);
  delete obj[symbol];

  return result;
};
```

或者可以基于刚才手写的 `apply` 方法：

```js
/**
 * 二、手写实现 call
 */
Function.prototype.myCall = function (thisArg) {
  // 调整参数
  const arrArg = Array.prototype.splice.call(arguments, 1);
  // 或者可以用 for 循环的方式调整
  // const arrArg = [];
  // for (let i = 1; i < arguments.length; i++) {
  // arrArg.push(push(arguments[i]);
  // }

  // 调用刚才手写的 myApply() 方法
  return this.myApply(thisArg, arrArg);
};
```

#### 3.3.3 实现 bind

```js
/**
 * 手写实现 bind
 */
Function.prototype.myBind = function () {
  // 类型校验
  if (typeof this !== "function") {
    throw new TypeError(`${this}.bind is not a function`);
  }

  //#2 取参
  const thisArg = Array.prototype.shift.call(arguments) || [];
  const args = Array.prototype.slice.call(arguments) || [];

  // 获取当前调用的方法 this
  const _this = this;

  // 返回函数
  return function () {
    const arrArg = args.concat(Array.from(arguments));
    return _this.myApply(thisArg, arrArg);
  };
};
```

## 4. new 操作符

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

### 4.1 new 操作符实际做了什么

为方便描述，`obj` 用来表示创建的空对象；

1. 创建了一个空对象 `obj`；
1. 将 `obj` 的 `[[prototype]]` 属性指向构造函数 `constructor` 的原型；（即 `obj.[[prototype]] === constructor.prototype`）
1. 将构造函数的 `constructor` 内部的 `this` 绑定到新建的对象 `obj`，执行 `constructor`;（和普通函数的调用一样，只是此时函数的 `this` 为新创建的对象 `obj` 对象而已，好比执行 `obj.constructor()`）
1. 若构造函数没有返回非原始值（即不是引用类型的值），则返回该新建对象的 `obj`（默认会添加 `return this`）。否则，返回引用类型的值

这里补充说明一下：`[[prototype]]` 属性是隐藏的，不过目前大部分新浏览器实现方式是使用 `__proto__` 来表示。构造函数的 `prototype` 属性我们是可以显式访问的。

用图片来展开上面的例子：

<img src="/assets/img/javascript/WhatNewDo.png">

### 4.2 如何自己实现 new 操作符

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

## 5. 原型和继承

### 5.1 prototype、**proto** 和 constructor 的区别

[prototype、\_\_proto\_\_ 和 constructor 的区别](https://blog.csdn.net/cc18868876837/article/details/81211729)

**原型（prototype）**：给其他对象提供共享属性和方法的对象

**\_\_proto\_\_**：所有对象，都存在一个隐式引用，指向它的原型（构造函数的 prototype）

**构造函数（constructor）**：构造函数，它的原型指向实例的原型

总结三者的区别：

1. 我们需要牢记两点：① `__proto__` 和 `constructor` 属性是**对象**所独有的；② `prototype` 属性是**函数**所独有的，因为**函数**也是一种**对象**，所以函数也拥有 `__proto__` 和 `constructor` 属性。
1. `__proto__` 属性的**作用**就是当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的 `__proto__` 属性所指向的那个对象（父对象）里找，一直找，直到 `__proto__` 属性的终点 `null`，再往上找就相当于在 `null` 上取值，会报错。通过 `__proto__` 属性将对象连接起来的这条链路即我们所谓的**原型链**。
1. `prototype` 属性的**作用**就是让该函数所实例化的对象们都可以找到公用的属性和方法，即 `f1.__proto__ === Foo.prototype`。
1. `constructor` 属性的含义就是**指向该对象的构造函数**，所有函数（此时看成对象了）最终的构造函数都指向 **Function**。

其关系如图所示：

<img src="/assets/img/javascript/原型、原型链和构造函数.webp">

图中，`__proto__` 形成的链条组合，就是原型链。

### 5.2 继承

**JaveScript** 面向对象的三大特性是：**封装**、**继承**、**多态**，我们从这三个方面理解**继承**。

继续复习原型的基本概念：

```js
// 1. 构造函数
function Cat(name) {
  this.name = name;
}

// 2. 构造函数的原型对象
Cat.prototype;

// 3. 使用 Cat 构造函数创建实例'喵喵'
var miaomiao = new Cat("喵喵");

// 4. 构造函数的静态方法 fn
Cat.fn = function () {};

// 5. 原型对象上的方法 fn
Cat.prototype.fn = function () {};
```

<img src="/assets/img/javascript/图5.2.png">

#### 5.2.1 封装

**封装**是什么意思：把客观事物封装成抽象的类，隐藏属性和方法，仅对外公开接口。

##### 5.2.1.1 ES6 之前的封装——构造函数

我们都知道 ES6 的 `class` 实质就是一个语法糖，在 ES6 之前，JS 是没有类这个概念的，因此是借助于 **原型对象** 和 **构造函数** 来实现。

1. **私有**属性和方法：只能在构造函数内访问不能被外部所访问（在构造函数内使用 `var`、`const`、`let` 声明的属性）
1. **公有**属性和方法（或实例方法）：对象外可以访问到的对象内的属性和方法（在构造函数内使用 `this` 设置，或者设置在构造函数的原型对象上，比如：`Cat.prototype.xxx = xxx`）
1. **静态**属性和方法：定义在构造函数上的方法（比如 `Cat.xxx = xxx`），不需要实例就可以调用（比如 `Object.assign(targetObj, sourceObj)`）

###### 一、理解私有属性方法和共有属性方法

比如我现在想要封装一个生产出猫，名为 `Cat` 的构造函数。

- 由于猫的心和胃都是我们肉眼看不见的，所以我把它们设置为**私有**属性(隐藏起来)
- 并且猫的心跳我们也是看不到的，所以我把它设置为**私有**方法(隐藏起来)
- 然后猫的毛色是可以看见的，所以我把它设置为**公有**属性
- 猫跳起来这个动作我们是看的到的，所以我把它设置为**公有**方法

```js
function Cat(name, color) {
  // 公有名字、毛色属性
  this.name = name;
  this.color = color;

  // 猫的私有属性'心'和胃
  var heart = "心";
  var stomach = "胃";
  // 猫的私有方法'心跳'
  var heartbeat = function () {
    console.log(heart + "跳");
  };

  // 公有方法'跳'
  this.jump = function () {
    heartbeat();
    console.log(this.name + "跳");
  };
}

const miaomiao = new Cat("喵喵", "狸花");
console.log(miaomiao); // Cat {name: "喵喵", color: "狸花", jump: f}
miaomiao.jump(); // 心跳 喵喵跳
```

可以看到我们打印的 `喵喵` 小猫只有 `name`、`color`、`jump` 三个属性可以被看到（可以被访问），所以其公有属性就是：

- `name`
- `color`
- `jump`

而私有属性是看不到的：

- `heart`
- `stomach`
- `heartbeat`

所以如果你有想要直接使用是不能的：

```js
// 私有属性
console.log(miaomiao.heart); // undefined
console.log(miaomiao.stomach); // undefined
guaiguai.heartbeat(); // Uncaught TypeError: miaomiao.heartbeat is not a function
```

**小结：**

- 在函数内用 `var`、`const`、`let` 定义的就是私有的；
- 在函数内使用 `this` 的就是公有的

###### 二、理解静态属性方法和公有属性方法

还是刚才的例子

我们现在往刚刚的 `Cat` 构造函数中加些东西。

我们需要对 `Cat` 这个构造函数加一个描述，表明它是用来生产猫的，所以我把 `description` 设置为它的静态属性
由于一听到猫这种动物就觉得它会卖萌，所以我把**卖萌**这个动作设置为它的静态方法
由于猫都会用唾液清洁身体，所以我把**清洁**身体这个动作设置为它的公有方法

```js
// 在上面的基础上新加代码
Cat.description = "产生猫的构造函数";
Cat.cute = function () {
  console.log("小猫卖萌");
};
Cat.prototype.clean = function () {
  console.log("小猫清洁身体");
};

// 新建一直小猫
const miaomiao = new Cat("喵喵", "狸花");

console.log(Cat.description); // "产生猫的构造函数"
Cat.cute(); // "小猫卖萌"
console.log(miaomiao.descrition); // undefined
miaomiao.clean(); // "小猫清洁身体"
```

通过代码可以发现，`description`、`cute` 都是构造函数 `Cat` 上的方法，可以直接被 `Cat` 调用，为静态属性和静态方法；

但 `description`、`cute` 并不能存在于 `乖乖` 这个实例上，实例上实际上并不存在这个方法和属性，所以打印出来 `undefined`；

但是我们定义的 `clean` 方法是在 `Cat` 的原型对象 `prototype` 上面的，属于 `Cat` 的公有方法（实例方法），所以 `miaomiao` 这个示例可以调用。

**小结：**

- 在构造函数上使用的 `Cat.xxx` 定义的是静态属性和方法
- 在构造函数内使用 `this` 设置，或者在构造函数的原型对象 `Cat.prototype` 上设置，就是公有属性和方法（实例方法）

**静态方法和示例方法例子：**

- `Promise.all()`、`Promise.race()`、`Object.assign()`；
- `push`、`shift` 实际上就是存在原型对象上的：`Array.prototype.push`、`Array.prototype.shift`

###### 三、理解实例自身属性和定义在构造函数原型对象中的属性的区别

通过上面我们知道了 `this.xxx` 和 `Cat.prototpe.xxx = xxx` 都是属于 `miaomiao` 上的公有属性，那么有什么区别吗？

```js
function Cat(name) {
  this.name = name;
}

Cat.prototype.description = "我是创造猫的构造函数";

var miaomiao = new Cat("喵喵");

console.log(miaomiao); // Cat {name: "喵喵", __proto__: Object}
console.log(miaomiao.name); // 喵喵
console.log(miaomiao.description); // 我是创造猫的构造函数
```

可以看到使用 `this` 定义的 `name` 属性可以通过 `miaomiao` 实例直接访问，而通过 `Cat.prototype` 定义的 `description` 属性是在 `miaomiao.__proto__` 下的，也就是 `Cat.prototype` 下面属性，虽然没有出现在 `miaomiao` 实例中，但是可以访问和调用的。

**小结：**

- 定义在构造函数原型对象上的属性和方法不直接表现在实例对象上，但是实例对象可以访问和调用（实质上通过 `__proto__` ）它们 。

###### 四、如何区分**实例自身的属性**和**定义在构造函数原型对象中的属性**

```js
function Cat(name) {
  this.name = name;
}
Cat.prototype.clean = function () {
  console.log("小猫清洁身体");
};
var miaomiao = new Cat("喵喵");

for (key in miaomiao) {
  if (miaomiao.hasOwnProperty(key)) {
    console.log("我是自身属性", key); // 我是自身属性 name
  } else {
    console.log("我不是自身属性", key); // 我不是自身属性 clean
  }
}

console.log(Object.keys(miaomiao)); // ["name"]
console.log(Object.getOwnPropertyNames(miaomiao)); // ["name"]
```

上例我们通过 `for...in...`、`hasOwnProperty()`、`Object.keys()`、`getOwnPropertyNames()` 遍历 `miaomiao` 上的属性名，可以看到：

- `for...in...` 可以获取到实例对象自身和原型链上的属性
- 可以通过 `hasOwnProperty()` 判断该属性是否属于实例对象自身
- `Object.keys()` 只能获取实例自身的属性
- `Object.getOwnPropertyNames()` 只能获取自身的属性

###### 五、练习

请回答下面代码会输出什么：

```js
function Person(name, sex) {
  this.name = name;
  this.sex = sex;
  var evil = "我很邪恶";
  var pickNose = function () {
    console.log("我会扣鼻子但不让你看见");
  };
  this.drawing = function (type) {
    console.log("我要画一幅" + type);
  };
}

Person.fight = function () {
  console.log("打架");
};

Person.prototype.wc = function () {
  console.log("我是个人我会wc");
};
var p1 = new Person("rookie", "boy");

console.log(p1.name);
console.log(p1.evil);
p1.drawing("国画");
p1.pickNose();
p1.fight();
p1.wc();
Person.fight();
Person.wc();
console.log(Person.sex);
```

答案：

```
"rookie"
undefined
"我要画一幅国画"
Uncaught TypeError: p1.pickNose is not a function
Uncaught TypeError: p1.fight is not a function
"我是个人我会wc"
"打架"
Uncaught TypeError: Person.wc is not a function
undefined
```

如果出错了请再理解上面提供理解的代码哦；**注意**：调用或使用不存在的属性会是 `undefined`，但是如果调用不存在的方法则会报错。

###### 六、如果构造函数和实例对象上存在相同名称的属性

```js
function Person() {
  this.sex = "男性";
}
Person.prototype.sex = "女性";
var person = new Person();
console.log(person.sex); // 男性
```

可以看到当我们使用 `person` 实例对象上的属性时，是使用自身的 `sex` 属性。
这也很好理解：当 `person` 寻找属性时，总是先从自身对象上寻找，如果寻找不到，才会到 `__proto__` 原型链上寻找，直到原型链为 `null`，如果原型链上也不存在该属性，则为 `undefined`，这也就是**原型链查找**。

再比如：

```js
function Cat() {
  this.color = "white";
  this.getColor = function () {
    console.log(this.color);
  };
}
Cat.prototype.color = "black";
Object.prototype.color = "red";
Object.prototype.type = "布偶猫";

var cat = new Cat();
console.log(cat.color); // white
console.log(cat.type); // 布偶猫
```

再通过这个例子可以加深理解原型链。

###### 七、总结

- 私有、公有、静态属性和方法
  - **私有**属性和方法：在构造函数内部调用和访问，在构造函数内使用 `var` 声明的属性
  - **公有**属性和方法：在构造函数内使用 `this` 设置，或者通过构造函数的原型对象 `Cat.prototype` 设置；
  - **静态**属性和方法：定义在构造函数上的方法 `Cat.xxx` 或者 `Object.assign()`，不需要通过实例可以调用
- 实例对象上和构造函数原型对象上的属性和方法
  - 构造函数原型对象上的属性和方法虽然没有直接表现在实例对象上，但是可以（隐式通过 `__proto__`） 访问和调用它们
  - 当访问一个对象的属性/方法时，它不仅仅存在该对象上查找，还会查找该对象的原型，一层一层向上查找，直到达到原型链的末尾 `null`
- 遍历实例对象属性的三种方法
  - `for...in...` 可以遍历自身和原型链上的属性
  - 可以通过 `Object.hasOwnProperty()` 方法传入属性名判断是否属于该实例
  - 可以使用 `Object.keys()` 和 `Object.getOwnPropertyNames()` 获取到实例自身上的属性（以数组形式返回）

##### 5.2.1.2 ES6 之后的封装——class

在 ES6 标准中，新增了 `class` 这个关键字。

它可以用来代替构造函数，达到创建“一类实例”的效果。

并且类的数据类型就是函数，所以用法上和构造函数很像，直接通过 `new` 命令来创建一个实例。

还有一件事可能是我们不知道的：**类所有的方法都定义在类的 prototype 属性上面**。

例如：

```js
class Cat {
  constructor() {};
  toString() {};
  toValue() {};
}
// 等同于
function Cat () {};
Cat.prototype = {
  constructor() {};
  toString() {};
  toValue() {};
};
```

###### 一、理解 class 关键字

我们把 ES6 之前的封装版本使用 ES6 之后的 `class` 关键字进行更改：

```js
class Cat {
  constructor(name, color) {
    this.name = name;
    this.color = color;

    var heart = "心";
    var stomach = "胃";
    var heartbeat = function () {
      console.log(heart + "跳");
    };

    // 公有方法'跳'
    this.jump = function () {
      heartbeat();
      console.log(this.name + "跳");
    };
  }
}

var miaomiao = new Cat("喵喵", "狸花");
console.log(miaomiao);
miaomiao.jump();
```

可以发现实际上当我们调用 `Cat` 时，`class Cat` 会默认执行构造函数，并构造出一个新的实例对象 `this` 并将他返回，因此它被称为 `constructor` 构造方法（函数）。

（另外，如果 `class` 没有定义 `constructor` ，也会隐式生成一个 `constructor` 方法）

公有（实例）属性和方法：

- `name`
- `color`
- `jump`

其实 `heart`、`stomach` 就不应该叫做私有属性了，只不过被局限于 `constructor` 这个构造函数中，是这个作用域下的变量而已。

控制台打印结果：

```
Cat {name: "喵喵", color: "狸花", jump: ƒ}
心跳
喵喵跳
```

###### 二、弄懂在类中定义属性或方法的几种方式

```js
class Cat {
  constructor() {
    // 猫的私有属性'心'和胃
    var heart = "心";
    // 猫的私有方法'心跳'
    var heartbeat = function () {
      console.log(heart + "跳");
    };

    // 公有方法'跳'
    this.jump = function () {
      heartbeat();
      console.log(this.name + "跳");
    };
  }

  color = "布偶";
  clean = function () {
    console.log("小猫清洁身体");
  };
  description() {
    console.log("创造猫");
  }
}

var miaomiao = new Cat();
console.log(miaomiao); // Cat {color: "布偶", clean: ƒ, jump: ƒ}
console.log(Object.keys(miaomiao)); // ["color", "clean", "jump"]

miaomiao.clean(); // 小猫清洁身体
miaomiao.description(); // 创造猫
```

可以看出：

- 在 `constructor` 中 `var` 定义一个变量，它只存在于 `constructor` 这个构造函数中
- 在 `constructor` 中 `this` 定义的属性和方法会挂载到实例上
- 在 `class` 中使用 `=` 定义一个方法和属性，效果和第二点相同，会定义到实例上
- 在 `class` 中直接定义一个方法，会添加到原型对象 `prototype` 上

解析：

- `heart` 只能在 `constuctor` 函数中使用，所以不会出现在实例中
- `color`、`clean`、`jump` 满足第二和第三点，出现在实例中
- `description` 是直接定义的，满足第四点，添加到原型对象 `Cat.prototype` 上，因此不会被 `Object.keys()`、`Object.getOwnPropertyNames()`这些获取实例自身属性的方法获取到
- `descrption` 虽然在原型对象中，但是还是能被实例所调用

那么，为什么 `clean = function() {}` 和 `description() {}` 都是在 `class` 内定义的方法，为什么一个会出现在实例中，一个却在原型对象 `prototype` 上呢？

其实我们不用特地去记，只需要记住：**在类的所有方法都定义在类的 `prototype` 属性上面**。

这里的 `clean` 和 `color` 一样都是用 `=` 设置的，都是一个普通的变量，只不过 `clean` 这个变量是个函数，所以它并不算是定义在类上的函数，因此不会存在于原型对象上。

而 `description() {}` 和 `constructor() {}` 一样，都是定义在类上的方法，因此都会存在于原型对象 `prototype` 上。

转化成伪代码：

```js
class Cat {
  constructor() {}
  description() {}
}

// 等同于
function Cat() {}
Cat.prototype = {
  constructor() {}
  description() {}
}
```

###### 三、在 `class` 定义的静态属性和方法

在前面我们给 `Cat` 定义静态属性和方法都是采用这种方式：`Cat.xxx`

```js
function Cat() {
  // ...
}

Cat.description = function () {};
```

在 `class` 中我们也可以通过 `Cat.xxx` 这种方式定义，除此之外，我们还可以使用 `static` 标识符来表示它是一个静态属性或方法：

```js
class Cat {
  static description = '创造猫',
  static clean() {
    console.log('清洁身体');
  }
}

console.log(Cat.description); // 创造猫
Cat.clean(); // 清洁身体
```

紧接着我们看着一道题目：

```js
class Cat {
  constructor(name, color) {
    var heart = "心";
    var stomach = "胃";
    var heartbeat = function () {
      console.log(heart + "跳");
    };
    this.name = name;
    this.color = color;
    heartbeat();
    this.jump = function () {
      console.log(this);
      console.log("我跳起来了~来追我啊");
    };
  }

  cleanTheBody = function () {
    console.log("我会用唾液清洁身体");
  };
  static descript = "我这个类是用来生产出一只猫的";
  static actingCute() {
    console.log(this);
    console.log("一听到猫我就想到了它会卖萌");
  }
}

Cat.staticName = "staticName";
var miaomiao = new Cat("喵喵", "white"); // 心跳
console.log(miaomiao); // Cat {name: "喵喵", color: "white", jump: f, cleanTheBody: f}
miaomiao.jump(); // Cat {name: "喵喵", color: "white", jump: f, cleanTheBody: f} , 我挑起来了~来追我啊
miaomiao.cleanTheBody(); // 我会用唾液清洁身体
console.log(miaomiao.descript); // undefined
// miaomiao.actingCute() // Uncaught TypeError: miaomiao.actingCute is not a function
Cat.actingCute(); // Class Cat {...} 一听到猫我就想到了它会卖萌
console.log(Cat.descript); // 我这个类是用来生产出一只猫的
console.log(Cat.staticName); // staticName
```

###### 四、坑一

```js
var a = new A();
function A() {}
console.log(a);

var b = new B();
class B {}
console.log(b);
```

开始的预想为：

```
A{}
B{}
```

实际结果：

```
A {}
Uncaught ReferenceError: Cannot access 'B' before initialization
```

那是因为函数 `A` 是会被提升到作用域的最顶层，所以可以在定义函数 `A` 之前使用 `new A()`。

**但是类却不存在这种提升机制**，所以当我们执行 `new B()` 的时候就会报错：在 `B` 初始化之前不能使用它。

尽管我们直到，`class` 的本质是一个函数：

```js
console.log(typeof B); // function
```

###### 五、坑二

```js
class Cat {
  constructor() {
    this.name = "guaiguai";
    var type = "constructor";
  }
  type = "class";
  getType = function () {
    console.log(this.type);
    console.log(type);
  };
}

var type = "window";
var guaiguai = new Cat();
guaiguai.getType();
```

这是一道考察作用域和 `class` 内定义属性和方法的题目。

1. 首先 `Cat` 类在 `consctructor` 内使用 `var` 定义了一个 `type`，然后在 `class` 里面定义了一个变量 `type`，然后再在全局作用域中 `var` 定义了一个 `type`。
1. 我们实例化了 `Cat`，并调用实例里面的 `getType()` 方法，打印 `this.type` 和 `type`。
1. 首先是 `guaiguai` 实例调用的 `getType()` 方法，那么 `getType` 方法里面的 `this` 就会指向 `guaiguai` 实例，实际上 `guaiguai` 实例上的 `type` 是定义在构造函数外的 `type = 'class'` 的变量，而不是在 `consctructor` 里面用 `var` 声明的变量；
1. 然后再打印 `type` 变量：在 `getType` 方法里面是没有 `type` 变量的（考察作用域，无法获取到 `constructor` 里面的 `type`），最后在全局作用域中找到 `type`，即 'window'；
1. 所以会输出 `class`、`window`。

###### 六、坑三

假如我们把上一题的 `getType()` 方法换成箭头函数，又会输出什么？

```js
class Cat {
  constructor() {
    this.name = "guaiguai";
    var type = "constructor";
  }
  type = "class";
  getType = () => {
    console.log(this.type);
    console.log(type);
  };
}

var type = "window";

var guaiguai = new Cat();

guaiguai.getType();
```

答案还是不变的；因为箭头函数**箭头函数内的 this 是由外层作用域决定的**，所以 `this.type` 指向 `guaiguai.type`（注意 `class` 类的本质是个函数）。

###### 七、如果 `class` 中存在两个相同的属性或者方法会怎么样？

```js
class Cat {
  constructor() {
    this.name = "喵喵";
  }
  name = "乖乖";
}
var cat = new Cat();

console.log(cat.name); // 喵喵
```

可以看到 `constructor` 里面的属性是会覆盖 `class` 里定义的属性的。

**class 总结**

- `class` 的基本概念：
  - 当你使用 `class` 的时候，它会默认调用 `constructor` 这个函数，来接收一些参数，并构造出一个新的实例对象 `this` 并将它返回。
  - 如果你的 `class`没有定义 `constructor` ，也会隐式生成一个 `constructor` 方法
- `class` 中几种定义属性的区别：
  - 在 `constructor` 中 `var` 一个变量，它只存在于`constructor` 这个构造函数中
  - 在 `constructor`中使用 `this`定义的属性和方法会被定义到实例上
  - 在 `class`中使用 `=`来定义一个属性和方法，效果与第二点相同，会被定义到实例上
  - 在 `class`中直接定义一个方法，会被添加到原型对象 `prototype`上
  - 在 `class`中使用了 `static`修饰符定义的属性和方法被认为是静态的，被添加到类本身，不会添加到实例上
- other:
  - `class` 本质虽然是个函数，但是并不会像函数一样提升至作用域最顶层
  - 如遇 `class`中箭头函数等题目请参照构造函数来处理
  - 使用 `class` 生成的实例对象，也会有沿着原型链查找的功能

#### 5.2.2 继承

**学习网站：**[做完这 48 道题彻底弄懂 JS 继承(1.7w 字含辛整理-返璞归真)](https://juejin.im/post/5e75e22951882549027687f9)

**继承就是子类可以使用父类所有功能，并且对这些功能进行扩展。**

##### 5.2.2.1 原型链继承

将子类的原型对象指向父类的实例。

###### 一、理解原型链继承的概念

```js
function Parent() {
  this.name = "Parent";
  this.sex = "boy";
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child() {
  this.name = "child";
}
Child.prototype = new Parent();

var child1 = new Child();
child1.getName(); // child
console.log(child1); // Child {name: "child"}
```

图解：

<img src="/assets/img/javascript/图5.2.2.1.png" />

这种方式就叫做**原型链继承**。

伪代码：

```js
Child.prototype = new Parent();
```

当然，更加严谨一点的做法其实还有一步：`Child.prototype.constructor = Child`，到后面中我们再来详细说它。

**注意：** 原型链继承不是 `Child.prototype = Parent.prototype`，根据 `new` 实例的过程，当我们 `new` 一个 `Child` 实例时，是执行 `Child` 构造函数，因此 `Parent` 构造函数的 `sex` 属性我们是拿不到的，因此这种方法是无法获取父类的属性和方法的。

###### 二、理解原型链继承的优点和缺点

```js
function Parent(name) {
  this.name = name;
  this.sex = "boy";
  this.colors = ["white", "black"];
}
function Child() {
  this.feature = ["cute"];
}
var parent = new Parent("parent");
Child.prototype = parent;

var child1 = new Child("child1");
child1.sex = "girl";
child1.colors.push("yellow");
child1.feature.push("sunshine");

var child2 = new Child("child2");

console.log(child1); //
console.log(child2);

console.log(child1.name);
console.log(child2.colors);

console.log(parent);
```

**答案：**

```js
Child{ feature: ['cute', 'sunshine'], sex: 'girl' }
Child{ feature: ['cute'] }

'parent'
['white', 'black', 'yellow']

Parent {name: "parent", sex: 'boy', colors: ['white', 'black', 'yellow'] }
```

**原型链继承总结：**

- 优点
  - 继承了父类模板，又继承了父类的原型对象
- 缺点
  - 如果给子类的原型上上新增属性和方法，必须放在 `Child.prototype = new Parent()` 这样的语句后面
  - 无法实现多继承(因为已经指定原型对象了)
  - 来自于原型对象的所有属性和方法是共享的，互相干扰
  - 创建子类时，无法向父类的构造函数传参

##### 5.2.2.2 构造继承

了解了最简单的**原型链继承**后，再来看**构造继承**，也叫**构造函数继承**。

在子类构造函数内部使用 `call` 或 `apply` 来调用父类构造函数。

###### 一、构造（函数）继承的基本原理

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "child");
}
var child1 = new Child();
console.log(child1); // Child {sex: "boy", name: "child"}
```

> 如果还不了解 `this`、`apply`、`call` 和 `bind`，请去上面了解。

###### 二、继续理解

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "good boy");
  this.name = "bad boy";
}
var child1 = new Child();
console.log(child1); // Child{sex: "boy", name: "bad boy"}
```

这相当于重复定义了两个相同的属性名，自然是后面的覆盖前面的。

###### 三、构造继承的优点————解决了原型继承子类共享父类引用对象的问题，可以向父类传递参数

```js
function Parent(name, sex) {
  this.name = name;
  this.sex = sex;
  this.colors = ["white", "black"];
}
function Child(name, sex) {
  Parent.call(this, name, sex);
}
var child1 = new Child("child1", "boy");
child1.colors.push("yellow");

var child2 = new Child("child2", "girl");
console.log(child1);
console.log(child2);
```

结果：

```js
Child{ name: 'child1', sex: 'boy', colors: ['white', 'black', 'yellow'] }
Child{ name: 'child2', sex: 'girl', colors: ['white', 'black'] }
```

使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类。

所以现在 `child1` 和 `child2` 现在分别有它们各自的 `colors` 了，就不共享了，而且这种拷贝属于深拷贝。

因此我们可以得出**构造继承**的优点：

- 解决了原型链继承中子类实例共享父类引用对象的问题，实现多继承，创建字类实例时，可以向父类传递参数

###### 四、构造继承的缺点一————无法调用父类原型上的属性和方法

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child() {
  this.sex = "boy";
  Parent.call(this, "good boy");
}
Child.prototype.getSex = function () {
  console.log(this.sex);
};
var child1 = new Child();
console.log(child1);
child1.getSex();
child1.getName();
```

结果：

```js
Child {sex: "boy", name: "good boy"}
'boy'
Uncaught TypeError: child1.getName is not a function
```

- `sex`、`name` 属性都很好理解
- `getSex` 属于 `Child` 构造函数原型对象的方法，所以我们也能够使用
- `getName` 属于父类构造函数原型对象上的方法，我们只是执行了父类构造函数，复制了父类构造函数里的属性和方法，并没有复制原型对象，自然是无法调用父类构造函数原型对象里的属性和方法的

所以**构造继承**的缺点：

- 构造继承只能继承父类的实例的属性和方法，不能继承父类原型的属性和方法

###### 五、构造继承的缺点二————实例只是子类的实例，不是父类的实例

它的第二个缺点是：实例并不是父类的实例，只是子类的实例。

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "child");
}
var child1 = new Child();

console.log(child1);
console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
console.log(child1 instanceof Object);
```

结果：

```js
Child {sex: "boy", name: "child"}
true
false
true
```

###### 六、构造继承缺点三————无法实现函数复用

```js
function Parent(name) {
  this.name = name;
  this.say = function () {
    console.say(this.name);
  };
}

function Child(sex) {
  this.sex = sex || "boy";
  Parent.call(this, "tony");
}
```

会重复定义 `say` 方法，其实更好的做法时把方法定义在 `Parent.prototype` 中，每个实例自动继承这个方法，不用在构造函数中重复写。

###### 七、总结

- 优点
  - 解决了原型链继承中子类实例共享父类引用对象的问题
  - 可以多继承
  - 创建子类实例时，可以向父类构造函数传递参数
- 缺点
  - 不能调用父类原型上的属性和方法
  - 子类实例并不是父类的实例，只是子类的实例
  - **无法实现函数复用**，每个子类都有父类实例函数的副本，影响性能

##### 5.2.2.3 组合继承

出现**组合继承**的原因就是因为**原型链继承**和**构造继承**都有各自的缺点，那么我们就会想把两种方式组合在一起。

**思路：**

- 使用**原型链继承**使子类能够使用父类原型中的属性和方法
- 使用**构造继承**使子类能够使用父类实例中的属性和方法

###### 一、理解组成继承的基本使用

**实现：**

- 使用 `call/apply` 在子类构造函数中调用父类构造函数
- 将子类的构造函数的原型对象指向一个父类的匿名实例
- 修正子类构造函数原型对象的 `constructor` 属性，将它指向子类构造函数

###### 二、理解 `constructor` 有什么作用

上面的组合继承的 1、2 点都很好理解和实现，那么第三点的 `constructor` 有什么用呢？

可以看一下 `constructor` 存在的位置：

<img src="/assets/img/javascript/图5.2.2.3.png">

它实际上就是构造函数原型对象上的一个属性，指向构造函数。

```js
cat.__proto__ === Cat.prototype; // true
cat.__proto__.constructor === cat; // true
Cat.prototype.constructor === Cat; // true
```

答案

```js
Parent(name) {}
Parent(name) {}
```

当我们想要获取 `child1.constructor`，肯定是向上查找，通过 `__proto__` 找它构造函数的原型对象匿名实例。
但是匿名实例它自身是没有 `constructor` 属性的呀，它只是 `Parent` 构造函数创建出来的一个对象而已，所以它也会继续向上查找，然后就找到了 `Parent` 原型对象上的 `constructor`，也就是`Parent` 了。

所以回过头来看看这句话：
**`construcotr` 它不过是给我们一个提示，用来标示实例对象是由哪个构造函数创建的。**

从人(常)性(理)的角度上来看，`child1` 是 `Child`构建的，`parent1` 是 `Parent` 构建的。

那么 `child1`它的 `constructor` 就应该是 `Child` 呀，但是现在却变成了 `Parent`，貌似并不太符合常理啊。

所以才有了这么一句：

```js
Child.prototype.constructor = Child;
```

用于修复 `constructor` 指向。

（为什么在**组合继承**中修复了 `constructor`，在**原型链继承**中没有，这个取决于我们自己，因为 `constructor` 属性实际上没有什么作用，不过面试官问到还是要知道的）

总的来说：

- `construtor` 是构造函数原型对象中的一个属性，正常情况下指向构造函数本身
- 它并不会影响 `JS` 内部属性，只是用来标识一下某个实例属性是由哪个构造函数产生而已
- 如果我们使用**原型链继承**或者**组成继承**无意间修改了 `constructor` 的指向，那么出于变成习惯，我们最好将它修改为正确的构造函数。

###### 三、理解组合继承的优点

```js
function Parent(name, colors) {
  this.name = name;
  this.colors = colors;
}
Parent.prototype.features = ["cute"];
function Child(name, colors) {
  this.sex = "boy";
  Parent.apply(this, [name, colors]);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child("child1", ["white"]);
child1.colors.push("yellow");
child1.features.push("sunshine");
var child2 = new Child("child2", ["black"]);

console.log(child1);
console.log(child2);
console.log(Child.prototype);

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

可以看出，**组合继承**的优点其实是两种继承方式的优点结合：

- 继承了父类实例中的属性和方法，也能够继承父类原型中的属性和方法
- 你补了原型链继承中引用属性共享的问题
- 可传参

###### 四、理解组成继承的缺点

```js
function Parent(name) {
  console.log(name); // 这里有个console.log()
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
Child.prototype = new Parent();
var child1 = new Child("child1");

console.log(child1);
console.log(Child.prototype);
```

结果：

```js
undefined
'child1'

Child{ name: 'child1' }
Parent{ name: undefined }
```

可以看到虽然我们只调用了 `new Child()` 一次，但打印了两次 `name`：

- 一次是**原型链继承** `new Parent` 的时候打印的
- 一次是**构造函数继承**，`Parent.call(this)` 执行的

也就是说，会重复两次调用父类构造函数，同时又有 `Child.prototype = new Parent()` 和 `Parent.call()`，那么 `Child.prototype` 中会有一份和子类实例一摸一样的属性，就比如这里的 `name: undefined`，可是我们子类实例已经有一份 `name: "child1"` 了，这显然是凭空多出来且无用的属性，占用了内存。

所以我们看出**组合继承**的缺点：

- 重复调用两次父类构造函数，然而子类中的属性会覆盖父类原型上的属性和方法，造成内存浪费，降低性能。

##### 五、总结

**实现方式：**

- 使用**原型链继承**来保证子类能继承到父类原型中的属性和方法
- 使用**构造继承**来保证子类能继承到父类的实例属性和方法

**优点：**

- 可以继承父类实例属性和方法，也能够继承父类原型属性和方法
- 弥补了原型链继承中引用属性共享的问题
- 可传参

**缺点：**

- 使用组合继承时，父类构造函数会被调用两次
- 并且生成了两个实例，子类实例中的属性和方法会覆盖父类原型(父类实例)上的属性和方法，所以增加了不必要的内存。

`constructor` 总结：

`constructor` 它是构造函数原型对象中的一个属性，正常情况下它指向的是原型对象。
它并不会影响任何 JS 内部属性，只是用来标示一下某个实例是由哪个构造函数产生的而已。
如果我们使用了原型链继承或者组合继承无意间修改了 `constructor` 的指向，那么出于编程习惯，我们最好将它修改为正确的构造函数。

##### 5.2.2.4 寄生组合继承

由于上面的**组合继承**存在调用两次父类构造函数，产生两个实例，父类实例上会有无用废弃属性的缺点，所以我们要直接跳过父类实例上的属性，而让我们直接就能继承父类原型链上的属性。

也就是说，我们需要一个**干净的实例对象**，来作为子类的原型。并且这个干净的实例对象还得能继承父类原型对象的属性。

所以就要使用 `Object.create()` 方法。

```js
Object.create(proto, propertiesObject);
```

- 参数一，需要指定的原型对象
- 参数二，可选参数，给新对象自身添加新属性以及描述器

第一个参数 `proto` 作用是指定你要创建的这个对象的它的原型对象是谁。

###### 一、理解寄生组合式继承

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  this.sex = "boy";
  Parent.call(this, name);
}
// 与组合继承的区别
Child.prototype = Object.create(Parent.prototype);

var child1 = new Child("child1");

console.log(child1);
child1.getName();

console.log(child1.__proto__); // Parent{}
console.log(Object.create(null)); // {}
console.log(new Object()); // {}
```

上面这个代码就是**寄生组合继承**，它与组合继承的区别就是 `Child.prototype` 不同。

我们使用了 `Object.create(parent.prototype)` 创建了一个空的对象，并且这个对象的 `__proto__` 指向 `Parent.prototype` 的。

<img src="/assets/img/javascript/图5.2.2.4.png">

可以看到 `Prent()` 与 `child` 没有任何关系了。

理解打印的三个空对象：

- 第一个空对象中包含了 `__proto__` 属性，实际上就是 `Parent.prototype`，也就是 `Object.create(Parent.prototype)` 创建的新对象，这个新对象的 `__proto__` 指向 `Parent.prototype`，所以 `Child` 实例就能够使用 `Parent.protype` 上的方法
- 完全的空对象，连这个对象中的 `__proto__` 属性都是 `null`，连 `Object.prototype` 上的方法都不能使用（如 `toString()`、`hasOwnProperty()`）
- 空对象，但是它的 `__proto__` 是 `Object.prototype`，所以可以使用 `Object` 的相关方法

###### 二、总结

**寄生组合继承**算是 `ES6` 之前一种比较完美的继承方式，避免了组成继承中两次调用父类构造函数，初始化两次实例属性的缺点，所以有了上述所有继承方式的优点：

- 只调用一次父类构造函数，只创建了一份父类属性
- 子类可以使用父类原型链上的方法和属性
- 子类能够正常地使用 `instanceoOf` 和 `isPropertypeOf` 方法

##### 5.2.2.5 原型式继承

算是翻了很多关于 `JS` 继承的文章吧，其中百分之九十都是这样介绍**原型式继承**

该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

伪代码如下：

(后面会细讲)

```js
function objcet(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

复制代码开始以为是多神秘的东西，但后来真正了解了它之后感觉用的应该不多吧... 😢
先来看看题目一。

###### 一、题目一

```js
var cat = {
  heart: "心",
  colors: ["white", "black"],
};

var guaiguai = Object.create(cat);
var huaihuai = Object.create(cat);

console.log(guaiguai);
console.log(huaihuai);

console.log(guaiguai.heart);
console.log(huaihuai.colors);
```

执行结果：

```js
{
}
{
}

("心");
colors: ["white", "black"];
```

这里用 `Object.create()` 方法创建一个新对象，它的 `__proto__` 属性指向 `cat` 对象，实际上是一个空对象，`guaiguai` 和 `huaihuai` 都是一只“空猫”。

###### 二、题目二

不怕你笑话，上面 👆 说的这种方式就是原型式继承，只不过在 `ES5` 之前，还没有 `Object.create()` 方法，所以就会用开头介绍的那段伪代码来代替它。

将上例改造一下，让我们自己来实现一个 `Object.create()`。

我们就将要实现的函数命名为 `create()`。

想想 `Object.create()` 的作用：

- 它接受的是一个对象
- 返回的是一个新对象，
- 新对象的原型链中必须能找到传进来的对象

所以就有了这么一个方法：

```js
function create(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

那为什么不能这样实现呢？

```js
function create(obj) {
  var newObj = {};
  newObj.__proto__ = obj;
  return newObj;
}
```

请注意了，我们是要模拟 `Object.create()` 方法，如果你都能使用 `__proto__`，那为何不干脆使用 `Object.create()` 呢？（它们是同一时期的产物）

###### 三、原型式继承总结

**实现方式：**
该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

在 `ES5` 之后可以直接使用 `Object.create()` 方法来实现，而在这之前只能手动实现。

**优点：**

- 在不用创建构造函数的情况下，实现了原型链继承，代码量减少一部分

**缺点：**

- 一些引用数据操作的时候会出现问题，两个实例会公用继承实例的引用数据类
- 谨慎定义方法， 以免定义方法也继承对象原型的方法重名
- 无法直接给父级构造函数使用参数

##### 5.2.2.6 寄生式继承

其实这个**寄生式继承**也没什么东西，就是在**原型式继承**的基础上再封装一层，来增强对象，之后再将这个对象返回。

伪代码：

```js
function createAnother(origin) {
  var clone = Object.create(origin); // 通过 Object.create() 函数创建一个新对象
  clone.fn = function () {}; // 以某种形式来增强这个对象
  return clone; // 返回这个对象
}
```

###### 一、了解寄生式继承的使用方式

例如我想要继承某个对象上的属性，同时又想在新创建的对象上新增上一些其他属性。

来看下面两只猫咪：

```js
var cat = {
  heart: "❤️",
  colors: ["white", "black"],
};
function createAnother(original) {
  var clone = Object.create(original);
  clone.activingCute = function () {
    console.log("我是一只会卖萌的猫咪");
  };
  return clone;
}
var guaiguai = createAnother(cat);
var huaihuai = Object.create(cat);

guaiguai.activingCute();
console.log(guaiguai.heart);
console.log(huaihuai.colors);
console.log(guaiguai);
console.log(huaihuai);
```

题目解析：

- `guaiguai` 是一只经过加工的小猫咪，所以它会卖萌，因此调用 `activingCute` 会打印卖萌
- 两只猫都是通过 `Object.create()` 经过**原型式继承** `cat` 对象的，所以是共享使用 `cat` 对象中的属性
- `guaiguai` 经过 `createAnthor` 新增了自身的实例方法 `activingCute`，所以会有这个方法
- `huaihuai` 是一只空猫，因为 `heart`、`colors` 都是原型对象 `Cat` 上的属性

执行结果：

```js
"我是一只会卖萌的猫咪";
"❤️"[("white", "black")];
{
  actingCute: ƒ;
}
{
}
```

###### 二、寄生式继承总结

**实现方式：**

- 在**原型式继承**的基础上再封装一层，来增强对象，之后将这个对象返回

**优点：**

- 引用数据的操作会出现问题，两个实例公用继承实例的引用数据
- 谨慎定义方法，以免定义方法也继承对象原型的方法重名
- 无法直接给父级构造函数使用参数

##### 5.2.2.7 混入式继承

终于到了 `ES5` 中的最后一种继承方式：**混入式继承**。

之前我们一只是以一个子类继承一个父类，而**混入式继承**就是教我们如何一个子类继承多个父类。

在这里，我们要用到 `ES6` 中的方法 `Object.assign()`。

它的作用就是可以把多个属性和方法拷贝到目标对象中，若存在同名属性则覆盖。（浅拷贝）

先看伪代码：

```js
function Child() {
  Parent.call(this);
  OtherParent.call(this);
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype);
Child.prototype.constructor = Child;
```

###### 一、理解混入式继承的使用

```js
function Parent(sex) {
  this.sex = sex;
}
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
function OtherParent(colors) {
  this.colors = colors;
}
OtherParent.prototype.getColors = function () {
  console.log(this.colors);
};
function Child(sex, colors) {
  Parent.call(this, sex);
  OtherParent.call(this, colors); // 新增的父类
  this.name = "child";
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype); // 新增的父类原型对象
Child.prototype.constructor = Child;

var child1 = new Child("boy", ["white"]);
child1.getSex();
child1.getColors();
console.log(child1);
```

结果：

```js
'boy'
['white']
{ name: 'child', sex: 'boy', colors: ['white'] }
```

###### 二、理解混入式继承的原型链结构

同样的例子，加多几个输出：

```js
function Parent(sex) {
  this.sex = sex;
}
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
function OtherParent(colors) {
  this.colors = colors;
}
OtherParent.prototype.getColors = function () {
  console.log(this.colors);
};
function Child(sex, colors) {
  Parent.call(this, sex);
  OtherParent.call(this, colors); // 新增的父类
  this.name = "child";
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype); // 新增的父类原型对象
Child.prototype.constructor = Child;

var child1 = new Child("boy", ["white"]);
// child1.getSex()
// child1.getColors()
// console.log(child1)

console.log(Child.prototype.__proto__ === Parent.prototype);
console.log(Child.prototype.__proto__ === OtherParent.prototype);
console.log(child1 instanceof Parent);
console.log(child1 instanceof OtherParent);
```

输出：

```js
true;
false;
true;
false;
```

可以看看这个例子的思维导图

<img src="/assets/img/javascript/图5.2.2.7.png">

其实相比**寄生组合式继承**就多了下面的 `OtherParent` 的部分

- `Child` 内使用了 `call/apply` 来复制构造函数 `OtherPrent` 上的属性和方法
- `Child.prototype` 使用 `Object.assign()` 浅拷贝 `OtherParent.prototype` 上的属性和方法

##### 5.2.2.8 class 中的 extends 继承

最后是 `ES6` 中的 `class` 继承，在 `class` 中继承主要是依靠两个东西：

- `extends`
- `super`

且这种继承的效果和之前介绍的**寄生组合继承**方式一样。

###### 一、理解 `class` 中的继承

既然它的继承和**寄生组合继承**一样，就上面的例子改造，用 `class` 的继承方式来实现：

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
  constructor(name) {
    super(name);
    this.sex = "boy";
  }
}
var child1 = new Child("child1");
console.log(child1);
child1.getName();

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

结果：

```js
Child{ name: 'child1', sex: 'boy' }
'child1'
true
true
```

再复现**寄生组合继承**的实现方式：

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name) {
  this.sex = "boy";
  Parent(this, name);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var child1 = new Child("child1");
console.log(child1);
child1.getName();

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

会发现打印的结果是一样的。

###### 二、理解 `extends` 的基本作用

上面的例子用到了 `extends` 和 `super`。

`extends` 从字面上来看就是某个东西的延伸、继承。

如果我们只用 `extends` 而不用 `super` 呢？

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
  // constructor (name) {
  //   super(name)
  //   this.sex = 'boy'
  // }
  sex = "boy"; // 实例属性sex放到外面来
}
var child1 = new Child("child1");
console.log(child1);
child1.getName();
```

其实这里的执行结果和没有隐去之前一样。

执行结果：

<img src="/assets/img/javascript/图5.2.2.8.png">

那我们是不是可以认为：

```js
class Child extends Parent {}

// 等同于
class Child extends Parent {
  constructor(...args) {
    super(...args);
  }
}
```

OK👌，其实这一步很好理解啦，还记得之前我们就提到过，在 `class` 中如果没有定义 `constructor` 方法的话，这个方法是会被默认添加的，那么这里我们没有使用 `constructor`，它其实已经被隐式的添加和调用了。
所以我们可以看出 `extends` 的作用：

- `class` 可以通过 `extends` 关键字实现继承父类的所有属性和方法
- 若是使用了 `extends` 实现继承的子类内部没有 `constructor` 方法，则会被默认添加 `constructor` 和 `super`。

###### 三、理解 `super` 的基本作用

从上面的例子看起来 `constructor` 像一个可有可无的角色。

那么 `super` 呢？假如我们不使用 `super`

```js
class Parent {
  constructor() {
    this.name = "parent";
  }
}
class Child extends Parent {
  constructor() {
    // super(name) // 把super隐去
  }
}
var child1 = new Child();
console.log(child1);
child1.getName();
```

然后就报错了：

```js
Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

意思就是必须在 `constructor` 中调用一下 `super` 函数。

再结合 `super` 的写法，有点像调用父级的 `constructor` 并且传递参数，实际上和 `ES6` 的继承机制有关：

- 我们知道在 `ES5` 中的继承（例如**构造继承**、**寄生组合继承**），实际上是先创造子类的实例对象 `this`，然后再将父类的属性和方法添加到 `this` 上，即 `Parent.call(this)`
- 而在 `ES6` 中却不是这样的，它的实质是先**创造父类的实例对象 `this`（也就是使用 `super()`），然后再用子类的构造函数去修改 `this`。**

通俗理解就是，子类必须得在 `constructor` 中调用 `super` 方法，否则新建实例就会报错，因为子类自己没有自己的 `this` 对象，而是继承父类的 `this` 对象，然后对其加工，如果不调用 `super` 的话子类就得不到 `this` 对象。

###### 四、`super` 的具体用法—— `super` 当函数调用时

`super` 其实有两种用法，一种是当作函数来调用的，还有一种是当作对象来使用的。

在之前的例子就是把它当成函数来调用的，而且必须得在 `constructor` 中执行。

实际上，**当 `super` 被当作函数调用时，代表着父类的构造函数**。

虽然它代表父类的构造函数，但是返回的却是子类的实例，也就是说 `super` 内部的 `this` 指向是 `Child`。

验证一下（`new.target` 指向当前正在执行的那个函数，你可以理解为 `new` 后面那个函数）：

```js
class Parent {
  constructor() {
    console.log(new.target.name);
  }
}
class Child extends Parent {
  constructor() {
    var instance = super();
    console.log(instance);
    console.log(instance === this);
  }
}
var child1 = new Child();

var parent1 = new Parent();

console.log(child1);
console.log(parent1);
```

我们在父类的 `constructor` 中打印 `new.target.name`，并且用一个 `instance` 的变量来盛放 `super()` 的返回值。

而刚刚我们说了，`super` 的调用代表着父类构造函数，那么我们调用 `new Child` 的时候，肯定也执行了父类的 `constructor` 函数，所以 `console.log(new.target.name)` 肯定执行了两遍（一遍 `new Child`，一遍 `new Parent`）

所以执行结果：

```js
'Child'
Child{}
true

'Parent'

Child{}
Parent{}
```

- `new.target` 代表的是 `new` 后面的那个函数，那么 `new.target.name` 表示的是这个函数名，所以在执行 `new Child` 的时候，由于调用了 `super()`，所以相当于执行了 `Parent` 中的构造函数，因此打印出了 `'Child'`。
- 另外，关于 `super()` 的返回值 `instance`，刚刚已经说了它返回的是子类的实例，因此 `instance` 会打印出 `Child{}`；并且 `instance` 和子类 `construtor` 中的 `this` 相同，所以打印出 `true`。
- 而执行 `new Parent` 的时候，`new.target.name` 打印出的就是 `'Parent'` 了。
  最后分别将 `child1` 和 `parent1` 打印出来，都没什么问题。

通过这道题我们可以看出：

- `super` 当成函数调用时，代表父类的构造函数，且返回的是子类的实例，也就是此时 `super` 内部的 `this` 指向子类。
- 在子类的 `constructor` 中 `super()` 就相当于是 `Parent.constructor.call(this)`

###### 五、`super` 被当成函数调用的限制

刚刚说明了 `super` 当成函数调用就是相当于用 `call` 来改变父类构造函数中 `this` 的指向，那么它的使用有什么限制呢？

- 子类 `constructor` 中如果要使用 `this` 的话就必须放到 `super()` 之后
- `super` 当成函数调用时只能在子类的 `constructor` 中使用

继续看代码：

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name) {
    this.sex = "boy";
    super(name);
  }
}

var child = new Child();
console.log(child);
```

结果会报和前面例子一样的错误：

```js
Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

子类 `constructor` 中如果要使用 `this` 的话就必须放到 `super()` 之后。

这其实非常好理解，还记得 `super` 的作用吗？在 `constructor` 中必须有 `super()`，它就是用来产生 `this` 的，那么必须得产生 `this` 才能调用。

也就是在 `this.sex = 'boy'` 这一步就已经报错了。

###### 六、`super` 当成对象来使用

`super` 如果当成一个对象来调用，那也可能存在于 `class` 里不同地方。

比如 `constructor`、`子类实例方法`、`子类构造方法`，在这些地方分别指代什么？

我们只需要记住：

- 在子类的普通函数中 `super` 对象指向父类的原型对象
- 在子类的静态方法中 `super` 指向父类

依靠这个准则：

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}
Parent.prototype.getSex = function () {
  console.log("boy");
};
Parent.getColors = function () {
  console.log(["white"]);
};
class Child extends Parent {
  constructor(name) {
    super(name);
    super.getName();
  }
  instanceFn() {
    super.getSex();
  }
  static staticFn() {
    super.getColors();
  }
}
var child1 = new Child("child1");
child1.instanceFn();
Child.staticFn();
console.log(child1);
var parent = new Parent("parent");
```

根据准则，可以得出执行结果为：

```js
'child1'
'boy'
['white']
Child{ name: 'child1' }
```

###### 七、`super` 当成对象调用父类方法时 `this` 的指向

还是上面的题目：既然 `super.getName()`，`getName` 是被 `super` 调用的，而我却说此时的 `super` 指向的是父类原型对象。那么 `getName` 内打印出的应该是父类原型对象上的 `name`，也就是 `undefined` 呀，怎么会打印出 `child1` 呢？

接着看代码：

```js
class Parent {
  constructor() {}
}
Parent.prototype.sex = "boy";
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
class Child extends Parent {
  constructor() {
    super();
    this.sex = "girl";
    super.getSex();
  }
}
var child1 = new Child();
console.log(child1);
```

结果还是打印了子类实例上的 `sex` 属性，即 `'girl'`，因此：

- `ES6` 规定，通过 `super` 调用父类方法时，`super` 会绑定子类的 `this`

也就是说，`super.getSex()` 转成伪代码就是：

```js
super.getSex.call(this);

// 即
Parent.prototype.getSex.call(this);
```

而且 `super` 其实还有一个特性，就是你在使用它的时候，必须得显式的指定它是作为函数使用还是对象来使用，否则会报错的。

比如下面这样就不可以：

```js
class Child extends Parent {
  constructor {
    super(); // 不报错
    super.getName(); // 不报错
    console.log(super); // 报错
  }
}
```

###### 八、了解 `extends` 的继承目标

`extends` 后面接车的咪表不一定是一个 `class`。

`class B extends A {}`，只要 `A` 是一个有 `prototype` 属性的函数，就能被 `B` 继承。

由于函数有 `prototype` 属性，所以 `A` 可以是任意函数。

继续看代码：

```js
function Parent() {
  this.name = "parent";
}

class Child1 extends Parent {}
class Child2 {}
class Child3 extends Array {}
var child1 = new Child1();
var child2 = new Child2();
var child3 = new Child3();
child3[0] = 1;

console.log(child1);
console.log(child2);
console.log(child3);
```

执行结果：

```js
Child1{ name: 'parent' }
Child2{}
Child3[1]
```

- **Child1：** 可以继承构造函数 `Parent`
- **Child2：** 不存在任何继承，就是一个普通函数
- **Child3：** 继承原生构造函数

（其实这里只要作为一个知道的知识点就可以了，真正使用来说貌似不常用）

###### 九、`class` 继承总结

**ES6 中的继承：**

- 主要是依赖 `extends` 关键字来实现继承，且继承效果类似于**寄生组合式继承**
- 使用 `extends` 实现继承不一样要 `constructor` 和 `super`，没有的话会默认产生并调用它们
- `extends` 后面不一定是 `class`，只要是有 `prototype` 属性的函数就可以了

**super 相关：**

- 在实现继承时，如果子类有 `constructor` 函数，必须在 `constructor` 中调用 `super`，并且要在使用 `this` 之前调用，因为 `super` 就是产生 `this` 对象的
- `super` 有两种调用方式：当成函数调用和当成对象调用
- `super` 当成函数调用时，相当于调用父类构造函数，并且返回的是子类实例。在子类 `constructor` 中调用 `super()` 相当于 `Parent.constructor.call(this)`
- `super` 当成对象调用时，如果在子类的普通函数中，则指向的是父类的 `prototype` 原型对象中的方法和属性；如果在子类的的静态方法中调用，`super` 则指向父类。并且 `super` 会绑定子类的 `this`，相当于 `Parent.prototype.fn.call(this)`。

**ES5 和 ES6 继承的区别：**

- 在 `ES5` 中的继承（如构造继承、寄生组合继承），实质上是**先创造子类的实例对象 `this`，然后再将父类的属性和方法添加到 `this` 上**
- 在 `ES6` 中的继承实质是**先创建父类的实例对象 `this`（也就是 `super`），然后再在子类的构造函数中修改 `this` 指向**

##### 5.2.2.9 instanceof

官方解释：`instanceof` **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例的原型链上。

例如：`a instance B`，检测 `a` 的原型链 `__proto__` 上是否有 `B.prototype`，有则返回 `true` ，否则返回 `false`。

###### 题目一：理解 `instanceof`

```js
function Parent() {
  this.name = "parent";
}
function Child() {
  this.sex = "boy";
}
Child.prototype = new Parent();
var child1 = new Child();

console.log(child1 instanceof Child); // true
console.log(child1 instanceof Parent); // true
console.log(child1 instanceof Object); // true
```

###### 题目二：理解 `isPrototypeOf()`

它是属于 `Object.prototype` 上的方法，`isPrototypeOf()` 的用法和 `instanceof` 想法，它是用来判断指定对象 `object1` 是否存在于另一个对象 `object2` 的原型中，是则返回 `true`，否则返回 `false`。

```js
function Parent() {
  this.name = "parent";
}
function Child() {
  this.sex = "boy";
}
Child.prototype = new Parent();
var child1 = new Child();

console.log(Child.prototype.isPrototypeOf(child1)); // true
console.log(Parent.prototype.isPrototypeOf(child1)); // true
console.log(Object.prototype.isPrototypeOf(child1)); // true
```

判断的方式只要把原型链继承 `instanceof` 反过来查找即可。

#### 5.2.3 所有继承总结

最后再次总结上面所有继承的实现方式的伪代码和优缺。

##### 5.2.3.1 原型链继承

**实现方式：**

```js
Child.prototype = new Parent();
```

**优缺点：**

- 优点
  - 可以获取父类及其原型链上的属性和方法
- 缺点
  - 来自于原型对象上的属性和方法都是共享的，互相干扰
  - 创建子类时，无法给父类的构造函数传参
  - 无法实现多继承（因为已经指定了原型对象了）
  - 无法给子类的原型上新增属性和方法，必须放在 `Child.prototpye = new Parent()` 语句之后

##### 5.2.3.2 构造继承

**实现方式：**

```js
function Parent(name) {
  this.name = name;
}

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this, name);
}

var child = new Child("boy", "tony");
```

**优缺点：**

- 优点
  - 可以给父类构造函数传参
  - 解决了原型链继承中子类共享父类原型上的属性和方法的问题
  - 可以实现多继承
- 缺点
  - 无法调用父类原型上的属性和方法
  - 无法实现父类上的函数复用，浪费性能和内存
  - 子类实例是子类的实例，但是不属于父类的实例

##### 5.2.3.3 组合继承

**实现方式：**

```js
function Parent(name) {
  this.name = name;
}

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 解决了原型链继承中无法使用父类实例中的属性和方法，并且子类实例共享父类原型上的属性和方法的问题
  - 解决了构造继承中无法使用父类原型中的属性和方法
  - 可以给父类构造函数传参
- 缺点
  - 调用了两次构造函数：一次 `Parent.call()`，一次 `Child.prototype = new Parent()`，子类上的同名属性和方法会覆盖父类实例上的属性和方法，增加了不必要的内存

##### 5.2.3.4 寄生组合继承

**实现方式：**
使用 `Object.create(proto, propertiesObject)` 创建一个干净的实例对象，这个实例对象还能继承父类原型上的属性和方法。

```js
function Parent() {
  this.name = "tony";
}

function Child() {
  this.sex = "boy";
  Parent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 解决寄生组合继承调用两次父类构造函数的问题，寄生组合继承只调用一次，创建一份父类实例
  - 子类可以调用到父类原型上的属性和方法
  - 可以正常使用 `instanceof` 和 `isPrototypeOf` 方法
- 缺点
  - 无

##### 5.2.3.5 原型式继承

**实现思路：**
创建一个构造函数，其原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

```js
function object(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

也等于：

```js
var child = Object(parent);
```

**注意：**
我们是模拟 `Object.create()` 方法，它和 `__proto__` 是同一时期的产物，所以都不能使用。在 ES5 之后可以直接使用 `Object.create()` 方法来实现，而在这之前只能手动实现。

**优缺点：**

- 优点
  - 在不用构造函数的情况下实现了原型链继承，代码量减少一部分
- 缺点
  - 一些引用数据操作的时候会出问题，两个实例会公用继承实例的引用数据类
  - 谨慎定义方法，以免定义方法也继承对象原型的方法重名
  - 无法直接给父级构造函数使用参数

##### 5.2.3.6 寄生式继承

**实现思路：**
实际上是在**原型式继承**的基础上再封装一层，来增强对象，再将这个对象返回。

```js
function createAnother(original) {
  var clone = Object.create(original); // 通过调用 Object.create() 函数创建一个新对象
  clone.fn = function () {}; // 以某种方式来增强对象
  return clone; // 返回这个对象
}
```

**优缺点：**

- 优点
  - 同原型式继承：在不用构造函数的情况下实现了原型链继承，代码量减少一部分
- 缺点
  - 一些引用数据操作的时候会出问题，两个实例会公用继承实例的引用数据类
  - 谨慎定义方法，以免定义方法也继承对象原型的方法重名
  - 无法直接给父级构造函数使用参数

##### 5.2.3.7 混入方式继承多个对象

**实现思路：**
这是 ES5 中最后一个继承方式，实际上就是实现一个子类继承多个父类，用到 `ES6` 中的方法：`Object.assign()`。它的作用就是把多个对象的属性和方法拷贝到目标对象中，若是存在同名属性的话，后面的会覆盖前面。（同样式一种浅拷贝）

```js
function Child() {
  Parent.call(this);
  anotherParent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, anotherParent.prototype);
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 可以实现多继承，一个子类继承多个父类
- 缺点
  - 后面添加到子类原型对象中的父类方法和属性会覆盖已经添加的同名方法和属性
  - 子类实际上是 `Object.create(Parent.prototype)` 的子类，不是后面 `Object.assign(anotherParent)` 的子类

##### 5.2.3.8 class 继承

```js
class Child extends Parent {
  constructor(...arg) {
    super(...arg);
  }
}
```

**ES6 中的继承：**

- 主要是依赖 `extends` 关键字实现，且继承的效果类似于**寄生组合继承**
- 使用了 `extends` 实现继承不一定要 `constructor` 和 `super`，因为没有的话会默认调用
- `extends` 后面接着的目标不一定是 `class`，只要是个有 `prototype` 属性的函数就可以了

**super 相关：**

- 在 `extends` 继承中，如果子类中有 `constructor` 函数，则必须调用 `super()`，因为是用来产生 `this` 的，所以关于 `this` 的操作要放在 `super()` 之后
- `super` 有两种调用方式，当成函数调用和当成对象调用
- `super` 当成函数调用时，代表着父类的构造函数，返回子类的实例，也就是此时 `super` 内部的 `this` 指向是指向子类的。在子类的 `constructor` 就相当于是 `Parent.constructor.call(this)`
- `super` 当成对象调用时，普通函数中的 `super` 指向父类的原型对象，静态函数中的 `super` 指向父类。并且通过 `super` 调用父类方法时，`this` 指向绑定子类，相当于是 `Parent.prototype.fn.call(this)`

**ES5 和 ES6 继承的区别：**

- 在 `ES5` 继承中都是先创建子类的实例对象 `this`，然后再将父类的属性和方法 添加到 `this` 上（Parent.call(this)）
- 在 `ES6` 继承中先创建父类的实例对象 `this`（也就是 `super`），然后再用子类的构造函数去修改 `this`

#### 5.2.4 多态

[JS 面向对象——多态学习](https://juejin.im/post/5e945a15f265da47d31231dd)

主要理解 JS 面向对象**多态**的含义，最后记住 JS 面向对象三大特征：**封装**、**继承**、**多态**。

## 6.1 深拷贝和浅拷贝

**涉及面试题：** 什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？

我们在学习 JS 对象类型在赋值的时候其实是赋值了地址，从而导致改变一方其他也都被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。

```js
let a = {
  age: 1,
};

let b = a;
a.age = 2;
console.log(b.age); // 2
```

### 6.1.1 浅拷贝

首先可以通过 `Object.assign` 来解决这个问题。

`Object.assign` 只会拷贝所有属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝。

```js
let a = {
  age: 1,
};

let b = Object.assign({}, a);
a.age = 2;
console.log(b.age); // 1
```

另外我们还可以通过展开运算符 `...` 来实现浅拷贝

```js
let a = {
  age: 1,
};
let b = { ...a };
a.age = 2;
console.log(b.age); // 1
```

针对数组，我们还可以使用 `slice` 和 `concat` 实现浅拷贝：

- slice

  ```js
  let arr2 = arr1.slice(0);
  ```

- concat

  ```js
  let arr2 = arr1.concat();
  ```

通常浅拷贝就能解决大部分问题了，但是遇到如下情况可能就需要使用深拷贝了

```js
let a = {
  age: 1,
  jobs: {
    fisrt: "FE",
  },
};
let b = { ...a };
a.jobs.first = "BE";
console.log(b.jobs.first); // "BE"
```

可见，浅拷贝只解决了第一层的问题，如果接下去的值还有对象的话，那么又回到最开始的话题了，两者又共享相同的地址。要解决这个问题只能使用深拷贝。

### 6.1.2 深拷贝

深拷贝通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。

```js
let a = {
  age: 1,
  name: {
    firstName: "tony",
    lastName: undefined,
    fullName: Symbol(),
  },
};

let b = JSON.parse(JSON.stringify(a));
a.name.firstName = "jack";
console.log(b.name); // {firstName: "tony"}
```

同时这个方法也是有局限性的：

- 会忽略 `undefined`
- 会忽略 `symbol`
- 不能序列化函数
- 不能解决循环引用的对象

```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};

obj.c = obj.b;
obj.e = obj.a;
obj.b.c = obj.c;
obj.b.d = obj.b;
obj.b.e = obj.b.c;
let newObj = JSON.parse(JSON.stringify(obj));
console.log(newObj);
```

如果我们有这么一个循环引用对象，会发现并不能通过该方法实现深拷贝

<img src="/assets/img/javascript/图6.1.2.png">

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题。

如果我们所需要拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`

```js
function structuralClone(obj) {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {
  a: 1,
  b: {
    c: 2,
  },
};

obj.b.d = obj.b;

// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const test = async () => {
  const clone = await structuralClone(obj);
  console.log(clone);
};
test();
```

当然你可能想自己来实现一个深拷贝，但是其实实现一个深拷贝是很困难的，需要我们考虑好多种边界情况，比如原型链如何处理、DOM 如何处理等等，所以这里我们实现的深拷贝只是简易版，并且其实更推荐使用 [lodash 的深拷贝函数](https://lodash.com/docs#cloneDeep)。

### 6.1.3 如何手写实现浅拷贝

**实现思路：**
通过 `for...in...` 获得对象上的键和值（注意会获取到原型链上的键值），再利用 `Object.hasOwnProperty()` 判断该键值是否在该对象上，最后进行赋值。

```js
/**
 * 浅拷贝
 */
function shallowCopy(obj) {
  // 1. 判断类型
  if (typeof obj !== "object") {
    return obj;
  }

  const target = {};

  // 2. 遍历获取 key
  for (let key in obj) {
    // 3. 判断是否属于属于自身的 key
    if (obj.hasOwnProperty(key)) {
      target[key] = obj[key];
    }
  }

  return target;
}
```

### 6.1.4 如何手写实现深拷贝

**实现思路：**

1. 类型判断：传递进来函数或者基本类型数据，不需要操作直接返回
1. 如果是对象类型：
1. 正则对象：创建一个新的实例存储当前正则即可
1. 日期对象：创建一个日期实例存储当前日期
1. 普通对象&&数组对象：创建一个新实例，循环存储当前信息；这里需要使用递归。

**实现代码：**

```js
/**
 * 简易版深拷贝
 */
function deepCopy(obj) {
  // 1. 定义方法用于判断是否属于对象
  function isObject(o) {
    return (typeof o === "object" || typeof o === "function") && o !== null;
  }
  // 1. 类型判断
  if (!isObject(obj)) {
    throw new TypeError(`${obj} is not a object`);
  }

  // 2. 判断是否数组
  const isArray = Array.isArray(obj);
  let newObj = isArray ? [...obj] : { ...obj };

  // 3.返回对象中自己（不继承）的属性键的数组
  Reflect.ownKeys(newObj).forEach((key) => {
    newObj[key] = isObject(obj[key]) ? deepCopy(obj[key]) : obj[key];
  });

  return newObj;
}
```

**注意：**
`Reflect.ownKeys(obj) = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj))`

## 7.1 模块化开发

为了让庞大的项目看起来整整齐齐，规规整整而出现的模块化管理。

模块化给我们带来的好处：

- 解决命名冲突
- 提高代码复用
- 提高代码可维护性

### 7.1.1 模块化第一阶段，Module 模式（立即执行函数）

> 第一个阶段，我们常会把许多复杂的功能，封装成一个个函数：

```js
function f1() {
  // ...
}

function f2() {
  // 。。。
}
```

但是当 整个项目变大了以后，就会遇到很多问题，都是定义的全局变量，形成了比较严重的污染，还有可能会出现因为重命名导致的各种问题。所以这些是需要进化的。所以就会进入到模块化的第二阶段： 对象。

```js
const module = {
  _number: 10,
  f1: () => {
    console.log(123);
  },
  f2: () => {
    console.log(456);
  },
  // ...
};
```

这样我们就没个模块定义一个对象，在需要的时候直接调用就好了，但是这样也会存在一个问题 这样写的话会暴露全部的对象内部的属性，**内部状态可以被外部改变**，例如：

```js
module._number = 100;
```

后来就到了利用**立即执行函数（闭包）**来达到不暴露私有成员的目的：

```js
const module2 = (function () {
  // primary
  let _money = 100;
  // public
  const m1 = () => {
    console.log(123);
  };
  // public
  const m2 = () => {
    console.log(456);
  };
  // 暴露行为
  return {
    f1: m1,
    f2: m2,
  };
})();
```

通过立即执行函数，让外部根本无法修改内部变量，从未达到一定的防御作用。

以上就是模块化开发的基础中的基础。 没有库，没有规范，一切的维护都是靠人力，一切的创新，都是来源于 解放生产力。

### 7.1.2 CommonJS

CommonJS 主要用于 Node 开发上，每个文件就是一个模块，每个文件都有自己的作用域。通过 `module.exports` 暴露 `public` 成员，例如：

```js
// 文件名 x.js
let x = 1;
function add() {
  x += 1;
  return x;
}

module.exports.add = add;
```

然后，CommonJS 通过 `reuiqre()` 引入模块依赖，`reuqire()` 函数可以引入 `Node` 的内置模块、自定义模块和 npm 第三方模块。

```js
// 文件名 main.js
const XModule = require("./x");

XModule.add();
console.log(XModule.add()); // 3
```

可以看到 `reuqire()` 函数同步加载了 `x.js`，并且返回了 `module.exports` 输出字面量的拷贝值。

可能有人会问 `module.exports.x = x` 不是赋值吗？为什么可以通过这种方式访问 `x.js` 里面的方法？

我们说，上面的立即执行函数（Module 模式）是模块化规范的基石，CommonJS 也是对 Module 模式的一种封装。我们完全可以用 Module 模式来实现上面的代码效果：

```js
const x = (function () {
  let x = 1;
  function add() {
    x += 1;
    return x;
  }
  return {
    add,
  };
})();

const XModule = x;
XModule.add();
console.log(XModule.add()); // 3
```

通过 Module 模式模拟 CommonJS 原理，我们就可以很好的解释 CommonJS 的特性了。因为 CommonJS 需要通过赋值的方式来获取匿名函数子调用的返回值，所以 `require` 函数在加载模块是同步的。然而 CommonJS 模块的加载机制局限了 CommonJS 在客户端上的使用，因为通过 HTTP 同步加载 CommonJS 模块是非常耗时的。

#### 总结

- **一个文件就是一个模块，通过执行该文件来加载模块**
- 每个模块内部，**module 变量代表当前模块**，这个变量就是一个对象，**exports 是它对外的接口**
- require 命令第一次加载该脚本时，就会执行整个脚本，在内存中生成一个对象（**多次加载，只有第一次会被运行，结果被缓存**）
- 特点：
  - 所有代码都运行在模块作用域，不会污染全局作用域
  - 独立性是模块最重要的特点，模块内部最好不会和程序其他部分直接交互
  - 模块多次加载，只有第一次会被执行，并将结果会被缓存下来；如果想要重新执行，就得清除缓存
  - 模块加载的顺序，按照其在代码中的位置
- CommonJS，它是**同步加载**，不适合浏览器

### 7.1.3 AMD

`requireJS` 的诞生就是为了实现 AMD 规范，实现 JS 文件的异步加载，避免网页失去相应；管理模块之间的依赖性，便于代码的编写和维护。

```js
// 定义 AMD 规范的模块
define([
  function () {
    return anyModule;
  },
]);
```

`require.js` 语法：`define(id, dependencies, factory)`：

- `id`：可选参数，用于定义模块的标识，如果没有提供该参数，脚本文件名（去掉扩展名）
- `dependencies`：是个当前模块用来的模块名称数组
- `factory`：工厂方法，模块初始化后要执行的函数或对象，如果为函数，它应该只被执行一次；如果是对象，此对象应该为模块的输出值

区别于 CommonJS，AMD 规范的模块是**异步加载**的，而定义的模块是被当作回调函数来执行的，依赖于 `require.js` 模块管理工具库。当然，AMD 规范不是采用**匿名函数立即执行**的机制来封装，我们依然可以利用闭包的原理来实现模块的私有成员和公有成员：

```js
define(["module1", "module2"], function (m1, m2) {
  let x = 1;
  function add() {
    x += 1;
    return x;
  }
  return { add };
});
```

#### 总结

- AMD 采用异步的方式加载模块，模块的加载不会影响它后面语句的执行，所以依赖这个模块的代码，都会被放到回调函数中
- AMD 通过 `define` 的方式来定义模块
  - `define(id?, dependencies?, factory);`
- 使用时，依然通过 `requre` 关键词
  - `require([module], callback)`

### 7.1.4 CMD

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。AMD 推崇依赖前置，CMD 推崇依赖就近。

```js
define(function (require, exports, module) {
  //  同步加载模块
  var a = require("./a");
  a.doSomething();
  // 异步加载一个模块，在加载完成时，执行回调
  require.async(["./b"], function (b) {
    b.doSomething();
  });
  // 对外暴露成员
  exports.doSomething = function () {};
});
// 使用模块
seajs.use("path");
```

CMD 继承了 CommonJS 和 AMD 的特定，支持同步和异步加载模块。CMD 加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块完成后进入主逻辑，遇到 require 语句的时候才执行相应的模块，这样模块的执行顺序和书写顺序是完全一致的。因此，在 CMD 中 `require` 函数同步加载模块时没有 HTTP 请求过程。

#### 总结

- 它是 SeaJS 所推广的一种模块化方法
- 它和 AMD 的区别是：
  - 对于依赖的模块，**AMD 是提前执行的，CMD 是延迟执行的**（RequireJS 2.0 也改成了延时执行）
  - AMD 推崇**依赖前置**，CMD 推崇**就近依赖**，只有在用到某个模块的时候再去 require

### 7.1.5 ES6 Module

ES6 的模块化已经不是规范了，而是 JS 语言的特性。

随着 ES6 的推出，AMD 和 CMD 也随之成为了历史。

- 设计思想：尽量的静态化，使得在编译的时候，就能清楚模块之间的依赖关系，以及输入和输出的变量。（AMD 和 CMD 都是在运行时确定）
- 通过 `import` 和 `export` 关键词组成：`export` 作为对外的接口，`import` 则是输入其他模块的功能

ES6 模块与模块化规范相比，有两大特点：

- 模块化规范输出的是一个值的拷贝，ES6 模块输出的是值的引用
- 模块化规范是运行时加载，ES6 模块是编译时输出接口

以下引用阮一峰老师的内容：

#### （1）CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个引用，到被加载的那个模块里去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的“符号链接”，原始值变了，`import` 加载的值也会跟着改变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块

#### （2）CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

- 运行时加载：CommonJS 模块就是对象；即在输入时是先加载整个模块，然后生成一个对象，再从这个对象上调用方法，这种加载就是**运行时加载**
- 编译时加载：ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即再在 `import` 时可以指定加载某一个输出值，而不是加载整个模块，这种加载称为**编译时加载**

因此，require 的性能问题：由于它是值的拷贝，比较占用内存；而编译时加载的 `import...from...` 性能更高。

## 8.1 如何理解 EventLoop 事件循环

EventLoop 是什么？我们学习 JS 异步相关知识时，会有 `setTimeout` 和 `Promise` 等相关异步操作，那么 `setTimeout` 和 `Promise` 执行顺序是怎样的呢？这就要了解 EventLoop 相关知识，了解 JS 异步运行代码的原理。

### 8.1.1 宏任务和微任务

#### 8.1.1.1 宏任务(MacroTask)引入

在 JS 中，大部分的任务都是在主线程执行，常见的任务有：

1. 渲染事件
1. 用户交互事件
1. js 执行脚本
1. 网络请求、文件读写完成事件等等

为了让这些任务有条不紊地进行，JS 引擎需要对执行的顺序做一定的安排，V8 引擎采用的是一种叫**队列**的方式来存储这些任务，即先进来的先执行。模型如下：

```c
bool keep_running = true;
void MainTherad() {
  for (;;) {
    // 执行队列中的任务
    Task tak = tak_queue.takeTask();
    ProcessTask(task);

    // 执行延迟队列中的任务
    ProcessDelayTask()

    // 如果设置了退出标志，那么直接退出线程循环
    if (!keep_running) {
      break;
    }
  }
}
```

这里用到了一个 `for` 循环，将队列中的任务一一取出，然后执行，这个很好理解。但是其中包含了两种任务队列，除了上述提到的任务队列，还有一个延迟队列，它专门处理诸如 `setTimeout`/`setInterval` 这样的定时器回调任务。

上述提到的，普通任务队列和延迟队列中的任务，都属于**宏任务**。

#### 8.1.1.2 微任务(MicroTask)引入

对于每个宏任务而言，其内部都有一个微任务队列。那为什么要引入微任务？微任务又在什么时候执行呢？

其实微任务的初衷是为了解决异步回调的问题。想一想，对于异步回调的处理，有多少种方式？总结起来有两点：

1. 将异步回调进行宏任务队列的入队操作
1. 将异步回调放在当前宏任务的末尾

如果采用第一种方式，那么执行回调的时机应该是前面**所有的宏任务**完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成**应用卡顿**。

为了规避这样的问题，V8 引入了第二种方式，这就是微任务的解决方式。在每一个宏任务中定义一个**微任务队列**，当宏任务执行完成，会检查其中的微任务队列，如果为空则直接执行下一个宏任务，如果不为空，则**依次执行微任务**，执行完成才去执行下一个宏任务。

常见的微任务有 MutationObserver、Promise.then(或 reject) 以及以 Promise 为基础开发的其他技术（比如 fetch API），还有 V8 的垃圾回收过程（标记清楚和引用计数）。

这便是**宏任务**和**微任务**的概念。

### 8.1.2 游览器

干讲理论不好理解，我们用例子来说话：

```js
console.log("start");
setTimeout(() => {
  console.log("timeout");
});
Promise.resolve().then(() => {
  console.log("resolve");
});
console.log("end");
```

让我们来分析一下：

1. 首先整个脚本作为一个宏任务来执行，对于同步代码直接压入执行栈进行执行，因此先打印 `start` 和 `end`
1. `setTimeout` 作为一个宏任务进入下一个宏任务队列
1. `Promise.then` 作为微任务放入到微任务队列
1. 当本次宏任务完成了，检查微任务队列，发现一个 `Promise.then` 并执行
1. 进入到下一个宏任务，发现 `setTimeout`，执行

因此最后的顺序是：

```js
start;
end;
resolve;
timeout;
```

这样就带大家直观地感受到了浏览器环境下 EventLoop 的执行流程。不过，这只是其中的一部分情况，接下来我们来做一个更完整的总结。

1. 一开始整段脚本作为第一个**宏任务**执行
1. 执行过程中同步代码直接执行，**宏任务**进入宏任务队列，**微任务**进入到微任务队列
1. 当前宏任务执行完出队，检查微任务队列，如果有则依次执行，直到微任务队列为空
1. 执行游览器 UI 线程的渲染工作
1. 检查是否有 Web worker 任务，有则执行
1. 执行队首新的宏任务，回到第二点，依次循环，直到宏任务和微任务队列都为空

这里有一道练习题目：

```js
Promise.resolve().then(() => {
  console.log("Promise1");
  setTimeout(() => {
    console.log("setTimeout2");
  }, 0);
});
setTimeout(() => {
  console.log("setTimeout1");
  Promise.resolve().then(() => {
    console.log("Promise2");
  });
}, 0);
console.log("start");

// start
// Promise1
// setTimeout1
// Promise2
// setTimeout2
```

### 8.1.3 nodejs

nodejs 和游览器的 EventLoop 还是有很大差别的，值得单独拿出来说一说。

这里放上一张网上关于 nodejs EventLoop 流程图：

<img src="/assets/img/javascript/8.1.3图.png">

这里会抛开这些晦涩的流程图，以最清晰浅显的方式来一步步拆解 nodejs 的事件循环机制。

#### 8.1.3.1 三大关键阶段

首先，梳理一下 nodejs 三个非常重要的执行阶段：

1. 执行**定时器回调**阶段。检查定时器，如果到了时间，就执行回调。这些定时器就是 `setTimeout`、`setInterval`。这个阶段暂且叫它 `timers`。
1. 轮询（英文叫 `poll`）阶段。因为在 node 代码中难免会有异步操作，比如文件 I/O，网络 I/O 等等，那么当这些异步操作做完了，就会来通知 JS 主线程，怎么通知呢？就是通过 `data`、`connect` 等时间是使得事件循环达到了 `poll` 阶段。达到这个阶段后：

如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，EventLoop 就返回到 `timer` 阶段。

如果没有定时器，会去看回调函数队列。

- 如果队列**不为空**，拿出队列中的方法依次执行
- 如果队列**为空**，检查是否有 `setImmdiate` 回调
  - 有则前往 `check` 阶段（下面会说）
  - **没有则继续等待**，相当于阻塞了一段时间（阻塞时间是有上限的），等待 callback 函数加入队列，加入后会立刻执行，一段时间后 **自动进入 check 阶段**

3. `check` 阶段，这是一个比较简单的阶段，直接执行 `setImmdiate` 回调

这三个阶段为一个循环过程，不过现在的 EventLoop 并不完整，接着我们继续一一完善。

#### 8.1.3.2 完善

首先，当第 1 阶段结束后，可能并不会立即等待到异步事件的响应，这时候 nodejs 会进入到 **I/O 异常的回调阶段**。比如说 TCP 连接遇到 ECONNREFUSED，就会在这个时候执行回调。

并且在 `check` 阶段结束后还会进入到 _关闭事件的回调阶段_。如果一个 socket 或句柄（handle）被突然关闭，例如 socket.destroy()，
'close' 事件的回调就会在这个阶段执行。

梳理一下，nodejs 的 eventLoop 分为下面的几个阶段:

1. timer 阶段
1. I/O 异常回调阶段
1. 空闲、预备状态(第 2 阶段结束，poll 未触发之前)
1. poll 阶段
1. check 阶段
1. 关闭事件的回调阶段

是不是清晰了许多？

#### 8.1.3.3 实例演示

好，我们以上次的练习题来实践一把:

```js
setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function () {
    console.log("promise1");
  });
}, 0);
setTimeout(() => {
  console.log("timer2");
  Promise.resolve().then(function () {
    console.log("promise2");
  });
}, 0);
```

这里我要说，node 版本 >= 11 和在 11 以下的会有不同的表现。

首先说 node 版本 >= 11 的，它会和浏览器表现一致，一个定时器运行完立即运行相应的微任务。

```js
timer1;
promise1;
time2;
promise2;
```

而 node 版本小于 11 的情况下，对于定时器的处理是：

若第一个定时器任务出队并执行完，发现队首的任务仍然是一个定时器，那么就将微任务暂时保存，直接去执行新的定时器任务，当新的定时器任务执行完后，再一一执行中途产生的微任务。

#### 8.1.3.4 node 和 游览器 EventLoop 主要区别

两者最主要的区别在于浏览器中的微任务是在每**个相应的宏任务**中执行的，而 nodejs 中的微任务是在**不同阶段之间**执行的。

#### 8.1.3.5 关于 process.nextTick 的一点说明

`process.nextTick` 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务**优先于微任务执行。**

## 9.1 异步编程

> [异步编程面试题](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

错题：1.3、2.2、2.3、3.5、3.7、3.8、3.10、5.5、7.3

在探究了 JS **单线程**、**EventLoop** 以及 **异步 I/O** 这些底层特性，我们还需要对代码和组织方式有所理解，这是离我们日常开发最接近的部分。异步代码的阻止方式直接决定了**开发**和**维护**的效率，其重要性不可小觑。景观**底层机制**没变，但异步代码的组织方式却随着 ES 标准发展，一步步发生了巨大的**变革**。

### 9.1.1 回调函数（callback）

相信大家学习 JS 都或多或少踩过这样的坑，node 中很多原生 API 是诸如这样的：

```js
fs.readFile("xxx", (err, data) => {
  // ...
});
```

经典的高阶函数，将回调函数作为函数参数传给了 `readFile`。但久而久之，这种回调方式也存在大坑：

```js
fs.readFile("1.js", (err, data) => {
  fs.readFile("2.js", (err, data) => {
    fs.readFile("3.js", (err, data) => {
      fs.readFile("4.js", (err, data) => {
        // ...
      });
    });
  });
});
```

回调当中嵌套回调，越来越多的嵌套会导致代码混乱，很难追踪代码，称为**地狱回调**。

这种代码的可读性和可维护性都是非常差的，因为嵌套的层级太多，而且还有一个很严重的问题，就是每次任务都有可能会失败，需要在回调里面对每个任务失败的情况进行处理，又增加了代码的混乱程度。

### 9.1.2 promise

ES6 中新增的 `Promise` 就很好了解决了回调地狱的问题，同时了合并了错误处理。写出来的代码类似于下面这样:

```js
readFilePromise("1.json")
  .then((data) => {
    return readFilePromise("2.json");
  })
  .then((data) => {
    return readFilePromise("3.json");
  })
  .then((data) => {
    return readFilePromise("4.json");
  });
```

以链式调用的方式避免了大量的嵌套，也符合人的线性思维方式，大大方便了异步编程。

**Promise .then .catch .finally 总结：**

1. `Promise` 的状态一经改变就不会再改变
1. `.then` 和 `.catch` 都会返回一个新的 `Promise`
1. `catch` 不管被链接到哪里，都能捕获上层未捕捉过的错误
1. 在 `Promise` 中，返回任意一个非 `promise` 值都会被包裹成 `promise` 对象，例如 `return 1` 会被包裹成 `return Promise.resolve(1)`
1. `Promise` 的 `.then` 和 `.catch` 可以被调用多次，但如果 `Promise` 内部的状态一经改变，并且有了一个值，那么后续每次调用 `.then` 或者 `.catch` 的时候会直接拿到该值
1. `.then` 或者 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，所以不会被后续的 `.catch` 捕获
1. `.then` 或者 `.catch` 返回值不能是 promise 本身，否则造成死循环
1. `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值穿透
1. `.then` 方法能接受两个参数，第一个是处理成功的函数，第二个是处理失败的函数，在某些时候可以认为 `.catch` 是 `.then` 第二个参数的第二种写法
1. `.finally` 方法也是返回一个 `Promise`，他在 `Promise` 结束的时候，无论结果为 `resolved` 还是 `reje cted`，都会执行里面的回调函数

**Promise 中的 all 和 race:**

- `Promise.all()` 的作用是接收一组异步任务，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调。
- `Promise.all()` 中的 `promise` 都变成 `resolved`，才会执行 `.then` 回调；其中一个 `promise` 变成 `rejected`，就会执行 `.catch` 回调，并且返回第一个 `rejected` 的返回值
- `.race()` 的作用也是接收一组异步任务，然后并行执行异步任务，只保留第一个执行完成的异步操作的结果，其他的方法仍在执行，不过执行结果会被抛弃。
- `all` 和 `race` 传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被 `then` 的第二个参数或者后面的 `catch` 捕获；但并不会影响数组中其它的异步任务的执行。

### 9.1.3 generator

利用协程完成 Gennerator 函数，用 co 库让代码依次执行完，同时以同步的方式书写，让异步操作按顺序执行：

```js
co(function* () {
  const r1 = yield readFilePromise("1.json");
  const r2 = yield readFilePromise("2.json");
  const r3 = yield readFilePromise("3.json");
  const r4 = yield readFilePromise("4.json");
});
```

### 9.1.4 async 及 await

这是 ES7 新增的关键字，凡是加上 `async` 的函数偶读默认返回一个 `Promise` 对象，而最重要的是 `async` + `await` 也能让异步代码以同步的方式来书写，而不需要借助第三方库的支持。

```js
const readFileAsync = async function () {
  const f1 = await readFilePromise("1.js");
  const f2 = await readFilePromise("2.js");
  const f3 = await readFilePromise("3.js");
  const f4 = await readFilePromise("4.js");
};
```

题目一：

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log("start");
```

答案：

```js
"async1 start";
"async2";
"start";
"async1 end";
```

过程分析：

- 首先一进来是创建了两个函数的，我们先不看函数的创建位置，而是看它的调用位置
- 发现 `async1` 函数被调用了，然后去看看调用的内容
- 执行函数中的同步代码 `async1 start`，之后碰到了 `await`，它会阻塞 `async1` 后面代码的执行，因此会先去执行 `async2` 中的同步代码 `async2`，然后跳出 `async1`
  跳出 `async1` 函数后，执行同步代码 `start`
  在一轮宏任务全部执行完之后，再来执行刚刚 `await` 后面的内容 `async1 end`。

在这里，你可以理解为「紧跟着 await 后面的语句相当于放到了 new Promise 中，下一行及之后的语句相当于放在 Promise.then 中」。

让我们来看看将 `await` 转换为 `Promise.then` 的伪代码：

```js
async function async1() {
  console.log("async1 start");
  // 原来代码
  // await async2();
  // console.log("async1 end");

  // 转换后代码
  new Promise((resolve) => {
    console.log("async2");
    resolve();
  }).then((res) => console.log("async1 end"));
}
async function async2() {
  console.log("async2");
}
async1();
console.log("start");
```

转换后的伪代码和前面的执行结果是一样的。

### 9.1.5 总结

1. **第一个阶段 - 回调函数**，但会导致两个问题：

- 缺乏顺序性：回调地狱导致的调试困难，和大脑的思维方式不符
- 缺乏可信任性：控制反转导致的一系列信任问题

1. **第二个阶段 - Promise**，Promise 是基于 PromiseA+ 规范实现的，它很好地解决了控制反转导致的信任问题，将代码执行的主动权重新拿了回来。
1. **第三个阶段 - 生成器函数 Generator**，使用 Generator，可以让我们同步的方式来书写代码，解决了顺序性问题，但是需要手动去控制 next(...)，将回调成功返回的数据送回 JS 主流程中。
1. **第四个阶段 - Async/Await**，Async/Await 结合了 Promise 和 Generator，在 await 后面跟一个 Promise，它会自动等待 Promise 的决议值，解决了 Generator 需要手动控制 next(...) 执行问题，真正实现了用同步的方式书写异步代码。

## 10.1 防抖和节流

防抖和节流的定义：

- 防抖：事件持续触发，但只有事件停止触发后 `n` 秒才执行函数
- 节流：事件持续触发，每 `n` 执行一次函数

### 10.1.1 防抖

持续触发事件不执行，等到事件停止触发 n 秒后才去执行函数。

#### 实际应用场景

- 窗口大小 resize（只需窗口调整完成后，计算窗口大小，防止重复渲染）
- 滚动事件 scroll（只需执行触发的最后一次滚动事件的处理程序）
- 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，（停止输入后）验证一次就好

#### 手写防抖函数（以文本输入验证为例子）

这里以一个文章缓存功能为例子。如果一个网站比如石墨文档，要实现用户打字后自动上传到服务器并保存的功能，如果用户每输入一个字符就去向服务器申请保存一次，上万甚至上千万百万用户一起使用的时候，就会大大增加服务器的负荷。

那我们应该怎么节省资源来做这件事呢？我们应该找一个时间，当用户停止输入一段时间的时候再去申请一次服务器保存，这样就大大节省了多次申请带来的资源浪费，而且我们也保存到了用户的正常输入内容。

我们如何去判断一个用户已经停止了输入呢？当然是通过我们的输入框，如果在我们限定的时间段内，输入框的内容没有发生任何变化，那我们就可以认为用户停止输入了，就可以向服务器申请保存了。

```js
let timer;
const input = document.querySelector("#input");
input.addEventListener("keypress", function () {
  clearTimeout(timer);
  timer = setTimeout(function () {
    document.getElementById("content").innerHTML =
      "云端已存储数据" + " " + input.value;
  }, 800);
});
```

[预览链接](https://codepen.io/limiu331/pen/gOawMrZ?editors=1111)

#### 防抖 debounce

**非立即执行版：**

```js
function debounce(fn, waitTime, ...args) {
  let timeout = null;
  return function () {
    let context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(context, [...args]);
    }, waitTime);
  };
}
```

**立即执行版：**

```js
function debounce(fn, waitTime, ...args) {
  let timeout = null;
  return function () {
    let context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    let callNow = !timeout;
    timtout = setTimeout(() => {
      timeout = null;
    }, waitTime);

    if (callNow) {
      fn.apply(context, [...args]);
    }
  };
}
```

**综合版：**

```js
/**
 * @desc 防抖函数
 * @params {Function} fn 函数
 * @params {Number} waitTime 延时时间
 * @params {Boolean} immediate true 代表立即执行，false 代表非立即执行
 */
function debounce(fn, waitTime, immediate, ...args) {
  let timeout = null;
  return function () {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, waitTime);
      if (callNow) {
        fn.apply(context, [...args]);
      }
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, [...args]);
      }, waitTime);
    }
  };
}
```

### 10.1.2 节流

#### 现实场景例子

比如玩游戏时的**垂直同步**设定，可以强制要求游戏画质限制在 60fps 以内，我们的显卡就不会在每次渲染游戏画面的时候，拼劲全力渲染最高帧数。

60fps 可以满足大家的肉眼游戏需求，还可以让显卡稳定工作。

#### 实际应用场景

- 一个可拖曳的 DOM 元素（mousemove）
- 王者荣耀或 LOL 里面的技能释放 CD（单位时间内只能释放一次技能）
- 滚动事件（页面滚动，间隔判断一次）
- 搜索联想

#### 手写函数节流（以页面滚动为例）

这里以判断页面是否滚动到底部为例子，普通的做法就是监听 `window` 对象的 `scroll` 事件，然后在函数体中写入判断是否滚动到底部的逻辑：

```js
function onScroll() {
  //判断是否滚动到底部的逻辑
  const scrollTop = $(window).scrollTop();
  console.log(scrollTop);
  const windowHeight = $(window).height();
  console.log("windowHeight:" + windowHeight);
  const pageHeight = $("#element").height();
  console.log("body:" + pageHeight);
  const thresold = pageHeight - windowHeight - scrollTop;
  if (thresold <= 0) {
    alert("到最底部了");
  }
}
$(window).on("scroll", onScroll);
```

[预览链接](https://codepen.io/limiu331/pen/qBONJQj?editors=1111)

这样做的一个缺点就是比较消耗性能，因为在滚动的时候，游览器会无时无刻地计算是否滚动到底部地逻辑，然而在实际场景中不需要这么做的。

在实际场景中可能是这样的：在滚动过程中，每隔一段时间取计算这个判断逻辑。

而函数节流所做的工作就是每隔一段时间去执行一次原本需要无时不刻地在执行的函数，所以在滚动事件中引入函数的节流是一个非常好的实践：

接着看一下加入函数节流的效果吧

```js
$(window).on(
  "scroll",
  throttle(function () {
    //判断是否滚动到底部的逻辑
    const scrollTop = $(window).scrollTop();
    console.log(scrollTop);
    const windowHeight = $(window).height();
    console.log("windowHeight:" + windowHeight);
    const pageHeight = $("#element").height();
    console.log("body:" + pageHeight);
    const thresold = pageHeight - windowHeight - scrollTop;
    if (thresold <= 0) {
      alert("到最底部了");
    }
  })
);
function throttle(fn, interval = 300) {
  let canRun = true;
  return function () {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, interval);
  };
}
```

[预览链接](https://codepen.io/limiu331/pen/yLYaOwL?editors=1111)

#### 手写 throttle 节流函数

**时间戳版：**

```js
function throttle(fn, waitTime, ...args) {
  let prev = 0;
  return function () {
    const context = this;
    if (Date.now() - prev > waitTime) {
      fn.apply(context, [...args]);
      prev = Date.now();
    }
  };
}
```

**定时器版：**
防抖是延迟执行，节流是间隔执行，实现原理就是**设置一个定时器，约定 XX 毫秒之后执行事件，如果时间到了，那么执行函数并重置定时器**

```js
function throttle(fn, waitTime, ...args) {
  let timeout = null;
  return function () {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(context, [...args]);
      }, waitTime);
    }
  };
}
```

### 10.1.3 总结

**函数节流:** 频繁触发,但只在特定的时间内才执行一次代码
**函数防抖:** 频繁触发,但只在特定的时间内没有触发执行条件才执行一次代码

两者区别在于函数节流是固定时间做某一件事，比如每隔 1 秒发一次请求。而函数防抖是在频繁触发后，只执行一次（两者的前提都是频繁触发）

## 11. 垃圾回收机制

当一个变量的生命周期结束后它所指向的内存就应该被释放。JS 有两种变量，全局变量和在函数中产生的局部变量。局部变量的声明周期在函数执行完毕就结束了，就可以将它的引用内存释放，即垃圾回收，但全局变量生命周期会持续到游览器关闭。

### 11.1 标记清除（mark and sweep）

这是大部分游览器进行垃圾回收的方式，当变量进入执行环境（函数中声明变量）的时候，垃圾回收期将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”，在离开环境之后还有的变量则是需要被删除的变量。标记方式不定，可以是某个特殊位的反转或维护一个列表等。

垃圾收集器给内存中的所有变量都加上标记，然后**去掉全局环境中的变量以及被变量引用标记的变量**，进行垃圾回收。

### 11.2 引用计数（reference counting）

这种方式常常会引起内存泄漏，低版本的 IE 使用这种方式。机制就是跟踪一个值的引用次数，当声明一个变量并将一个引用类型赋值给该变量时该值引用次数加 1，当这个变量指向其他一个时该值的引用次数便减一。当该值引用次数为 0 时就会被回收。

该方式会引起内存泄漏的原因是它不能解决循环引用的问题：

```js
function sample() {
  var a = {};
  var b = {};
  a.prop = b;
  b.prop = a;
}
```

这种情况下每次调用 sample()函数，a 和 b 的引用计数都是 2，会使这部分内存永远不会被释放，即内存泄漏。

低版本 IE 中有一部分对象并不是原生 JS 对象。例如，其 BOM 和 DOM 中的对象就是使用 C++以 COM(Component Object Model)对象的形式实现的，而 COM 对象的垃圾收集机制采用的就是引用计数策略。

因此即使 IE 的 js 引擎是用的标记清除来实现的，但是 js 访问 COM 对象如 BOM,DOM 还是基于引用计数的策略的，也就是说只要在 IE 中设计到 COM 对象，也就会存在循环引用的问题。

当一个 DOM 元素和一个原生的 js 对象之间的循环引用时：

```js
var ele = document.getElementById("eleId");
var obj = {};
obj.property = ele;
ele.property = obj;
```

添加 obj.property = null;ele.property = null;即可解除原生 JS 对象与 DOM 元素之间的连接。

### 12. ES 新语法补充

#### 12.1 Set 和 Map

- Set

`Set` 的基本语法：

```js
// 可不传数组
const set = new Set();
set.add(1);
set.add(2);

console.log(set); // Set(2) { 1, 2 }

// 也可传数组
const set = new Set([1, 2, 3]);
// 增加元素使用 add
set.add(4);
set.add("张豪");
console.log(set); // Set(5) { 1, 2, 3, 4, "张豪" }
```

`Set` 的不重复性

```js
// 增加一个已有元素，则增加无效，会被自动去重
const set1 = new Set([1]);
set1.add(1);
console.log(set1); // Set(1) { 1 }

// 传入的数组中有重复项，会自动去重
const set2 = new Set([1, 2, "张豪", 3, 3, "张豪"]);
console.log(set2); // Set(4) { 1, 2, '张豪', 3 }
```

`Set` 的不重复性中，要注意引用数据类型和 `NaN`

```js
// 两个对象都是不用的指针，所以没法去重
const set1 = new Set([1, {name: '张豪'}, 2, {name: '张豪'}])
console.log(set1) // Set(4) { 1, { name: '张豪' }, 2, { name: '张豪' } }


// 如果是两个对象是同一指针，则能去重
const obj = {name: '张豪'}
const set2 = new Set([1, obj, 2, obj])
console.log(set2) // Set(3) { 1, { name: '张豪' }, 2 }

咱们都知道 NaN !== NaN，NaN是自身不等于自身的，但是在Set中他还是会被去重
const set = new Set([1, NaN, 1, NaN])
console.log(set) // Set(2) { 1, NaN }

```

利用 `Set` 的不重复性，可以实现数组去重

```js
const arr = [1, 2, 3, 4, 4, 5, 5, 66, 9, 1];

// Set可利用扩展运算符转为数组哦
const quchongArr = [...new Set(arr)];
console.log(quchongArr); // [1,  2, 3, 4, 5, 66, 9]
```

- Map

Map 对比 object 最大的好处就是，key 不受类型限制

```js
// 定义map
const map1 = new Map();
// 新增键值对 使用 set(key, value)
map1.set(true, 1);
map1.set(1, 2);
map1.set("哈哈", "嘻嘻嘻");
console.log(map1); // Map(3) { true => 1, 1 => 2, '哈哈' => '嘻嘻嘻' }
// 判断map是否含有某个key 使用 has(key)
console.log(map1.has("哈哈")); // true
// 获取map中某个key对应的value 使用 get(key)
console.log(map1.get(true)); // 2
// 删除map中某个键值对 使用 delete(key)
map1.delete("哈哈");
console.log(map1); // Map(2) { true => 1, 1 => 2 }

// 定义map，也可传入键值对数组集合
const map2 = new Map([
  [true, 1],
  [1, 2],
  ["哈哈", "嘻嘻嘻"],
]);
console.log(map2); // Map(3) { true => 1, 1 => 2, '哈哈' => '嘻嘻嘻' }
```

#### 12.2 求幂运算符

以前求幂的写法：

```js
const num = Math.pow(3, 2); // 9
```

ES7 提供的求幂运算符：`**`

```js
const num = 3 ** 2; // 9
```

#### 12.3 Object.entries 和 Object.fromEntries

- `Object.entries`

可以用来对象的键值对集合

```js
const obj = {
  name: "张豪",
  age: 24,
  sex: "男",
};

console.log(Object.entries(obj)); // [ [ 'name', '张豪' ], [ 'age', 24 ], [ 'sex', '男' ] ]
```

- `Object.formEntries`

作用和 `Object.entries` 相反

```js
const arr = [
  ["name", "张豪"],
  ["age", 24],
  ["sex", "男"],
];
console.log(Object.fromEntries(arr)); // {name: "张豪", age: 24, sex: "男"}
```

#### 12.4 for await of

`for await of` 是用来遍历异步 Iterator 接口的，。

```js
async function f() {
  for await (const x of createAsyncIterable(["a", "b"])) {
    console.log(x);
  }
}
// a
// b
```

上面代码中，`createAsyncIterable()` 返回一个拥有异步遍历器接口的对象，`for...of` 循环自动调用这个对象的异步遍历器的 `next` 方法，会得到一个 `Promise` 对象。`await` 用来处理这个 `Promise` 对象，一旦 `resolve`，就把得到的值（x）传入 `for...of` 的循环体。

如果 `next` 方法返回的 `Promise` 对象被 `reject`，`for await...of` 就会报错，要用 `try...catch` 捕捉。

#### 12.5 Array.flat

如果有一个二维数组，想让他变成一维数组：

```js
const arr = [1, 2, 3, [4, 5, 6]];
console.log(arr.flat()); // [ 1, 2, 3, 4, 5, 6 ]
```

还可以传参数，传参为降维的次数

```js
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9]]];

console.log(arr.flat(2)); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

如果穿 `Infinity`，则可以将无论几维数组都转化为一维数组

```js
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11, 12]]]];

console.log(arr.flat(Infinity)); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

#### 12.6 Array.flatMap

现在给你一个需求

```js
const arr = ["科比 詹姆斯 安东尼", "利拉德 罗斯 麦科勒姆"];
```

将上面数组转为

```js
const arr = ["科比", "詹姆斯", "安东尼", "利拉德", "罗斯", "麦科勒姆"];
```

第一时间想到 `map + flat`

```js
arr.map((item) => item.split(" ")).flat();
```

但是用 `Array.flatMap` 可以一步解决

```js
arr.flatMap((item) => item.split(" "));
```

#### 12.7 String.trimStart && String.trimEnd

`trim` 方法可以清除字符串首尾的空格

```js
const str = "   123   ";
str.trim(); // "123"
str.trimStart(); // "123   "
str.trimEnd(); // "   123"
```

#### 12.8 Promise.allSettled

ES11 新增的 Promise 方法

- 接收一个 Promise 数组，数组中如果有非 Promise 项，则此项当做成功
- 把每一个 Promise 的结果，集合成数组返回

```js
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.allSettled([fn(2000, true), fn(3000), fn(1000)]).then((res) => {
  console.log(res)[
    // 3秒后输出
    ({ status: "fulfilled", value: "2000毫秒后我成功啦！！！" },
    { status: "rejected", reason: "3000毫秒后我失败啦！！！" },
    { status: "rejected", reason: "1000毫秒后我失败啦！！！" })
  ];
});
```

#### 12.9 Primise.any

E12 新增的 Promise 的方法

- 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功
- 如果有一个 Promise 成功，则返回这个成功结果
- 如果所有 Promise 都失败，则报错

```js
// 当有成功的时候，返回最快那个成功
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.any([fn(2000, true), fn(3000), fn(1000, true)]).then(
  (res) => {
    console.log(res); // 1秒后 输出  1000毫秒后我成功啦
  },
  (err) => {
    console.log(err);
  }
);

// 当全都失败时
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.any([fn(2000), fn(3000), fn(1000)]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err); // 3秒后 报错 all Error
  }
);
```

#### 12.10 数字分隔符

数字分隔符可以让你在定义长数字时，更加地一目了然

```js
const num = 1000000000;

// 使用数字分隔符
const num = 1_000_000_000;
```

## 13. 正则表达式

在正则表达式中，如果直接给出字符，就是精确匹配。`\d` 可以匹配一个数字，`\w`可以匹配一个字母或数字，`\s`可以匹配一个空格（也包括 Tab 等空白符），`.` 可匹配任意字符，所以

- `'00\d'` 可以匹配 `'007'`，但无法匹配 `'00A'`
- `'\d\d\d'` 可以匹配 `'010'`
- `'\w\w'` 可以匹配 `'js'`
- `'js.'` 可以匹配 `'jsp'`、`'js1'`、`'js!'` 等等。

要匹配变长的字符，在正则表达式中，用 `*` 表示任意个字符（包括 0 个），用 `+` 表示至少一个字符，用 `？` 表示 0 个或者 1 个字符，用 `{n}` 表示 n 个字符，用 `{n,m}` 表示 n-m 个字符。

看一个稍微复杂的例子：`\d{3}\s+\d{3,8}`.
从左往右解读一下：

1. `\d{3}` 表示匹配 3 个数字，例如 `010`
1. `\s+` 表示匹配至少一个空格（也包括 Tab 等其他空白符），所以 `\s+` 表示至少又一个空格，例如匹配 `' '`，`'\t\t'` 等
1. `\d{3,8}` 表示匹配 3-8 个数字，例如 `'1234567'`

综合起来，上面的正则表达式可以匹配以任意个空格隔开的带区号的电话号码。

如果要匹配 `010-12345` 这样的电话号码呢？由于 `-` 是一个特殊字符，在正则表达式中，要用 `'\'` 转义，所以正则为 `'\d{3}\-\d{3,8}'`。

但是，依然无法匹配 `'010 - 12345'`，因为带有空格。所以我们需要更复杂的匹配方式：`/\d{3}\s*\-\s*\d{5}/`

### 进阶

要做更精准地匹配，可以用 `[]` 表示范围，比如：

- `[0-9a-zA-Z\_]` 可以匹配一个数字、字母或者下划线
- `[0-9a-zA-Z\_]+` 可以匹配至少由一个数字、字母或者下划线组成的字符串，比如： `zara11`、`Zh_2020` 等
- `[a-zA-Z\_\$][0-9a-zA-Z\_\$]*` 可以匹配由字母或下划线、$开头，后接任意个由一个数字、字母、下划线、`$` 组成的字符串，也就是 JavaScript 允许的变量名
- `[a-zA-Z\_\$][0-9a-zA-Z\_\$]{0, 19}` 更精确地限制了变量的长度是 1-20 个字符（前面 1 个字符+后面最多 19 个字符）

`A|B` 可以匹配 A 或者 B，所以 `(J|j)ava(S|s)cript` 可以匹配 `'JavaScript'`、`'Javascript'`、`'javaScript'` 或者 `'javascript'`。

`^` 表示行的开头，`^\d` 表示必须以数字开头。

`$` 表示行的结束，`\d$` 表示必须以数字结束。

所以，`js` 可以匹配 `'ajs.~'`，但如果是 `^js$` 就变成整行匹配，就只匹配 `'js'` 了。

### RegExp

JavaScript 有两种方式创建一个正则表达式：

1. 第一种是直接通过 `/正则表达式/` 写出来，
2. 是通过 `new RegExp('正则表达式')` 创建一个 RegExp 对象。

两种写法是一样的：

```js
const reg1 = /^\d{3}\-\d{8}$/;
const reg2 = new RegExp("^\\d{3}\\-\\d{8}$");
```

reg1 和 reg2 是一样的，但是如果是第二种写法由于字符串的转义问题，`\` 要用 `\\` 表示。

再来看如何判断正则表达式是否匹配：

```js
const reg = /^\d{3}\-\d{5}$/;
reg.test("123-12345"); // true
reg.test("a123-12345"); // false
reg.test("123 12345"); //false
reg.test("123-1234a"); // false
```

RegExp 对象的 `test()` 方法用于测试给定的字符串是否符合条件。

### 切分字符串

用正则表达式切分字符串比用固定的字符串更灵活，请看正常的切分代码：

```js
"a b   c".split(" "); // ["a", "b", "“, "", "c"];
```

当我们想通过空格切割字符串时，我们没办法分割连续空格的情况。那么当我们使用正则表达式时：

```js
"a b   c".split(/\s*/); // ["a", "b", "c"]
```

这样不管是否是连续空格都可以正确切割。加入 `,` 试试：

```js
"a,b,  c d".split(/[\s\,]+/); // ["a", "b", "c", "d"]
```

再加入 `;` 试试：

```js
"a,b;; c  d".split(/[\s\;\,]+/); // ["a", "b", "c", "d"]
```

可见正则表达式在切割字符串上还是很方面的。

### 分组

除了简单地判断是否匹配以外，正则表达式还有提取子串的强大功能。用 `()` 表示的就是要提取的分组（Group）。比如：

`^(\d{4})-(\d{3,8})$` 分别定义了两个组，可以直接从匹配的字符串中提取出区号和本地号码：

```js
const reg = /^(\d{4})-(\d{3,8})$/;
reg.exec("0755-12345678"); // ["0755-12345678", "0755", "12345678"]
reg.exec("0755 12345678"); // null
```

如果正则表达式定义了组，就可使用 `RegExp` 的 `exec` 方法提取子串出来。

`exec()` 方法在匹配成功后，会返回一个 `Array`，第一个元素是正则表达式匹配到的整个字符串，后面的字符串表示匹配成功的子串。

`exec()` 方法在匹配失败后会返回 `null`。

提取子串非常有用，来看一个更凶残的栗子：

```js
const reg =
  /^(0[0-9]|1[0-9]|2[0-3]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])$/;
reg.exce("18:29:59"); // ["18:29:59", "18", "29", "59"]
```

这个正则表达式可以匹配合法的时间。但是有些时候，用正则表达式也无法做到完全认证，比如识别日期：

```js
const reg = /^(0[1-9]|1[0-2]|[0-9])\-(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[0-9])$/;
```

对于 `2-30`、`4-31`这样的非法日期，用正则还是识别不了，或者说写出来非常困难。

### 贪婪匹配

需要注意的是，正则匹配默认是贪婪匹配，也就是匹配尽可能多的字符。举例如下，匹配出数字后面的 `0`：

```js
const reg = /^(\d+)(0+)$/;
reg.exec("1023000"); // ["1023000", "102300", "0"]
```

由于 `\d+` 采用贪婪匹配，导致 `0+` 只匹配了一个 0.

必须让 `\d+` 采用非贪婪匹配（尽可能少地匹配），才能把后面的 0 都匹配到，加个 `?` 就可以让 `\d+` 采取非贪婪匹配：

```js
const reg = /^(\d+?)(0+)$/;
reg.exec("1023000"); // ["1023000", "1023", "000"];
```

这样就符合我们的预期了。

### 全局搜索

JavaScript 的正则表达式还有几个特殊的标志，最常用的是 `g`，表示全局匹配：

```js
const r1 = /test/g;
// 等价于
const r2 = new RegExp("test", "g");
```

全局匹配可以多次执行 `exec()` 方法来搜索一个匹配的字符串。当我们指定 `g` 标志后，每次运行 `exec()`，正则表达式本身会更新 `lastIndex` 属性，表示上次匹配到的最后索引：

```js
const str = "JavaScript, VbScript, JScript and ECMASciprt";
const reg = /[a-zA-Z]+Script/g;

// 使用全局匹配：
reg.exec(str); // ["JavaScript"]
reg.lastIndex; // 10

reg.exec(str); // VbScript
reg.lastIndex; // 20

reg.exec(str); // JScript
reg.lastIndex; // 29

reg.exec(str); // ECMAScript
reg.lastIndex; // 44

re.exec(str); // null，直到结果没有匹配到

// 如果再调用 exec() 则从头开始
```

全局匹配类似搜索，因此不能使用 `/^...$/`，那样最多匹配一次。

正则表达式还可以指定 `i` 标志，表示忽略大小写，`m` 标志表示执行多行匹配。

### 如何表达各类字符

| 字符 | 意义                                                                    |
| ---- | ----------------------------------------------------------------------- |
| `.`  | 匹配除终止符之外的任何单个字符：\n、\r、\u2028 或者 \u2029              |
| `\d` | 匹配任何数字（阿拉伯数字）。相当于 `[0-9]`                              |
| `\D` | 匹配任何非数字（阿拉伯数字）的字符。相当于 `[^0-9]`                     |
| `\w` | 匹配基本拉丁字母中的任何字母数字字符，包括下划线。相当于 `[a-zA-Z0-9_]` |
| `\W` | 匹配任何不适来自基本拉丁字符的单词字符。相当于 `[^a-zA-Z0-9_]`          |
| `\s` | 匹配空白字符，包括空格、tab、换页符、换行符和其他 unicode 空格          |
| `\S` | 匹配除了空白字符之外的字符                                              |

用的比较多的就是上面几种
