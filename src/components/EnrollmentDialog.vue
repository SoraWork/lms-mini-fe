<template>
  <el-dialog
    v-model="visibleInternal"
    title="Đăng ký khoá học"
    width="600px"
    @close="handleClose"
  >
    <el-form
      label-position="top"
      :model="form"
      :rules="rules"
      ref="formRef"
    >
      <!-- Học viên -->
      <el-form-item label="Student">
        <el-input v-model="form.studentId" disabled />
      </el-form-item>

      <!-- Chọn khóa học -->
      <el-form-item label="Khóa học" prop="courseIds">
        <el-select
          v-model="form.courseIds"
          multiple
          filterable
          clearable
          placeholder="Chọn khóa học"
        >
          <el-option
            v-for="course in courses"
            :key="course.id"
            :label="course.name"
            :value="course.id"
          />
        </el-select>
      </el-form-item>

      <!-- Hidden input lưu course bị xóa -->
      <input type="text" :value="deletedCourseIds" />
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Huỷ</el-button>
      <el-button type="primary" @click="submitForm">Lưu</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  student: Object,      // Học viên được chọn
  courses: Array        // Danh sách tất cả khóa học
})

const emit = defineEmits(['update:visible', 'submit'])

const visibleInternal = ref(false)
const formRef = ref()

// Form reactive
const form = ref({
  studentId: '',
  courseIds: []          // Khóa học muốn lưu
})

// Lưu state khóa học trước đó và khóa học bị xóa
const oldRegisteredCourseIds = ref([])
const deletedCourseIds = ref([])

const rules = {
  courseIds: [{ required: true, message: 'Vui lòng chọn ít nhất 1 khóa học' }]
}

// Watch prop visible để reset form
watch(() => props.visible, (val) => {
  visibleInternal.value = val
  if (val && props.student) {
    form.value.studentId = props.student.id
    form.value.courseIds = props.student.courses?.map(c => c.id) || []
    oldRegisteredCourseIds.value = [...form.value.courseIds]
    deletedCourseIds.value = []
  }
})

// Watch form.courseIds để track deletedCourseIds
watch(() => form.value.courseIds, (newVal, oldVal) => {
  const removed = oldVal.filter(
    id => !newVal.includes(id) && oldRegisteredCourseIds.value.includes(id)
  )
  removed.forEach(id => {
    if (!deletedCourseIds.value.includes(id)) deletedCourseIds.value.push(id)
  })
})

const handleClose = () => {
  emit('update:visible', false)
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return

    const courseIdsCreate = form.value.courseIds.filter(
      id => !oldRegisteredCourseIds.value.includes(id)
    )

    const payload = {
      studentId: form.value.studentId,
      courseIdsCreate,
      courseIdsDelete: [...deletedCourseIds.value]
    }

    console.log("Enrollment submit payload:", payload)

    emit('submit', payload)

    handleClose()
  })
}
</script>
