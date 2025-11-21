<template>
  <el-dialog
    v-model="visible"
    :title="props.student ? 'Edit Student' : 'Add New Student'"
    width="500px"
    @close="closeDialog"
  >
    <el-form label-position="top">
      <el-form-item label="Name">
        <el-input v-model="form.name" placeholder="Enter name" />
      </el-form-item>

      <el-form-item label="Email">
        <el-input v-model="form.email" placeholder="Enter email" />
      </el-form-item>

      <el-form-item label="Images">
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
            {{ uploading ? 'Uploading...' : 'Upload Images' }}
          </el-button>
        </el-upload>
      </el-form-item>

      <!-- Preview URLs -->
      <div v-if="form.images.length" style="display: none;">
        <p><strong>Uploaded Images:</strong></p>
        <ul>
          <li v-for="(img, i) in form.images" :key="i">{{ img }}</li>
        </ul>
      </div>

      <!-- Hidden input lưu danh sách id ảnh bị xóa -->
      <input type="hidden" :value="deleteImageIdsString" name="deleteImageIds" />
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="submitForm">
        {{ props.student ? 'Update' : 'Create' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Cloudinary Config
const CLOUD_NAME = 'ddmbxigen'
const UPLOAD_PRESET = 'uploadimage'

const props = defineProps({
  modelValue: Boolean,
  student: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const uploading = ref(false)
const fileList = ref([]) // file list hiển thị
const uploadedUrlsMap = ref(new Map()) // map uid -> url
const deletedImageIds = ref([])

const deleteImageIdsString = computed(() => deletedImageIds.value.join(','))

const form = ref({
  name: '',
  email: '',
  images: [],
  deleteImageIds: [],
})

// Watch modelValue để show/hide dialog
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

// Watch student để load dữ liệu khi edit
watch(
  () => props.student,
  (val) => {
    if (val) {
      form.value.id = val.id
      form.value.name = val.name || ''
      form.value.email = val.email || ''

      form.value.images = []
      deletedImageIds.value = []

      // Hiển thị ảnh cũ trong fileList
      fileList.value = val.images
        ? val.images.map((img, idx) => ({
          name: `Image ${idx + 1}`,
          url: img.url,
          uid: `existing-${idx}`,
          id: img.id,
        }))
        : []

      // Không set vào map
      uploadedUrlsMap.value.clear()

    } else {
      resetForm()
    }
  },
  { immediate: true }
)



// Reset form khi đóng
function resetForm() {
  form.value.id = null
  form.value.name = ''
  form.value.email = ''
  form.value.images = []
  fileList.value = []
  uploadedUrlsMap.value.clear()
  deletedImageIds.value = []
}

function closeDialog() {
  emit('update:modelValue', false)
  resetForm()
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

    // Đồng bộ form.images với map hiện tại
    form.value.images = Array.from(uploadedUrlsMap.value.values())
    ElMessage.success('Upload images successfully!')
  } catch (err) {
    ElMessage.error(err.message || 'Failed to upload images')
  } finally {
    uploading.value = false
  }
}

/* ==========================================
   HANDLE FILE REMOVE
========================================== */
function handleFileRemove(file, fileListUpdated) {
  if (file.id) {
    deletedImageIds.value.push(file.id)
  }
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
  if (!uploaded.length) throw new Error('All uploads failed!')
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
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

/* ==========================================
   SUBMIT FORM
========================================== */
function submitForm() {
  form.value.deleteImageIds = deletedImageIds.value
  emit('submit', form.value)
  console.log(form.value)
  closeDialog()
}
</script>
