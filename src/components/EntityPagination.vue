<template>
  <div v-if="pagination" class="pagination-wrapper">
    <!-- Total elements -->
    <span>{{ $t('pagination.total', { n: pagination.totalElements || 0 }) }}</span>

    <el-pagination
      background
      layout="sizes, prev, pager, next"
      :current-page="pagination.currentPage + 1"
      :page-sizes="pageSizes"
      :page-size="pagination.pageSize"
      :total="pagination.totalElements"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />

    <div class="goto-page">
      <span>{{ $t('pagination.goTo') }}</span>

      <el-input
        v-model.number="gotoPage"
        type="number"
        style="width: 80px"
        size="small"
        @keyup.enter="jumpToPage"
        :min="1"
        :max="pagination.totalPages || 1"
      />

      <el-button size="small" @click="jumpToPage">
        {{ $t('pagination.go') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  pagination: { type: Object, default: null },
  pageSizes: { type: Array, default: () => [5, 10, 20, 50] }
})

const emit = defineEmits(['page-change', 'size-change'])

const gotoPage = ref(1)

// reset khi pagination thay đổi
watch(
  () => props.pagination,
  (newVal) => {
    if (newVal) gotoPage.value = newVal.currentPage + 1
  },
  { immediate: true }
)

function onPageChange(page) {
  if (!props.pagination) return
  emit('page-change', page)
}

function onSizeChange(size) {
  if (!props.pagination) return
  emit('size-change', size)
}

function jumpToPage() {
  if (!props.pagination) return

  let page = Number(gotoPage.value)
  if (isNaN(page) || page < 1) page = 1
  if (page > props.pagination.totalPages) page = props.pagination.totalPages

  gotoPage.value = page
  emit('page-change', page)
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: nowrap;
}

.pagination-wrapper ::v-deep(.el-pagination) {
  display: inline-flex;
  align-items: center;
}

.pagination-wrapper .goto-page {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
