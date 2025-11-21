<template>
  <div>
    <el-table :data="students" border height="600" style="width: 100%" empty-text="Không có dữ liệu">
      <el-table-column type="index" label="STT" width="60" />
      <el-table-column prop="name" label="Tên" min-width="120" />
      <el-table-column prop="email" label="Email" min-width="150" />
      <el-table-column prop="totalEnrollments" label="Tổng đăng ký" min-width="100" />
      <el-table-column label="Hành động" min-width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openViewDialog(row)" :icon="View">
            Xem chi tiết
          </el-button>
          <el-button size="small" type="primary" class="action-button" @click="emit('edit-student', row)" :icon="Edit">
            Sửa
          </el-button>
          <el-button size="small" type="danger" class="action-button" @click="emit('delete-student', row.id)" :icon="Delete">
            Xóa
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <StudentViewDialog
      v-model:visible="dialogVisible"
      :student="selectedStudent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Edit, Delete, View } from '@element-plus/icons-vue'
import StudentViewDialog from '@/components/StudentViewDialog.vue'

const dialogVisible = ref(false)
const selectedStudent = ref(null)

defineProps({
  students: { type: Array, default: () => [] }
})

const emit = defineEmits(['edit-student', 'delete-student'])

const openViewDialog = (student) => {
  selectedStudent.value = student
  dialogVisible.value = true
}
</script>

<style scoped>
/* Giữ nguyên các style hiện tại */
.el-table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  background-color: #fff;
}

.el-table th,
.el-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.el-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.el-table .el-table__row:hover {
  background-color: #f0f8ff;
}

.course-badge {
  display: inline-block;
  margin-right: 4px;
  padding: 2px 6px;
  background-color: #ebf8ff;
  color: #3178c6;
  border-radius: 4px;
  font-size: 0.875rem;
}

.action-button {
  margin-right: 4px;
}
</style>
