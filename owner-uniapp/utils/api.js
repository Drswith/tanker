import http, { httpWithoutLoading, request } from './http'

/**
 * API接口封装
 * 使用业务层HTTP实例
 */

// 用户相关API
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/usage/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/api/user/info')
  },

  // 更新用户信息
  updateUserInfo(data) {
    return request.put('/api/user/info', data)
  }
}

// 地图相关API
export const mapApi = {
  // 获取地图坐标
  getCoordinates(data) {
    return request.post('/api/usage/mapCoordinates', data)
  },

  // 获取附近站点
  getNearbyStations(data) {
    return request.get('/api/map/stations', data)
  }
}

// 订单相关API
export const orderApi = {
  // 获取订单列表
  getOrderList(data) {
    return request.post('/api/usage/orderList', data)
  },

  // 获取当前订单
  getCurrentOrder() {
    return request.get('/api/usage/currentOrder')
  },

  // 创建订单
  createOrder(data) {
    return request.post('/api/order/create', data)
  },

  // 取消订单
  cancelOrder(orderId) {
    return request.post(`/api/order/${orderId}/cancel`)
  },

  // 获取订单详情
  getOrderDetail(orderId) {
    return request.get(`/api/order/${orderId}`)
  }
}

// 车辆相关API
export const vehicleApi = {
  // 获取车辆列表
  getVehicleList(data) {
    return request.get('/api/vehicle/list', data)
  },

  // 获取车辆详情
  getVehicleDetail(vehicleId) {
    return request.get(`/api/vehicle/${vehicleId}`)
  }
}

// 文件上传API
export const uploadApi = {
  // 上传图片
  uploadImage(filePath, formData = {}) {
    return request.upload('/api/upload/image', filePath, formData)
  },

  // 上传文件
  uploadFile(filePath, formData = {}) {
    return request.upload('/api/upload/file', filePath, formData)
  }
}

// 无加载状态的API（用于频繁调用的接口）
export const silentApi = {
  // 心跳检测
  heartbeat() {
    return httpWithoutLoading.get('/api/heartbeat')
  },

  // 获取实时位置
  getRealTimeLocation(data) {
    return httpWithoutLoading.post('/api/location/realtime', data)
  }
}

// 导出默认HTTP实例和便捷方法
export { http as default, request }

// 使用示例：
/*
// 1. 使用封装的API
import { userApi, orderApi } from '@/utils/api'

// 登录
const loginResult = await userApi.login({ username, password })

// 获取订单列表
const orders = await orderApi.getOrderList({ page: 1, size: 10 })

// 2. 使用便捷方法
import { request } from '@/utils/api'

// GET请求
const data = await request.get('/api/test', { id: 1 })

// POST请求
const result = await request.post('/api/test', { name: 'test' })

// 3. 使用HTTP实例
import http from '@/utils/api'

// 直接使用实例
const response = await http.get('/api/test')

// 4. 并发请求
import { request } from '@/utils/api'

const [user, orders] = await request.all([
  userApi.getUserInfo(),
  orderApi.getOrderList()
])

// 5. 文件上传
import { uploadApi } from '@/utils/api'

const imageUrl = await uploadApi.uploadImage('/path/to/image.jpg')
*/
