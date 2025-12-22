/**
 * Token 刷新管理
 * 处理 token 过期自动刷新
 */

import { useUserStore } from '../store/modules/user'
import axios from 'axios'

let refreshPromise = null
let refreshFailureCount = 0 // 记录刷新失败次数
let lastRefreshFailureTime = 0 // 记录上次刷新失败的时间
const MAX_REFRESH_FAILURES = 3 // 最多失败 3 次
const REFRESH_FAILURE_TIMEOUT = 5 * 60 * 1000 // 5 分钟后重置计数

/**
 * 刷新 token
 */
export const refreshTokenRequest = async () => {
  const userStore = useUserStore()
  
  if (!userStore.refreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/refresh-token`,
      { refreshToken: userStore.refreshToken },
      { timeout: 5000 } // 设置更短的超时时间
    )
    
    const { token, refreshToken, expiresIn } = response.data?.data || response.data
    
    // 刷新成功，重置失败计数
    refreshFailureCount = 0
    lastRefreshFailureTime = 0
    
    // 更新存储的 token
    userStore.token = token
    localStorage.setItem('token', token)
    
    if (refreshToken) {
      userStore.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    }
    
    return { token, expiresIn }
  } catch (error) {
    // 记录失败次数
    const now = Date.now()
    if (now - lastRefreshFailureTime > REFRESH_FAILURE_TIMEOUT) {
      // 超过 5 分钟未刷新失败，重置计数
      refreshFailureCount = 0
    }
    
    refreshFailureCount++
    lastRefreshFailureTime = now
    
    // 如果连续失败次数超过限制，直接清除登录状态，不再尝试刷新
    if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
      console.error('Token refresh failed multiple times, clearing login state')
      userStore.resetToken() // 使用 resetToken 避免再次调用 logout API
    }
    
    throw error
  }
}

/**
 * 处理 token 刷新（避免并发请求时多次刷新）
 */
export const handleTokenRefresh = () => {
  // 如果已经在刷新，等待刷新完成
  if (refreshPromise) {
    return refreshPromise
  }

  // 创建新的刷新请求
  refreshPromise = refreshTokenRequest()
    .catch(error => {
      console.error('Token refresh failed:', error)
      throw error
    })
    .finally(() => {
      // 刷新完成后清空 promise
      refreshPromise = null
    })

  return refreshPromise
}

/**
 * 获取当前的刷新失败计数
 */
export const getRefreshFailureCount = () => {
  return refreshFailureCount
}

/**
 * 重置刷新失败计数（成功登录时调用）
 */
export const resetRefreshFailureCount = () => {
  refreshFailureCount = 0
  lastRefreshFailureTime = 0
}

/**
 * 获取 token 的过期时间
 */
export const getTokenExpiryTime = (token) => {
  try {
    // JWT token 的负载部分是 Base64 编码的 JSON
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // 添加缺失的 Base64 填充
    const payload = parts[1]
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    
    const decoded = JSON.parse(atob(paddedPayload))
    return decoded.exp ? decoded.exp * 1000 : null // 转换为毫秒
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

/**
 * 检查 token 是否即将过期（5分钟内）
 */
export const isTokenExpiringSoon = (token, bufferTime = 5 * 60 * 1000) => {
  const expiryTime = getTokenExpiryTime(token)
  if (!expiryTime) {
    return false
  }

  const currentTime = Date.now()
  return (expiryTime - currentTime) < bufferTime
}
