import { request } from '@/utils/http'
/**
 * 订单状态枚举映射
 *
 * 订单流程说明：
 * 0  - 已创建待支付
 * 1  - 已支付待接单
 * 2  - 已接单待签署（业主和平台）
 * 3  - 已签署司机前往发车地待验车
 * 4  - 验车通过待施封
 * 5  - 验车不通过
 * 6  - 完成施封待安装GPS
 * 7  - 完成GPS安装待司机签署
 * 8  - 司机已签署（运输中）
 * 9  - 司机确认送达待核验
 * 10 - 业主核验确认收货后待评价（用于查询）
 * 11 - 业主核验不通过
 * 12 - 已评价（用于前端查询）
 * 13 - 确认收货后待邮寄GPS
 * 14 - 已邮寄
 * 15 - 后台确认收到GPS订单结束
 * 16 - 已提交资料待退款
 * 17 - 已退款已取消
 */
export const OrderStatus = Object.freeze({
  // 订单创建阶段
  Created: 0, // 已创建待支付
  Paid: 1, // 已支付待接单

  // 接单签署阶段
  Accepted: 2, // 已接单待签署（业主和平台）
  Signed: 3, // 已签署司机前往发车地待验车

  // 验车施封阶段
  Verified: 4, // 验车通过待施封
  Unverified: 5, // 验车不通过
  Sealed: 6, // 完成施封待安装GPS

  // GPS安装阶段
  GpsInstalled: 7, // 完成GPS安装待司机签署
  DriverSigned: 8, // 司机已签署（运输中）

  // 运输配送阶段
  DeliveryConfirmed: 9, // 司机确认送达待核验
  OwnerVerified: 10, // 业主核验确认收货后待评价
  OwnerRejected: 11, // 业主核验不通过
  Evaluated: 12, // 已评价（用于前端查询）

  // GPS回收阶段
  WaitingGpsReturn: 13, // 确认收货后待邮寄GPS
  GpsShipped: 14, // 已邮寄
  GpsReceived: 15, // 后台确认收到GPS订单结束

  // 退款取消阶段
  RefundSubmitted: 16, // 已提交资料待退款
  RefundCompleted: 17, // 已退款已取消
})

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
