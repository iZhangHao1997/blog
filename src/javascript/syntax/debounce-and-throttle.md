# 防抖和节流

防抖和节流的定义：

- 防抖：事件持续触发，但只有事件停止触发后 `n` 秒才执行函数
- 节流：事件持续触发，每 `n` 执行一次函数

## 防抖

持续触发事件不执行，等到事件停止触发 n 秒后才去执行函数。

### 实际应用场景

- 窗口大小 resize（只需窗口调整完成后，计算窗口大小，防止重复渲染）
- 滚动事件 scroll（只需执行触发的最后一次滚动事件的处理程序）
- 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，（停止输入后）验证一次就好

### 手写防抖函数（以文本输入验证为例子）

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

### 防抖 debounce

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

## 节流

### 现实场景例子

比如玩游戏时的**垂直同步**设定，可以强制要求游戏画质限制在 60fps 以内，我们的显卡就不会在每次渲染游戏画面的时候，拼劲全力渲染最高帧数。

60fps 可以满足大家的肉眼游戏需求，还可以让显卡稳定工作。

### 实际应用场景

- 一个可拖曳的 DOM 元素（mousemove）
- 王者荣耀或 LOL 里面的技能释放 CD（单位时间内只能释放一次技能）
- 滚动事件（页面滚动，间隔判断一次）
- 搜索联想

### 手写函数节流（以页面滚动为例）

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

### 手写 throttle 节流函数

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

## 总结

**函数节流:** 频繁触发,但只在特定的时间内才执行一次代码
**函数防抖:** 频繁触发,但只在特定的时间内没有触发执行条件才执行一次代码

两者区别在于函数节流是固定时间做某一件事，比如每隔 1 秒发一次请求。而函数防抖是在频繁触发后，只执行一次（两者的前提都是频繁触发）
