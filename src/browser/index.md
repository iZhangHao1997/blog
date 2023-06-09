# 游览器相关知识

## 1. 游览器事件机制

涉及面试题：事件的触发过程时怎样的？直到什么是事件代理吗？

### 事件触发的三个阶段

事件触发有三个阶段：

1. `window` 往事件触发处传播，遇到注册的捕获事件会触发
1. 传播到事件触发时触发注册的事件
1. 从事件触发往外 `window` 传播，遇到注册的冒泡事件会触发

事件触发一般来说会按照上面的顺序进行，但是也有特例，**如果给一个 `body` 中的子节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行。**

```js
// 以下会先打印冒泡然后是捕获
node.addEventListener(
  "click",
  (event) => {
    console.log("冒泡");
  },
  false
);
node.addEventListener(
  "click",
  (event) => {
    console.log("捕获 ");
  },
  true
);
```

### 注册事件

通常我们使用 `addEventListener` 注册事件，该函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 `useCapture` 参数来说，该参数默认值为 `false` ，`useCapture` 决定了注册的事件是捕获事件还是冒泡事件。对于对象参数来说，可以使用以下几个属性

- `capture`：布尔值，和 `useCapture` 作用一样
- `once`：布尔值，值为 `true` 表示该回调只会调用一次，调用后会移除监听
- `passive`：布尔值，表示永远不会调用 `preventDefault`

一般来说，如果我们只希望事件只触发在目标上，这时候可以使用 `stopPropagation` 来阻止事件的进一步传播。通常我们认为 `stopPropagation` `是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。stopImmediatePropagation` 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件。

```js
node.addEventListener(
  "click",
  (event) => {
    event.stopImmediatePropagation();
    console.log("冒泡");
  },
  false
);
// 点击 node 只会执行上面的函数，该函数不会执行
node.addEventListener(
  "click",
  (event) => {
    console.log("捕获 ");
  },
  true
);
```

### 事件代理

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话**应该注册在父节点上**

```html
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  let ul = document.querySelector("#ul");
  ul.addEventListener("click", (event) => {
    console.log(event.target);
  });
</script>
```

事件代理的方式相较于直接给目标注册事件来说，有以下优点：

- 节省内存
- 不需要给子节点注销事件

## 2. 游览器本地存储

涉及面试题：有几种方式可以实现存储功能，分别有什么优缺点？什么是 Service Worker？

存储主要分为：cookie，localstorage，sessionStorage，indexDB

我们先来通过表格学习下这几种存储方式的区别

| 特性         | cookie                                     | localstorage             | sessionStrage  | indexDB                  |
| ------------ | ------------------------------------------ | ------------------------ | -------------- | ------------------------ |
| 数据生命周期 | 一般由服务器生成，可以设置过期时间         | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 数据存储大小 | 4K                                         | 5M                       | 5M             | 无限                     |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 | 不参与                   | 不参与         | 不参与                   |

从上表可以看到，`cookie` 已经不建议用于存储。如果没有大量数据存储需求的话，可以使用 `localStorage` 和 `sessionStorage` 。对于不怎么改变的数据尽量使用 `localStorage` 存储，否则可以用 `sessionStorage` 存储。

对于 `cookie` 来说，我们还需要注意安全性。

| 属性      | 作用                                                           |
| --------- | -------------------------------------------------------------- |
| value     | 如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识 |
| http-only | 不能通过 JS 访问 Cookie，减少 XSS 攻击                         |
| secure    | 只能在协议为 HTTPS 的请求中携带                                |
| same-site | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击          |

### 2.1 Cookie

`Cookie` 最开始被设计出来其实并不是作本地存储的，而是为了弥补 `HTTP` 在**状态管理上的不足**。

`HTTP` 是一个无状态的通信协议，客户端向服务器发送请求，服务器返回响应，故事就这样结束了，但是下次发送请求如何让服务端知道客户端是谁呢？

所以就产生了 `Cookie`。

Cookie 本质上就是游览器里面存储的一个很小的文本文件，内部以键值对的方式存储（在 chrome 开发者面板的 Application 这一栏可以看到）。向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。

Cookie 的作用很好理解，就是用来作**状态存储**的，但它也是有很多致命的缺陷的：

1. 容量缺陷。Cookie 体积上只有 **4KB**，只能用来存储少量信息
1. 性能缺陷。Cookie 紧跟域名，不管这个域名的请求需不需要 Cookie 都会携带上完整的 Cookie，随着请求数的增多，造成巨大的性能浪费，因为请求携带了很多不必要的内容
1. 安全缺陷。由于 Cookie 以纯文本的形式在游览器和服务器之间传递，很容易被非法用户截取，然后进行一系列的篡改，在 Cookie 有限期内重新发送给服务器，这是相当危险的。另外，在 `httpOnly` 为 `false` 的情况下，Cookie 能直接通过 JS 脚本来读取

### 2.2 localStorage

**和 Cookie 的异同：**
localStorage 和 Cookie 一样都是针对一个域名的，即在同一个域名下，会存储相同的一段 localStorage，不过与 Cookie 还是有相当多的区别的：

1. 容量。localStorage 的容量上限为 5MB，相比于 Cookie 的 4KB 大大增加，并且是针对一个域名的，而且是永久存储
1. 只存在客户端。默认不参与与服务器的通信，避免了 Cookie 带来的性能问题和安全问题
1. 接口封装。通过 `localStorage` 暴露在全局，并通过 `setItem` 和 `getItem` 等方法进行操作，非常方便

