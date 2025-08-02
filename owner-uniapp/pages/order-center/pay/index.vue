<script>
import { orderApi } from '@/api/order.js'
import { payApi, PayType } from '@/api/pay.js'
import { request } from '@/utils/http'

export default {
  data() {
    return {
      selectedPayMethod: 'wechat', // wechat, alipay_qr, alipay_account, bank
      payMethods: [
        {
          id: 'wechat',
          name: '微信支付',
          icon: '/static/images/icon/wxpay.svg',
          selected: true,
        },
        {
          id: 'alipay_qr',
          name: '支付宝扫码',
          icon: '/static/images/icon/alipay.svg',
          selected: false,
        },
        {
          id: 'alipay_account',
          name: '支付宝转账',
          icon: '/static/images/icon/alipay.svg',
          selected: false,
        },
        {
          id: 'bank',
          name: '银行卡支付',
          icon: '/static/images/icon/unionpay.svg',
          selected: false,
        },
      ],
      showQRCode: false,
      qrCodeData: '',
      orderInfo: {
        orderNo: '',
        price: null,
        bankAccount: '', // 银行收款账号
        bankName: '',
        alipayAccount: '',
      },
      voucherFileList: [], // 使用u-upload组件的文件列表
      uploadedVoucher: null, // 上传的支付凭证

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
    // 是否需要显示上传凭证区域
    needUploadVoucher() {
      return this.selectedPayMethod !== 'wechat'
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
          this.orderInfo.price = Number(response.price)
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
      console.log('选择支付方式:', methodId)
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
      }
      else {
        this.showQRCode = false
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
    async afterReadVoucher(event) {
      const { file } = event
      console.log('支付凭证上传:', file)

      // 验证文件
      if (!file) {
        uni.showToast({
          title: '未选择文件',
          icon: 'none',
        })
        return
      }

      try {
        // 使用file.path或file.url作为文件路径，优先使用path
        const filePath = file.path || file.url

        if (!filePath) {
          throw new Error('无法获取文件路径')
        }

        // 显示上传中状态
        uni.showLoading({
          title: '上传中...',
          mask: true,
        })

        const res = await request.upload('/api/upload/file', filePath)
        console.log('上传成功:', res)

        this.voucherFileList = [file]
        this.uploadedVoucher = res // request.upload已经返回data.data

        uni.hideLoading()
        uni.showToast({
          title: '支付凭证上传成功',
          icon: 'success',
        })
      }
      catch (error) {
        console.error('上传失败:', error)
        uni.hideLoading()

        // 上传失败时清空文件列表
        this.voucherFileList = []
        this.uploadedVoucher = null

        uni.showToast({
          title: '上传失败，请重试',
          icon: 'none',
        })
      }
    },

    // u-upload组件删除文件的回调
    deleteVoucher(event) {
      this.voucherFileList = []
      this.uploadedVoucher = null

      uni.showToast({
        title: '凭证已删除',
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

    // 微信支付
    async wxPay() {
      const response = await payApi.wxPay({
        id: this.orderData.orderId,
        orderNo: this.orderData.orderNo,
        userId: 1,
      })
      console.log('微信支付:', response)
    },

    // 轮询微信支付结果
    pollWechatPayResult() {
      // 返回promise, 超时时间 60秒， 2秒轮询一次wxPayCallback
      return new Promise((resolve, reject) => {
        const pollInterval = setInterval(
          async () => {
            const response = await payApi.wxPayCallback({
              orderNo: this.orderData.orderNo,
            })
            console.log('轮询微信支付回调:', response)
            if (response.code === 200) {
              clearInterval(pollInterval)
              resolve(response)
            }
          },
          2000,
        )

        // 超时时间 60秒
        setTimeout(() => {
          clearInterval(pollInterval)
          reject(new Error('轮询超时'))
        }, 60000)
      })
    },

    // 确认支付 - 微信
    async confirmWechatPayment() {
      uni.showLoading({
        title: '支付中...',
      })

      // 订单对象，从服务器获取
      let orderInfo = {
        appid: 'wx499********7c70e', // 应用ID（AppID）
        partnerid: '148*****52', // 商户号（PartnerID）
        prepayid: 'wx202254********************fbe90000', // 预支付交易会话ID
        package: 'Sign=WXPay', // 固定值
        noncestr: 'c5sEwbaNPiXAF3iv', // 随机字符串
        timestamp: 1597935292, // 时间戳（单位：秒）
        sign: 'A842B45937F6EFF60DEC7A2EAA52D5A0', // 签名，这里用的 MD5 签名
      }

      uni.getProvider({
        service: 'payment',
        success(res) {
          console.log('获取支付服务提供方:', res.provider)
          if (~res.provider.indexOf('wxpay')) {
            uni.requestPayment({
              provider: 'wxpay', // 固定值为"wxpay"
              orderInfo,
              success(res) {
                let rawdata = JSON.parse(res.rawdata)
                console.log('支付成功')
              },
              fail(err) {
                console.log(`支付失败:${JSON.stringify(err)}`)
                // uni.hideLoading()
                uni.showToast({
                  title: '支付失败',
                  duration: 2000,
                  icon: 'error',
                })
              },
            })
          }
        },
      })

      // wx.requestPayment({
      //   timeStamp: '',
      //   nonceStr: '',
      //   package: '',
      //   signType: 'MD5',
      //   paySign: '',
      //   success(res) { },
      //   fail(res) { },
      // })

      // // 模拟支付处理
      // setTimeout(() => {
      //   uni.hideLoading()
      //   uni.showToast({
      //     title: '支付成功',
      //     icon: 'success',
      //   })

      //   setTimeout(() => {
      //     uni.navigateBack()
      //   }, 1500)
      // }, 2000)
    },

    // 确认转账 - 支付宝二维码/支付宝账号/银行卡
    confirmTransfer() {
      if (!this.uploadedVoucher) {
        uni.showToast({
          title: '请先上传支付凭证',
          icon: 'none',
        })
        return
      }

      // 验证上传的凭证是否为有效的URL
      if (typeof this.uploadedVoucher !== 'string' || !this.uploadedVoucher.trim()) {
        uni.showToast({
          title: '支付凭证无效，请重新上传',
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
    async processTransfer() {
      if (this.selectedPayMethod === 'wechat') {
        uni.showToast({
          title: '微信支付请使用微信接口',
          icon: 'none',
        })
        return
      }
      try {
        uni.showLoading({
          title: '提交中...',
        })

        // 构建提交数据
        const submitData = {
          id: this.orderData.id,
          orderNo: this.orderData.orderNo,
          payType: this.selectedPayMethod === 'bank' ? PayType.BANK : PayType.ALIPAY, // 只有支付宝和银行支付调用这个函数
          payImg: [this.uploadedVoucher], // 上传的支付凭证URL
          price: this.orderInfo.price,
        }

        console.log('提交转账凭证:', submitData)

        // 提交支付凭证的API
        await payApi.otherPay(submitData)

        uni.hideLoading()
        uni.showToast({
          title: '提交成功，等待审核',
          icon: 'success',
        })

        setTimeout(() => {
          // 订单详情
          uni.navigateTo({
            url: `/pages/order-center/order-detail/index?orderId=${this.orderData.id}`,
          })
        }, 1500)
      }
      catch (error) {
        console.error('提交转账凭证失败:', error)
        uni.hideLoading()
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none',
        })
      }
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
      // 微信支付调用微信支付接口
      if (this.selectedPayMethod === 'wechat') {
        this.confirmWechatPayment()
        return
      }

      // 其他支付上传凭证
      this.confirmTransfer()
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
        ¥{{ orderInfo.price === null ? 'error' : orderInfo.price }}
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
          <image :src="method.icon" class="method-icon" />
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
            复制
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
            复制
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
            复制
          </text>
        </view>
      </view>
    </view>

    <!-- 上传支付凭证区域 -->
    <view v-if="needUploadVoucher" class="upload-section">
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
              +
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
      <text v-if="needUploadVoucher" class="warning-text">
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
        width: 40rpx;
        height: 40rpx;
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
        color: #ff6b35;
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
