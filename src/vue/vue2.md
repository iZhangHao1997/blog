# Vue2 基础知识及基础原理的源码级回答

## 1. Vue.js

### 1.1 讲一讲你对 MVVM 的理解？和 MVC 有什么不同？

- `MVC` 指的是 `Model-View-Controller`，即 模型-视图-控制器
  - 使用 `MVC` 的目的就是将模型和视图分离
  - `MVC` 属于单向通信，必须通过 `Controller` 承上启下，即必须由控制器来获取数据，将结果返回给前端，页面重新渲染
- `MVVM` 指的是 `Model-View-ViewModel`，即 模型-视图-视图模型，是一种设计思想，**模型**指的是后端传递的数据，**视图**指的是看到的页面，**视图模型**是 `MVVM` 的核心，它是连接 `View` 和 `Model` 的桥梁，**实现 `View` 的变化会自动更新到 `ViewModel` 中，`ViewModel` 中的变化也会自动显示在 `view` 上**，这是一种**数据驱动视图**的模型

**区别：**

- `MVC` 中的 `Controller` 在 `MVVM` 演变成 `ViewModel`
- `MVVM` 通过数据来显示视图，而不是通过节点操作
- `MVVM` 主要解决了 `MVC` 中大量的 `DOM` 操作，使页面渲染性能降低，加载速度慢，影响用户体验的问题

### 1.2 请说一下 Vue 响应式数据的原理？

**Vue 2.0：**
`Vue 2.0` 底层对于响应式数据的核心是 `Object.defineProperty`。

Vue 在初始化数据的时候，会给 `data` 中的属性使用 `Object.defineProperty` 重新定义属性（达到劫持属性的 `getter` 和 `setter`），当页面使用对应属性时，会通过 Dep 类进行**依赖收集**（收集当前组件的 `watcher`），如果属性发生变化，会通知相关依赖调用其 update 方法进行更新操作。

**从源码解释：**

这里，用一张图来说明 Vue 实现响应式数据的流程：

<img src="/img/vue/Vue实现响应式数据流程.png">

1. 首先，第一步是初始化用户传入的 `data` 数据，对应源码 `src/core/instance/state.js` 的 112 行

```js
function initData(vm: Component) {
  // 获取用户传入的数据
  let data = vm.$options.data;
  // 处理数据
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    // 判断是否为对象，如果不为对象则设置为空对象，并且如果不是生产环境则报错
    // ...
  }
  // proxy data on instance
  // 在一个实例上代理数据
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    // 大概是判断用户定义的属性名和 methods、props 方法名属性名是否冲突，冲突且不是生产环境则报错
    // ...
  }
  // observe data
  // 最后调用数据观测的方法，进入第二步
  observe(data, true /* asRootData */);
}
```

2. 第二步是将数据进行观测，也就是在第一步 `initData` 最后调用的 `observe` 方法。对应源码在 `src/core/observer/index.js` 的 110 行。

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 判断 value 类型
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 重点：传入用户的数据并创建了一个新的 Observer 实例
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

这里会通过 `new Observer(value)` 创建一个 `Observer` 实例，实现对数据的观测

3. 第三步是实现对对象的处理（walk 方法）。对应源码 `src/core/observer/index.js` 的 55 行。

```js
// Observer 类
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      // 关键一步，把数据传入到 walk 方法进行处理
      this.walk(value);
    }
  }

  /**
   * 遍历所有属性，转换为 gatters/setters 模式
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      // 关键方法
      defineReactive(obj, keys[i]);
    }
  }

  // 下面还有一个对数据是数组情况处理的方法，这里省略
  // ...
}
```

4. 第四步就是遍历对象属性定义响应式变化了（defineReactive 方法）。对应源码 `src/core/observer/index.js` 的 135 行。

```js
/**
 * 定义一个响应式属性的对象
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  // 获取属性的描述器
  const property = Object.getOwnPropertyDescriptor(obj, key);
  // 如果属性是不可配置的就返回
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  // 获取到属性的 getter 和 setter 方法
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  // 关键一步，使用 defineProperty 定义属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 定义了响应式 get 方法
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          // 收集依赖
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      // 通知相关依赖进行更新
      dep.notify();
    },
  });
}
```

5. 第五步其实就是使用 `defineReactive` 方法中的 `Object.defineProperty` 重新定义数据。在 `get` 中通过 `dep.depend` 收集依赖，当数据改变时，拦截属性的更新操作，通过 `Set` 中的 `dep.notify()` 进行相关依赖更新

### 1.3 Vue 是如何实现响应式数据的？

Vue 主要通过以下 4 个步骤实现响应式数据

