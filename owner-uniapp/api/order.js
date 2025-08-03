import { request } from '@/utils/http'
/**
 * 订单状态映射表 - 单一数据源
 * 包含状态码、键名、显示文本和描述
 */
const OrderStatusMap = Object.freeze([
  // 订单创建阶段
  { code: 0, key: 'Created', text: '待支付', desc: '已创建待支付' },
  { code: 1, key: 'Paid', text: '待接单', desc: '已支付待接单' },

  // 接单签署阶段
  { code: 2, key: 'Accepted', text: '待签署', desc: '已接单待签署（业主和平台）' },
  { code: 3, key: 'Signed', text: '待验车', desc: '已签署司机前往发车地待验车' },

  // 验车施封阶段
  { code: 4, key: 'Verified', text: '待施封', desc: '验车通过待施封' },
  { code: 5, key: 'Unverified', text: '验车失败', desc: '验车不通过' },
  { code: 6, key: 'Sealed', text: '待安装GPS', desc: '完成施封待安装GPS' },

  // GPS安装阶段
  { code: 7, key: 'GpsInstalled', text: '待司机签署', desc: '完成GPS安装待司机签署' },
  { code: 8, key: 'DriverSigned', text: '运输中', desc: '司机已签署（运输中）' },

  // 运输配送阶段
  { code: 9, key: 'DeliveryConfirmed', text: '待核验', desc: '司机确认送达待核验' },
  { code: 10, key: 'OwnerVerified', text: '待评价', desc: '业主核验确认收货后待评价（用于查询）' },
  { code: 11, key: 'OwnerRejected', text: '核验失败', desc: '业主核验不通过' },
  { code: 12, key: 'Evaluated', text: '已评价', desc: '已评价（用于前端查询）' },

  // GPS回收阶段
  { code: 13, key: 'WaitingGpsReturn', text: 'GPS待回收', desc: '确认收货后待邮寄GPS' },
  { code: 14, key: 'GpsShipped', text: 'GPS已邮寄', desc: '已邮寄' },
  { code: 15, key: 'GpsReceived', text: '已完成', desc: '后台确认收到GPS订单结束' },

  // 退款取消阶段
  { code: 16, key: 'RefundSubmitted', text: '待退款', desc: '已提交资料待退款' },
  { code: 17, key: 'RefundCompleted', text: '已退款', desc: '已退款已取消' },
])

/**
 * 订单状态枚举 - 从OrderStatusMap计算得出
 * @example
 * const OrderStatus = {
 *   Created: 0, // 待支付 - 已创建待支付
 *   Paid: 1, // 待接单 - 已支付待接单
 *   Accepted: 2, // 待签署 - 已接单待签署（业主和平台）
 *   Signed: 3, // 待验车 - 已签署司机前往发车地待验车
 *   Verified: 4, // 待施封 - 验车通过待施封
 *   Unverified: 5, // 验车失败 - 验车不通过
 *   Sealed: 6, // 待安装GPS - 完成施封待安装GPS
 *   GpsInstalled: 7, // 待司机签署 - 完成GPS安装待司机签署
 *   DriverSigned: 8, // 运输中 - 司机已签署（运输中）
 *   DeliveryConfirmed: 9, // 待核验 - 司机确认送达待核验
 *   OwnerVerified: 10, // 待评价 - 业主核验确认收货后待评价（用于查询）
 *   OwnerRejected: 11, // 核验失败 - 业主核验不通过
 *   Evaluated: 12, // 已评价 - 已评价（用于前端查询）
 *   WaitingGpsReturn: 13, // GPS待回收 - 确认收货后待邮寄GPS
 *   GpsShipped: 14, // GPS已邮寄 - 已邮寄
 *   GpsReceived: 15, // 已完成 - 后台确认收到GPS订单结束
 *   RefundSubmitted: 16, // 待退款 - 已提交资料待退款
 *   RefundCompleted: 17, // 已退款 - 已退款已取消
 * }
 */
export const OrderStatus = Object.freeze(
  OrderStatusMap.reduce((acc, item) => {
    acc[item.key] = item.code
    return acc
  }, {}),
)

/**
 * 订单状态文本映射 - 从OrderStatusMap计算得出
 * @example
 * const OrderStatusText = {
 *   0: '待支付', // 已创建待支付
 *   1: '待接单', // 已支付待接单
 *   2: '待签署', // 已接单待签署（业主和平台）
 *   3: '待验车', // 已签署司机前往发车地待验车
 *   4: '待施封', // 验车通过待施封
 *   5: '验车失败', // 验车不通过
 *   6: '待安装GPS', // 完成施封待安装GPS
 *   7: '待司机签署', // 完成GPS安装待司机签署
 *   8: '运输中', // 司机已签署（运输中）
 *   9: '待核验', // 司机确认送达待核验
 *   10: '待评价', // 业主核验确认收货后待评价（用于查询）
 *   11: '核验失败', // 业主核验不通过
 *   12: '已评价', // 已评价（用于前端查询）
 *   13: 'GPS待回收', // 确认收货后待邮寄GPS
 *   14: 'GPS已邮寄', // 已邮寄
 *   15: '已完成', // 后台确认收到GPS订单结束
 *   16: '待退款', // 已提交资料待退款
 *   17: '已退款', // 已退款已取消
 * }
 */
export const OrderStatusText = Object.freeze(
  OrderStatusMap.reduce((acc, item) => {
    acc[item.code] = item.text
    return acc
  }, {}),
)

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

  // 订单详情
  getOrderDetail(id) {
    return request.get(`/api/order/detail/${id}`)
  },

  // 获取当前订单
  getCurrentOrder(data) {
    return request.get('/api/order/current_order', data)
  },

  // 取消订单(退款)
  cancelOrder(data) {
    return request.put('/api/order/cancel', data)
  },

  // 删除订单
  deleteOrder(id) {
    return request.delete(`/api/order/delete_order/${id}`)
  },

  // 签署合同
  signContract(data) {
    return request.post('/api/order/contract', data)
  },

  // 获取验收链接
  getOrderCheckLink(data) {
    return request.get(`/api/order/copy_link`, data)
  },

  // 验证验收授权链接
  verifyOrderCheckLink(data) {
    return request.get(`/api/order/verify_link`, data)
  },

  // 评价订单
  evaluateOrder(data) {
    return request.post('/api/order/evaluate', data)
  },

  // GPS寄回
  gpsReturn(data) {
    return request.put('/api/order/return_gps', data)
  },

  // 查询铅封码
  getLeadSealCode(data) {
    return request.get('/api/order/get_lead_seal_code', data)
  },

  // 确认收货
  confirmReceipt(data) {
    return request.put('/api/order/confirm_receipt', data)
  },
}
