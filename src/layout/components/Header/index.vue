<template>
  <div class="header-container">
    <div class="left">
      <!-- 面包屑 -->
      <n-breadcrumb v-if="settingStore.showBreadcrumb">
        <n-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="item.path"
        >
          <span v-if="index === breadcrumbList.length - 1">{{
            item.meta.title
          }}</span>
          <router-link v-else :to="item.path">{{
            item.meta.title
          }}</router-link>
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div class="right">
      <n-space align="center" size="large">
        <n-button quaternary circle size="small" @click="toggleTheme">
          <template #icon>
            <n-icon>
              <div
                :class="isDark ? 'i-mdi-weather-night' : 'i-mdi-weather-sunny'"
              />
            </n-icon>
          </template>
        </n-button>
        <n-button quaternary circle size="small">
          <template #icon>
            <n-icon>
              <div class="i-mdi-bell-outline" />
            </n-icon>
          </template>
        </n-button>
        <n-button quaternary circle size="small" @click="emit('openSettings')">
          <template #icon>
            <n-icon>
              <div class="i-mdi-cog" />
            </n-icon>
          </template>
        </n-button>
        <n-dropdown :options="userOptions" @select="handleSelect">
          <n-avatar
            round
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            style="cursor: pointer"
          />
        </n-dropdown>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { h, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { useUserStore } from "@/store/modules/user";
import { useTheme } from "@/hooks/useTheme";
import { useSettingStore } from "@/store/modules/setting";

const router = useRouter();
const route = useRoute();
const message = useMessage();
const userStore = useUserStore();
const settingStore = useSettingStore();
const { isDark, toggleTheme } = useTheme();

const emit = defineEmits(["openSettings"]);

const breadcrumbList = computed(() => {
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  const first = matched[0];
  if (first && first.name !== "Dashboard") {
    matched = [{ path: "/dashboard", meta: { title: "首页" } }].concat(matched);
  }
  return matched;
});

const userOptions = [
  {
    label: "个人中心",
    key: "profile",
  },
  {
    label: "退出登录",
    key: "logout",
  },
];

const handleSelect = async (key) => {
  if (key === "logout") {
    await userStore.logout();
    message.success("已退出登录");
    router.push("/login");
  } else {
    message.info(`点击了 ${key}`);
  }
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background-color: var(--n-color);
  border-bottom: 1px solid var(--n-border-color);
  transition: all 0.3s;
}
</style>
