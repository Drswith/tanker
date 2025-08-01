<script>
import { orderApi } from '@/api/order'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        gpsReturnType: '', // GPS寄回快递类型
        gpsReturnOrderNo: '', // GPS寄回订单号
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

      // 表单验证规则
      rules: {
        gpsReturnType: [
          {
            required: true,
            message: '请填写快递公司名称',
            trigger: ['blur', 'change'],
          },
        ],
        gpsReturnOrderNo: [
          {
            required: true,
            message: '请填写寄回GPS设备的快递单号',
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

    // 表单验证
    validateForm() {
      console.log('验证表单数据:', this.formData)
      return this.$refs.uForm.validate()
    },

    // 提交GPS寄回信息
    async submitGpsReturn() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // 构建API请求数据 - 根据接口文档构建完整的OilOrder对象
        const gpsReturnData = {
          ...this.orderData, // 保留原有订单数据
          orderNo: this.orderData.orderNo,
          gpsReturnType: this.formData.gpsReturnType,
          gpsReturnOrderNo: this.formData.gpsReturnOrderNo,
          gpsReturnTime: new Date().toISOString(), // 当前时间作为寄回时间
        }

        await orderApi.gpsReturn(gpsReturnData)

        uni.showToast({
          title: 'GPS寄回信息提交成功',
          icon: 'success',
        })

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
        console.error('提交GPS寄回信息失败:', error)
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
      <!-- 页面标题 -->
      <view class="page-title">
        <text class="title-text">回填单号</text>
      </view>
      
      <!-- uView 表单 -->
      <u--form
        ref="uForm"
        :model="formData"
        :rules="rules"
        label-position="top"
        :label-style="{ fontSize: '32rpx', fontWeight: '600', color: '#4D4E46', marginBottom: '16rpx' }"
        error-type="toast"
      >
        <!-- 快递公司名称 -->
        <u-form-item
          prop="gpsReturnType"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                快递公司名称
              </text>
            </view>
          </template>
          <view class="input-field">
            <u--input
              v-model="formData.gpsReturnType"
              placeholder="请填写快递公司名称"
              :placeholder-style="{ color: '#999999', fontSize: '28rpx' }"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              border="none"
            />
          </view>
        </u-form-item>

        <!-- GPS寄回快递单号 -->
        <u-form-item
          prop="gpsReturnOrderNo"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                GPS设备快递单号
              </text>
            </view>
          </template>
          <view class="input-field">
            <u--input
              v-model="formData.gpsReturnOrderNo"
              placeholder="请填写寄回GPS设备的快递单号"
              :placeholder-style="{ color: '#999999', fontSize: '28rpx' }"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              border="none"
            />
          </view>
        </u-form-item>
      </u--form>

      <!-- 提交按钮 -->
      <view class="btn-container flex-col" @click="submitGpsReturn">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          提交
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';

/* ========================================
   GPS寄回页面特有样式
   ======================================== */

/* 页面标题 */
.page-title {
  text-align: center;
  padding: 40rpx 0;
  margin-bottom: 24rpx;
}

.title-text {
  color: rgba(77, 78, 70, 1);
  font-size: 36rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 50rpx;
}

/* ========================================
   uView 组件样式覆盖
   ======================================== */
</style>
