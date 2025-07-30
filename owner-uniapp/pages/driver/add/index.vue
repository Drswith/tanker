<script>
export default {
  data() {
    return {
      // 表单数据
      formData: {
        driverName: '', // 司机姓名
        phoneNumber: '', // 手机号
        vehicleType: '', // 车辆类型
        licensePlate: '', // 车牌号
      },

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
      },

      // 常量配置
      constants: {
        PHONE_REGEX: /^1[3-9]\d{9}$/, // 手机号正则
        LICENSE_PLATE_REGEX: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/, // 车牌号正则
        REQUIRED_FIELDS: ['driverName', 'phoneNumber', 'vehicleType', 'licensePlate'], // 必填字段
      },

      // 表单验证规则
      rules: {
        driverName: [
          {
            required: true,
            message: '请输入司机姓名',
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 10,
            message: '司机姓名长度为2-10位',
            trigger: ['blur', 'change'],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change'],
          },
        ],
        vehicleType: [
          {
            required: true,
            message: '请输入车辆类型',
            trigger: ['blur', 'change'],
          },
        ],
        licensePlate: [
          {
            required: true,
            message: '请输入车牌号',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/,
            message: '请输入正确的车牌号',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  methods: {
    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交新增司机
    async submitDriver() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // TODO: 调用新增司机接口
        // await this.httpApi.addDriver(this.formData);

        uni.showToast({
          title: '新增司机成功',
          icon: 'success',
        })

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
        uni.showToast({
          title: error.message || '新增失败，请重试',
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
        <!-- 司机姓名 -->
        <u-form-item
          prop="driverName"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                司机姓名
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.driverName"
              placeholder="小红"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="10"
            />
          </view>
        </u-form-item>

        <!-- 手机号 -->
        <u-form-item
          prop="phoneNumber"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                手机号
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.phoneNumber"
              placeholder="19512344321"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="11"
              type="number"
            />
          </view>
        </u-form-item>

        <!-- 车辆类型 -->
        <u-form-item
          prop="vehicleType"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                车辆类型
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.vehicleType"
              placeholder="大卡车"
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

        <!-- 车牌号 -->
        <u-form-item
          prop="licensePlate"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                车牌号
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.licensePlate"
              placeholder="浙A 666666"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="8"
            />
          </view>
        </u-form-item>
      </u--form>

      <!-- 保存按钮 -->
      <view class="btn-container flex-col" @click="submitDriver">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          保存信息
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';
</style>
