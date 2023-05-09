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
    ],

    sidebar: [
      {
        text: "Javascript",
        items: [
          { text: "Javascript 高频问答", link: "/javascript/" },
          { text: "Javascript ES6标准", link: "/javascript/es6" },
          { text: "Javascript 编程题", link: "/javascript/code" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
