<script>
import { getPolyline } from '@/api/address'
import { orderApi, OrderStatus, OrderStatusText } from '@/api/order'
import { PayType } from '@/api/pay'

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
          color: '#025ADD',
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
    <view v-else>
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
        <view class="info-card pending-card">
          <view class="card-header">
            <text class="card-title">
              {{ statusText }}
            </text>
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
              <text class="info-label">
                送货地址：
              </text>
              <text class="info-value">
                {{ orderData.address }}
              </text>
            </view>
            <view class="info-row">
              <text class="info-label">
                发货地址：
              </text>
              <text class="info-value">
                {{ orderData.current }}
              </text>
            </view>
          </view>
        </view>

        <!-- 订单详情 -->
        <view class="detail-section">
          <view class="detail-row">
            <text class="detail-label">
              订单编号：
            </text>
            <text class="detail-value">
              {{ orderData.orderNo }}
            </text>
          </view>

          <view class="detail-row">
            <text class="detail-label">
              购买数量：
            </text>
            <text class="detail-value">
              {{ orderData.buyCount }}吨
            </text>
          </view>

          <view v-if="orderData.driverName" class="detail-row">
            <text class="detail-label">
              司机：
            </text>
            <text class="detail-value">
              {{ orderData.driverName }}
            </text>
            <view class="phone-icon" @click="makePhoneCall(orderData.driverMobile)">
              <image src="/static/images/icon/phone.png" class="icon-image" />
            </view>
          </view>

          <view v-if="orderData.carNumber" class="detail-row">
            <text class="detail-label">
              车辆信息：
            </text>
            <text class="detail-value">
              {{ orderData.type }}，{{ orderData.carNumber }}
            </text>
          </view>

          <view v-if="orderData.deliveryName" class="detail-row">
            <text class="detail-label">
              发货员：
            </text>
            <text class="detail-value">
              {{ orderData.deliveryName }}
            </text>
            <view v-if="orderData.deliveryMobile" class="phone-icon" @click="makePhoneCall(orderData.deliveryMobile)">
              <image src="/static/images/icon/phone.png" class="icon-image" />
            </view>
          </view>

          <view v-if="orderData.payType" class="detail-row">
            <text class="detail-label">
              支付方式：
            </text>
            <text class="detail-value">
              <image :src="payMap[orderData.payType].icon" style="width: 26rpx; height: 26rpx; margin-right: 8rpx;" />
              {{ payMap[orderData.payType].label }}
            </text>
            <text class="link-text" @click="handleViewImages('payImg')">
              支付凭证
            </text>
          </view>

          <view v-if="orderData.payTime" class="detail-row">
            <text class="detail-label">
              支付时间：
            </text>
            <text class="detail-value">
              {{ orderData.payTime }}
            </text>
          </view>

          <view class="detail-row">
            <text class="detail-label">
              下单时间：
            </text>
            <text class="detail-value">
              {{ orderData.placeOrderTime }}
            </text>
          </view>

          <view v-if="orderData.receiveTime" class="detail-row">
            <text class="detail-label">
              接单时间：
            </text>
            <text class="detail-value">
              {{ orderData.receiveTime }}
            </text>
          </view>

          <view v-if="orderData.signDate" class="detail-row">
            <text class="detail-label">
              平台服务协议签署时间：
            </text>
            <text class="detail-value">
              {{ orderData.signDate }}
            </text>
            <text class="link-text" @click="handleViewImages('yzFileImg')">
              合同详情
            </text>
          </view>

          <view v-if="orderData.driverSignTime" class="detail-row">
            <text class="detail-label">
              司机承运协议签署时间：
            </text>
            <text class="detail-value">
              {{ orderData.driverSignTime }}
            </text>
            <text class="link-text" @click="handleViewImages('sjFileImg')">
              合同详情
            </text>
          </view>

          <view v-if="orderData.vehicleInspectionTime" class="detail-row">
            <text class="detail-label">
              验车时间：
            </text>
            <text class="detail-value">
              {{ orderData.vehicleInspectionTime }}
            </text>
            <text class="link-text" @click="handleViewImages('vehicleInspectionImg')">
              验车信息
            </text>
          </view>

          <view v-if="orderData.leadSealTime" class="detail-row">
            <text class="detail-label">
              施封时间：
            </text>
            <text class="detail-value">
              {{ orderData.leadSealTime }}
            </text>
            <text class="link-text" @click="handleViewImages('leadSealImg')">
              施封信息
            </text>
          </view>

          <view v-if="orderData.gpsTime" class="detail-row">
            <text class="detail-label">
              GPS安装时间：
            </text>
            <text class="detail-value">
              {{ orderData.gpsTime }}
            </text>
            <text class="link-text" @click="handleViewImages('gpsImg')">
              GPS设备信息
            </text>
          </view>

          <view v-if="orderData.deliverTime" class="detail-row">
            <text class="detail-label">
              货物送达时间：
            </text>
            <text class="detail-value">
              {{ orderData.deliverTime }}
            </text>
            <text class="link-text" @click="handleViewImages('deliverImg')">
              送达信息
            </text>
          </view>

          <view v-if="orderData.receiptTime" class="detail-row">
            <text class="detail-label">
              确认收货时间：
            </text>
            <text class="detail-value">
              {{ orderData.receiptTime }}
            </text>
            <!-- <text class="link-text" >
              确认收货信息
            </text> -->
          </view>

          <view v-if="orderData.address" class="detail-row">
            <text class="detail-label">
              卸货位置：
            </text>
            <text class="detail-value">
              {{ orderData.address }}
            </text>
            <!-- <text class="link-text" >
              卸货信息
            </text> -->
          </view>

          <view v-if="orderData.gpsReturnTime" class="detail-row">
            <text class="detail-label">
              GPS寄回时间：
            </text>
            <text class="detail-value">
              {{ orderData.gpsReturnTime }}
            </text>
            <text class="link-text" @click="handleViewGpsInfos">
              快递信息
            </text>
          </view>
        </view>

        <!-- 底部占位空间，避免内容被固定按钮遮挡 -->
        <view class="bottom-placeholder" />
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
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.map-container {
  position: relative;
  height: 400rpx;
  width: 100%;
  overflow: hidden;
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
  padding: 32rpx;
  gap: 32rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.pending-card {
  border-left: 8rpx solid #1890ff;
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1890ff;
}

.card-content {
  gap: 16rpx;
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
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 28rpx;
  color: #666666;
  min-width: 200rpx;
}

.detail-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
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
  color: #1890ff;
  margin-left: 16rpx;
  text-decoration: underline;
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

/* 底部占位空间 */
.bottom-placeholder {
  height: 120rpx; /* 为固定按钮留出空间 */
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
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); /* 适配安全区域 */
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
  height: 100%;
	border-radius: 40rpx;
	font-size: 26rpx;
	display: flex;
	justify-content: center;
	align-items: center;
  padding: 0 32rpx;
}

/* 取消订单按钮样式 */
.cancel-btn {
	background-color: #E9E9E9;
	color: #AAAAAA;
}

/* 修改订单按钮样式 */
.modify-btn {
	background-color: #fff;
  border: 2rpx solid #EBA932;
	color: #EBA932;
}

/* 立即签署按钮样式 */
.sign-btn {
	background: linear-gradient(to right, #FFA600, #FFCD01);
	color: #fff;
}
</style>
