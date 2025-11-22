<template>
  <div class="d-flex">
    <LayoutSidebar />
    <div class="flex-grow-1 d-flex flex-column vh-100 overflow-hidden">
      <LayoutTopbar />
      <main class="flex-grow-1 overflow-auto p-3 bg-light">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import LayoutSidebar from './components/LayoutSidebar.vue';
import LayoutTopbar from './components/LayoutTopbar.vue';
</script>

<style scoped>
/* main layout full height handled by vh-100 and flex */
</style>
