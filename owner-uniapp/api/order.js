import { request } from '@/utils/http'

/**
 * 订单相关API
 */
export const orderApi = {
  // 获取订单列表
  getOrderList(data) {
    return request.post('/api/usage/orderList', data)
  },

  // 获取当前订单
  getCurrentOrder(data) {
    return request.get('/api/order/current_order', data, {
      contentType: 'application/x-www-form-urlencoded',
    })
  },

  // 创建订单
  createOrder(data) {
    return request.post('/api/order/create', data)
  },

  // 取消订单
  cancelOrder(orderId) {
    return request.post(`/api/order/${orderId}/cancel`)
  },

  // 获取订单详情
  getOrderDetail(orderId) {
    return request.get(`/api/order/${orderId}`)
  },
}

export default orderApi