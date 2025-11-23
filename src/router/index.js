import { createRouter, createWebHistory } from "vue-router";


import StudentListView from "@/views/StudentListView.vue";
import CourseListView from "@/views/CourseListView.vue";
import ViewStd from "@/views/ViewStd.vue";
import MainLayout from '@/layout/MainLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CourseViewStudent from '@/views/CourseViewStudent.vue'
import CourseViewLesson from '@/views/CourseViewLesson.vue'
import EnrollmentView from '@/views/EnrollmentView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'students', component: ViewStd },
      { path: 'course', name: 'courses', component: CourseListView },
      { path: 'enrollment', name: 'enrollment', component: EnrollmentView },
      {
        path: 'course/:id/student',
        name: 'course-view-student',
        component: CourseViewStudent
      },
      {
        path: 'course/:id/lesson',
        name: 'course-view-lesson',
        component: CourseViewLesson
      },
      { path: ':pathMatch(.*)*', name: 'notfound', component: NotFoundView },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
});
