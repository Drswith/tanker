<script>
import { getPolyline } from '@/api/address'
import { orderApi } from '@/api/order'
import TimeLine from '@/components/TimeLine/TimeLine.vue'

// const mockPl2 = [{ latitude: 34.259593, longitude: 108.947548 }, { latitude: 34.259627, longitude: 108.947532 }, { latitude: 34.259736000000004, longitude: 108.947451 }, { latitude: 34.259782, longitude: 108.947404 }, { latitude: 34.259864, longitude: 108.947271 }, { latitude: 34.259864, longitude: 108.947271 }, { latitude: 34.260073, longitude: 108.947156 }, { latitude: 34.260787, longitude: 108.94714 }, { latitude: 34.261255, longitude: 108.94714400000001 }, { latitude: 34.262329, longitude: 108.94718200000001 }, { latitude: 34.263020000000004, longitude: 108.94714800000001 }, { latitude: 34.263597000000004, longitude: 108.94715000000001 }, { latitude: 34.26480300000001, longitude: 108.947197 }, { latitude: 34.265012000000006, longitude: 108.94718900000001 }, { latitude: 34.26518600000001, longitude: 108.947196 }, { latitude: 34.26589700000001, longitude: 108.947168 }, { latitude: 34.26697800000001, longitude: 108.94718 }, { latitude: 34.267981000000006, longitude: 108.947179 }, { latitude: 34.268384000000005, longitude: 108.947192 }, { latitude: 34.26919, longitude: 108.947251 }, { latitude: 34.269648000000004, longitude: 108.947272 }, { latitude: 34.269828000000004, longitude: 108.947274 }, { latitude: 34.269828000000004, longitude: 108.947274 }, { latitude: 34.270011000000004, longitude: 108.947088 }, { latitude: 34.270013000000006, longitude: 108.946822 }, { latitude: 34.27, longitude: 108.946347 }, { latitude: 34.269949000000004, longitude: 108.945721 }, { latitude: 34.26993, longitude: 108.945075 }, { latitude: 34.269921000000004, longitude: 108.943396 }, { latitude: 34.269908, longitude: 108.942946 }, { latitude: 34.269896, longitude: 108.94275800000001 }, { latitude: 34.269896, longitude: 108.94275800000001 }, { latitude: 34.269883, longitude: 108.94255100000001 }, { latitude: 34.269853, longitude: 108.94123700000002 }, { latitude: 34.269791999999995, longitude: 108.93716100000002 }, { latitude: 34.269788, longitude: 108.93698500000002 }, { latitude: 34.269757, longitude: 108.93527900000002 }, { latitude: 34.269754, longitude: 108.93480200000002 }, { latitude: 34.269784, longitude: 108.93373100000002 }, { latitude: 34.269745, longitude: 108.93288200000002 }, { latitude: 34.269745, longitude: 108.93288200000002 }, { latitude: 34.270194000000004, longitude: 108.93290000000002 }, { latitude: 34.270793000000005, longitude: 108.93289900000002 }, { latitude: 34.271416, longitude: 108.93290800000003 }, { latitude: 34.272329, longitude: 108.93293900000003 }, { latitude: 34.273592, longitude: 108.93296600000004 }, { latitude: 34.275747, longitude: 108.93304300000004 }, { latitude: 34.276556, longitude: 108.93305700000003 }, { latitude: 34.276556, longitude: 108.93305700000003 }, { latitude: 34.276586, longitude: 108.93484000000004 }, { latitude: 34.276611, longitude: 108.93696300000003 }, { latitude: 34.276619000000004, longitude: 108.93702200000003 }, { latitude: 34.276685, longitude: 108.93725200000003 }, { latitude: 34.276714, longitude: 108.93931800000003 }, { latitude: 34.2767, longitude: 108.94041600000003 }, { latitude: 34.276717, longitude: 108.94086800000002 }, { latitude: 34.276717, longitude: 108.94086800000002 }, { latitude: 34.276672999999995, longitude: 108.94104000000003 }, { latitude: 34.276661, longitude: 108.94118500000003 }, { latitude: 34.276692, longitude: 108.94313600000004 }, { latitude: 34.276782999999995, longitude: 108.94507600000004 }, { latitude: 34.276861, longitude: 108.94573300000005 }, { latitude: 34.276866999999996, longitude: 108.94585300000004 }]
// const mockPl = [{
//   latitude: 34.259428,
//   longitude: 108.947040,
//   problem: false,
// }, {
//   latitude: 34.252918,
//   longitude: 108.946963,
//   problem: false,
// }, {
//   latitude: 34.252408,
//   longitude: 108.946240,
//   problem: false,
// }, {
//   latitude: 34.249286,
//   longitude: 108.946184,
//   problem: false,
// }, {
//   latitude: 34.248670,
//   longitude: 108.946640,
//   problem: false,
// }, {
//   latitude: 34.248129,
//   longitude: 108.946826,
//   problem: false,
// }, {
//   latitude: 34.243537,
//   longitude: 108.946816,
//   problem: true,
// }, {
//   latitude: 34.243478,
//   longitude: 108.939003,
//   problem: true,
// }, {
//   latitude: 34.241218,
//   longitude: 108.939027,
//   problem: true,
// }, {
//   latitude: 34.241192,
//   longitude: 108.934802,
//   problem: true,
// }, {
//   latitude: 34.241182,
//   longitude: 108.932235,
//   problem: true,
// }, {
//   latitude: 34.247227,
//   longitude: 108.932311,
//   problem: true,
// }, {
//   latitude: 34.250833,
//   longitude: 108.932352,
//   problem: true,
// }, {
//   latitude: 34.250877,
//   longitude: 108.931756,
//   problem: true,
// }, {
//   latitude: 34.250944,
//   longitude: 108.931576,
//   problem: true,
// }, {
//   latitude: 34.250834,
//   longitude: 108.929662,
//   problem: true,
// }, {
//   latitude: 34.250924,
//   longitude: 108.926015,
//   problem: true,
// }, {
//   latitude: 34.250802,
//   longitude: 108.910121,
//   problem: true,
// }, {
//   latitude: 34.269718,
//   longitude: 108.909921,
//   problem: true,
// }, {
//   latitude: 34.269221,
//   longitude: 108.922366,
//   problem: false,
// }, {
//   latitude: 34.274531,
//   longitude: 108.922388,
//   problem: false,
// }, {
//   latitude: 34.276201,
//   longitude: 108.923433,
//   problem: false,
// }, {
//   latitude: 34.276559,
//   longitude: 108.924004,
//   problem: false,
// }, {
//   latitude: 34.276785,
//   longitude: 108.945855,
//   problem: false,
// }]
const start = {
  latitude: 34.259428,
  longitude: 108.947040,
  problem: false,
}

