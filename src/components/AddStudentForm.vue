<template>
  <el-dialog
    v-model="visible"
    title="Add New Student"
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
          :disabled="uploading"
        >
          <el-button type="primary" :loading="uploading">
            {{ uploading ? "Uploading..." : "Upload Images" }}
          </el-button>
        </el-upload>
      </el-form-item>

      <!-- Preview URLs -->
      <div v-if="form.images.length">
        <p><strong>Uploaded Images:</strong></p>
        <ul>
          <li v-for="(img, i) in form.images" :key="i">{{ img }}</li>
        </ul>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="submitForm">Create</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// ---- Cloudinary Config ----
const CLOUD_NAME = 'ddmbxigen'
const UPLOAD_PRESET = 'uploadimage'

const props = defineProps({
  modelValue: Boolean,
  student: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const uploading = ref(false)

const form = ref({
  name: '',
  email: '',
  images: [] // sẽ chứa URL Cloudinary
})

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  }
)

function closeDialog() {
  emit('update:modelValue', false)
}

/* ==========================================
   HANDLE MULTIPLE IMAGE UPLOAD
========================================== */
async function handleFileChanges(file) {
  const files = file.raw ? [file.raw] : [] // Element Plus gửi từng file một

  if (!files.length) return

  uploading.value = true

  try {
    const uploadedUrls = await uploadFilesToCloudinary(files)

    form.value.images.push(...uploadedUrls)

    ElMessage.success("Upload images successfully!")
  } catch (err) {
    ElMessage.error(err.message || "Failed to upload images")
  } finally {
    uploading.value = false
  }
}

/* ==========================================
   UPLOAD MULTIPLE FILES TO CLOUDINARY
========================================== */
async function uploadFilesToCloudinary(files) {
  const uploaded = []

  for (const file of files) {
    try {
      const url = await uploadToCloudinary(file)
      uploaded.push(url)
    } catch (err) {
      console.error("Error uploading file:", err)
    }
  }

  if (uploaded.length === 0) {
    throw new Error("All uploads failed!")
  }

  return uploaded
}

/* ==========================================
   UPLOAD SINGLE FILE TO CLOUDINARY
========================================== */
async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || "Cloudinary upload failed")
  }

  const data = await res.json()
  return data.secure_url
}

/* ==========================================
   SUBMIT FORM
========================================== */
function submitForm() {
  emit("submit", form.value)
}
</script>
