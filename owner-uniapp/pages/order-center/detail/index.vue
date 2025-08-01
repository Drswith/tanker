<script>
import { orderApi, OrderStatusText } from '@/api/order'

export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      // 路由参数
      routeParams: {
        orderId: null,
      },

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

      // 页面状态
      pageState: {
        isLoading: false,
      },
    }
  },
  computed: {
    // 订单状态文本
    statusText() {
      return OrderStatusText[this.orderData.status] || '未知状态'
    },

    // 完整的收货地址
    fullDeliveryAddress() {
      const { province, city, district, address } = this.orderData
      return `${province}${city}${district}${address}`
    },

    // 发货地址
    pickupAddress() {
      const { shippingLocationName, shippingLocationAddress } = this.orderData
      return `${shippingLocationName}(${shippingLocationAddress})`
    },

    // 支付方式文本
    payTypeText() {
      const payTypeMap = {
        1: '微信支付',
        2: '支付宝',
        3: '银行卡',
      }
      return payTypeMap[this.orderData.payType] || '未设置'
    },
  },
  watch: {

  },
  onLoad(options) {
    this.routeParams.orderId = options.id
    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  created() {

  },
  mounted() {

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

    // 查看合同详情
    viewContract() {
      uni.showToast({
        title: '查看合同功能开发中',
        icon: 'none',
      })
    },

    // 查看车辆信息
    viewVehicleInfo() {
      uni.navigateTo({
        url: `/pages/order-center/vehicle-info/index?orderId=${this.routeParams.orderId}`,
      })
    },

    // 修改订单
    editOrder() {
      uni.navigateTo({
        url: `/pages/order-center/edit/index?orderId=${this.routeParams.orderId}`,
      })
    },

    // 立即签署
    signOrder() {
      uni.navigateTo({
        url: `/pages/order-center/sign/index?orderId=${this.routeParams.orderId}`,
      })
    },

    // 取消订单
    cancelOrder() {
      // 根据订单状态决定取消逻辑
      if (this.orderData.status === 0) {
        // 状态为0时直接取消订单
        uni.showModal({
          title: '确认取消',
          content: '确定要取消这个订单吗？',
          success: async (res) => {
            if (res.confirm) {
              try {
                await orderApi.cancelOrder({ id: this.orderData.id })
                uni.showToast({
                  title: '订单已取消',
                  icon: 'success',
                })
                // 重新加载订单详情
                this.loadOrderDetail()
              }
              catch (error) {
                console.error('取消订单失败:', error)
                uni.showToast({
                  title: '取消订单失败',
                  icon: 'none',
                })
              }
            }
          },
        })
      }
      else {
        // 其他状态跳转到退款页面
        uni.navigateTo({
          url: `/pages/order-center/cancel/index?orderId=${this.orderData.id}`,
        })
      }
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
      <uni-load-more status="loading" />
    </view>

    <!-- 主要内容 -->
    <view v-else>
      <!-- 地图区域 -->
      <view class="map-container">
        <image
          src="/static/images/fallback-image.png"
          class="map-image"
          mode="aspectFill"
        />
        <!-- 起点和终点标记 -->
        <view class="map-markers">
          <view class="marker start-marker">
            <view class="marker-icon start-icon" />
            <text class="marker-text">
              起点地
            </text>
          </view>
          <view class="marker end-marker">
            <view class="marker-icon end-icon" />
            <text class="marker-text">
              发货地址
            </text>
          </view>
        </view>
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
                收货人：
              </text>
              <text class="info-value">
                {{ orderData.takeName || orderData.memberName }}
              </text>
            </view>
            <view class="info-row">
              <text class="info-label">
                送货地址：
              </text>
              <text class="info-value">
                {{ fullDeliveryAddress }}
              </text>
            </view>
            <view class="info-row">
              <text class="info-label">
                发货地址：
              </text>
              <text class="info-value">
                {{ pickupAddress }}
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
              {{ payTypeText }}
            </text>
            <text v-if="orderData.payTime" class="payment-status">
              已支付
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
            <text class="link-text" @click="viewContract">
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
          </view>

          <view v-if="orderData.vehicleInspectionTime" class="detail-row">
            <text class="detail-label">
              验车时间：
            </text>
            <text class="detail-value">
              {{ orderData.vehicleInspectionTime }}
            </text>
            <text class="link-text" @click="viewVehicleInfo">
              验车信息
            </text>
          </view>
        </view>

        <!-- 底部占位空间，避免内容被固定按钮遮挡 -->
        <view class="bottom-placeholder" />
      </view>

      <!-- 固定底部按钮 -->
      <view class="fixed-bottom-actions">
        <!-- 取消订单按钮 - 所有状态都可以取消 -->
        <view class="action-btn cancel-btn" @click="cancelOrder">
          <text class="btn-text">
            {{ orderData.status === 0 ? '取消订单' : '申请退款' }}
          </text>
        </view>

        <!-- 修改订单按钮 - 只有待支付和待接单状态可以修改 -->
        <view
          v-if="orderData.status <= 1"
          class="action-btn edit-btn"
          @click="editOrder"
        >
          <text class="btn-text">
            修改订单
          </text>
        </view>

        <!-- 立即签署按钮 - 只有已接单待签署状态显示 -->
        <view
          v-if="orderData.status === 2"
          class="action-btn sign-btn"
          @click="signOrder"
        >
          <text class="btn-text">
            立即签署
          </text>
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

.cancel-btn {
  background-color: #f5f5f5;
  border: 1rpx solid #d9d9d9;
}

.cancel-btn .btn-text {
  color: #666666;
}

.edit-btn {
  background-color: #ffa940;
}

.edit-btn .btn-text {
  color: #ffffff;
}

.sign-btn {
  background-color: #1890ff;
}

.sign-btn .btn-text {
  color: #ffffff;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>
