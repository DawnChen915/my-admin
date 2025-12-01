<script setup>
import { computed } from "vue";
import { useTheme } from "./hooks/useTheme";
import { useSettingStore } from "@/store/modules/setting";

const { theme, isDark } = useTheme();
const settingStore = useSettingStore();

const themeOverrides = computed(() => {
  if (isDark.value) {
    return {
      common: {
        primaryColor: settingStore.darkPrimaryColor,
      },
    };
  } else {
    return {
      common: {
        primaryColor: settingStore.primaryColor,
      },
    };
  }
});
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <router-view></router-view>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
}
:root {
  --n-color-embedded: rgba(226, 226, 226, 0.85);

  --n-font-size: 14px;
}
:dark {
  --n-color-embedded: rgba(60, 60, 60, 0.85);
}
</style>
