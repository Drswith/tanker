<script>
import { orderApi } from '@/api/order'

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
      orderData: null,

      // GPS设备信息
      gpsDevices: [
        {
          id: 1,
          name: '第一组GPS',
          status: 'sealed', // sealed: 已施封, verified: 核验成功, failed: 核验失败, pending: 待核验
          nfcCode: '187239739712937129893',
          qrCode: '18723973971',
          serialNumber: '39739712',
          statusText: '已施封',
          statusColor: '#fa8c16',
        },
        {
          id: 2,
          name: '第二组GPS',
          status: 'verified',
          nfcCode: '293712983123123123',
          qrCode: '973971218723',
          serialNumber: '9089000',
          statusText: '核验成功',
          statusColor: '#52c41a',
        },
      ],

      // 页面状态
      pageState: {
        isLoading: false,
        isConfirming: false,
      },

      // 确认收货弹窗状态
      confirmModal: {
        show: false,
        title: '核验信息正确，确认收货成功！',
        content: '',
      },

      // 继续确认弹窗状态
      continueModal: {
        show: false,
        title: '当前存在接验失败的铅封码，是否继续确认收货！',
        content: '',
      },
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

    // 检查是否有验证失败的设备
    hasFailedDevices() {
      return this.gpsDevices.some(device => device.status === 'failed')
    },
  },
  watch: {

  },
  onLoad(options) {
    this.routeParams.orderId = options.orderId
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
        this.orderData = response

        // 模拟加载GPS设备信息
        this.loadGpsDevices()
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

    // 加载GPS设备信息
    loadGpsDevices() {
      // 这里可以根据订单信息加载对应的GPS设备
      // 暂时使用模拟数据
    },

    // 更新位置
    updateLocation() {
      uni.showToast({
        title: '位置更新功能开发中',
        icon: 'none',
      })
    },

    // 核验GPS设备
    verifyDevice(device) {
      // 模拟核验过程
      uni.showLoading({
        title: '核验中...',
      })

      setTimeout(() => {
        uni.hideLoading()

        // 随机模拟核验结果
        const isSuccess = Math.random() > 0.3

        if (isSuccess) {
          device.status = 'verified'
          device.statusText = '核验成功'
          device.statusColor = '#52c41a'
          uni.showToast({
            title: '核验成功',
            icon: 'success',
          })
        }
        else {
          device.status = 'failed'
          device.statusText = '核验失败'
          device.statusColor = '#ff4d4f'
          uni.showToast({
            title: '核验失败',
            icon: 'error',
          })
        }
      }, 1500)
    },

    // 确认收货
    confirmReceipt() {
      if (this.hasFailedDevices) {
        // 有失败的设备，显示继续确认弹窗
        this.continueModal.show = true
      }
      else {
        // 所有设备都验证成功，显示确认弹窗
        this.confirmModal.show = true
      }
    },

    // 取消确认
    cancelConfirm() {
      this.confirmModal.show = false
      this.continueModal.show = false
    },

    // 确定确认收货
    async doConfirmReceipt() {
      try {
        this.pageState.isConfirming = true
        this.confirmModal.show = false
        this.continueModal.show = false

        // 调用确认收货API
        await orderApi.confirmReceipt({
          orderId: this.routeParams.orderId,
          gpsDevices: this.gpsDevices.map(device => ({
            id: device.id,
            status: device.status,
            nfcCode: device.nfcCode,
            qrCode: device.qrCode,
            serialNumber: device.serialNumber,
          })),
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
        this.pageState.isConfirming = false
      }
    },

    // 获取按钮文本
    getButtonText(status) {
      const textMap = {
        sealed: '核验',
        verified: '核验成功',
        failed: '核验失败',
        pending: '待核验',
      }
      return textMap[status] || '核验'
    },
  },
}
</script>

<template>
  <view class="page">
    <!-- 加载状态 -->
    <u-loading-page :loading="pageState.isLoading" loading-text="加载中..." />

    <!-- 主要内容 -->
    <view v-if="!pageState.isLoading && orderData" class="content">
      <!-- 提示信息 -->
      <view class="notice-section">
        <view class="notice-card">
          <view class="notice-text">
            在确认收货前，请您完成铅封核验！
          </view>
        </view>
      </view>

      <!-- 货物位置信息 -->
      <view class="location-section">
        <view class="section-header">
          <view class="header-title">
            确认收货
          </view>
          <view class="location-update" @click="updateLocation">
            <u-icon name="reload" size="16" color="#1890ff" />
            <text class="update-text">
              更新位置
            </text>
          </view>
        </view>

        <view class="location-info">
          <view class="location-item">
            <view class="location-label">
              收货位置：
            </view>
            <view class="location-value">
              {{ fullDeliveryAddress }}
            </view>
          </view>
          <view class="location-item">
            <view class="location-label">
              发货位置：
            </view>
            <view class="location-value">
              {{ pickupAddress }}
            </view>
          </view>
        </view>
      </view>

      <!-- GPS设备列表 -->
      <view class="gps-section">
        <view v-for="device in gpsDevices" :key="device.id" class="gps-item">
          <view class="gps-header">
            <view class="gps-title">
              {{ device.name }}
            </view>
            <view
              class="gps-status" :class="{
                'status-sealed': device.status === 'sealed',
                'status-success': device.status === 'verified',
                'status-failed': device.status === 'failed',
                'status-pending': device.status === 'pending',
              }"
            >
              {{ device.statusText }}
            </view>
          </view>

          <view class="gps-info">
            <view class="info-row">
              <view class="info-label">
                NFC编码：
              </view>
              <view class="info-value">
                {{ device.nfcCode }}
              </view>
              <view
                class="info-action"
                :class="{
                  'verify-btn': device.status === 'sealed' || device.status === 'pending',
                  'success-btn': device.status === 'verified',
                  'failed-btn': device.status === 'failed',
                }"
                @click="device.status === 'sealed' || device.status === 'pending' ? verifyDevice(device) : null"
              >
                <text class="action-text">
                  {{ getButtonText(device.status) }}
                </text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-label">
                二维码：
              </view>
              <view class="info-value">
                {{ device.qrCode }}
              </view>
              <view
                class="info-action"
                :class="{
                  'verify-btn': device.status === 'sealed' || device.status === 'pending',
                  'success-btn': device.status === 'verified',
                  'failed-btn': device.status === 'failed',
                }"
                @click="device.status === 'sealed' || device.status === 'pending' ? verifyDevice(device) : null"
              >
                <text class="action-text">
                  {{ getButtonText(device.status) }}
                </text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-label">
                编号：
              </view>
              <view class="info-value">
                {{ device.serialNumber }}
              </view>
              <view
                class="info-action"
                :class="{
                  'verify-btn': device.status === 'sealed' || device.status === 'pending',
                  'success-btn': device.status === 'verified',
                  'failed-btn': device.status === 'failed',
                }"
                @click="device.status === 'sealed' || device.status === 'pending' ? verifyDevice(device) : null"
              >
                <text class="action-text">
                  {{ getButtonText(device.status) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部确认按钮 -->
    <view v-if="!pageState.isLoading && orderData" class="bottom-section">
      <u-button
        type="warning"
        :loading="pageState.isConfirming"
        loading-text="确认中..."
        :custom-style="{
          width: '100%',
          height: '88rpx',
          fontSize: '32rpx',
          fontWeight: 'bold',
        }"
        @click="confirmReceipt"
      >
        确认收货
      </u-button>
    </view>

    <!-- 确认收货弹窗 -->
    <u-modal
      v-model="confirmModal.show"
      :title="confirmModal.title"
      :show-cancel-button="true"
      :show-confirm-button="true"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="doConfirmReceipt"
      @cancel="cancelConfirm"
    />

    <!-- 继续确认弹窗 -->
    <u-modal
      v-model="continueModal.show"
      :title="continueModal.title"
      :show-cancel-button="true"
      :show-confirm-button="true"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="doConfirmReceipt"
      @cancel="cancelConfirm"
    />
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.nav-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}

