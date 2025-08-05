<script>
import { orderApi, OrderStatusText } from '@/api/order'
import StatusTag from './components/StatusTag.vue'

export default {
  components: { StatusTag },
  props: {},
  data() {
    return {
      // 路由参数
      routeParams: {
        orderId: null,
        uuid: null,
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
    // 验车照片
    vehicleInspectionImg() {
      const { vehicleInspectionImg = [] } = this.orderData || {}
      return vehicleInspectionImg
    },
    // 铅封照片
    leadSealImg() {
      const { leadSealImg = [] } = this.orderData || {}
      return leadSealImg
    },
    // GPS安装照片
    gpsImg() {
      const { gpsImg = [] } = this.orderData || {}
      return gpsImg
    },
  },
  watch: {},
  onLoad(options) {
    // 处理可能被编码的路由参数
    this.routeParams.orderId = this.decodeParam(options.orderId)
    this.routeParams.uuid = this.decodeParam(options.uuid)

    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  methods: {
    // 解码路由参数
    decodeParam(param) {
      if (!param)
        return param

      try {
        // 尝试解码参数
        const decoded = decodeURIComponent(param)
        // 如果解码后的值与原值不同，说明原来是编码的
        return decoded
      }
      catch (error) {
        // 如果解码失败，返回原值
        console.warn('参数解码失败:', param, error)
        return param
      }
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
    previewImage(current, urls) {
      uni.previewImage({
        current,
        urls,
      })
    },

    // 验证授权
    async verifyLink() {
      if (!this.routeParams.uuid) {
        uni.showToast({
          title: '请先获取验收授权链接',
          icon: 'none',
        })
        return
      }

      if (this.pageState.submitting)
        return

      try {
        this.pageState.submitting = true

        // 调用确认收货API
        const { orderId } = this.routeParams
        const { orderNo } = this.orderData

        await orderApi.verifyOrderuuid({
          id: orderId,
          orderNo,
          uuid: this.routeParams.uuid,
        })

        uni.showToast({
          title: '验收授权成功',
          icon: 'success',
          duration: 2000,
        })

        this.loadOrderDetail()
        // // 进入订单详情
        // uni.navigateTo({
        //   url: `/pages/order-center/detail/index?orderId=${orderId}`,
        // })
      }
      catch (error) {
        console.error('验收授权失败:', error)
        uni.showToast({
          title: '验收授权失败',
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
          穿石科技邀请对您该订单进行验收授权
        </text>
      </view>

      <!-- 待收货信息卡片 -->
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
            <text class="info-label">
              收货地址：
            </text>
            <text class="info-value">
              {{ orderData.address }}
            </text>
          </view>
        </view>
      </view>
      <!-- <view class="info-card delivery-card">
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
              收货地址：
            </text>
            <text class="info-value">
              {{ orderData.address }}
            </text>
          </view>
        </view>
      </view> -->

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
      </view>

      <!-- GPS设备信息 -->
      <view class="gps-section">
        <view class="section-title">
          <text class="title-text">
            GPS设备
          </text>
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
              二维码编号：
            </text>
            <text class="gps-value">
              {{ gpsInfo.serialNumber }}
            </text>
          </view>
          <view class="gps-row">
            <text class="gps-label">
              编号：
            </text>
            <text class="gps-value">
              {{ gpsInfo.batteryLevel }}
            </text>
          </view>
        </view>
      </view>

      <!-- 验车照片 -->
      <view class="photo-section">
        <view class="section-title">
          <text class="title-text">
            验车照片
          </text>
        </view>
        <view v-if="vehicleInspectionImg.length > 0" class="photo-grid">
          <view
            v-for="(photo, index) in vehicleInspectionImg"
            :key="index"
            class="photo-item"
            @click="previewImage(photo, vehicleInspectionImg)"
          >
            <image :src="photo" class="photo-image" mode="aspectFill" />
          </view>
        </view>
        <view v-else class="photo-grid">
          <text>暂无照片</text>
        </view>
      </view>
      <!-- 铅封照片 -->
      <view class="photo-section">
        <view class="section-title">
          <text class="title-text">
            铅封照片
          </text>
        </view>
        <view v-if="leadSealImg.length > 0" class="photo-grid">
          <view
            v-for="(photo, index) in leadSealImg"
            :key="index"
            class="photo-item"
            @click="previewImage(photo, leadSealImg)"
          >
            <image :src="photo" class="photo-image" mode="aspectFill" />
          </view>
        </view>
        <view v-else class="photo-grid">
          <text>暂无照片</text>
        </view>
      </view>
      <!-- GPS安装照片 -->
      <view class="photo-section">
        <view class="section-title">
          <text class="title-text">
            GPS安装照片
          </text>
        </view>
        <view v-if="gpsImg.length > 0" class="photo-grid">
          <view
            v-for="(photo, index) in gpsImg"
            :key="index"
            class="photo-item"
            @click="previewImage(photo, gpsImg)"
          >
            <image :src="photo" class="photo-image" mode="aspectFill" />
          </view>
        </view>
        <view v-else class="photo-grid">
          <text>暂无照片</text>
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
        @click="verifyLink"
      >
        <text class="btn-text">
          {{ pageState.submitting ? '验证中...' : '验收授权' }}
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
  // padding: 32rpx;
  // gap: 32rpx;
  padding-bottom: 200rpx;
}

.tip-banner {
  background-color: #FF901E;
  padding: 16rpx 32rpx;
}

.tip-text {
  font-weight: 400;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}

.info-card {
 position: relative;
  background-color: #ffffff;
  // border-radius: 16rpx;
  // padding: 32rpx;
  padding: 32rpx 32rpx 32rpx 32rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.delivery-card {
  border-left: 8rpx solid #52c41a;
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
  display: flex;
  background-color: #ffffff;
  border-top: 1rpx solid #e5e5e5;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); /* 适配安全区域 */
  z-index: 999;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
}

.confirm-btn {
  background-color: rgba(255, 158, 0, 1);
  border-radius: 24px;
  padding: 26rpx 80rpx 26rpx 80rpx;
  transition: all 0.3s ease;

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
