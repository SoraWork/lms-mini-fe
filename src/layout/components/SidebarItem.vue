<template>
  <el-sub-menu v-if="item.children" :index="item.label">
    <template #title>
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ $t(item.label) }}</span>
    </template>

    <SidebarItem
      v-for="child in item.children"
      :key="child.index"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="item.index">
    <el-icon><component :is="item.icon" /></el-icon>
    <span>{{ $t(item.label) }}</span>
  </el-menu-item>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
});
</script>