- 实现一个**监听器**「**Observer**」：对数据对象进行遍历，包括子属性对象的属性，利用 `Object.defineProperty()` 在属性上都加上 `getter` 和 `setter`，这样后，给对象的某个值赋值，就会触发 `setter`，那么就能监听到数据变化
- 实现一个**解析器**「**Compile**」：解析 `Vue` 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新
- 实现一个**订阅者**「**Watcher**」：`Watcher` 订阅者是 `Observer` 和 `Compile` 之间通信的桥梁，主要任务是订阅 `Observer` 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 `Compile` 中对应的更新函数
- 实现一个**订阅器**「**Dep**」：订阅器采用发布-订阅设计模式，用来收集订阅者 `Watcher`，对监听器 `Observer` 和订阅者 `Watcher` 进行统一管理

### 1.4 直接给一个数组项赋值，Vue 能检测到吗？

由于 `JavaScript` 的限制，Vue 并不能检测到以下数组的改变（使用数组实例自带的方法可以，因为已经重写）：

- 直接利用**索引**设置一个数组项，例如：`vm.items[index] = newValue`
- 直接改变数组**长度**，例如：`vm.items.length = newLength`

为了解决第一个问题，`Vue` 提供了以下操作方法：

```js
// Vue set
Vue.set(vm.items, index, newValue);

// Vue $set，Vue set 的一个别名
Vue.$set(vm.items, index, newValue);

// Array.prototype.splice(index, 1, newValue);
vm.items.splice(index, 1, newValue);
```

第二种情况可以通过 `splice` 方法解决

```js
// Array.prototype.splice
vm.item.splice(newLength - 1);
```

### 1.5 Vue 中如何检测数组的变化的？

Vue 中检测数组变化核心有两点：

- 首先，使用函数劫持的方式，重写了数组的方法
- Vue 将 `data` 中的数组，进行了原型链重写。指向自己定义的数组原型方法，这样当调用数组 `api` 时，就可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次进行观测。

用一张流程图来说明：

<img src="/img/vue/Vue检测数组和属性变化.png">

1. 首先，第一步是初始化用户传入的 `data` 数据，对应源码 `src/core/instance/state.js` 的 112 行

```js
function initData(vm: Component) {
  // 获取用户传入的数据
  let data = vm.$options.data;
  // 处理数据
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    // 判断是否为对象，如果不为对象则设置为空对象，并且如果不是生产环境则报错
    // ...
  }
  // proxy data on instance
  // 在一个实例上代理数据
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    // 大概是判断用户定义的属性名和 methods、props 方法名属性名是否冲突，冲突且不是生产环境则报错
    // ...
  }
  // observe data
  // 最后调用数据观测的方法，进入第二步
  observe(data, true /* asRootData */);
}
```

2. 第二步是将数据进行观测，也就是在第一步 `initData` 最后调用的 `observe` 方法。对应源码在 `src/core/observer/index.js` 的 110 行。

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 判断 value 类型
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 重点：传入用户的数据并创建了一个新的 Observer 实例
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

3. 第三步是在创建新的 `Observer` 实例中，`protoAugment` 方法将数组属性的 `__proto__` 指向新的原型对象

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    // 重点，在这里处理数组属性
    if (Array.isArray(value)) {
      if (hasProto) {
        // 这个方法将数组属性的 __proto__ 指向 arrayMethods
        // Augment 为扩大的意思
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj: Object) {
    // ...
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

`protoAugment` 方法：

```js
/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}
```

4. 重写数组原型方法。可以看到数组属性的原型指向了 `protoAugment` 中第二个参数 `arrayMethods` 对象，那么这个是什么呢？其实是数组原型对象中会改变数组的方法，对这些方法进行重写，再指向用 `Object.create` 新建一个干净的对象。

在源码 `src/core/observer/array.js` ：

```js
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from "../util/index";

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

// 这里列举的数组方法都是调用后会改变原数组的
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

/**
 * 遍历这些能改变原数组的方法，然后进行重写
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // 调用原数组方法
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    // 先运行原方法，保存结果
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 进行深度监控
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});
```

5. 第五步对数组调用 `observerArray` 方法

```js
/**
* Observe a list of Array items.
*/
observeArray (items: Array<any>) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

其实就是遍历数组，对里面的每一项都调用 `observe` 方法，进行深度观测。

### 1.6 Vue 如何通过 vm.$set() 来解决对象新增/删除属性不能响应的问题？

由于 JS 限制，Vue 无法检测到对象属性的添加或删除。这是由于 Vue 会在初始化实例时对属性的 `geeter` 和 `setter` 进行劫持，所以属性必须在 data 对象上才能让 Vue 让它们转换为响应式数据。

Vue 提供了 `Vue.set(target, propertyName, value)` / `vm.$set(target, propertyName, value)` 来实现为对象添加响应式属性，其原理如下：

1. 首先 `set` 方法会判断 `target` 是否为 `undefined`、`null` 或 原始类型值，是的话如果不为生产模式则抛错，
1. 接着再再判断 `target` 是否为数组，如果是的话会调用重写之后的 `splice` 方法，触发响应式
1. 如果目标是对象，会判断对象属性是否存在，对象是否是响应式，最终如果要进行响应式处理，则会调用 `defineReactive` 方法进行响应式处理，实际上就是拦截 `setter` 和 `getter`
1. 拦截 `getter` 调用 `dep.depend()` 进行依赖收集；拦截 `setter` 调用 `dep.notify()` 进行通知依赖更新

```js
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
  if (
    process.env.NODE_ENV !== "production" &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`
    );
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = (target: any).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        "Avoid adding reactive properties to a Vue instance or its root $data " +
          "at runtime - declare it upfront in the data option."
      );
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

`defineReactive` 定义对象的一个响应式属性方法：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

### 1.7 为什么 Vue 要采用异步渲染？

因为如果不采用异步渲染，每次更新数据都会进行重新渲染，为了提高性能，`Vue` 通过异步渲染的方式。在本轮数据更新后，再去异步更新视图。

再用一张图来说明 `Vue` 异步更新的流程：

<img src="/img/vue/Vue异步渲染流程.png">

1. 第一步是在 `setter` 中重写之后添加的 `dep.notify()` 方法，这个方法会通知 `watcher` 进行更新操作，对应源码 `src/core/observer.dep.js` 37 行

```js
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  // 通知依赖更新
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update(); // 依赖中的 update 方法
    }
  }
}
```

2. 第二部就是在第一步的 `notify` 方法中，遍历 `subs`，执行 `subs[i].update()` 方法，也就是依次调用 `watcher` 的 `update` 方法。对应源码 `src/core/observer/watcher.js` 的 164 行。

```js
/**
  * Subscriber interface.
  * Will be called when a dependency changes.
  */
