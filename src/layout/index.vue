<template>
  <n-layout has-sider class="layout-container">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      :inverted="settingStore.invertedSider"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="layout-sider"
    >
      <Sidebar :collapsed="collapsed" />
    </n-layout-sider>

    <n-layout style="height: 100%">
      <n-layout-header>
        <Header @open-settings="openSettings" />
        <TagsView v-if="settingStore.showTagsView" />
      </n-layout-header>
      <n-layout-content class="p-4 min-h-[calc(100vh-98px)]" embedded>
        <AppMain />
      </n-layout-content>
    </n-layout>

    <Settings ref="settingsRef" />
  </n-layout>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./components/Sidebar/index.vue";
import Header from "./components/Header/index.vue";
import TagsView from "./components/TagsView/index.vue";
import AppMain from "./components/AppMain.vue";
import Settings from "./components/Settings/index.vue";
import { useSettingStore } from "@/store/modules/setting";

const collapsed = ref(false);
const settingStore = useSettingStore();
const settingsRef = ref(null);

const openSettings = () => {
  settingsRef.value?.open();
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
</style>
