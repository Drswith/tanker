import { httpWithoutLoading } from '@/utils/http'

/**
 * 无加载状态的API（用于频繁调用的接口）
 */
export const silentApi = {
  // 心跳检测
  heartbeat() {
    return httpWithoutLoading.get('/api/heartbeat')
  },

  // 获取实时位置
  getRealTimeLocation(data) {
    return httpWithoutLoading.post('/api/location/realtime', data)
  },
}

export default silentApi