<script>
import { mapApi, orderApi, silentApi, uploadApi, userApi } from '@/utils/api'
import http, { httpWithoutLoading, request } from '@/utils/http'

export default {
  data() {
    return {
      results: [],
      requestInterceptorId: null,
      responseInterceptorId: null,
    }
  },

  methods: {
    addResult(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.results.unshift(`[${timestamp}] ${message}`)
      if (this.results.length > 50) {
        this.results = this.results.slice(0, 50)
      }
    },

    // 基础GET请求测试
    async testGet() {
      try {
        this.addResult('开始GET请求测试...')
        const result = await request.get('/api/test/get', { id: 123 })
        this.addResult(`GET请求成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`GET请求失败: ${error.message}`)
      }
    },

    // 基础POST请求测试
    async testPost() {
      try {
        this.addResult('开始POST请求测试...')
        const result = await request.post('/api/test/post', {
          name: 'test',
          value: 123,
        })
        this.addResult(`POST请求成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`POST请求失败: ${error.message}`)
      }
    },

    // 错误处理测试
    async testError() {
      try {
        this.addResult('开始错误处理测试...')
        await request.get('/api/test/error')
      }
      catch (error) {
        this.addResult(`错误处理测试完成: ${error.message}`)
      }
    },

    // 登录API测试
    async testLogin() {
      try {
        this.addResult('开始登录API测试...')
        const result = await userApi.login({
          username: 'test',
          password: '123456',
        })
        this.addResult(`登录成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`登录失败: ${error.message}`)
      }
    },

    // 订单列表测试
    async testOrderList() {
      try {
        this.addResult('开始订单列表测试...')
        const result = await orderApi.getOrderList({
          page: 1,
          size: 10,
        })
        this.addResult(`订单列表获取成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`订单列表获取失败: ${error.message}`)
      }
    },

    // 地图坐标测试
    async testMapCoordinates() {
      try {
        this.addResult('开始地图坐标测试...')
        const result = await mapApi.getCoordinates({
          latitude: 39.9042,
          longitude: 116.4074,
        })
        this.addResult(`地图坐标获取成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`地图坐标获取失败: ${error.message}`)
      }
    },

    // 并发请求测试
    async testConcurrent() {
      try {
        this.addResult('开始并发请求测试...')
        const [userInfo, orders] = await request.all([
          userApi.getUserInfo(),
          orderApi.getOrderList({ page: 1, size: 5 }),
        ])
        this.addResult(`并发请求成功: 用户信息=${JSON.stringify(userInfo)}, 订单=${JSON.stringify(orders)}`)
      }
      catch (error) {
        this.addResult(`并发请求失败: ${error.message}`)
      }
    },

    // 静默请求测试
    async testSilentApi() {
      try {
        this.addResult('开始静默请求测试...')
        const result = await silentApi.heartbeat()
        this.addResult(`静默请求成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`静默请求失败: ${error.message}`)
      }
    },

    // 自定义实例测试
    async testCustomInstance() {
      try {
        this.addResult('开始自定义实例测试...')
        const customHttp = http.create({
          timeout: 5000,
          showLoading: false,
          headers: {
            'Custom-Header': 'test-value',
          },
        })

        const result = await customHttp.get('/api/test/custom')
        this.addResult(`自定义实例请求成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`自定义实例请求失败: ${error.message}`)
      }
    },

    // 添加拦截器
    addInterceptor() {
      this.addResult('添加请求和响应拦截器...')

      // 添加请求拦截器
      this.requestInterceptorId = http.interceptors.request.use(
        (config) => {
          this.addResult(`[拦截器] 请求拦截: ${config.method?.toUpperCase()} ${config.url}`)
          config.headers['X-Test-Header'] = 'interceptor-test'
          return config
        },
        (error) => {
          this.addResult(`[拦截器] 请求错误: ${error.message}`)
          return Promise.reject(error)
        },
      )

      // 添加响应拦截器
      this.responseInterceptorId = http.interceptors.response.use(
        (response) => {
          this.addResult(`[拦截器] 响应拦截: 状态码 ${response.status}`)
          return response
        },
        (error) => {
          this.addResult(`[拦截器] 响应错误: ${error.message}`)
          return Promise.reject(error)
        },
      )
    },

    // 移除拦截器
    removeInterceptor() {
      if (this.requestInterceptorId !== null) {
        http.interceptors.request.eject(this.requestInterceptorId)
        this.requestInterceptorId = null
        this.addResult('请求拦截器已移除')
      }

      if (this.responseInterceptorId !== null) {
        http.interceptors.response.eject(this.responseInterceptorId)
        this.responseInterceptorId = null
        this.addResult('响应拦截器已移除')
      }
    },

    // 测试拦截器效果
    async testWithInterceptor() {
      try {
        this.addResult('开始拦截器效果测试...')
        const result = await http.get('/api/test/interceptor')
        this.addResult(`拦截器测试成功: ${JSON.stringify(result)}`)
      }
      catch (error) {
        this.addResult(`拦截器测试失败: ${error.message}`)
      }
    },

    // 图片上传测试
    async testImageUpload() {
      try {
        this.addResult('开始图片上传测试...')

        // 选择图片
        const chooseResult = await new Promise((resolve, reject) => {
          uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: resolve,
            fail: reject,
          })
        })

        if (chooseResult.tempFilePaths && chooseResult.tempFilePaths.length > 0) {
          const filePath = chooseResult.tempFilePaths[0]
          const result = await uploadApi.uploadImage(filePath, {
            type: 'avatar',
          })
          this.addResult(`图片上传成功: ${JSON.stringify(result)}`)
        }
      }
      catch (error) {
        this.addResult(`图片上传失败: ${error.message}`)
      }
    },

    // 文件上传测试
    async testFileUpload() {
      try {
        this.addResult('开始文件上传测试...')

        // 选择文件
        const chooseResult = await new Promise((resolve, reject) => {
          uni.chooseMessageFile({
            count: 1,
            type: 'file',
            success: resolve,
            fail: reject,
          })
        })

        if (chooseResult.tempFiles && chooseResult.tempFiles.length > 0) {
          const filePath = chooseResult.tempFiles[0].path
          const result = await uploadApi.uploadFile(filePath, {
            category: 'document',
          })
          this.addResult(`文件上传成功: ${JSON.stringify(result)}`)
        }
      }
      catch (error) {
        this.addResult(`文件上传失败: ${error.message}`)
      }
    },

    // 清空结果
    clearResults() {
      this.results = []
    },
  },

  onLoad() {
    this.addResult('HTTP API 测试页面已加载')
    this.addResult('基于通用UniAxios + 业务层http.js的封装')
  },

  onUnload() {
    // 清理拦截器
    this.removeInterceptor()
  },
}
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="title">
        HTTP API 测试
      </text>
      <text class="subtitle">
        基于UniAxios的业务层封装
      </text>
    </view>

    <view class="section">
      <text class="section-title">
        基础请求测试
      </text>

      <button class="test-btn" @click="testGet">
        测试 GET 请求
      </button>
      <button class="test-btn" @click="testPost">
        测试 POST 请求
      </button>
      <button class="test-btn error" @click="testError">
        测试错误处理
      </button>
    </view>

    <view class="section">
      <text class="section-title">
        业务API测试
      </text>

      <button class="test-btn" @click="testLogin">
        测试登录API
      </button>
      <button class="test-btn" @click="testOrderList">
        测试订单列表
      </button>
      <button class="test-btn" @click="testMapCoordinates">
        测试地图坐标
      </button>
    </view>

    <view class="section">
      <text class="section-title">
        高级功能测试
      </text>

      <button class="test-btn" @click="testConcurrent">
        测试并发请求
      </button>
      <button class="test-btn" @click="testSilentApi">
        测试静默请求
      </button>
      <button class="test-btn" @click="testCustomInstance">
        测试自定义实例
      </button>
    </view>

    <view class="section">
      <text class="section-title">
        拦截器测试
      </text>

      <button class="test-btn" @click="addInterceptor">
        添加拦截器
      </button>
      <button class="test-btn" @click="removeInterceptor">
        移除拦截器
      </button>
      <button class="test-btn" @click="testWithInterceptor">
        测试拦截器效果
      </button>
    </view>

    <view class="section">
      <text class="section-title">
        文件上传测试
      </text>

      <button class="test-btn" @click="testImageUpload">
        测试图片上传
      </button>
      <button class="test-btn" @click="testFileUpload">
        测试文件上传
      </button>
    </view>

    <view class="results">
      <text class="results-title">
        测试结果：
      </text>
      <scroll-view scroll-y class="results-content">
        <text v-for="(result, index) in results" :key="index" class="result-item">
          {{ result }}
        </text>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  color: white;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.section {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 30rpx;
  padding-bottom: 15rpx;
  border-bottom: 2rpx solid #eee;
}

.test-btn {
  width: 100%;
  margin-bottom: 20rpx;
  padding: 25rpx;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 15rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.test-btn:last-child {
  margin-bottom: 0;
}

.test-btn.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.test-btn:active {
  transform: translateY(2rpx);
  opacity: 0.8;
}

.results {
  margin-top: 40rpx;
  padding: 30rpx;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.results-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.results-content {
  height: 600rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
  padding: 20rpx;
}

.result-item {
  display: block;
  font-size: 24rpx;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15rpx;
  padding: 15rpx;
  background-color: white;
  border-radius: 8rpx;
  border-left: 4rpx solid #4facfe;
  word-break: break-all;
}
</style>
