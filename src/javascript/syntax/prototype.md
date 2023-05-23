---
outline: [2, 4]
---

# 原型和继承

## 原型

### prototype、**\_\_proto\_\_** 和 constructor 的区别

[prototype、\_\_proto\_\_ 和 constructor 的区别](https://blog.csdn.net/cc18868876837/article/details/81211729)

**原型（prototype）**：给其他对象提供共享属性和方法的对象

**\_\_proto\_\_**：所有对象，都存在一个隐式引用，指向它的原型（构造函数的 prototype）

**构造函数（constructor）**：构造函数，它的原型指向实例的原型

总结三者的区别：

1. 我们需要牢记两点：① `__proto__` 和 `constructor` 属性是**对象**所独有的；② `prototype` 属性是**函数**所独有的，因为**函数**也是一种**对象**，所以函数也拥有 `__proto__` 和 `constructor` 属性。
1. `__proto__` 属性的**作用**就是当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的 `__proto__` 属性所指向的那个对象（父对象）里找，一直找，直到 `__proto__` 属性的终点 `null`，再往上找就相当于在 `null` 上取值，会报错。通过 `__proto__` 属性将对象连接起来的这条链路即我们所谓的**原型链**。
1. `prototype` 属性的**作用**就是让该函数所实例化的对象们都可以找到公用的属性和方法，即 `f1.__proto__ === Foo.prototype`。
1. `constructor` 属性的含义就是**指向该对象的构造函数**，所有函数（此时看成对象了）最终的构造函数都指向 **Function**。

其关系如图所示：

<img src="/img/javascript/原型、原型链和构造函数.webp">

图中，`__proto__` 形成的链条组合，就是原型链。

## 继承

**JaveScript** 面向对象的三大特性是：**封装**、**继承**、**多态**，我们从这三个方面理解**继承**。

继续复习原型的基本概念：

```js
// 1. 构造函数
function Cat(name) {
  this.name = name;
}

// 2. 构造函数的原型对象
Cat.prototype;

// 3. 使用 Cat 构造函数创建实例'喵喵'
var miaomiao = new Cat("喵喵");

// 4. 构造函数的静态方法 fn
Cat.fn = function () {};

// 5. 原型对象上的方法 fn
Cat.prototype.fn = function () {};
```

<img src="/img/javascript/图5.2.png">

### 封装

**封装**是什么意思：把客观事物封装成抽象的类，隐藏属性和方法，仅对外公开接口。

#### ES6 之前的封装——构造函数

我们都知道 ES6 的 `class` 实质就是一个语法糖，在 ES6 之前，JS 是没有类这个概念的，因此是借助于 **原型对象** 和 **构造函数** 来实现。

1. **私有**属性和方法：只能在构造函数内访问不能被外部所访问（在构造函数内使用 `var`、`const`、`let` 声明的属性）
1. **公有**属性和方法（或实例方法）：对象外可以访问到的对象内的属性和方法（在构造函数内使用 `this` 设置，或者设置在构造函数的原型对象上，比如：`Cat.prototype.xxx = xxx`）
1. **静态**属性和方法：定义在构造函数上的方法（比如 `Cat.xxx = xxx`），不需要实例就可以调用（比如 `Object.assign(targetObj, sourceObj)`）

##### 一、理解私有属性方法和共有属性方法

比如我现在想要封装一个生产出猫，名为 `Cat` 的构造函数。

- 由于猫的心和胃都是我们肉眼看不见的，所以我把它们设置为**私有**属性(隐藏起来)
- 并且猫的心跳我们也是看不到的，所以我把它设置为**私有**方法(隐藏起来)
- 然后猫的毛色是可以看见的，所以我把它设置为**公有**属性
- 猫跳起来这个动作我们是看的到的，所以我把它设置为**公有**方法

```js
function Cat(name, color) {
  // 公有名字、毛色属性
  this.name = name;
  this.color = color;

  // 猫的私有属性'心'和胃
  var heart = "心";
  var stomach = "胃";
  // 猫的私有方法'心跳'
  var heartbeat = function () {
    console.log(heart + "跳");
  };

  // 公有方法'跳'
  this.jump = function () {
    heartbeat();
    console.log(this.name + "跳");
  };
}

const miaomiao = new Cat("喵喵", "狸花");
console.log(miaomiao); // Cat {name: "喵喵", color: "狸花", jump: f}
miaomiao.jump(); // 心跳 喵喵跳
```

可以看到我们打印的 `喵喵` 小猫只有 `name`、`color`、`jump` 三个属性可以被看到（可以被访问），所以其公有属性就是：

- `name`
- `color`
- `jump`

而私有属性是看不到的：

- `heart`
- `stomach`
- `heartbeat`

所以如果你有想要直接使用是不能的：

```js
// 私有属性
console.log(miaomiao.heart); // undefined
console.log(miaomiao.stomach); // undefined
guaiguai.heartbeat(); // Uncaught TypeError: miaomiao.heartbeat is not a function
```

**小结：**

- 在函数内用 `var`、`const`、`let` 定义的就是私有的；
- 在函数内使用 `this` 的就是公有的

##### 二、理解静态属性方法和公有属性方法

还是刚才的例子

我们现在往刚刚的 `Cat` 构造函数中加些东西。

我们需要对 `Cat` 这个构造函数加一个描述，表明它是用来生产猫的，所以我把 `description` 设置为它的静态属性
由于一听到猫这种动物就觉得它会卖萌，所以我把**卖萌**这个动作设置为它的静态方法
由于猫都会用唾液清洁身体，所以我把**清洁**身体这个动作设置为它的公有方法

```js
// 在上面的基础上新加代码
Cat.description = "产生猫的构造函数";
Cat.cute = function () {
  console.log("小猫卖萌");
};
Cat.prototype.clean = function () {
  console.log("小猫清洁身体");
};

// 新建一直小猫
const miaomiao = new Cat("喵喵", "狸花");

console.log(Cat.description); // "产生猫的构造函数"
Cat.cute(); // "小猫卖萌"
console.log(miaomiao.descrition); // undefined
miaomiao.clean(); // "小猫清洁身体"
```

通过代码可以发现，`description`、`cute` 都是构造函数 `Cat` 上的方法，可以直接被 `Cat` 调用，为静态属性和静态方法；

但 `description`、`cute` 并不能存在于 `乖乖` 这个实例上，实例上实际上并不存在这个方法和属性，所以打印出来 `undefined`；

但是我们定义的 `clean` 方法是在 `Cat` 的原型对象 `prototype` 上面的，属于 `Cat` 的公有方法（实例方法），所以 `miaomiao` 这个示例可以调用。

**小结：**

- 在构造函数上使用的 `Cat.xxx` 定义的是静态属性和方法
- 在构造函数内使用 `this` 设置，或者在构造函数的原型对象 `Cat.prototype` 上设置，就是公有属性和方法（实例方法）

**静态方法和示例方法例子：**

- `Promise.all()`、`Promise.race()`、`Object.assign()`；
- `push`、`shift` 实际上就是存在原型对象上的：`Array.prototype.push`、`Array.prototype.shift`

##### 三、理解实例自身属性和定义在构造函数原型对象中的属性的区别

通过上面我们知道了 `this.xxx` 和 `Cat.prototpe.xxx = xxx` 都是属于 `miaomiao` 上的公有属性，那么有什么区别吗？

```js
function Cat(name) {
  this.name = name;
}

Cat.prototype.description = "我是创造猫的构造函数";

var miaomiao = new Cat("喵喵");

console.log(miaomiao); // Cat {name: "喵喵", __proto__: Object}
console.log(miaomiao.name); // 喵喵
console.log(miaomiao.description); // 我是创造猫的构造函数
```

可以看到使用 `this` 定义的 `name` 属性可以通过 `miaomiao` 实例直接访问，而通过 `Cat.prototype` 定义的 `description` 属性是在 `miaomiao.__proto__` 下的，也就是 `Cat.prototype` 下面属性，虽然没有出现在 `miaomiao` 实例中，但是可以访问和调用的。

**小结：**

- 定义在构造函数原型对象上的属性和方法不直接表现在实例对象上，但是实例对象可以访问和调用（实质上通过 `__proto__` ）它们 。

##### 四、如何区分**实例自身的属性**和**定义在构造函数原型对象中的属性**

```js
function Cat(name) {
  this.name = name;
}
Cat.prototype.clean = function () {
  console.log("小猫清洁身体");
};
var miaomiao = new Cat("喵喵");

for (key in miaomiao) {
  if (miaomiao.hasOwnProperty(key)) {
    console.log("我是自身属性", key); // 我是自身属性 name
  } else {
    console.log("我不是自身属性", key); // 我不是自身属性 clean
  }
}

console.log(Object.keys(miaomiao)); // ["name"]
console.log(Object.getOwnPropertyNames(miaomiao)); // ["name"]
```

上例我们通过 `for...in...`、`hasOwnProperty()`、`Object.keys()`、`getOwnPropertyNames()` 遍历 `miaomiao` 上的属性名，可以看到：

- `for...in...` 可以获取到实例对象自身和原型链上的属性
- 可以通过 `hasOwnProperty()` 判断该属性是否属于实例对象自身
- `Object.keys()` 只能获取实例自身的属性
- `Object.getOwnPropertyNames()` 只能获取自身的属性

##### 五、练习

请回答下面代码会输出什么：

```js
function Person(name, sex) {
  this.name = name;
  this.sex = sex;
  var evil = "我很邪恶";
  var pickNose = function () {
    console.log("我会扣鼻子但不让你看见");
  };
  this.drawing = function (type) {
    console.log("我要画一幅" + type);
  };
}

Person.fight = function () {
  console.log("打架");
};

Person.prototype.wc = function () {
  console.log("我是个人我会wc");
};
var p1 = new Person("rookie", "boy");

console.log(p1.name);
console.log(p1.evil);
p1.drawing("国画");
p1.pickNose();
p1.fight();
p1.wc();
Person.fight();
Person.wc();
console.log(Person.sex);
```

答案：

```
"rookie"
undefined
"我要画一幅国画"
Uncaught TypeError: p1.pickNose is not a function
Uncaught TypeError: p1.fight is not a function
"我是个人我会wc"
"打架"
Uncaught TypeError: Person.wc is not a function
undefined
```

如果出错了请再理解上面提供理解的代码哦；**注意**：调用或使用不存在的属性会是 `undefined`，但是如果调用不存在的方法则会报错。

##### 六、如果构造函数和实例对象上存在相同名称的属性

```js
function Person() {
  this.sex = "男性";
}
Person.prototype.sex = "女性";
var person = new Person();
console.log(person.sex); // 男性
```

可以看到当我们使用 `person` 实例对象上的属性时，是使用自身的 `sex` 属性。
这也很好理解：当 `person` 寻找属性时，总是先从自身对象上寻找，如果寻找不到，才会到 `__proto__` 原型链上寻找，直到原型链为 `null`，如果原型链上也不存在该属性，则为 `undefined`，这也就是**原型链查找**。

再比如：

```js
function Cat() {
  this.color = "white";
  this.getColor = function () {
    console.log(this.color);
  };
}
Cat.prototype.color = "black";
Object.prototype.color = "red";
Object.prototype.type = "布偶猫";

var cat = new Cat();
console.log(cat.color); // white
console.log(cat.type); // 布偶猫
```

再通过这个例子可以加深理解原型链。

##### 七、总结

- 私有、公有、静态属性和方法
  - **私有**属性和方法：在构造函数内部调用和访问，在构造函数内使用 `var` 声明的属性
  - **公有**属性和方法：在构造函数内使用 `this` 设置，或者通过构造函数的原型对象 `Cat.prototype` 设置；
  - **静态**属性和方法：定义在构造函数上的方法 `Cat.xxx` 或者 `Object.assign()`，不需要通过实例可以调用
- 实例对象上和构造函数原型对象上的属性和方法
  - 构造函数原型对象上的属性和方法虽然没有直接表现在实例对象上，但是可以（隐式通过 `__proto__`） 访问和调用它们
  - 当访问一个对象的属性/方法时，它不仅仅存在该对象上查找，还会查找该对象的原型，一层一层向上查找，直到达到原型链的末尾 `null`
- 遍历实例对象属性的三种方法
  - `for...in...` 可以遍历自身和原型链上的属性
  - 可以通过 `Object.hasOwnProperty()` 方法传入属性名判断是否属于该实例
  - 可以使用 `Object.keys()` 和 `Object.getOwnPropertyNames()` 获取到实例自身上的属性（以数组形式返回）

#### ES6 之后的封装——class

在 ES6 标准中，新增了 `class` 这个关键字。

它可以用来代替构造函数，达到创建“一类实例”的效果。

并且类的数据类型就是函数，所以用法上和构造函数很像，直接通过 `new` 命令来创建一个实例。

还有一件事可能是我们不知道的：**类所有的方法都定义在类的 prototype 属性上面**。

例如：

```js
class Cat {
  constructor() {};
  toString() {};
  toValue() {};
}
// 等同于
function Cat () {};
Cat.prototype = {
  constructor() {};
  toString() {};
  toValue() {};
};
```

##### 一、理解 class 关键字

我们把 ES6 之前的封装版本使用 ES6 之后的 `class` 关键字进行更改：

```js
class Cat {
  constructor(name, color) {
    this.name = name;
    this.color = color;

    var heart = "心";
    var stomach = "胃";
    var heartbeat = function () {
      console.log(heart + "跳");
    };

    // 公有方法'跳'
    this.jump = function () {
      heartbeat();
      console.log(this.name + "跳");
    };
  }
}

var miaomiao = new Cat("喵喵", "狸花");
console.log(miaomiao);
miaomiao.jump();
```

可以发现实际上当我们调用 `Cat` 时，`class Cat` 会默认执行构造函数，并构造出一个新的实例对象 `this` 并将他返回，因此它被称为 `constructor` 构造方法（函数）。

（另外，如果 `class` 没有定义 `constructor` ，也会隐式生成一个 `constructor` 方法）

公有（实例）属性和方法：

- `name`
- `color`
- `jump`

其实 `heart`、`stomach` 就不应该叫做私有属性了，只不过被局限于 `constructor` 这个构造函数中，是这个作用域下的变量而已。

控制台打印结果：

```
Cat {name: "喵喵", color: "狸花", jump: ƒ}
心跳
喵喵跳
```

##### 二、弄懂在类中定义属性或方法的几种方式

```js
class Cat {
  constructor() {
    // 猫的私有属性'心'和胃
    var heart = "心";
    // 猫的私有方法'心跳'
    var heartbeat = function () {
      console.log(heart + "跳");
    };

    // 公有方法'跳'
    this.jump = function () {
      heartbeat();
      console.log(this.name + "跳");
    };
  }

  color = "布偶";
  clean = function () {
    console.log("小猫清洁身体");
  };
  description() {
    console.log("创造猫");
  }
}

var miaomiao = new Cat();
console.log(miaomiao); // Cat {color: "布偶", clean: ƒ, jump: ƒ}
console.log(Object.keys(miaomiao)); // ["color", "clean", "jump"]

miaomiao.clean(); // 小猫清洁身体
miaomiao.description(); // 创造猫
```

可以看出：

- 在 `constructor` 中 `var` 定义一个变量，它只存在于 `constructor` 这个构造函数中
- 在 `constructor` 中 `this` 定义的属性和方法会挂载到实例上
- 在 `class` 中使用 `=` 定义一个方法和属性，效果和第二点相同，会定义到实例上
- 在 `class` 中直接定义一个方法，会添加到原型对象 `prototype` 上

解析：

- `heart` 只能在 `constuctor` 函数中使用，所以不会出现在实例中
- `color`、`clean`、`jump` 满足第二和第三点，出现在实例中
- `description` 是直接定义的，满足第四点，添加到原型对象 `Cat.prototype` 上，因此不会被 `Object.keys()`、`Object.getOwnPropertyNames()`这些获取实例自身属性的方法获取到
- `descrption` 虽然在原型对象中，但是还是能被实例所调用

那么，为什么 `clean = function() {}` 和 `description() {}` 都是在 `class` 内定义的方法，为什么一个会出现在实例中，一个却在原型对象 `prototype` 上呢？

其实我们不用特地去记，只需要记住：**在类的所有方法都定义在类的 `prototype` 属性上面**。

这里的 `clean` 和 `color` 一样都是用 `=` 设置的，都是一个普通的变量，只不过 `clean` 这个变量是个函数，所以它并不算是定义在类上的函数，因此不会存在于原型对象上。

而 `description() {}` 和 `constructor() {}` 一样，都是定义在类上的方法，因此都会存在于原型对象 `prototype` 上。

转化成伪代码：

```js
class Cat {
  constructor() {}
  description() {}
}

// 等同于
function Cat() {}
Cat.prototype = {
  constructor() {}
  description() {}
}
```

##### 三、在 `class` 定义的静态属性和方法

在前面我们给 `Cat` 定义静态属性和方法都是采用这种方式：`Cat.xxx`

```js
function Cat() {
  // ...
}

Cat.description = function () {};
```

在 `class` 中我们也可以通过 `Cat.xxx` 这种方式定义，除此之外，我们还可以使用 `static` 标识符来表示它是一个静态属性或方法：

```js
class Cat {
  static description = '创造猫',
  static clean() {
    console.log('清洁身体');
  }
}

console.log(Cat.description); // 创造猫
Cat.clean(); // 清洁身体
```

紧接着我们看着一道题目：

```js
class Cat {
  constructor(name, color) {
    var heart = "心";
    var stomach = "胃";
    var heartbeat = function () {
      console.log(heart + "跳");
    };
    this.name = name;
    this.color = color;
    heartbeat();
    this.jump = function () {
      console.log(this);
      console.log("我跳起来了~来追我啊");
    };
  }

  cleanTheBody = function () {
    console.log("我会用唾液清洁身体");
  };
  static descript = "我这个类是用来生产出一只猫的";
  static actingCute() {
    console.log(this);
    console.log("一听到猫我就想到了它会卖萌");
  }
}

Cat.staticName = "staticName";
var miaomiao = new Cat("喵喵", "white"); // 心跳
console.log(miaomiao); // Cat {name: "喵喵", color: "white", jump: f, cleanTheBody: f}
miaomiao.jump(); // Cat {name: "喵喵", color: "white", jump: f, cleanTheBody: f} , 我挑起来了~来追我啊
miaomiao.cleanTheBody(); // 我会用唾液清洁身体
console.log(miaomiao.descript); // undefined
// miaomiao.actingCute() // Uncaught TypeError: miaomiao.actingCute is not a function
Cat.actingCute(); // Class Cat {...} 一听到猫我就想到了它会卖萌
console.log(Cat.descript); // 我这个类是用来生产出一只猫的
console.log(Cat.staticName); // staticName
```

##### 四、坑一

```js
var a = new A();
function A() {}
console.log(a);

var b = new B();
class B {}
console.log(b);
```

开始的预想为：

```
A{}
B{}
```

实际结果：

```
A {}
Uncaught ReferenceError: Cannot access 'B' before initialization
```

那是因为函数 `A` 是会被提升到作用域的最顶层，所以可以在定义函数 `A` 之前使用 `new A()`。

**但是类却不存在这种提升机制**，所以当我们执行 `new B()` 的时候就会报错：在 `B` 初始化之前不能使用它。

尽管我们直到，`class` 的本质是一个函数：

```js
console.log(typeof B); // function
```

##### 五、坑二

```js
class Cat {
  constructor() {
    this.name = "guaiguai";
    var type = "constructor";
  }
  type = "class";
  getType = function () {
    console.log(this.type);
    console.log(type);
  };
}

var type = "window";
var guaiguai = new Cat();
guaiguai.getType();
```

这是一道考察作用域和 `class` 内定义属性和方法的题目。

1. 首先 `Cat` 类在 `consctructor` 内使用 `var` 定义了一个 `type`，然后在 `class` 里面定义了一个变量 `type`，然后再在全局作用域中 `var` 定义了一个 `type`。
1. 我们实例化了 `Cat`，并调用实例里面的 `getType()` 方法，打印 `this.type` 和 `type`。
1. 首先是 `guaiguai` 实例调用的 `getType()` 方法，那么 `getType` 方法里面的 `this` 就会指向 `guaiguai` 实例，实际上 `guaiguai` 实例上的 `type` 是定义在构造函数外的 `type = 'class'` 的变量，而不是在 `consctructor` 里面用 `var` 声明的变量；
1. 然后再打印 `type` 变量：在 `getType` 方法里面是没有 `type` 变量的（考察作用域，无法获取到 `constructor` 里面的 `type`），最后在全局作用域中找到 `type`，即 'window'；
1. 所以会输出 `class`、`window`。

##### 六、坑三

假如我们把上一题的 `getType()` 方法换成箭头函数，又会输出什么？

```js
class Cat {
  constructor() {
    this.name = "guaiguai";
    var type = "constructor";
  }
  type = "class";
  getType = () => {
    console.log(this.type);
    console.log(type);
  };
}

var type = "window";

var guaiguai = new Cat();

guaiguai.getType();
```

答案还是不变的；因为箭头函数**箭头函数内的 this 是由外层作用域决定的**，所以 `this.type` 指向 `guaiguai.type`（注意 `class` 类的本质是个函数）。

##### 七、如果 `class` 中存在两个相同的属性或者方法会怎么样？

```js
class Cat {
  constructor() {
    this.name = "喵喵";
  }
  name = "乖乖";
}
var cat = new Cat();

console.log(cat.name); // 喵喵
```

可以看到 `constructor` 里面的属性是会覆盖 `class` 里定义的属性的。

**class 总结**

- `class` 的基本概念：
  - 当你使用 `class` 的时候，它会默认调用 `constructor` 这个函数，来接收一些参数，并构造出一个新的实例对象 `this` 并将它返回。
  - 如果你的 `class`没有定义 `constructor` ，也会隐式生成一个 `constructor` 方法
- `class` 中几种定义属性的区别：
  - 在 `constructor` 中 `var` 一个变量，它只存在于`constructor` 这个构造函数中
  - 在 `constructor`中使用 `this`定义的属性和方法会被定义到实例上
  - 在 `class`中使用 `=`来定义一个属性和方法，效果与第二点相同，会被定义到实例上
  - 在 `class`中直接定义一个方法，会被添加到原型对象 `prototype`上
  - 在 `class`中使用了 `static`修饰符定义的属性和方法被认为是静态的，被添加到类本身，不会添加到实例上
- other:
  - `class` 本质虽然是个函数，但是并不会像函数一样提升至作用域最顶层
  - 如遇 `class`中箭头函数等题目请参照构造函数来处理
  - 使用 `class` 生成的实例对象，也会有沿着原型链查找的功能

### 继承

**学习网站：**[做完这 48 道题彻底弄懂 JS 继承(1.7w 字含辛整理-返璞归真)](https://juejin.im/post/5e75e22951882549027687f9)

**继承就是子类可以使用父类所有功能，并且对这些功能进行扩展。**

#### 原型链继承

将子类的原型对象指向父类的实例。

##### 一、理解原型链继承的概念

```js
function Parent() {
  this.name = "Parent";
  this.sex = "boy";
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child() {
  this.name = "child";
}
Child.prototype = new Parent();

var child1 = new Child();
child1.getName(); // child
console.log(child1); // Child {name: "child"}
```

图解：

<img src="/img/javascript/图5.2.2.1.png" />

这种方式就叫做**原型链继承**。

伪代码：

```js
Child.prototype = new Parent();
```

当然，更加严谨一点的做法其实还有一步：`Child.prototype.constructor = Child`，到后面中我们再来详细说它。

**注意：** 原型链继承不是 `Child.prototype = Parent.prototype`，根据 `new` 实例的过程，当我们 `new` 一个 `Child` 实例时，是执行 `Child` 构造函数，因此 `Parent` 构造函数的 `sex` 属性我们是拿不到的，因此这种方法是无法获取父类的属性和方法的。

##### 二、理解原型链继承的优点和缺点

```js
function Parent(name) {
  this.name = name;
  this.sex = "boy";
  this.colors = ["white", "black"];
}
function Child() {
  this.feature = ["cute"];
}
var parent = new Parent("parent");
Child.prototype = parent;

var child1 = new Child("child1");
child1.sex = "girl";
child1.colors.push("yellow");
child1.feature.push("sunshine");

var child2 = new Child("child2");

console.log(child1); //
console.log(child2);

console.log(child1.name);
console.log(child2.colors);

console.log(parent);
```

**答案：**

```js
Child{ feature: ['cute', 'sunshine'], sex: 'girl' }
Child{ feature: ['cute'] }

'parent'
['white', 'black', 'yellow']

Parent {name: "parent", sex: 'boy', colors: ['white', 'black', 'yellow'] }
```

**原型链继承总结：**

- 优点
  - 继承了父类模板，又继承了父类的原型对象
- 缺点
  - 如果给子类的原型上上新增属性和方法，必须放在 `Child.prototype = new Parent()` 这样的语句后面
  - 无法实现多继承(因为已经指定原型对象了)
  - 来自于原型对象的所有属性和方法是共享的，互相干扰
  - 创建子类时，无法向父类的构造函数传参

#### 构造继承

了解了最简单的**原型链继承**后，再来看**构造继承**，也叫**构造函数继承**。

在子类构造函数内部使用 `call` 或 `apply` 来调用父类构造函数。

##### 一、构造（函数）继承的基本原理

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "child");
}
var child1 = new Child();
console.log(child1); // Child {sex: "boy", name: "child"}
```

> 如果还不了解 `this`、`apply`、`call` 和 `bind`，请去上面了解。

##### 二、继续理解

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "good boy");
  this.name = "bad boy";
}
var child1 = new Child();
console.log(child1); // Child{sex: "boy", name: "bad boy"}
```