应用场景：可以存储一些比较稳定的资源，比如官网 LOGO、BASE64 格式的图片资源等。

### 2.3 sessionStorage

`sessionStorage` 以下方面和 `localStorage` 一致：

1. 容量。上限同样为 5MB
1. 只存在于客户端，默认不参与与服务器通信
1. 接口封装。存储方式、操作方式与 `localStorage` 一致

本质的区别就是 `sessionStorage` 只是会话级别的存储，并不是持久化存储。会话结束，页面关闭，这部分的 `sessionStorage` 就不复存在了。

应用场景：可以存储表单的信息，这样刷新了表单数据也还存在；存储游览器本次游览记录，且是关闭游览器后不需要这些记录就更适合了，事实上微博就采取了这样的存储方式。

### 2.4 indexedDB

`indexedDB` 是运行在游览器中的 `非关系型数据库`，本质上是数据库，和上述其他本地存储不是一个量级的，理论上容量没有上限，支持事务、存储二进制数据等。

### 2.5 总结

游览器各种本地存储和缓存技术的发展，给前端应用带来了大量的机会，PWA 也正是依托了这些优秀的存储方案才得以发展起来。重新梳理一下这些本地存储方案：

1. `cookie` 并不适合存储，而且存在非常多的缺陷
1. `localStorage` 和 `localStorage` 存储大小都是 5MB，默认不参与服务器通信
1. `indexedDB` 是游览器上的非关系型数据库，为大型数据的存储提供了接口

## 3. 游览器缓存机制

