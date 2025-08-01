<script>
import { driverApi } from '@/api/driver'

export default {
  data() {
    return {
      // 司机详情数据
      driverDetail: {
        id: 1,
        name: '',
        phone: '',
        rating: 0,
        orderCount: 0,
        avatar: '/static/images/default-avatar.png',
        plateNumber: '',
        vehicleType: '',
        vehicleWeight: '',
        vehiclePhoto: '/static/images/fallback-image.png',
      },

      // 页面状态
      pageState: {
        isLoading: false,
        isEditMode: false,
      },

      // 路由参数
      routeParams: {
        id: null,
      },
    }
  },

  onLoad(options) {
    this.routeParams.id = options.id
    if (this.routeParams.id) {
      this.pageState.isEditMode = true
    }
    this.loadDriverDetail(this.routeParams.id)
  },

  methods: {
    // 映射司机数据
    mapDriverData(driverData) {
      this.driverDetail = {
        id: driverData.id,
        name: driverData.username || '未知',
        phone: driverData.mobile || '未知',
        rating: driverData.score || 0,
        orderCount: 0, // 接口暂无此字段，设为默认值
        avatar: driverData.avatar || '/static/images/default-avatar.png',
        plateNumber: driverData.carNumber || '未知',
        vehicleType: driverData.type || '未知',
        vehicleWeight: driverData.carLoad ? `${driverData.carLoad}吨` : '未知',
        vehiclePhoto: driverData.imgList && driverData.imgList.length > 0 ? driverData.imgList[0] : '/static/images/fallback-image.png',
        // 保留原始数据
        originalData: driverData,
      }
    },

    // 加载司机详情
    async loadDriverDetail(id) {
      try {
        this.pageState.isLoading = true
        const response = await driverApi.getDriverDetail(id)
        this.mapDriverData(response)
      }
      catch (error) {
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 预览头像
    previewAvatar() {
      if (this.driverDetail.avatar) {
        uni.previewImage({
          urls: [this.driverDetail.avatar],
          current: 0,
        })
      }
    },

    // 预览车辆照片
    previewVehiclePhoto() {
      if (this.driverDetail.vehiclePhoto) {
        uni.previewImage({
          urls: [this.driverDetail.vehiclePhoto],
          current: 0,
        })
      }
    },

    // 拨打电话
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.driverDetail.phone,
      })
    },
  },
}
</script>

<template>
  <view class="driver-detail-page">
    <!-- 司机详情内容 -->
    <view class="detail-container">
      <!-- 司机基本信息卡片 -->
      <view class="info-card">
        <!-- 司机头像和基本信息 -->
        <view class="driver-header">
          <view class="driver-avatar" @click="previewAvatar">
            <image
              class="avatar-image"
              :src="driverDetail.avatar"
              mode="aspectFill"
            />
          </view>
          <view class="driver-basic-info">
            <view class="name-row">
              <text class="driver-name">
                {{ driverDetail.name }}
              </text>
            </view>
            <view class="phone-row">
              <text class="driver-phone">
                {{ driverDetail.phone }}
              </text>
            </view>
            <view class="stats-row">
              <text class="rating-text">
                综合评分：{{ driverDetail.rating }} 分
              </text>
            </view>
            <view class="stats-row">
              <text class="order-count-text">
                接单总数：{{ driverDetail.orderCount }}单
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 车辆信息卡片 -->
      <view class="info-card">
        <view class="vehicle-info">
          <!-- 车牌号 -->
          <view class="info-row">
            <text class="info-label">
              车牌号：
            </text>
            <text class="info-value">
              {{ driverDetail.plateNumber }}
            </text>
          </view>

          <!-- 车辆类型 -->
          <view class="info-row">
            <text class="info-label">
              车辆类型：
            </text>
            <text class="info-value">
              {{ driverDetail.vehicleType }}
            </text>
          </view>

          <!-- 车辆载重 -->
          <view class="info-row">
            <text class="info-label">
              车辆载重：
            </text>
            <text class="info-value">
              {{ driverDetail.vehicleWeight }}
            </text>
          </view>

          <!-- 车辆照片 -->
          <view class="info-row">
            <text class="info-label">
              车辆照片：
            </text>
            <view class="vehicle-photo" @click="previewVehiclePhoto">
              <image
                class="photo-image"
                :src="driverDetail.vehiclePhoto"
                mode="aspectFill"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.driver-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 详情容器 */
.detail-container {
  padding: 24rpx 32rpx;
}

/* 信息卡片 */
.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 司机头部信息 */
.driver-header {
  display: flex;
  align-items: center;
}

.driver-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  margin-right: 32rpx;
  background-color: #f0f0f0;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.driver-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name-row {
  margin-bottom: 12rpx;
}

.driver-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.phone-row {
  margin-bottom: 12rpx;
}

.driver-phone {
  font-size: 32rpx;
  color: #333;
}

.stats-row {
  margin-bottom: 8rpx;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.rating-text {
  font-size: 28rpx;
  color: #FFA500;
  font-weight: 500;
}

.order-count-text {
  font-size: 28rpx;
  color: #FFA500;
  font-weight: 500;
}

/* 车辆信息 */
.vehicle-info {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
  line-height: 40rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  line-height: 40rpx;
}

/* 车辆照片 */
.vehicle-photo {
  width: 200rpx;
  height: 150rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f0f0f0;
  border: 2rpx solid #e0e0e0;
}

.photo-image {
  width: 100%;
  height: 100%;
}
</style>