这相当于重复定义了两个相同的属性名，自然是后面的覆盖前面的。

##### 三、构造继承的优点————解决了原型继承子类共享父类引用对象的问题，可以向父类传递参数

```js
function Parent(name, sex) {
  this.name = name;
  this.sex = sex;
  this.colors = ["white", "black"];
}
function Child(name, sex) {
  Parent.call(this, name, sex);
}
var child1 = new Child("child1", "boy");
child1.colors.push("yellow");

var child2 = new Child("child2", "girl");
console.log(child1);
console.log(child2);
```

结果：

```js
Child{ name: 'child1', sex: 'boy', colors: ['white', 'black', 'yellow'] }
Child{ name: 'child2', sex: 'girl', colors: ['white', 'black'] }
```

使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类。

所以现在 `child1` 和 `child2` 现在分别有它们各自的 `colors` 了，就不共享了，而且这种拷贝属于深拷贝。

因此我们可以得出**构造继承**的优点：

- 解决了原型链继承中子类实例共享父类引用对象的问题，实现多继承，创建字类实例时，可以向父类传递参数

##### 四、构造继承的缺点一————无法调用父类原型上的属性和方法

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child() {
  this.sex = "boy";
  Parent.call(this, "good boy");
}
Child.prototype.getSex = function () {
  console.log(this.sex);
};
var child1 = new Child();
console.log(child1);
child1.getSex();
child1.getName();
```

结果：

```js
Child {sex: "boy", name: "good boy"}
'boy'
Uncaught TypeError: child1.getName is not a function
```

- `sex`、`name` 属性都很好理解
- `getSex` 属于 `Child` 构造函数原型对象的方法，所以我们也能够使用
- `getName` 属于父类构造函数原型对象上的方法，我们只是执行了父类构造函数，复制了父类构造函数里的属性和方法，并没有复制原型对象，自然是无法调用父类构造函数原型对象里的属性和方法的

所以**构造继承**的缺点：

- 构造继承只能继承父类的实例的属性和方法，不能继承父类原型的属性和方法

##### 五、构造继承的缺点二————实例只是子类的实例，不是父类的实例

它的第二个缺点是：实例并不是父类的实例，只是子类的实例。

```js
function Parent(name) {
  this.name = name;
}
function Child() {
  this.sex = "boy";
  Parent.call(this, "child");
}
var child1 = new Child();

