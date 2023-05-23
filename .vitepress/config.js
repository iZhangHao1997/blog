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
      { text: "Vue", link: "/vue/vue2/vuejs", activeMatch: "/vue/" },
      { text: "HTML", link: "/html/", activeMatch: "/html/" },
      { text: "CSS", link: "/css/", activeMatch: "/css/" },
      { text: "Sass", link: "/sass/", activeMatch: "/sass/" },
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
