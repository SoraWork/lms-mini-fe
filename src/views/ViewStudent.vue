<template>
  <div>
    <!-- Search Bar cho Student -->
    <SearchBar
      v-model="currentSearch"
      :fields="[
        { label: t('student.name'), value: 'name' },
        { label: t('student.email'), value: 'email' }
      ]"
      @search="handleSearch"
    />

    <div class="mb-3 flex justify-end">
      <el-button type="primary" @click="openAddDialog">{{ t('student.add') }}</el-button>
      <el-button type="success" @click="exportStudents">{{ t('student.exportExcel') }}</el-button>
    </div>

    <!-- Reusable Table -->
    <EntityTable
      :rows="students"
      :columns="[
        { prop: 'name', label: t('student.name') },
        { prop: 'email', label: t('student.email') },
        { prop: 'totalEnrollments', label: t('student.totalEnrollments') }
      ]"
      :actions="[
        { label: t('student.view'), type: 'primary', handler: openViewDialog, icon: View },
        { label: t('student.edit'), type: 'warning', handler: row => openStudentDialog(row), icon: Edit },
        { label: t('student.delete'), type: 'danger', handler: row => deleteStudent(row.id), icon: Delete }
      ]"
      :show-index="true"
      :empty-text="t('student.noData')"
    />

    <!-- Pagination -->
    <EntityPagination
      :pagination="pagination"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- Reusable Dialog với validate -->
    <EntityFormDialog
      v-model="showStudentForm"
      :entityData="selectedStudent"
      :title="t('student.formTitle')"
      :fields="[
        { key: 'name', label: t('student.name') },
        { key: 'email', label: t('student.email') }
      ]"
      :rules="studentRules"
      :hasUpload="true"
      @submit="onStudentSubmit"
    />

    <!-- Dialog xem chi tiết -->
    <StudentViewDialog
      v-model:visible="dialogVisible"
      :student="selectedStudent"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import cloneDeep from 'lodash-es/cloneDeep'
import { useI18n } from 'vue-i18n'

import { studentApi } from '@/api/studentApi'
import EntityFormDialog from '@/components/EntityFormDialog.vue'
import EntityTable from '@/components/EntityTable.vue'
import { Edit, Delete, View } from '@element-plus/icons-vue'
import SearchBar from '@/components/SearchBar.vue'
import EntityPagination from '@/components/EntityPagination.vue'
import StudentViewDialog from '@/components/StudentViewDialog.vue'

const students = ref([])
const pagination = ref(null)
const selectedStudent = ref(null)
const showStudentForm = ref(false)
const dialogVisible = ref(false)
const currentSearch = ref({ query: '', field: 'name' })
const { t } = useI18n()

/* =========================
      OPEN DIALOG
========================= */
function openAddDialog() {
  selectedStudent.value = null
  showStudentForm.value = true
}

function openStudentDialog(student) {
  selectedStudent.value = cloneDeep(student)
  showStudentForm.value = true
}

function openViewDialog(student) {
  selectedStudent.value = student
  dialogVisible.value = true
}

/* =========================
      FETCH STUDENTS
========================= */
async function fetchStudents(page = 0, size = 10) {
  try {
    const params = { page, size }
    if (currentSearch.value.query) {
      params[currentSearch.value.field] = currentSearch.value.query
    }
    const res = await studentApi.search(params)
    students.value = res.data.data
    pagination.value = res.data.pagination
  } catch {
    ElMessage.error(t('student.fetchError'))
    students.value = []
    pagination.value = null
  }
}

/* =========================
     CREATE / UPDATE STUDENT
========================= */
async function onStudentSubmit(formData) {
  try {
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('email', formData.email)

    if (formData.images?.length) {
      formData.images.forEach(img => fd.append('images', img))
    }

    if (formData.id) {
      fd.append('studentId', formData.id)
      if (formData.deleteImageIds?.length) {
        formData.deleteImageIds.forEach(id => fd.append('deleteImageIds', id))
      }
      await studentApi.updateStudent(fd)
      ElMessage.success(t('student.updateSuccess'))
    } else {
      await studentApi.create(fd, true)
      ElMessage.success(t('student.createSuccess'))
    }

    fetchStudents(0, pagination.value?.pageSize || 10)
  } catch (err) {
    console.error(err)
    ElMessage.error(t('student.submitError'))
  }
}
// EXPORT STUDENT
async function exportStudents() {
  try {
    const res = await studentApi.exportExcel();
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success(t("student.exportSuccess"));
  } catch (err) {
    console.error(err);
    ElMessage.error(t("student.exportError"));
  }
}

/* =========================
        SEARCH
========================= */
function handleSearch({ query, field }) {
  currentSearch.value = { query, field }
  fetchStudents(0, pagination.value?.pageSize || 10)
}

/* =========================
       PAGINATION
========================= */
function handlePageChange(page) {
  fetchStudents(page - 1, pagination.value.pageSize)
}

function handleSizeChange(size) {
  fetchStudents(0, size)
}

/* =========================
        DELETE STUDENT
========================= */
async function deleteStudent(id) {
  try {
    await ElMessageBox.confirm(
      t('student.confirmDelete'),
      t('student.deleteTitle'),
      { confirmButtonText: t('student.confirm'), cancelButtonText: t('student.cancel'), type: 'warning' }
    )
    await studentApi.delete(id)
    ElMessage.success(t('student.deleteSuccess'))
    fetchStudents(pagination.value.currentPage, pagination.value.pageSize)
  } catch (error) {
    if (error === 'cancel') return
    console.error('Delete student error:', error)
    ElMessage.error(t('student.deleteError'))
  }
}

/* =========================
       VALIDATE RULES
========================= */
const studentRules = {
  name: [
    {
      required: true,
      message: () => t('student.validate.nameRequired'),
      trigger: 'blur'
    },
    {
      min: 3,
      max: 50,
      message: () => t('student.validate.nameLength'),
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: () => t('student.validate.emailRequired'),
      trigger: 'blur'
    },
    {
      type: 'email',
      message: () => t('student.validate.emailPaten'),
      trigger: 'blur'
    }
  ]
}


onMounted(() => fetchStudents())
</script>