console.log(child1);
console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
console.log(child1 instanceof Object);
```

结果：

```js
Child {sex: "boy", name: "child"}
true
false
true
```

##### 六、构造继承缺点三————无法实现函数复用

```js
function Parent(name) {
  this.name = name;
  this.say = function () {
    console.say(this.name);
  };
}

function Child(sex) {
  this.sex = sex || "boy";
  Parent.call(this, "tony");
}
```

会重复定义 `say` 方法，其实更好的做法时把方法定义在 `Parent.prototype` 中，每个实例自动继承这个方法，不用在构造函数中重复写。

##### 七、总结

- 优点
  - 解决了原型链继承中子类实例共享父类引用对象的问题
  - 可以多继承
  - 创建子类实例时，可以向父类构造函数传递参数
- 缺点
  - 不能调用父类原型上的属性和方法
  - 子类实例并不是父类的实例，只是子类的实例
  - **无法实现函数复用**，每个子类都有父类实例函数的副本，影响性能

#### 组合继承

出现**组合继承**的原因就是因为**原型链继承**和**构造继承**都有各自的缺点，那么我们就会想把两种方式组合在一起。

**思路：**

- 使用**原型链继承**使子类能够使用父类原型中的属性和方法
- 使用**构造继承**使子类能够使用父类实例中的属性和方法

##### 一、理解组成继承的基本使用

**实现：**

- 使用 `call/apply` 在子类构造函数中调用父类构造函数
- 将子类的构造函数的原型对象指向一个父类的匿名实例
- 修正子类构造函数原型对象的 `constructor` 属性，将它指向子类构造函数

##### 二、理解 `constructor` 有什么作用

上面的组合继承的 1、2 点都很好理解和实现，那么第三点的 `constructor` 有什么用呢？

可以看一下 `constructor` 存在的位置：

<img src="/img/javascript/图5.2.2.3.png">

它实际上就是构造函数原型对象上的一个属性，指向构造函数。

```js
cat.__proto__ === Cat.prototype; // true
cat.__proto__.constructor === cat; // true
Cat.prototype.constructor === Cat; // true
```

答案

```js
Parent(name) {}
Parent(name) {}
```

当我们想要获取 `child1.constructor`，肯定是向上查找，通过 `__proto__` 找它构造函数的原型对象匿名实例。
但是匿名实例它自身是没有 `constructor` 属性的呀，它只是 `Parent` 构造函数创建出来的一个对象而已，所以它也会继续向上查找，然后就找到了 `Parent` 原型对象上的 `constructor`，也就是`Parent` 了。

所以回过头来看看这句话：
**`construcotr` 它不过是给我们一个提示，用来标示实例对象是由哪个构造函数创建的。**

从人(常)性(理)的角度上来看，`child1` 是 `Child`构建的，`parent1` 是 `Parent` 构建的。

那么 `child1`它的 `constructor` 就应该是 `Child` 呀，但是现在却变成了 `Parent`，貌似并不太符合常理啊。

所以才有了这么一句：

```js
Child.prototype.constructor = Child;
```

用于修复 `constructor` 指向。

（为什么在**组合继承**中修复了 `constructor`，在**原型链继承**中没有，这个取决于我们自己，因为 `constructor` 属性实际上没有什么作用，不过面试官问到还是要知道的）

总的来说：

- `construtor` 是构造函数原型对象中的一个属性，正常情况下指向构造函数本身
- 它并不会影响 `JS` 内部属性，只是用来标识一下某个实例属性是由哪个构造函数产生而已
- 如果我们使用**原型链继承**或者**组成继承**无意间修改了 `constructor` 的指向，那么出于变成习惯，我们最好将它修改为正确的构造函数。

##### 三、理解组合继承的优点

```js
function Parent(name, colors) {
  this.name = name;
  this.colors = colors;
}
Parent.prototype.features = ["cute"];
function Child(name, colors) {
  this.sex = "boy";
  Parent.apply(this, [name, colors]);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child("child1", ["white"]);
child1.colors.push("yellow");
child1.features.push("sunshine");
var child2 = new Child("child2", ["black"]);

console.log(child1);
console.log(child2);
console.log(Child.prototype);

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

可以看出，**组合继承**的优点其实是两种继承方式的优点结合：

- 继承了父类实例中的属性和方法，也能够继承父类原型中的属性和方法
- 你补了原型链继承中引用属性共享的问题
- 可传参

##### 四、理解组成继承的缺点

```js
function Parent(name) {
  console.log(name); // 这里有个console.log()
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
Child.prototype = new Parent();
var child1 = new Child("child1");

console.log(child1);
console.log(Child.prototype);
```

结果：

```js
undefined
'child1'

Child{ name: 'child1' }
Parent{ name: undefined }
```

可以看到虽然我们只调用了 `new Child()` 一次，但打印了两次 `name`：

- 一次是**原型链继承** `new Parent` 的时候打印的
- 一次是**构造函数继承**，`Parent.call(this)` 执行的

也就是说，会重复两次调用父类构造函数，同时又有 `Child.prototype = new Parent()` 和 `Parent.call()`，那么 `Child.prototype` 中会有一份和子类实例一摸一样的属性，就比如这里的 `name: undefined`，可是我们子类实例已经有一份 `name: "child1"` 了，这显然是凭空多出来且无用的属性，占用了内存。

所以我们看出**组合继承**的缺点：

- 重复调用两次父类构造函数，然而子类中的属性会覆盖父类原型上的属性和方法，造成内存浪费，降低性能。

##### 五、总结

**实现方式：**

- 使用**原型链继承**来保证子类能继承到父类原型中的属性和方法
- 使用**构造继承**来保证子类能继承到父类的实例属性和方法

**优点：**

- 可以继承父类实例属性和方法，也能够继承父类原型属性和方法
- 弥补了原型链继承中引用属性共享的问题
- 可传参

**缺点：**

- 使用组合继承时，父类构造函数会被调用两次
- 并且生成了两个实例，子类实例中的属性和方法会覆盖父类原型(父类实例)上的属性和方法，所以增加了不必要的内存。

`constructor` 总结：

`constructor` 它是构造函数原型对象中的一个属性，正常情况下它指向的是原型对象。
它并不会影响任何 JS 内部属性，只是用来标示一下某个实例是由哪个构造函数产生的而已。
如果我们使用了原型链继承或者组合继承无意间修改了 `constructor` 的指向，那么出于编程习惯，我们最好将它修改为正确的构造函数。

#### 寄生组合继承

由于上面的**组合继承**存在调用两次父类构造函数，产生两个实例，父类实例上会有无用废弃属性的缺点，所以我们要直接跳过父类实例上的属性，而让我们直接就能继承父类原型链上的属性。

也就是说，我们需要一个**干净的实例对象**，来作为子类的原型。并且这个干净的实例对象还得能继承父类原型对象的属性。

所以就要使用 `Object.create()` 方法。

```js
Object.create(proto, propertiesObject);
```

- 参数一，需要指定的原型对象
- 参数二，可选参数，给新对象自身添加新属性以及描述器

第一个参数 `proto` 作用是指定你要创建的这个对象的它的原型对象是谁。

##### 一、理解寄生组合式继承

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  this.sex = "boy";
  Parent.call(this, name);
}
// 与组合继承的区别
Child.prototype = Object.create(Parent.prototype);

