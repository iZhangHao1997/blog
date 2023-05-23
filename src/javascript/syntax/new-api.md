# ES 新语法补充

## Set 和 Map

- Set

`Set` 的基本语法：

```js
// 可不传数组
const set = new Set();
set.add(1);
set.add(2);

console.log(set); // Set(2) { 1, 2 }

// 也可传数组
const set = new Set([1, 2, 3]);
// 增加元素使用 add
set.add(4);
set.add("张豪");
console.log(set); // Set(5) { 1, 2, 3, 4, "张豪" }
```

`Set` 的不重复性

```js
// 增加一个已有元素，则增加无效，会被自动去重
const set1 = new Set([1]);
set1.add(1);
console.log(set1); // Set(1) { 1 }

// 传入的数组中有重复项，会自动去重
const set2 = new Set([1, 2, "张豪", 3, 3, "张豪"]);
console.log(set2); // Set(4) { 1, 2, '张豪', 3 }
```

`Set` 的不重复性中，要注意引用数据类型和 `NaN`

```js
// 两个对象都是不用的指针，所以没法去重
const set1 = new Set([1, {name: '张豪'}, 2, {name: '张豪'}])
console.log(set1) // Set(4) { 1, { name: '张豪' }, 2, { name: '张豪' } }


// 如果是两个对象是同一指针，则能去重
const obj = {name: '张豪'}
const set2 = new Set([1, obj, 2, obj])
console.log(set2) // Set(3) { 1, { name: '张豪' }, 2 }

咱们都知道 NaN !== NaN，NaN是自身不等于自身的，但是在Set中他还是会被去重
const set = new Set([1, NaN, 1, NaN])
console.log(set) // Set(2) { 1, NaN }

```

利用 `Set` 的不重复性，可以实现数组去重

```js
const arr = [1, 2, 3, 4, 4, 5, 5, 66, 9, 1];

// Set可利用扩展运算符转为数组哦
const quchongArr = [...new Set(arr)];
console.log(quchongArr); // [1,  2, 3, 4, 5, 66, 9]
```

- Map

Map 对比 object 最大的好处就是，key 不受类型限制

```js
// 定义map
const map1 = new Map();
// 新增键值对 使用 set(key, value)
map1.set(true, 1);
map1.set(1, 2);
map1.set("哈哈", "嘻嘻嘻");
console.log(map1); // Map(3) { true => 1, 1 => 2, '哈哈' => '嘻嘻嘻' }
// 判断map是否含有某个key 使用 has(key)
console.log(map1.has("哈哈")); // true
// 获取map中某个key对应的value 使用 get(key)
console.log(map1.get(true)); // 2
// 删除map中某个键值对 使用 delete(key)
map1.delete("哈哈");
console.log(map1); // Map(2) { true => 1, 1 => 2 }

// 定义map，也可传入键值对数组集合
const map2 = new Map([
  [true, 1],
  [1, 2],
  ["哈哈", "嘻嘻嘻"],
]);
console.log(map2); // Map(3) { true => 1, 1 => 2, '哈哈' => '嘻嘻嘻' }
```

## 求幂运算符

以前求幂的写法：

```js
const num = Math.pow(3, 2); // 9
```

ES7 提供的求幂运算符：`**`

```js
const num = 3 ** 2; // 9
```

## Object.entries 和 Object.fromEntries

- `Object.entries`

可以用来对象的键值对集合

```js
const obj = {
  name: "张豪",
  age: 24,
  sex: "男",
};

console.log(Object.entries(obj)); // [ [ 'name', '张豪' ], [ 'age', 24 ], [ 'sex', '男' ] ]
```

- `Object.formEntries`

作用和 `Object.entries` 相反

```js
const arr = [
  ["name", "张豪"],
  ["age", 24],
  ["sex", "男"],
];
console.log(Object.fromEntries(arr)); // {name: "张豪", age: 24, sex: "男"}
```

## for await of

`for await of` 是用来遍历异步 Iterator 接口的，。

```js
async function f() {
  for await (const x of createAsyncIterable(["a", "b"])) {
    console.log(x);
  }
}
// a
// b
```

上面代码中，`createAsyncIterable()` 返回一个拥有异步遍历器接口的对象，`for...of` 循环自动调用这个对象的异步遍历器的 `next` 方法，会得到一个 `Promise` 对象。`await` 用来处理这个 `Promise` 对象，一旦 `resolve`，就把得到的值（x）传入 `for...of` 的循环体。

如果 `next` 方法返回的 `Promise` 对象被 `reject`，`for await...of` 就会报错，要用 `try...catch` 捕捉。

## Array.flat

如果有一个二维数组，想让他变成一维数组：

```js
const arr = [1, 2, 3, [4, 5, 6]];
console.log(arr.flat()); // [ 1, 2, 3, 4, 5, 6 ]
```

还可以传参数，传参为降维的次数

```js
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9]]];

console.log(arr.flat(2)); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

如果穿 `Infinity`，则可以将无论几维数组都转化为一维数组

```js
const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [10, 11, 12]]]];

console.log(arr.flat(Infinity)); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

## Array.flatMap

现在给你一个需求

```js
const arr = ["科比 詹姆斯 安东尼", "利拉德 罗斯 麦科勒姆"];
```

将上面数组转为

```js
const arr = ["科比", "詹姆斯", "安东尼", "利拉德", "罗斯", "麦科勒姆"];
```

第一时间想到 `map + flat`

```js
arr.map((item) => item.split(" ")).flat();
```

但是用 `Array.flatMap` 可以一步解决

```js
arr.flatMap((item) => item.split(" "));
```

## String.trimStart && String.trimEnd

`trim` 方法可以清除字符串首尾的空格

```js
const str = "   123   ";
str.trim(); // "123"
str.trimStart(); // "123   "
str.trimEnd(); // "   123"
```

## Promise.allSettled

ES11 新增的 Promise 方法

- 接收一个 Promise 数组，数组中如果有非 Promise 项，则此项当做成功
- 把每一个 Promise 的结果，集合成数组返回

```js
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.allSettled([fn(2000, true), fn(3000), fn(1000)]).then((res) => {
  console.log(res)[
    // 3秒后输出
    ({ status: "fulfilled", value: "2000毫秒后我成功啦！！！" },
    { status: "rejected", reason: "3000毫秒后我失败啦！！！" },
    { status: "rejected", reason: "1000毫秒后我失败啦！！！" })
  ];
});
```

## Primise.any

E12 新增的 Promise 的方法

- 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功
- 如果有一个 Promise 成功，则返回这个成功结果
- 如果所有 Promise 都失败，则报错

```js
// 当有成功的时候，返回最快那个成功
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.any([fn(2000, true), fn(3000), fn(1000, true)]).then(
  (res) => {
    console.log(res); // 1秒后 输出  1000毫秒后我成功啦
  },
  (err) => {
    console.log(err);
  }
);

// 当全都失败时
function fn(time, isResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isResolve
        ? resolve(`${time}毫秒后我成功啦！！！`)
        : reject(`${time}毫秒后我失败啦！！！`);
    }, time);
  });
}

Promise.any([fn(2000), fn(3000), fn(1000)]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err); // 3秒后 报错 all Error
  }
);
```

## 数字分隔符 \_

数字分隔符可以让你在定义长数字时，更加地一目了然

```js
const num = 1000000000;

// 使用数字分隔符
const num = 1_000_000_000;
```
