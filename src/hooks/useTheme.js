import { ref, computed, watch } from 'vue'
import { darkTheme } from 'naive-ui'

const isDark = ref(localStorage.getItem('theme') === 'dark')

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const theme = computed(() => (isDark.value ? darkTheme : null))

  watch(
    isDark,
    (val) => {
      const html = document.documentElement
      if (val) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
    { immediate: true }
  )

  return {
    isDark,
    theme,
    toggleTheme
  }
}
