# CSS

## 1. 标准的盒模型和低版本的 IE 盒子模型的区别？

元素都是按照和模型的规则布局在页面中的，由 `margin`、`border`、`padding` 和 `content` 四个属性组成，分为 W3C 标准和模型和 IE 和模型

**W3C 标准盒模型：**
盒子总宽度/高度 = `width/height + padding + border + margin`。（ 即 width/height 只是内容高度，不包含 padding 和 border 值 ）

**IE 盒子模型：**
盒子总宽度/高度 = `width/height + margin = (内容区宽度/高度 + padding + border) + margin`。（ 即 width/height 包含了 padding 和 border 值 ）

**相互转换：**
通过设置 CSS3 的 `box-sizing` 属性来转换：

- `box-sizing: content-box` 是 W3C 标准和模型
- `box-sizing: border-box` 是 IE 盒子模型

## 2. 水平垂直居中的方法有哪些？

<img src="/assets/img/css/水平垂直居中方案.png" />

假设 HTML 代码：

```html
<div class="outer">
  <div class="inner"></div>
</div>
```

### 方法一：flex，inner 宽高未知

```css
.outer {
  display: flex;
  jutify-content: center;
  align-items: center;
}
```

### 方法二：position + transform，inner 高度未知

```css
.outer {
  position: relative;
}
.inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

### 方法三：position + 负 margin，inner 宽高已知

```css
.outer {
  position: relative;
}

