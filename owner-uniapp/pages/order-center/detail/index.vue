<script>
import { getPolyline } from '@/api/address'
import { orderApi, OrderStatus, OrderStatusText } from '@/api/order'
import { PayType } from '@/api/pay'
import StatusTag from './components/StatusTag.vue'

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

const payMap = {
  [PayType.WECHAT]: { label: '微信支付', icon: '/static/images/icon/wxpay.svg' },
  [PayType.ALIPAY]: { label: '支付宝', icon: '/static/images/icon/alipay.svg' },
  [PayType.BANK]: { label: '银行卡', icon: '/static/images/icon/unionpay.svg' },
}
// 底部操作栏数据 - 使用OrderStatus枚举替代硬编码数字
const operations = [
  { status: OrderStatus.Created, left: ['取消订单'], right: ['立即支付'] }, // 0 - 已创建待支付
  { status: OrderStatus.Paid, left: ['取消订单'], right: ['修改订单'] }, // 1 - 已支付待接单
  { status: OrderStatus.Signed, left: [], right: [] }, // 3 - 已签署司机前往发车地待验车
  { status: OrderStatus.Accepted, left: ['取消订单'], right: ['修改订单', '立即签署'] }, // 2 - 已接单待签署（业主和平台）
  { status: OrderStatus.Verified, left: [], right: [] }, // 4 - 验车通过待施封
  { status: OrderStatus.Unverified, left: [], right: [] }, // 5 - 验车不通过
  { status: OrderStatus.Sealed, left: [], right: [] }, // 6 - 完成施封待安装GPS
  { status: OrderStatus.GpsInstalled, left: [], right: [] }, // 7 - 完成GPS安装待司机签署
  { status: OrderStatus.DriverSigned, left: ['订单进度'], right: ['验收授权', '确认收货'] }, // 8 - 司机已签署（运输中）
  { status: OrderStatus.DeliveryConfirmed, left: ['订单进度'], right: [] }, // 9 - 司机确认送达待核验
  { status: OrderStatus.OwnerVerified, left: ['订单进度'], right: ['立即评价'] }, // 10 - 业主核验确认收货后待评价
  { status: OrderStatus.OwnerRejected, left: ['订单进度'], right: [] }, // 11 - 业主核验不通过
  { status: OrderStatus.Evaluated, left: ['订单进度'], right: [] }, // 12 - 已评价（用于前端查询）
  { status: OrderStatus.WaitingGpsReturn, left: ['订单进度'], right: ['寄回GPS'] }, // 13 - 确认收货后待邮寄GPS
  { status: OrderStatus.GpsShipped, left: ['订单进度'], right: [] }, // 14 - 已邮寄
  { status: OrderStatus.GpsReceived, left: ['订单进度'], right: [] }, // 15 - 后台确认收到GPS订单结束
  { status: OrderStatus.RefundSubmitted, left: [], right: [] }, // 16 - 已提交资料待退款
  { status: OrderStatus.RefundCompleted, left: [], right: ['删除订单'] }, // 17 - 已退款已取消
]