update () {
  /* istanbul ignore else */
  if (this.lazy) { // 计算属性
    this.dirty = true
  } else if (this.sync) { // 同步 wathcer
    this.run()
  } else {
    queueWatcher(this) // 当数据发生变化
  }
}
```

3. 第三步就是执行第二部 `update` 中的 `queueWatcher` 方法，对应源码中的 `src/core/observer/scheduler.js` 的 164 行

```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id // 过滤 wathcer，多个属性可能会依赖同一个 wathcer
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher) // 将 wathcer 放到队列中
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue) // 调用 nextTick 方法，在下一个 tick 中刷新 watcher 队列
    }
  }
```

4. 第四步就是执行 `nextTick(flushSchedulerQueue)` 方法，在下一个 `tick` 中刷新 `watcher` 队列

### 1.8 Vue 中的 computed 是怎么实现的？

这里先给一个结论：计算属性 `computed` 的本质是 `computed Watcher`，其具有缓存。

一张图了解一下 `computed` 的实现：

<img src="/img/vue/Vue中compued怎么实现.png">

1. 第一步是在组件实例化的时候会执行 `initComputed` 方法。对应源码 `src/core/instance/state.js` 的 169 行

```js
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  // 遍历 computed 对象，如果是函数则赋值给 getter，如果不是函数则把用户定义的 get 对象赋值给 getter，如果 getter 最终为空则抛错
  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}
```

`initComputed` 拿到 `computed` 对象然后遍历每一个计算属性，判断如果不是服务端渲染就会给计算属性创造一个 `Watcher` 实例，赋值给 `watchers[key]`（对应就是 `vm._computedWatchers`）。

注意我们实例化 `wathcer` 的时候的第四个参数 `computedWatcherOptions`，实际上是：

```js
const computedWatcherOptions = { lazy: true };
```

传入了一个对象，其 `lazy` 为 `true`，后面会用到，有印象就行。

然后根据用户定义的类型获取到计算属性的 `getter`（如果是函数则默认为 `getter`，否则到这个对象中获取 `get` 对象，如果最后 `getter` 为空则抛错），然后判断该计算属性的**键值**是否已经存在，存在则抛错，不存在则调用 `defineComputed`，将组件原型、计算属性和对应的值传入。

2. `defineComputed` 定义在源码 `src/core/instance/state.js` 210 行

```js
export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering();
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

首先定义了 `shouldCache` 表示是否需要缓存值，紧接着对用户传入的 `userDef` 是函数还是对象分别处理。这里有一个 `sharePropertyDefinition`，我们来看它的定义：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};
```

`sharePropertyDefinition` 其实就是一个属性描述符（包括数据描述符和存取描述符），就是对每一个计算属性值设置好属性描述符。

回到 `defineComputed`，如果 `userDef` 是函数，就会定义 `getter` 为 `createComputedGetter(key)` 的返回值（`isServerRendering` 为 `false`，所以 `shouldCache` 为 `true`）

如果 `userDef` 是对象的话，并且非服务端渲染、用户没有指定 `cache` 为 `false`，就会定义 `getter` 为调用 `createComputedGetter(key)` 的返回值；然后设置 `setter` 为用户指定或者为空。

所以 `defineCompunted` 的作用就是定义 `getter` 和 `setter`，并且在最后调用 `Object.defineProperty` 给计算属性添加 `getter/setter`，当我们访问计算属性就会触发这个 `getter`。

可以看到无论 `userDef` 用户定义的计算属性不论是函数还是对象，最终都会调用 `createComputedGetter` 函数，所以我们继续看 `createComputedGetter`：

```js
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