[深入理解游览器的缓存机制](https://github.com/ljianshu/Blog/issues/23)

缓存可以说是性能优化中**简单高效**的一种优化方式了，它可以**显著减少网络传输所带来的损耗**。

对于一个数据请求来说，可以分为发起**网络请求**、**后端处理**、**浏览器响应**三个步骤。浏览器缓存可以帮助我们在第一和第三步骤中优化性能。比如说直接使用缓存而不发起请求，或者发起了请求但后端存储的数据和前端一致，那么就没有必要再将数据回传回来，这样就减少了响应数据。

接下来的内容中我们将通过以下几个部分来探讨浏览器缓存机制：

- 缓存位置
- 缓存策略
- 实际场景应用缓存策略

### 3.1 缓存位置

从缓存位置中来说分为四种，并且各有各自的**优先级**，当依次查找缓存且都没有命中的时候，才会去请求网络

1. Service Worker
1. Memory Cache
1. Disk Cache
1. Pysh Cache
1. 网络请求

#### Service Worker

Service Worker 的缓存于游览器其他内建的缓存机制不同，它可以让我们**自由控制**缓存哪些文件、如何匹配缓存、如何读取缓存，并且**缓存时持续性的**。

当 Service Worker 没有命中缓存的时候，我们需要去调用 `fetch` 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存优先级去查找数据。**但是不管我们是从 Memory Cache 中还是从网络请求中获取到数据，游览器都会显示我们从 Service Worker 中获取到内容。**

#### Memory Cache

Memory Cache 是内存中的缓存，读取内存中的数据肯定比硬盘快。**但是内存缓存虽然读取高效，但是存在的时间很短暂，会随着进程的释放而释放**。一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存

<img src="/img/HTTP/从内存中读取缓存.png">

但是我们不能让数据都放在 Memory Cache 中，因为内存的容量是要比硬盘小得多的，操作系统会谨慎使用内存进行缓存。虽然内存中可以存储大部分的文件，比如说 CSS、JS、HTML、图片等等。但是游览器会把哪些文件丢进内存这就很**玄学**。

当然，通过实践和猜测还是可以得出一些结论：

- 对于大文件来说，大概率是不会存储在内存中的，反之优先
- 当前系统内存使用率高的话，文件优先存储进硬盘

#### Disk Cache

Disk Cache 就是存储在硬盘中的存储，读取速度比内存存储慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在**容量和存储时效性上**。

在所有游览器缓存中，Disk Cache 覆盖面是基本最大的。它会根据 HTTP Header 中的字段来判断哪些字段需要存储，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。**并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。**

#### Push Cache

Push Cache 是 HTTP/2 中的内容，当上面的三种缓存都没有命中的时候，它才会被调用。**并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就会被释放。**

Push Cache 在国内能查到的资料很少，也是因为 HTTP/2 在国内普及不够，但是 HTTP/2 将会是日后的一个趋势。这里有 Push Cache 的几个结论：

- 所有的资源都能被退送，但是 Edge 和 Safari 游览器兼容性不怎么好
- 可以推送 no-cache 和 no-store 的资源
- 一旦连接被关闭，Push Cache 就被释放
- 多个页面可以使用相同的 HTTP/2 连接，也就是说能使用同样的缓存
- Push Cache 中的缓存只能被使用一次
- 浏览器可以拒绝接受已经存在的资源推送
- 你可以给其他域名推送资源

#### 网络请求

如果所有的缓存都没有被命中的话，就只能发起请求来获取资源了。

那么为了性能上的考虑，大部分的接口都应该选择好缓存策略，接下来学习缓存策略这部分内容。

### 3.2 缓存策略

通常游览器缓存策略分为两种：**协商缓存**和**强缓存**，并且缓存策略都是通过设置 HTTP Header 来实现的。

#### 强缓存

强缓存可以设置两种 HTTP Header 实现：`Expires` 和 `Cache-control`。强缓存表示在缓存期间不需要请求，`state code` 为 200。

##### Expires

```http
Expires: Wed, Oct 2020 08:40:00 GMT
```

`Expires` 是 HTTP/1 的产物，表示资源会在 `Wed, Oct 2020 08:40:00 GMT` 后过期，需要再次请求。并且 `Expires` **受限于本地时间**，如果修改了本地时间，会造成缓存失效。

##### Cache-control

```http
Cache-control: max-age=30
```

`Cache-control` 出现于 HTTP/1.1，优先级高于 `Expires`。该属性值表示资源会在 30 秒后过期，需要再次请求。

`Cache-control` **可以在请求头或者响应头中设置**，并且可以组合多种指令。

<img src="/img/HTTP/多种指令配合流程图.png">

从图中我们可以看到，我们可以将**多个指令配合起来一起使用**，达到多个目的。比如说我们希望资源能被缓存下来，并且是客户端和代理服务器都能缓存，还能设置缓存失效时间等等。

接下来我们就来学习一些常见指令的作用

<img src="/img/HTTP/常见指令的作用.png">

#### 协商缓存

如果缓存过期了，就需要发起请求验证资源是否有更新。协商缓存可以通过设置两种 HTTP Header 实现：`Last-Modified` 和 `ETag`。

当游览器发起请求验证资源时，如果资源没有做改变，那么服务器就会返回 304 状态码，并且更新游览器缓存有效期。

<img src="/img/HTTP/协商缓存.png">

##### Last-Modified 和 If-Modified-Since

`Last Modified` 表示本地文件最后修改的日子，如果 `If-ModiFied-since` 会将 `Last-Modified` 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就将新的资源发送回来，否则发送 304 状态码。

但是 `Last-Modified` 存在一些弊端：

- 如果本地打开缓存文件，即使没有对文件进行修改，但是还是会造成 `Last-Modified` 被修改，服务端不能命中缓存导致发送相同资源
- 因为 `Last-Modifed` 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源

因为如上的弊端，所以在 HTTP/1.1 出现了 `ETag`。

##### ETag 和 In-None-Match

`ETag` 类似于文件指纹，`If-None-Match` 会将当前 `ETag` 发送给服务器，询问该资源 `ETag` 是否变动，有变动的话就会将新的资源发送回来。并且 `ETag` 优先级比 `Last-Modified` 高。

以上就是缓存策略的所有内容了，看到这里，不知道你是否存在这样一个疑问。**如果什么缓存策略都没设置，那么浏览器会怎么处理？**

对于这种情况，浏览器会采用一个启发式的算法，通常会取响应头中的 `Date` 减去 `Last-Modified` 值的 10% 作为缓存时间。

### 3.3 实际场景应用缓存策略

单纯了解理论而不付诸于实践是没有意义的，接下来我们来通过几个场景学习下如何使用这些理论。

#### 频繁变动的资源

对于频繁变动的资源，首选需要使用 `Cache-control: no-cache` 使游览器每次都请求服务器，然后配合 `ETag` 和 `Last-Modified` 来验证资源是否有效。这样的作法虽然不能节省请求数量，但是能显著减少响应数据大小。

#### 代码文件

这里特指除了 HTML 外的代码文件，因为 HTML 文件一般不缓存或者缓存时间很短。

一般来说，这里都会使用工具来打包代码，那么我们可以对文件名进行哈希处理，只有当代码修改后才会生成新的文件名。基于此，我们就可以给代码文件设置缓存有效期一年 `Cache-control: max-age:31536000`，这样只有当 HTML 文件中引入的文件名发生了改变才会去下载最新的文件代码文件，否则就一直使用缓存。

## 4. 游览器的渲染过程以及回流和重绘

首先从 MDN 上图看游览器的渲染过程：

<img src="/img/browsers/游览器渲染过程.png">

从上图可以看到，游览器的渲染过程如下：

1. 解析 HTML，生成 DOM 树；解析 CSS，生成 CSSOM 树
1. 将 DOM 树和 CSSOM 树结合，生成渲染树（Render Tree）
1. Layout（回流）：根据生成的渲染树，进行回流（Layout），得到节点的几何信息（位置，大小）
1. Painting（重绘）：根据渲染树以及回流得到的几何信息，得到节点的绝对像素
1. Display：将像素发给 GPU，展示在页面上。（其实这一步还有很多内容，比如 GPU 将多个图层合并为一个图层，并展示在页面中。而 CSS3 硬件加速的原理则是新建合成层，需要学习请另外查找资料）

渲染过程看起来很简单，让我们来具体了解一下每一步做了什么？

### 4.1 生成渲染树

<img src="/img/browsers/生成渲染树.png">

为了构建渲染树，游览器主要完成了以下工作：

1. 从 DOM 树的根节点开始遍历每个可见节点
1. 对于每个可见节点，找到 CSSOM 树中的对应规则，并应用它们
1. 根据每个节点和它对应的样式，组合生成渲染树

第一步中，既然说到了要遍历可见的节点，那么我们得先知道，什么节点是不可见的。不可见的节点包括：

- 一些不会渲染输出的节点，比如 `script`、`meta`、`link` 等
- 一些通过 CSS 进行隐藏的节点，比如 `dispaly: none` 。注意，利用 `visibility` 和 `opacity` 隐藏的节点，还是会显示在渲染树上。只有 `display: none` 的节点才不会显示在渲染树上

**注意：渲染树只包含可见节点**

### 4.2 回流

前面我们通过构造渲染树，我们将可见的 DOM 节点以及它的样式结合起来，可是我们还需要计算它们在设备视口（viewport）内的确切位置和大小，这个计算的阶段就是回流。

为了弄清每个对象在网站上的确切大小和位置，游览器从渲染树的根节点开始遍历，我们可以以下面的这个示例来表示：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Critial Path: Hello world!</title>
  </head>
  <body>
    <div style="width: 50%">
      <div style="width: 50%">Hello world!</div>
    </div>
  </body>
</html>
```

我们可以看到，第一个 div 节点的显示尺寸设置为视口窗口的 50%，第二个 div 尺寸设置为父节点的 50%。而在回流这个阶段，我们就需要根据视口的具体宽度，将其转化为实际的像素值。

<img src="/img/browsers/Layout阶段.png">

### 4.3 重绘

最终，我们通过构造渲染树和回流阶段，我们知道了哪些阶段是可见的，以及可见节点的样式和具体的几何信息（位置、大小），那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘（print）节点。

既然知道了游览器的渲染过程后，我们就来探讨一下，何时发生回流重绘。

### 4.4 何时发生回流重绘

我们前面知道了，回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化的时候，就需要回流。比如以下情况：

- 添加或删除可见的 DOM 元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
- 页面首次渲染
- 游览器窗口尺寸发生变化（因为回流是根据视口的大小来计算元素的位置和大小的）

**注意：回流一定会触发重绘，重绘不一定会回流。**

根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重排，比如，滚动条出现的时候或者修改了根节点。

### 4.5 游览器的优化机制

现代的浏览器都是很聪明的，由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。但是！**当你获取布局信息的操作的时候，会强制队列刷新**，比如当你访问以下属性或者使用以下方法：

- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- getComputedStyle()
- getBoundingClientRect
- 具体可以访问这个网站：<https://gist.github.com/paulirish/5d52fb081b3570c81e3a>

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列**。如果要使用它们，最好将值缓存起来。

### 4.6 减少回流和重绘

#### 最小化重绘和回流

由于重绘和回流代价比较昂贵，最好可以减少它发生的次数。为了减少发生的次数，我们可以合并多次对 DOM 和样式的修改，然后一次处理掉，参考这个例子：

```js
const el = document.getElementById("test");
el.style.padding = "5px";
el.style.borderLeft = "1px";
el.style.borderRight = "2px";
```

例子中，有三个样式都被修改了，每一个都会影响元素的几何结构，引起回流。当然，大部分现代游览器都对其做了优化，因此，只会发生一次回流。但是如果在旧版的游览器上面执行上面的代码，有其他代码访问了布局信息（上文中触发回流和布局信息），那么就会导致三次回流。

因此我们可以合并所有的改变然后依次处理，比如我们可以采取以下的方式：

- 使用 cssText

```js
const el = document.getElementById("test");
el.style.cssText += "border-left: 1px; border-right: 2px; padding: 5px;";
```

- 修改 CSS 的 class

```js
const el = document.getElementById("test");
el.className += " active";
```

#### 批量修改 DOM

当我们需要对 DOM 进行一系列修改，我们可以通过以下步骤减少回流重绘次数：

1. 使元素脱离文档流
1. 对其进行多次修改
1. 将元素带回文档

该过程的第一步和第三步可能会引起回流，但是第二部中对 DOM 的所有修改都不会引起回流，因为它已经不在渲染树了。

有三种方式可以让 DOM 脱离文档流

- 隐藏元素，应用修改，重新显示
- 使用文档片段（document fragment）在当前 DOM 之外构建一个子树，再把它拷贝回文档
- 将原始元素拷贝到一个脱离文档的节点，修改节点后，再替换原始元素

考虑我们要执行一段批量插入节点的代码：

```js
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement("li");
    li.textContent = "text";
    appendToElement.appendChild(li);
  }
}

