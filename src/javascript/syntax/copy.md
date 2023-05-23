# 深拷贝和浅拷贝

主要搞懂什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？

我们在学习 JS 对象类型在赋值的时候其实是赋值了地址，从而导致改变一方其他也都被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。

```js
let a = {
  age: 1,
};

let b = a;
a.age = 2;
console.log(b.age); // 2
```

## 浅拷贝

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

## 深拷贝

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

<img src="/img/javascript/图6.2.png">

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

## 如何手写实现浅拷贝

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

## 如何手写实现深拷贝

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
