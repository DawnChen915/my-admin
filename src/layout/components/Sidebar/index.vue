<template>
  <div class="sidebar-container">
    <div class="logo" :class="{ collapsed: collapsed }" v-if="settingStore.showLogo">
      <img src="/vite.svg" alt="logo" />
      <span v-show="!collapsed">My Admin</span>
    </div>
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      :inverted="settingStore.invertedSider"
      @update:value="handleUpdateValue"
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { usePermissionStore } from '@/store/modules/permission'
import { useSettingStore } from '@/store/modules/setting'

const settingStore = useSettingStore()

// 模拟图标渲染函数
function renderIcon(icon) {
  // 使用 UnoCSS 图标
  const iconMap = {
    dashboard: 'i-mdi-view-dashboard',
    settings: 'i-mdi-cog',
    user: 'i-mdi-account',
    role: 'i-mdi-account-group'
  }
  const iconClass = iconMap[icon] || 'i-mdi-file-document-outline'
  return () => h(NIcon, null, { default: () => h('div', { class: iconClass }) })
}

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

// 当前激活的菜单项
const activeKey = computed(() => route.path)

/**
 * 将路由转换为菜单
 * @param {Array} routes 路由表
 * @param {String} basePath 基础路径
 */
function transformRoutes(routes, basePath = '') {
  const menu = []

  routes.forEach(route => {
    // 过滤隐藏的路由
    if (route.meta && route.meta.hidden) return

    // 临时变量，用于决定最终渲染哪个对象（是当前路由，还是它的唯一子路由）
    let renderRoute = route
    let resolvePath = route.path

    // 处理基础路径拼接
    if (!resolvePath.startsWith('/') && !resolvePath.startsWith('http')) {
      resolvePath = basePath === '/' ? `/${route.path}` : `${basePath}/${route.path}`
    }

    // 判断是否需要提升子路由
    // 条件：有 children，长度为 1，且没有 alwaysShow
    if (route.children && route.children.length === 1 && !route.meta?.alwaysShow) {
      const child = route.children[0]
      if (!child.meta?.hidden) {
        renderRoute = child
        // 重新计算 path
        if (!child.path.startsWith('/') && !child.path.startsWith('http')) {
          resolvePath = resolvePath === '/' ? `/${child.path}` : `${resolvePath}/${child.path}`
        } else {
          resolvePath = child.path
        }
      }
    }

    const item = {
      label: renderRoute.meta?.title || renderRoute.name,
      key: resolvePath,
      icon: renderRoute.meta?.icon ? renderIcon(renderRoute.meta.icon) : undefined
    }

    // 处理子路由
    if (renderRoute.children && renderRoute.children.length > 0) {
      item.children = transformRoutes(renderRoute.children, resolvePath)
    }

    menu.push(item)
  })

  return menu
}

const menuOptions = computed(() => transformRoutes(permissionStore.routes))

const handleUpdateValue = (key) => {
  if (key.startsWith('http')) {
    window.open(key, '_blank')
  } else {
    router.push(key)
  }
}
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: var(--n-text-color);
  transition: all 0.3s;
  overflow: hidden;
  white-space: nowrap;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo.collapsed img {
  margin-right: 0;
}
</style>