const myLocation = {
  latitude: 34.243537,
  longitude: 108.946816,
  problem: true,
}

const dest = {
  latitude: 34.276785,
  longitude: 108.945855,
  problem: false,
}

export default {
  components: {
    TimeLine,
  },
  data() {
    return {
      proportionvc: 0.3, // 抽屉初始显示的位置，内容的百分比
      handleHeight: 20, // 抽屉顶部边框高度，可以设置0，隐藏
      mExpand: false,
      dragLength: 100,
      transitionTime: 0.3,

      menuHeight: 600, // 计算预设菜单的高度 px

      show: false,
      scrollTop: 0, // 支付宝使用
      mscrollTop: 0,
      title: 'Hello',
      longitude: myLocation.longitude,
      latitude: myLocation.latitude,
      covers: [
        {
          id: 0,
          latitude: start.latitude,
          longitude: start.longitude,
        // width: 64,
        // height: 64,
        // iconPath: '/static/images/icon/wxpay.svg',
        },
        {
          id: 999,
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          width: 64,
          height: 64,
          iconPath: '/static/images/icon/positioning.png',
        },
        {
          id: 1,
          latitude: dest.latitude,
          longitude: dest.longitude,
          width: 64,
          height: 64,
          // iconPath: 'http://ottms.innoforce.cc/files/cf5853bf-faf5-409c-8e41-5e30129eb170.svg',
          iconPath: '/static/images/icon/dest.svg',
        },
      ],
      polyline: [],

      autoplay: true,
      interval: 3000,
      duration: 1000,
      indicatorDots: true,
      circular: true,

      // 路由参数
      routeParams: {
        orderId: null,
      },
      // 订单数据
      orderData: null,

      // 页面状态
      pageState: {
        isLoading: false,
        submitting: false,
      },
    }
  },
  computed: {
    scrollViewStyle() {
      return {
        width: '100%',
        height: `${this.menuHeight}px`,
      }
    },
    list() {
      if (!this.orderData)
        return []
      const progress = this.orderData?.extData?.progress || {}

      const {
        placeOrderTime = '',
        receiveTime = '',
        driverSignTime = '',
        currentTime = '',
        current = '',
        receiptTime = '',
        finishTime = '',
      } = progress || {}

      const timeline = [
        { status: '下单成功', time: placeOrderTime, description: '' },
        { status: '接单时间', time: receiveTime, description: '' },
        { status: '发车时间', time: driverSignTime, description: '' },
        { status: '运输中', time: currentTime, description: current ? `当前所在（${current}）` : '' },
        { status: '确认收货', time: receiptTime, description: '' },
        { status: '订单完成', time: finishTime, description: '' },
      ]

      return timeline.reverse() // 最新的在前面
    },
    // 计算当前进度索引
    currentIndex() {
      let i = 0
      const list = [...this.list]
      for (const item of list) {
        console.log(item.status)
        if (item.time) {
          break
        }
        else {
          i++
        }
      }
      return Number(i)
    },
  },
  onLoad(options) {
    this.routeParams.orderId = options.orderId

    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  onReady() {
    this.$refs.drag.initTop()
    this.initMarkLine()
  },

  methods: {
    async initMarkLine() {
      const polyline = await getPolyline({
        from: start,
        to: dest,
        config: {
          color: '#025ADD',
          width: 8,
          dottedLine: false,
        },
      })

      this.polyline = polyline
      console.log('this.polyline', this.polyline)
    },

    // nvue对top动画支持不够，使用css的其他的动画转换
    styleCss() {
      if (this.mExpand) {
        return this.targetCss()// 'width: calc(50%);'
      }
      else {
        return this.originCss()// `width: calc(100% - 20px);`
      }
    },
    targetCss() {
      return 'transform: translateY(100%);transition-property: transform;transition-duration: 1s;'
    },
    originCss() {
      return 'transform: translateY(0px);transition-property: transform;transition-duration: 1s;'
    },
    getStyleObject() {
      if (this.mExpand) {
        return {
          transform: 'translateY(100%)',
          transitionProperty: 'transform',
          transitionDuration: '1s',
        }
      }
      else {
        return {
          transform: 'translateY(0px)',
          transitionProperty: 'transform',
          transitionDuration: '1s',
        }
      }
    },

    onChange(e) {
      let {
        index,
      } = e.detail
      console.warn(index)
      uni.showToast({
        title: `你点击了${index}`,
      })
    },
    onCallExpand(e) { // 展开搜索的回调监听
      this.mExpand = e.value
    },
    expandDrawer() { // 控制初始展开状态和后期外部控制展开和搜索
      this.$nextTick(function () {
        this.goTop()
      })

      console.log(this.mExpand)
    },
    showApp() {
      uni.navigateTo({
        url: 'app-map',
      })
    },
    canDarg() {
      // #ifdef MP-ALIPAY
      return this.mscrollTop < 30
      // #endif

      // eslint-disable-next-line no-unreachable
      return true
    },
    upper(e) {
      console.log(e)
    },
    lower(e) {
      console.log(e)
    },
    scroll(e) {
      this.mscrollTop = e.detail.scrollTop
    },
    goTop() {
      this.mExpand = !this.mExpand
      // 解决view层不同步的问题
      // this.scrollTop = this.mscrollTop
      // this.$nextTick(function() {
      // 	this.scrollTop = 0
      // 	this.$nextTick(function() {
      // 		this.mExpand = !this.mExpand
      // 	});

      // });
    },
    clickAli() {
      uni.showToast({
        title: '点击',
      })
    },
    mapTap(event) {
      console.log(event)
    },
    // 加载订单详情
    async loadOrderDetail() {
      try {
        this.pageState.isLoading = true
        const response = await orderApi.getOrderDetail(this.routeParams.orderId)
        this.orderData = response
      }
      catch (error) {
        console.error('加载订单详情失败:', error)
        uni.showToast({
          title: '加载订单详情失败',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },
  },
}
</script>

<template>
  <view>
    <!-- 主要内容 -->
    <view>
      <!-- <text>vue 展示expand的使用和当内容过长，展开后的控制思路</text> -->

      <!-- #ifdef APP-PLUS -->
      <cover-view @click="expandDrawer()">
        <!-- 展开收缩 -->
      </cover-view>
      <!-- #endif -->
      <!-- #ifndef APP-PLUS -->
      <map
        id="map1"
        ref="map1"
        class="map-view"
        :show-location="true"
        :latitude="latitude"
        :longitude="longitude"
        :markers="covers"
        :polyline="polyline"
        :show-compass="true"
        @tap="mapTap"
      >
        <cover-view @click="expandDrawer()">
          <!-- 展开收缩 -->
        </cover-view>
      </map>
      <!-- #endif -->

      <ww-bottom-drawerapp
        ref="drag" :proportion-show="proportionvc" :drag-handle-height="handleHeight" :is-expand="mExpand"
        :can-drag="canDarg()" :drag-length="dragLength" :transition-time="transitionTime"
        :menu-height="menuHeight" @callExpand="onCallExpand"
      >
        <slot>
          <!-- 填充内容 -->
          <scroll-view
            :scroll-top="scrollTop" :scroll-y="mExpand" :style="scrollViewStyle"
            @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll"
          >
            <!-- 加载状态 -->
            <view v-if="pageState.isLoading" class="loading-container">
              <text class="loading-text">
                加载中...
              </text>
            </view>
            <view v-else class="time-line">
              <TimeLine :list="list" :current-index="currentIndex" />
            </view>
          </scroll-view>
        <!-- end -->
        </slot>
      </ww-bottom-drawerapp>
    </view>
  </view>
</template>

<style>
page {
  background-color: #F8F8F8;
}
</style>

<style lang="scss" scoped>
.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;
	}

	.loading-text {
		font-size: 28rpx;
		color: #666666;
	}

	.tipNvue {
		display: flex;
		width: 100%;
		height: 200rpx;
		background-color: aliceblue;
		margin-top: 200rpx;
	}
	.map-view {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.grid-item-box {
		flex: 1;
    /* position: relative; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.swiper-item {
		height: 100rpx;
		display: block;
		line-height: 100rpx;
		text-align: center;
	}
  .time-line{
    padding: 16rpx 32rpx 32rpx 32rpx;
  }
</style>
