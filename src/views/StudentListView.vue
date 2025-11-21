<template>
  <div>
    <StudentSearch @search="handleSearch" />
    <div class="mb-3 flex justify-end">
      <el-button type="primary" @click="openAddDialog">Add Student</el-button>
    </div>
    <StudentTable
      :students="students"
      @edit-student="openStudentDialog"
      @delete-student="deleteStudent"
    />

    <!-- Pagination -->
    <div class="mt-3 pagination-wrapper">
      <span>Total: {{ pagination?.totalElements || 0 }} elements</span>

      <el-pagination
        v-if="pagination"
        background
        layout="sizes, prev, pager, next"
        :current-page="pagination.currentPage + 1"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagination.pageSize"
        :total="pagination.totalElements"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />

      <div class="goto-page">
        <span>Go to:</span>
        <el-input
          v-model="gotoPage"
          type="number"
          style="width: 80px"
          size="small"
          @keyup.enter="jumpToPage"
          :min="1"
          :max="pagination?.totalPages || 1"
        />
        <el-button size="small" @click="jumpToPage">Go</el-button>
      </div>
    </div>
  </div>

  <StudentFormDialog
    v-model="studentFormDialogVisible"
    :student="selectedStudent"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { studentApi } from '@/api/studentApi'
import StudentTable from '@/components/StudentTable.vue'
import StudentSearch from '@/components/StudentSearch.vue'
import StudentFormDialog from '@/components/StudentFormDialog.vue'
import cloneDeep from 'lodash-es/cloneDeep'

const students = ref([])
const pagination = ref(null)
const gotoPage = ref('')
const selectedStudent = ref(null)

const currentSearch = ref({ query: '', field: 'name' })
const studentFormDialogVisible = ref(false)


/* ============================
      OPEN DIALOG
=============================== */
function openAddDialog() {
  selectedStudent.value = null
  studentFormDialogVisible.value = true
}

function openStudentDialog(student) {
  selectedStudent.value = cloneDeep(student)
  studentFormDialogVisible.value = true
}


/* ============================
      FETCH STUDENTS
=============================== */
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
    ElMessage.error('Không thể tải dữ liệu.')
    students.value = []
    pagination.value = null
  }
}


/* ============================
     CREATE / UPDATE STUDENT
=============================== */
async function handleSubmit(formData) {
  try {
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('email', formData.email)

    // Ảnh mới upload
    if (formData.images?.length) {
      formData.images.forEach(img => fd.append('images', img))
    }

    if (formData.id) {
      // UPDATE
      fd.append('studentId', formData.id)

      // Ảnh bị xóa
      if (formData.deleteImageIds?.length) {
        formData.deleteImageIds.forEach(id => fd.append('deleteImageIds', id))
      }

      await studentApi.updateStudent(fd)
      ElMessage.success('Student updated!')

    } else {
      // CREATE
      await studentApi.create(fd, true)
      ElMessage.success('Student created!')
    }

    // đóng dialog & refresh
    studentFormDialogVisible.value = false
    fetchStudents(0, pagination.value?.pageSize || 10)

  } catch (err) {
    console.error(err)
    ElMessage.error('Cannot submit student.')
  }
}


/* ============================
        SEARCH
=============================== */
function handleSearch({ query, field }) {
  currentSearch.value = { query, field }
  fetchStudents(0, pagination.value?.pageSize || 10)
}


/* ============================
       PAGINATION
=============================== */
function handlePageChange(page) {
  fetchStudents(page - 1, pagination.value.pageSize)
}

function handleSizeChange(size) {
  fetchStudents(0, size)
}

function jumpToPage() {
  if (!gotoPage.value) return

  let page = parseInt(gotoPage.value)
  if (page < 1) page = 1
  if (page > pagination.value.totalPages) page = pagination.value.totalPages

  gotoPage.value = page
  fetchStudents(page - 1, pagination.value.pageSize)
}


/* ============================
        DELETE STUDENT
=============================== */
async function deleteStudent(id) {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này?',
      'Xác nhận xóa',
      { confirmButtonText: 'Đồng ý', cancelButtonText: 'Hủy', type: 'warning' }
    )

    await studentApi.delete(id)
    ElMessage.success('Xóa sinh viên thành công!')

    fetchStudents(pagination.value.currentPage, pagination.value.pageSize)

  } catch (error) {
    if (error === 'cancel') return
    console.error('Delete student error:', error)
    ElMessage.error('Đã xảy ra lỗi khi xóa')
  }
}


onMounted(() => {
  fetchStudents()
})
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
