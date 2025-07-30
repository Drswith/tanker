import baseUrl from './baseUrl'
import { UniAxios } from './uniAxios'

/**
 * 业务层HTTP封装
 * 基于通用的UniAxios，添加具体的业务逻辑
 */

// 创建业务HTTP实例
const http = new UniAxios({
  baseURL: baseUrl,
  timeout: 60000,
  showLoading: false,
  loadingText: '加载中...',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加请求拦截器 - 处理token
http.interceptors.request.use(
  (config) => {
    // 获取token
    const token = uni.getStorageSync('token') || 'member_user eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtXzE1MTQ1NjQ1NjIyIiwicm9sZSI6Im1lbWJlcl91c2VyIiwiZXhwIjoxNzg0MDgyODkzLCJ1c2VySWQiOjEsImNyZWF0ZWQiOjE3NTI1NDY4OTM3MTd9.cDL1OuAml72fTippb8ivyrF_AsTDGIJnpgioY_iwcgPLMGBUP-PKOef1H-SIYWEBXEy5XDNMOU9eVfvG8jTN4A'

    // 自动添加Authorization头
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = token
    }

    // 添加时间戳防止缓存（GET请求）
    if (config.method === 'GET' && config.preventCache !== false) {
      config.data = {
        ...config.data,
        _t: Date.now(),
      }
    }

    // 打印请求日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers,
      })
    }

    return config
  },
  (error) => {
    console.error('[HTTP Request Error]', error)
    return Promise.reject(error)
  },
)

// 添加响应拦截器 - 处理业务逻辑
http.interceptors.response.use(
  (response) => {
    const { data, status } = response

    // 打印响应日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HTTP Response] ${status}`, data)
    }

    // 处理业务状态码
    if (data && typeof data === 'object') {
      // 处理401未授权
      if (data.code === 401) {
        uni.showToast({
          title: data.errMsg || '请先登录!',
          icon: 'none',
        })

        // 清除本地token
        uni.removeStorageSync('token')

        // 延迟跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index/index',
          })
        }, 800)

        return Promise.reject(new Error(data.errMsg || '未授权'))
      }

      // 处理403禁止访问
      if (data.code === 403) {
        uni.showToast({
          title: data.errMsg || '没有权限访问',
          icon: 'none',
        })
        return Promise.reject(new Error(data.errMsg || '禁止访问'))
      }

      // 处理404未找到
      if (data.code === 404) {
        uni.showToast({
          title: data.errMsg || '请求的资源不存在',
          icon: 'none',
        })
        return Promise.reject(new Error(data.errMsg || '资源不存在'))
      }

      // 处理500服务器错误
      if (data.code === 500) {
        uni.showToast({
          title: data.errMsg || '服务器内部错误',
          icon: 'none',
        })
        return Promise.reject(new Error(data.errMsg || '服务器错误'))
      }

      // 处理其他错误状态码
      if (data.code && data.code !== 200) {
        const errorMsg = data.errMsg || data.message || '请求失败'
        uni.showToast({
          title: errorMsg,
          icon: 'none',
        })
        return Promise.reject(new Error(errorMsg))
      }

      // 成功响应，返回数据部分
      return data.data !== undefined ? data.data : data
    }

    // 非JSON响应，直接返回
    return data
  },
  (error) => {
    console.error('[HTTP Response Error]', error)

    // 网络错误处理
    if (!error.response) {
      uni.showToast({
        title: '网络连接失败，请检查网络',
        icon: 'none',
      })
      return Promise.reject(new Error('网络连接失败'))
    }

    // HTTP状态码错误处理
    const { status } = error.response
    let message = '请求失败'

    switch (status) {
      case 400:
        message = '请求参数错误'
        break
      case 401:
        message = '未授权，请重新登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址不存在'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '服务器内部错误'
        break
      case 501:
        message = '服务未实现'
        break
      case 502:
        message = '网关错误'
        break
      case 503:
        message = '服务不可用'
        break
      case 504:
        message = '网关超时'
        break
      case 505:
        message = 'HTTP版本不受支持'
        break
      default:
        message = `连接错误${status}`
    }

    uni.showToast({
      title: message,
      icon: 'none',
    })

    return Promise.reject(error)
  },
)

// 创建不同配置的实例
export const httpWithLoading = http.create({
  showLoading: true,
})

export const httpFormData = http.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export const httpUpload = http.create({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 120000, // 上传文件超时时间更长
})

// 便捷方法
export const request = {
  // GET请求
  get(url, params = {}, config = {}) {
    return http.get(url, {
      data: params,
      ...config,
    })
  },

  // POST请求
  post(url, data = {}, config = {}) {
    return http.post(url, data, config)
  },

  // PUT请求
  put(url, data = {}, config = {}) {
    return http.put(url, data, config)
  },

  // DELETE请求
  delete(url, config = {}) {
    return http.delete(url, config)
  },

  // 表单提交
  postForm(url, data = {}, config = {}) {
    return httpFormData.post(url, data, config)
  },

  // 文件上传
  upload(url, filePath, formData = {}, config = {}) {
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: httpUpload.defaults.baseURL + url,
        filePath,
        name: 'file',
        formData,
        header: {
          ...httpUpload.defaults.headers,
          Authorization: uni.getStorageSync('token'),
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 200) {
              resolve(data.data)
            }
            else {
              uni.showToast({
                title: data.errMsg || '上传失败',
                icon: 'none',
              })
              reject(new Error(data.errMsg || '上传失败'))
            }
          }
          catch (error) {
            reject(new Error('响应数据解析失败'))
          }
        },
        fail: (error) => {
          uni.showToast({
            title: '上传失败',
            icon: 'none',
          })
          reject(error)
        },
        ...config,
      })

      // 返回上传任务，支持进度监听和取消
      return uploadTask
    })
  },

  // 并发请求
  all(requests) {
    return UniAxios.all(requests)
  },

  // 展开响应
  spread(callback) {
    return UniAxios.spread(callback)
  },
}

// 默认导出
export default http

// 导出UniAxios类，供高级用法
export { UniAxios }