const ul = document.getElementById("list");
appendDataToElement(ul, data);
```

如果我们直接这样执行的话，由于每次循环都会插入一个新的节点，会导致浏览器回流一次。

我们可以使用这三种方式进行优化:

**隐藏元素**，**应用修改**，**重新显示**

这个会在展示和隐藏节点的时候，产生两次重绘

```js
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement("li");
    li.textContent = "text";
    appendToElement.appendChild(li);
  }
}
const ul = document.getElementById("list");
ul.style.display = "none";
appendDataToElement(ul, data);
ul.style.display = "block";
```

**使用文档片段(document fragment)在当前 DOM 之外构建一个子树，再把它拷贝回文档**

```js
const ul = document.getElementById("list");
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment);
```

**将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始元素**

```js
const ul = document.getElementById("list");
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

**原因：原因其实上面也说过了，浏览器会使用队列来储存多次修改，进行优化，所以对这个优化方案，我们其实不用优先考虑。**

#### 避免触发同步布局事件

上文我们说过，当我们访问元素的一些属性的时候，会导致浏览器强制清空队列，进行强制同步布局。举个例子，比如说我们想将一个 p 标签数组的宽度赋值为一个元素的宽度，我们可能写出这样的代码：

```js
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + "px";
  }
}
```

