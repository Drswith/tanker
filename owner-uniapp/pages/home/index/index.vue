<script>
import { mapApi } from '@/api/map'
import { orderApi } from '@/api/order'

const myLocation = {
  latitude: 34.243537,
  longitude: 108.946816,
}

export default {
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
      covers: [],
      polyline: [],

      page: 1,
      size: 20,
      // 订单数据
      dataList: [],
      orderList: [],

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
    scrollViewStyle() {
      return {
        width: '100%',
        height: `${this.menuHeight}px`,
      }
    },
  },
  onLoad() {
    this.loadOrder()
    this.getMap()
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

      if (this.dataList.length >= this.size
        && e.detail.scrollTop > this.orderList.length * 90) {
        this.page++
        this.loadOrder()
      }
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
    // 跳转消息列表
    navgateToMessageList() {
      uni.navigateTo({
        url: '/pages/message-center/index/index',
      })
    },

    // 跳转新增订单
    navgateToAddOrderCenter() {
      uni.navigateTo({
        url: '/pages/order-center/add/index',
      })
    },
    // 获取地图坐标数据
    async getMap() {
      try {
        const data = await mapApi.getMapCoordinates({})
        console.log('地图坐标数据', data)
        this.latitude = Number(data[0]?.position[0]) || this.latitude
        this.longitude = Number(data[0]?.position[1]) || this.longitude
        this.covers = data
          .map((item, index) => {
            const latitude = Number(item.position[0])
            const longitude = Number(item.position[1])
            console.log('cover', item)
            return { latitude, longitude }
          })
          .map((point, pointIndex) => {
            return {
              id: Number.parseInt(pointIndex),
              latitude: point.latitude,
              longitude: point.longitude,
              iconPath: '/static/images/icon/map-current.png',
              // 图片原始大小 162*128
              width: Math.round(162 * 0.35),
              height: Math.round(128 * 0.35),
            }
          })
      }
      catch (e) {
        console.error('地图数据加载失败:', e)
        uni.showToast({
          title: '地图数据加载失败',
          icon: 'none',
        })
      }
    },
    // 加载订单数据
    async loadOrder() {
      try {
        this.pageState.isLoading = true
        const data = await orderApi.getCurrentOrder({
          page: this.page,
          size: this.size,
        })

        this.dataList = data?.content || []
        this.orderList = [...this.orderList, ...this.dataList]
      }
      catch (e) {
        console.error('订单数据加载失败:', e)
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
    <!-- <cover-view @click="expandDrawer()">
      展开收缩
    </cover-view> -->
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
      scale="14"
      @tap="mapTap"
    >
      <!-- <cover-view @click="expandDrawer()" >expandDrawer</cover-view> -->
      <!-- 替代解决nvue动画属性top不兼容问题  vue可行，nvue的uni还是不兼容 使用其他替代方案 -->
      <!-- <cover-view v-if="false" ref="Item" class="tipNvue" :style="coverViewStyle" @click="expandDrawer">11111111111111</cover-view> -->
    </map>
    <!-- #endif -->
    <button class="message-btn" @click="navgateToMessageList">
      <image
        class="message-btn-icon"
        src="/static/images/icon/bell.png"
      />
    </button>
    <ww-bottom-drawerapp
      ref="drag" :proportion-show="proportionvc" :drag-handle-height="handleHeight" :is-expand="mExpand"
      :can-drag="canDarg()" :drag-length="dragLength" :transition-time="transitionTime"
      :menu-height="menuHeight" @callExpand="onCallExpand"
    >
      <slot>
        <button class="float-btn" @click="navgateToAddOrderCenter">
          <image
            class="float-btn-icon"
            src="/static/images/upload-plus.png"
          />
        </button>

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
          <view v-else class="">
            <view class="title">
              当前订单
            </view>
            <view v-for="(item, index) in orderList" :key="index" class="order-card">
              <view class="order-card-tag">
                <text>运输中</text>
              </view>
              <view class="order-card-label">
                订单编号：{{ item.orderNo }}
              </view>

              <view class="flex">
                <view class="order-card-label" style="flex: 1;">
                  车牌号码：
                  <text class="order-card-value">
                    {{ item.carNumber || "-" }}
                  </text>
                </view>

                <view class="order-card-label" style="flex: 1;">
                  已到达：
                  <text class="order-card-value">
                    {{ item.district || "-" }}
                  </text>
                </view>
              </view>

              <view class="order-card-label">
                发车时间：<text class="order-card-value">
                  {{ item.driverSignTime || "-" }}
                </text>
              </view>
            </view>
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
.message-btn {
  position: absolute;
  top: 200rpx;
  right: 48rpx;
  width: 64rpx;
  height: 64rpx;
  background: rgba(255,255,255,0.8);
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
  z-index: 999999;
  padding: 8rpx;
  border: none;
  outline: none;
}
.message-btn::after{
  border: none;
  outline: none;

}

.message-btn-icon {
  width: 100%;
  height: 100%;
  color: #333333;
}
.float-btn {
  position: absolute;
  top: -150rpx;
  right: 48rpx;
  width: 100rpx;
  height: 100rpx;
	background: linear-gradient(to right, #FEA801, #FFCA00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
  z-index: 999999;
  padding: 26rpx;
  border: none;
  outline: none;
}
.float-btn::after{
  border: none;
  outline: none;
}

.float-btn-icon {
  width: 100%;
  height: 100%;
}

  .loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20vh;
	}
  .title {
    font-weight: 600;
    font-size: 32rpx;
		margin-top: -8rpx;
    line-height: 44rpx;
    font-style: normal;
    font-family: PingFangSC, PingFang SC;
		margin-bottom: 32rpx;
		padding-left: 48rpx;
		color:"#4D4E46"
	}

  .order-card {
    position: relative;
    padding: 0 24rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(0,0,0,0.1);
    border-radius: 16rpx;
    margin: 0 48rpx 32rpx 48rpx;
    overflow: hidden;
  }

  .order-card-label {
    padding: 16rpx 0 ;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
    min-width: 120rpx;
  }

  .order-card-value{
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 24rpx;
    color: #333333;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
  }

  .order-card-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient( 326deg, #FFD100 0%, #FFA500 100%);
    border-radius: 0rpx 8rpx 0rpx 8rpx;
    font-family: PingFangSC, PingFang SC;
    font-size: 24rpx;
    color: #FFFFFF;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
    padding: 8rpx 24rpx;
  }
</style>
