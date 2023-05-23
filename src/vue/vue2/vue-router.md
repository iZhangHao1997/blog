# Vue Router

关于 vue-router 的一些常用知识。

## route/router 有什么区别？

- `route` 表示路由信息的对象，包括 `path`、`params`、`query`、`hash`、`fullPath`、 `matched`、`name` 等路由信息参数
- `router` 表示路由实例对象，包括了路由的跳转方法，钩子函数等

扩展，路由对象属性：

- `$route.path`
  - 类型：`string`
    字符串，对应当前的路由路径，总是解析为绝对路径，如 `/foo/bar`
- `$route.fullPath`
  - 类型：`string`
    完成解析之后的 URL，包含查询参数和 `hash` 完整的路径
- `$route.params`
  - 类型：`object`
    一个 key/value 对象，包含了动态片段和全匹配片段，如果没有路由参数，就是一个空对象。
- `$route.query`
  - 类型：`object`
    一个 key/value 对象，表示 URL 查询参数。例如，对于路径 `/foo?user=1`，则有 `$route.query.user == 1`，如果没有查询参数，则是个空对象。
- `$route.name`
  - 类型：`string`
    当前路由的名称，路由定义时命名的。
- `$route.hash`
  - 类型：`string`
    当前路由的 hash 值（带 `#`），如果没有 hash 值，则为空字符串
- `$route.matched`
  - 类型：`array`
    一个数组，包含当前路由的所有嵌套路径片段的**路由记录**。路由记录就是 `routes` 配置数组中的对象副本（还有在 `children` 数组）
- `$route.redirectedFrom`
  如果存在重定向，即为重定向来源的路由名字

## vue router 中有哪些导航守卫？

[Vue Router 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)

记住**参数或查询的改变并不会触发进入/离开的导航守卫**。你可以通过观察 `$route` 对象来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。

- 全局导航守卫：全局前置钩子 `beforeEach`、全局解析守卫 `beforeResolve`、全局后置钩子 `afterEach`
- 路由独享的守卫： `beforeEnter`
- 组件内的守卫：`beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`

完整的导航解析流程：

1. 导航被触发
1. 在失活的组件里调用 `beforeRouteLeave` 守卫
1. 调用全局的 `beforeEach` 守卫
1. 在复用的组件里调用 `beforeRouteUpdate` 守卫（2.2+）
1. 在路由配置里调用 `beforeEnter`
1. 解析异步路由组件
1. 在被激活的组件里调用 `beforeRouteEnter`
1. 调用全局的 `beforeResolve` 守卫（2.5+）
1. 导航被确认
1. 调用全局的 `afterEach` 钩子
1. 触发 DOM 更新
1. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数

## vue router 中的 hash/history 两种模式有什么区别？

- `hash` 模式 `url` 上显示 `#`，而 `history` 模式没有
- 刷新页面时，`hash` 模式可以正常加载到 `hash` 值对应的页面，`history` 模式没有处理的话，会返回 404，一般需要后端将所有页面都配置重定向到首页路由(try_files $uri $uri/ index.html)
- 兼容性上，`hash` 模式可以支持低版本游览器和 IE

## vue router 中的 hash/history 是如何实现的？

- `hash` 模式

  - `#` 后面 `hash` 值的变化，不会导致游览器向服务器发出请求，就不会刷新页面，同时通过监听 `hashChange` 事件可以知道 `hash` 发生了哪些变化，根据 `hash` 变化来实现页面的局部更新
  - hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，对服务端安全无用，hash 不会重加载页面。
    hash 模式下:仅 hash 符号之前的内容会被包含在请求中，如 `http://www.xxx.com`，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

- `history` 模式
  - `histroy` 模式的实现，主要是 `HTML5` 标准发布的两个 API：`pushState` 和 `replaceState`，这两个 API 可以改变 URL，但是不会发送请求，这样就可以监听 URL 变化来实现局部更新
  - 前端的 URL 必须和实际向后端发起请求的 URL 一致，如 `http://www.xxx.com/items/id`。后端如果缺少对 `/items/id` 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

## 怎么定义 vue router 的动态路由？怎么获取传过来的值？

动态路由的创建的时候在**路径参数**使用冒号 `:` 标记，比如 `/users/:id`，参数值会在 `this.$route.params` 中获取到。

```js
{
  path: '/users/:id',
  name: '用户',
  component: User
}
```

## vue router 的传参方式有哪些？如何传参？

- 通过 `params`
  - `this.$router.push` 的时候要使用 `name`，不能使用 `path`
  - 参数不会显示在 URL 上
  - 游览器刷新会清空参数
- 通过 `query`
  - 只能用 `path` 不能使用 `name`
  - 参数会显示在 URL 上
  - 游览器刷新不会清空参数

例子：

```js
// params
this.router.push({ name: "user", params: { userId } });
// 这里的 params 不生效
this.router.push({ path: "/user", params: { userId } });

// query，带参数查询，编程 /register?path=private
this.router.push({ path: "register", query: { plan: "private" } });
```

## vue router 和 location.href 有什么区别？

[彻底搞懂路由跳转：location 和 history 接口](https://segmentfault.com/a/1190000014120456)

1. 首先 `location` 是 `window` 下的一个属性，它有许多属性描述当前游览器窗口的页面，我们可以通过 location 对象获取到当前路由的信息。location.href 是当前路由 URL 的描述，可以同通过 location.href 改变当前路由的 url，以及通过 location.hash 改变 `#` 后面的 url，两者都不会刷新页面。
1. vue router 有两种模式：`history` 和 `hash` 模式
1. hash 模式就是改变 `#` 后面的值实现的路由
1. history 模式基于 H5 的新 API history.pushState 和 history.replaceState，pushState 会向游览器的历史栈顶压栈，而 replaceState 会替换栈顶的记录
