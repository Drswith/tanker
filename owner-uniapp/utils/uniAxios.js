/**
 * 通用的类axios风格uni.request封装
 * 基于uni.request API文档: https://uniapp.dcloud.net.cn/api/request/request.html
 * 
 * 特性：
 * - 支持axios风格的API (get, post, put, delete等)
 * - 支持请求/响应拦截器
 * - 支持实例创建
 * - 支持uni.request的所有配置选项
 * - 通用设计，不包含具体业务逻辑
 */
class UniAxios {
  constructor(config = {}) {
    // 默认配置
    this.defaults = {
      baseURL: '',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
      showLoading: false, // 默认不显示loading，由业务层决定
      loadingText: '加载中...',
      ...config,
    }

    // 请求拦截器
    this.interceptors = {
      request: {
        handlers: [],
        use: (fulfilled, rejected) => {
          this.interceptors.request.handlers.push({ fulfilled, rejected })
          return this.interceptors.request.handlers.length - 1 // 返回索引，用于移除拦截器
        },
        eject: (id) => {
          if (this.interceptors.request.handlers[id]) {
            this.interceptors.request.handlers[id] = null
          }
        },
      },
      response: {
        handlers: [],
        use: (fulfilled, rejected) => {
          this.interceptors.response.handlers.push({ fulfilled, rejected })
          return this.interceptors.response.handlers.length - 1 // 返回索引，用于移除拦截器
        },
        eject: (id) => {
          if (this.interceptors.response.handlers[id]) {
            this.interceptors.response.handlers[id] = null
          }
        },
      },
    }
  }

  // 执行请求拦截器
  async runRequestInterceptors(config) {
    let chain = [config, undefined]

    // 过滤掉被移除的拦截器
    const validInterceptors = this.interceptors.request.handlers.filter(handler => handler !== null)

    for (const interceptor of validInterceptors) {
      try {
        chain[0] = await interceptor.fulfilled(chain[0])
      }
      catch (error) {
        if (interceptor.rejected) {
          chain[1] = await interceptor.rejected(error)
        }
        else {
          throw error
        }
      }
    }

    return chain[0]
  }

  // 执行响应拦截器
  async runResponseInterceptors(response) {
    let chain = [response, undefined]

    // 过滤掉被移除的拦截器
    const validInterceptors = this.interceptors.response.handlers.filter(handler => handler !== null)

    for (const interceptor of validInterceptors) {
      try {
        chain[0] = await interceptor.fulfilled(chain[0])
      }
      catch (error) {
        if (interceptor.rejected) {
          chain[1] = await interceptor.rejected(error)
        }
        else {
          throw error
        }
      }
    }

    return chain[0]
  }

  // 核心请求方法
  async request(config) {
    // 合并配置
    const mergedConfig = {
      ...this.defaults,
      ...config,
      headers: {
        ...this.defaults.headers,
        ...config.headers,
      },
    }

    // 处理URL
    if (mergedConfig.baseURL && !mergedConfig.url.startsWith('http')) {
      mergedConfig.url = mergedConfig.baseURL + mergedConfig.url
    }

    try {
      // 执行请求拦截器
      const finalConfig = await this.runRequestInterceptors(mergedConfig)

      // 显示加载提示
      if (finalConfig.showLoading) {
        uni.showLoading({
          title: finalConfig.loadingText,
        })
      }

      // 发起请求
      const response = await this.makeRequest(finalConfig)

      // 隐藏加载提示
      if (finalConfig.showLoading) {
        uni.hideLoading()
      }

      // 执行响应拦截器
      return await this.runResponseInterceptors(response)
    }
    catch (error) {
      // 隐藏加载提示
      if (mergedConfig.showLoading) {
        uni.hideLoading()
      }

      // 执行响应拦截器的错误处理
      const validErrorInterceptors = this.interceptors.response.handlers.filter(handler => handler !== null)
      
      for (const interceptor of validErrorInterceptors) {
        if (interceptor.rejected) {
          try {
            return await interceptor.rejected(error)
          }
          catch (e) {
            // 继续抛出错误
          }
        }
      }

      throw error
    }
  }

