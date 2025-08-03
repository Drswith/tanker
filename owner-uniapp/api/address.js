import { request } from '@/utils/http'

// 是否使用mock数据
const USE_MOCK = true

// 授权位置信息
export function authLocation() {
  return new Promise((resolve) => {
    // #ifdef H5
    resolve(true)
    // #endif

    // #ifdef MP-WEIXIN
    uni.authorize({
      scope: 'scope.userLocation',
      success() {
        resolve(true)
      },
      fail() {
        uni.showToast({
          title: '请先授权获取位置信息',
          icon: 'none',
        })
        resolve(false)
      },
    })
    // #endif
  })
}

// 获取设备当前经纬度
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        if (res.errMsg && res.errMsg.includes('ok') !== -1) {
          resolve(res)
        }
        else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

const mockCurrentLocationAddress = { status: 0, message: 'Success', request_id: 'ef1e8ec006194181a5ca9a0f2760af22', result: { location: { lat: 30.322873, lng: 120.493882 }, address: '浙江省杭州市钱塘区青六北路', address_component: { nation: '中国', province: '浙江省', city: '杭州市', district: '钱塘区', street: '青六北路', street_number: '' }, ad_info: { nation_code: '156', adcode: '330114', phone_area_code: '', city_code: '156330100', name: '中国,浙江省,杭州市,钱塘区', location: { lat: 30.32287, lng: 120.493876 }, nation: '中国', province: '浙江省', city: '杭州市', district: '钱塘区', _distance: 0 }, address_reference: { town: { id: '330114005', title: '河庄街道', location: { lat: 30.298072, lng: 120.457395 }, _distance: 0, _dir_desc: '内' }, landmark_l1: { id: '16806312916769824686', title: '萧山经济技术开发区江东区', location: { lat: 30.336281, lng: 120.494726 }, _distance: 0, _dir_desc: '内' }, landmark_l2: { id: '1108093413928051754', title: '钱塘中心', location: { lat: 30.322841, lng: 120.49383 }, _distance: 0, _dir_desc: '内' }, street: { id: '3579113950122190182', title: '青六北路', location: { lat: 30.345215, lng: 120.494573 }, _distance: 70.7, _dir_desc: '西' }, street_number: { id: '', title: '', location: { lat: 30.345215, lng: 120.494573 }, _distance: 70.7, _dir_desc: '西' }, crossroad: { id: '6400604', title: '青六北路/江东二路(路口)', location: { lat: 30.32405, lng: 120.4947 }, _distance: 147.1, _dir_desc: '西南' } }, formatted_addresses: { recommend: '萧山经济技术开发区江东区钱塘中心', rough: '萧山经济技术开发区江东区钱塘中心', standard_address: '浙江省杭州市钱塘区青六北路499号' } } }

// 获取设备当前中文描述地址
export function getCurrentLocationAddress() {
  return new Promise((resolve, reject) => {
    // 地图api配额有限,使用mock数据
    if (USE_MOCK) {
      resolve(mockCurrentLocationAddress)
      return
    }

    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        // #ifdef H5
        // 调用腾讯地图API进行逆地址解析
        uni.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1',
          method: 'GET',
          data: {
            // eslint-disable-next-line no-undef
            key: getApp().globalData.mapKey,
            location: `${res.latitude},${res.longitude}`,
          },
          success: (res) => {
            console.log('H5逆地址解析结果:', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('H5逆地址解析失败:', err)
            reject(err)
          },
        })
        // #endif

        // #ifdef MP-WEIXIN
        // 调用腾讯地图小程序SDK进行逆地址解析
        // eslint-disable-next-line no-undef
        getApp().globalData.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: (res) => {
            console.log('逆地址解析结果:', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('逆地址解析失败:', err)
            reject(err)
          },
        })
        // #endif
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 根据经纬度获取详细地址信息
 * @param {*} latitude 纬度
 * @param {*} longitude 经度
 * @returns {object}  详细地址信息
 */
export function getAddressByLocation(latitude, longitude) {
  return new Promise((resolve, reject) => {
    // 地图api配额有限,使用mock数据
    if (USE_MOCK) {
      resolve(mockCurrentLocationAddress)
      return
    }

    // #ifdef H5
    // 调用腾讯地图API进行逆地址解析
    uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      method: 'GET',
      data: {
        // eslint-disable-next-line no-undef
        key: getApp().globalData.mapKey,
        location: `${latitude},${longitude}`,
      },
      success: (res) => {
        console.log('H5逆地址解析结果:', res)
        resolve(res)
      },
      fail: (err) => {
        console.error('H5逆地址解析失败:', err)
        reject(err)
      },
    })
    // #endif

    // #ifdef MP-WEIXIN
    // 调用腾讯地图小程序SDK进行逆地址解析
    // eslint-disable-next-line no-undef
    getApp().globalData.qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude,
      },
      success: (res) => {
        console.log('逆地址解析结果:', res)
        resolve(res)
      },
      fail: (err) => {
        console.error('逆地址解析失败:', err)
        reject(err)
      },
    })
    // #endif
  })
}

