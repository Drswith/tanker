import { request } from '@/utils/http'

/**
 * 地图相关API
 */
export const mapApi = {
  // 获取地图坐标
  getCoordinates(data) {
    return request.get('/api/order/map_coordinates', data)
  },

  // 地图坐标
  getMapCoordinates(data) {
    return request.get('/api/order/map_coordinates', data)
  },
}
