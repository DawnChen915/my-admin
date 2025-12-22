import request from '../utils/request'

// 用户注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 用户登录（支持邮箱或用户名）
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

// 刷新 token
export function refreshToken(data) {
  return request({
    url: '/user/refresh-token',
    method: 'post',
    data
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