/**
 * 使用 Vincenty 公式计算两个经纬度点之间的距离
 * @param {number} lat1 第一个点的纬度
 * @param {number} lon1 第一个点的经度
 * @param {number} lat2 第二个点的纬度
 * @param {number} lon2 第二个点的经度
 * @returns {number} 距离（单位：米）
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  // 检查输入参数
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number'
    || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
    throw new TypeError('所有参数必须是数字类型')
  }

  // 检查纬度范围
  if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90) {
    throw new Error('纬度必须在 -90 到 90 度之间')
  }

  // 检查经度范围
  if (lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180) {
    throw new Error('经度必须在 -180 到 180 度之间')
  }

  // 如果是同一个点，返回0
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  }

  // WGS84椭球参数
  const a = 6378137 // 长半轴（米）
  const b = 6356752.314245 // 短半轴（米）
  const f = 1 / 298.257223563 // 扁率

  // 将角度转换为弧度
  const toRad = deg => deg * Math.PI / 180

  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const L = Δλ
  const U1 = Math.atan((1 - f) * Math.tan(φ1))
  const U2 = Math.atan((1 - f) * Math.tan(φ2))
  const sinU1 = Math.sin(U1)
  const cosU1 = Math.cos(U1)
  const sinU2 = Math.sin(U2)
  const cosU2 = Math.cos(U2)

  let λ = L
  let λPrev
  let iterLimit = 100
  let sinλ, cosλ, sinσ, cosσ, σ, sinα, cos2α, cos2σm, C

  do {
    sinλ = Math.sin(λ)
    cosλ = Math.cos(λ)
    sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ)
      + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ)
      * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ))

    if (sinσ === 0) {
      return 0 // 重合点
    }

    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ
    σ = Math.atan2(sinσ, cosσ)
    sinα = cosU1 * cosU2 * sinλ / sinσ
    cos2α = 1 - sinα * sinα
    cos2σm = cosσ - 2 * sinU1 * sinU2 / cos2α

    if (Number.isNaN(cos2σm)) {
      cos2σm = 0 // 赤道线
    }

    C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α))
    λPrev = λ
    λ = L + (1 - C) * f * sinα
    * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)))
  } while (Math.abs(λ - λPrev) > 1e-12 && --iterLimit > 0)

  if (iterLimit === 0) {
    throw new Error('Vincenty公式计算未收敛')
  }

  const u2 = cos2α * (a * a - b * b) / (b * b)
  const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
  const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))
  const Δσ = B * sinσ * (cos2σm + B / 4 * (cosσ * (-1 + 2 * cos2σm * cos2σm)
    - B / 6 * cos2σm * (-3 + 4 * sinσ * sinσ)
    * (-3 + 4 * cos2σm * cos2σm)))

  const s = b * A * (σ - Δσ)

  return Math.round(s * 1000) / 1000 // 保留3位小数
}

/**
 * 格式化距离显示
 * @param {number} distance 距离（单位：米）
 * @returns {string} 格式化后的距离字符串
 */
export function formatDistance(distance) {
  if (typeof distance !== 'number' || distance < 0) {
    return '0m'
  }

  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }
  else {
    return `${(distance / 1000).toFixed(2)}km`
  }
}

