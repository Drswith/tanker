import { request } from '@/utils/http'

/**
 * 订单相关API
 */
export const orderApi = {
  // 获取订单列表
  getOrderList(data) {
    return request.get('/api/order/search', data)
  },

  // 创建订单
  createOrder(data) {
    return request.post('/api/order/create', data)
  },

  // 更新订单
  updateOrder(data) {
    return request.post('/api/order/update_order', data)
  },

  // 获取当前订单
  getCurrentOrder(data) {
    return request.get('/api/order/current_order', data)
  },

  // 删除订单
  deleteOrder(id) {
    return request.delete(`/api/order/delete/${id}`)
  },

  // 签署合同
  signContract(data) {
    return request.post('/api/order/contract', data)
  },

  // 评价订单
  evaluateOrder(data) {
    return request.post('/api/order/evaluate', data)
  },

  // GPS寄回
  gpsReturn(data) {
    return request.put('/api/order/return_gps', data)
  },
}
