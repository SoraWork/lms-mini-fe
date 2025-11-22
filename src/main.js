
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { i18n } from './languages/i18n.js'

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(i18n)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "light"
});

app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