可以看到当我们访问计算属性就会调用这个 `getter`，也就是 `createComputedGetter` 返回的 `computedGetter` 执行结果。

首先在 `conputedGetter` 中拿到 `initComputed` 中每个计算属性实例化的 `watcher` 对象并赋值给 `watcher`。

在 `initComputed` 中 `new Wather` 的时候传入了第四个参数 `computedWatcherOptions` 的 `lazy` 为 `true`，对应就是 `watcher` 的构造函数中的 `dirty` 为 `true`（`Watcher` 构造函数中有一句：`this.dirty = this.lazy // for lazy watchers`）。在 `computedGetter` 中，如果 `dirty` 为 `false` （即没有受污染，即依赖的值没有发生变化），就不会重新求值，就相当于 `computed` 呗缓存了

所以在 `computedGetter` 中会进入 `wathcer.dirty` 的条件中，调用 `watcher.evaluate` 函数：

```js
/**
  * Evaluate the value of the watcher.
  * This only gets called for lazy watchers.
  */
evaluate () {
  this.value = this.get()
  this.dirty = false
}
```

首先调用 `this.get()` 将它的返回值赋值给 `this.value`，继续看 `get()` 函数：

```js
/**
  * Evaluate the getter, and re-collect dependencies.
  */
get () {
  pushTarget(this)
  let value
  const vm = this.vm
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (this.user) {
      handleError(e, vm, `getter for watcher "${this.expression}"`)
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
  }
  return value
}
```

`get` 函数第一步就是调用 `pushTarget` 方法将 `computed Watcher` 传入：

```js
// src/core/observer/dep.js
export function pushTarget(target: ?Watcher) {
  targetStack.push(target);
  Dep.target = target;
}
```

可以看到 `computed Wathcer` 被 push 到 `targetStack` 同时将 `Dep.target` 置为 `computed Wathcer`。而 `Dep.target` 原来的值是渲染 `Watcher`，因为正处于渲染阶段。回到 `get` 函数，接着就调用了 `this.getter`。

执行完 `get` 函数，将 `dirty` 置为 `false`。

回到 `computedGetter` 函数，接着进入下一个 `if` 判断，执行了 `depend` 函数：

```js
/**
  * Depend on all deps collected by this watcher.
  */
depend () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].depend()
  }
}
```

这里的逻辑就是让 `Dep.target` 也就是渲染了 `Wathcer` 订阅了 `this.dep` 也就是前面前面实例化 `computed Watcher` 时候创建的 `dep` 实例，渲染 `Watcher` 就被保存到 `this.dep` 的 `subs` 中。

在执行完 `evaluate` 和 `depend` 函数后，`computedGetter` 函数最后将 `evaluate` 的返回值返回出去，也就是计算属性最终计算出来的值，这样页面就渲染出来了。

总而言之，为什么计算属性能够根据依赖响应式更新呢？因为 vue 在访问 computed 数据的时候，计算属性会计算，同时访问了依赖的数据，这些数据被访问就会进行依赖收集，这样以后计算属性依赖的响应式数据变化就会通知 computed 重新计算和渲染。

### 1.9 谈一下 nextTick 的实现原理？

Vue.js 在默认情况下，每次触发某个数据的 `setter` 方法后，对应的 `watcher` 对象其实会被 `push` 到一个队列 `queue` 中，在下一个 `tick` 的时候将这个队列 `queue` 全部拿出来 `run`（ `Watcher` 对象的一个方法，用来触发 `patch` 操作）一遍。

因为目前游览器平台没有实现 `nextTick` 方法，所以 vue.js 源码分别用 `Promise`、`setTimeout`、`setImmediate` 等方式在 `microtask`（或是 `task`）中创建一个事件，目的是在当前调用栈执行完毕以后（不一定立即）才会去执行这个事件。

`nextTick` 方法主要是使用了宏任务和微任务，定义了一个异步方法，多次调用 `nextTick` 会将方法存入队列中，通过这个异步方法清空当前队列。所以 `nextTick` 方法是异步方法。

下图是 `nextTick` 实现流程：

<img src="/img/vue/Vue中nextTick实现流程图.png">

- 首先会调用 `nextTick` 并传入 `cb`，对应源码 `src/core/util/next-tick.js` 87 行：

```js
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

- 接下来会定义一个 `callbacks` 数组来存储 `nextTick`，在下一个 `tick` 处理这些回调函数之前，所有的 `cb` 都会被存到这个 `callbacks` 数组中
- 下一步会调用 `timerFunc` 函数，对应源码 `src/core/util/next-tick.js` 的 33 行

```js
let timerFunc;

