import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import postcssNested from "postcss-nested"; // 必须改为ESM导入方式

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      algorithm: "gzip",
      threshold: 10240,
    }),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    cssTarget: "chrome89", // 新增：解决CSS嵌套警告
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [postcssNested()], // 改用ESM导入
    },
  },
  server: {
    proxy: {
      "/geocode": {
        target: "https://api.bigdatacloud.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geocode/, ""),
      },
    },
  },
});