var child1 = new Child("child1");

console.log(child1);
child1.getName();

console.log(child1.__proto__); // Parent{}
console.log(Object.create(null)); // {}
console.log(new Object()); // {}
```

上面这个代码就是**寄生组合继承**，它与组合继承的区别就是 `Child.prototype` 不同。

我们使用了 `Object.create(parent.prototype)` 创建了一个空的对象，并且这个对象的 `__proto__` 指向 `Parent.prototype` 的。

<img src="/img/javascript/图5.2.2.4.png">

可以看到 `Prent()` 与 `child` 没有任何关系了。

理解打印的三个空对象：

- 第一个空对象中包含了 `__proto__` 属性，实际上就是 `Parent.prototype`，也就是 `Object.create(Parent.prototype)` 创建的新对象，这个新对象的 `__proto__` 指向 `Parent.prototype`，所以 `Child` 实例就能够使用 `Parent.protype` 上的方法
- 完全的空对象，连这个对象中的 `__proto__` 属性都是 `null`，连 `Object.prototype` 上的方法都不能使用（如 `toString()`、`hasOwnProperty()`）
- 空对象，但是它的 `__proto__` 是 `Object.prototype`，所以可以使用 `Object` 的相关方法

##### 二、总结

**寄生组合继承**算是 `ES6` 之前一种比较完美的继承方式，避免了组成继承中两次调用父类构造函数，初始化两次实例属性的缺点，所以有了上述所有继承方式的优点：

- 只调用一次父类构造函数，只创建了一份父类属性
- 子类可以使用父类原型链上的方法和属性
- 子类能够正常地使用 `instanceoOf` 和 `isPropertypeOf` 方法

#### 原型式继承

算是翻了很多关于 `JS` 继承的文章吧，其中百分之九十都是这样介绍**原型式继承**

该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

伪代码如下：

(后面会细讲)

```js
function objcet(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

复制代码开始以为是多神秘的东西，但后来真正了解了它之后感觉用的应该不多吧... 😢
先来看看题目一。

##### 一、题目一

```js
var cat = {
  heart: "心",
  colors: ["white", "black"],
};

var guaiguai = Object.create(cat);
var huaihuai = Object.create(cat);

console.log(guaiguai);
console.log(huaihuai);

console.log(guaiguai.heart);
console.log(huaihuai.colors);
```

执行结果：

```js
{
}
{
}

("心");
colors: ["white", "black"];
```

这里用 `Object.create()` 方法创建一个新对象，它的 `__proto__` 属性指向 `cat` 对象，实际上是一个空对象，`guaiguai` 和 `huaihuai` 都是一只“空猫”。

##### 二、题目二

不怕你笑话，上面 👆 说的这种方式就是原型式继承，只不过在 `ES5` 之前，还没有 `Object.create()` 方法，所以就会用开头介绍的那段伪代码来代替它。

将上例改造一下，让我们自己来实现一个 `Object.create()`。

我们就将要实现的函数命名为 `create()`。

想想 `Object.create()` 的作用：

- 它接受的是一个对象
- 返回的是一个新对象，
- 新对象的原型链中必须能找到传进来的对象

所以就有了这么一个方法：

```js
function create(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

那为什么不能这样实现呢？

```js
function create(obj) {
  var newObj = {};
  newObj.__proto__ = obj;
  return newObj;
}
```

请注意了，我们是要模拟 `Object.create()` 方法，如果你都能使用 `__proto__`，那为何不干脆使用 `Object.create()` 呢？（它们是同一时期的产物）

##### 三、原型式继承总结

**实现方式：**
该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

在 `ES5` 之后可以直接使用 `Object.create()` 方法来实现，而在这之前只能手动实现。

**优点：**

- 在不用创建构造函数的情况下，实现了原型链继承，代码量减少一部分

**缺点：**

- 一些引用数据操作的时候会出现问题，两个实例会公用继承实例的引用数据类
- 谨慎定义方法， 以免定义方法也继承对象原型的方法重名
- 无法直接给父级构造函数使用参数

#### 寄生式继承

其实这个**寄生式继承**也没什么东西，就是在**原型式继承**的基础上再封装一层，来增强对象，之后再将这个对象返回。

伪代码：

```js
function createAnother(origin) {
  var clone = Object.create(origin); // 通过 Object.create() 函数创建一个新对象
  clone.fn = function () {}; // 以某种形式来增强这个对象
  return clone; // 返回这个对象
}
```

##### 一、了解寄生式继承的使用方式

例如我想要继承某个对象上的属性，同时又想在新创建的对象上新增上一些其他属性。

来看下面两只猫咪：

```js
var cat = {
  heart: "❤️",
  colors: ["white", "black"],
};
function createAnother(original) {
  var clone = Object.create(original);
  clone.activingCute = function () {
    console.log("我是一只会卖萌的猫咪");
  };
  return clone;
}
var guaiguai = createAnother(cat);
var huaihuai = Object.create(cat);

guaiguai.activingCute();
console.log(guaiguai.heart);
console.log(huaihuai.colors);
console.log(guaiguai);
console.log(huaihuai);
```

题目解析：

- `guaiguai` 是一只经过加工的小猫咪，所以它会卖萌，因此调用 `activingCute` 会打印卖萌
- 两只猫都是通过 `Object.create()` 经过**原型式继承** `cat` 对象的，所以是共享使用 `cat` 对象中的属性
- `guaiguai` 经过 `createAnthor` 新增了自身的实例方法 `activingCute`，所以会有这个方法
- `huaihuai` 是一只空猫，因为 `heart`、`colors` 都是原型对象 `Cat` 上的属性

执行结果：

```js
"我是一只会卖萌的猫咪";
"❤️"[("white", "black")];
{
  actingCute: ƒ;
}
{
}
```

##### 二、寄生式继承总结

**实现方式：**

- 在**原型式继承**的基础上再封装一层，来增强对象，之后将这个对象返回

**优点：**

- 引用数据的操作会出现问题，两个实例公用继承实例的引用数据
- 谨慎定义方法，以免定义方法也继承对象原型的方法重名
- 无法直接给父级构造函数使用参数

#### 混入式继承

终于到了 `ES5` 中的最后一种继承方式：**混入式继承**。

之前我们一只是以一个子类继承一个父类，而**混入式继承**就是教我们如何一个子类继承多个父类。

在这里，我们要用到 `ES6` 中的方法 `Object.assign()`。

它的作用就是可以把多个属性和方法拷贝到目标对象中，若存在同名属性则覆盖。（浅拷贝）

先看伪代码：

```js
function Child() {
  Parent.call(this);
  OtherParent.call(this);
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype);
Child.prototype.constructor = Child;
```

##### 一、理解混入式继承的使用

```js
function Parent(sex) {
  this.sex = sex;
}
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
function OtherParent(colors) {
  this.colors = colors;
}
OtherParent.prototype.getColors = function () {
  console.log(this.colors);
};
function Child(sex, colors) {
  Parent.call(this, sex);
  OtherParent.call(this, colors); // 新增的父类
  this.name = "child";
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype); // 新增的父类原型对象
Child.prototype.constructor = Child;

var child1 = new Child("boy", ["white"]);
child1.getSex();
child1.getColors();
console.log(child1);
```

结果：

```js
'boy'
['white']
{ name: 'child', sex: 'boy', colors: ['white'] }
```

##### 二、理解混入式继承的原型链结构

同样的例子，加多几个输出：

```js
function Parent(sex) {
  this.sex = sex;
}
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
function OtherParent(colors) {
  this.colors = colors;
}
OtherParent.prototype.getColors = function () {
  console.log(this.colors);
};
function Child(sex, colors) {
  Parent.call(this, sex);
  OtherParent.call(this, colors); // 新增的父类
  this.name = "child";
}
Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, OtherParent.prototype); // 新增的父类原型对象
Child.prototype.constructor = Child;

