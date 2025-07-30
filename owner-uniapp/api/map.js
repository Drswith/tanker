import { request } from '@/utils/http'

/**
 * 地图相关API
 */
export const mapApi = {
  // 获取地图坐标
  getCoordinates(data) {
    return request.post('/api/usage/mapCoordinates', data)
  },

  // 获取附近站点
  getNearbyStations(data) {
    return request.get('/api/map/stations', data)
  },
}

export default mapApi