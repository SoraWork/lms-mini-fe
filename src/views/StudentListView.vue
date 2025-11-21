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

  <AddStudentForm
    v-model="addDialogVisible"
    @submit="createStudent"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { studentApi } from '@/api/studentApi'
import StudentTable from '@/components/StudentTable.vue'
import StudentSearch from '@/components/StudentSearch.vue'
import AddStudentForm from '@/components/AddStudentForm.vue'

// Khai báo biến
const students = ref([])
const pagination = ref(null)
const gotoPage = ref('')
const dialogVisibleTask = ref(false)
const selectedStudent = ref(null)

// Lưu search param hiện tại
const currentSearch = ref({ query: '', field: 'name' })
const addDialogVisible = ref(false) // Cần khai báo
const newStudent = ref(null) // Cần khai báo

function openAddDialog() {
  newStudent.value = { name: '', email: '', images: [] }
  addDialogVisible.value = true
}

// ==== FETCH STUDENTS ====
async function fetchStudents(page = 0, size = 10) {
  try {
    const params = { page, size }
    // Thêm search param đúng field
    if (currentSearch.value.query) {
      params[currentSearch.value.field] = currentSearch.value.query
    }

    const res = await studentApi.getStudents(params)
    students.value = res.data.data
    pagination.value = res.data.pagination
  } catch {
    ElMessage.error('Không thể tải dữ liệu. Vui lòng thử lại sau.')
    students.value = []
    pagination.value = null
  }
}
// ==== Create STUDENTS ====
async function createStudent(formData) {
  try {
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('email', formData.email)

    if (formData.images?.length) {
      formData.images.forEach(img => fd.append('images', img))
    }

    await studentApi.createStudent(fd)

    ElMessage.success("Student created!")

    addDialogVisible.value = false
    fetchStudents(0, pagination.value?.pageSize || 10)

  } catch {
    ElMessage.error("Cannot create student.")
  }
}


// ==== SEARCH HANDLER ====
function handleSearch({ query, field }) {
  currentSearch.value = { query, field }
  // Bắt đầu từ trang 0 (trang đầu tiên) sau khi tìm kiếm
  fetchStudents(0, pagination.value?.pageSize || 10)
}

// ==== PAGINATION ====
function handlePageChange(page) {
  fetchStudents(page - 1, pagination.value.pageSize)
}

function handleSizeChange(size) {
  fetchStudents(0, size)
}

function jumpToPage() {
  if (!gotoPage.value) return
  let page = parseInt(gotoPage.value)
  // Logic kiểm tra trang hợp lệ
  if (page < 1) page = 1
  if (page > pagination.value.totalPages) page = pagination.value.totalPages
  gotoPage.value = page
  fetchStudents(page - 1, pagination.value.pageSize)
}

// ==== EDIT & DELETE ====
function openStudentDialog(student) {
  selectedStudent.value = student
  dialogVisibleTask.value = true
}

async function deleteStudent(id) {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này?',
      'Xác nhận xóa',
      { confirmButtonText: 'Đồng ý', cancelButtonText: 'Hủy', type: 'warning' }
    )
    await studentApi.deleteStudent(id)
    ElMessage.success('Xóa sinh viên thành công!')
    // Tải lại trang hiện tại (hoặc trang trước đó nếu trang hiện tại hết phần tử)
    fetchStudents(pagination.value.currentPage, pagination.value.pageSize)
  } catch (error) {
    if (error === 'cancel') return

    // Log toàn bộ error ra console
    console.error('Delete student error:', error)

    // Thêm sau này có thể dùng error.response?.data?.message
    ElMessage.error('Có lỗi xảy ra, xem console để biết chi tiết')
  }
}

// ==== ON MOUNT ====
onMounted(() => {
  fetchStudents()
})

// Dấu đóng script setup không cần ở đây
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