if (typeof Promise !== "undefined" && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

看一下 `timerFunc` 的取值逻辑：

1. 我们知道异步任务有两种，其中 `microtask` 要由于 `macrotask`，所以有限选择 `promise`。因此在这里优先判断游览器是否支持 `promise`
1. 如果不支持再考虑 `macrotask`。对于 `macrotask` 会先判断游览器是否支持 `mutationOberver` 和 `setImmediate`
1. 如果都不支持只能使用 `setTimeout` 。这也从侧面反映出 `macrotask` 中 `setTimeout` 的性能是最差的。

> `nextTick` 中 `if (!pending)` 语句中的 `pending` 作用显然是让 `if` 语句的逻辑只执行依次，而它其实就代表 `callbacks` 中是否有事件在等待执行。

这里的 `flushCallbacks` 函数主要罗就是将 `pending` 置为 `false` 以及清空 `callback` 数组，然后遍历 `callbacks` ，执行里面的每一个函数。

- `nextTick` 最后一步对应：

```js
// $flow-disable-line
if (!cb && typeof Promise !== "undefined") {
  return new Promise((resolve) => {
    _resolve = resolve;
  });
}
```

这里的 `if` 对应的情况就是我们调用 `nextTick` 函数时没有传入回调并且游览器支持 `promise`，那么就会返回一个 `promise` 实例，并且将 `resolve` 赋值给 `_resolve`。回到 `nextTick` 开头的第一段代码：

```js
let _resolve;
callbacks.push(() => {
  if (cb) {
    try {
      cb.call(ctx);
    } catch (e) {
      handleError(e, ctx, "nextTick");
    }
  } else if (_resolve) {
    _resolve(ctx);
  }
});
```

当我们执行 `callbacks` 的函数时，发现没有 `cb` 而有 `_resolve` 会执行之前返回的 `promise` 对象的 `resolve` 函数。

### 1.10 Vue 组件的 data 为什么是个函数？

而 `new Vue` 实例里，`data` 可以直接是一个对象？

平时在组件和 `new Vue` 时使用 `data` 的场景：

```js
// 组件
data() {
  return {
   msg: "hello 森林",
  }
}

// new Vue
new Vue({
  data: {
    msg: 'hello jack-cool'
  },
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
```

我们知道 vue 组件其实就是一个 vue 实例。

JS 中的实例时通过构造函数来创建的，每个构造函数可以 `new` 出很多个实例，那么每个实例都会在继承原型上的方法或属性。

vue 的 `data` 数据其实时 vue 原型上的属性，数据存在内存当中。

vue 为了保证每个实例上的 `data` 数据的独立性，规定了必须使用函数，而不是对象。

因为使用对象的话，每个实例（组件）上使用的 `data` 数据是互相影响的，这当然不是我们想要的。对象是对于内存地址的引用，直接定义个对象的话组件之间都会使用这个对象，这样会造成组件之间数据相互影响。

我们来看个示例：

```js
// 创建一个简单的构建函数
var MyComponent = function () {
  // ...
};
// 原型链对象上设置data数据，data设为Object
MyComponent.prototype.data = {
  name: "森林",
  age: 20,
};
// 创建两个实例:春娇，志明
var chunjiao = new MyComponent();
var zhiming = new MyComponent();
// 默认状态下春娇和志明的年龄一样
console.log(chunjiao.data.age === zhiming.data.age); // true
// 改变春娇的年龄
chunjiao.data.age = 25;
// 打印志明的年龄，发现因为改变了春娇的年龄，结果造成志明的年龄也变了
console.log(chunjiao.data.age); // 25
console.log(zhiming.data.age); // 25
```

使用函数后，使用的是 `data()` 函数，`data()` 函数中的 `this` 指向的是当前实例本身，就不会相互影响了。

总结一下，就是：
组件中的 `data` 是一个函数的原因在于：同一个组件被复用多次，会创建多个实例。这些实例用的是同一个构造函数，如果 `data` 是一个对象的话。那么所有组件都共享了同一个对象。为了保证组件的数据独立性要求每个组件必须通过 `data` 函数返回一个对象作为组件的状态。

而 `new Vue` 的实例，是不会被复用的，因此不存在引用对象的问题。

### 1.11 谈谈你对 Vue 生命周期的理解？

首先概括一下 Vue 生命周期是什么：

Vue 实例有一个完整的生命周期，也就是从创建、初始化数据、编译模板、挂载 DOM、渲染、更新、渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

下面表格展示了每个生命周期分别在什么时候被调用：

| 生命周期        | 描述                                                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `beforeCreate`  | 在实例初始化后，数据观测（`data observer`）之前被调用                                                                                                      |
| `created`       | 实例已经创建完成后被调用。在这一步已经完成了**数据观测（`data observer`）**，属性和方法的运算，`watch/event` 事件回调，但 `dom` 还没有生成，`$el` 还不可用 |
| `beforeMount`   | 在挂载之前被调用，相关 `render` 函数首次被调用                                                                                                             |
| `mounted`       | `el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用该钩子                                                                                              |
| `beforeUpdate`  | 数据更新时调用，发生在虚拟 `DOM` 重新渲染和打补丁之前                                                                                                      |
| `updated`       | 由于数据更改导致的虚拟 `DOM` 重新渲染和补丁，在这之后会调用该钩子                                                                                          |
| `activited`     | `keep-alive` 缓存组件专属，组件被激活时调用                                                                                                                |
| `deactivited`   | `keep-alive` 缓存组件专属，组件失活时被调用                                                                                                                |
| `beforeDestory` | 实例销毁之前调用。在这一步，实例仍然完全可用                                                                                                               |
| `destory`       | Vue 实例销毁后调用                                                                                                                                         |

放上一张官网的生命周期流程图：

<img src="/img/vue/Vue生命周期.png">

这里用一张图梳理了源码中关于周期的全流程（长图预警）：

<img src="/img/vue/Vue源码关于生命周期流程图.png">

- Vue 本质上是一个构造函数，定义在 `src/core/instance/index.js` 中：

```js
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

- 构造函数的核心是调用 `_init` 方法，`_init` 方法定义在 `src/core/instance/init.js` 中

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // a uid
  vm._uid = uid++;

  let startTag, endTag;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`;
    endTag = `vue-perf-end:${vm._uid}`;
    mark(startTag);
  }

  // a flag to avoid this being observed
  vm._isVue = true;
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options);
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== "production") {
    initProxy(vm);
  } else {
    vm._renderProxy = vm;
  }
  // expose real self
  vm._self = vm;
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  callHook(vm, "beforeCreate");
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, "created");

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    vm._name = formatComponentName(vm, false);
    mark(endTag);
    measure(`vue ${vm._name} init`, startTag, endTag);
  }

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

`_init` 内调用了很多初始化函数，从函数名可以看出来分别是执行初始化生命周期（`initLifecycle`）、初始化事件中心（`initEvents`）、初始化渲染（`initRender`）、执行 `beforeCreate` 钩子、解析 `inject`、初始化状态（`initState`）、解析 `provide`、执行 `created` 钩子。

- 在 `_init` 函数中最后判断如果有 `el` 就执行 `$mount` 方法。定义在 `src/plaforms/web/entry-runtime-with-compiler.js` 中

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};
```

这里面主要做了两件事：

1. 重写了 `vue` 函数的原型上的 `$mount` 函数
1. 判断是否有模板，并且将模板转化成 `render` 函数

最后调用了 `runtime` 的 `mount` 方法，用来挂载组件，也就是 `mountComponent` 方法。

- `mountComponent` 首先调用了 `beforeMount` 方法，然后在初次渲染和更新后会执行 `vm._update(vm._render(), hydrating)` 方法。最后渲染完成后调用 `mounted` 钩子
- `beforeUpdate` 和 `updated` 钩子是在页面发生变化，触发更新后，被调用的，对应是在 `src/core/observer/scheduler.js` 的 `flushSchedulerQueue` 函数中
- `beforeDestroy` 和 `destroy` 都在执行 `$destroy` 函数时被调用。`$destroy` 函数是定义在 `Vue.prototype` 上的一个方法，对应在 `src/core/instance/lifecycle.js` 文件中：

```js
Vue.prototype.$destroy = function () {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestroy");
  vm._isBeingDestroyed = true;
  // remove self from parent
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, "destroyed");
  // turn off all instance listeners.
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

### 1.12 虚拟 DOM 的优缺点？

优点：

- 保证性能下限：框架的虚拟 `Dom` 需要适配任何上层 API 可能产生的操作，它的一些 `Dom` 操作的实现必须是普遍适用的，所以它的性能并不是最有的，但比起粗暴的 `Dom` 操作要多很多，因此保证了性能的下限
- 无需手动操作 `Dom`：框架会根据虚拟 `Dom` 实现数据的双向绑定，帮我们更新视图，提高开发效率
- 跨平台：虚拟 `Dom` 本质上是 `JS` 对象，而真实 `Dom` 与平台相关，相比下虚拟 `Dom` 可以更好地跨平台操作

缺点：

- 无法进行极致优化

### 1.13 虚拟 DOM 的实现原理？

虚拟 `Dom` 的实现原理主要包括下面三个部分：

- 使用 JS 对象模拟真实的 `Dom` 树，对真实的 `Dom` 进行抽象
- 通过 `diff` 原理比对新旧 `Dom`
- 通过 `patch` 将新旧 `Dom` 的差异应用到真实 `Dom` 树上

### 1.14 nextTick 实现原理是什么？在 Vue 中有什么作用？

- 原理：`Event Loop` 事件循环
  - 流程是依次检测是否支持 `Promise`、`MutationObserver` 、`setImmediate`，最后是 `setTimeout` 的回调方法，以此确定回调函数队列是以哪个 API 来异步执行
  - 在 `nextTick` 函数接收到一个 `callback` 的时候，先不去调用它，而是把它 `push` 到一个全局的 `callbacks` queue 队列，等待下一个任务队列的时候再一次性把这个 `queue` 里的函数依次执行
  - 这个队列可能是 `microTask` 队列，也可能是 `marcoTask` 队列，前两个是微任务队列，后两个是宏任务队列
- 作用：在下一次 `Dom` 更新循环结束后延迟执行回调，在修改数据之后使用 `$nextTick`，则可以在回调中获取更新后的 `DOM`。

### 1.15 v-for 中 key 的作用是什么？

> [举例说明 key 的作用](https://www.jianshu.com/p/4bd5e745ce95)，[（重点看）从 diff 算法原理解释 key 的作用](https://juejin.im/post/5e8694b75188257372503722#comment)

总的来说就是 `diff` 算法比对新旧 `Dom` 的时候，如果有 `key` 就可以做一个唯一标识，判断是否为同一个节点，提高同级的 `vnode` 比对效率。

### 1.16 v-if 和 v-show 有什么区别？

- `v-if` 根据条件决定是否渲染，会在切换过程中重建和销毁节点
- `v-show` 不会根据初始条件，都会进行渲染，切换只是基于 CSS 的 `display: none`

所以 `v-if` 切换消耗比较大，`v-show` 初始化消耗较大；因此频繁切换的话使用 `v-show`，比较少切换使用 `v-if`。

### 1.17 如何使用 Watch 监听嵌套对象的变化？

```js
watch: {
  'a.b': function(value, oldVal) {
    // ...
  }
}
```

### 1.18 组件间通信的方式有哪些？

[组件中通信六种方式详解](https://segmentfault.com/a/1190000019208626#item-5)

- 父子组件通信
  - props / this.$emit 和 v-on
  - $parent / $children
  - ref
  - provide / inject
- 兄弟组件
  - eventBus
  - vuex
  - $attr / $listeners
  - provide / inject

### 1.19 为什么 v-if 和 v-for 不建议连在一起使用？

`v-for` 的优先级高于 `v-if`，所以不管 `v-if` 是否成立都会先执行 `v-for` 造成性能浪费。

### 1.20 父组件如何监听到子组件的生命周期？

#### 方法一：通过 emit

```html
// Parent.vue
<Chind @mounted="doSomething" />

// Child.vue mounted() { this.$emit('mounted'); }
```

#### 方法二：通过 hook

```html
// Parent.vue <Child @hook:mounted="doSomething" />
```

### 1.21 讲一下 vue 的优缺点？

- 优点
  1. 数据驱动视图：对真实的 DOM 抽象成一个 Virtual DOM（本质是一个 JS 对象），并配合 diff 算法、响应式和观察者、异步队列等手段以最小代价更新 DOM，渲染页面
  1. 组件化：组件用单文件的形式进行代码的组织编写，使我们可以在一个文件里编写 HTML/CSS（配置 scoped 属性隔离）/JS 并配合 vue-loader，支持更加强大的预处理器等功能
  1. 强大且丰富的 API：提供一系列的 API 满足业务开发中各类需求
  1. 生命周期钩子函数，选项式的代码组织方式
  1. 生态好，社区活跃
- 缺点
  1. 由于底层基于 `Object.defineProperty` 实现响应式，而这个 api 本身不支持 IE8 及以下浏览器
  2. spa 的先天不足，首屏性能问题（白屏）
  3. 由于百度等搜索引擎爬虫无法爬取 js 中的内容，故 spa 先天就对 seo 优化心有余力不足（谷歌的 puppeteer 就挺牛逼的，实现预渲染底层也是用到了这个工具）

### 1.22 使用 .sync 更新 props

某些情况下，我们需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件都没有明显的变更来源。

所以 Vue 官方推荐以 `update:myPropName` 的模式触发事件而取代之。举个例子，在一个包含 `title` prop 的假设组件重，我们可以用以下方法表达对其赋值更新的意图：

```js
this.$emit("update:title", newTitle);
```

然后父组件可以监听那个事件并根据需要更新一个本地的数据 property。例如：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

为了方便起见，Vue 为这种模式提供了一个缩写，即 `.sync` 修饰符：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

> 注意带有 `.sync` 修饰符的 `v-bind` **不能**和表达式一起使用（例如 `v-bind:title.sync="doc.title" + '!'` 是无效的）。取而代之的是，我们只能提供想要绑定的 property 名，类似 `v-model`。

## 2. Router

### 2.1 route/router 有什么区别？

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

### 2.2 vue router 中有哪些导航守卫？

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

### 2.3 vue router 中的 hash/history 两种模式有什么区别？

- `hash` 模式 `url` 上显示 `#`，而 `history` 模式没有
- 刷新页面时，`hash` 模式可以正常加载到 `hash` 值对应的页面，`history` 模式没有处理的话，会返回 404，一般需要后端将所有页面都配置重定向到首页路由(try_files $uri $uri/ index.html)
- 兼容性上，`hash` 模式可以支持低版本游览器和 IE

### 2.4 vue router 中的 hash/history 是如何实现的？

- `hash` 模式

  - `#` 后面 `hash` 值的变化，不会导致游览器向服务器发出请求，就不会刷新页面，同时通过监听 `hashChange` 事件可以知道 `hash` 发生了哪些变化，根据 `hash` 变化来实现页面的局部更新
  - hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，对服务端安全无用，hash 不会重加载页面。
    hash 模式下:仅 hash 符号之前的内容会被包含在请求中，如 `http://www.xxx.com`，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

- `history` 模式
  - `histroy` 模式的实现，主要是 `HTML5` 标准发布的两个 API：`pushState` 和 `replaceState`，这两个 API 可以改变 URL，但是不会发送请求，这样就可以监听 URL 变化来实现局部更新
  - 前端的 URL 必须和实际向后端发起请求的 URL 一致，如 `http://www.xxx.com/items/id`。后端如果缺少对 `/items/id` 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

### 2.5 怎么定义 vue router 的动态路由？怎么获取传过来的值？

动态路由的创建的时候在**路径参数**使用冒号 `:` 标记，比如 `/users/:id`，参数值会在 `this.$route.params` 中获取到。

```js
{
  path: '/users/:id',
  name: '用户',
  component: User
}
```

### 2.6 vue router 的传参方式有哪些？如何传参？

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

### 2.7 vue router 和 location.href 有什么区别？

[彻底搞懂路由跳转：location 和 history 接口](https://segmentfault.com/a/1190000014120456)

1. 首先 `location` 是 `window` 下的一个属性，它有许多属性描述当前游览器窗口的页面，我们可以通过 location 对象获取到当前路由的信息。location.href 是当前路由 URL 的描述，可以同通过 location.href 改变当前路由的 url，以及通过 location.hash 改变 `#` 后面的 url，两者都不会刷新页面。
1. vue router 有两种模式：`history` 和 `hash` 模式
1. hash 模式就是改变 `#` 后面的值实现的路由
1. history 模式基于 H5 的新 API history.pushState 和 history.replaceState，pushState 会向游览器的历史栈顶压栈，而 replaceState 会替换栈顶的记录

## 3. Vuex

<img src="/img/vue/Vuex.png">

### 3.1 vuex 有什么优缺点？

- 优点
  - 解决了非父子组件的消息传递（将数据放在 `state` 中）
  - 减少了 `ajax` 请求次数，有些情景可以直接从内存中的 `state` 中获取
- 缺点
  - 游览器刷新后，`vuex` 中的 `state` 数据重新变回初始状态

### 3.2 vuex 有哪几种属性？

- `State` ：`vuex` 基本数据，用于存储变量
- `Getter`：从 `state` 派生的数据，相当于 `state` 的基本属性
- `Mutation`: 存放更新数据的**同步**方法，通过 `commit` 提交；
- `Action`： 可以包含**异步**操作，最终还是通过提交 `Mutation` 更新状态；通过 `dispatch` 调用 `Action` 里的方法；
- `Module`： 用于将 `vuex` 切分为模块，每个模块有自己的 `State`、`Getter`、`Mutation`和 `Action`，使不同模块代码分离，便于管理维护

### 3.3 vuex 中的 state 有什么特性？

- `vuex` 就是一个仓库，仓库里面放了很多对象，其中 `state` 就是存放数据源的存放地
- `state` 里面的数据都是响应式的，`vue` 组件从 `store` 中读取数据，若是 `store` 中的数据改变，依赖这个数据的组件也会更新数据
- 它通过 `mapState` 把全局的 `state` 和 `getters` 映射到当前组件的 `computed` 计算属性中

### 3.4 vuex 中的 getters 有什么特性？

- `getter` 可以对 `state` 进行计算操作，可以把它看作 `state` 的计算属性
- 虽然放在组件中也可以做计算属性，但 `getter` 可以在多个组件中复用
- 如果一个状态只在一个组件内使用，是可以不用 `getters`

### 3.5 Vue 中对 Ajax 请求代码应该写在组件的 methods 中还是 vuex 的 actions 中？

- 如果请求的数据是不被其他组件公用的，仅仅在请求的组件内使用，就不需要放入 `vuex` 的 `state` 里
- 如果被其他地方复用，可以将请求放入 `action` 里，方便复用；如果不需要复用这个请求，直接写在 `Vue` 文件里会更方便