.content {
  padding: 20rpx;
}

// 提示信息区域
.notice-section {
  margin-bottom: 20rpx;

  .notice-card {
    background: #fff3cd;
    border: 2rplasslid #ffeaa7;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &.warning {
      background: #fff3cd;
      border-color: #ffeaa7;
    }

    .notice-text {
      font-size: 28rpx;
      line-height: 1.6;
      color: #856404;
      margin-bottom: 8rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 位置信息区域
.location-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .header-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }

    .location-update {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      background: #f0f9ff;
      border-radius: 20rpx;

      .update-text {
        font-size: 24rpx;
        color: #1890ff;
        margin-left: 8rpx;
      }
    }
  }

  .location-info {
    .location-item {
      display: flex;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .location-label {
        font-size: 28rpx;
        color: #666666;
        width: 160rpx;
        flex-shrink: 0;
      }

      .location-value {
        font-size: 28rpx;
        color: #333333;
        flex: 1;
        line-height: 1.4;
      }
    }
  }
}

// GPS设备区域
.gps-section {
  .gps-item {
    background: #ffffff;
    border-radius: 12rpx;
    padding: 32rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    .gps-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;

      .gps-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }

      .gps-status {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: 500;

        &.status-sealed {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.status-success {
          background: #f6ffed;
          color: #52c41a;
        }

        &.status-failed {
          background: #fff2f0;
          color: #ff4d4f;
        }

        &.status-pending {
          background: #f0f0f0;
          color: #999999;
        }
      }
    }

    .gps-info {
      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-size: 28rpx;
          color: #666666;
          width: 140rpx;
          flex-shrink: 0;
        }

        .info-value {
          font-size: 28rpx;
          color: #333333;
          flex: 1;
          margin-right: 20rpx;
        }

        .info-action {
           padding: 8rpx 16rpx;
           border-radius: 20rpx;
           cursor: pointer;
           transition: all 0.3s ease;

           &.verify-btn {
             background: #f0f9ff;

             .action-text {
               font-size: 24rpx;
               color: #1890ff;
             }

             &:active {
               background: #e6f7ff;
             }
           }

           &.success-btn {
             background: #f6ffed;

             .action-text {
               font-size: 24rpx;
               color: #52c41a;
             }
           }

           &.failed-btn {
             background: #fff2f0;

             .action-text {
               font-size: 24rpx;
               color: #ff4d4f;
             }
           }

           // 默认样式（兼容旧版本）
           .action-text {
             font-size: 24rpx;
             color: #1890ff;
           }
         }
      }
    }
  }
}

// 底部按钮区域
.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}

// 按钮样式
.verify-btn {
  background: #1890ff;
  color: #ffffff;
}

.success-btn {
  background: #52c41a;
  color: #ffffff;
}

.failed-btn {
  background: #ff4d4f;
  color: #ffffff;
}

// 响应式适配
@media screen and (max-width: 750rpx) {
  .content {
    padding: 16rpx;
  }

  .location-section,
  .gps-item {
    padding: 24rpx;
  }

  .notice-card {
    padding: 20rpx;
  }
}
</style>
