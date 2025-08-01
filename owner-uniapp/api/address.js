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

  // 获取地址详情
  getAddressDetail(id) {
    return request.get(`/api/users/me/user_address_detail/${id}`)
  },

  // 删除地址
  deleteAddress(id) {
    return request.delete(`/api/users/me/delete_address/${id}`)
  },

  // 设置默认地址
  setDefaultAddress(data) {
    return request.put('/api/users/me/set_address_default', data)
  },

  // 发货地址列表
  getShippingAddressList(data) {
    return request.get('/api/order/get_shipping_address_list', data)
  },
}
