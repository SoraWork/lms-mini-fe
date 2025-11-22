<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="text-center mt-5">
    <h1>{{ t('page404.title') }}</h1>
    <p>{{ t('page404.message') }}</p>
  </div>
</template>

<style scoped></style>
