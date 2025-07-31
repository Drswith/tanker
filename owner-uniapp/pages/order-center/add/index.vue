<script>
export default {
  data() {
    return {
      // 表单数据
      formData: {
        name: '张三',
        phone: '12345678909',
        isDefault: true,
        address: '浙江省杭州市滨江区奥体中心旁边',
        quantity: 200,
        unit: '吨',
        originCity: '杭州',
        driverName: '200',
        driverPhone: '12345678909',
        plateNumber: '浙A 66666',
        vehicleType: '大卡车',
        totalCost: 675.0,
      },
      rules: {},
    }
  },
  methods: {
    // 确认下单
    confirmOrder() {
      // TODO: 实现下单逻辑
      console.log('确认下单', this.formData)
    },

    // 选择收货地址
    selectDeliveryAddress() {
      // TODO: 跳转到地址选择页面
    },

    // 选择发货地址
    selectOriginAddress() {
      // TODO: 跳转到发货地址选择页面
    },
  },
}
</script>

<template>
  <view class="order-create-page flex-col">
    <!-- uView 表单 -->
    <u--form
      ref="uForm"
      :model="formData"
      :rules="rules"
      label-position="top"
      :label-style="{ fontSize: '32rpx', fontWeight: '600', color: '#4D4E46', marginBottom: '16rpx' }"
      error-type="toast"
    >
      <!-- 收货地址卡片 -->
      <view class="delivery-address-card flex-row justify-between" @click="selectDeliveryAddress">
        <view class="address-info flex-col">
          <!-- 姓名和电话 -->
          <view class="contact-info flex-row justify-between">
            <text class="contact-name">
              {{ formData.name }}
            </text>
            <text class="contact-phone">
              {{ formData.phone }}
            </text>
          </view>
          <!-- 地址信息 -->
          <view class="address-detail">
            <text v-if="formData.isDefault" class="address-tag">
              【默认】
            </text>
            <text class="address-text">
              {{ formData.address }}
            </text>
          </view>
        </view>
        <image
          class="address-arrow-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng76cc6f48137f27a5e7f7db5848dc067ef9b97fb2c2f1c28097636c89e774521f"
        />
      </view>

      <!-- 货物信息卡片 -->
      <view class="cargo-info-card flex-col">
        <text class="card-title">
          货物信息
        </text>

        <!-- 购买数量 -->
        <u-form-item
          prop="quantity"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              购买数量
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.quantity"
              placeholder="购买数量"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              type="number"
            >
              <template slot="suffix">
                <text>吨</text>
              </template>
            </u--input>
          </view>
        </u-form-item>

        <!-- 发货地址 -->
        <u-form-item
          prop="originCity"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              发货地址
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.originCity"
              placeholder="发货地址"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
            >
              <template slot="suffix">
                <u-icon name="arrow-down-fill" size="28" />
              </template>
            </u--input>
          </view>
        </u-form-item>
      </view>
      <!-- 司机信息卡片 -->
      <view class="driver-info-card flex-col">
        <text class="card-title">
          司机信息
        </text>

        <!-- 司机姓名 -->
        <u-form-item
          prop="driverName"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              司机姓名
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.driverName"
              placeholder="司机姓名"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
            >
              <template slot="suffix">
                <u-icon name="arrow-down-fill" size="28" />
              </template>
            </u--input>
          </view>
        </u-form-item>

        <!-- 司机手机号 -->
        <u-form-item
          prop="driverPhone"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              电话
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.driverPhone"
              placeholder="司机手机号"
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
              readonly
              disabled
            />
          </view>
        </u-form-item>

        <!-- 车牌号 -->
        <u-form-item
          prop="plateNumber"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              车牌号
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.plateNumber"
              placeholder="请输入车牌号"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              readonly
              disabled
            />
          </view>
        </u-form-item>

        <!-- 车辆类型 -->
        <u-form-item
          prop="vehicleType"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              车辆类型
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.vehicleType"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              readonly
              disabled
            />
          </view>
        </u-form-item>
      </view>
    </u--form>

    <!-- 底部操作栏 -->
    <view class="bottom-action-bar flex-row justify-between">
      <text class="cost-label">
        总共费用
      </text>
      <text class="total-cost">
        ¥{{ formData.totalCost }}
      </text>
      <view class="confirm-order-btn flex-col" @click="confirmOrder">
        <text class="confirm-btn-text">
          确认下单
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
