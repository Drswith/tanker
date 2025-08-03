<script>
import { orderApi, OrderStatusText } from '@/api/order'

const formMap = [
  { code: 'payImg', title: '支付凭证', formData: [{ label: '支付时间', value: 'payTime' }] },
  { code: 'yzFileImg', title: '平台服务合同', formData: [{ label: '签署时间', value: 'signDate' }] },
  { code: 'sjFileImg', title: '司机承运协议', formData: [{ label: '签署时间', value: 'driverSignTime' }] },
  { code: 'vehicleInspectionImg', title: '验车', formData: [{ label: '验车时间', value: 'vehicleInspectionTime' }] },
  { code: 'leadSealImg', title: '施封', formData: [{ label: '施封时间', value: 'leadSealTime' }] },
  { code: 'gpsImg', title: 'GPS安装', formData: [{ label: '安装时间', value: 'gpsTime' }], gpsFormData: [
    { label: '寄回时间', value: 'gpsReturnTime' },
    { label: '寄回快递', value: 'gpsReturnType' },
    { label: '寄回快递单号', value: 'gpsReturnOrderNo' },
  ] },
  { code: 'deliverImg', title: '送达', formData: [{ label: '送达时间', value: 'deliverTime' }] },

]

export default {
  components: {},
  props: {},
  data() {
    return {
      // 路由参数
      routeParams: {
        orderId: null,
        imgType: null,
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
    }
  },
  computed: {
    statusText() {
      return OrderStatusText[this.orderData?.status] || '未知状态'
    },

    prviewImages() {
      const images = this.orderData?.[this.routeParams.imgType]
      if (!images || images.length === 0) {
        return []
      }
      return [...images]
    },

    pageTitle() {
      return formMap.find(item => item.code === this.routeParams.imgType)?.title || '照片'
    },

    baseFormData() {
      const data = formMap.find(item => item.code === this.routeParams.imgType)?.formData || []
      // 从orderData中寻找对应的数据并返回
      return data.map(item => ({
        label: item.label,
        value: this.orderData[item.value],
      }))
    },

    gpsFormData() {
      const data = formMap.find(item => item.code === this.routeParams.imgType)?.gpsFormData || []
      // 从orderData中寻找对应的数据并返回
      return data.map(item => ({
        label: item.label,
        value: this.orderData[item.value],
      }))
    },

    // 图片标题
    imgTitle() {
      return `${this.pageTitle}照片`
    },
  },
  onLoad(options) {
    this.routeParams.orderId = options.orderId
    this.routeParams.imgType = options.imgType
    uni.setNavigationBarTitle({
      title: `${this.pageTitle}信息`,
    })
    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
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

    // 预览照片
    previewImage(current, urls) {
      uni.previewImage({
        current,
        urls,
      })
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
      <!-- 常规信息 -->
      <view class="normal-section">
        <view class="section-title">
          <text class="title-text">
            {{ pageTitle }}基本信息
          </text>
        </view>
        <view class="normal-info">
          <view v-for="(item, idx) in baseFormData" :key="idx" class="normal-row">
            <text class="normal-label">
              {{ item.label }}：
            </text>
            <text class="normal-value">
              {{ item.value }}
            </text>
          </view>
        </view>
      </view>

      <!-- 照片信息 -->
      <view class="photo-section">
        <view class="section-title">
          <text class="title-text">
            {{ imgTitle }}
          </text>
        </view>

        <view v-if="prviewImages.length > 0" class="photo-grid">
          <view
            v-for="(photo, index) in prviewImages"
            :key="index"
            class="photo-item"
            @click="previewImage(photo, prviewImages)"
          >
            <image :src="photo" class="photo-image" mode="aspectFill" />
          </view>
        </view>
        <view v-else class="photo-grid">
          <text>暂无照片信息</text>
        </view>
      </view>

      <!-- GPS寄回信息 -->
      <view v-if="routeParams.imgType === 'gpsImg'" class="normal-section">
        <view class="section-title">
          <text class="title-text">
            GPS寄回信息
          </text>
        </view>

        <view v-if="gpsFormData.length > 0" class="normal-info">
          <view v-for="(item, idx) in gpsFormData" :key="idx" class="normal-row">
            <text class="normal-label">
              {{ item.label }}：
            </text>
            <text class="normal-value">
              {{ item.value }}
            </text>
          </view>
        </view>

        <view v-else class="normal-info">
          <view class="normal-row">
            <text class="normal-label">
              暂无GPS寄回信息
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/static/css/form.scss';
.normal-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.normal-info {
  gap: 16rpx;
}

.normal-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.normal-row:last-child {
  border-bottom: none;
}

.normal-label {
  font-size: 28rpx;
  color: #666666;
  min-width: 200rpx;
}

.normal-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

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
  font-size: 28rpx;
  color: #999999;
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
