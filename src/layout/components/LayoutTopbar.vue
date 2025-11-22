<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettings } from '@/stores/useSettings';
import { ElMessage } from 'element-plus';
import avatar from '@/assets/avatar.png';

const { locale, t } = useI18n();
const { themeClass } = useSettings();

const currentLangLabel = computed(() =>
  locale.value === 'vi' ? t('navbar.vietnamese') : t('navbar.english')
);

function changeLocale(lang) {
  locale.value = lang;
}

function showDevelopingMessage() {
  ElMessage.info(t('navbar.developing'));
}
</script>


<template>
  <nav :class="['navbar navbar-expand px-3 border-bottom', themeClass]">
    <div class="container-fluid">

      <!-- Dashboard Title -->
      <span class="navbar-brand mb-0 h1">{{ $t('navbar.dashboard') }}</span>

      <ul class="navbar-nav ms-auto d-flex align-items-center">

        <!-- Language Dropdown -->
        <li class="nav-item dropdown me-3">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="localeDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ currentLangLabel }}
          </a>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeLocale('vi')">
                {{ $t('navbar.vietnamese') }}
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeLocale('en')">
                {{ $t('navbar.english') }}
              </a>
            </li>
          </ul>
        </li>

        <!-- User Dropdown -->
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex align-items-center"
            href="#"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img :src="avatar" alt="User Avatar" class="rounded-circle" width="32" height="32" />
            <span class="ms-2">{{ $t('navbar.admin') }}</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">

            <li>
              <a class="dropdown-item" href="#" @click.prevent="showDevelopingMessage">
                {{ $t('navbar.profile') }}
              </a>
            </li>

            <li><hr class="dropdown-divider" /></li>

            <li>
              <a class="dropdown-item" href="#" @click.prevent="showDevelopingMessage">
                {{ $t('navbar.logout') }}
              </a>
            </li>

          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
/* Toggle Switch Custom */
.theme-switch-wrapper {
  display: inline-block;
}

.theme-switch-checkbox {
  display: none;
}

.theme-switch-label {
  display: block;
  width: 60px;
  height: 30px;
  background: #ccc;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.switch-inner {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  position: relative;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  transition: all 0.3s;
}

.switch-inner::before {
  content: attr(data-no);
  position: absolute;
  left: 5px;
  transition: 0.3s;
}

.switch-inner::after {
  content: attr(data-yes);
  position: absolute;
  right: 5px;
  transition: 0.3s;
}

.switch-switch {
  display: block;
  width: 28px;
  height: 28px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.theme-switch-checkbox:checked + .theme-switch-label {
  background: #4caf50;
}

.theme-switch-checkbox:checked + .theme-switch-label .switch-switch {
  left: 31px;
}
</style>
