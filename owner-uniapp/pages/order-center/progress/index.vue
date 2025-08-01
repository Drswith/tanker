<script>
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
      title: 'Hello',
      longitude: 116.3974770000,
      latitude: 39.9086920000,

      autoplay: true,
      interval: 3000,
      duration: 1000,
      indicatorDots: true,
      circular: true,
    }
  },
  onLoad() {},
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
      id="map1" ref="map1" class="map-view" :show-location="false" :latitude="latitude" :longitude="longitude"
      scale="14" @tap="mapTap"
    >
      <cover-view @click="expandDrawer()">展开收缩</cover-view>
      <!-- 替代解决nvue动画属性top不兼容问题  vue可行，nvue的uni还是不兼容 使用其他替代方案 -->
      <cover-view v-if="false" ref="Item" class="tipNvue" :style="`background-color: red;${styleCss()}`" @click="expandDrawer">11111111111111</cover-view>
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
          :scroll-top="scrollTop" :scroll-y="mExpand" :style="`width: 100%;height :${menuHeight}px` "
          @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll"
        >
          <view @click.stop="clickAli">
            测试支付宝是否透传
          </view>
          <swiper
            :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
            :duration="duration" :circular="circular" style="height:100rpx"
          >
            <swiper-item>
              <view class="swiper-item uni-bg-red">
                A
              </view>
            </swiper-item>
            <swiper-item>
              <view class="swiper-item uni-bg-blue">
                B
              </view>
            </swiper-item>
            <swiper-item>
              <view class="swiper-item uni-badge-purple">
                C
              </view>
            </swiper-item>
          </swiper>
          <uni-grid :column="4" :highlight="false" :show-border="false" @change="onChange">
            <uni-grid-item v-for="(item, index) in 80" :key="index" :index="index">
              <view class="grid-item-box" style="background-color: #fff;">
                <uni-icons type="image" :size="30" color="#777" />
                <text class="text">
                  文本信息
                </text>
              </view>
            </uni-grid-item>
          </uni-grid>
        </scroll-view>
        <!-- end -->
      </slot>
    </ww-bottom-drawerapp>
  </view>
</template>

<style lang="scss" scoped>
	page {
		background-color: #f3f3f3;
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
</style>