var child1 = new Child("boy", ["white"]);
// child1.getSex()
// child1.getColors()
// console.log(child1)

console.log(Child.prototype.__proto__ === Parent.prototype);
console.log(Child.prototype.__proto__ === OtherParent.prototype);
console.log(child1 instanceof Parent);
console.log(child1 instanceof OtherParent);
```

输出：

```js
true;
false;
true;
false;
```

可以看看这个例子的思维导图

<img src="/img/javascript/图5.2.2.7.png">

其实相比**寄生组合式继承**就多了下面的 `OtherParent` 的部分

- `Child` 内使用了 `call/apply` 来复制构造函数 `OtherPrent` 上的属性和方法
- `Child.prototype` 使用 `Object.assign()` 浅拷贝 `OtherParent.prototype` 上的属性和方法

#### class 中的 extends 继承

最后是 `ES6` 中的 `class` 继承，在 `class` 中继承主要是依靠两个东西：

- `extends`
- `super`

且这种继承的效果和之前介绍的**寄生组合继承**方式一样。

##### 一、理解 `class` 中的继承

既然它的继承和**寄生组合继承**一样，就上面的例子改造，用 `class` 的继承方式来实现：

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}
class Child extends Parent {
  constructor(name) {
    super(name);
    this.sex = "boy";
  }
}
var child1 = new Child("child1");
console.log(child1);
child1.getName();

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

结果：

```js
Child{ name: 'child1', sex: 'boy' }
'child1'
true
true
```

再复现**寄生组合继承**的实现方式：

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name) {
  this.sex = "boy";
  Parent(this, name);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var child1 = new Child("child1");
console.log(child1);
child1.getName();

console.log(child1 instanceof Child);
console.log(child1 instanceof Parent);
```

