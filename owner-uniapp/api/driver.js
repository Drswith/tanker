import { request } from '@/utils/http'

export const driverApi = {
  // 获取司机列表
  getDriverList(data) {
    return request.get('/api/users/me/driver_user/list', data)
  },

  // 获取司机详情
  getDriverDetail(id) {
    return request.get(`/api/users/me/driver_user/${id}`)
  },

  // 添加司机
  addDriver(data) {
    return request.get('/api/users/me/add_driver', data)
  },

  // 更新司机
  updateDriver(data) {
    return request.delete('/api/users/me/update_driver', { data })
  },

  // 删除司机
  deleteDriver(id) {
    return request.delete(`/api/users/me/delete_driver/${id}`)
  },
}
