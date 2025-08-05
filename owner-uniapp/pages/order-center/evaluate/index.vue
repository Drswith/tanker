<script>
import { orderApi } from '@/api/order'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      // 司机详情数据
      driverDetail: {
        id: 1,
        name: '小红',
        phone: '19512344321',
        rating: 5.0,
        orderCount: 30,
        avatar: '/static/images/default-avatar.png',
        plateNumber: '浙A66666',
        vehicleType: '大卡车',
        vehicleWeight: '10 吨',
        vehiclePhoto: '/static/images/fallback-image.png',
      },
      // 表单数据
      formData: {
        score: 5, // 评分（1-5星）
        content: '', // 评价内容
        img: [], // 评价图片
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
        score: [
          {
            required: true,
            message: '请选择评分',
            trigger: 'change',
            type: 'number',
            min: 0.5,
          },
        ],
        content: [
          {
            required: true,
            message: '请输入评价内容',
            trigger: ['blur', 'change'],
          },
          // {
          //   min: 5,
          //   max: 200,
          //   message: '评价内容长度为5-200字',
          //   trigger: ['blur', 'change'],
          // },
        ],
      },

      // 评分选项
      rateOptions: {
        count: 5, // 星星总数
        size: '40rpx', // 星星大小
        activeColor: '#FFD100', // 激活颜色
        inactiveColor: '#E8E8E8', // 未激活颜色
        gutter: '8rpx', // 星星间距
      },
    }
  },
  computed: {
    userId() {
      return getUserId()
    },
  },
  onLoad(options) {
    this.routeParams.orderId = options.orderId
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

    // 评分变化
    onRateChange(value) {
      this.formData.score = value
    },

    // 图片上传成功
    onUploadSuccess(fileList) {
      this.formData.img = fileList.map(item => item.url || item.response?.url || item.path)
    },

    // 提交评价
    async submitEvaluate() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // 构建API请求数据
        const evaluateData = {
          orderNo: this.orderData.orderNo,
          driverId: this.orderData.driverUserId,
          userId: this.userId,
          score: this.formData.score,
          content: this.formData.content,
          img: this.formData.img,
          extData: {},
        }

        await orderApi.evaluateOrder(evaluateData)

        uni.showToast({
          title: '评价成功',
          icon: 'success',
        })

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
        console.error('提交评价失败:', error)
        uni.showToast({
          title: error.message || '评价失败，请重试',
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
                司机: {{ driverDetail.name }}
              </text>
            </view>
            <view class="phone-row">
              <text class="driver-phone">
                {{ driverDetail.phone }}
              </text>
            </view>
          </view>
        </view>
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
        <!-- 评分 -->
        <u-form-item
          prop="score"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                服务评分
              </text>
            </view>
          </template>
          <view class="rate-field flex-col">
            <u-rate
              v-model="formData.score"
              :count="rateOptions.count"
              :size="rateOptions.size"
              :active-color="rateOptions.activeColor"
              :inactive-color="rateOptions.inactiveColor"
              :gutter="rateOptions.gutter"
              allow-half
              @change="onRateChange"
            />
            <text class="rate-text">
              {{ formData.score }}分
            </text>
          </view>
        </u-form-item>

        <!-- 评价内容 -->
        <u-form-item
          prop="content"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                评价内容
              </text>
            </view>
          </template>
          <view class="textarea-field flex-col">
            <u--textarea
              v-model="formData.content"
              placeholder="请输入您对本次服务的评价..."
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
              {{ formData.content.length }}/200
            </view>
          </view>
        </u-form-item>

        <!-- 评价图片 -->
        <!-- <u-form-item
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="field-label">
                评价图片
              </text>
              <text class="optional-text">
                （选填）
              </text>
            </view>
          </template>
          <view class="upload-field flex-col">
            <u-upload
              :file-list="formData.img"
              :max-count="6"
              :max-size="5 * 1024 * 1024"
              accept="image"
              :preview-full-image="true"
              :deletable="true"
              upload-text="添加图片"
              @afterRead="onUploadSuccess"
              @delete="onUploadSuccess"
            />
            <text class="upload-tip">
              最多上传6张图片，每张不超过5MB
            </text>
          </view>
        </u-form-item> -->
      </u--form>

      <!-- 提交按钮 -->
      <view class="btn-container flex-col" @click="submitEvaluate">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          提交评价
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';
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
/* ========================================
   评分页面特有样式
   ======================================== */

/* 评分字段容器 */
.rate-field {
  background-color: #fff;
  border-radius: 16rpx;
  border: 1.5px solid rgba(238, 238, 238, 1);
  margin: 16rpx 2rpx 0 0;
  width: 100%;
  padding: 24rpx 18rpx;
  align-items: center;
}

/* 评分文字 */
.rate-text {
  color: rgba(77, 78, 70, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 40rpx;
  margin-top: 16rpx;
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

/* 上传字段容器 */
.upload-field {
  margin: 16rpx 2rpx 0 0;
  width: 100%;
}

/* 上传提示文字 */
.upload-tip {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  line-height: 34rpx;
  margin-top: 16rpx;
}

/* 选填文字 */
.optional-text {
  color: rgba(153, 153, 153, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  line-height: 44rpx;
  margin-left: 8rpx;
}

/* ========================================
   uView 组件样式覆盖
   ======================================== */
</style>
