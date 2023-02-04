// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Timescale api",
      htmlAttrs: {
        lang: "nb-no",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "Timescale api" },
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#FFFFFF" },
      ],
      link: [
        { rel: "icon", type: "image/svg", href: "/images/favicon.svg" },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "apple-touch-icon", href: "/images/apple-touch-icon.png" },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
});