.inner {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
}
```

### 方法四：设置各个方向的距离都是 0，再将 margin 设置为 auto，前提是 inner 宽高已知

```css
.outer {
  position: relative;
}
.inner {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
```

## 3. 未知宽度的元素如何实现水平垂直居中？

### 方法一：通过绝对定位和 transform 来实现

```css
.outer {
  position: relative;
}
.inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

### 方法二：利用 flex 布局

```css
.outer {
  background-color: pink;
  width: 100%;
  height: 500px;
  /* flex 布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 方法三：父元素 display: table，子元素 display: cell-table

```css
.outer {
  width: 1200px;
  height: 500px;
  display: table;
}
.inner {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

### 方法四：利用伪类

```css
.outer {
  text-align: center;
}
.inner {
  display: inline-block;
}
.outer:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
```

## 4. 如何实现三栏布局？

### 方法一：flex 布局

```html
<style>
  .container {
    display: flex;
  }
  .left {
    flex-basis: 200px;
    background: green;
  }
  .main {
    flex: 1;
    background: red;
  }
  .right {
    flex-basis: 200px;
    background: green;
  }
</style>

<div class="container">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>
```

### 方法二：position + margin

```html
<style>
  body,
  html {
    padding: 0;
    margin: 0;
  }
  .left,
  .right {
    position: absolute;
    top: 0;
    background: red;
  }
  .left {
    left: 0;
    width: 200px;
  }
  .right {
    right: 0;
    width: 200px;
  }
  .main {
    margin: 0 200px;
    background: green;
  }
</style>

<div class="container">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="main">main</div>
</div>
```

### 方法三： float + margin

```html
<style>
  body,
  html {
    padding: 0;
    margin: 0;
  }
  .left {
    width: 150px;
    float: left;
  }
  .right {
    width: 150px;
    float: right;
  }
  .main {
    margin: 0 150px;
  }
</style>
<body>
  <div>
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
  </div>
</body>
```

## 5. CSS 权重计算公式

CSS 基本选择器包括 ID 选择器、类选择器、标签选择器、通配符选择器。正常情况下都能答出：`!important > 行内样式 > ID 选择器 > 类选择器 > 标签选择器 > 通配符选择器`。

1. **!important**，加在样式属性值后，权重值为 10000
2. **内联样式**，如：`style=””`，权重值为 1000
3. **ID 选择器**，如：`#content`，权重值为 100
4. **类**，**伪类**和**属性选择器**，如：`content`、`:hover` 权重值为 10
5. **标签选择器**和**伪元素选择器**，如：`div`、`p`、`:before` 权重值为 1
6. **通用选择器（\*）**、**子选择器（>）**、**相邻选择器（+）**、**同胞选择器（~）**、权重值为 0

## 6. 清除浮动的方法有哪些？

### 方法一：after 伪类

清除浮动主要是为了防止父元素塌陷。清除浮动的方法有很多，常用的是 `after` 伪类。

```html
<head>
  <style>
    body, html {
      margin: 0;
      padding: 0;
    }
    .float {
      width: 150px;
      height: 200px;
      float: left;
      background-color: rgb(78, 69, 69);
    }
    .clearfix:after {
      content: "";
      display: block;
      clear: both;
      height: 0;
      visibility: hidden;
    }
  </style>
</head>
<body>
  <div class="clearfix">
    <div class="float"></div>
  </div>
</body>
</html>
```

### 方法二：clear: both

```html
<head>
  <style>
    body, html {
      margin: 0;
      padding: 0;
    }
    .float {
      width: 150px;
      height: 200px;
      float: left;
      background-color: rgb(78, 69, 69);
    }
    .clear {
      clear: both;
    }
  </style>
</head>
<body>
  <div>
    <div class="float"></div>
  </div>
  <div class="clear">
    123
  </div>
</body>
</html>
```

### （容易忘！！）方法三：触发父盒子 BFC，overflow: hidden

```html
<head>
  <style>
    body, html {
      margin: 0;
      padding: 0;
    }
    .float {
      width: 150px;
      height: 200px;
      float: left;
      background-color: rgb(78, 69, 69);
    }
    .clearfix {
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="clearfix">
    <div class="float"></div>
  </div>
  <div>123</div>
</body>
</html>
```

## 7. 使用 display inlineblock 会产生什么问题？怎么解决？

连续两个元素使用 `display: inline-block` 时，两个元素中会产生一段空白。

**产生空白的原因：**
元素被当成行内元素排版的时候，元素之间的空白符（空格、回车换行等）都会被浏览器处理，根据 CSS 中 white-space 属性的处理方式（默认是 normal，合并多余空白），原来 **HTML 代码中的回车换行被转成一个空白符**，在字体不为 0 的情况下，空白符占据一定宽度，所以 `inline-block` 的元素之间就出现了空隙。

**解决办法：**

1. 将子标签的结束符和下一个标签的开始符写在同一行：

```html
<div class="div1">
  <!-- content -->
</div>
<div class="div2">
  <!-- content -->
</div>
```

2. 将两个标签之间的空隙使用注释符号连接：

```html
<div class="div1"></div>
<!--
-->
<div class="div2"></div>
```

3. 将父元素的 font-size 设置为 0，再在子元素重设 font-size

## 8. position 有哪些属性？

`position` 的属性有：

- `absolute`：绝对定位，相对于 `static` 定位以外的第一个父元素进行定位
- `relative`：相对定位，相对于自身正常未知进行定位
- `fixed`：固定定位，相对于游览器窗口进行定位，且不随滚动条滚动
- `static`：默认值，没有定位，元素出现在正常的流中
- `inherit`：从父元素继承 `position` 属性的值

## 9. 如何用 CSS 实现一个三角形？

### 方法一：利用 border 属性

利用盒模型的 `border` 属性上下作用边框交界处会呈现出平滑的的斜线这个特点，设置上下左右边框宽度或者颜色就可以得到三角形或者梯形。

```css
.traiangle {
  height: 0;
  width: 0;
  border-style: solid;
  border-color: red blue green pink;
  border-width: 30px;
}
```

<img src="/assets/img/css/border实现三角形.png">

想获得其中任意一个三角形，则设置其他方向上的 `border-color` 为 `transparent` 透明就可以了。

### 方法二：利用 CSS3 的 clip-path 属性

```css
.triangle {
  width: 30px;
  height: 30px;
  background-color: red;
  clip-path: polygon(0px 0px, 0px 30px, 30px 0px); // 将坐标(0,0),(0,30),(30,0)连成一个三角形
  transform: rotate(225deg);transformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransformtransform // 旋转225，变成下三角
}
```

## 10. 行内元素和块元素有哪些？有什么区别？

行内元素：

- span
- a
- br
- img
- strong
- em
- input
- textare
- select

块级元素：

- div
- p
- h1 - h6
- hr
- address
- blockquote
- ul
- li
- ol
- table
- form

区别：

1. 行内元素不会独占一行，直到一行排不下才会换行；块级元素独占一行
1. 行内元素不能设置宽高；块级元素可以设置宽高
1. 行内元素不能设置垂直方向的 `margin`、`padding`；块级元素可以

## 11. H5 新增的标签有哪些？为什么要增强语义化？

- 结构标签：
  1. section：独立内容区块，可以用 h1-h6 组成大纲，表示文档结构，也可以有章节、页眉、页脚或页眉的其他部分；
  1. article：特殊独立区块，表示这篇页眉中的核心内容；
  1. aside：标签内容之外与标签内容相关的辅助信息；
  1. header：某个区块的头部信息/标题；
  1. hgroup：头部信息/标题的补充内容；
  1. footer：底部信息；
  1. nav：导航条部分信息
  1. figure：独立的单元，例如某个有图片与内容的新闻块。
- 表单标签：
  1. email：必须输入邮件；
  1. url：必须输入 url 地址；
  1. number：必须输入数值；
  1. range：必须输入一定范围内的数值；
  1. Date Pickers：日期选择器
  1. search：搜索常规的文本域；
  1. color：颜色；
- 媒体标签
  1. video：视频
  1. audio：音频
  1. embed：嵌入内容
- canvas 新元素
  1. canvas：图形图像

为什么要增强语义化：

1. 便于团队开发和维护，语义化的 HTML 可以让开发者更容易的看明白，从而提高团队的效率和协调能力
1. 不用看 CSS 也能清晰看出网页的结构，增加可读性
1. 搜索引擎会利用爬虫分析抓取网页结构内容
1. 不会在样式不加载不正常的时候一团乱，维持基本结构。利于部分残障人士页面阅读器解析。

## 12. BFC

### 1. 什么是 BFC？

W3C 对 BFC 的定义如下：浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-block、table-cell 和 table-captions），以及 overflow 值不为 `visible` 的块级盒子，都会为他们的内容创建新的 BFC（Block Fromatting Context），即块级格式上下文。

### 2. 触发条件

一个 HTML 元素要创建 BFC，则要满足下列任意一个或多个条件即可：下列方式会创建格式化上下文：

- 根元素
- 浮动元素（元素的 float 不为 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML 表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 display 为 table、table-row、table-row-group、table-header-group、table-footer-group、（分别是 HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素、弹性元素（display 为 flex、inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）等等

### 3. BFC 渲染规则

1. BFC 垂直方向边距重叠
1. BFC 的区域不会与浮动元素的 BOX 重叠
1. BFC 是一个独立的容器，外面的元素不会影响里面的元素
1. 计算 BFC 高度的时候浮动元素也会参与计算

### 4. 应用场景

**防止浮动导致父元素高度塌陷**

现有如下页面代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      .container {
        border: 10px solid red;
      }
      .inner {
        background: #08bdeb;
        height: 100px;
        width: 100px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

<img src="/assets/img/css/BFC防止父元素高度塌陷.png">

接下来将 inner 元素设为浮动：

```css
.inner {
  float: left;
  background: #08bdeb;
  height: 100px;
  width: 100px;
}
```

会产生这样的塌陷效果：

<img src="/assets/img/css/父元素高度塌陷.png">

但是如果我们对父元素设置 BFC 之后，这样的问题就解决了：

```css
.container {
  border: 10px solid red;
  overflow: hidden;
}
```

**避免外边距折叠**

两块同一个 BFC 会造成外边距折叠，但是如果对两块分别设置 BFC，那么边距重叠的问题就不存在了。

现在有如下代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      .container {
        background-color: green;
        overflow: hidden;
      }

      .inner {
        background-color: lightblue;
        margin: 10px 0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="inner">1</div>
      <div class="inner">2</div>
      <div class="inner">3</div>
    </div>
  </body>
</html>
```

<img src="/assets/img/css/同一个BFC子元素垂直方向边距重叠.png">

此时三个元素的上下间隔都是 10px, 因为三个元素同属于一个 BFC。 现在我们做如下操作:

```html
<div class="container">
  <div class="inner">1</div>
  <div class="bfc">
    <div class="inner">2</div>
  </div>
  <div class="inner">3</div>
</div>
```

style 增加：

```css
.bfc {
  overflow: hidden;
}
```

效果如下：
<img src="/assets/img/css/BFC消除边距重叠问题.png">

可以明显地看到间隔变大了，而且是原来的两倍，符合我们的预期。

参考资料：[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

## 13. 如何实现一栏固定，一栏自适应的双栏布局？

### 方法一：采用 flex 布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
      }
      .container {
        display: flex;
      }
      .left {
        flex: 0 0 150px;
        height: 700px;
        background-color: pink;
      }
      .main {
        background-color: purple;
        height: 1000px;
        flex: 1;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left"></div>
      <div class="main"></div>
    </div>
  </body>
</html>
```

### 方法二：采用 float + margin

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
      }
      .container {
      }
      .left {
        width: 150px;
        height: 700px;
        background-color: pink;
        float: left;
      }
      .main {
        background-color: purple;
        height: 1000px;
        margin-left: 150px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left"></div>
      <div class="main"></div>
    </div>
  </body>
</html>
```

### 方法三：采用 float + overflow

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
      }
      .container {
      }
      .left {
        width: 150px;
        height: 700px;
        background-color: pink;
        float: left;
      }
      .main {
        background-color: purple;
        height: 1000px;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left"></div>
      <div class="main"></div>
    </div>
  </body>
</html>
```

### 方法四：采用 float + position

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
      }
      .container {
        position: relative;
      }
      .left {
        width: 150px;
        height: 700px;
        background-color: pink;
        float: left;
      }
      .main {
        background-color: purple;
        height: 1000px;
        position: absolute;
        left: 150px;
        right: 0;
        top: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left"></div>
      <div class="main"></div>
    </div>
  </body>
</html>
```

## 14. CSS 有哪些选择器？

[CSS 选择器包含例子详解](https://juejin.im/post/5eaf64276fb9a0435749c23a)

样式优先级：`!important` > 行内样式 > ID 选择器 > 类、伪类、属性 > 元素、伪元素 > 通配符

### 通配符选择器

```css
* {
  margin: 0;
  padding: 0;
}
```

### 标签（元素）选择器

```css
body,
html {
  margin: 0;
  padding: 0;
}
```

### ID 选择器

```css
#app {
  font-size: 14px;
}
```

### 类选择器

```css
.app {
  font-size: 14px;
}
```

### 属性选择器

1. 用于选取带有指定属性的元素

```css
[someAttr] {
  color: red;
}
```

2. 用于选取带有指定属性和值的元素。

```css
[someAttr="value"] {
  color: red;
}
```

3. 用于选取属性值中包含指定词汇的元素。

```css
[someAttr~="value"] {
  color: red;
}
```

4. 匹配属性值以指定值开头的每个元素。

```css
[someAttr^="value"] {
  color: red;
}
```

5. 匹配属性值以指定值结尾的每个元素。

```css
[someAttr$="value"] {
  color: red;
}
```

6. 匹配属性值中包含指定值的每个元素。

```css
[someAttr*="value"] {
  color: red;
}
```

7. 用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。

```css
[someAttr|="value"] {
  color: red;
}
```

### 文档结构选择器

1. 后代选择器 element element
   选择 element 元素后的所有 element 元素

```css
div p {
}
```

选择 `div` 后的所有 `p` 元素。

2. 子选择器 element>element
   选择父元素为 element 的所有 element 子元素

```css
ul > li {
  color: red;
}
```

ul -> div -> li 就不会生效。

3. 相邻兄弟选择器 element+element
   选择紧挨在 element 元素之后的 element 元素（一个）

```css
h1 + p {
  color: red;
}
```

h1 -> p -> p 第二个 `p` 并不会生效

4. 一般兄弟选择器 element1~element2
   选择前面有 `element1` 的每个 `element2` 元素

```css
h1 ~ p {
  color: red;
}
```

h1 -> p -> p 中两个 `p` 都会生效

## 15. CSS 伪类和伪元素

### 1. 伪类

**MDN 定义：** CSS 伪类是添加到选择器的关键字，指定要选择的元素的特殊状态。比如，`:hover` 可用于在用户将鼠标悬停在按钮上时改变按钮的颜色。

```css
/* 所有用户指针悬停的按钮 */
button:hover {
  color: blue;
}
```

伪类连同伪元素一起，他们允许你不仅仅是根据文档 DOM 树中的内容对元素应用样式，而且还允许你根据诸如导航历史这样的外部因素来应用样式（例如 `:visited`）,同样的，可以根据内容的状态（例如在一些表单元素上的 `:checked`），或者鼠标的位置（例如 `v:hover`让你知道是否鼠标在一个元素上悬浮）来应用样式。

- `:active` 匹配被用户激活的元素，如点击
- `:blank` 匹配空的 inpurt
- `:checked` 匹配被选中的 radio 或者 checkbox
- `:disabled` 匹配处于不可用状元的可交互元素
- `:empty` 匹配没有自元素的元素
- `:enabled` 匹配处于可用状态的交互元素
- `:first-child` 匹配在一组**兄弟元素**中的第一个元素
- `:last-child` 匹配在一组兄弟元素中最后一个元素
- `:first-of-type` 匹配一组**兄弟元素**中其类型的第一个元素
- `:last-of-type` 匹配一组兄弟元素中其类型的最后一个元素
- `:focus` 匹配获取焦点的元素
- `:lang` 根据文档语言匹配元素
- `:invalid` 匹配处于不合法状态的元素，比如 `<input>` 正则校验不通过
- `:link` 匹配没有被访问过的链接
- `:is` 匹配符合结果的元素，例子：

  ```html
  /* 选择header, main, footer里的任意一个悬浮状态的段落(p标签) */ :is(header,
  main, footer) p:hover { color: red; cursor: pointer; } /*
  以上内容相当于以下内容 */ header p:hover, main p:hover, footer p:hover {
  color: red; cursor: pointer; }
  ```

- `:not` 匹配符合结果之外的元素
- `:valid` 匹配内容验证正确的 `<input>` 或者其他 `<form>` 元素。这能简单地将校验字段展示为一种能让用户辨别出其输入数据的正确性的样式。
- `:target` 匹配一个唯一的页面元素(目标元素)，其 id 与当前 URL 片段匹配，如下，可以

  ```html
  <style>
    p:target {
      background-color: gold;
    }

    /* 在目标元素中增加一个伪元素 */
    p:target::before {
      font: 70% sans-serif;
      content: "►";
      color: limegreen;
      margin-right: 0.25em;
    }

    /* 在目标元素中使用 italic 样式 */
    p:target i {
      color: red;
    }
  </style>

  <h3>Table of Contents</h3>
  <ol>
    <li><a href="#p1">Jump to the first paragraph!</a></li>
    <li><a href="#p2">Jump to the second paragraph!</a></li>
    <li>
      <a href="#nowhere"
        >This link goes nowhere, because the target doesn't exist.</a
      >
    </li>
  </ol>

  <h3>My Fun Article</h3>
  <p id="p1">
    You can target <i>this paragraph</i> using a URL fragment. Click on the link
    above to try out!
  </p>
  <p id="p2">
    This is <i>another paragraph</i>, also accessible from the links above.
    Isn't that delightful?
  </p>
  ```

- `:visited` 匹配被访问过的元素
- `:nth-child(n)` 首先找到所有当前元素的兄弟元素，然后按照位置先后顺序从 1 开始排序，选择的结果为 CSS 伪类:nth-child 括号中表达式（an+b）匹配到的元素集合（n=0，1，2，3...）。示例：

  - `0n+3` 或简单的 `3` 匹配第三个元素。
  - `1n+0` 或简单的 `n` 匹配每个元素。（兼容性提醒：在 Android 浏览器 4.3 以下的版本 `n` 和 `1n` 的匹配方式不一致。`1n` 和 `1n+0` 是一致的，可根据喜好任选其一来使用。）
  - `2n+0` 或简单的 `2n` 匹配位置为 2、4、6、8...的元素（n=0 时，2n+0=0，第 0 个元素不存在，因为是从 1 开始排序)。你可以使用关键字 `even` 来替换此表达式。
  - `2n+1` 匹配位置为 1、3、5、7...的元素。你可以使用关键字 `odd` 来替换此表达式。
  - `3n+4` 匹配位置为 4、7、10、13...的元素。

  `a` 和 `b` 都必须为整数，并且元素的第一个子元素的下标为 1。换言之就是，该伪类匹配所有下标在集合 { an + b; n = 0, 1, 2, ...} 中的子元素。另外需要特别注意的是，`an` 必须写在 `b` 的前面，不能写成 `b+an` 的形式。

- `:nth-of-type(n)` 匹配父元素的某种类型元素中的第 n 个子元素。n 可以是一个数字、一个关键字或一个公式
- `:nth-last-child(n)` 与 `:nth-child` 类似，从后往前数
- `:nth-last-of-type(n)` 与 `:nth-of-type` 类似，从后往前数
- `:only-child` 匹配没有兄弟元素的（only-child 有独生子的意思）元素
- `:only-tyle` 匹配了任意一个元素，这个元素没有其他相同类型的兄弟元素。例如：

  ```css
  main :only-of-type {
    color: red;
  }
  ```

  ```html
  <main>
    <div>I am `div` #1.</div>
    <p>I am the only `p` among my siblings.</p>
    <div>I am `div` #2.</div>
    <div>
      I am `div` #3.
      <i>I am the only `i` child.</i>
      <em>I am `em` #1.</em>
      <em>I am `em` #2.</em>
    </div>
  </main>
  ```

  这里 **I am the only `p` among my siblings.** 和 **I am the only `i` child.** 会显示红色

- `:required` 匹配必填的表单元素
- `:root` 匹配根元素

### 2. 伪元素

- `::before` 创建一个伪元素，其将成为匹配选中的元素的第一个子元素。常通过 `content` 属性来为一个元素添加修饰性的内容。此元素默认为行内元素。
- `::after` 用来创建一个伪元素，作为已选中元素的最后一个子元素。通常会配合 `content` 属性来为该元素添加装饰内容。这个虚拟元素默认是行内元素。
- `::first-letter` 匹配元素的第一个字母
- `::first-line` 匹配元素的第一行
- `::selection` 匹配被选中的文本或者区域

## 16. mutationObserver 和 resizeObserver

通常我们需要监听某个 dom 元素的（尺寸等）变化，首先我们会想到的是 `resize` 事件，但是只有 `window` 有 `resize` 事件，那么普通的 dom 元素如何监听他尺寸的改变呢？这里有两个办法：`mutationObserver` 和 `resizeObserver`。

`resizeObserver` 用法比较简单，先讲 `resizeObserver`。

### 16.1 resizeObserer

`resizeObserver` 是用于检测 DOM 元素或者节点发生变化，解决过去只能通过 `window` 对象的 `resize` 事件实现，但也有很大的局限性，比如 DOM 元素的尺寸变化，有时候窗体的尺寸没有变化也会触发。还有的时候窗体的尺寸变化了，但是 DOM 元素的尺寸并没有变化，window 对象上绑定的 resize 事件就有些浪费。

由于以上一些原因，一个全新的 API 就出来了，就是 ResizeObserver 对象，专门用来观察 DOM 元素的尺寸是否发生了变化。

**注意：** 尺寸的变化指的是元素的 `contentBox`，即 `padding`、`margin` 和 `border` 的变化不会触发 `resizeObserve` 回调的。

#### 兼容性

<img src="/assets/img/css/resizeObserver兼容性.png" />

IE11+ 支持，其他主流游览器也支持，兼容性还不错。

#### 语法

```js
const tableContainer = document.querySelector(".table-container");

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { contentRect } = entry;
    console.log(`Element: ${contentRect}`);
    console.log(
      `Element size: ${contentRect.width}px * ${contentRect.height}px`
    );
    console.log(
      `Element padding: ${contentRect.top}px ; ${contentRect.left}px`
    );
  });
});

