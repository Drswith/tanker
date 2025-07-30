import { request } from '@/utils/http'

export const addressApi = {
  // 获取地址列表
  getAddressList(data) {
    return request.get('/api/users/me/address/list', data)
  },

  // 添加地址
  addAddress(data) {
    return request.post('/api/users/me/add_address', data)
  },

  // 更新地址
  updateAddress(data) {
    return request.put('/api/users/me/update_address', data)
  },

  // 删除地址?
  // deleteAddress(data) {
  //   return request.post('/api/users/me/delete_address', data)
  // },

  // 设置默认地址
  setDefaultAddress(data) {
    return request.put('/api/users/me/set_address_default', data)
  },
}
