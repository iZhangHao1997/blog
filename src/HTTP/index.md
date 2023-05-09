# HTTP 网络通信和游览器相关知识

## 1. GET 和 POST 有什么区别？

1. `GET` 使用 URL/COOKIE 传参，`POST` 使用 BODY 传参
1. `GET` 因为使用 URL 传参，所以参数长度有限制；`POST` 参数长度没有限制
1. `POST` 比 `GET` 安全，因为数据不可见
1. `GET` 请求参数会被完整保留在浏览器历史记录里，而 `POST` 中的参数不会被保留
1. `GET` 请求只能进行 url 编码，而 `POST` 支持多种编码方式
1. `GET` 请求会被游览器默认缓存，`POST` 不会除非手动设置

## 2. 跨域是什么？怎么解决跨域资源共享？

跨域全称 Cross-origin resource sharing——跨域资源共享。

因为游览器同源策略，限制不得向**协议**、**域名**、**端口**不同网址发送请求，所以跨域就是允许向跨源服务器发起请求。

### 1. 两种请求

游览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两个条件，就是简单请求：

1. 请求方法是以下三个方法之一

- HEAD
- GET
- POST

2. HTTP 头信息不超出以下几种字段

- Accept
- Accept-Language
- Content-language
- Last-Event-ID
- Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

就是为了兼容表单（form），因为历史上表单一只可以发出跨域请求。AJAX 的跨域设计就是，只要表单可以发，AJAX 就可以直接发。

凡是不同时满足上面两个条件的，就属于非简单请求。

游览器对这两种请求的处理，是不一样的。

### 2. 简单请求

#### 2.1 基本流程

对于简单请求，游览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。

下面就是一个例子，游览器发现这次跨源 AJAX 请求是简单请求，就自动在头信息种添加一个 `Origin` 字段。

```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面的头信息中，`Origin` 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果 `Origin` 指定的源，不在服务器允许范围之内，服务器会返回一个正常的 HTTP 回应。游览器会发现回应的头信息没有包含 `Access-Control-Allow-Origin` 字段（详见下文），就直到出错了，从而抛出一个错误，然后被回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 返回的状态码可能是 200。

如果 `Origin` 指定的域名在许可范围之内，服务器返回的响应，会多出几个信息头字段。

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

以上的头信息种，三个都以 `Access-Control-` 开头。

1. Access-Control-Allow-Origin
   该字段是必须的，它的值要么是请求时 `Origin` 字段的值，要么是一个 `*`，表示接收任意域名的请求。
1. Access-Control-Allow-Credentials
   该字段是可选的。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为 `true`，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也能为 `true`，如果服务器不允许游览器发送 Cookie，删除该字段即可。
1. Access-Control-Expose-Headers
   该字段可选。CORS 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。上面的例子指定，`getResponseHeader('FooBar')` 可以返回 `FooBar` 字段的值。

#### 2.2 withCredentials 属性

上面说到，CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发到服务器，一方面要服务器同意，指定 `Access-Control-Allow-Credentials` 字段。

```
Access-Control-Allow-Credentials: true
```

另一方面，开发者必须在 AJAX 请求中打开 `withCredentials` 属性。

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

但是，如果省略 `withCredentials` 设置，有的浏览器还是会一起发送 Cookie。这时，可以显式关闭 `withCredentials。`

```js
xhr.withCredentials = false;
```

需要注意的是，如果要发送 Cookie，`Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie。

### 3. 非简单请求

除了简单请求就是非简单请求。

#### 3.1 预检请求

非简单请求是对服务器有特殊要求的请求，比如请求方式是 `PUT` 或 `DELETE`，或者 `Content-type` 字段类型是 `application/json`。

非简单请求的 CORS 请求，会在通知通信之前，增加一次 HTTP 查询请求，称为“预检”请求（prefilght）。

游览器会先访问服务器，当前的网页所在域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定的答复才会正式发送 HTTP 请求，否则就报错。

比如下面一段 JS 脚本：

```js
const url = "http://api.alice.com/cors";
const xhr = new XMLHttpRequest();
xhr.open("PUT", url, true);
xhr.setRequestHeader("X-Custom-Header", "value");
xhr.send();
```

上面代码中，HTTP 请求的方法是 `PUT`，并且发送一个自定义头信息 `X-Custom-Header`。

游览器发现这是一个非简单请求，就会自动发出一个预检请求，要求服务器确认可以这样请求。下面是这个“预检”请求的 HTTP 头信息。

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

