<script>
import { getPolyline } from '@/api/address'
import { orderApi } from '@/api/order'
import TimeLine from '@/components/TimeLine/TimeLine.vue'

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

      // 地图参数
      // longitude: 116.3974770000, //故宫
      // latitude: 39.9086920000,//故宫
      longitude: myLocation.longitude,
      latitude: myLocation.latitude,
      covers: [
        {
          id: 0,
          latitude: start.latitude,
          longitude: start.longitude,
          width: 40,
          height: 40,
          iconPath: '/static/images/icon/map-start.svg',
        },
        {
          id: 999,
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          width: 40,
          height: 40,
          iconPath: '/static/images/icon/map-current-2.svg',
        },
        {
          id: 1,
          latitude: dest.latitude,
          longitude: dest.longitude,
          width: 40,
          height: 40,
          iconPath: '/static/images/icon/map-dest.svg',
        },
      ],
      polyline: [],

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
    coverViewStyle() {
      return `background-color: red;${this.styleCss()}`
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
      this.initMarkLine()
    }
  },
  onReady() {
    this.$refs.drag.initTop()
  },
  methods: {
    // nvue对top动画支持不够，使用css的其他的动画转换
    styleCss() {
      if (this.mExpand) {
        return this.targetCss()// 'width: calc(50%);'
      }
      else {
        return this.originCss()// `width: calc(100% - 20px);`
      }
    },
    scrollViewStyle() {
      return {
        width: '100%',
        height: `${this.menuHeight}px`,
      }
    },
    targetCss() {
      return 'transform: translateY(100%);transition-property: transform;transition-duration: 1s;'
    },
    originCss() {
      return 'transform: translateY(0px);transition-property: transform;transition-duration: 1s;'
    },

    onChange(e) {
      const { index } = e.detail
      console.error(index)
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

    async initMarkLine() {
      const polyline = await getPolyline({
        from: start,
        to: dest,
        config: {
          color: '#FF9E00',
          width: 6,
          dottedLine: false,
        },
      })

      this.polyline = polyline
      console.log('this.polyline', this.polyline)
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
    <!-- <text>vue 展示expand的使用和当内容过长，展开后的控制思路</text> -->

    <!-- #ifdef APP-PLUS -->
    <cover-view @click="expandDrawer()">
      展开收缩
    </cover-view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <map
      id="map1"
      ref="map1"
      class="map-view"
      :show-location="false"
      :latitude="latitude"
      :longitude="longitude"
      :markers="covers"
      :polyline="polyline"
      :show-compass="true"
      scale="14"
      @tap="mapTap"
    >
      <!-- <cover-view @click="expandDrawer()">展开收缩</cover-view> -->
      <!-- 替代解决nvue动画属性top不兼容问题  vue可行，nvue的uni还是不兼容 使用其他替代方案 -->
      <!-- <cover-view v-if="false" ref="Item" class="tipNvue" :style="coverViewStyle" @click="expandDrawer">11111111111111</cover-view> -->
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
          <!-- <uni-grid :column="4" :highlight="false" :show-border="false" @change="onChange">
            <uni-grid-item v-for="(item, index) in 80" :key="index" :index="index">
              <view class="grid-item-box" style="background-color: #fff;">
                <uni-icons type="image" :size="30" color="#777" />
                <text class="text">
                  文本信息
                </text>
              </view>
            </uni-grid-item>
          </uni-grid> -->
          <view v-if="pageState.isLoading" class="loading-container">
            <uni-load-more icon-type="circle" status="loading" />
          </view>
          <view v-else class="time-line">
            <TimeLine :list="list" :current-index="currentIndex" />
          </view>
        </scroll-view>
        <!-- end -->
      </slot>
    </ww-bottom-drawerapp>
  </view>
</template>

<style scoped>
 ::v-deep .drag-handle{
    background-color: #fff;
  }

  ::v-deep .drawer-content{
    background-color: #fff;
    border-radius: 60rpx 60rpx 0 0;
  }
  ::v-deep .drag-content{
  background-color: #fff;
    border-radius: 60rpx 60rpx 0 0;
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

  .loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20vh;
	}
  .time-line{
    padding: 16rpx 32rpx 32rpx 32rpx;
  }
</style>
