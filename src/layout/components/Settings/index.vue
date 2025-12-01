<template>
  <n-drawer v-model:show="active" width="300" placement="right">
    <n-drawer-content title="项目配置">
      <n-divider>界面显示</n-divider>
      <div class="setting-item">
        <span>显示面包屑</span>
        <n-switch v-model:value="settingStore.showBreadcrumb" />
      </div>
      <div class="setting-item">
        <span>显示标签栏</span>
        <n-switch v-model:value="settingStore.showTagsView" />
      </div>
      <div class="setting-item">
        <span>显示 Logo</span>
        <n-switch v-model:value="settingStore.showLogo" />
      </div>

      <n-divider>主题风格</n-divider>
      <div class="setting-item">
        <span>深色侧边栏</span>
        <n-switch v-model:value="settingStore.invertedSider" />
      </div>
      <div class="setting-item">
        <span>主题颜色</span>
        <n-color-picker
          v-model:value="settingStore.primaryColor"
          :show-alpha="false"
          class="w-100px"
        />
      </div>
      <div class="setting-item">
        <span>深色主题颜色</span>
        <n-color-picker
          v-model:value="settingStore.darkPrimaryColor"
          :show-alpha="false"
          class="w-100px"
        />
      </div>

      <n-divider />
      <n-button block type="warning" @click="settingStore.resetSetting">
        重置配置
      </n-button>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingStore } from '@/store/modules/setting'

const active = ref(false)
const settingStore = useSettingStore()

const open = () => {
  active.value = true
}

defineExpose({
  open
})
</script>

<style scoped>
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