/**
 * 计算两点之间的方位角（从北方向顺时针测量）
 * @param {number} lat1 起点纬度
 * @param {number} lon1 起点经度
 * @param {number} lat2 终点纬度
 * @param {number} lon2 终点经度
 * @returns {number} 方位角（度数，0-360）
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180
  const toDeg = rad => rad * 180 / Math.PI

  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δλ = toRad(lon2 - lon1)

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const bearing = toDeg(Math.atan2(y, x))
  return (bearing + 360) % 360
}

const mockPl2 = [{ latitude: 34.259593, longitude: 108.947548 }, { latitude: 34.259627, longitude: 108.947532 }, { latitude: 34.259736000000004, longitude: 108.947451 }, { latitude: 34.259782, longitude: 108.947404 }, { latitude: 34.259864, longitude: 108.947271 }, { latitude: 34.259864, longitude: 108.947271 }, { latitude: 34.260073, longitude: 108.947156 }, { latitude: 34.260787, longitude: 108.94714 }, { latitude: 34.261255, longitude: 108.94714400000001 }, { latitude: 34.262329, longitude: 108.94718200000001 }, { latitude: 34.263020000000004, longitude: 108.94714800000001 }, { latitude: 34.263597000000004, longitude: 108.94715000000001 }, { latitude: 34.26480300000001, longitude: 108.947197 }, { latitude: 34.265012000000006, longitude: 108.94718900000001 }, { latitude: 34.26518600000001, longitude: 108.947196 }, { latitude: 34.26589700000001, longitude: 108.947168 }, { latitude: 34.26697800000001, longitude: 108.94718 }, { latitude: 34.267981000000006, longitude: 108.947179 }, { latitude: 34.268384000000005, longitude: 108.947192 }, { latitude: 34.26919, longitude: 108.947251 }, { latitude: 34.269648000000004, longitude: 108.947272 }, { latitude: 34.269828000000004, longitude: 108.947274 }, { latitude: 34.269828000000004, longitude: 108.947274 }, { latitude: 34.270011000000004, longitude: 108.947088 }, { latitude: 34.270013000000006, longitude: 108.946822 }, { latitude: 34.27, longitude: 108.946347 }, { latitude: 34.269949000000004, longitude: 108.945721 }, { latitude: 34.26993, longitude: 108.945075 }, { latitude: 34.269921000000004, longitude: 108.943396 }, { latitude: 34.269908, longitude: 108.942946 }, { latitude: 34.269896, longitude: 108.94275800000001 }, { latitude: 34.269896, longitude: 108.94275800000001 }, { latitude: 34.269883, longitude: 108.94255100000001 }, { latitude: 34.269853, longitude: 108.94123700000002 }, { latitude: 34.269791999999995, longitude: 108.93716100000002 }, { latitude: 34.269788, longitude: 108.93698500000002 }, { latitude: 34.269757, longitude: 108.93527900000002 }, { latitude: 34.269754, longitude: 108.93480200000002 }, { latitude: 34.269784, longitude: 108.93373100000002 }, { latitude: 34.269745, longitude: 108.93288200000002 }, { latitude: 34.269745, longitude: 108.93288200000002 }, { latitude: 34.270194000000004, longitude: 108.93290000000002 }, { latitude: 34.270793000000005, longitude: 108.93289900000002 }, { latitude: 34.271416, longitude: 108.93290800000003 }, { latitude: 34.272329, longitude: 108.93293900000003 }, { latitude: 34.273592, longitude: 108.93296600000004 }, { latitude: 34.275747, longitude: 108.93304300000004 }, { latitude: 34.276556, longitude: 108.93305700000003 }, { latitude: 34.276556, longitude: 108.93305700000003 }, { latitude: 34.276586, longitude: 108.93484000000004 }, { latitude: 34.276611, longitude: 108.93696300000003 }, { latitude: 34.276619000000004, longitude: 108.93702200000003 }, { latitude: 34.276685, longitude: 108.93725200000003 }, { latitude: 34.276714, longitude: 108.93931800000003 }, { latitude: 34.2767, longitude: 108.94041600000003 }, { latitude: 34.276717, longitude: 108.94086800000002 }, { latitude: 34.276717, longitude: 108.94086800000002 }, { latitude: 34.276672999999995, longitude: 108.94104000000003 }, { latitude: 34.276661, longitude: 108.94118500000003 }, { latitude: 34.276692, longitude: 108.94313600000004 }, { latitude: 34.276782999999995, longitude: 108.94507600000004 }, { latitude: 34.276861, longitude: 108.94573300000005 }, { latitude: 34.276866999999996, longitude: 108.94585300000004 }]
const mockPl = [{
  latitude: 34.259428,
  longitude: 108.947040,
  problem: false,
}, {
  latitude: 34.252918,
  longitude: 108.946963,
  problem: false,
}, {
  latitude: 34.252408,
  longitude: 108.946240,
  problem: false,
}, {
  latitude: 34.249286,
  longitude: 108.946184,
  problem: false,
}, {
  latitude: 34.248670,
  longitude: 108.946640,
  problem: false,
}, {
  latitude: 34.248129,
  longitude: 108.946826,
  problem: false,
}, {
  latitude: 34.243537,
  longitude: 108.946816,
  problem: true,
}, {
  latitude: 34.243478,
  longitude: 108.939003,
  problem: true,
}, {
  latitude: 34.241218,
  longitude: 108.939027,
  problem: true,
}, {
  latitude: 34.241192,
  longitude: 108.934802,
  problem: true,
}, {
  latitude: 34.241182,
  longitude: 108.932235,
  problem: true,
}, {
  latitude: 34.247227,
  longitude: 108.932311,
  problem: true,
}, {
  latitude: 34.250833,
  longitude: 108.932352,
  problem: true,
}, {
  latitude: 34.250877,
  longitude: 108.931756,
  problem: true,
}, {
  latitude: 34.250944,
  longitude: 108.931576,
  problem: true,
}, {
  latitude: 34.250834,
  longitude: 108.929662,
  problem: true,
}, {
  latitude: 34.250924,
  longitude: 108.926015,
  problem: true,
}, {
  latitude: 34.250802,
  longitude: 108.910121,
  problem: true,
}, {
  latitude: 34.269718,
  longitude: 108.909921,
  problem: true,
}, {
  latitude: 34.269221,
  longitude: 108.922366,
  problem: false,
}, {
  latitude: 34.274531,
  longitude: 108.922388,
  problem: false,
}, {
  latitude: 34.276201,
  longitude: 108.923433,
  problem: false,
}, {
  latitude: 34.276559,
  longitude: 108.924004,
  problem: false,
}, {
  latitude: 34.276785,
  longitude: 108.945855,
  problem: false,
}]

/**
 * 获取路径规划数据
 * @param {*} options
 * @returns {Promise} 路径规划数据
 */