// 观察一个或多个元素
resizeObserver.observe(tableContainer);
```

此时我们在控制台会看到类似下图的结果：

<img src="/assets/img/css/resizeObserver控制台输出.png" />

#### contentRect 是什么

`entry.contentRect` 返回的是一个 `DOMRect` 对象，其属性包括：

```js
{
  x: 0;
  y: 0;
  width: 296;
  height: 100;
  top: 0;
  right: 296;
  bottom: 100;
  left: 0;
}
```

如果我们给 DOM 元素设置 `padding: 10px`，则宽高都会变小，同时 `left` 和 `top` 属性变成了 `10`。

```js
{
  x: 10;
  y: 10;
  width: 276;
  height: 80;
  top: 10;
  right: 296;
  bottom: 100;
  left: 10;
}
```

### 16.2 mutationObserver

`mutationObserver` 翻译过来就是变动观察期。该接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

#### 兼容性

<img src="/assets/img/css/mutationObserver兼容性.png" />

可见 `mutationObserver` 兼容性比 `resizeObserver` 好，主流游览器中除了 IE11 以下都支持。

#### 语法

`mutationObserver` 是一个构造函数，创建并返回一个 `MutationObserver`，它会在指定的 DOM 发生变化时调用。

DOM 规范中的 `MutationObserver()` 构造函数——是 `MutationObserver` 接口内容的一部分——创建并返回一个新的观察器，它会在触发指定 DOM 事件时，调用指定的回调函数。`MutationObserver` 对 DOM 的观察不会立即启动；而必须先调用 `observe()` 方法来确定，要监听哪一部分的 DOM 以及要响应哪些更改。

```js
var observer = new MutationObserver(callback);
```

**参数：** `callback`：一个回调函数，每当指定的节点或子树以及配置项有 DOM 变动时会被调用。回调函数拥有两个参数：一个是描述所有被触发改动的 `MutationRecord` 对象数组，另一个是调用该函数的 `MutationObserver` 对象。

**返回值：** 一个新的、包含监听 DOM 变化回调函数的 `MutationObserver` 对象。

`MutationObserver` 有以下方法：

- `disconnect()` 阻止 `MutationObserver` 实例继续接受通知，知道再次调用其 `observe()` 方法，该观察者对象包含的回调函数都不会再被调用。
- `observe()` 配置 `MutationObserver` 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
- `takeRecords()` 从 `MutationObserver` 的通知队列中删除所有待处理的通知，并将它们返回到 `MutationRecord` 对象的新 Array 中。

#### 示例 demo

```js
// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
// 观察目标子节点的变化，是否有添加或者删除
// 观察属性变动
// 观察后代节点，默认为 false
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

