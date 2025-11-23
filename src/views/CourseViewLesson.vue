<template>
  <div class="p-4 space-y-6">
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/course">{{ t('course.title') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ t('lesson.breadcrumbs') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Course Header -->
    <el-card shadow="hover" class="rounded-xl">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ course?.name }}
          </h2>
          <p class="text-gray-500 text-sm">
            {{ t('course.code') }}: <strong>{{ course?.code }}</strong>
          </p>
        </div>

        <el-tag type="success" size="large" v-if="course?.status === '1'">
          {{ t('course.active') }}
        </el-tag>
        <el-tag type="danger" size="large" v-else>
          {{ t('course.inactive') }}
        </el-tag>
      </div>

      <!-- Images -->
      <el-carousel v-if="course?.images?.length" :interval="5000" arrow="always">
        <el-carousel-item v-for="img in course.images" :key="img.id">
          <div
            class="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
          >
            <el-image :src="img.url" fit="cover" class="w-full h-full" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>

    <!-- Button to add new lesson -->
    <el-button type="primary" @click="openAddLessonDialog">
      {{ t('lesson.addNew') }}
    </el-button>

    <!-- Lessons Table -->
    <el-card shadow="hover" class="rounded-xl">
      <h3 class="text-xl font-semibold mb-4">{{ t('lesson.list') }}</h3>

      <EntityTableAdvanced
        :rows="tableRows"
        :columns="tableColumns"
        :show-index="true"
        :actions="lessonActions"
      >
        <!-- Image Slot -->
        <template #image="{ row }">
          <el-carousel
            v-if="row.images?.length"
            height="200px"
            indicator-position="none"
            arrow="always"
          >
            <el-carousel-item v-for="img in row.images" :key="img.id">
              <el-image :src="img.url" class="w-20 h-20 rounded border object-cover" />
            </el-carousel-item>
          </el-carousel>

          <span v-else>{{ t('lesson.noImage') }}</span>
        </template>

        <!-- Video Slot -->
        <template #video="{ row }">
          <div v-if="row.videos?.length" class="flex flex-col gap-1">
            <a
              v-for="v in row.videos"
              :key="v.id"
              :href="v.url"
              target="_blank"
              class="text-blue-600 underline"
            >
              {{ t('lesson.video') }} {{ v.id }}
            </a>
          </div>
          <span v-else>{{ t('lesson.noVideo') }}</span>
        </template>
      </EntityTableAdvanced>
    </el-card>

    <!-- Reusable Dialog cho Course -->
    <AddLessonDialog
      v-model="isAddLessonDialogVisible"
      :entityData="newLesson"
      :fields="lessonFields"
      :rules="lessonRules"
      :hasUpload="true"
      :hasUploadVideo="true"
      :title="t('lesson.addNew')"
      @submit="handleCreateLesson"
    />
    <AddLessonDialog
      v-model="isEditLessonDialogVisible"
      :entityData="editingLesson"
      :fields="lessonFields"
      :rules="lessonRules"
      :hasUpload="true"
      :hasUploadVideo="true"
      :title="t('lesson.edit')"
      @submit="handleUpdateLesson"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import EntityTableAdvanced from '@/components/EntityTableAdvanced.vue'
import { courseApi } from '@/api/courseApi'
import { lessonApi } from '@/api/lessonApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import AddLessonDialog from '@/components/AddLessonDialog.vue'
import router from '@/router/index.js'

const route = useRoute()
const { t } = useI18n()

const course = ref(null)
const lessons = ref([])
const tableRows = ref([])

const isEditLessonDialogVisible = ref(false)
const editingLesson = ref(null)

// Add New Lesson Form
const isAddLessonDialogVisible = ref(false)

const fileList = ref([]);
const videoList = ref([]);

// Form model cho Add Lesson
const newLesson = ref({
  title: '',
  description: '',
  images: [],
  videos: [],
})

// Dynamic fields
const lessonFields = [{ key: 'title', label: t('lesson.title'), type: 'el-input', props: {} }]
// Rules
const lessonRules = {
  title: [{ required: true, message: t('validation.required'), trigger: 'blur' }],
}
//Action
const lessonActions = [
  {
    name: 'edit',
    label: t('common.edit'),
    type: 'warning',
    icon: Edit,
    handler: (row) => openEditLessonDialog(row),
  },
  {
    name: 'delete',
    label: t('common.delete'),
    type: 'danger',
    icon: Delete,
    handler: (row) => deleteLesson(row.id),
  },
]
// Submit handler
async function handleCreateLesson(formData) {
  try {
    const payload = {
      courseId: Number(route.params.id),
      lessons: [
        {
          title: formData.title,
          images: formData.images?.map((img) => (typeof img === 'string' ? img : img?.url)),
          videos: formData.videos?.map((v) => (typeof v === 'string' ? v : v?.url)),
        },
      ],
    }

    await lessonApi.create(payload) // gửi JSON nguyên vẹn
    ElMessage.success(t('lesson.createSuccess'))
    isAddLessonDialogVisible.value = false
    await fetchCourseDetail()
  } catch (err) {
    console.error(err)
    ElMessage.error(t('lesson.submitError'))
  }
}

