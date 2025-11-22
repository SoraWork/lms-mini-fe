<template>
  <div class="search-container">
    <div class="search-title">
      <Search class="search-icon" />
      <p class="search-text">{{ $t('search.title') }}</p>
    </div>

    <div class="search-bar">
      <el-select
        v-model="field"
        class="search-select"
        :placeholder="$t('search.by')"
      >
        <el-option
          v-for="option in translatedFields"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <el-input
        v-model="query"
        class="search-input"
        :placeholder="placeholderQuery || $t('search.placeholder')"
        :prefix-icon="Search"
        @input="onInputChange"
        @keyup.enter="onSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import debounce from 'lodash/debounce'
import { Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  fields: {
    type: Array,
    default: () => [
      { label: 'search.name', value: 'name' },
      { label: 'search.email', value: 'email' }
    ]
  },
  placeholderQuery: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object,
    default: () => ({ query: '', field: 'name' })
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const query = ref(props.modelValue.query)
const field = ref(props.modelValue.field)

/**
 * Translate dynamic fields passed via props
 * e.g. { label: 'search.name' } → $t('search.name')
 */
const translatedFields = computed(() =>
  props.fields.map(f => ({
    label: t(f.label) || f.label,
    value: f.value
  }))
)

// debounce để search realtime
const debounceEmit = debounce(() => {
  emit('search', { query: query.value, field: field.value })
}, 500)

function onInputChange() {
  debounceEmit()
  emit('update:modelValue', { query: query.value, field: field.value })
}

function onSearch() {
  emit('search', { query: query.value, field: field.value })
}
</script>

<style scoped>
.search-container {
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 1.5px solid #d1d1d1; /* tăng độ đậm */
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.search-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.search-icon {
  font-size: 18px;
  width: 24px;
  height: 24px;
  color: #409eff;
}

.search-text {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

/* Thanh search */
.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-select {
  width: 200px;
}

.search-input {
  width: 320px;
}

/* Bằng chiều cao */
.search-select :deep(.el-input__wrapper),
.search-input :deep(.el-input__wrapper) {
  height: 42px !important;
  font-size: 15px;
  border-radius: 8px;
  padding: 0 12px;
}

.search-input :deep(input::placeholder) {
  font-size: 15px;
  font-weight: 500;
  color: #999;
}
</style>
