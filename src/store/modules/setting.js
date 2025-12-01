import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  // 从 localStorage 读取初始值，如果没有则使用默认值
  const getLocalState = (key, defaultValue) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  }

  const showBreadcrumb = ref(getLocalState('showBreadcrumb', true))
  const showTagsView = ref(getLocalState('showTagsView', true))
  const showLogo = ref(getLocalState('showLogo', true))
  const invertedSider = ref(getLocalState('invertedSider', false)) // 深色侧边栏
  const primaryColor = ref(getLocalState('primaryColor', '#18a058'))
  const darkPrimaryColor = ref(getLocalState('darkPrimaryColor', '#1f8eed'))

  // 监听变化并保存到 localStorage
  watch([showBreadcrumb, showTagsView, showLogo, invertedSider, primaryColor, darkPrimaryColor], () => {
    localStorage.setItem('showBreadcrumb', JSON.stringify(showBreadcrumb.value))
    localStorage.setItem('showTagsView', JSON.stringify(showTagsView.value))
    localStorage.setItem('showLogo', JSON.stringify(showLogo.value))
    localStorage.setItem('invertedSider', JSON.stringify(invertedSider.value))
    localStorage.setItem('primaryColor', JSON.stringify(primaryColor.value))
    localStorage.setItem('darkPrimaryColor', JSON.stringify(darkPrimaryColor.value))
  })

  // 重置配置
  const resetSetting = () => {
    showBreadcrumb.value = true
    showTagsView.value = true
    showLogo.value = true
    invertedSider.value = false
    primaryColor.value = '#18a058'
    darkPrimaryColor.value = '#1f8eed'
  }

  return {
    showBreadcrumb,
    showTagsView,
    showLogo,
    invertedSider,
    primaryColor,
    darkPrimaryColor,
    resetSetting
  }
})
