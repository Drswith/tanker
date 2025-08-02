import { request } from '@/utils/http'

/**
 * 支付类型
 */
export const PayType = Object.freeze({
  WECHAT: 'WX',
  ALIPAY: 'ZFB',
  BANK: 'YHK',
})

/**
 * 退款类型
 */
export const RefundType = Object.freeze({
  WECHAT: 0,
  ALIPAY: 1,
  BANK: 2,
})

export const payApi = {
  //  获取支付宝、银行卡支付配置
  getPayConfig() {
    return request.get('/api/settings/zf')
  },

  //  微信支付
  wxPay(data) {
    return request.post('/api/order/pay', data)
  },

  // 微信支付回调
  wxPayCallback(data) {
    return request.post('/api/order/pay/notify', data)
  },

  // 其他支付
  otherPay(data) {
    return request.post('/api/order/other_pay', data)
  },
}
