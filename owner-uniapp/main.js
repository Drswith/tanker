import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'

//公共常量
import constants from './common/js/constants'
Vue.prototype.constants = constants;

//接口
import httpApi from '@/utils/httpApi.js'
Vue.prototype.httpApi = httpApi;

// 过滤器
import "@/common/js/filter.js";

//公共方法
import $com from '@/common/js/com.js'
Vue.prototype.$com = $com;

//公共时间方法
import $time from '@/common/js/time.js'
Vue.prototype.$time = $time;

//引入lodash工具
import lodash from 'lodash';
Vue.prototype.$lodash = lodash;
