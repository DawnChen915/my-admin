<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in" appear>
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<style scoped>
/* 简单的过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
