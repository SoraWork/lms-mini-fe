import { createRouter, createWebHistory } from "vue-router";


import StudentListView from "@/views/StudentListView.vue";
import CourseListView from "@/views/CourseListView.vue";
import ViewStd from "@/views/ViewStd.vue";
import MainLayout from '@/layout/MainLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'students', component: StudentListView },
      { path: 'course', name: 'courses', component: CourseListView },
      { path: 'std', name: 'views', component: ViewStd },
      { path: ':pathMatch(.*)*', name: 'notfound', component: NotFoundView },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
});
