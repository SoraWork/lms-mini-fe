
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "light"
});

app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
