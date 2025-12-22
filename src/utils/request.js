import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { useUserStore } from '../store/modules/user'
import router from '../router'
import { handleTokenRefresh, isTokenExpiringSoon, getRefreshFailureCount } from './tokenRefresh'

const { message } = createDiscreteApi(['message'])

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 使用环境变量
  timeout: 10000
})

// 标志位：是否正在处理 token 刷新失败
let isHandlingTokenRefreshFailure = false

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果正在处理刷新失败且已多次失败，则阻止后续请求
    if (isHandlingTokenRefreshFailure && getRefreshFailureCount() >= 3) {
      return Promise.reject(new Error('Token refresh failed, please login again'))
    }
    
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
      // 如果 token 即将过期，进行刷新
      if (isTokenExpiringSoon(userStore.token)) {
        return handleTokenRefresh().then(() => {
          // 使用刷新后的 token
          config.headers['Authorization'] = `Bearer ${useUserStore().token}`
          return config
        }).catch(() => {
          // 刷新失败，重定向到登录页
          isHandlingTokenRefreshFailure = true
          router.push('/login')
          return Promise.reject(new Error('Token refresh failed'))
        })
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 这里假设后端返回格式为 { code: 200, data: ..., msg: ... }
    // 如果是二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return res
    }
    
    // 这里的 code 需要根据具体后端约定调整
    if (res.code !== 200) {
      message.error(res.msg || 'Error')

      // 401: Token 过期或无效，尝试刷新
      if (res.code === 401) {
        const userStore = useUserStore()
        // 防止多次尝试刷新导致的死循环
        if (isHandlingTokenRefreshFailure && getRefreshFailureCount() >= 3) {
          userStore.resetToken()
          router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
          return Promise.reject(new Error('Token refresh failed, please login again'))
        }
        
        return handleTokenRefresh()
          .then(() => {
            // 重新发送原始请求
            return service.request(response.config)
          })
          .catch(() => {
            // 刷新失败，标记状态并登出
            isHandlingTokenRefreshFailure = true
            userStore.resetToken()
            router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
            return Promise.reject(new Error('Token refresh failed'))
          })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  (error) => {
    console.error('err' + error)
    let msg = error.message || '请求失败'
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          msg = '登录过期，请重新登录'
          const userStore = useUserStore()
          // 防止 logout 再次发起请求，直接使用 resetToken
          userStore.resetToken()
          router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
          break
        case 403:
          msg = '拒绝访问'
          break
        case 404:
          msg = '请求地址出错'
          break
        case 500:
          msg = '服务器内部错误'
          break
        default:
          msg = error.response.data?.msg || '请求失败'
      }
    }
    message.error(msg)
    return Promise.reject(error)
  }
)

export default service
