import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '../../api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    name: '',
    avatar: '',
    roles: []
  }),
  actions: {
    // 登录
    login(userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          // 注意：这里假设 api 返回的是 res.data (因为拦截器里已经解包了)
          // 但由于我们现在用的是模拟 Promise，没有走拦截器，所以直接取 res.data
          // 如果切换到真实 request，拦截器返回的是 res.data，所以这里直接用 res 即可
          // 为了兼容模拟数据，这里做个判断
          const data = res.data || res
          
          this.token = data.token
          localStorage.setItem('token', data.token)
          resolve()
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
      return new Promise((resolve, reject) => {
        logout().then(() => {
          this.token = ''
          this.roles = []
          localStorage.removeItem('token')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})
