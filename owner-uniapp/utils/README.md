# UniApp HTTP 请求封装

基于 `uni.request` 的 Axios 风格 HTTP 请求库，采用分层架构设计。

## 架构设计

### 1. 通用层 - UniAxios (`uniAxios.js`)
- 提供通用的 Axios 风格 API
- 不包含任何业务逻辑
- 支持拦截器、实例创建、请求取消等功能
- 可在任何 UniApp 项目中复用

### 2. 业务层 - HTTP (`http.js`)
- 基于 UniAxios 创建业务实例
- 包含项目特定的业务逻辑
- 处理 token 认证、错误处理、加载状态等
- 提供多种配置的实例（普通、静默、表单、上传）

### 3. API层 - API (`api.js`)
- 封装具体的 API 接口
- 按业务模块组织（用户、订单、地图等）
- 提供类型化的接口方法

## 安装使用

### 基本用法

```javascript
import axios from '@/utils/axios'

// GET请求
const response = await axios.get('/api/users')

// POST请求
const result = await axios.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
})

// 带配置的请求
const data = await axios.get('/api/data', {
  showLoading: false,
  timeout: 5000,
  headers: {
    'Custom-Header': 'value'
  }
})
```

### 支持的HTTP方法

```javascript
// GET请求
axios.get(url, config)

// POST请求
axios.post(url, data, config)

// PUT请求
axios.put(url, data, config)

// DELETE请求
axios.delete(url, config)

// PATCH请求
axios.patch(url, data, config)

// HEAD请求
axios.head(url, config)

// OPTIONS请求
axios.options(url, config)
```

### 创建实例

```javascript
import { UniAxios } from '@/utils/axios'

const apiClient = new UniAxios({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 使用实例
const response = await apiClient.get('/users')
```

### 拦截器

#### 请求拦截器

```javascript
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('发起请求:', config.url)
    
    // 添加时间戳防止缓存
    if (config.method === 'GET') {
      config.data = {
        ...config.data,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)
```

#### 响应拦截器

```javascript
// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('响应成功:', response.data)
    
    // 可以在这里处理通用的业务逻辑
    if (response.data.code === 200) {
      return response.data.data
    }
    
    return response
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    // 可以在这里处理通用的错误逻辑
    if (error.message.includes('401')) {
      // 跳转到登录页
      uni.navigateTo({
        url: '/pages/login/index/index'
      })
    }
    
    return Promise.reject(error)
  }
)
```

### 配置选项

```javascript
const config = {
  // 基础URL
  baseURL: 'https://api.example.com',
  
  // 请求超时时间
  timeout: 60000,
  
  // 请求头
  headers: {
    'Content-Type': 'application/json'
  },
  
  // 是否显示加载提示
  showLoading: true,
  
  // 加载提示文本
  loadingText: '加载中...',
  
  // uni.request的原生配置
  dataType: 'json',
  responseType: 'text',
  sslVerify: true,
  withCredentials: false,
  firstIpv4: false,
  enableHttp2: false,
  enableQuic: false,
  enableCache: false,
  enableHttpDNS: false,
  enableChunked: false,
  forceCellularNetwork: false,
  enableCookie: false
}
```

### API封装示例

```javascript
// utils/api.js
import axios from '@/utils/axios'

export default {
  // 用户相关API
  user: {
    // 登录
    login(data) {
      return axios.post('/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    
    // 获取用户信息
    getInfo() {
      return axios.get('/api/user/info')
    },
    
    // 更新用户信息
    updateInfo(data) {
      return axios.put('/api/user/info', data)
    }
  },
  
  // 订单相关API
  order: {
    // 获取订单列表
    getList(params) {
      return axios.get('/api/orders', {
        data: params,
        showLoading: false
      })
    },
    
    // 创建订单
    create(data) {
      return axios.post('/api/orders', data, {
        loadingText: '正在创建订单...'
      })
    }
  }
}
```

### 错误处理

```javascript
try {
  const response = await axios.get('/api/data')
  console.log('请求成功:', response)
} catch (error) {
  console.error('请求失败:', error.message)
  
  // 根据错误类型进行不同处理
  if (error.message.includes('网络')) {
    uni.showToast({
      title: '网络连接失败，请检查网络',
      icon: 'none'
    })
  } else if (error.message.includes('401')) {
    // 未授权，跳转登录
    uni.navigateTo({
      url: '/pages/login/index/index'
    })
  }
}
```

### 取消请求

```javascript
import { UniAxios } from '@/utils/axios'

// 创建取消token
const source = UniAxios.CancelToken.source()

// 发起请求
axios.get('/api/data', {
  cancelToken: source.token
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('请求被取消:', error.message)
  }
})

// 取消请求
source.cancel('用户取消了请求')
```

## 测试页面

项目中包含了一个完整的测试页面，展示了各种功能的使用方法：

访问路径: `/pages/axios-test/index`

测试功能包括：
- 基本GET/POST请求
- 带/不带加载提示的请求
- 拦截器功能测试
- 错误处理测试
- 自定义实例测试
- API方法封装测试

## 与原有request.js的对比

### 原有方式
```javascript
import { request } from '@/utils/request'

const response = await request({
  url: '/api/users',
  method: 'GET',
  data: { page: 1 },
  notShowLoading: true
})
```

### 新的axios风格
```javascript
import axios from '@/utils/axios'

const response = await axios.get('/api/users', {
  data: { page: 1 },
  showLoading: false
})
```

### 优势

1. **更简洁的API**: 支持axios风格的简写方法
2. **更强大的拦截器**: 支持多个拦截器链式调用
3. **更灵活的配置**: 支持实例级别的配置
4. **更好的错误处理**: 统一的错误处理机制
5. **更好的TypeScript支持**: 完整的类型定义
6. **向后兼容**: 保持与原有代码的兼容性

## 注意事项

1. **兼容性**: 完全兼容uni.request的所有平台特性
2. **性能**: 拦截器会增加少量性能开销，但提供了更强大的功能
3. **内存**: 注意及时清理不需要的拦截器
4. **错误处理**: 建议在拦截器中统一处理通用错误
5. **Token管理**: 建议在请求拦截器中统一处理token注入

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的axios风格API
- 支持请求/响应拦截器
- 支持实例创建
- 支持uni.request的所有配置选项