会发现打印的结果是一样的。

##### 二、理解 `extends` 的基本作用

上面的例子用到了 `extends` 和 `super`。

`extends` 从字面上来看就是某个东西的延伸、继承。

如果我们只用 `extends` 而不用 `super` 呢？

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}
class Child extends Parent {
  // constructor (name) {
  //   super(name)
  //   this.sex = 'boy'
  // }
  sex = "boy"; // 实例属性sex放到外面来
}
var child1 = new Child("child1");
console.log(child1);
child1.getName();
```

其实这里的执行结果和没有隐去之前一样。

执行结果：

<img src="/img/javascript/图5.2.2.8.png">

那我们是不是可以认为：

```js
class Child extends Parent {}

// 等同于
class Child extends Parent {
  constructor(...args) {
    super(...args);
  }
}
```

OK👌，其实这一步很好理解啦，还记得之前我们就提到过，在 `class` 中如果没有定义 `constructor` 方法的话，这个方法是会被默认添加的，那么这里我们没有使用 `constructor`，它其实已经被隐式的添加和调用了。
所以我们可以看出 `extends` 的作用：

- `class` 可以通过 `extends` 关键字实现继承父类的所有属性和方法
- 若是使用了 `extends` 实现继承的子类内部没有 `constructor` 方法，则会被默认添加 `constructor` 和 `super`。

##### 三、理解 `super` 的基本作用

从上面的例子看起来 `constructor` 像一个可有可无的角色。

那么 `super` 呢？假如我们不使用 `super`

```js
class Parent {
  constructor() {
    this.name = "parent";
  }
}
class Child extends Parent {
  constructor() {
    // super(name) // 把super隐去
  }
}
var child1 = new Child();
console.log(child1);
child1.getName();
```

然后就报错了：

```js
Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

意思就是必须在 `constructor` 中调用一下 `super` 函数。

再结合 `super` 的写法，有点像调用父级的 `constructor` 并且传递参数，实际上和 `ES6` 的继承机制有关：

- 我们知道在 `ES5` 中的继承（例如**构造继承**、**寄生组合继承**），实际上是先创造子类的实例对象 `this`，然后再将父类的属性和方法添加到 `this` 上，即 `Parent.call(this)`
- 而在 `ES6` 中却不是这样的，它的实质是先**创造父类的实例对象 `this`（也就是使用 `super()`），然后再用子类的构造函数去修改 `this`。**

通俗理解就是，子类必须得在 `constructor` 中调用 `super` 方法，否则新建实例就会报错，因为子类自己没有自己的 `this` 对象，而是继承父类的 `this` 对象，然后对其加工，如果不调用 `super` 的话子类就得不到 `this` 对象。

