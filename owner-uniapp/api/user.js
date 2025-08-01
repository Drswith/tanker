import { request } from '@/utils/http'

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/auth/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 无语，好好的json报错非要用form-data
      },
    })
  },

  // 短信登录
  smsLogin(data) {
    return request.post('/api/auth/sms_login', data)
  },

  // 注册
  register(data) {
    return request.post('/api/auth/register', data)
  },

  // 登出
  logout(data) {
    return request.get('/api/auth/logout', data)
  },

  // 验证码
  getVerifyCode(data) {
    return request.get('/api/auth/verifyCode', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  // 获取用户信息
  getMyProfile(data) {
    return request.get('/api/users/me/profile', data)
  },

  // 更新用户信息
  updateMyProfile(data) {
    return request.put('/api/users/me', data)
  },

  // 更新密码
  updatePassword(data) {
    return request.put('/api/users/me/password', data)
  },
}
