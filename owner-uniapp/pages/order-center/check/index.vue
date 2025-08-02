<script>
import { orderApi } from '@/api/order'

export default {
  components: {},
  props: {},
  data() {
    return {
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
      // GPS设备信息
      gpsInfo: {
        deviceId: '13492893',
        nfcId: '13674973493493492893',
        serialNumber: '13492893',
        batteryLevel: '13492893',
      },
      // 收货照片
      deliveryPhotos: [
        '/static/images/fallback-image.png',
        '/static/images/fallback-image.png',
        '/static/images/fallback-image.png',
      ],
    }
  },
  computed: {
    // 完整的收货地址
    fullDeliveryAddress() {
      if (!this.orderData)
        return ''
      const { province, city, district, address } = this.orderData
      return `${province || ''}${city || ''}${district || ''}${address || ''}`
    },
    // 发货地址
    pickupAddress() {
      if (!this.orderData)
        return ''
      const { shippingLocationName, shippingLocationAddress } = this.orderData
      return `${shippingLocationName || ''}(${shippingLocationAddress || ''})`
    },
  },
  watch: {},
  onLoad(options) {
    this.routeParams.orderId = options.orderId
    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  created() {},
  mounted() {},
  methods: {
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
    // 预览照片
    previewImage(current) {
      uni.previewImage({
        current,
        urls: this.deliveryPhotos,
      })
    },
    // 确认收货
    async confirmDelivery() {
      if (this.pageState.submitting)
        return

      try {
        this.pageState.submitting = true

        // 调用确认收货API
        const { orderId } = this.routeParams
        const { orderNo } = this.orderData
        const { deviceId: gpsDeviceId, nfcId } = this.gpsInfo
        const { deliveryPhotos } = this

        await orderApi.confirmDelivery({
          orderId,
          orderNo,
          gpsDeviceId,
          nfcId,
          deliveryPhotos,
        })

        uni.showToast({
          title: '确认收货成功',
          icon: 'success',
          duration: 2000,
        })

        // 延迟返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }
      catch (error) {
        console.error('确认收货失败:', error)
        uni.showToast({
          title: '确认收货失败',
          icon: 'none',
        })
      }
      finally {
        this.pageState.submitting = false
      }
    },
  },
}
</script>

<template>
  <view class="flex-col page-container">
    <!-- 加载状态 -->
    <view v-if="pageState.isLoading" class="loading-container">
      <text class="loading-text">
        加载中...
      </text>
    </view>

    <!-- 主要内容 -->
    <view v-else-if="orderData" class="content-container flex-col">
      <!-- 提示信息 -->
      <view class="tip-banner">
        <text class="tip-text">
          请在司机送达后进行验收授权
        </text>
      </view>

      <!-- 待收货信息卡片 -->
      <view class="info-card delivery-card">
        <view class="card-header">
          <text class="card-title">
            待收货
          </text>
        </view>
        <view class="card-content">
          <view class="info-row">
            <text class="info-label">
              委托：
            </text>
            <text class="info-value">
              {{ orderData.takeName || orderData.memberName }}
            </text>
            <text class="phone-number">
              {{ orderData.takeMobile || orderData.memberMobile }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">
              收货地址：
            </text>
            <text class="info-value">
              {{ fullDeliveryAddress }}
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
            分装人：
          </text>
          <text class="detail-value">
            {{ orderData.deliveryName || '委托' }}
          </text>
        </view>
        <view class="detail-row">
          <text class="detail-label">
            预计有效期：
          </text>
          <text class="detail-value">
            1小时
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
        <view class="detail-row">
          <text class="detail-label">
            司机：
          </text>
          <text class="detail-value">
            {{ orderData.driverName }}
          </text>
          <view v-if="orderData.driverMobile" class="phone-icon" @click="makePhoneCall(orderData.driverMobile)">
            <image src="/static/images/icon/phone.png" class="icon-image" />
          </view>
        </view>
        <view class="detail-row">
          <text class="detail-label">
            车辆信息：
          </text>
          <text class="detail-value">
            {{ orderData.type }}，{{ orderData.carNumber }}
          </text>
        </view>
        <view class="detail-row">
          <text class="detail-label">
            车辆运输证：
          </text>
          <text class="detail-value">
            AB6666
          </text>
        </view>
        <view class="detail-row">
          <text class="detail-label">
            车辆运输证照片：
          </text>
        </view>
      </view>

      <!-- GPS设备信息 -->
      <view class="gps-section">
        <view class="section-title">
          <text class="title-text">
            GPS设备
          </text>
          <view class="status-badge active">
            <text class="status-text">
              点击确认
            </text>
          </view>
        </view>
        <view class="gps-info">
          <view class="gps-row">
            <text class="gps-label">
              GPS编号：
            </text>
            <text class="gps-value">
              {{ gpsInfo.deviceId }}
            </text>
          </view>
          <view class="gps-row">
            <text class="gps-label">
              NFC编号：
            </text>
            <text class="gps-value">
              {{ gpsInfo.nfcId }}
            </text>
          </view>
          <view class="gps-row">
            <text class="gps-label">
              一维码编号：
            </text>
            <text class="gps-value">
              {{ gpsInfo.serialNumber }}
            </text>
          </view>
          <view class="gps-row">
            <text class="gps-label">
              电量：
            </text>
            <text class="gps-value">
              {{ gpsInfo.batteryLevel }}
            </text>
          </view>
        </view>
      </view>

      <!-- 收货照片 -->
      <view class="photo-section">
        <view class="section-title">
          <text class="title-text">
            收货照片
          </text>
        </view>
        <view class="photo-grid">
          <view
            v-for="(photo, index) in deliveryPhotos"
            :key="index"
            class="photo-item"
            @click="previewImage(photo)"
          >
            <image :src="photo" class="photo-image" mode="aspectFill" />
          </view>
        </view>
      </view>

      <!-- 底部占位空间 -->
      <view class="bottom-placeholder" />
    </view>

    <!-- 固定底部按钮 -->
    <view v-if="orderData" class="fixed-bottom-actions">
      <view
        class="confirm-btn"
        :class="{ submitting: pageState.submitting }"
        @click="confirmDelivery"
      >
        <text class="btn-text">
          {{ pageState.submitting ? '确认中...' : '确认收货' }}
        </text>
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

.loading-text {
  font-size: 28rpx;
  color: #666666;
}

.content-container {
  flex: 1;
  padding: 32rpx;
  gap: 32rpx;
}

.tip-banner {
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 16rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
}

.info-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.delivery-card {
  border-left: 8rpx solid #52c41a;
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #52c41a;
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

.phone-number {
  font-size: 28rpx;
  color: #1890ff;
  margin-left: 16rpx;
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

.gps-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background-color: #f0f0f0;
}

.status-badge.active {
  background-color: #ffa940;
}

.status-text {
  font-size: 24rpx;
  color: #ffffff;
}

.gps-info {
  gap: 16rpx;
}

.gps-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.gps-row:last-child {
  border-bottom: none;
}

.gps-label {
  font-size: 28rpx;
  color: #666666;
  min-width: 160rpx;
}

.gps-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.photo-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.photo-grid {
  display: flex;
  gap: 24rpx;
  flex-wrap: wrap;
}

.photo-item {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  overflow: hidden;
  border: 2rpx solid #e5e5e5;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.bottom-placeholder {
  height: 120rpx;
}

.fixed-bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #e5e5e5;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 999;
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  background-color: #ffa940;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn.submitting {
  background-color: #d9d9d9;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>
