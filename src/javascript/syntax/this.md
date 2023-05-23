# this

重点弄清楚如何判断 this 指向以及如何改变 this 指向

## this 指向问题

什么是 this 指针？以及各种情况下 this 指向问题

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

## this 指向调用对象

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

## 直接调用的函数，`this` 指向的是全局 window 对象

```js
function say() {
  console.log(this);
}

say(); // this 指向 window 对象(严格模式下为 undefined)
```

## 通过 `new` 的方式，`this` 永远指向新创建的对象

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  console.log(this);
}

var xiaolu = new Person("小张", 23); // this = > Person { name: '小张', age: 23 }
```

## 箭头函数中的 `this`

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

## call、apply 和 call

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

## 如何手写实现 call、apply 和 bind

原理及实现思路请自行百度/谷歌，以下仅提供实现代码（如有错误请指正）。

## 实现 apply

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

## 实现 call

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

## 实现 bind

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
