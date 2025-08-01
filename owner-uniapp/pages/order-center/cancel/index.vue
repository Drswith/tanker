<script>
import { orderApi } from '@/api/order'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        refundType: 0, // 退款类型：0-微信, 1-支付宝, 2-银行卡
        refundAccount: '', // 具体账号
        cancelReason: '', // 取消原因
      },

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
      },

      // 路由参数
      routeParams: {
        orderId: null,
      },

      // 订单数据
      orderData: null,

      // 退款类型选项
      refundTypeOptions: [
        { label: '微信', value: 0 },
        { label: '支付宝', value: 1 },
        { label: '银行卡', value: 2 },
      ],

      // 表单验证规则
      rules: {
        refundAccount: [
          {
            required: true,
            message: '请填写具体账号',
            trigger: ['blur', 'change'],
          },
        ],
        cancelReason: [
          {
            required: true,
            message: '请填写取消原因',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  onLoad(options) {
    this.routeParams.orderId = options.id
    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },

  computed: {
    // 获取当前选中的退款类型标签
    currentRefundTypeLabel() {
      const option = this.refundTypeOptions.find(item => item.value === this.formData.refundType)
      return option ? option.label : ''
    },

    // 根据退款类型获取占位符文本
    accountPlaceholder() {
      switch (this.formData.refundType) {
        case 0:
          return '请输入微信号'
        case 1:
          return '请输入支付宝账号'
        case 2:
          return '请输入银行卡号'
        default:
          return '请输入账号'
      }
    },
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

    // 选择退款类型
    selectRefundType(type) {
      this.formData.refundType = type
      // 切换退款类型时清空账号
      this.formData.refundAccount = ''
    },

    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交退款申请
    async submitRefund() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // 构建API请求数据
        const refundData = {
          orderNo: this.orderData.orderNo,
          refundType: this.formData.refundType,
          refundAccount: this.formData.refundAccount,
          cancelReason: this.formData.cancelReason,
        }

        // 调用取消订单API
        const res = await orderApi.cancelOrder(refundData)

        if (res.code === 200) {
          uni.showToast({
            title: '退款申请提交成功',
            icon: 'success',
          })

          // 延迟返回上一页
          setTimeout(() => {
            this.navigateBack()
          }, 1500)
        }
      }
      catch (error) {
        console.error('提交退款申请失败:', error)
        uni.showToast({
          title: error.message || '提交失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
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
  <view class="flex-col">
    <view class="form-container flex-col">
      <!-- uView 表单 -->
      <u--form
        ref="uForm"
        :model="formData"
        :rules="rules"
        label-position="top"
        :label-style="{ fontSize: '32rpx', fontWeight: '600', color: '#4D4E46', marginBottom: '16rpx' }"
        error-type="toast"
      >
        <!-- 退款类型 -->
        <u-form-item
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label">
              退款类型：
            </view>
          </template>
          <view class="account-type-field flex-col">
            <view class="radio-group">
              <view
                v-for="option in refundTypeOptions"
                :key="option.value"
                class="radio-item"
                @click="selectRefundType(option.value)"
              >
                <view
                  class="radio-circle"
                  :class="{ active: formData.refundType === option.value }"
                />
                <text class="radio-label">
                  {{ option.label }}
                </text>
              </view>
            </view>
          </view>
        </u-form-item>

        <!-- 具体账号 -->
        <u-form-item
          prop="refundAccount"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label">
              请填写具体账号：
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.refundAccount"
              :placeholder="accountPlaceholder"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
            />
          </view>
        </u-form-item>

        <!-- 取消原因 -->
        <u-form-item
          prop="cancelReason"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label">
              取消原因：
            </view>
          </template>
          <view class="textarea-field flex-col">
            <u--textarea
              v-model="formData.cancelReason"
              placeholder="请详细说明取消订单的原因..."
              :placeholder-style="{ color: '#999999', fontSize: '28rpx' }"
              :maxlength="200"
              :show-confirm-bar="false"
              :auto-height="true"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
                minHeight: '120rpx',
              }"
            />
            <view class="char-count">
              {{ formData.cancelReason.length }}/200
            </view>
          </view>
        </u-form-item>
      </u--form>

      <!-- 确认取消按钮 -->
      <view class="btn-container flex-col" @click="submitRefund">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          确认取消
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';

/* 页面标题 */
.page-title {
  color: rgba(77, 78, 70, 1);
  font-size: 36rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 50rpx;
  margin-bottom: 48rpx;
  text-align: center;
}

/* 账户类型字段容器 */
.account-type-field {
  margin: 16rpx 2rpx 0 0;
  width: 100%;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  align-items: center;
  gap: 48rpx;
}

/* 单选按钮项 */
.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 单选按钮圆圈 */
.radio-circle {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #CCCCCC;
  border-radius: 50%;
  margin-right: 16rpx;
  position: relative;
  transition: all 0.2s ease;

  &.active {
    border-color: #007AFF;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16rpx;
      height: 16rpx;
      background-color: #007AFF;
      border-radius: 50%;
    }
  }
}

/* 单选按钮标签 */
.radio-label {
  color: rgba(77, 78, 70, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  line-height: 40rpx;
}

/* 文本域字段容器 */
.textarea-field {
  background-color: #fff;
  border-radius: 16rpx;
  border: 1.5px solid rgba(238, 238, 238, 1);
  margin: 16rpx 2rpx 0 0;
  width: 100%;
  padding: 12rpx 18rpx;
}

/* 字符计数 */
.char-count {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  line-height: 34rpx;
  text-align: right;
  margin-top: 8rpx;
}

/* 字段标签样式覆盖 */
.field-label {
  color: rgba(77, 78, 70, 1);
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 44rpx;
}
</style>
