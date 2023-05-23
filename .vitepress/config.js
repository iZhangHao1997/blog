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
      { text: "JavaScript", link: "/javascript/", activeMatch: "/javascript/" },
      { text: "Vue", link: "/vue/", activeMatch: "/vue/" },
      { text: "HTML", link: "/html/", activeMatch: "/html/" },
      { text: "CSS", link: "/css/", activeMatch: "/css/" },
      { text: "Sass", link: "/sass/", activeMatch: "/sass/" },
      { text: "Browser", link: "/browser/", activeMatch: "/browser/" },
      { text: "HTTP", link: "/web-http/", activeMatch: "/web-http/" },
    ],

    sidebar: {
      "/javascript/": [
        {
          text: "Javascript",
          items: [
            { text: "Javascript 高频问答", link: "/javascript/" },
            { text: "Javascript ES6标准", link: "/javascript/es6" },
            { text: "Javascript 编程题", link: "/javascript/code" },
          ],
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
          text: "Vue",
          items: [
            { text: "vue2", link: "/vue/vue2" },
            { text: "vue3", link: "/vue/vue3" },
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