这段代码看上去是没有什么问题，可是其实会造成很大的性能问题。在每次循环的时候，都读取了 `box` 的一个 `offsetWidth` 属性值，然后利用它来更新 `p` 标签的 `width` 属性。这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列。我们可以优化为:

```js
const width = box.offsetWidth;
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = width + "px";
  }
}
```

#### 对于复杂动画效果,使用绝对定位让其脱离文档流

对于复杂动画效果，由于会经常的引起回流重绘，因此，我们可以使用绝对定位，让它脱离文档流。否则会引起父元素以及后续元素频繁的回流。

#### css3 硬件加速（GPU 加速）

比起考虑如何减少回流重绘，我们更期望的是，根本不要回流重绘。这个时候，css3 硬件加速就闪亮登场啦！！

**划重点：使用 css3 硬件加速，可以让 transform、opacity、filters 这些动画不会引起回流重绘 。但是对于动画的其它属性，比如 background-color 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。**

本篇文章只讨论如何使用，暂不考虑其原理。

##### 如何使用

常见的触发硬件加速的 CSS 属性：

- transform
- opacity
- filters
- Will-change

##### CSS3 硬件加速的坑

如果你为太多元素使用 css3 硬件加速，会导致内存占用较大，会有性能问题。
在 GPU 渲染字体会导致抗锯齿无效。这是因为 GPU 和 CPU 的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊。

## 5. 说一说从输入 URL 到页面呈现发生了什么？————网络篇

此时此刻，你在游览器地址栏输入了百度的网址：

```http
https://www.baidu.com/
```

### 5.1 网络请求

#### 1. 构建请求

首先第一步，游览器会构建请求行

```http
GET / HTTP/1.1
```

请求行由：**请求方式** **域名根路径** **请求 HTTP 协议版本** 组成

#### 2. 查找强缓存

先检查强缓存，如果命中直接使用，否则进入下一步。

#### 3. DNS 解析

由于我们输入的是域名，而数据包是通过 `IP 地址` 传给对方的。因此我们需要得到域名的 `IP 地址`。这个过程就需要一个服务系统，DNS 域名系统。得到具体的 IP 地址就是 DNS 域名解析的过程。

另外，游览器提供了 DNS 数据缓存的功能。即如果一个域名已经解析过了，那么游览器会把结果缓存下来，下次不处理直接走缓存，不需要经过 `DNS 解析`。

另外，如果我们不指定端口的话，默认采用对应的 IP 的 80 端口。

#### 5. 建立 TCP 连接

这里要注意一点，Chrome 在同一个域名下同时最多有 6 个 TCP 连接，超过 6 个的话剩下的请求就得等待。

假设我们现在不需要等待，就进入了建立 TCP 连接的过程。首先解释一下什么是 TCP：

> TCP(Transmission Control Protocol，传输控制协议)是一种面向连接的、可靠的、基于字节流的传输层通信协议。

建立 `TCP 连接` 主要经历了下面三个阶段：

1. 通过**三次握手**（即总共发送 3 个数据包确认已经建立连接），建立客户端和服务器之间的连接
1. 进行数据传输。这里有一个重要的机制，就是接收方接收到数据包后要向发送方 `确认`，如果发送方没有收到这个 `确认` 消息，就判定数据包丢失，并重新发送数据包。当然，发送过程中还有一个优化策略，就是把大的数据包拆分成小的数据包，一次传输到接收方，接收方按照这个小包的顺序把它们组装成完整数据包
1. 断开连接的阶段。数据传输完成，现在要断开连接了，通过**四次挥手**来断开连接

到这里，我们应该明白 TCP 连接通过什么手段来保证数据传输的可靠性，一是**三次握手**建立连接，二是发送数据包后要有确认消息，三是**四次挥手**断开连接。

