<template>
  <div class="search-bar">
    <el-select
      v-model="field"
      placeholder="Tìm theo"
      size="small"
      style="width: 160px"
    >
    <el-option label="Tên" value="name" />
    <el-option label="Email" value="email" />
    </el-select>

    <el-input
      v-model="query"
      placeholder="Nhập từ khóa..."
      size="small"
      style="width: 300px"
    @input="onInputChange"
    @keyup.enter="onSearch"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import debounce from 'lodash/debounce'

const emit = defineEmits(['search'])
const query = ref('')
const field = ref('name')

// debounce để search realtime
const debounceEmit = debounce(() => {
  emit('search', { query: query.value, field: field.value })
}, 500)

function onInputChange() {
  debounceEmit()
}

function onSearch() {
  emit('search', { query: query.value, field: field.value })
}

</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
