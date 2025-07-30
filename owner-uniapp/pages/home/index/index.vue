<script>
import { mapApi, orderApi } from '@/api'
// #ifdef H5
let mapObj = null // 地图实例
let agriculture = null // 图标样式实例
// #endif

export default {
  data() {
    return {
      key: 'DHZBZ-7MHY3-PF63K-O627C-I2GBE-DPFYX',
      page: 1,
      size: 10,
      orderList: [],
      dataList: [],
      iconItem: [],
      show: true,
      latitude: 30.188034,
      longitude: 120.214237,
      markers: [],
      iconPath: '/static/images/icon/positioning3X.png',
      mapReady: false, // 新增：地图初始化完成标志
      dataReady: false, // 新增：数据加载完成标志
      startY: 0,
      endY: 0,
    }
  },
  async onLoad() {
    await this.getData()

    // #ifdef H5
    this.loadScrpit()
    // #endif

    // #ifdef MP-WEIXIN
    await this.getMap()
    // #endif
  },
  methods: {
    down(e) {
      this.show = !this.show
    },
    // 初始化地图脚本
    loadScrpit() {
      // #ifdef H5
      window.mapInit = () => {
        // 确保容器已渲染
        this.$nextTick(() => {
          mapObj = new TMap.Map('wrapper', {
            center: new TMap.LatLng(30.188034, 120.214237),
            zoom: 14,
            mapStyleId: 'style1',
            zoomControl: false,
          })

          // 初始化图标样式
          this.setIcon()
          this.mapReady = true
          this.trySetMapMarkers() // 尝试设置标记点
        })
      }

      const script = document.createElement('script')
      script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${this.key}&callback=mapInit`
      document.body.appendChild(script)
      // #endif
    },
    // 创建标点图标样式
    setIcon() {
      // #ifdef H5
      agriculture = new TMap.MarkerStyle({
        width: 52.5,
        height: 52.5,
        anchor: {
          x: 26.25,
          y: 26.25,
        },
        src: '/static/images/icon/positioning3X.png', // 关键修复：使用src而非image
      })
      // #endif
    },
    // 尝试设置地图标记点（确保地图和数据都就绪）
    trySetMapMarkers() {
      // #ifdef H5
      if (this.mapReady && this.dataReady) {
        this.setMapMarker()
      }
      // #endif
    },
    // 创建标点实例
    setMapMarker() {
      // #ifdef H5
      if (!mapObj || !agriculture)
        return

      const geometries = this.iconItem.map((item, i) => ({
        id: `marker_${i}`,
        styleId: 'agriculture',
        position: new TMap.LatLng(item.position[0], item.position[1]),
        properties: {
          title: item.name,
        },
      }))

      new TMap.MultiMarker({
        map: mapObj,
        styles: {
          agriculture,
        }, // 关键修复：使用对象形式
        geometries,
      })
      // #endif

      // #ifdef MP-WEIXIN
      console.log('打点', this.iconItem)

      this.markers = this.iconItem.map((item, index) => ({
        id: index.toString(),
        latitude: item.position[0],
        longitude: item.position[1],
        iconPath: this.iconPath,
        width: 52.5,
        height: 52.5,
        callout: { // 添加标记点弹窗
          content: `车辆: ${item.carNumber || '未知'}`,
          bgColor: '#FFFFFF',
          padding: 5,
          borderRadius: 3,
          display: 'ALWAYS',
        },
      }))
      // #endif
    },
    // 获取地图坐标数据
    async getMap() {
      try {
        const data = await mapApi.getCoordinates({})
        console.log('地图坐标数据', data)
        this.latitude = Number(data[0]?.position[0]) || this.latitude
        this.longitude = Number(data[0]?.position[1]) || this.longitude

        this.iconItem = data.map((item, index) => {
          const position = [
            Number(item.position[0]),
            Number(item.position[1]),
          ]

          // 微信小程序需要单独设置标记点
          // #ifdef MP-WEIXIN
          this.markers.push({
            id: index.toString(),
            latitude: position[0],
            longitude: position[1],
            iconPath: this.iconPath,
            width: 52.5,
            height: 52.5,
          })
          // #endif

          return {
            name: 'agriculture',
            position,
            properties: item,
          }
        })

        this.dataReady = true
        this.trySetMapMarkers() // 尝试设置标记点
      }
      catch (e) {
        console.error('地图数据加载失败:', e)
      }
    },
    // 获取订单数据
    async getData() {
      try {
        const data = await orderApi.getCurrentOrder({
          page: this.page,
          size: this.size,
        })

        this.dataList = data?.content || []
        this.orderList = [...this.orderList, ...this.dataList]
      }
      catch (e) {
        console.error('订单数据加载失败:', e)
      }
    },
    // 滚动加载更多
    onScroll(e) {
      if (this.dataList.length >= this.size
        && e.detail.scrollTop > this.orderList.length * 90) {
        this.page++
        this.getData()
      }
    },
    handleTouchStart(e) {
      this.startY = e.touches[0].clientY
      this.startTime = Date.now() // 记录起始时间
    },
    handleTouchEnd(e) {
      this.endY = e.changedTouches[0].clientY
      this.endTime = Date.now()
      this.detectSwipe()
    },
    detectSwipe() {
      const threshold = 10 // 滑动阈值（像素）
      const diffY = this.endY - this.startY
      const diffTime = this.endTime - this.startTime
      const isFastSwipe = diffTime > 100 // 快速滑动判定（毫秒）
      // 判断滑动方向和速度
      if (Math.abs(diffY) > 5 && diffTime > 100) {
        if (diffY > 0) {
          console.log('有效下滑 ↓')
          this.show = !this.show
        }
        else {
          console.log('有效上滑 ↑')
          this.show = !this.show
        }
      }

      // if (diff > threshold) {
      // 	this.show = !this.show
      // 	// 执行上滑逻辑
      // } else if (diff < -threshold) {
      // 	this.show = !this.show
      // 	// 执行下滑逻辑
      // }
    },
    handleTouchMove(e) {
      console.log(e)
    },
  },
}
</script>

<template>
  <view class="content">
    <view :class="show ? 'wrapperBox' : 'wrapper25' ">
      <!-- #ifdef H5 -->
      <view id="wrapper" style="width:100%;height:100%;" />
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <map
        :latitude="latitude" :longitude="longitude" :markers="markers" :iconPath="iconPath"
        style="width:100%;height:100%;"
      />
      <!-- #endif -->
    </view>
    <view :class="show ? 'listCard down' : 'listCard top'">
      <view class="list">
        <view style="padding-left: 5%;" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
          <view class="title">
            当前订单
          </view>
          <view class="image" @click.prevent.stop="down">
            <image
              style="width:30px;height:20px;margin-left:-10px;"
              :src="show ? '/static/images/icon/up.png' : '/static/images/icon/down2.png'"
            />
          </view>
        </view>
        <scroll-view
          :class="show ? 'scroll-container downS' : 'scroll-container top'" scroll-y
          @scroll="onScroll"
        >
          <view v-for="(item, index) in orderList" :key="index" class="card">
            <view class="treetop">
              <text>运输中</text>
            </view>
            <view class="card_item">
              <view style="font-size: 12px;color:#999999">
                订单编号：{{ item.orderNo }}
              </view>
              <view class="flex">
                <view style="font-size: 12px;color:#999999">
                  车牌号码：<text
                    id="text"
                    style="color:#000000;"
                  >
                    {{ item.carNumber }}
                  </text>
                </view>
                <view style="margin-left:20px;font-size: 12px;color:#999999">
                  已到达：<text
                    id="text"
                    style="color:#000000;"
                  >
                    {{ item.current }}
                  </text>
                </view>
              </view>
              <view style="font-size: 12px;color:#999999">
                发车时间：<text
                  id="text"
                  style="color:#000000;"
                >
                  {{ item.driverSignTime || "-" }}
                </text>
              </view>
            </view>
          </view>
          <view style="height:50px;" />
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
	@import './index.scss';

.wrapperBox {
  width: 100%;
  height: 70vh;
}

.wrapper25 {
  width: 100vw;
  height: 25vh;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
