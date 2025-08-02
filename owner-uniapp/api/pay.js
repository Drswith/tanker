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
}
