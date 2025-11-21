import { createRouter, createWebHistory } from "vue-router";
import StudentListView from '@/views/StudentListView.vue'

const routes = [
  { path: "/", name: "students", component: StudentListView },

];

export default createRouter({
  history: createWebHistory(),
  routes,
});
