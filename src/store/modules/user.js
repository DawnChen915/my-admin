import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '../../api/user'
import { usePermissionStore } from './permission'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    name: '',
    avatar: '',
    roles: [],
    userInfo: null
  }),
  actions: {
    // 登录
    login(userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          const data = res.data || res
          
          // 保存 token 和 refreshToken
          this.token = data.token
          localStorage.setItem('token', data.token)
          
          if (data.refreshToken) {
            this.refreshToken = data.refreshToken
            localStorage.setItem('refreshToken', data.refreshToken)
          }
          
          // 保存用户信息
          if (data.user) {
            this.userInfo = data.user
            this.name = data.user.name || data.user.username
            this.avatar = data.user.avatar
            this.roles = data.user.role ? [data.user.role] : ['user']
          }
          
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data || res
          
          if (!data) {
            reject('Verification failed, please Login again.')
            return
          }

          const { roles, name, avatar } = data

          if (!roles || roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!')
            return
          }

          this.roles = roles
          this.name = name
          this.avatar = avatar
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出登录
    logout() {
      return new Promise((resolve) => {
        logout().then(() => {
          this.resetToken()
          resolve()
        }).catch((error) => {
          // 即使后端调用失败，也要清除本地的登录状态
          console.error('Logout API failed, clearing local state:', error)
          this.resetToken()
          resolve()
        })
      })
    },
    // 重置 token
    resetToken() {
      return new Promise(resolve => {
        const permissionStore = usePermissionStore()
        
        this.token = ''
        this.refreshToken = ''
        this.roles = []
        this.userInfo = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        
        // 清除权限路由
        permissionStore.resetRoutes()
        
        resolve()
      })
    }
  }
})
