import { request } from '@/utils/http'

// 授权位置信息
export function authLocation() {
  return new Promise((resolve) => {
    // #ifdef H5
    resolve(true)
    // #endif

    // #ifdef MP-WEIXIN
    uni.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          uni.showToast({
            title: '请先授权获取位置信息',
            icon: 'none',
          })
          uni.openSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation']) {
                resolve(true)
              }
              else {
                uni.showToast({
                  title: '未授权获取位置信息',
                  icon: 'none',
                })
                resolve(false)
              }
            },
            fail: (err) => {
              console.error('打开设置失败:', err)
              resolve(false)
            },
          })
        }
        else {
          resolve(true)
        }
      },
      fail: (err) => {
        console.error('获取设置失败:', err)
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

const useMock = true

// 获取设备当前中文描述地址
export function getCurrentLocationAddress() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        // 地图api配额有限,使用mock数据
        if (useMock) {
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
    if (useMock) {
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
