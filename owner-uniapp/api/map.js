import { request } from '@/utils/http'

/**
 * 地图相关API
 */
export const mapApi = {
  // 获取地图坐标数组
  getMapCoordinates(data) {
    return request.get('/api/order/map_coordinates', data)
  },
}
