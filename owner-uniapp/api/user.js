import { request } from '@/utils/http'

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/usage/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/api/user/info')
  },

  // 更新用户信息
  updateUserInfo(data) {
    return request.put('/api/user/info', data)
  },
}

export default userApi