export function getPolyline(options) {
  return new Promise((resolve, reject) => {
    const { from, to, config = {} } = options
    if (!to) {
      reject(new Error('终点不能为空'))
      return
    }

    // 地图api配额有限,使用mock数据
    if (USE_MOCK) {
      resolve([{
        ...config,
        points: mockPl,
      }])
      return
    }

    // #ifdef MP-WEIXIN
    // 调用腾讯地图小程序SDK进行路径规划
    // eslint-disable-next-line no-undef
    getApp().globalData.qqmapsdk.direction({
      mode: 'driving', // 可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      // from参数不填默认当前地址
      from,
      to,
      success(res) {
        console.log(res)
        let ret = res
        let coors = ret.result.routes[0].polyline; let pl = []
        // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
        }
        // 将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        console.log(JSON.stringify(pl))

        const result = [{
          ...config,
          points: pl,
        }]
        resolve(result)
      },
      fail(error) {
        console.error(error)
        reject(error)
      },
    })
    // #endif
  })
}

/**
 * 地址相关的API
 */
export const addressApi = {
  // 获取地址列表
  getAddressList(data) {
    return request.get('/api/users/me/address/list', data)
  },

  // 添加地址
  addAddress(data) {
    return request.post('/api/users/me/add_address', data)
  },

  // 更新地址
  updateAddress(data) {
    return request.put('/api/users/me/update_address', data)
  },

  // 获取地址详情
  getAddressDetail(id) {
    return request.get(`/api/users/me/user_address_detail/${id}`)
  },

  // 删除地址
  deleteAddress(id) {
    return request.delete(`/api/users/me/delete_address/${id}`)
  },

  // 设置默认地址
  setDefaultAddress(data) {
    return request.put('/api/users/me/set_address_default', data)
  },

  // 发货地址列表
  getShippingAddressList(data) {
    return request.get('/api/order/get_shipping_address_list', data)
  },
}
