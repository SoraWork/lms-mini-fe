<template>
  <el-dialog
    v-model="visibleInternal"
    :title="$t('enrollment.title')"
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
      <el-form-item :label="$t('enrollment.student')">
        <input type="hidden" v-model="form.studentId" />
        <el-input :value="props.student.name" readonly />
      </el-form-item>

      <!-- Chọn khóa học -->
      <el-form-item :label="$t('enrollment.course')" prop="courseIds">
        <el-select
          v-model="form.courseIds"
          multiple
          filterable
          clearable
          :placeholder="$t('enrollment.selectCourse')"
        >
          <el-option
            v-for="course in courses"
            :key="course.id"
            :label="course.name"
            :value="course.id"
          />
        </el-select>
      </el-form-item>

      <!-- Hidden input lưu khóa học bị xóa -->
      <input type="hidden" :value="deletedCourseIds" />
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ $t('enrollment.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ $t('enrollment.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  courseIds: [{ required: true, message: t('enrollment.validate.courseRequired') }]
}

// Watch prop visible để reset form
watch(() => props.visible, (val) => {
  visibleInternal.value = val
  if (val && props.student) {
    form.value.studentId = props.student.id
    // Khóa học đã đăng ký lúc mở dialog
    form.value.courseIds = props.student.courses?.map(c => c.id) || []
    oldRegisteredCourseIds.value = [...form.value.courseIds]
    deletedCourseIds.value = []
  }
})

// Watch form.courseIds để track deletedCourseIds
watch(() => form.value.courseIds, (newVal, oldVal) => {
  // Khóa bị bỏ ra -> thêm vào deletedCourseIds nếu trước đó đã đăng ký
  const removed = oldVal.filter(
    id => !newVal.includes(id) && oldRegisteredCourseIds.value.includes(id)
  )
  removed.forEach(id => {
    if (!deletedCourseIds.value.includes(id)) deletedCourseIds.value.push(id)
  })

  // Khóa được thêm lại -> remove khỏi deletedCourseIds
  newVal.forEach(id => {
    const index = deletedCourseIds.value.indexOf(id)
    if (index > -1) deletedCourseIds.value.splice(index, 1)
  })
})

const handleClose = () => {
  emit('update:visible', false)
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return

    // Khóa học mới thêm (create)
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
