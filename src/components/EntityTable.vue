<template>
  <div class="table-wrapper">
    <el-table :data="rows" border height="500" style="width: 100%" :empty-text="emptyText">
      <el-table-column
        v-if="showIndex"
        type="index"
        label="#"
        width="60"
      />
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth || 120"
      />

      <el-table-column
        v-if="actions?.length"
        label="Actions"
        min-width="200"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            v-for="action in actions"
            :key="action.name"
            size="small"
            :type="action.type"
            class="action-button"
            @click="action.handler(row)"
            :icon="action.icon"
          >
            {{ action.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
 defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }, // [{ prop, label, minWidth? }]
  actions: { type: Array, default: () => [] }, // [{ label, handler, type, icon }]
  showIndex: { type: Boolean, default: true },
  emptyText: { type: String, default: 'Không có dữ liệu' }
})
</script>

<style>
.table-wrapper {
  border: 1.5px solid #d1d1d1; /* viền ngoài đậm hơn */
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.action-button {
  margin-right: 4px;
}
</style>
