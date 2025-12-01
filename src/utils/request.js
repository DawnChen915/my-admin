import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { useUserStore } from '../store/modules/user'
import router from '../router'

const { message } = createDiscreteApi(['message'])

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 使用环境变量
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
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

      // 401: Token 过期或未登录
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout().then(() => {
          router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
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
          userStore.logout().then(() => {
            router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
          })
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
