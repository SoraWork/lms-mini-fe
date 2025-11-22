<template>
  <el-dialog
    v-model="visibleInternal"
    :title="title || $t('lesson.addNew')"
    width="500px"
    @close="handleClose"
  >
    <el-form
      label-position="top"
      :model="form"
      :rules="rules"
      ref="formRef"
    >
      <!-- Title Field -->
      <el-form-item label="{{ t('lesson.title') }}" :prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <!-- Description Field -->
      <el-form-item label="{{ t('lesson.description') }}" :prop="description">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>

      <!-- Image Upload -->
      <el-form-item v-if="hasUploadImage" :label="t('lesson.image')">
        <el-upload
          action=""
          :auto-upload="false"
          multiple
          list-type="picture"
          :on-change="handleImageFileChanges"
          :on-remove="handleImageRemove"
          :file-list="imageFileList"
          :disabled="uploading"
        >
          <el-button type="primary" :loading="uploading">
            {{ uploading ? t('form.uploading') : t('form.uploadImages') }}
          </el-button>
        </el-upload>
      </el-form-item>

      <!-- Video Upload -->
      <el-form-item v-if="hasUploadVideo" :label="t('lesson.video')">
        <el-upload
          action=""
          :auto-upload="false"
          :on-change="handleVideoFileChanges"
          :file-list="videoFileList"
          :disabled="uploading"
          :before-remove="handleBeforeRemoveVideo"
        >
          <el-button type="primary" :loading="uploading">
            {{ uploading ? t('form.uploading') : t('form.uploadVideo') }}
          </el-button>
        </el-upload>
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ t('form.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">
        {{ entityData ? t('form.update') : t('form.create') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  modelValue: Boolean,
  entityData: { type: Object, default: null },
  title: { type: String, default: '' },
  hasUploadImage: { type: Boolean, default: true },
  hasUploadVideo: { type: Boolean, default: true },
  rules: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Internal state
const visibleInternal = ref(false)
const uploading = ref(false)
const imageFileList = ref([]) // Image file list
const videoFileList = ref([]) // Video file list
const formRef = ref(null)

const form = ref({
  title: '',
  description: '',
  image: '',
  video: ''
})

// Watch to control visibility of dialog
watch(() => props.modelValue, (val) => (visibleInternal.value = val))

// Watch entityData to populate form for editing
watch(
  () => props.entityData,
  (val) => {
    form.value = val ? { ...val } : {}
    imageFileList.value = val?.image ? [{ name: val.image, url: val.image }] : []
    videoFileList.value = val?.video ? [{ name: val.video, url: val.video }] : []
  },
  { immediate: true }
)

// Close dialog and reset form
function handleClose() {
  emit('update:modelValue', false)
  form.value = { title: '', description: '', image: '', video: '' }
  imageFileList.value = []
  videoFileList.value = []
}

// Handle image file changes
async function handleImageFileChanges(file) {
  if (!file.raw) return
  uploading.value = true
  try {
    // Simulate uploading image
    form.value.image = URL.createObjectURL(file.raw) // Assuming the image is uploaded and we get a URL
    imageFileList.value.push(file)
    ElMessage.success(t('form.uploadSuccess'))
  } catch {
    ElMessage.error(t('form.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

// Handle image removal
function handleImageRemove(file) {
  form.value.image = ''
  imageFileList.value = imageFileList.value.filter(f => f.uid !== file.uid)
}

// Handle video file changes
async function handleVideoFileChanges(file) {
  if (!file.raw) return
  uploading.value = true
  try {
    // Simulate uploading video
    form.value.video = URL.createObjectURL(file.raw) // Assuming the video is uploaded and we get a URL
    videoFileList.value.push(file)
    ElMessage.success(t('form.uploadSuccess'))
  } catch  {
    ElMessage.error(t('form.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

// Handle before removing video file
function handleBeforeRemoveVideo(file) {
  form.value.video = ''
  videoFileList.value = videoFileList.value.filter(f => f.uid !== file.uid)
  return true
}

// Submit the form
function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    emit('submit', form.value)
    handleClose()
  })
}
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
