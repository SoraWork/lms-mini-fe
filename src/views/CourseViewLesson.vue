<template>
  <div class="p-4 space-y-6">

    <!-- Breadcrumb -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/course">{{ t("course.title") }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ t("lesson.breadcrumbs") }}</el-breadcrumb-item>
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
          <div class="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <el-image
              :src="img.url"
              fit="cover"
              class="w-full h-full"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>

    <!-- Button to add new lesson -->
    <el-button type="primary" @click="openAddLessonDialog">
      {{ t("lesson.addNew") }}
    </el-button>

    <!-- Lessons Table -->
    <el-card shadow="hover" class="rounded-xl">
      <h3 class="text-xl font-semibold mb-4">{{ t("lesson.list") }}</h3>

      <EntityTableAdvanced
        :rows="tableRows"
        :columns="tableColumns"
        :show-index="true"
      >
        <!-- Image Slot -->
        <template #image="{ row }">
          <el-image
            v-if="row.imagePreview"
            :src="row.imagePreview"
            class="w-16 h-16 rounded border"
            fit="cover"
          />
          <span v-else>{{ t("lesson.noImage") }}</span>
        </template>

        <!-- Video Slot -->
        <template #video="{ row }">
          <a
            v-if="row.videoUrl"
            :href="row.videoUrl"
            class="text-blue-600 underline"
            target="_blank"
          >
            {{ t("lesson.video") }}
          </a>
          <span v-else>{{ t("lesson.noVideo") }}</span>
        </template>

      </EntityTableAdvanced>

    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import EntityTableAdvanced from "@/components/EntityTableAdvanced.vue";
import { courseApi } from "@/api/courseApi";

const route = useRoute();
const { t } = useI18n();

const course = ref(null);
const lessons = ref([]);
const tableRows = ref([]);

// Add New Lesson Form
const isAddLessonDialogVisible = ref(false);

// Columns with i18n
const tableColumns = [
  { prop: "title", label: t("lesson.title") },
  { prop: "imagePreview", label: t("lesson.image"), slot: "image" },
  { prop: "videoUrl", label: t("lesson.video"), slot: "video" },
];

async function fetchCourseDetail() {
  const id = route.params.id;
  const res = await courseApi.getCourseDetail(id);

  course.value = res.data;
  lessons.value = res.data.lessons;

  tableRows.value = lessons.value.map(l => ({
    ...l,
    imagePreview: l.images?.length ? l.images[0].url : null,
    videoUrl: l.videos?.length ? l.videos[0].url : null,
    statusText: l.status === "1" ? t("course.active") : t("course.inactive"),
  }));
}

onMounted(fetchCourseDetail);

// Open Add Lesson Dialog
const openAddLessonDialog = () => {
  isAddLessonDialogVisible.value = true;
};

</script>
