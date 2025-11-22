import { ref, computed, watch } from 'vue';

export function useSettings() {
  // Lưu theme hiện tại (mặc định light)
  const theme = ref(localStorage.getItem('theme') || 'light');

  // Class cho navbar, table, ...
  const themeClass = computed(() =>
    theme.value === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark text-light'
  );

  // Toggle theme
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
  }

  // Watch theme và cập nhật body global
  watch(
    theme,
    (newTheme) => {
      document.body.setAttribute('data-theme', newTheme);
    },
    { immediate: true }
  );

  return { theme, themeClass, toggleTheme };
}
