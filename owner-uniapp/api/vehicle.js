import { request } from '@/utils/http'

/**
 * 车辆相关API
 */
export const vehicleApi = {
  // 获取车辆列表
  getVehicleList(data) {
    return request.get('/api/vehicle/list', data)
  },

  // 获取车辆详情
  getVehicleDetail(vehicleId) {
    return request.get(`/api/vehicle/${vehicleId}`)
  },
}

export default vehicleApi