  // 实际发起uni.request请求
  makeRequest(config) {
    return new Promise((resolve, reject) => {
      const requestConfig = {
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.headers,
        timeout: config.timeout,
        dataType: config.dataType || 'json',
        responseType: config.responseType || 'text',
        sslVerify: config.sslVerify !== false,
        withCredentials: config.withCredentials || false,
        firstIpv4: config.firstIpv4 || false,
        enableHttp2: config.enableHttp2 || false,
        enableQuic: config.enableQuic || false,
        enableCache: config.enableCache || false,
        enableHttpDNS: config.enableHttpDNS || false,
        enableChunked: config.enableChunked || false,
        forceCellularNetwork: config.forceCellularNetwork || false,
        enableCookie: config.enableCookie || false,
        success: (res) => {
          resolve({
            data: res.data,
            status: res.statusCode,
            statusText: this.getStatusText(res.statusCode),
            headers: res.header,
            cookies: res.cookies,
            config,
            request: res,
          })
        },
        fail: (error) => {
          reject(new Error(error.errMsg || '网络请求失败'))
        },
      }

      // 只添加有值的配置项
      Object.keys(requestConfig).forEach((key) => {
        if (requestConfig[key] === undefined) {
          delete requestConfig[key]
        }
      })

      uni.request(requestConfig)
    })
  }

  // 获取状态码对应的状态文本
  getStatusText(statusCode) {
    const statusTexts = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    }
    return statusTexts[statusCode] || 'Unknown'
  }

  // GET请求
  get(url, config = {}) {
    return this.request({
      ...config,
      method: 'GET',
      url,
    })
  }

  // POST请求
  post(url, data, config = {}) {
    return this.request({
      ...config,
      method: 'POST',
      url,
      data,
    })
  }

  // PUT请求
  put(url, data, config = {}) {
    return this.request({
      ...config,
      method: 'PUT',
      url,
      data,
    })
  }

  // DELETE请求
  delete(url, config = {}) {
    return this.request({
      ...config,
      method: 'DELETE',
      url,
    })
  }

  // PATCH请求
  patch(url, data, config = {}) {
    return this.request({
      ...config,
      method: 'PATCH',
      url,
      data,
    })
  }

  // HEAD请求
  head(url, config = {}) {
    return this.request({
      ...config,
      method: 'HEAD',
      url,
    })
  }

  // OPTIONS请求
  options(url, config = {}) {
    return this.request({
      ...config,
      method: 'OPTIONS',
      url,
    })
  }

  // 创建新实例
  create(config = {}) {
    return new UniAxios({
      ...this.defaults,
      ...config,
    })
  }

  // 判断是否为取消错误
  static isCancel(value) {
    return value && value.__CANCEL__
  }

  // 并发请求
  static all(promises) {
    return Promise.all(promises)
  }

  // 展开响应数据
  static spread(callback) {
    return function wrap(arr) {
      return callback(...arr)
    }
  }

  // 取消请求相关方法
  static CancelToken = {
    source() {
      let cancel
      const token = new Promise((resolve) => {
        cancel = (message) => {
          const error = new Error(message || 'Request canceled')
          error.__CANCEL__ = true
          resolve(error)
        }
      })
      return {
        token,
        cancel,
      }
    },
  }
}

// 创建默认实例
const axios = new UniAxios()

// 导出默认实例和类
export default axios
export { UniAxios }

// 兼容性导出
export const request = axios.request.bind(axios)
export const get = axios.get.bind(axios)
export const post = axios.post.bind(axios)
export const put = axios.put.bind(axios)
export const del = axios.delete.bind(axios)
export const patch = axios.patch.bind(axios)
export const head = axios.head.bind(axios)
export const options = axios.options.bind(axios)
