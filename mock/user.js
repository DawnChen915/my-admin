// import { MockMethod } from 'vite-plugin-mock'

const userList = []
for (let i = 0; i < 100; i++) {
  userList.push({
    id: i + 1,
    username: `user_${i + 1}`,
    realName: `User ${i + 1}`,
    age: 20 + (i % 10),
    gender: i % 2 === 0 ? '男' : '女',
    role: i % 3 === 0 ? 'admin' : 'user',
    createTime: '2023-01-01',
    status: i % 4 === 0 ? 0 : 1 // 0: 禁用, 1: 启用
  })
}

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123') {
        return {
          code: 200,
          msg: '登录成功',
          data: {
            token: 'admin-token'
          }
        }
      } else {
        return {
          code: 400,
          msg: '用户名或密码错误'
        }
      }
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        data: {
          roles: ['admin'],
          name: 'Super Admin',
          avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
        }
      }
    }
  },
  {
    url: '/api/user/list',
    method: 'post',
    response: ({ body }) => {
      // 给分页参数设置默认值，防止参数缺失导致 slice 计算错误
      const { pageNum = 1, pageSize = 10, username, gender } = body || {}
      
      let list = userList

      // 模拟搜索
      if (username) {
        list = list.filter(item => item.username.includes(username))
      }
      if (gender) {
        list = list.filter(item => item.gender === gender)
      }

      const total = list.length
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const pageList = list.slice(start, end)

      return {
        code: 200,
        msg: '获取成功',
        data: {
          list: pageList,
          total: total,
          pageNum,
          pageSize
        }
      }
    }
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '退出成功',
        data: null
      }
    }
  }
]
