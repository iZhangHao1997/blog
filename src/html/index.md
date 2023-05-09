# HTML 高频问答

## 1. HTML、XML、XHTML 的区别

- `HTML`：超文本标记语言，是语法较为松散，不严格的 `web` 语言
- `XML`：可扩展的标记语言，主要用于存储数据和解构，可扩展
- `XHTML`：可扩展的超文本标记语言，基于 `XML`，作用与 `HTML` 类似，但语法更严格

## 2. 什么是 HTML5？和 HTML 的区别是什么？

`HTML5` 是 `HTML` 的新标准，其主要目标是无需任何额外的插件，如 `flash`、`silverlight` 等，就可以传输内容。它囊括了动画、视频、丰富的图形用户界面等。

`HTML5` 是由万维网联盟 `W3C` 和 `Web Hypertext Application Technology Working Group` 合作创建的 `HTML` 新版本

**区别：**

- 从文档声明类型上看

  - `HTML` 是很长的一段代码，很难记住。如下代码：

  ```html
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" " http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml"></html>
  ```

  - `HTML5` 却只有简简单单的声明，方便记忆。如下：

  ```html
  <!DOCTYPE html>
  ```

- 从语义解构上看
  - `HTML4.0`：没有体现解构语义化标签，通常都是这样来命名的 `<div id="header"></div>`
  - `HTML`：在语义上却有很大的优势。提供了一些新的标签，比如：`<header><article><footer>`

拓展： 不输入 `<!DOCTYPE HTML>`，浏览器将无法识别 `html` 文件，因此 `html` 将无法正常工作。

## 3. HTML、XHTML 和 HTML5 区别以及有什么联系？

**XHTML 与 HTML 的区别：**

- `XHTML` 标签名必须小写；
- `XHTML` 元素必须被关闭；
- `XHTML` 元素必须被正确的嵌套；
- `XHTML` 元素必须要有根元素。

**XHTML 与 HTML5 的区别：**

- HTML5 新增了 `canvas` 绘画元素；
- HTML5 新增了用于绘媒介回放的 `video` 和 `audio` 元素；
- 更具语义化的标签，便于浏览器识别；
- 对本地离线存储有更好的支持；
- `MATHML`，`SVG`等，可以更好的 `render`；
- 添加了新的表单控件：`calendar`、`date`、`time`、`email` 等。

**HTML、XHTML、HTML5 之间的联系**

- `XHTML` 是 `HTML` 规范版本
- `HTML5` 是 `HTML`、`XHTML` 以及 `HTML DOM` 的新标准

## 4. HTML5 为什么只写 !DOCTYPE html？

HTML 4.01 是基于 SGML（标准通用标记语言），需要对 DTD 进行引用，H5 并不基于 SGML，只需告知游览器文档类型即可。

**注：**DTD（文档类型定义）的作用是定义 XML 文档的合法构建模块。

DTD 可被成行地声明于 XML 文档中，也可作为一个外部引用。

DOCTYPE 俗称文档类型，是对标记语言的文档的声明，它的目的是告诉标准的通用标记语言解析器，用什么样的文档类型定义（DTD）来解析文档。而 html5 则是兼容了全部的文档类型

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>
```

声明了文档的根元素是 html，它在公共标识符被定义为 "-//W3C//DTD XHTML 1.0 Transitional//EN" 的 DTD 中进行了定义。浏览器将明白如何寻找匹配此公共标识符的 DTD。如果找不到，浏览器将使用公共标识符后面的 URL 作为寻找 DTD 的位置。

另外，需要知道的是，HTML 4.01 规定的三种文档类型、XHTML 1.0 规定的三种 XML 文档类型都是：Strict、Transitional 以及 Frameset。
