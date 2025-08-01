<script>
import { addressApi } from '@/api/address'
import { driverApi } from '@/api/driver'
import { orderApi } from '@/api/order'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        id: null,
        name: '测试姓名',
        phone: '19899999999',
        isDefault: true,
        address: '测试地址123',
        userAddressId: 1,

        quantity: 5,
        unit: '吨',
        originCity: '杭州',
        shippingLocationId: 2,
        driverUserId: 1, // 司机ID
        driverName: '张三',
        driverPhone: '15012341232',
        plateNumber: '浙A123',
        vehicleType: '大货车',
        totalCost: 675.0,
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入收货人姓名',
            trigger: ['blur', 'change'],
          },
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change'],
          },
        ],
        address: [
          {
            required: true,
            message: '请输入收货地址',
            trigger: ['blur', 'change'],
          },
        ],
        quantity: [
          {
            required: true,
            message: '请输入购买数量',
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            min: 1,
            message: '购买数量必须大于0',
            trigger: ['blur', 'change'],
          },
        ],
        originCity: [
          {
            required: true,
            message: '请选择发货地址',
            trigger: ['blur', 'change'],
          },
        ],
        driverName: [
          {
            required: true,
            message: '请输入司机姓名',
            trigger: ['blur', 'change'],
          },
        ],
        driverPhone: [
          {
            required: true,
            message: '请输入司机手机号',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的司机手机号',
            trigger: ['blur', 'change'],
          },
        ],
        plateNumber: [
          {
            required: true,
            message: '请输入车牌号',
            trigger: ['blur', 'change'],
          },
        ],
        vehicleType: [
          {
            required: true,
            message: '请选择车辆类型',
            trigger: ['blur', 'change'],
          },
        ],
      },

      submitting: false, // 提交状态
      isLoading: false, // 加载状态
      isEdit: false, // 是否编辑模式
      orderId: null, // 订单ID（编辑时使用）
    }
  },
  onLoad(options) {
    if (options.id) {
      this.isEdit = true
      this.orderId = options.id
      this.loadDetail()
      // 修改页面标题
      uni.setNavigationBarTitle({
        title: '修改订单',
      })
    }
  },
  methods: {
    // 确认下单
    async confirmOrder() {
      if (this.submitting)
        return

      try {
        this.submitting = true

        // 表单验证
        const isValid = await this.validateForm()
        if (!isValid) {
          return
        }

        // 构建订单数据，映射到API要求的字段格式
        const orderData = this.buildOrderData()

        console.log('提交订单数据:', orderData)

        // 调用创建订单API
        let response
        if (this.isEdit) {
          response = await orderApi.updateOrder(orderData)
        }
        else {
          response = await orderApi.createOrder(orderData)
        }

        console.log('订单创建/更新成功:', response)

        // 显示成功提示
        uni.showToast({
          title: this.isEdit ? '订单更新成功' : '订单创建成功',
          icon: 'success',
          duration: 2000,
        })

        // 延迟跳转到订单列表页面
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/order-center/list/index',
          })
        }, 2000)
      }
      catch (error) {
        console.error('创建订单失败:', error)

        // 显示错误提示
        uni.showToast({
          title: error.message || '创建/更新订单失败，请重试',
          icon: 'none',
          duration: 3000,
        })
      }
      finally {
        this.submitting = false
      }
    },

    // 表单验证
    async validateForm() {
      try {
        // 使用uView表单验证，rules中已经定义了所有验证规则
        await this.$refs.uForm.validate()
        return true
      }
      catch (error) {
        console.error('表单验证失败:', error)
        // uView会自动显示验证错误信息，这里不需要额外处理
        return false
      }
    },

    // 构建订单数据，映射到API字段格式
    buildOrderData() {
      return {
        id: this.orderId || null,
        // 收货信息
        takeName: this.formData.name, // 收货人姓名
        takeMobile: this.formData.phone, // 收货人手机号
        address: this.formData.address, // 详细地址(收货地址，卸货位置)
        userAddressId: this.formData.userAddressId,

        // 货物信息
        buyCount: Number(this.formData.quantity), // 购买数量
        price: Number(this.formData.totalCost), // 价格

        // 发货信息
        shippingLocationName: this.formData.originCity, // 发货地名称
        shippingLocationAddress: this.formData.originCity, // 发货详细地址
        shippingLocationId: this.formData.shippingLocationId, // 发货地ID

        // 司机信息
        driverUserId: this.formData.driverUserId, // 司机ID
        driverName: this.formData.driverName, // 司机姓名
        driverMobile: this.formData.driverPhone, // 司机手机号
        carNumber: this.formData.plateNumber, // 车牌号
        type: this.formData.vehicleType, // 车类型

        // 订单状态和时间
        // status: 0, // 订单状态 0 已创建待支付
        // placeOrderTime: new Date().toISOString(), // 下单时间

        // 其他必要字段
        // isDel: 0, // 0 未删除
        // isEvaluate: 0, // 0 未评价
        // orderCount: 1, // 订单数量

        // 扩展数据
        // extData: {
        //   unit: this.formData.unit, // 单位
        //   isDefault: this.formData.isDefault, // 是否默认地址
        // },
      }
    },

    // 加载订单详情（编辑时使用）
    async loadDetail() {
      try {
        this.isLoading = true
        const order = await orderApi.getOrderDetail(this.orderId)
        console.log(order)
        this.formData = {
          name: order.takeName,
          phone: order.takeMobile,
          address: order.address,
          userAddressId: order.userAddressId,
          quantity: order.buyCount,
          totalCost: order.price,
          originCity: order.shippingLocationAddress,
          shippingLocationId: order.shippingLocationId,
          driverUserId: order.driverUserId,
          driverName: order.driverName,
          driverPhone: order.driverMobile,
          plateNumber: order.carNumber,
          vehicleType: order.type,
        }
      }
      catch (error) {
        console.error('加载订单详情失败:', error)
        uni.showToast({
          title: '加载订单详情失败',
          icon: 'none',
        })
      }
      finally {
        this.isLoading = false
      }
    },
    // 选择收货地址
    selectDeliveryAddress() {
      // TODO: 跳转到地址选择页面
      uni.showToast({
        title: '地址选择功能开发中',
        icon: 'none',
      })
    },

    // 选择发货地址
    selectOriginAddress() {
      // TODO: 跳转到发货地址选择页面
      uni.showToast({
        title: '发货地址选择功能开发中',
        icon: 'none',
      })
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
      <view
        class="confirm-order-btn flex-col"
        :class="{ 'btn-disabled': submitting }"
        @click="confirmOrder"
      >
        <text class="confirm-btn-text">
          {{ submitting ? '提交中...'
            : isEdit ? '确认修改' : '确认下单' }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
