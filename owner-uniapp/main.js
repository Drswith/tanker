// 引入lodash工具
import lodash from 'lodash'
import Vue from 'vue'

// 公共方法
import $com from '@/common/js/com.js'
// 公共时间方法
import $time from '@/common/js/time.js'

import uView from '@/uni_modules/uview-ui'

// http请求工具封装
import http, { request } from '@/utils/http.js'

import App from './App'

// 公共常量
import constants from './common/js/constants'

import './uni.promisify.adaptor'

// 过滤器
import '@/common/js/filter.js'

Vue.config.productionTip = false

Vue.use(uView)
uni.$u.setConfig({
  // 修改$u.config对象的属性
  config: {
    // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
    // 那么在用于传入组件大小参数为数值时，就默认为rpx，但这样全局配置会导致UI组件过小
    // unit: 'rpx',
  },
})

Vue.prototype.constants = constants
Vue.prototype.$http = http
Vue.prototype.$request = request
Vue.prototype.$com = $com
Vue.prototype.$time = $time
Vue.prototype.$lodash = lodash

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
