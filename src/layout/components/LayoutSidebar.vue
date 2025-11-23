<template>
  <nav
    :class="[
      'd-flex flex-column bg-dark text-white vh-100 p-3',
      { 'sidebar-collapsed': isCollapsed }
    ]"
    style="width: 240px; transition: width 0.3s;"
  >
    <!-- Logo -->
    <div class="mb-4 d-flex justify-content-center align-items-center border-bottom border-secondary pb-3">
      <img
        :src="logo"
        :class="isCollapsed ? 'logo-mini' : 'logo'"
        alt="Logo"
        style="max-height: 40px;"
      />
    </div>

    <!-- Menu -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li
        v-for="item in menuItems"
        :key="item.key"
        class="nav-item"
      >
        <!-- Parent with children -->
        <template v-if="item.children">
          <a
            href="#"
            class="nav-link text-white d-flex justify-content-between align-items-center"
            @click.prevent="toggleSubmenu(item.key)"
            :aria-expanded="isSubmenuOpen(item.key)"
            :class="{ active: isSubmenuOpen(item.key) || isAnyChildActive(item.children) }"
          >
            <span class="d-flex align-items-center">
              <component :is="item.icon" class="me-2" style="font-size: 1.25rem;" />
              <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
            </span>
            <i
              :class="[
                'bi',
                isSubmenuOpen(item.key) ? 'bi-caret-down-fill' : 'bi-caret-right-fill'
              ]"
              v-if="!isCollapsed"
            ></i>
          </a>

          <!-- Submenu -->
          <ul
            v-show="(isSubmenuOpen(item.key) || isAnyChildActive(item.children)) && !isCollapsed"
            class="nav flex-column ms-4"
          >
            <li
              v-for="child in item.children"
              :key="child.index"
              class="nav-item"
            >
              <router-link
                :to="child.index"
                class="nav-link"
                :class="{ active: activeRoute === child.index }"
              >
                {{ $t(child.label) }}
              </router-link>
            </li>
          </ul>
        </template>

        <!-- Parent without children -->
        <template v-else>
          <router-link
            :to="item.index"
            class="nav-link d-flex align-items-center"
            :class="{ active: activeRoute === item.index }"
          >
            <component :is="item.icon" class="me-2" style="font-size: 1.25rem;" />
            <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
          </router-link>
        </template>
      </li>
    </ul>

    <!-- Collapse Button -->
    <button
      type="button"
      class="btn btn-outline-light mt-auto"
      @click="isCollapsed = !isCollapsed"
      style="width: 100%;"
    >
      <i :class="isCollapsed ? 'bi bi-arrow-bar-right' : 'bi bi-arrow-bar-left'"></i>
      <span v-if="!isCollapsed" class="ms-2">{{ $t('sidebar.collapse') }}</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { User, Notebook, Document } from "@element-plus/icons-vue";
import logo from "@/assets/logo.png";

const isCollapsed = ref(false);
const openSubmenus = ref([]);

const route = useRoute();
const activeRoute = computed(() => route.path);

const menuItems = [
  { key: 'studentMgr', index: "/", label: "sidebar.studentManager", icon: User },
  { key: 'courses', index: "/course", label: "sidebar.courses", icon: Notebook },
  { key: 'viewStd', index: "/enrollment", label: "sidebar.enrollment", icon: Document },
  // {
  //   key: 'more',
  //   label: "sidebar.more",
  //   icon: Document,
  //   children: [
  //     { index: "/report", label: "sidebar.report" },
  //     { index: "/analytics", label: "sidebar.analytics" },
  //   ]
  // }
];

function toggleSubmenu(key) {
  if (openSubmenus.value.includes(key)) {
    openSubmenus.value = openSubmenus.value.filter(k => k !== key);
  } else {
    openSubmenus.value.push(key);
  }
}

function isSubmenuOpen(key) {
  return openSubmenus.value.includes(key);
}

function isAnyChildActive(children) {
  return children.some(child => activeRoute.value === child.index);
}
</script>

<style scoped>
.logo { max-height: 40px; }
.logo-mini { max-height: 32px; }

.sidebar-collapsed { width: 64px !important; }
.sidebar-collapsed .nav-link span { display: none; }

.nav-link > svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Active màu xanh */
.nav-link.active {
  background-color: #0d6efd !important;
  color: white !important;
}

.nav-link.active svg {
  fill: white;
}

.btn:focus { box-shadow: none; }
</style>