##### 四、`super` 的具体用法—— `super` 当函数调用时

`super` 其实有两种用法，一种是当作函数来调用的，还有一种是当作对象来使用的。

在之前的例子就是把它当成函数来调用的，而且必须得在 `constructor` 中执行。

实际上，**当 `super` 被当作函数调用时，代表着父类的构造函数**。

虽然它代表父类的构造函数，但是返回的却是子类的实例，也就是说 `super` 内部的 `this` 指向是 `Child`。

验证一下（`new.target` 指向当前正在执行的那个函数，你可以理解为 `new` 后面那个函数）：

```js
class Parent {
  constructor() {
    console.log(new.target.name);
  }
}
class Child extends Parent {
  constructor() {
    var instance = super();
    console.log(instance);
    console.log(instance === this);
  }
}
var child1 = new Child();

var parent1 = new Parent();

console.log(child1);
console.log(parent1);
```

我们在父类的 `constructor` 中打印 `new.target.name`，并且用一个 `instance` 的变量来盛放 `super()` 的返回值。

而刚刚我们说了，`super` 的调用代表着父类构造函数，那么我们调用 `new Child` 的时候，肯定也执行了父类的 `constructor` 函数，所以 `console.log(new.target.name)` 肯定执行了两遍（一遍 `new Child`，一遍 `new Parent`）

所以执行结果：

```js
'Child'
Child{}
true

'Parent'

Child{}
Parent{}
```

- `new.target` 代表的是 `new` 后面的那个函数，那么 `new.target.name` 表示的是这个函数名，所以在执行 `new Child` 的时候，由于调用了 `super()`，所以相当于执行了 `Parent` 中的构造函数，因此打印出了 `'Child'`。
- 另外，关于 `super()` 的返回值 `instance`，刚刚已经说了它返回的是子类的实例，因此 `instance` 会打印出 `Child{}`；并且 `instance` 和子类 `construtor` 中的 `this` 相同，所以打印出 `true`。
- 而执行 `new Parent` 的时候，`new.target.name` 打印出的就是 `'Parent'` 了。
  最后分别将 `child1` 和 `parent1` 打印出来，都没什么问题。

通过这道题我们可以看出：

- `super` 当成函数调用时，代表父类的构造函数，且返回的是子类的实例，也就是此时 `super` 内部的 `this` 指向子类。
- 在子类的 `constructor` 中 `super()` 就相当于是 `Parent.constructor.call(this)`

##### 五、`super` 被当成函数调用的限制

刚刚说明了 `super` 当成函数调用就是相当于用 `call` 来改变父类构造函数中 `this` 的指向，那么它的使用有什么限制呢？

- 子类 `constructor` 中如果要使用 `this` 的话就必须放到 `super()` 之后
- `super` 当成函数调用时只能在子类的 `constructor` 中使用

继续看代码：

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name) {
    this.sex = "boy";
    super(name);
  }
}

var child = new Child();
console.log(child);
```

结果会报和前面例子一样的错误：

```js
Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

子类 `constructor` 中如果要使用 `this` 的话就必须放到 `super()` 之后。

这其实非常好理解，还记得 `super` 的作用吗？在 `constructor` 中必须有 `super()`，它就是用来产生 `this` 的，那么必须得产生 `this` 才能调用。

也就是在 `this.sex = 'boy'` 这一步就已经报错了。

##### 六、`super` 当成对象来使用

`super` 如果当成一个对象来调用，那也可能存在于 `class` 里不同地方。

比如 `constructor`、`子类实例方法`、`子类构造方法`，在这些地方分别指代什么？

我们只需要记住：

- 在子类的普通函数中 `super` 对象指向父类的原型对象
- 在子类的静态方法中 `super` 指向父类

依靠这个准则：

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}
Parent.prototype.getSex = function () {
  console.log("boy");
};
Parent.getColors = function () {
  console.log(["white"]);
};
class Child extends Parent {
  constructor(name) {
    super(name);
    super.getName();
  }
  instanceFn() {
    super.getSex();
  }
  static staticFn() {
    super.getColors();
  }
}
var child1 = new Child("child1");
child1.instanceFn();
Child.staticFn();
console.log(child1);
var parent = new Parent("parent");
```

根据准则，可以得出执行结果为：

```js
'child1'
'boy'
['white']
Child{ name: 'child1' }
```

##### 七、`super` 当成对象调用父类方法时 `this` 的指向

还是上面的题目：既然 `super.getName()`，`getName` 是被 `super` 调用的，而我却说此时的 `super` 指向的是父类原型对象。那么 `getName` 内打印出的应该是父类原型对象上的 `name`，也就是 `undefined` 呀，怎么会打印出 `child1` 呢？

接着看代码：

```js
class Parent {
  constructor() {}
}
Parent.prototype.sex = "boy";
Parent.prototype.getSex = function () {
  console.log(this.sex);
};
class Child extends Parent {
  constructor() {
    super();
    this.sex = "girl";
    super.getSex();
  }
}
var child1 = new Child();
console.log(child1);
```

结果还是打印了子类实例上的 `sex` 属性，即 `'girl'`，因此：

- `ES6` 规定，通过 `super` 调用父类方法时，`super` 会绑定子类的 `this`

也就是说，`super.getSex()` 转成伪代码就是：

```js
super.getSex.call(this);

// 即
Parent.prototype.getSex.call(this);
```

而且 `super` 其实还有一个特性，就是你在使用它的时候，必须得显式的指定它是作为函数使用还是对象来使用，否则会报错的。

比如下面这样就不可以：

```js
class Child extends Parent {
  constructor {
    super(); // 不报错
    super.getName(); // 不报错
    console.log(super); // 报错
  }
}
```

##### 八、了解 `extends` 的继承目标

`extends` 后面接车的咪表不一定是一个 `class`。

`class B extends A {}`，只要 `A` 是一个有 `prototype` 属性的函数，就能被 `B` 继承。

由于函数有 `prototype` 属性，所以 `A` 可以是任意函数。

继续看代码：

```js
function Parent() {
  this.name = "parent";
}

class Child1 extends Parent {}
class Child2 {}
class Child3 extends Array {}
var child1 = new Child1();
var child2 = new Child2();
var child3 = new Child3();
child3[0] = 1;

console.log(child1);
console.log(child2);
console.log(child3);
```

执行结果：

```js
Child1{ name: 'parent' }
Child2{}
Child3[1]
```

- **Child1：** 可以继承构造函数 `Parent`
- **Child2：** 不存在任何继承，就是一个普通函数
- **Child3：** 继承原生构造函数

（其实这里只要作为一个知道的知识点就可以了，真正使用来说貌似不常用）

##### 九、`class` 继承总结

**ES6 中的继承：**

- 主要是依赖 `extends` 关键字来实现继承，且继承效果类似于**寄生组合式继承**
- 使用 `extends` 实现继承不一样要 `constructor` 和 `super`，没有的话会默认产生并调用它们
- `extends` 后面不一定是 `class`，只要是有 `prototype` 属性的函数就可以了

**super 相关：**

- 在实现继承时，如果子类有 `constructor` 函数，必须在 `constructor` 中调用 `super`，并且要在使用 `this` 之前调用，因为 `super` 就是产生 `this` 对象的
- `super` 有两种调用方式：当成函数调用和当成对象调用
- `super` 当成函数调用时，相当于调用父类构造函数，并且返回的是子类实例。在子类 `constructor` 中调用 `super()` 相当于 `Parent.constructor.call(this)`
- `super` 当成对象调用时，如果在子类的普通函数中，则指向的是父类的 `prototype` 原型对象中的方法和属性；如果在子类的的静态方法中调用，`super` 则指向父类。并且 `super` 会绑定子类的 `this`，相当于 `Parent.prototype.fn.call(this)`。

**ES5 和 ES6 继承的区别：**

- 在 `ES5` 中的继承（如构造继承、寄生组合继承），实质上是**先创造子类的实例对象 `this`，然后再将父类的属性和方法添加到 `this` 上**
- 在 `ES6` 中的继承实质是**先创建父类的实例对象 `this`（也就是 `super`），然后再在子类的构造函数中修改 `this` 指向**

#### instanceof

官方解释：`instanceof` **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例的原型链上。

例如：`a instance B`，检测 `a` 的原型链 `__proto__` 上是否有 `B.prototype`，有则返回 `true` ，否则返回 `false`。

##### 题目一：理解 `instanceof`

```js
function Parent() {
  this.name = "parent";
}
function Child() {
  this.sex = "boy";
}
Child.prototype = new Parent();
var child1 = new Child();

