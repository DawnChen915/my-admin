import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '../../router'

/**
 * 判断是否有权限
 * @param roles 当前用户角色
 * @param route 路由对象
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    generateRoutes(roles) {
      return new Promise(resolve => {
        let accessedRoutes
        if (roles.includes('admin')) {
          // 如果是 admin，拥有所有权限
          accessedRoutes = asyncRoutes || []
        } else {
          // 否则根据角色过滤
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    // 重置路由
    resetRoutes() {
      this.routes = []
      this.addRoutes = []
    }
  }
})
