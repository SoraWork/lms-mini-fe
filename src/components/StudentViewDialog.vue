<template>
  <el-dialog
    v-model="visible"
    :title="`Chi tiết sinh viên: ${student?.name || ''}`"
    width="800px"
    :before-close="handleClose"
  >
    <div v-if="student" class="student-detail">
      <!-- Thông tin cơ bản -->
      <el-descriptions title="Thông tin cá nhân" :column="2" border>
        <el-descriptions-item label="ID">{{ student.id }}</el-descriptions-item>
        <el-descriptions-item label="Tên">{{ student.name }}</el-descriptions-item>
        <el-descriptions-item label="Email" :span="2">{{ student.email }}</el-descriptions-item>
        <el-descriptions-item label="Trạng thái">
          <el-tag :type="student.status === '1' ? 'success' : 'danger'">
            {{ student.status === '1' ? 'Hoạt động' : 'Không hoạt động' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Tổng môn đăng ký">
          {{ student.totalEnrollments }}
        </el-descriptions-item>
        <el-descriptions-item label="Ngày tạo">
          {{ formatDate(student.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="Ngày cập nhật">
          {{ formatDate(student.updatedAt) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- Danh sách hình ảnh -->
      <div class="section">
        <h3>Hình ảnh</h3>
        <div v-if="student.images && student.images.length > 0" class="image-grid">
          <div
            v-for="image in student.images"
            :key="image.id"
            class="image-item"
          >
            <el-image
              :src="getFullImageUrl(image.url)"
              :preview-src-list="student.images.map(img => getFullImageUrl(img.url))"
              fit="cover"
              class="student-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>Không thể tải ảnh</span>
                </div>
              </template>
            </el-image>
            <div class="image-type">
              <el-tag size="small">{{ image.type }}</el-tag>
            </div>
          </div>
        </div>
        <el-empty v-else description="Không có hình ảnh" :image-size="80" />
      </div>

      <!-- Danh sách khóa học -->
      <div class="section">
        <h3>Khóa học đã đăng ký ({{ student.courses ? student.courses.length : 0 }})</h3>
        <div v-if="student.courses && student.courses.length > 0" class="courses-list">
          <el-card
            v-for="course in student.courses"
            :key="course.id"
            class="course-card"
            shadow="hover"
          >
            <div class="course-info">
              <div class="course-name">{{ course.name }}</div>
              <div class="course-code">
                <el-tag type="info" size="small">Mã: {{ course.code }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="Chưa đăng ký khóa học nào" :image-size="80" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Đóng</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const handleClose = () => {
  visible.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('vi-VN')
}

const getFullImageUrl = (url) => {
  if (!url) return ''
  // Thêm base URL nếu cần, ví dụ:
  // return `http://your-api-domain.com${url}`
  return url.startsWith('http') ? url : url
}
</script>

<style scoped>
.student-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
}

.section {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.section h3 {
  margin: 0 0 16px 0;
  color: #409eff;
  font-size: 16px;
  font-weight: 600;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.image-item {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.student-image {
  width: 100%;
  height: 120px;
  display: block;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 12px;
}

.image-type {
  position: absolute;
  top: 4px;
  right: 4px;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.course-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-2px);
}

.course-info {
  padding: 8px;
}

.course-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.course-code {
  display: flex;
  justify-content: flex-start;
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

:deep(.el-descriptions__body) {
  background-color: #fafafa;
}
</style>
