<template>
  <div class="p-4 space-y-6">

    <!-- Breadcrumb -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/course">
        {{ t('course.title') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ t('course.viewDetail') }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- HEADER CARD -->
    <el-card shadow="hover" class="rounded-xl">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ course?.name }}
          </h2>
          <p class="text-gray-500 text-sm">
            {{ t('course.code') }}: <strong>{{ course?.code }}</strong>
          </p>
        </div>

        <el-tag type="success" size="large" v-if="course?.status === '1'">
          {{ t('course.active') }}
        </el-tag>
        <el-tag type="danger" size="large" v-else>
          {{ t('course.inactive') }}
        </el-tag>
      </div>

      <!-- Images -->
      <el-carousel v-if="course?.images?.length" :interval="5000" arrow="always">
        <el-carousel-item v-for="img in course.images" :key="img.id">
          <div class="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <el-image
              :src="img.url"
              fit="cover"
              class="w-full h-full"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>

    <!-- STUDENT LIST TABLE -->
    <el-card shadow="hover" class="rounded-xl">

      <h3 class="text-xl font-semibold mb-4">
        {{ t('course.studentList') }}
      </h3>

      <EntityTableAdvanced
        :rows="students"
        :columns="tableColumns"
        :show-index="true"
        :empty-text="t('student.noData')"
      >

        <!-- SLOT: EMAIL CLICK -->
        <template #email="{ row }">
          <a
            :href="`mailto:${row.email}`"
            class="text-blue-600 underline"
          >
            {{ row.email }}
          </a>
        </template>

      </EntityTableAdvanced>

      <!-- Pagination -->
      <EntityPagination
        :pagination="studentPagination"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

import { courseApi } from '@/api/courseApi'
import EntityTableAdvanced from '@/components/EntityTableAdvanced.vue'
import EntityPagination from '@/components/EntityPagination.vue'

const route = useRoute()
const { t } = useI18n()

const course = ref(null)
const students = ref([])

const studentPagination = ref({
  currentPage: 0,
  pageSize: 10
})

/* -----------------------------------
  TABLE COLUMNS (DYNAMIC + I18N)
----------------------------------- */
const tableColumns = [
  { prop: 'name', label: t('student.name') },
  { prop: 'email', label: t('student.email'), slot: 'email' }
]

/* -----------------------------------
      FETCH COURSE + STUDENTS
----------------------------------- */
async function fetchCourseDetail(page = 0, size = 10) {
  try {
    const id = route.params.id
    const res = await courseApi.getStudentsOfCourse(id, { page, size })

    course.value = res.data
    students.value = res.data.students.data
    studentPagination.value = res.data.students.pagination

  } catch (err) {
    console.error(err)
    ElMessage.error(t('course.fetchDetailError'))
  }
}

function handlePageChange(page) {
  fetchCourseDetail(page - 1, studentPagination.value.pageSize)
}

function handleSizeChange(size) {
  fetchCourseDetail(0, size)
}

onMounted(() => fetchCourseDetail())
</script>

<style scoped>
</style>
