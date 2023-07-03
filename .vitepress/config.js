import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  srcDir: "src",
  title: "BugBytes",
  description: "A FE blog",
  lang: "zh",
  lastUpdated: true,

  // set page favicon.ico
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/blog/favicon.ico",
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 3],
    logo: "/icons/blog.svg",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "JavaScript",
        link: "/javascript/syntax/data-structures",
        activeMatch: "/javascript",
      },
      { text: "Sass", link: "/sass/syntax/", activeMatch: "/sass/" },
      { text: "Vue", link: "/vue/vue2/vuejs", activeMatch: "/vue/" },
      { text: "HTML", link: "/html/", activeMatch: "/html/" },
      { text: "CSS", link: "/css/", activeMatch: "/css/" },
      { text: "Browser", link: "/browser/", activeMatch: "/browser/" },
      { text: "HTTP", link: "/web-http/", activeMatch: "/web-http/" },
    ],

    sidebar: {
      "/javascript/": [
        {
          text: "Javascript 基础知识",
          collapsed: false,
          items: [
            { text: "数据类型", link: "/javascript/syntax/data-structures" },
            {
              text: "执行上下文/作用域/闭包",
              link: "/javascript/syntax/closures",
            },
            { text: "this", link: "/javascript/syntax/this" },
            { text: "New", link: "/javascript/syntax/new" },
            { text: "原型和继承", link: "/javascript/syntax/prototype" },
            { text: "深拷贝和浅拷贝", link: "/javascript/syntax/copy" },
            { text: "模块化开发", link: "/javascript/syntax/modules" },
            {
              text: "EventLoop与事件循环",
              link: "/javascript/syntax/event-loop",
            },
            { text: "异步编程", link: "/javascript/syntax/asynchronous" },
            {
              text: "防抖和节流",
              link: "/javascript/syntax/debounce-and-throttle",
            },
            {
              text: "垃圾回收机制",
              link: "/javascript/syntax/garbage-collection",
            },
            { text: "ES 新语法补充", link: "/javascript/syntax/new-api" },
            {
              text: "正则表达式",
              link: "/javascript/syntax/regular-expressions",
            },
          ],
        },
        {
          text: "Javascript ES6标准",
          link: "/javascript/es6",
        },
        {
          text: "Javascript 编程题",
          link: "/javascript/code",
        },
      ],

      "/css/": [
        {
          text: "CSS",
          items: [{ text: "基础", link: "/css/" }],
        },
      ],

      "/sass/": [
        {
          text: "语法-Syntax",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/syntax/",
            },
            {
              text: "样式表解析-Parsing a Stylesheet",
              link: "/sass/syntax/parsing",
            },
            {
              text: "样式表结构-Structure of a Stylesheet",
              link: "/sass/syntax/structure",
            },
            {
              text: "注释-Comments",
              link: "/sass/syntax/comments",
            },
            {
              text: "特别函数-Special Functions",
              link: "/sass/syntax/special-functions",
            },
          ],
        },
        {
          text: "样式规则-Style Rules",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/rules/",
            },
            {
              text: "属性声明-Property Declarations",
              link: "/sass/rules/declarations",
            },
            {
              text: "父选择器-Parent Selector",
              link: "/sass/rules/parent-selector",
            },
            {
              text: "占位符选择器-Placeholder Selector",
              link: "/sass/rules/placeholder-selector",
            },
          ],
        },
        {
          text: "变量-Variable",
          link: "/sass/variables",
        },
        {
          text: "插值-Interpolation",
          link: "/sass/interpolation",
        },
        {
          text: "@规则-At-rules",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/at-rules/",
            },
            {
              text: "@use",
              link: "/sass/at-rules/use",
            },
            {
              text: "@forward",
              link: "/sass/at-rules/forward",
            },
            {
              text: "@import",
              link: "/sass/at-rules/import",
            },
            {
              text: "@mixin and @include",
              link: "/sass/at-rules/mixin",
            },
            {
              text: "@function",
              link: "/sass/at-rules/function",
            },
            {
              text: "@extend",
              link: "/sass/at-rules/extend",
            },
            {
              text: "@error",
              link: "/sass/at-rules/error",
            },
            {
              text: "@warn",
              link: "/sass/at-rules/warn",
            },
            {
              text: "@debug",
              link: "/sass/at-rules/debug",
            },
            {
              text: "@at-root",
              link: "/sass/at-rules/at-root",
            },
            {
              text: "流量控制-Flow Control",
              collapsed: false,
              items: [
                {
                  text: "概述-Overview",
                  link: "/sass/at-rules/control/",
                },
                {
                  text: "@if and @else",
                  link: "/sass/at-rules/control/if",
                },
                {
                  text: "@each",
                  link: "/sass/at-rules/control/each",
                },
                {
                  text: "@for",
                  link: "/sass/at-rules/control/for",
                },
                {
                  text: "@while",
                  link: "/sass/at-rules/control/while",
                },
              ],
            },
            {
              text: "css @规则-From CSS",
              link: "/sass/at-rules/css",
            },
          ],
        },
        {
          text: "值-Values",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/values/",
            },
            {
              text: "Numbers",
              link: "/sass/values/numbers",
            },
            {
              text: "Strings",
              link: "/sass/values/strings",
            },
            {
              text: "Colors",
              link: "/sass/values/colors",
            },
            {
              text: "Lists",
              link: "/sass/values/lists",
            },
            {
              text: "Maps",
              link: "/sass/values/maps",
            },
            {
              text: "Booleans",
              link: "/sass/values/booleans",
            },
            {
              text: "null",
              link: "/sass/values/null",
            },
            {
              text: "Calculations",
              link: "/sass/values/calculations",
            },
            {
              text: "Functions",
              link: "/sass/values/functions",
            },
          ],
        },
        {
          text: "操作符-Operators",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/operators/",
            },
            {
              text: "等式运算符-Equality",
              link: "/sass/operators/equality",
            },
            {
              text: "关系运算符-Relational",
              link: "/sass/operators/relational",
            },
            {
              text: "数字运算符-Numeric",
              link: "/sass/operators/numeric",
            },
            {
              text: "字符串运算符-String",
              link: "/sass/operators/string",
            },
            {
              text: "布尔运算符-Boolean",
              link: "/sass/operators/boolean",
            },
          ],
        },
        {
          text: "内置模块-Built-In Modules",
          collapsed: false,
          items: [
            {
              text: "概述-Overview",
              link: "/sass/modules/",
            },
            {
              text: "sass:color",
              link: "/sass/modules/color",
            },
            {
              text: "sass:list",
              link: "/sass/modules/list",
            },
            {
              text: "sass:map",
              link: "/sass/modules/map",
            },
            {
              text: "sass:meta",
              link: "/sass/modules/meta",
            },
            {
              text: "sass:selector",
              link: "/sass/modules/selector",
            },
            {
              text: "sass:string",
              link: "/sass/modules/string",
            },
          ],
        },
      ],

      "/vue/": [
        {
          text: "Vue2",
          collapsed: false,
          items: [
            { text: "vue.js", link: "/vue/vue2/vuejs" },
            { text: "vue-router", link: "/vue/vue2/vue-router" },
            { text: "vuex", link: "/vue/vue2/vuex" },
          ],
        },
        {
          text: "Vue3",
          collapsed: false,
          items: [
            { text: "vue.js", link: "/vue/vue3/vuejs" },
            { text: "vue-router", link: "/vue/vue3/vue-router" },
            { text: "pinia", link: "/vue/vue3/pinia" },
          ],
        },
      ],

      "/html/": [
        {
          text: "HTML",
          items: [{ text: "HTML高频问答", link: "/html/" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/iZhangHao1997/blog" },
    ],

    editLink: {
      pattern: "https://github.com/iZhangHao1997/blog/edit/main/src/:path",
      text: "Edit this page on GitHub",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Good good study Day day up",
      copyright: "Copyright © iZhangHao1997",
    },
  },
});
