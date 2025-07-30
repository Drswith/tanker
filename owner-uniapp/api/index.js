/**
 * API统一入口文件
 * 导出所有API模块
 */

// 导入HTTP实例和便捷方法
import http, { request } from '@/utils/http'

// 导入各个API模块
import { mapApi } from './map'
import { orderApi } from './order'
import { silentApi } from './silent'
import { uploadApi } from './upload'
import { userApi } from './user'
import { vehicleApi } from './vehicle'

// 统一导出所有API
export {
  http,
  mapApi,
  orderApi,
  request,
  silentApi,
  uploadApi,
  userApi,
  vehicleApi
}

// 默认导出HTTP实例
export default http

/**
 * 使用示例：
 * 
 * // 1. 导入单个API模块
 * import { userApi } from '@/api'
 * const user = await userApi.getUserInfo()
 * 
 * // 2. 导入多个API模块
 * import { userApi, orderApi } from '@/api'
 * const orders = await orderApi.getOrderList()
 * 
 * // 3. 导入便捷方法
 * import { request } from '@/api'
 * const data = await request.get('/api/test')
 * 
 * // 4. 导入HTTP实例
 * import http from '@/api'
 * const response = await http.get('/api/test')
 * 
 * // 5. 从具体模块导入
 * import { userApi } from '@/api/user'
 * import { orderApi } from '@/api/order'
 */