"预检"请求用的请求方法是 `OPTIONS` ，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin`，表示请求来自哪个源。

除了 `Origin` 字段，"预检"请求的头信息包括两个特殊字段。

1. Access-Control-Request-Method
   该字段是必须的，用来列出游览器的 CORS 请求会用到哪些 HTTP 方法，上例是 `PUT`
1. Access-Control-Request-Headers
   该字段是一个逗号分隔的字符串，指定游览器 CORS 请求会额外发送的头信息字段，上例是 `X-Custom-Header`

#### 3.2 预检请求的回应

服务器收到"预检"请求以后，检查了 `Origin`、`Access-Control-Request-Method` 和 `Access-Control-Request-Headers` 字段以后，确认允许跨源请求，就可以做出回应。

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

上面 HTTP 回应中，关键是 `Access-Control-Allow-Origin` 字段，表示该域名可以请求数据。该字段也可以设置为星号，表示同意任意跨源请求。

```
Access-Control-Allow-Origin: *
```

如果服务器否定了"预检"请求，会返回一个正常的 HTTP 回应，但是没有任何 CORS 相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 `XMLHttpRequest` 对象的 `onerror` 回调函数捕获。控制台会打印出如下的报错信息。

```
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```

服务器回应的其他 CORS 相关字段如下。

```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: token、Content-Type
Access-Control-Allow-Credentrials: true
Access-Control-Max-Age: 1728000
```

1. Access-Control-Allow-Methods
   该字段必须，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
1. Access-Control-Allow-Headers
   如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
1. Access-Control-Allow-Credentrials
   该字段与简单请求时的含义相同。
1. Access-Control-Max-Age
   该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是 20 天（1728000 秒），即允许缓存该条回应 1728000 秒（即 20 天），在此期间，不用发出另一条预检请求。

#### 3.3 游览器的正常请求和回应

一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 Origin 头信息字段。服务器的回应，也都会有一个 Access-Control-Allow-Origin 头信息字段。

下面是"预检"请求之后，浏览器的正常 CORS 请求。

```
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面头信息的 `Origin` 字段是浏览器自动添加的。

下面是服务器正常的回应。

```
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

上面头信息中，`Access-Control-Allow-Origin` 字段是每次回应都必定包含的。

### 4. 与 JSONP 的比较

CORS 与 JSONP 的使用目的相同，但是比 JSONP 更强大。

JSONP 只支持 `GET` 请求，CORS 支持所有类型的 HTTP 请求。JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。

## 3. 聊一下 HTTP 状态码

- 1\*\*：信息，服务器收到请求，需要请求者继续执行操作（101，升级为 websocket 协议）
- 2\*\*：成功，操作被成功接收并处理（201，POST 新增操作，206 部分内容分段传输）
- 3\*\*：重定向，需要进一步操作以完成请求（301 临时重定向，302 永久重定向；304 命中缓存）
- 4\*\*：客户端错误（401，授权错误；403，服务器理解客户端请求，但是禁止访问，404 找不到资源）
- 5\*\*：服务器错误，服务器处理请求过程中发生错误

## 4. HTTP 的报文结构是怎么样的？

对于 TCP 而言，在传输的时候分为两个部分:**TCP 头**和**数据部分**。

而 HTTP 类似，也是 `header + body` 的结构，具体而言：

```
起始行 + 头部 + 空行 + 实体
```

由于 http 请求报文和响应报文是有一定区别，因此我们分开介绍。

### 起始行

对于请求报文来说，起始行类似下面这样：

```HTTP
GET /home HTTP/1.1
```

也就是 **方法 + 路径 + HTTP 版本**。

对于响应报文来说，起始行一般长这个样：

```HTTP
HTTP/1.1 200 OK
```

响应报文的起始行也叫 `状态行`，由 **HTTP 版本 + 状态码 + 原因**三部分组成。

### 头部

展示一下请求头和响应头在报文中的位置：

<img src="/assets/img/HTTP/请求头.png">

<img src="/assets/img/HTTP/响应头.png">

不管是请求头还是响应头，其中的字段是相当多的，而且牵扯到 `http` 非常多的特性，这里就不一一列举的，重点看看这些头部字段的格式：

1. 字段名不区分大小写
1. 字段名不允许出现空格，不可以出现下划线 `_`
1. 字段名后面必须紧挨着 `:`

### 空行

很重要，用来区分开 `头部` 和 `实体`。

问：如果在头部中间故意加一个空行会怎么样？

那么空行后的内容全部被视为实体。

### 实体

就是具体的数据了，也就是 `body` 部分。请求报文对应 `请求体`，响应报文对应 `响应体`。

## 5. HTTP 和 HTTPS 有何区别？

1. HTTPS 使用 443 端口，HTTP 默认使用 80 端口
1. HTTPS 需要申请证书
1. HTTPS 比 HTTP 更慢，因为还需要经过 SSL 数据包传输
1. HTTP 是明文传输，HTTPS 经过是 SSL 加密的协议，传输更安全
