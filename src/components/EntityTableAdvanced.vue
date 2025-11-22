<template>
  <div class="table-wrapper">
    <el-table
      :data="rows"
      border
      height="500"
      style="width: 100%"
      :empty-text="emptyText"
    >

      <!-- Auto index column -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="#"
        width="60"
      />

      <!-- Dynamic columns -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :label="col.label"
        :min-width="col.minWidth || 120"
      >
        <template #default="{ row }">

          <!-- nếu có slot riêng -->
          <slot
            v-if="col.slot"
            :name="col.slot"
            :row="row"
          />

          <!-- fallback: hiển thị text -->
          <span v-else>{{ row[col.prop] }}</span>

        </template>
      </el-table-column>

      <!-- Action column -->
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
            :icon="action.icon"
            @click="action.handler(row)"
            class="action-btn"
          >
            {{ action.label }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }, // [{ prop, label, slot? }]
  actions: { type: Array, default: () => [] },
  showIndex: { type: Boolean, default: true },
  emptyText: { type: String, default: "No data" }
})
</script>

<style scoped>
.table-wrapper {
  border: 1.5px solid #d1d1d1;
  border-radius: 8px;
  padding: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.action-btn {
  margin-right: 4px;
}
</style>
