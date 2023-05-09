import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  srcDir: "src",
  title: "BugBytes",
  description: "A FE blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 3],

    nav: [
      { text: "Home", link: "/" },
      { text: "JavaScript", link: "/javascript/" },
      { text: "Vue", link: "/vue/" },
      { text: "HTML", link: "/html/" },
      { text: "CSS", link: "/css/" },
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
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
