import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createPinia } from "pinia";
import { lazyPlugin } from "./directive";

import router from "./router/router";

const app = createApp(App);
const pinia = createPinia();

Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component);
});

app.use(pinia);
app.use(router);
app.use(lazyPlugin);
app.use(ElementPlus);
app.use(Antd);
app.mount("#app");
