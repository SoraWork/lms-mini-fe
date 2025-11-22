<template>
  <div>
    <!-- Search Bar cho Course -->
    <SearchBar
      v-model="currentSearch"
      :fields="[
        { label: t('course.name'), value: 'name' },
        { label: t('course.code'), value: 'code' }
      ]"
      @search="handleSearch"
    />

    <div class="mb-3 flex justify-end">
      <el-button type="primary" @click="openAddDialog">{{ t('course.add') }}</el-button>
    </div>

    <!-- Reusable Table cho Course -->
    <EntityTable
      :rows="courses"
      :columns="[
        { prop: 'name', label: t('course.name') },
        { prop: 'code', label: t('course.code') },
        { prop: 'totalEnrollments', label: t('course.totalEnrollments') },
        { prop: 'totalLessons', label: t('course.totalLessons') },
      ]"
      :actions="[
        { label: t('course.view'), type: 'primary', handler: openViewDialog, icon: View },
        { label: t('course.edit'), type: 'primary', handler: row => openCourseDialog(row), icon: Edit },
        { label: t('course.delete'), type: 'danger', handler: row => deleteCourse(row.id), icon: Delete }
      ]"
      :show-index="true"
      :empty-text="t('course.noData')"
    />

    <!-- Pagination -->
    <EntityPagination
      :pagination="pagination"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- Reusable Dialog cho Course -->
    <EntityFormDialog
      v-model="showCourseForm"
      :entityData="selectedCourse"
      :title="t('course.formTitle')"
      :fields="[
    { key: 'name', label: t('course.name') },
    { key: 'code', label: t('course.code') }
  ]"
      :rules="courseRules"
      :hasUpload="true"
      @submit="onCourseSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import cloneDeep from 'lodash-es/cloneDeep'
import { useI18n } from 'vue-i18n'

import { courseApi } from '@/api/courseApi'
import EntityFormDialog from '@/components/EntityFormDialog.vue'
import EntityTable from '@/components/EntityTable.vue'
import { Edit, Delete, View } from '@element-plus/icons-vue'
import SearchBar from '@/components/SearchBar.vue'
import EntityPagination from '@/components/EntityPagination.vue'

const courses = ref([])
const pagination = ref(null)
const selectedCourse = ref(null)
const showCourseForm = ref(false)
const currentSearch = ref({ query: '', field: 'name' })
const { t } = useI18n()

/* =========================
      OPEN DIALOG
========================= */
function openAddDialog() {
  selectedCourse.value = null
  showCourseForm.value = true
}

//Rules
const courseRules = {
  name: [
    {
      required: true,
      message: () => t('course.validate.nameRequired'),
      trigger: 'blur'
    },
    {
      min: 3,
      max: 100,
      message: () => t('course.validate.nameLength'),
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: () => t('course.validate.codeRequired'),
      trigger: 'blur'
    },
  ]
}

function openCourseDialog(course) {
  selectedCourse.value = cloneDeep(course)
  showCourseForm.value = true
}

function openViewDialog(course) {
  console.log('View course', course)
}

/* =========================
      FETCH COURSES
========================= */
async function fetchCourses(page = 0, size = 10) {
  try {
    const params = { page, size }
    if (currentSearch.value.query) {
      params[currentSearch.value.field] = currentSearch.value.query
    }
    const res = await courseApi.search(params)
    courses.value = res.data.data
    pagination.value = res.data.pagination
  } catch (err) {
    console.error(err)
    ElMessage.error(t('course.fetchError'))
    courses.value = []
    pagination.value = null
  }
}

/* =========================
     CREATE / UPDATE COURSE
========================= */
async function onCourseSubmit(formData) {
  try {
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('code', formData.code)

    if (formData.images?.length) {
      formData.images.forEach(img => fd.append('images', img))
    }

    if (formData.id) {
      fd.append('courseId', formData.id)
      if (formData.deleteImageIds?.length) {
        formData.deleteImageIds.forEach(id => fd.append('deleteImageIds', id))
      }
      await courseApi.updateCourse(fd)
      ElMessage.success(t('course.updateSuccess'))
    } else {
      console.log(formData)
      await courseApi.create(fd, true)
      ElMessage.success(t('course.createSuccess'))
    }

    fetchCourses(0, pagination.value?.pageSize || 10)
  } catch (err) {
    console.error(err)
    ElMessage.error(t('course.submitError'))
  }
}

/* =========================
        SEARCH
========================= */
function handleSearch({ query, field }) {
  currentSearch.value = { query, field }
  fetchCourses(0, pagination.value?.pageSize || 10)
}

/* =========================
       PAGINATION
========================= */
function handlePageChange(page) {
  fetchCourses(page - 1, pagination.value.pageSize)
}

function handleSizeChange(size) {
  fetchCourses(0, size)
}

/* =========================
        DELETE COURSE
========================= */
async function deleteCourse(id) {
  try {
    await ElMessageBox.confirm(
      t('course.confirmDelete'),
      t('course.deleteTitle'),
      { confirmButtonText: t('course.confirm'), cancelButtonText: t('course.cancel'), type: 'warning' }
    )
    await courseApi.delete(id)
    ElMessage.success(t('course.deleteSuccess'))
    fetchCourses(pagination.value.currentPage, pagination.value.pageSize)
  } catch (error) {
    if (error === 'cancel') return
    console.error('Delete course error:', error)
    ElMessage.error(t('course.deleteError'))
  }
}

onMounted(() => fetchCourses())
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: nowrap;
}

.pagination-wrapper ::v-deep(.el-pagination) {
  display: inline-flex;
  align-items: center;
}

.pagination-wrapper .goto-page {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
