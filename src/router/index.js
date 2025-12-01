import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

// 静态路由 (无需权限)
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: ':path(.*)',
        component: () => import('../views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('../views/error/404.vue'),
    meta: { hidden: true }
  }
]

// 动态路由 (需要权限)
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'settings', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'role', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router
