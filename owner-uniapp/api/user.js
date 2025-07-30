import { request } from '@/utils/http'

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/auth/login', data)
  },

  // 获取用户信息
  getMyProfile(data) {
    return request.get('/api/users/me/profile', data)
  },

  // 更新用户信息
  updateMyProfile(data) {
    return request.put('/api/users/me', data)
  },
}
