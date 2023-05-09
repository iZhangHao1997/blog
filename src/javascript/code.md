# JavaScript 编程题

## instanceof

**实现思路：**

取出隐式引用(**proto**)，然后和原型进行比较

依次往上循环，直到**proto**为 null 时

```js
// instanceof
const myInstanceof = function (child, Parent) {
  if (child.__proto__ === Parent.prototype) {
    return true;
  } else {
    if (child.__proto__ !== null) {
      return myInstanceof(child.__proto__, Parent);
    } else {
      return false;
    }
  }
};
```

## apply

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

## call

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

或者可以基于刚才手写的 apply 方法：

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

## bind

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

## new

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

## 浅拷贝

```js
// 浅拷贝
const shallowCopy = function(obj) {
  // 1. 类型判断
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 2. 遍历获取 key
  const target = {};
  for (key in obj) {
    // 3. 判断是否为自身属性
    (obj.hasOwnProperty(key)) {
      target[key] = obj[key];
    }
  }

  return target;
}
```

## 深拷贝

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

## Promise

sorry，现在的技术级别水平不够。/(ㄒ o ㄒ)/~~

## debounce

**非立即执行版：**

```js
function debounce(fn, waitTime, ...args) {
  let timeout = null;
  return function () {
    const context = this;
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
    const context = this;
    let callNow = timeout;
    timeout = setTimeout(() => {
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
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}
```

## throttle

**时间戳版本：**

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

**定时器版本：**

```js
function throttle(fn, waitTime, ...args) {
  let timeout = null;
  return function () {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.apply(context, [...args]);
        timeout = null;
      }, waitTime);
    }
  };
}
```

## 数组去重

```js
/** *********************  双重 for 循环去重 ************************/

const arr1 = [2, 3, 4, 4, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 5, 32, 3, 4, 5];

function fun1(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error");
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}

console.log(fun1(arr1));

/** *********************  indexOf 循环去重 ************************/
const arr2 = [2, 3, 4, 4, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 5, 32, 3, 4, 5];

function fun2(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error");
    return;
  }
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

console.log(fun2(arr2));

/** *******************  Array.from() 和 Set 循环去重 *****************/
const arr3 = [2, 3, 4, 4, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 5, 32, 3, 4, 5];

function fun3(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error");
    return;
  }
  const arrSet = new Set(arr);

  return Array.from(arrSet);
}

console.log(fun3(arr3));

/** *******************  ... 和 Set 循环去重 *****************/
const arr4 = [2, 3, 4, 4, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 5, 32, 3, 4, 5];

function fun4(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error");
    return;
  }
  const arrSet = new Set(arr);

  return [...arrSet];
}

console.log(fun4(arr4));
```

## 数组转化为对象

```js
/** ****************************** for ... in 转换 ****************************/

const arr1 = ["1", "2", "3"];

function fun1(arr) {
  const obj = {};
  for (const key in arr) {
    obj[key] = arr[key];
  }
  return obj;
}

console.log(fun1(arr1));

/** ****************************** ... 扩展运算符 转换 *********************** */

const arr2 = ["1", "2", "3"];

function fun1(arr) {
  const obj = { ...arr };
  return obj;
}

console.log(fun1(arr2));

/** ****************************** for 循环转换 *********************** */

const arr3 = ["1", "2", "3"];

function fun3(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[i] = arr[i];
  }
  return obj;
}

console.log(fun3(arr3));
```

## 对象转化为数组

```js
/**
 * Array.from() 方法转换
 * @description: 1. object中必须有length属性，返回的数组长度取决于length长度 2.key 值必须是数值
 */
const obj1 = {
  0: "nihao",
  1: "haha",
  2: "gansha",
  length: 3,
};
const arr1 = Array.from(obj1);
console.log(arr1);

/**
 * Object.values(object) 方法转换
 * 把对象所有可枚举的属性值返回，不需要 length 属性
 */

const obj2 = {
  0: "nihao",
  1: "haha",
  2: "gansha",
};

const arr2 = Object.values(obj2);
console.log(arr2);

/**
 * Object.keys(object) 方法转换
 * 返回对象所有可枚举的属性，不需要 length 属性
 */

const obj3 = {
  0: "nihao",
  1: "haha",
  2: "gansha",
};

const arr3 = Object.keys(obj3);
console.log(arr3);

/**
 * for ... of 循环
 */
const obj4 = {
  0: "nihao",
  1: "haha",
  2: "gansha",
};
const arr4 = [];

for (let key in obj4) {
  arr4[key] = obj4[key];
}
console.log(arr4);
```

## 类数组转数组

```js
/**
 * Array.from() 方法
 */

function fun1() {
  return Array.from(arguments);
}

console.log(fun1(1, 2, 3, 345, 435, 42, 3421, 312));

/**
 * ... 扩展运算符
 */

function fun2() {
  return [...arguments];
}

console.log(fun2(1, 2, 3, 345, 435, 42, 3421, 312));

/**
 * 利用 apply
 */

function fun3() {
  return Array.apply(null, arguments);
}

console.log(fun3(1, 2, 3, 345, 435, 42, 3421, 312));

/**
 * 利用循环
 */

function fun4() {
  const arr = [];
  for (let i = 0; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }
  return arr;
}

console.log(fun4(1, 2, 3, 345, 435, 42, 3421, 312));

/**
 * 利用 Array.slice 方法
 */

function fun5() {
  // 第一种方法
  const arr1 = Array.prototype.slice.call(arguments, 0);
  return arr1;
  // or
  const arr2 = [];
  return arr2.slice.call(arguments, 0);
  return arr2;
}

console.log(fun5(1, 2, 3, 345, 435, 42, 3421, 312));
```

1. [使用 Promise 实现每隔 1 秒输出 1、2、3](#promise-题目一)
1. [使用 Promise 实现红绿灯交替重复亮](#promise-题目二)
1. [封装一个异步加载图片的方法](#promise-题目三)

## Promise 题目一

使用 Promise 实现每隔 1 秒输出 1、2、3

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

## Promise 题目二

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

## Promise 题目三

封装一个异步加载图片的方法

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
