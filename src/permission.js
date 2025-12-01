import router from './router'
import { useUserStore } from './store/modules/user'
import { usePermissionStore } from './store/modules/permission'
import { createDiscreteApi } from 'naive-ui'

// 创建独立的 loading bar 实例 (因为不在 setup 中)
const { loadingBar } = createDiscreteApi(['loadingBar'])

const whiteList = ['/login', '/404'] // 白名单

router.beforeEach(async (to, from, next) => {
  loadingBar.start()
  
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转首页
      next({ path: '/' })
      loadingBar.finish()
    } else {
      // 判断是否已获取用户信息
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await userStore.getUserInfo()
          
          // 基于角色生成动态路由
          const accessRoutes = await permissionStore.generateRoutes(roles)
          
          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          
          // hack 方法 确保 addRoutes 已完成
          next({ ...to, replace: true })
        } catch (error) {
          console.error(error)
          // 移除 token 并跳转登录页
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
          loadingBar.error()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      loadingBar.finish()
    }
  }
})

router.afterEach(() => {
  loadingBar.finish()
})
