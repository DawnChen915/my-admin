<template>
  <div class="tags-view-container">
    <n-scrollbar x-scrollable style="height: 34px;">
      <div class="tags-view-wrapper">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          class="tags-view-item"
          :class="isActive(tag) ? 'active' : ''"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <span
            v-if="!isAffix(tag)"
            class="close-icon"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <div class="i-mdi-close text-12px" />
          </span>
        </router-link>
      </div>
    </n-scrollbar>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="menuOptions"
      :show="showMenu"
      :on-clickoutside="closeMenu"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { computed, watch, onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)
const routes = computed(() => permissionStore.routes)

function isActive(tag) {
  return tag.path === route.path
}

function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function addTags() {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route)
  }
  return false
}

function initTags() {
  const affixTags = filterAffixTags(routes.value)
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      let tagPath = route.path
      if (!tagPath.startsWith('/')) {
        tagPath = basePath + (basePath.endsWith('/') ? '' : '/') + tagPath
      }
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

function closeSelectedTag(view) {
  tagsViewStore.delView(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function openMenu(tag, e) {
  showMenu.value = false
  nextTick(() => {
    selectedTag.value = tag
    x.value = e.clientX
    y.value = e.clientY
    showMenu.value = true
  })
}

function closeMenu() {
  showMenu.value = false
}

function handleSelect(key) {
  switch (key) {
    case 'refresh':
      refreshSelectedTag(selectedTag.value)
      break
    case 'close':
      closeSelectedTag(selectedTag.value)
      break
    case 'closeOthers':
      closeOthersTags()
      break
    case 'closeAll':
      closeAllTags(selectedTag.value)
      break
  }
  showMenu.value = false
}

function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view)
  const { fullPath } = view
  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}

function closeOthersTags() {
  router.push(selectedTag.value)
  tagsViewStore.delOthersViews(selectedTag.value).then(() => {
    // moveToCurrentTag()
  })
}

function closeAllTags(view) {
  tagsViewStore.delAllViews().then(({ visitedViews }) => {
    if (visitedViews.some((tag) => tag.path === view.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

const showMenu = ref(false)
const x = ref(0)
const y = ref(0)
const selectedTag = ref({})

const menuOptions = [
  { label: '刷新页面', key: 'refresh' },
  { label: '关闭当前', key: 'close' },
  { label: '关闭其他', key: 'closeOthers' },
  { label: '关闭所有', key: 'closeAll' }
]

watch(
  () => route.path,
  () => {
    addTags()
  }
)

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background-color: var(--n-color);
  border-bottom: 1px solid var(--n-border-color);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  transition: background-color 0.3s, border-color 0.3s;
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 10px;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid var(--n-border-color);
  color: var(--n-text-color);
  /* background-color: var(--n-text-color); */
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  /* margin-top: 4px; */
  text-decoration: none;
  border-radius: 2px;
  transition: all 0.3s;
}

.tags-view-item:first-of-type {
  margin-left: 0;
}

.tags-view-item.active {
  /* background-color: var(--n-primary-color); */
  border: 1px solid var(--n-border-color);
  color: var(--n-text-color);
}

.tags-view-item.active::before {
  content: '';
  background: var(--n-text-color);
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
}

.close-icon {
  margin-left: 5px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.close-icon:hover {
  background-color: var(--n-action-color);
  color: var(--n-text-color);
}
</style>