关于 `observe` 方法中 `options` 参数有以下几个选项：

1. `childList`：观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化。
1. `attributes`：观察目标属性的变化。
1. `charaterData`：观察目标数据的变化
1. `subtree`：目标以及目标的后代改变都会观察。
1. `attributeOldValue`：如果属性为 `true` 或者省略，则相当于 `true`，表示需要记录改变当前的目标属性值，设置了 `attributeOldValue` `可以省略attributes` 设置。
1. `characterDataOldValue`：如果 `characterData` 为 `true` 或省略，则相当于设置为 ` true``，表示需要记录改变之前的目标数据，设置了characterDataOldValue ` 可以省略 `characterData` 设置
1. `ttributeFilter`：如果不是所有的属性改变都需要被观察，并且 `attributes` 设置为 `true` 或者被忽略，那么设置一个需要观察的属性本地名称（不需要命名空间）的列表

## 17 MDN CSS 属性值定义语法总结

### 组合符号

|  符号  |     名称     |                 描述                 |                          实例                          |
| :----: | :----------: | :----------------------------------: | :----------------------------------------------------: |
|        |     并置     |     各部分必须出现且按照顺序出现     |                    `solid <length>`                    |
|  `&&`  |  “与”组合符  |   各部分必须出现，但可以不用按顺序   |                 `<ltngth> && <string>`                 |
| `\|\|` |  "或"组合符  | 各部分至少出现一个，但可以不用按顺序 | `<'border-image-outset'>  \|\| <'border-image-slice'>` |
|  `\|`  | "互斥"组合符 |      有且只能出现各部分中的一个      |    `smaller  \| small \| normal  \| big \| bigger`     |
|  `[]`  |    方括号    | 强调优先级（类似于代码中的括号`()`） |              `bold [ thin && <length> ]`               |

### 数量符号

|  符号   |     名称     |                 描述                 |         实例          |
| :-----: | :----------: | :----------------------------------: | :-------------------: |
|         | 没有数量符号 |               恰好一次               |        `solid`        |
|   \*    |     星号     |           零次、一次或多次           |    `bold smaller*`    |
|    +    |     加号     |              一次或多次              |    `bold smaller+`    |
|    ?    |     问号     |         零次或一次（即可选）         |    `bold smaller?`    |
| `{A,B}` |    大括号    |         至少 A 次，至多 B 次         |  `bold smaller{1,3}`  |
|    #    |     井号     | 一次或多次，但多次出现必须以逗号分隔 |    `bold smaller#`    |
|    !    |     叹号     |           组必须产生一个值           | `[ bold? smaller? ]!` |
