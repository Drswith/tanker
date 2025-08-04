import { request } from '@/utils/http'

/**
 * 支付类型枚举
 * @typedef {object} PayTypeEnum
 * @property {'WX'} WECHAT - 微信支付
 * @property {'ZFB'} ALIPAY - 支付宝支付
 * @property {'YHK'} BANK - 银行卡支付
 *
 * @example
 * // 使用支付类型
 * const paymentMethod = PayType.WECHAT; // 'WX'
 * const isWechatPay = paymentMethod === PayType.WECHAT;
 */
export const PayType = Object.freeze({
  /** 微信支付 */
  WECHAT: 'WX',
  /** 支付宝支付 */
  ALIPAY: 'ZFB',
  /** 银行卡支付 */
  BANK: 'YHK',
})

/**
 * 退款类型枚举
 * @typedef {object} RefundTypeEnum
 * @property {0} WECHAT - 微信退款
 * @property {1} ALIPAY - 支付宝退款
 * @property {2} BANK - 银行卡退款
 *
 * @example
 * // 使用退款类型
 * const refundMethod = RefundType.WECHAT; // 0
 * const isWechatRefund = refundMethod === RefundType.WECHAT;
 */
export const RefundType = Object.freeze({
  /** 微信退款 */
  WECHAT: 0,
  /** 支付宝退款 */
  ALIPAY: 1,
  /** 银行卡退款 */
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
