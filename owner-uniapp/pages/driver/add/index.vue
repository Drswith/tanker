<script>
import { driverApi } from '@/api/driver'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        driverName: '杨光', // 司机姓名
        phoneNumber: '13800000000', // 手机号
        vehicleType: '大货车', // 车辆类型
        licensePlate: '京A12345', // 车牌号
      },

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
        isEditMode: false, // 编辑模式
      },

      // 路由参数
      routeParams: {
        id: null,
      },

      // 原始司机数据（编辑模式下使用）
      originalDriverData: null,

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
          // {
          //   pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/,
          //   message: '请输入正确的车牌号',
          //   trigger: ['blur', 'change'],
          // },
        ],
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
    // 映射司机数据到表单
    mapDriverData(driverData) {
      this.originalDriverData = driverData
      this.formData = {
        driverName: driverData.realName || '',
        phoneNumber: driverData.mobile || '',
        vehicleType: driverData.type || '',
        licensePlate: driverData.carNumber || '',
      }
    },

    // 加载司机详情（编辑模式下使用）
    async loadDriverDetail(id) {
      try {
        this.pageState.isLoading = true
        const response = await driverApi.getDriverDetail(this.routeParams.id)
        this.mapDriverData(response)
      }
      catch (error) {
        console.error('加载司机详情失败:', error)
        uni.showToast({
          title: '加载司机信息失败',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },
    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交司机信息（新增或更新）
    async submitDriver() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // 构建API请求数据，映射表单字段到API字段
        const driverData = {
          memberUserId: 1,
          username: this.formData.driverName, // 司机姓名 -> realName
          mobile: this.formData.phoneNumber, // 手机号 -> mobile
          type: this.formData.vehicleType, // 车辆类型 -> type
          carNumber: this.formData.licensePlate, // 车牌号 -> carNumber
          // accountStatus: 0, // 默认启用状态
          // status: 1, // 默认空闲状态
          // isDel: 0, // 默认未删除
        }

        // 如果是编辑模式，需要包含原始数据的其他字段
        if (this.pageState.isEditMode && this.originalDriverData) {
          Object.assign(driverData, {
            id: this.originalDriverData.id,
            memberUserId: this.originalDriverData.memberUserId,
            avatar: this.originalDriverData.avatar,
            carLoad: this.originalDriverData.carLoad,
            imgList: this.originalDriverData.imgList,
            score: this.originalDriverData.score,
            sex: this.originalDriverData.sex,
            // creationTime: this.originalDriverData.creationTime,
            // lastModificationTime: this.originalDriverData.lastModificationTime,
            extData: this.originalDriverData.extData,
          })
        }

        // 根据模式调用不同的API
        if (this.pageState.isEditMode) {
          await driverApi.updateDriver(driverData)
        }
        else {
          await driverApi.addDriver(driverData)
        }

        uni.showToast({
          title: this.pageState.isEditMode ? '更新司机成功' : '新增司机成功',
          icon: 'success',
        })

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
        console.error(`${this.pageState.isEditMode ? '更新' : '新增'}司机失败:`, error)
        uni.showToast({
          title: error.message || `${this.pageState.isEditMode ? '更新' : '新增'}失败，请重试`,
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
          {{ pageState.isEditMode ? '更新信息' : '保存信息' }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';
</style>