console.log(child1 instanceof Child); // true
console.log(child1 instanceof Parent); // true
console.log(child1 instanceof Object); // true
```

##### 题目二：理解 `isPrototypeOf()`

它是属于 `Object.prototype` 上的方法，`isPrototypeOf()` 的用法和 `instanceof` 想法，它是用来判断指定对象 `object1` 是否存在于另一个对象 `object2` 的原型中，是则返回 `true`，否则返回 `false`。

```js
function Parent() {
  this.name = "parent";
}
function Child() {
  this.sex = "boy";
}
Child.prototype = new Parent();
var child1 = new Child();

console.log(Child.prototype.isPrototypeOf(child1)); // true
console.log(Parent.prototype.isPrototypeOf(child1)); // true
console.log(Object.prototype.isPrototypeOf(child1)); // true
```

判断的方式只要把原型链继承 `instanceof` 反过来查找即可。

### 所有继承总结

最后再次总结上面所有继承的实现方式的伪代码和优缺。

#### 原型链继承

**实现方式：**

```js
Child.prototype = new Parent();
```

**优缺点：**

- 优点
  - 可以获取父类及其原型链上的属性和方法
- 缺点
  - 来自于原型对象上的属性和方法都是共享的，互相干扰
  - 创建子类时，无法给父类的构造函数传参
  - 无法实现多继承（因为已经指定了原型对象了）
  - 无法给子类的原型上新增属性和方法，必须放在 `Child.prototpye = new Parent()` 语句之后

#### 构造继承

**实现方式：**

```js
function Parent(name) {
  this.name = name;
}

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this, name);
}

var child = new Child("boy", "tony");
```

**优缺点：**

- 优点
  - 可以给父类构造函数传参
  - 解决了原型链继承中子类共享父类原型上的属性和方法的问题
  - 可以实现多继承
- 缺点
  - 无法调用父类原型上的属性和方法
  - 无法实现父类上的函数复用，浪费性能和内存
  - 子类实例是子类的实例，但是不属于父类的实例

#### 组合继承

**实现方式：**

```js
function Parent(name) {
  this.name = name;
}

function Child(sex, name) {
  this.sex = sex;
  Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 解决了原型链继承中无法使用父类实例中的属性和方法，并且子类实例共享父类原型上的属性和方法的问题
  - 解决了构造继承中无法使用父类原型中的属性和方法
  - 可以给父类构造函数传参
- 缺点
  - 调用了两次构造函数：一次 `Parent.call()`，一次 `Child.prototype = new Parent()`，子类上的同名属性和方法会覆盖父类实例上的属性和方法，增加了不必要的内存

#### 寄生组合继承

**实现方式：**
使用 `Object.create(proto, propertiesObject)` 创建一个干净的实例对象，这个实例对象还能继承父类原型上的属性和方法。

```js
function Parent() {
  this.name = "tony";
}

function Child() {
  this.sex = "boy";
  Parent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 解决寄生组合继承调用两次父类构造函数的问题，寄生组合继承只调用一次，创建一份父类实例
  - 子类可以调用到父类原型上的属性和方法
  - 可以正常使用 `instanceof` 和 `isPrototypeOf` 方法
- 缺点
  - 无

#### 原型式继承

**实现思路：**
创建一个构造函数，其原型指向对象，然后调用 `new` 操作符创建实例，并返回这个实例，本质是一个浅拷贝。

```js
function object(obj) {
  function F() {}
  F.prototype = obj;
  F.prototype.constructor = F;
  return new F();
}
```

也等于：

```js
var child = Object(parent);
```

**注意：**
我们是模拟 `Object.create()` 方法，它和 `__proto__` 是同一时期的产物，所以都不能使用。在 ES5 之后可以直接使用 `Object.create()` 方法来实现，而在这之前只能手动实现。

**优缺点：**

- 优点
  - 在不用构造函数的情况下实现了原型链继承，代码量减少一部分
- 缺点
  - 一些引用数据操作的时候会出问题，两个实例会公用继承实例的引用数据类
  - 谨慎定义方法，以免定义方法也继承对象原型的方法重名
  - 无法直接给父级构造函数使用参数

#### 寄生式继承

**实现思路：**
实际上是在**原型式继承**的基础上再封装一层，来增强对象，再将这个对象返回。

```js
function createAnother(original) {
  var clone = Object.create(original); // 通过调用 Object.create() 函数创建一个新对象
  clone.fn = function () {}; // 以某种方式来增强对象
  return clone; // 返回这个对象
}
```

**优缺点：**

- 优点
  - 同原型式继承：在不用构造函数的情况下实现了原型链继承，代码量减少一部分
- 缺点
  - 一些引用数据操作的时候会出问题，两个实例会公用继承实例的引用数据类
  - 谨慎定义方法，以免定义方法也继承对象原型的方法重名
  - 无法直接给父级构造函数使用参数

#### 混入方式继承多个对象

**实现思路：**
这是 ES5 中最后一个继承方式，实际上就是实现一个子类继承多个父类，用到 `ES6` 中的方法：`Object.assign()`。它的作用就是把多个对象的属性和方法拷贝到目标对象中，若是存在同名属性的话，后面的会覆盖前面。（同样式一种浅拷贝）

```js
function Child() {
  Parent.call(this);
  anotherParent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Object.assign(Child.prototype, anotherParent.prototype);
Child.prototype.constructor = Child;
```

**优缺点：**

- 优点
  - 可以实现多继承，一个子类继承多个父类
- 缺点
  - 后面添加到子类原型对象中的父类方法和属性会覆盖已经添加的同名方法和属性
  - 子类实际上是 `Object.create(Parent.prototype)` 的子类，不是后面 `Object.assign(anotherParent)` 的子类

#### class 继承

```js
class Child extends Parent {
  constructor(...arg) {
    super(...arg);
  }
}
```

**ES6 中的继承：**

- 主要是依赖 `extends` 关键字实现，且继承的效果类似于**寄生组合继承**
- 使用了 `extends` 实现继承不一定要 `constructor` 和 `super`，因为没有的话会默认调用
- `extends` 后面接着的目标不一定是 `class`，只要是个有 `prototype` 属性的函数就可以了

**super 相关：**

- 在 `extends` 继承中，如果子类中有 `constructor` 函数，则必须调用 `super()`，因为是用来产生 `this` 的，所以关于 `this` 的操作要放在 `super()` 之后
- `super` 有两种调用方式，当成函数调用和当成对象调用
- `super` 当成函数调用时，代表着父类的构造函数，返回子类的实例，也就是此时 `super` 内部的 `this` 指向是指向子类的。在子类的 `constructor` 就相当于是 `Parent.constructor.call(this)`
- `super` 当成对象调用时，普通函数中的 `super` 指向父类的原型对象，静态函数中的 `super` 指向父类。并且通过 `super` 调用父类方法时，`this` 指向绑定子类，相当于是 `Parent.prototype.fn.call(this)`

**ES5 和 ES6 继承的区别：**

- 在 `ES5` 继承中都是先创建子类的实例对象 `this`，然后再将父类的属性和方法 添加到 `this` 上（Parent.call(this)）
- 在 `ES6` 继承中先创建父类的实例对象 `this`（也就是 `super`），然后再用子类的构造函数去修改 `this`

### 多态

[JS 面向对象——多态学习](https://juejin.im/post/5e945a15f265da47d31231dd)

主要理解 JS 面向对象**多态**的含义，最后记住 JS 面向对象三大特征：**封装**、**继承**、**多态**。
