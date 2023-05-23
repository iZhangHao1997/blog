# Vuex

Vuex 是 vue2 官方推荐使用的状态管理工具，主要工作流和知识点如下。

<img src="/img/vue/Vuex.png">

## vuex 有什么优缺点？

- 优点
  - 解决了非父子组件的消息传递（将数据放在 `state` 中）
  - 减少了 `ajax` 请求次数，有些情景可以直接从内存中的 `state` 中获取
- 缺点
  - 游览器刷新后，`vuex` 中的 `state` 数据重新变回初始状态

## vuex 有哪几种属性？

- `State` ：`vuex` 基本数据，用于存储变量
- `Getter`：从 `state` 派生的数据，相当于 `state` 的基本属性
- `Mutation`: 存放更新数据的**同步**方法，通过 `commit` 提交；
- `Action`： 可以包含**异步**操作，最终还是通过提交 `Mutation` 更新状态；通过 `dispatch` 调用 `Action` 里的方法；
- `Module`： 用于将 `vuex` 切分为模块，每个模块有自己的 `State`、`Getter`、`Mutation`和 `Action`，使不同模块代码分离，便于管理维护

## vuex 中的 state 有什么特性？

- `vuex` 就是一个仓库，仓库里面放了很多对象，其中 `state` 就是存放数据源的存放地
- `state` 里面的数据都是响应式的，`vue` 组件从 `store` 中读取数据，若是 `store` 中的数据改变，依赖这个数据的组件也会更新数据
- 它通过 `mapState` 把全局的 `state` 和 `getters` 映射到当前组件的 `computed` 计算属性中

## vuex 中的 getters 有什么特性？

- `getter` 可以对 `state` 进行计算操作，可以把它看作 `state` 的计算属性
- 虽然放在组件中也可以做计算属性，但 `getter` 可以在多个组件中复用
- 如果一个状态只在一个组件内使用，是可以不用 `getters`

## Vue 中对 Ajax 请求代码应该写在组件的 methods 中还是 vuex 的 actions 中？

- 如果请求的数据是不被其他组件公用的，仅仅在请求的组件内使用，就不需要放入 `vuex` 的 `state` 里
- 如果被其他地方复用，可以将请求放入 `action` 里，方便复用；如果不需要复用这个请求，直接写在 `Vue` 文件里会更方便
