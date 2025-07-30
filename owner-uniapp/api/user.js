import { request } from '@/utils/http'

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/auth/login', data)
  },
}

export default userApi
