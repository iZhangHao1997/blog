# 异步编程

> [异步编程面试题](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

错题：1.3、2.2、2.3、3.5、3.7、3.8、3.10、5.5、7.3

在探究了 JS **单线程**、**EventLoop** 以及 **异步 I/O** 这些底层特性，我们还需要对代码和组织方式有所理解，这是离我们日常开发最接近的部分。异步代码的阻止方式直接决定了**开发**和**维护**的效率，其重要性不可小觑。景观**底层机制**没变，但异步代码的组织方式却随着 ES 标准发展，一步步发生了巨大的**变革**。

## 回调函数（callback）

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

## promise

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

## generator

利用协程完成 Gennerator 函数，用 co 库让代码依次执行完，同时以同步的方式书写，让异步操作按顺序执行：

```js
co(function* () {
  const r1 = yield readFilePromise("1.json");
  const r2 = yield readFilePromise("2.json");
  const r3 = yield readFilePromise("3.json");
  const r4 = yield readFilePromise("4.json");
});
```

## async 及 await

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

## 总结

1. **第一个阶段 - 回调函数**，但会导致两个问题：

- 缺乏顺序性：回调地狱导致的调试困难，和大脑的思维方式不符
- 缺乏可信任性：控制反转导致的一系列信任问题

1. **第二个阶段 - Promise**，Promise 是基于 PromiseA+ 规范实现的，它很好地解决了控制反转导致的信任问题，将代码执行的主动权重新拿了回来。
1. **第三个阶段 - 生成器函数 Generator**，使用 Generator，可以让我们同步的方式来书写代码，解决了顺序性问题，但是需要手动去控制 next(...)，将回调成功返回的数据送回 JS 主流程中。
1. **第四个阶段 - Async/Await**，Async/Await 结合了 Promise 和 Generator，在 await 后面跟一个 Promise，它会自动等待 Promise 的决议值，解决了 Generator 需要手动控制 next(...) 执行问题，真正实现了用同步的方式书写异步代码。
