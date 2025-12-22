import router from './router'
import { useUserStore } from './store/modules/user'
import { usePermissionStore } from './store/modules/permission'
import { createDiscreteApi } from 'naive-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress 配置
NProgress.configure({ showSpinner: false })

// 创建独立的 loading bar 实例 (因为不在 setup 中)
const { loadingBar } = createDiscreteApi(['loadingBar'])

const whiteList = ['/login','/register', '/404'] // 白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  loadingBar.start()
  
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转首页
      next({ path: '/' })
      loadingBar.finish()
      NProgress.done()
    } else {
    
      // 判断是否已生成权限路由
      const hasRoutes = permissionStore.routes && permissionStore.routes.length > 0
      if (hasRoutes) {
        next()
      } else {
        try {
          // 获取用户角色
          let roles = userStore.roles
          
          // 如果没有角色信息，则获取用户信息
          if (!roles || roles.length === 0) {
            const userInfo = await userStore.getUserInfo()
            roles = userInfo.roles
          }
          
          // 基于角色生成动态路由
          const accessRoutes = await permissionStore.generateRoutes(roles)
          
          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          
          // hack 方法 确保 addRoutes 已完成
          // 使用 replace: true 避免在历史记录中留下记录
          next({ ...to, replace: true })
        } catch (error) {
          console.error(error)
          // 移除 token 并跳转登录页
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
          loadingBar.error()
          NProgress.done()
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
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  loadingBar.finish()
  NProgress.done()
})