export default {
  components: {
    StatusTag,
  },
  data() {
    return {
      operations: Object.freeze(operations),
      // 路由参数
      routeParams: {
        orderId: null,
      },

      // 支付方式映射
      payMap: Object.freeze(payMap),

      // 订单数据
      orderData: {
        id: null,
        orderNo: '',
        buyCount: 0,
        memberName: '',
        memberMobile: '',
        driverName: '',
        driverMobile: '',
        carNumber: '',
        type: '',
        deliveryName: '',
        deliveryMobile: '',
        shippingLocationName: '',
        shippingLocationAddress: '',
        province: '',
        city: '',
        district: '',
        address: '',
        takeName: '',
        takeMobile: '',
        payType: '',
        payTime: '',
        placeOrderTime: '',
        receiveTime: '',
        signDate: '',
        vehicleInspectionTime: '',
        driverSignTime: '',
        status: 0,
        yzFileImg: [],
        sjFileImg: [],
        payImg: [],
        vehicleInspectionImg: [],
        leadSealImg: [],
        deliverImg: [],
        gpsImg: [],
      },

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
          iconPath: '/static/images/icon/map-current.png',
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

      // 页面状态
      pageState: {
        isLoading: false,
      },

      // 滚动位置
      scrollTop: 0,
    }
  },
  computed: {
    // 订单状态文本
    statusText() {
      return OrderStatusText[this.orderData?.status] || '未知状态'
    },

    // 底部左侧操作按钮
    bottomLeftOperations() {
      const currentStatus = this.orderData?.status
      const operation = this.operations.find(op => op.status === currentStatus)
      return operation?.left || []
    },

    // 底部右侧操作按钮
    bottomRightOperations() {
      const currentStatus = this.orderData?.status
      const operation = this.operations.find(op => op.status === currentStatus)
      return operation?.right || []
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

  methods: {
    // 加载订单详情
    async loadOrderDetail() {
      try {
        this.pageState.isLoading = true
        const response = await orderApi.getOrderDetail(this.routeParams.orderId)
        // 直接使用API返回的数据
        this.orderData = {
          ...response,
          // 确保数组字段不为null
          yzFileImg: response.yzFileImg || [],
          sjFileImg: response.sjFileImg || [],
          payImg: response.payImg || [],
          vehicleInspectionImg: response.vehicleInspectionImg || [],
          leadSealImg: response.leadSealImg || [],
          deliverImg: response.deliverImg || [],
          gpsImg: response.gpsImg || [],
        }
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
    async initMarkLine() {
      const polyline = await getPolyline({
        from: start,
        to: dest,
        config: {
          color: '#FF9E00',
          width: 8,
          dottedLine: false,
        },
      })

      this.polyline = polyline
      console.log('this.polyline', this.polyline)
    },
    // 拨打电话
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber: phoneNumber.replace(/\*/g, ''),
        fail: (error) => {
          console.error('拨打电话失败:', error)
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none',
          })
        },
      })
    },

    // 各种信息图片查看
    handleViewImages(imgType) {
      if (!this.orderData[imgType] || this.orderData[imgType].length === 0) {
        uni.showToast({
          title: '暂无图片',
          icon: 'none',
        })
        return
      }

      uni.navigateTo({
        url: `/pages/order-center/photo/index?orderId=${this.routeParams.orderId}&imgType=${imgType}`,
      })
    },

    // gps快递信息
    handleViewGpsInfos() {
      if (!this.orderData.gpsImg || this.orderData.gpsImg.length === 0) {
        uni.showToast({
          title: '暂无图片',
          icon: 'none',
        })
        return
      }
      uni.navigateTo({
        url: `/pages/order-center/gps-return/index?orderId=${this.routeParams.orderId}`,
      })
    },

    mapTap(event) {
      console.log(event)
    },

    apiErrorToast(params) {
      console.log('params', params)
      uni.showToast({
        title: '缺少API接口',
        icon: 'none',
      })
    },

    handleOperationButtonClick(order, btnName) {
      switch (btnName) {
        case '取消订单':
          this.handleCancelOrder(order)
          break
        case '修改订单':
          this.handleEditOrder(order)
          break
        case '立即签署':
          this.handleSignOrder(order)
          break
        case '订单进度':
          this.handleOrderProgress(order)
          break
        case '验收授权':
          this.handleCheckOrder(order)
          break
        case '确认收货':
          this.handleConfirmOrder(order)
          break
        case '寄回GPS':
          this.handleReturnGps(order)
          break
        case '立即评价':
          this.handleEvaluateOrder(order)
          break
        case '删除订单':
          this.handleDeleteOrder(order)
          break
        case '再来一单':
          this.apiErrorToast(order)
          break
        case '立即支付':
          this.handlePayOrder(order)
          break
        default:
          this.apiErrorToast(order)
          break
      }
    },
    // 修改订单
    handleEditOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/add/index?orderId=${order.id}`,
      })
    },
    // 签署订单
    async handleSignOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/sign/index?orderId=${order.id}`,
      })
    },
    // 订单进度
    handleOrderProgress(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/progress/index?orderId=${order.id}`,
      })
    },
    // 订单详情
    handleOrderDetail(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/detail/index?orderId=${order.id}`,
      })
    },
    // 复制验收链接到剪贴板
    copyCheckLink() {
      uni.setClipboardData({
        data: this.checkOrderLink,
        success: () => {
          uni.showToast({
            title: '链接复制成功',
            icon: 'success',
          })
          this.showCheckOrderModal = false
          this.checkOrderLink = ''
        },
      })
    },
    // 验收授权
    async handleCheckOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/check/index?orderId=${order.id}`,
      })
      // uni.showLoading({
      //   title: '获取链接中',
      // })
      // this.checkOrderLinkLoading = true
      // const res = await orderApi.getOrderCheckLink({
      //   orderNo: order.orderNo,
      // })
      // this.checkOrderLinkLoading = false
      // uni.hideLoading()
      // if (res) {
      //   this.checkOrderLink = res
      // }
      // else {
      //   uni.showToast({
      //     title: '获取链接失败',
      //     icon: 'none',
      //   })
      // }
      // this.showCheckOrderModal = true
      // this.shareOrder = order
    },
    // 确认收货
    handleConfirmOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/confirm/index?orderId=${order.id}`,
      })
    },
    // 照片信息
    handleOrderPhoto(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/photo/index?orderId=${order.id}`,
      })
    },
    // 评价订单
    handleEvaluateOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/evaluate/index?orderId=${order.id}`,
      })
    },
    // 寄回GPS
    handleReturnGps(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/gps-return/index?orderId=${order.id}`,
      })
    },
    // 立即支付
    handlePayOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/pay/index?orderId=${order.id}`,
      })
    },
    // 取消订单
    handleCancelOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确认取消订单吗？',
        success: async (res) => {
          if (res.confirm) {
            // 如果订单状态为0（已创建待支付），直接调用API取消
            if (order.status === OrderStatus.Created) {
              const res = await orderApi.cancelOrder({
                orderNo: order.orderNo,
              })
              console.log('res', res)
              uni.showToast({
                title: '取消订单成功',
                icon: 'success',
              })
              this.dataList = await this.getOrder()
              this.orderDataList = this.dataList
            }
            else {
              // 其他状态跳转到退款页面
              uni.navigateTo({
                url: `/pages/order-center/cancel/index?orderId=${order.id}`,
              })
            }
          }
        },
      })
    },
    // 删除订单
    handleDeleteOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确认删除订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await orderApi.deleteOrder(order.id)
              uni.showToast({
                title: '删除订单成功',
                icon: 'success',
              })
              this.dataList = await this.getOrder()
              this.orderDataList = this.dataList
            }
            catch (error) {
              uni.showToast({
                title: '删除订单失败',
                icon: 'error',
              })
            }
          }
        },
      })
    },
    // 返回上一页
    navigateBack() {
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <view class="flex-col page-container">
    <!-- 加载状态 -->
    <view v-if="pageState.isLoading" class="loading-container">
      <u-loadmore status="loading" />
    </view>

    <!-- 主要内容 -->
    <view v-else class="main-container">
      <!-- 地图区域 -->
      <view class="map-container">
        <map
          id="map1"
          ref="map1"
          :scale="16"
          class="map-view"
          :show-location="true"
          :latitude="latitude"
          :longitude="longitude"
          :markers="covers"
          :polyline="polyline"
          :show-compass="true"
          @tap="mapTap"
        />
      </view>

      <!-- 内容区域 -->
      <view class="content-container flex-col">
        <!-- 订单状态信息卡片 -->
        <view class="info-card">
          <view class="card-header">
            <StatusTag
              :status="orderData.status"
              :text="statusText"
            />
          </view>

          <view class="card-content">
            <view class="info-row">
              <text class="info-label">
                {{ orderData.memberName }}
              </text>
              <text class="info-value">
                {{ orderData.memberMobile }}
              </text>
            </view>

            <view class="info-row">
              <text class="info-value">
                <text style="color: #FF9E00;">
                  【默认】
                </text>{{ orderData.address }}
              </text>
            </view>
            <image
              class="arrow-icon"
              referrerpolicy="no-referrer"
              src="/static/images/mine-arrow.png"
            />
          </view>
        </view>

        <!-- 订单详情 -->
        <scroll-view
          :scroll-top="scrollTop"
          scroll-y="true"
          class="detail-section"
        >
          <view class="detail-section-view">
            <view class="detail-row">
              <text class="detail-label">
                订单编号
              </text>
              <text class="detail-value">
                {{ orderData.orderNo }}
              </text>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                购买数量
              </text>
              <text class="detail-value">
                {{ orderData.buyCount }}
              </text>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                司机
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.driverName ? orderData.driverName : '' }}
                </view>
                <view v-if="orderData.driverMobile" class="phone-icon" @click="makePhoneCall(orderData.driverMobile)">
                  <image src="/static/images/icon/phone.png" class="icon-image" />
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                车辆信息
              </text>
              <text class="detail-value">
                {{ orderData.type ? orderData.type : '' }}
                <text style="margin: 0 16rpx;">
                  |
                </text>
                {{ orderData.carNumber ? orderData.carNumber : '' }}
              </text>
            </view>

            <view class="detail-row">
              <view class="detail-label">
                发货员
              </view>
              <view class="detail-value">
                <view> {{ orderData.deliveryName ? orderData.deliveryName : '' }}</view>
                <view v-if="orderData.deliveryMobile" class="phone-icon" @click="makePhoneCall(orderData.deliveryMobile)">
                  <image src="/static/images/icon/phone.png" class="icon-image" />
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                支付方式
              </text>
              <view v-if="orderData.payType" class="detail-value">
                <image :src="payMap[orderData.payType].icon" style="width: 26rpx; height: 26rpx; margin-right: 8rpx;" />
                <view>
                  {{ payMap[orderData.payType].label ? payMap[orderData.payType].label : '' }}
                </view>
                <view class="link-text" @click="handleViewImages('payImg')">
                  支付凭证
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                支付时间
              </text>
              <text class="detail-value">
                {{ orderData.payTime ? orderData.payTime : '' }}
              </text>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                下单时间
              </text>
              <text class="detail-value">
                {{ orderData.placeOrderTime ? orderData.placeOrderTime : '' }}
              </text>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                接单时间
              </text>
              <text class="detail-value">
                {{ orderData.receiveTime ? orderData.receiveTime : '' }}
              </text>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                平台服务协议签署时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.signDate ? orderData.signDate : '' }}
                </view>
                <view v-if="orderData.signDate" class="link-text" @click="handleViewImages('yzFileImg')">
                  合同详情
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                司机承运协议签署时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.driverSignTime ? orderData.driverSignTime : '' }}
                </view>
                <view v-if="orderData.driverSignTime" class="link-text" @click="handleViewImages('sjFileImg')">
                  合同详情
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                验车时间
              </text>

              <view class="detail-value">
                <view>
                  {{ orderData.vehicleInspectionTime ? orderData.vehicleInspectionTime : '' }}
                </view>
                <view v-if="orderData.vehicleInspectionTime" class="link-text" @click="handleViewImages('vehicleInspectionImg')">
                  验车信息
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                施封时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.leadSealTime ? orderData.leadSealTime : '' }}
                </view>
                <view v-if="orderData.leadSealTime" class="link-text" @click="handleViewImages('leadSealImg')">
                  施封信息
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                GPS安装时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.gpsTime ? orderData.gpsTime : '' }}
                </view>
                <view v-if="orderData.gpsTime" class="link-text" @click="handleViewImages('gpsImg')">
                  GPS设备信息
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                货物送达时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.deliverTime ? orderData.deliverTime : '' }}
                </view>
                <view v-if="orderData.deliverTime" class="link-text" @click="handleViewImages('deliverImg')">
                  送达信息
                </view>
              </view>
            </view>

            <view class="detail-row">
              <text class="detail-label">
                确认收货时间
              </text>
              <text class="detail-value">
                {{ orderData.receiptTime ? orderData.receiptTime : '' }}
              </text>
            <!-- <text class="link-text" >
              确认收货信息
            </text> -->
            </view>

            <view class="detail-row">
              <text class="detail-label">
                卸货位置
              </text>
              <text class="detail-value">
                {{ orderData.address ? orderData.address : '' }}
              </text>
            <!-- <text class="link-text" >
              卸货信息
            </text> -->
            </view>

            <view class="detail-row">
              <text class="detail-label">
                GPS寄回时间
              </text>
              <view class="detail-value">
                <view>
                  {{ orderData.gpsReturnTime ? orderData.gpsReturnTime : '' }}
                </view>
                <view v-if="orderData.gpsReturnTime" class="link-text" @click="handleViewGpsInfos">
                  快递信息
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 固定底部按钮 -->
      <view class="fixed-bottom-actions">
        <view class="bottom-btn-left space-x-10">
          <button
            v-for="(leftBtn, leftIndex) in bottomLeftOperations"
            :key="leftIndex"
            class="mr-20 bottom-btn cancel-btn"
            @click.stop="handleOperationButtonClick(orderData, leftBtn)"
          >
            {{ leftBtn }}
          </button>
        </view>
        <view class="bottom-btn-right space-x-10">
          <button
            v-for="(rightBtn, rightIndex) in bottomRightOperations"
            :key="rightIndex"
            class="ml-20 bottom-btn"
            :class="[rightIndex === bottomRightOperations.length - 1 ? 'sign-btn' : 'modify-btn']"
            @click.stop="handleOperationButtonClick(orderData, rightBtn)"
          >
            {{ rightBtn }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/static/css/form.scss';

.page-container {
  // #ifdef H5
  height: calc(100vh - 44px - 50px - constant(safe-area-inset-top) -  constant(safe-area-inset-bottom));
  height: calc(100vh - 44px - 50px - env(safe-area-inset-top) -  env(safe-area-inset-bottom));
  // #endif
  // #ifdef MP-WEIXIN
  height: 100vh;
  // #endif
  width: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.main-container{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-container {
  position: relative;
  height: 400rpx;
  width: 100%;
  overflow: hidden;
  margin-bottom: -60rpx;
}

.map-view {
  display: flex;
  width: 100%;
  height: 100%;
}

.map-image {
  width: 100%;
  height: 100%;
}

.map-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-marker {
  top: 60rpx;
  left: 60rpx;
}

.end-marker {
  bottom: 60rpx;
  right: 60rpx;
}

.marker-icon {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
}

.start-icon {
  background-color: #ff4757;
}

.end-icon {
  background-color: #2ed573;
}

.marker-text {
  font-size: 20rpx;
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.content-container {
  flex: 1;
  // padding: 32rpx;
  gap: 16rpx;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 400rpx - 160rpx);
  overflow: hidden;
}

.info-card {
  position: relative;
  background-color: #ffffff;
  // border-radius: 16rpx;
  // padding: 32rpx;
  padding: 48rpx 32rpx 0 32rpx;
  border-radius: 60rpx 60rpx 0rpx 0rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 24rpx;
  display: flex;
}

.card-title {
font-family: PingFangSC, PingFang SC;
font-weight: 600;
font-size: 28rpx;
color: #4D4E46;
line-height: 40rpx;
text-align: left;
font-style: normal;
}

.card-content {
  // gap: 16rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #4D4E46;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  position: relative;
  margin-bottom: 42rpx;
}

.arrow-icon {
  width: 16rpx;
  height: 32rpx;
  // margin: 30rpx 0 32rpx 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
  min-width: 140rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.detail-section {
  background-color: #ffffff;
  // border-radius: 16rpx;
  // padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  flex: 1;
  height: 0;
}

.detail-section-view {
  padding: 0 32rpx 300rpx 32rpx;
}

.detail-row {
  display: flex;
  align-items: center;
  // padding: 24rpx 0;
  padding: 16rpx 0;
  // border-bottom: 1rpx solid #f0f0f0;
  position: relative;
  justify-content: space-between;
}

.detail-row:last-child {
  // border-bottom: none;
}

.detail-label {
  height: 40rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
}

.detail-value {
  height: 40rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 28rpx;
  color: #333333;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  display: flex;
  align-items: center;
}

.phone-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 32rpx;
  height: 32rpx;
}

.link-text {
  font-size: 28rpx;
  color: #FF9E00;
  margin-left: 16rpx;
  line-height: 40rpx;
  font-weight: 400;
}

.payment-status {
  font-size: 24rpx;
  color: #52c41a;
  margin-left: 16rpx;
  background-color: #f6ffed;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid #b7eb8f;
}

/* 固定底部按钮 */
.fixed-bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #ffffff;
  border-top: 1rpx solid #e5e5e5;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); /* 适配安全区域 */
  z-index: 999;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.bottom-btn-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bottom-btn-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10rpx;
}

.bottom-btn {
  height: 96rpx;
	border-radius: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
  font-style: normal;
}

/* 取消订单按钮样式 */
.cancel-btn {
  color: #666666;
  border: none;
  outline: none;
  font-weight: 400;
  font-size: 28rpx;
  line-height: 40rpx;

  &:after {
    border: none;
    outline: none;
  }
}

/* 修改订单按钮样式 */
.modify-btn {
	background-color: #fff;
  border: 2rpx solid #FF9E00;
	color: #FF9E00;
  padding:  0rpx 56rpx;
  font-weight: 500;
  font-size: 32rpx;
  line-height: 44rpx;
}

/* 立即签署按钮样式 */
.sign-btn {
	background: #FF9E00;
  color: #FFFFFF;
  padding:  0rpx 56rpx;
  font-weight: 500;
  font-size: 32rpx;
}
</style>
