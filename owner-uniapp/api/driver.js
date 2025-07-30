import { request } from '@/utils/http'

export const driverApi = {
  // 获取司机列表
  getDriverList(data) {
    return request.get('/api/users/me/driver_user/list', data)
  },
}