当然，如果再深入地问，比如**为什么要三次握手，两次不行吗？第三次握手失败了怎么办？为什么要四次挥手？**等等一系列问题，涉及计算机网络的基础知识，比较底层，但也是非常重要的细节，[推荐学习文章](https://zhuanlan.zhihu.com/p/86426969)。

#### 5. 发送 HTTP 请求

TCP 连接建立完毕后，游览器可以和服务器进行通信，即开始发送 HTTP 请求。游览器发送 HTTP 请求要携带三个东西：请求行、请求头和请求体。

首先是请求行，这是我们第一步就构建完成了的：

```http
GET / HTTP/1.1
```

结构很简单，由请求方法、请求 URI 和 HTTP 版本协议组成。

同时也要带上**请求头**，比如我们之前说的 `Cache-Control`、`If-Modifined-Since`、`If-None-Match` 都有可能放入请求头中作为缓存的标识信息，当然还有其他信息，如：

```http
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Cookie: /* 省略cookie信息 */
Host: www.baidu.com
Pragma: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
```

最后是请求体，请求体只有在 `POST` 方法下存在，常见的场景是**表单提交**。

### 5.2 网络响应

HTTP 请求达到服务器，服务器进行对应的处理。最后要把数据传给游览器，也就是返回网络响应。

跟请求部分类似，网络响应具有三个部分：**相应行**、**响应头**和**响应体**。

响应行类似下面这样：

```
HTTP/1.1 200 OK
```

由**HTTP 协议版本 状态码 状态描述**组成。

响应头则包含了服务器返回的其他信息，比如服务器生成数据的数据、返回数据的类型以及即将写入的 Cookie 信息。

举例如下：

```http
Cache-Control: no-cache
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=set-8
Data: Wed, 12 Dec 2020 22:20:12 GMT
Server: apache
Set-Cookie: rsv_i=f9a0SIItKqzv7kqgAAgphbGyRts3RwTg%2FLyU3Y5Eh5LwyfOOrAsvdezbay0QqkDqFZ0DfQXby4wXKT8Au8O7ZT9UuMsBq2k; path=/; domain=.baidu.com
```

响应完之后，TCP 连接会根据 `Connection` 字段决定是否建立持久连接，`keep-alive` 表示持久连接，这样 `TCP` 连接会一直保持，之后请求统一站点的资源会复用这个连接。

否则断开 `TCP` 连接，请求-响应流程结束。

### 5.3 总结

到此，我们总结一下主要内容，也就是游览器端的网络请求过程：

<img src="/img/browsers/游览器端网络请求过程.png">

## 6. 说一说从输入 URL 到页面呈现发生了什么？————解析算法篇

完成了网络请求和响应，如果响应头中 `Content-Type` 的值是 `text/html`，那么接下来就是游览器的**解析**和**渲染**工作了。

首先介绍解析部分，主要分为以下几个步骤：

1. 构建 `DOM` 树
1. `样式`计算
1. 生成`布局树`（`Layout Tree`）

### 6.1 构建 DOM 树

由于游览器无法直接理解 `HTML 字符串`，因此将这一系列的字节流转换为一种有意义并且方便操作的数据结构，这种数据结构就是 `DOM 树`。`DOM 树` 本质上是一个以 `document` 为根节点的多叉树。

那通过什么样的方式来进行解析呢？

#### HTML 文法的本质

首先，我们应该清除把握一点：HTML 的文法并不是 `上下文无关文法`。

这里，有必要讨论以下什么是 `上下文无关文法`。

在计算机科学的**编译原理**学科中，有非常明确的定义：

> 若一个形式文法 G = (N, Σ, P, S) 的生产规则都取如下的形式：V -> w，则叫上下文无关语法。其中 V ∈ N，w ∈ (N ∪ Σ)\*。

其中把 G = (N, Σ, P, S) 中各个参量的意义解释一下：

1. N 是**非终结符**（顾名思义，也就是说最后一个符号不是它，下面同理）集合
1. Σ 是**终结符**集合
1. P 是**开始符**，它必须属于 N，也就是非终结符
1. S 就是不同的产生式集合。如 S -> aSb 等等

#### 解析算法

HTML5 规范详细地介绍了解析算法，这个算法分为两个阶段：

1. 标记化
1. 建树

对应的两个过程就是**词法分析**和**语法分析**。

#### 标记化算法

这个算法输入为 `HTML 文本`，输出为 `HTML 标记`，也称为**标记生成器**。其中运用**有限自动状态机**来完成。即在当前状态下，接收一个或多个字符，就会更新到下一个状态。

```html
<html>
  <body>
    Hello HTML
  </body>
</html>
```

通过一个简单的例子来演示一下标记化的过程。

遇到 `<`，状态为**标记打开**。

接收 `[a-z]` 的字符，会进入标记名称状态。

这个状态一直保持，直到遇到 `>`，表示标记名称记录完成，这时候变为**数据状态**。

接下来遇到 `body` 标签做同样的处理。

这个时候 `html` 和 `body` 的标记都记录好了。

现在来到 `<body>` 中的 `>`，进入**数据状态**，之后保持这样的状态接收后面的字符**Hello HTML**。

接着接收 `</body>` 中的 `<`，回到标记打开，接收下一个 `/` 后，这时候会创建一个 `end tag` 的 token。

随后进入**标记名称状态**，遇到 `>` 回到**数据状态**。

接着以同样的样式处理 `</body>`。

#### 建树算法

之前提到过，DOM 树是一个以 `document` 为根节点的多叉树，因此解析器首先会创建一个 `document` 对象。标记生成器会把每个标记信息发送给**建树器**。**建树器**接收到相应的标记时，会**创建对应的 DOM 对象**。创建这个 `DOM 对象` 后会做两件事情：

1. 将 `DOM 对象` 加入 DOM 树中
1. 将对象标记压入存放开放（与 `闭合标签`意思对应）元素的栈中。

还是拿下面这个例子说:

```html
<html>
  <body>
    Hello HTML
  </body>
</html>
```

首先，状态为**初始化状态**。

接收到标记生成器传来的 `html` 标签，这时候状态变为 `before html` 状态。同时创建一个 `HTMLHtmlElement` 的 DOM 元素, 将其加到 `document` 根对象上，并进行压栈操作。

接着状态自动变为 `before head` , 此时从标记生成器那边传来 `body`，表示并没有 `head`, 这时候建树器会自动创建一个 `HTMLHeadElement` 并将其加入到 DOM 树中。

现在进入到 `in head` 状态, 然后直接跳到 `after head`。

现在标记生成器传来了 `body` 标记，创建 `HTMLBodyElement`, 插入到 `DOM` 树中，同时压入开放标记栈。

接着状态变为 `in body`，然后来接收后面一系列的字符: Hello HTML。接收到第一个字符的时候，会创建一个 `Text` 节点并把字符插入其中，然后把 `Text` 节点插入到 DOM 树中 `body` 元素的下面。随着不断接收后面的字符，这些字符会附在 `Text` 节点上。

现在，**标记生成器**传过来一个 `body` 的结束标记，进入到 `after body` 状态。

**标记生成器**最后传过来一个 `html` 的结束标记, 进入到 `after after body` 的状态，表示解析过程到此结束。

#### 容错机制

讲到 `HTML5` 规范，就不得不说它强大的**宽容策略**, 容错能力非常强，虽然大家褒贬不一，不过我想有必要知道 `HTML Parser` 在容错方面做了哪些事情。

接下来是 WebKit 中一些经典的容错示例，发现有其他的也欢迎来补充。

1. 使用 `</br>` 而不是 `<br>`

```js
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
  reportError(MalformedBRError);
  t->beginTag = true;
}
```

1. 表格离散

```html
<table>
  <table>
    <tr>
      <td>inner table</td>
    </tr>
  </table>
  <tr>
    <td>outer table</td>
  </tr>
</table>
```

`WebKit` 会自动转换为：

```html
<table>
  <tr>
    <td>outer table</td>
  </tr>
</table>
<table>
  <tr>
    <td>inner table</td>
  </tr>
</table>
```

1. 表单元素嵌套

这时候直接忽略里面的 `form`。

### 6.2 样式计算

关于 CSS 样式，它的来源一般是三种：

1. link 标签引用
1. style 标签中的样式
1. 元素的内嵌 style 属性

#### 格式化样式表

首先，浏览器是无法直接识别 CSS 样式文本的，因此渲染引擎接收到 CSS 文本之后第一件事情就是将其转化为一个结构化的对象，即 styleSheets。

这个格式化的过程过于复杂，而且对于不同的浏览器会有不同的优化策略，这里就不展开了。

在浏览器控制台能够通过 `document.styleSheets` 来查看这个最终的结构。当然，这个结构包含了以上三种 CSS 来源，为后面的样式操作提供了基础。

#### 标准化化样式表

有一些 CSS 样式的数值并不容易被渲染引擎所理解，因此需要在计算样式之前将它们标准化，如 `em-`>`px`, `red`->`#ff0000`, `bold-`>`700` 等等。

#### 计算每个节点的具体样式

样式已经被`格式化`和`标准化`,接下来就可以计算每个节点的具体样式信息了。

其实计算的方式也并不复杂，主要就是两个规则: **继承**和**层叠**。

每个子节点都会默认继承父节点的样式属性，如果父节点中没有找到，就会采用浏览器默认样式，也叫 `UserAgent` 样式。这就是继承规则，非常容易理解。

然后是层叠规则，CSS 最大的特点在于它的层叠性，也就是最终的样式取决于各个属性共同作用的效果，甚至有很多诡异的层叠现象，看过《CSS 世界》的同学应该对此深有体会，具体的层叠规则属于深入 CSS 语言的范畴，这里就不过多介绍了。

不过值得注意的是，在计算完样式之后，所有的样式值会被挂在到 `window.getComputedStyle` 当中，也就是可以通过 JS 来获取计算后的样式，非常方便。

### 6.3 生成布局树

现在已经生成了 `DOM树` 和 `DOM样式`，接下来要做的就是通过浏览器的布局系统`确定元素的位置`，也就是要生成一棵`布局树`(Layout Tree)。
布局树生成的大致工作如下:

1. 遍历生成的 DOM 树节点，并把他们添加到布局树中。
1. 计算布局树节点的坐标位置。

值得注意的是，这棵布局树值包含可见元素，对于 `head` 标签和设置了 `display: none` 的元素，将不会被放入其中。

有人说首先会生成 `Render Tree`，也就是渲染树，其实这还是 16 年之前的事情，现在 Chrome 团队已经做了大量的重构，已经没有生成 `Render Tree` 的过程了。而布局树的信息已经非常完善，完全拥有 `Render Tree` 的功能。

之所以不讲布局的细节，是因为它过于复杂，一一介绍会显得文章过于臃肿，不过大部分情况下我们只需要知道它所做的工作**是什么**即可，如果想深入其中的原理，知道它是如何来做的，我强烈推荐你去读一读人人 FED 团队的文章[从 Chrome 源码看浏览器如何 layout 布局](https://www.rrfed.com/2017/02/26/chrome-layout/)。

### 6.4 总结

梳理一下这一节的主要脉络:

<img src="/img/browsers/游览器端解析算法过程.png">

## 7. 说一说从输入 URL 到页面呈现发生了什么？————渲染过程篇

通过游览器的样式解析算法的过程，包括 **构建 DOM 树**，**样式计算** 和 **构建布局树**。

接下来就是渲染过程，分为以下几个步骤：

1. 建立**图层树**(`Layer Tree`)
1. 生成**绘制列表**
1. 生成**图块**并**栅格化**
1. 显示器显示内容

### 7.1 建图层树

如果你觉得现在 `DOM 节点`也有了，样式和位置信息也都有了，可以开始绘制页面了，那你就错了。

因为你考虑掉了另外一些复杂的场景，比如 3D 动画如何呈现出变换效果，当元素含有层叠上下文时如何控制显示和隐藏等等。

为了解决如上所述的问题，浏览器在构建完`布局树`之后，还会对特定的节点进行分层，构建一棵`图层树`(`Layer Tree`)。

那这棵图层树是根据什么来构建的呢？

一般情况下，节点的图层会默认属于父亲节点的图层(这些图层也称为**合成层**)。那什么时候会提升为一个单独的合成层呢？

有两种情况需要分别讨论，一种是**显式合成**，一种是**隐式合成**。

#### 显式合成

下面是**显式合成**的情况:

一、拥有**叠层上下文**的节点。

层叠上下文也基本上是有一些特定的 CSS 属性创建的，一般有以下情况：

1. HTML 根元素本身就具有层叠上下文。
1. 普通元素设置`position不为static`并且设置了`z-index` 属性，会产生层叠上下文。
1. 元素的 `opacity` 值不是 `1`
1. 元素的 `transform` 值不是 `none`
1. 元素的 `filter` 值不是 `none`
1. 元素的 `isolation` 值是 `isolate`
1. `will-change` 指定的属性值为上面任意一个。(`will-change` 的作用后面会详细介绍)

二、需要**裁剪**的地方

比如一个 div，你只给他设置 100 \* 100 像素的大小，而你在里面放了非常多的文字，那么超出的文字部分就需要被剪裁。当然如果出现了滚动条，那么滚动条会被单独提升为一个图层。

#### 隐式合成

接下来是`隐式合成`，简单来说就是`层叠等级低`的节点被提升为单独的图层之后，那么`所有层叠等级比它高`的节点**都会**成为一个单独的图层。

这个隐式合成其实隐藏着巨大的风险，如果在一个大型应用中，当一个 `z-index` 比较低的元素被提升为单独图层之后，层叠在它上面的的元素统统都会被提升为单独的图层，可能会增加上千个图层，大大增加内存的压力，甚至直接让页面崩溃。这就是**层爆炸**的原理。这里有一个具体的例子，点击打开。

值得注意的是，当需要 `repaint` 时，只需要 `repaint` 本身，而不会影响到其他的层。

### 7.2 生成绘制列表

接下来渲染引擎会将图层的绘制拆分成一个个绘制指令，比如先画背景、再描绘边框......然后将这些指令按顺序组合成一个待绘制列表，相当于给后面的绘制操作做了一波计划。

这里我以百度首页为例，大家可以在 Chrome 开发者工具中在设置栏中展开 `more tools`, 然后选择 Layers 面板，就能看到下面的绘制列表:

<img src="/img/browsers/生成绘制列表.png">

### 7.3 生成图块和生成位图

现在开始绘制操作，实际上在渲染进程中绘制操作是由专门的线程来完成的，这个线程叫**合成线程**。

绘制列表准备好了之后，渲染进程的主线程会给**合成线程**发送 `commit` 消息，把绘制列表提交给合成线程。接下来就是合成线程一展宏图的时候啦。

首先，考虑到视口就这么大，当页面非常大的时候，要滑很长时间才能滑到底，如果要一口气全部绘制出来是相当浪费性能的。因此，合成线程要做的第一件事情就是将图层**分块**。这些块的大小一般不会特别大，通常是 256 _256 或者 512_ 512 这个规格。这样可以大大加速页面的首屏展示。

因为后面图块数据要进入 GPU 内存，考虑到浏览器内存上传到 GPU 内存的操作比较慢，即使是绘制一部分图块，也可能会耗费大量时间。针对这个问题，Chrome 采用了一个策略: 在首次合成图块时只采用一个**低分辨率**的图片，这样首屏展示的时候只是展示出低分辨率的图片，这个时候继续进行合成操作，当正常的图块内容绘制完毕后，会将当前低分辨率的图块内容替换。这也是 Chrome 底层优化首屏加载速度的一个手段。

顺便提醒一点，渲染进程中专门维护了一个**栅格化线程池**，专门负责把**图块**转换为**位图数据**。

然后合成线程会选择视口附近的**图块**，把它交给**栅格化线程**池生成位图。

生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给`合成线程`。

### 7.4 显示器显示内容

栅格化操作完成后，**合成线程**会生成一个绘制命令，即 "DrawQuad"，并发送给浏览器进程。

浏览器进程中的 `viz组件` 接收到这个命令，根据这个命令，把页面内容绘制到内存，也就是生成了页面，然后把这部分内存发送给显卡。为什么发给显卡呢？我想有必要先聊一聊显示器显示图像的原理。

无论是 PC 显示器还是手机屏幕，都有一个固定的刷新频率，一般是 60 HZ，即 60 帧，也就是一秒更新 60 张图片，一张图片停留的时间约为 16.7 ms。而每次更新的图片都来自显卡的**前缓冲区**。而显卡接收到浏览器进程传来的页面后，会合成相应的图像，并将图像保存到**后缓冲区**，然后系统自动将前缓冲区和后缓冲区对换位置，如此循环更新。

看到这里你也就是明白，当某个动画大量占用内存的时候，浏览器生成图像的时候会变慢，图像传送给显卡就会不及时，而显示器还是以不变的频率刷新，因此会出现卡顿，也就是明显的掉帧现象。

### 7.5 总结

到这里，我们算是把整个过程给走通了，现在重新来梳理一下页面渲染的流程。

<img src="/img/browsers/输入URL到页面呈现过程.png">