// Open Dialog
const openAddLessonDialog = () => {
  newLesson.value = { title: '', images: [], videos: [] } // reset form
  isAddLessonDialogVisible.value = true
}
const openEditLessonDialog = (lesson) => {
  console.log("Opening edit dialog for lesson:", lesson);

  if (lesson && lesson.id) {
    // Kiểm tra dữ liệu thực sự trong lesson.images và lesson.videos
    console.log("Lesson Images (before map):", lesson.images);
    console.log("Lesson Videos (before map):", lesson.videos);

    // Gán dữ liệu vào editingLesson
    editingLesson.value = {
      id: lesson.id,
      title: lesson.title,
      images: Array.isArray(lesson.images) ? lesson.images.map((img) => ({
        id: img.id,          // ID ảnh
        url: img.url,        // URL ảnh
        name: `Image ${img.id}`,  // Tên ảnh
        uid: `existing-${img.id}`  // UID ảnh
      })) : [],

      videos: Array.isArray(lesson.videos) ? lesson.videos.map((v) => ({
        id: v.id,            // ID video
        url: v.url,          // URL video
        name: `Video ${v.id}`,  // Tên video
        uid: `existing-video-${v.id}`  // UID video
      })) : [],
    };

    console.log("Editing Lesson Data (after map):", editingLesson.value);

    // Cập nhật fileList và videoList
    fileList.value = editingLesson.value.images.map((img) => ({
      name: img.name,
      url: img.url,
      uid: img.uid,
      id: img.id,
    }));

    videoList.value = editingLesson.value.videos.map((v) => ({
      name: v.name,
      url: v.url,
      uid: v.uid,
      id: v.id,
    }));

    console.log("fileList:", fileList.value); // Log mảng fileList
    console.log("videoList:", videoList.value); // Log mảng videoList

    isEditLessonDialogVisible.value = true;
  } else {
    console.error("Không có dữ liệu bài học để sửa:", lesson);
  }
};
async function handleUpdateLesson(formData) {
  try {
    const payload = {
      title: formData.title,
      imageIds: fileList.value.map(f => f.id).filter(Boolean),
      videoIds: videoList.value.map(v => v.id).filter(Boolean),
      images: formData.images || [],
      videos: formData.videos || [],
    }
    console.log("Payload gửi lên BE:", payload);
    await lessonApi.update(editingLesson.value.id, payload)
    ElMessage.success(t('lesson.updateSuccess'))
    isEditLessonDialogVisible.value = false
    await fetchCourseDetail()
  } catch (err) {
    console.error(err)
    ElMessage.error(t('lesson.submitError'))
  }
}
async function deleteLesson(id) {
  try {
    await ElMessageBox.confirm(t('lesson.deleteConfirm'), t('common.warning'), { type: 'warning' })

    await lessonApi.delete(id)
    ElMessage.success(t('lesson.deleteSuccess'))
    await fetchCourseDetail()
  } catch (err) {
    console.error(err)
  }
}
// Columns with i18n
const tableColumns = [
  { prop: 'title', label: t('lesson.title') },
  { prop: 'imagePreview', label: t('lesson.image'), slot: 'image' },
  { prop: 'videoUrl', label: t('lesson.video'), slot: 'video' },
]

async function fetchCourseDetail() {
  try {
    const id = route.params.id
    const res = await courseApi.getCourseDetail(id)

    course.value = res.data

    if (!course.value || course.value.status === 0 || course.value.status === '0') {
      router.replace({ name: 'notfound' })
      return
    }

    lessons.value = res.data.lessons
    tableRows.value = lessons.value.map((l) => ({
      ...l,
      imagePreview: l.images?.length ? l.images[0].url : null,
      videoUrl: l.videos?.length ? l.videos[0].url : null,
      statusText: l.status === '1' ? t('course.active') : t('course.inactive'),
    }))
  } catch (err) {
    console.error(err)
    // Lỗi fetch cũng redirect sang notfound
    router.replace({ name: 'notfound' })
  }
}

onMounted(fetchCourseDetail)
</script>
