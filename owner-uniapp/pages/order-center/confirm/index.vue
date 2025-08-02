<script>
import { authLocation, getCurrentLocationAddress } from '@/api/address'
import { orderApi, OrderStatus } from '@/api/order'

const VerifyStatusMap = Object.freeze({
  pending: {
    text: '待核验',
    tagType: 'warning',
  },
  verified: {
    text: '核验成功',
    tagType: 'success',
  },
  failed: {
    text: '核验失败',
    tagType: 'error',
  },
})

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

      // 收货地址(用户的位置)
      fullDeliveryAddress: '',

      // 订单数据
      orderData: null,

      // GPS设备信息
      gpsDevices: [
        {
          id: 1,
          nfcCode: '187239739712937129893',
          qrCode: '18723973971',
          serialNumber: '39739712',
          // 核验项核验状态
          nfcVerified: 'pending', // verified: 核验成功, failed: 核验失败, pending: 待核验
          qrVerified: 'pending',
          serialVerified: 'pending',
        },
        {
          id: 2,
          nfcCode: '293712983123123123',
          qrCode: '973971218723',
          serialNumber: '9089000',
          // 核验项核验状态
          nfcVerified: 'pending', // verified: 核验成功, failed: 核验失败, pending: 待核验
          qrVerified: 'pending',
          serialVerified: 'pending',
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

      // 编码输入弹窗状态
      codeInputModal: {
        show: false,
        title: '编码核验',
        inputValue: '',
        currentDevice: null,
        verifyType: '', // 'serial' 或 'qr'
      },
    }
  },
  computed: {
    // 发货地址(车的位置)
    pickupAddress() {
      if (!this.orderData?.current)
        return ''
      return this.orderData.current
    },

    // 检查所有铅封码的所有核验项目是否都成功
    allChecked() {
      return this.gpsDevices.every(device =>
        device.nfcVerified === 'verified'
        && device.qrVerified === 'verified'
        && device.serialVerified === 'verified',
      )
    },

  },
  async onLoad(options) {
    this.routeParams.orderId = options.orderId
    if (this.routeParams.orderId) {
      // 加载订单详情
      await this.loadOrderDetail()
      // 获取当前位置
      this.updateLocation()

      // 加载GPS设备信息
      this.loadGpsDevices(this.orderData.orderNo)
    }
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
    async loadGpsDevices(orderNo) {
      // 这里可以根据订单信息加载对应的GPS设备
      // 暂时使用模拟数据
      const res = await orderApi.getLeadSealCode({
        orderNo,
      })
      console.log('查询铅封码:', res)
    },

    // 更新位置
    async updateLocation() {
      const authorise = await authLocation()
      if (!authorise) {
        return
      }
      uni.showLoading({
        title: '定位中...',
      })
      const fullAddress = await getCurrentLocationAddress()
      uni.hideLoading()
      console.log('当前详细位置:', fullAddress)
      const { result } = fullAddress
      this.fullDeliveryAddress = result?.address || ''
    },

    // 获取核验状态文本
    getDeviceStatusText(status) {
      return VerifyStatusMap[status]?.text || '未知状态'
    },

    // 获取核验状态标签类型
    getDeviceStatusTagType(status) {
      return VerifyStatusMap[status]?.tagType || 'info'
    },

    // 核验GPS设备
    verifyDevice(device) {
      const itemList = ['NFC编码核验', '二维码核验', '编码核验']

      uni.showActionSheet({
        itemList,
        success: (res) => {
          const verifyType = itemList[res.tapIndex]
          this.performVerification(device, verifyType, res.tapIndex)
        },
        fail: (res) => {
          console.log('取消选择核验方式')
        },
      })
    },

    // 执行具体的核验操作
    performVerification(device, verifyType, typeIndex) {
      switch (typeIndex) {
        case 0: // NFC编码核验
          this.performNFCVerification(device)
          break
        case 1: // 二维码核验
          this.performQRVerification(device)
          break
        case 2: // 编码核验
          this.performSerialVerification(device)
          break
      }
    },

    // NFC编码核验
    performNFCVerification(device) {
      uni.showLoading({
        title: 'NFC编码核验中...',
      })

      // 调用uni NFC接口
      uni.startHCE({
        aid_list: ['F0010203040506'],
        success: () => {
          // 模拟NFC扫描结果
          setTimeout(() => {
            uni.hideLoading()

            // 模拟扫描到的NFC编码
            const scannedNFC = '187239739712937129893' // 模拟扫描结果

            // 与设备的NFC编码进行完全匹配
            if (scannedNFC === device.nfcCode) {
              device.nfcVerified = 'verified'
              uni.showToast({
                title: 'NFC编码核验成功',
                icon: 'success',
              })
            }
            else {
              device.nfcVerified = 'failed'
              uni.showToast({
                title: 'NFC编码核验失败',
                icon: 'error',
              })
            }
          }, 1500)
        },
        fail: (error) => {
          uni.hideLoading()
          console.error('NFC启动失败:', error)
          uni.showToast({
            title: 'NFC功能启动失败',
            icon: 'none',
          })
        },
      })
    },

    // 二维码核验
    performQRVerification(device) {
      this.codeInputModal.show = true
      this.codeInputModal.title = '二维码核验'
      this.codeInputModal.inputValue = ''
      this.codeInputModal.currentDevice = device
      this.codeInputModal.verifyType = 'qr'
    },

    // 二维码扫描
    scanQRCode() {
      uni.scanCode({
        success: (res) => {
          this.codeInputModal.inputValue = res.result
        },
        fail: (error) => {
          console.error('二维码扫描失败:', error)
          uni.showToast({
            title: '二维码扫描失败',
            icon: 'none',
          })
        },
      })
    },

    // 确认编码输入
    confirmCodeInput() {
      if (!this.codeInputModal.inputValue.trim()) {
        uni.showToast({
          title: '请输入编码',
          icon: 'none',
        })
        return
      }

      const device = this.codeInputModal.currentDevice
      const inputCode = this.codeInputModal.inputValue.trim()
      const verifyType = this.codeInputModal.verifyType

      let isSuccess = false
      let targetCode = ''
      let successMessage = ''
      let failMessage = ''

      if (verifyType === 'serial') {
        targetCode = device.serialNumber
        successMessage = '编码核验成功'
        failMessage = '编码核验失败'
        isSuccess = inputCode === targetCode
        device.serialVerified = isSuccess ? 'verified' : 'failed'
      }
      else if (verifyType === 'qr') {
        targetCode = device.qrCode
        successMessage = '二维码核验成功'
        failMessage = '二维码核验失败'
        isSuccess = inputCode === targetCode
        device.qrVerified = isSuccess ? 'verified' : 'failed'
      }
      this.codeInputModal.show = false

      uni.showToast({
        title: isSuccess ? successMessage : failMessage,
        icon: isSuccess ? 'success' : 'error',
      })
    },

    // 取消编码输入
    cancelCodeInput() {
      this.codeInputModal.show = false
      this.codeInputModal.inputValue = ''
      this.codeInputModal.currentDevice = null
      this.codeInputModal.verifyType = ''
    },

    // 编码核验
    performSerialVerification(device) {
      this.codeInputModal.show = true
      this.codeInputModal.title = '编码核验'
      this.codeInputModal.inputValue = ''
      this.codeInputModal.currentDevice = device
      this.codeInputModal.verifyType = 'serial'
    },

    // 确认收货
    confirmReceipt() {
      if (this.allChecked) {
        // 所有核验项目都成功
        uni.showModal({
          title: '确认收货',
          content: '核验信息正确，确认收货成功！',
          success: (res) => {
            if (res.confirm) {
              this.doConfirmReceipt(this.allChecked)
            }
          },
        })
      }
      else {
        // 存在核验失败的铅封码
        uni.showModal({
          title: '确认收货',
          content: '当前存在核验失败的铅封码，是否继续确认收货！',
          success: (res) => {
            if (res.confirm) {
              this.doConfirmReceipt(this.allChecked)
            }
          },
        })
      }
    },

    // 取消确认
    cancelConfirm() {
      this.confirmModal.show = false
      this.continueModal.show = false
    },

    // 确定确认收货
    async doConfirmReceipt(allChecked) {
      try {
        this.pageState.isConfirming = true
        this.confirmModal.show = false
        this.continueModal.show = false

        // 确认收货
        // status = 13 收货成功
        // status = 11 业主核验不通过
        const updateStatus = allChecked ? OrderStatus.WaitingGpsReturn : OrderStatus.OwnerRejected

        // 调用确认收货API
        await orderApi.confirmReceipt({
          id: this.orderData.id,
          orderNo: this.orderData.orderNo,
          status: updateStatus,
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
            位置信息
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
        <view v-for="(device, deviceIndex) in gpsDevices" :key="device.id" class="gps-item">
          <view class="gps-header">
            <view class="gps-title">
              {{ `铅封码 ${deviceIndex + 1}` }}
            </view>

            <view class="gps-status btn-gradient-bg" @click.stop="verifyDevice(device)">
              核验
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

              <u-tag size="mini" :text="getDeviceStatusText(device.nfcVerified)" :type="getDeviceStatusTagType(device.nfcVerified)" plain plain-fill />
            </view>
            <view class="info-row">
              <view class="info-label">
                二维码：
              </view>
              <view class="info-value">
                {{ device.qrCode }}
              </view>
              <u-tag size="mini" :text="getDeviceStatusText(device.qrVerified)" :type="getDeviceStatusTagType(device.qrVerified)" plain plain-fill />
            </view>
            <view class="info-row">
              <view class="info-label">
                编码：
              </view>
              <view class="info-value">
                {{ device.serialNumber }}
              </view>

              <u-tag size="mini" :text="getDeviceStatusText(device.serialVerified)" :type="getDeviceStatusTagType(device.serialVerified)" plain plain-fill />
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

    <!-- 编码输入弹窗 -->
    <u-modal
      :show="codeInputModal.show"
      :title="codeInputModal.title"
      :show-cancel-button="true"
      :show-confirm-button="true"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmCodeInput"
      @cancel="cancelCodeInput"
    >
      <view class="code-input-content flex-row align-center ">
        <view class="input-section">
          <u-input
            v-model="codeInputModal.inputValue"
            :placeholder="codeInputModal.verifyType === 'serial' ? '请输入编码' : '请输入二维码或点击扫描'"
            :clearable="true"
          />
        </view>
        <view v-if="codeInputModal.verifyType === 'qr'" class="scan-section">
          <image
            src="/static/images/icon/qr-scan.svg"
            mode="aspectFit"
            style="width: 100%; height: 100%;"
          />
          <!-- <u-button
            type="primary"
            size="small"
            @click="scanQRCode"
          >
            扫描二维码
          </u-button> -->
        </view>
      </view>
    </u-modal>
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
        width: 144rpx;
        height: 56rpx;
        border-radius: 48rpx;
        padding: 8rpx 32rpx;
        font-size: 24rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;

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
          font-size: 26rpx;
          color: #666666;
          width: 140rpx;
          flex-shrink: 0;
        }

        .info-value {
          font-size: 26rpx;
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

.btn-gradient-bg {
  color: #ffffff;
  background: linear-gradient( 326deg, #FFD100 0%, #FFA500 100%);
}
.code-input-content {
  flex: 1;
}

.input-section {
  flex: 1;
}

.scan-section {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 72rpx;
  color: red;
  margin-left: 16rpx;

}
</style>
