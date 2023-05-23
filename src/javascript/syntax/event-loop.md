# 如何理解 EventLoop 事件循环

EventLoop 是什么？我们学习 JS 异步相关知识时，会有 `setTimeout` 和 `Promise` 等相关异步操作，那么 `setTimeout` 和 `Promise` 执行顺序是怎样的呢？这就要了解 EventLoop 相关知识，了解 JS 异步运行代码的原理。

## 宏任务和微任务

### 宏任务(MacroTask)引入

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

### 微任务(MicroTask)引入

对于每个宏任务而言，其内部都有一个微任务队列。那为什么要引入微任务？微任务又在什么时候执行呢？

其实微任务的初衷是为了解决异步回调的问题。想一想，对于异步回调的处理，有多少种方式？总结起来有两点：

1. 将异步回调进行宏任务队列的入队操作
1. 将异步回调放在当前宏任务的末尾

如果采用第一种方式，那么执行回调的时机应该是前面**所有的宏任务**完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成**应用卡顿**。

为了规避这样的问题，V8 引入了第二种方式，这就是微任务的解决方式。在每一个宏任务中定义一个**微任务队列**，当宏任务执行完成，会检查其中的微任务队列，如果为空则直接执行下一个宏任务，如果不为空，则**依次执行微任务**，执行完成才去执行下一个宏任务。

常见的微任务有 MutationObserver、Promise.then(或 reject) 以及以 Promise 为基础开发的其他技术（比如 fetch API），还有 V8 的垃圾回收过程（标记清楚和引用计数）。

这便是**宏任务**和**微任务**的概念。

## 游览器

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

## nodejs

nodejs 和游览器的 EventLoop 还是有很大差别的，值得单独拿出来说一说。

这里放上一张网上关于 nodejs EventLoop 流程图：

<img src="/img/javascript/8.3图.png">

这里会抛开这些晦涩的流程图，以最清晰浅显的方式来一步步拆解 nodejs 的事件循环机制。

### 三大关键阶段

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

### 完善

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

### 实例演示

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

### node 和 游览器 EventLoop 主要区别

两者最主要的区别在于浏览器中的微任务是在每**个相应的宏任务**中执行的，而 nodejs 中的微任务是在**不同阶段之间**执行的。

### 关于 process.nextTick 的一点说明

`process.nextTick` 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务**优先于微任务执行。**
