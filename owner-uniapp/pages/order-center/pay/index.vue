<script>
import { orderApi } from '@/api/order.js'
import { payApi, PayType } from '@/api/pay.js'

export default {
  data() {
    return {
      payAmount: null,
      selectedPayMethod: 'wechat', // wechat, alipay_qr, alipay_account, bank
      payMethods: [
        {
          id: 'wechat',
          name: '微信支付',
          icon: '💚',
          selected: true,
        },
        {
          id: 'alipay_qr',
          name: '支付宝扫码',
          icon: '🔵',
          selected: false,
        },
        {
          id: 'alipay_account',
          name: '支付宝转账',
          icon: '🔵',
          selected: false,
        },
        {
          id: 'bank',
          name: '银行卡支付',
          icon: '🟡',
          selected: false,
        },
      ],
      showQRCode: false,
      qrCodeData: '',
      orderInfo: {
        orderNo: '',
        bankAccount: '', // 银行收款账号
        bankName: '',
        alipayAccount: '',
      },
      voucherFileList: [], // 使用u-upload组件的文件列表
      uploadedVoucher: null, // 上传的支付凭证
      showUploadSection: false, // 是否显示上传凭证区域

      // 路由参数
      routeParams: {
        orderId: null,
      },

      // 订单详情数据
      orderData: {},

      // 页面状态
      pageState: {
        isLoading: false,
      },
    }
  },
  onLoad(options) {
    // 从路由参数获取订单ID
    if (options.orderId) {
      this.routeParams.orderId = options.orderId
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  computed: {
    // 计算底部按钮文案
    confirmButtonText() {
      switch (this.selectedPayMethod) {
        case 'wechat':
          return '确认支付'
        case 'alipay_qr':
          return '确认支付'
        case 'alipay_account':
          return '确认转账'
        case 'bank':
          return '确认转账'
        default:
          return '确认支付'
      }
    },
  },
  onShow() {
    // 页面显示时获取支付配置信息
    this.getPayConfig()
  },
  methods: {
    // 加载订单详情
    async loadOrderDetail() {
      try {
        this.pageState.isLoading = true
        const response = await orderApi.getOrderDetail(this.routeParams.orderId)
        this.orderData = response

        if (!response.price && response.price !== 0) {
          throw new Error('订单金额不存在')
        }
        if (!response.orderNo) {
          throw new Error('订单号不存在')
        }

        // 根据订单详情设置支付金额
        if (response.price) {
          this.payAmount = Number(response.price)
        }

        // 设置订单号
        if (response.orderNo) {
          this.orderInfo.orderNo = response.orderNo
        }

        // 获取支付配置信息
        await this.getPayConfig()
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

    // 选择支付方式
    async selectPayMethod(methodId) {
      this.selectedPayMethod = methodId
      this.payMethods.forEach((method) => {
        method.selected = method.id === methodId
      })

      if (methodId !== 'wechat') {
        // 每次选择支付方式都获取支付配置确保数据最新
        await this.getPayConfig()
      }

      // 根据支付方式显示不同内容
      if (methodId === 'alipay_qr') {
        this.showQRCode = true
        this.showUploadSection = true
      }
      else if (methodId === 'alipay_account' || methodId === 'bank') {
        this.showQRCode = false
        this.showUploadSection = true
      }
      else {
        this.showQRCode = false
        this.showUploadSection = false
      }
    },

    // 获取支付配置信息
    async getPayConfig() {
      try {
        const response = await payApi.getPayConfig(this.routeParams.orderId)
        console.log('支付配置信息:', response)
        /**
         * 支付配置信息结构
         * bankAccount: "6666666"
         * bankName: "工商银行"
         * zfbAccount: "188888882"
         * zfbQrcode: "https://windfarmomems.oss-cn-beijing.aliyuncs.com/windfarmomems/c
         */

        // 对接支付配置数据到页面字段
        if (response) {
          // 银行转账信息
          if (response.bankAccount) {
            this.orderInfo.bankAccount = response.bankAccount // 银行收款账号
          }
          if (response.bankName) {
            this.orderInfo.bankName = response.bankName // 银行名称
          }

          // 支付宝转账信息
          if (response.zfbAccount) {
            this.orderInfo.alipayAccount = response.zfbAccount // 支付宝账号
          }

          // 支付宝二维码
          if (response.zfbQrcode) {
            this.qrCodeData = response.zfbQrcode // 支付宝二维码链接
          }
        }
      }
      catch (error) {
        console.error('获取支付配置失败:', error)
        uni.showToast({
          title: '获取支付配置失败',
          icon: 'none',
        })
      }
    },

    // u-upload组件读取文件后的回调
    afterReadVoucher(event) {
      const { file } = event
      this.voucherFileList = [file]
      this.uploadedVoucher = file.url

      uni.showToast({
        title: '凭证上传成功',
        icon: 'success',
      })
    },

    // u-upload组件删除文件的回调
    deleteVoucher(event) {
      this.voucherFileList = []
      this.uploadedVoucher = null

      uni.showToast({
        title: '已删除',
        icon: 'success',
      })
    },

    // 复制账号信息
    copyText(text, type) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: `${type}已复制`,
            icon: 'success',
          })
        },
      })
    },

    // 确认支付 - 微信/支付宝扫码
    confirmQRPayment() {
      uni.showLoading({
        title: '支付中...',
      })

      // 模拟支付处理
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '支付成功',
          icon: 'success',
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 2000)
    },

    // 确认转账 - 支付宝账号/银行卡
    confirmTransfer() {
      if (!this.uploadedVoucher) {
        uni.showToast({
          title: '请先上传支付凭证',
          icon: 'none',
        })
        return
      }

      uni.showModal({
        title: '确认提交',
        content: '确认已完成转账并提交支付凭证？',
        success: (res) => {
          if (res.confirm) {
            this.processTransfer()
          }
        },
      })
    },

    // 处理转账提交
    processTransfer() {
      uni.showLoading({
        title: '提交中...',
      })

      // 模拟提交处理
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '提交成功，等待审核',
          icon: 'success',
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 2000)
    },

    // 银行卡支付提示
    showBankPaymentTip() {
      uni.showModal({
        title: '银行转账说明',
        content: '请按照页面显示的收款信息进行银行转账，完成后上传转账凭证',
        showCancel: false,
      })
    },

    // 主确认按钮点击事件
    confirmPayment() {
      switch (this.selectedPayMethod) {
        case 'wechat':
        case 'alipay_qr':
          this.confirmQRPayment()
          break
        case 'alipay_account':
        case 'bank':
          this.confirmTransfer()
          break
        default:
          this.confirmQRPayment()
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <view class="pay-page">
    <!-- 支付金额区域 -->
    <view class="amount-section">
      <text class="amount-label">
        请尽快支付本次服务费用
      </text>
      <text class="amount-value">
        ¥{{ payAmount === null ? 'error' : payAmount }}
      </text>
    </view>
    <!-- 支付方式选择 -->
    <view class="payment-methods">
      <view
        v-for="method in payMethods"
        :key="method.id"
        class="payment-method-item"
        :class="{ selected: method.id === selectedPayMethod }"
        @click="selectPayMethod(method.id)"
      >
        <view class="method-info">
          <text class="method-icon">
            {{ method.icon }}
          </text>
          <text class="method-name">
            {{ method.name }}
          </text>
        </view>
        <view class="method-selector">
          <view class="radio-btn" :class="{ checked: method.id === selectedPayMethod }">
            <text v-if="method.id === selectedPayMethod" class="check-mark">
              ✓
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 二维码区域 -->
    <view v-if="showQRCode" class="qr-code-section">
      <view class="qr-code-container">
        <view class="qr-code-placeholder">
          <image v-if="qrCodeData && qrCodeData.startsWith('http')" :src="qrCodeData" class="qr-code-image" mode="aspectFit" />
          <view v-else class="qr-grid">
            <view v-for="i in 25" :key="i" class="qr-dot" :class="{ filled: Math.random() > 0.3 }" />
          </view>
        </view>
        <text class="qr-code-tip">
          请使用{{ selectedPayMethod === 'wechat' ? '微信' : '支付宝' }}扫码支付
        </text>
      </view>
    </view>

    <!-- 支付宝账号转账信息 -->
    <view v-if="selectedPayMethod === 'alipay_account'" class="account-info-section">
      <view class="section-title">
        <text class="title-text">
          支付宝转账信息
        </text>
      </view>
      <view class="account-info-item">
        <text class="account-label">
          收款账号：
        </text>
        <text class="account-value">
          {{ orderInfo.alipayAccount }}
        </text>
        <view class="copy-btn" @click="copyText(orderInfo.alipayAccount, '账号')">
          <text class="copy-icon">
            📋
          </text>
        </view>
      </view>
      <view class="transfer-tip">
        <text class="tip-text">
          请使用支付宝转账到以上账号，完成后上传转账截图
        </text>
      </view>
    </view>

    <!-- 银行转账信息区域 -->
    <view v-if="selectedPayMethod === 'bank'" class="bank-info-section">
      <view class="section-title">
        <text class="title-text">
          银行转账信息
        </text>
        <view class="help-btn" @click="showBankPaymentTip">
          <text class="help-icon">
            ❓
          </text>
        </view>
      </view>
      <view class="bank-info-item">
        <text class="bank-label">
          收款账号：
        </text>
        <text class="bank-value">
          {{ orderInfo.bankAccount }}
        </text>
        <view class="copy-btn" @click="copyText(orderInfo.bankAccount, '账号')">
          <text class="copy-icon">
            📋
          </text>
        </view>
      </view>
      <view class="bank-info-item">
        <text class="bank-label">
          开户行：
        </text>
        <text class="bank-value">
          {{ orderInfo.bankName }}
        </text>
        <view class="copy-btn" @click="copyText(orderInfo.bankName, '开户行')">
          <text class="copy-icon">
            📋
          </text>
        </view>
      </view>
    </view>

    <!-- 上传支付凭证区域 -->
    <view v-if="showUploadSection" class="upload-section">
      <view class="section-title">
        <text class="title-text">
          上传支付凭证
        </text>
        <text class="required-mark">
          *
        </text>
      </view>

      <u-upload
        ref="voucherUpload"
        :file-list="voucherFileList"
        :max-count="1"
        accept="image"
        width="200"
        height="200"
        @afterRead="afterReadVoucher"
        @delete="deleteVoucher"
      >
        <view class="upload-area">
          <view class="upload-placeholder">
            <text class="upload-icon">
              📷
            </text>
            <text class="upload-text">
              点击上传转账截图
            </text>
            <text class="upload-tip">
              支持jpg、png格式
            </text>
          </view>
        </view>
      </u-upload>
    </view>

    <!-- 提示信息 -->
    <view class="warning-section">
      <text class="warning-text">
        支付可能需要几分钟时间，请勿重复支付
      </text>
      <text class="warning-text">
        支付过程中请勿关闭页面或退出应用
      </text>
      <text v-if="showUploadSection" class="warning-text">
        转账完成后请及时上传支付凭证，以便快速确认到账
      </text>
    </view>

    <!-- 确认支付按钮 -->
    <view class="confirm-section">
      <button class="confirm-btn" @click="confirmPayment">
        {{ confirmButtonText }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.pay-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.amount-section {
  background-color: #fff;
  padding: 60rpx 32rpx;
  text-align: center;
  margin-bottom: 20rpx;

  .amount-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .amount-value {
    display: block;
    font-size: 72rpx;
    font-weight: bold;
    color: #ff6b35;
  }
}

.payment-methods {
  background-color: #fff;
  margin-bottom: 20rpx;

  .payment-method-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &.selected {
      background-color: #f8f9ff;
    }

    .method-info {
      display: flex;
      align-items: center;

      .method-icon {
        font-size: 40rpx;
        margin-right: 24rpx;
      }

      .method-name {
        font-size: 32rpx;
        color: #333;
      }
    }

    .method-selector {
      .radio-btn {
        width: 40rpx;
        height: 40rpx;
        border: 2rpx solid #ddd;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.checked {
          border-color: #ff6b35;
          background-color: #ff6b35;

          .check-mark {
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
          }
        }
      }
    }
  }
}

.qr-code-section {
  background-color: #fff;
  padding: 60rpx 32rpx;
  margin-bottom: 20rpx;

  .qr-code-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qr-code-placeholder {
      width: 300rpx;
      height: 300rpx;
      border: 2rpx solid #ddd;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32rpx;
      background-color: #fafafa;

      .qr-code-image {
        width: 280rpx;
        height: 280rpx;
        border-radius: 8rpx;
      }

      .qr-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8rpx;
        width: 200rpx;
        height: 200rpx;

        .qr-dot {
          width: 100%;
          height: 100%;
          background-color: #eee;
          border-radius: 2rpx;

          &.filled {
            background-color: #333;
          }
        }
      }
    }

    .qr-code-tip {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.account-info-section,
.bank-info-section {
  background-color: #fff;
  margin-bottom: 20rpx;

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 32rpx 16rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .title-text {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }

    .help-btn {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .help-icon {
        font-size: 28rpx;
        color: #999;
      }
    }
  }

  .account-info-item,
  .bank-info-item {
    display: flex;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .account-label,
    .bank-label {
      font-size: 28rpx;
      color: #666;
      width: 140rpx;
    }

    .account-value,
    .bank-value {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .copy-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .copy-icon {
        font-size: 32rpx;
        color: #666;
      }
    }
  }

  .transfer-tip {
    padding: 24rpx 32rpx;
    background-color: #f8f9fa;

    .tip-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}

.upload-section {
  background-color: #fff;
  margin-bottom: 20rpx;

  .section-title {
    display: flex;
    align-items: center;
    padding: 32rpx 32rpx 16rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .title-text {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }

    .required-mark {
      font-size: 32rpx;
      color: #ff4757;
      margin-left: 8rpx;
    }
  }

  .upload-area {
    padding: 32rpx;

    .upload-placeholder {
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      padding: 60rpx 32rpx;
      text-align: center;
      background-color: #fafafa;

      .upload-icon {
        display: block;
        font-size: 64rpx;
        margin-bottom: 16rpx;
      }

      .upload-text {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 8rpx;
      }

      .upload-tip {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  // u-upload组件自定义样式
  :deep(.u-upload) {
    .u-upload__wrap {
      margin-right: 0;
    }

    .u-upload__deletable {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
  }
}

.warning-section {
  background-color: #fff3cd;
  padding: 32rpx;
  margin-bottom: 20rpx;
  border-left: 8rpx solid #ffc107;

  .warning-text {
    display: block;
    font-size: 26rpx;
    color: #856404;
    line-height: 1.5;
    margin-bottom: 8rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.confirm-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 32rpx;
  border-top: 1rpx solid #eee;

  .confirm-btn {
    width: 100%;
    height: 88rpx;
    background-color: #ff6b35;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
