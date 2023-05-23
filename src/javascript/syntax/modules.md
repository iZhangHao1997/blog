# 模块化开发

为了让庞大的项目看起来整整齐齐，规规整整而出现的模块化管理。

模块化给我们带来的好处：

- 解决命名冲突
- 提高代码复用
- 提高代码可维护性

## IIFE

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

## CommonJS

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

### 总结

- **一个文件就是一个模块，通过执行该文件来加载模块**
- 每个模块内部，**module 变量代表当前模块**，这个变量就是一个对象，**exports 是它对外的接口**
- require 命令第一次加载该脚本时，就会执行整个脚本，在内存中生成一个对象（**多次加载，只有第一次会被运行，结果被缓存**）
- 特点：
  - 所有代码都运行在模块作用域，不会污染全局作用域
  - 独立性是模块最重要的特点，模块内部最好不会和程序其他部分直接交互
  - 模块多次加载，只有第一次会被执行，并将结果会被缓存下来；如果想要重新执行，就得清除缓存
  - 模块加载的顺序，按照其在代码中的位置
- CommonJS，它是**同步加载**，不适合浏览器

## AMD

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

### 总结

- AMD 采用异步的方式加载模块，模块的加载不会影响它后面语句的执行，所以依赖这个模块的代码，都会被放到回调函数中
- AMD 通过 `define` 的方式来定义模块
  - `define(id?, dependencies?, factory);`
- 使用时，依然通过 `requre` 关键词
  - `require([module], callback)`

## CMD

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

### 总结

- 它是 SeaJS 所推广的一种模块化方法
- 它和 AMD 的区别是：
  - 对于依赖的模块，**AMD 是提前执行的，CMD 是延迟执行的**（RequireJS 2.0 也改成了延时执行）
  - AMD 推崇**依赖前置**，CMD 推崇**就近依赖**，只有在用到某个模块的时候再去 require

## ES6 Module

ES6 的模块化已经不是规范了，而是 JS 语言的特性。

随着 ES6 的推出，AMD 和 CMD 也随之成为了历史。

- 设计思想：尽量的静态化，使得在编译的时候，就能清楚模块之间的依赖关系，以及输入和输出的变量。（AMD 和 CMD 都是在运行时确定）
- 通过 `import` 和 `export` 关键词组成：`export` 作为对外的接口，`import` 则是输入其他模块的功能

ES6 模块与模块化规范相比，有两大特点：

- 模块化规范输出的是一个值的拷贝，ES6 模块输出的是值的引用
- 模块化规范是运行时加载，ES6 模块是编译时输出接口

以下引用阮一峰老师的内容：

### （1）CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个引用，到被加载的那个模块里去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的“符号链接”，原始值变了，`import` 加载的值也会跟着改变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块

### （2）CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

- 运行时加载：CommonJS 模块就是对象；即在输入时是先加载整个模块，然后生成一个对象，再从这个对象上调用方法，这种加载就是**运行时加载**
- 编译时加载：ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即再在 `import` 时可以指定加载某一个输出值，而不是加载整个模块，这种加载称为**编译时加载**

因此，require 的性能问题：由于它是值的拷贝，比较占用内存；而编译时加载的 `import...from...` 性能更高。
