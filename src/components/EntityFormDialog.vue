<template>
  <el-dialog
    v-model="visibleInternal"
    :title="title || $t('form.title')"
    width="500px"
    @close="handleClose"
  >
    <el-form
      label-position="top"
      :model="form"
      :rules="rules"
      ref="formRef"
    >
      <!-- Dynamic fields -->
      <template v-for="field in fields" :key="field.key">
        <el-form-item :label="field.label" :prop="field.key">
          <component
            :is="field.type || 'el-input'"
            v-model="form[field.key]"
            v-bind="field.props"
          />
        </el-form-item>
      </template>

      <!-- Upload images -->
      <el-form-item v-if="hasUpload" :label="$t('form.images')">
        <el-upload
          action=""
          :auto-upload="false"
          multiple
          list-type="picture"
          :on-change="handleFileChanges"
          :on-remove="handleFileRemove"
          :file-list="fileList"
          :disabled="uploading"
        >
          <el-button type="primary" :loading="uploading">
            {{ uploading ? $t('form.uploading') : $t('form.uploadImages') }}
          </el-button>
        </el-upload>
      </el-form-item>

      <!-- Hidden input lưu danh sách id ảnh bị xóa -->
      <input type="hidden" :value="deleteImageIdsString" name="deleteImageIds" />
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ $t('form.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">
        {{ entityData ? $t('form.update') : $t('form.create') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()
//err
const formRef = ref(null)
// Cloudinary Config
const CLOUD_NAME = 'ddmbxigen'
const UPLOAD_PRESET = 'uploadimage'

const props = defineProps({
  modelValue: Boolean,
  entityData: { type: Object, default: null },
  title: { type: String, default: '' },
  fields: { type: Array, default: () => [] }, // [{key, label, type, props}]
  hasUpload: { type: Boolean, default: false },
  rules: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visibleInternal = ref(false)
const uploading = ref(false)
const fileList = ref([]) // file list hiển thị
const uploadedUrlsMap = ref(new Map()) // map uid -> url
const deletedImageIds = ref([])

const deleteImageIdsString = computed(() => deletedImageIds.value.join(','))

const form = ref({})

// Watch modelValue để show/hide dialog
watch(() => props.modelValue, val => (visibleInternal.value = val))

// Watch entityData để load dữ liệu khi edit
watch(
  () => props.entityData,
  val => {
    form.value = val ? { ...val } : {}

    // Load hình ảnh cũ (nếu có)
    fileList.value =
      val?.images?.map((img, idx) => ({
        name: `Image ${idx + 1}`,
        url: img.url,
        uid: `existing-${idx}`,
        id: img.id,
      })) || []

    uploadedUrlsMap.value.clear()
    deletedImageIds.value = []
  },
  { immediate: true }
)

// Reset form khi đóng
function handleClose() {
  emit('update:modelValue', false)
  form.value = {}
  fileList.value = []
  uploadedUrlsMap.value.clear()
  deletedImageIds.value = []
}

/* ==========================================
   HANDLE FILE CHANGE / UPLOAD
========================================== */
async function handleFileChanges(file) {
  const files = file.raw ? [file.raw] : []
  if (!files.length) return

  uploading.value = true
  try {
    const uploadedUrls = await uploadFilesToCloudinary(files)

    files.forEach((f, index) => {
      fileList.value.push({
        name: f.name,
        uid: f.uid,
        url: uploadedUrls[index],
      })
      uploadedUrlsMap.value.set(f.uid, uploadedUrls[index])
    })

    form.value.images = Array.from(uploadedUrlsMap.value.values())

    ElMessage.success(t('form.uploadSuccess'))
  } catch (err) {
    ElMessage.error(err.message || t('form.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function handleFileRemove(file, fileListUpdated) {
  if (file.id) deletedImageIds.value.push(file.id)
  uploadedUrlsMap.value.delete(file.uid)
  form.value.images = Array.from(uploadedUrlsMap.value.values())
  fileList.value = fileListUpdated
}

/* ==========================================
   UPLOAD TO CLOUDINARY
========================================== */
async function uploadFilesToCloudinary(files) {
  const uploaded = []
  for (const file of files) {
    const url = await uploadToCloudinary(file)
    uploaded.push(url)
  }
  if (!uploaded.length) throw new Error(t('form.uploadFailed'))
  return uploaded
}

async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const res = await fetch(endpoint, { method: 'POST', body: formData })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || t('form.cloudinaryError'))
  }

  const data = await res.json()
  return data.secure_url
}

/* ==========================================
   SUBMIT FORM
========================================== */
function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    form.value.deleteImageIds = deletedImageIds.value
    emit('submit', form.value)
    handleClose()
  })
}
</script>
