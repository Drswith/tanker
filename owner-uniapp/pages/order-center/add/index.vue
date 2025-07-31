<script>
export default {
  data() {
    return {
      // 订单数据
      orderData: {
        // 收货地址信息
        deliveryAddress: {
          name: '张三',
          phone: '12345678909',
          isDefault: true,
          address: '浙江省杭州市滨江区奥体中心旁边'
        },
        // 货物信息
        cargoInfo: {
          quantity: 200,
          unit: '吨',
          originCity: '杭州'
        },
        // 司机信息
        driverInfo: {
          name: '200',
          phone: '12345678909',
          plateNumber: '浙A 66666',
          vehicleType: '大卡车'
        },
        // 费用信息
        totalCost: 675.0
      }
    }
  },
  methods: {
    // 确认下单
    confirmOrder() {
      // TODO: 实现下单逻辑
      console.log('确认下单', this.orderData)
    },
    
    // 选择收货地址
    selectDeliveryAddress() {
      // TODO: 跳转到地址选择页面
    },
    
    // 选择发货地址
    selectOriginAddress() {
      // TODO: 跳转到发货地址选择页面
    }
  },
}
</script>

<template>
  <view class="order-create-page flex-col">
    <!-- 状态栏和导航栏 -->
    <view class="header-container flex-col">
      <!-- 状态栏 -->
      <view class="status-bar flex-row">
        <text class="status-time">
          9:41
        </text>
        <image
          class="status-signal-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng1be20f0eced1f466b6b4dc3a981fc6b52a4b9cf391debed94bcf2e01f7c38668"
        />
        <image
          class="status-wifi-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb3bbe96fea0140cfc24043ebc96677b3c6566f6cd0b99cb137439fb58271c764"
        />
        <image
          class="status-battery-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPnga05957db16243a63d7c74f823baeb36bbafa63e1b3e30902724223c367fb5eeb"
        />
      </view>
      <!-- 导航栏 -->
      <view class="navigation-bar flex-row justify-between">
        <image
          class="nav-back-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng56f6bee2c636c96d9771d242dd3d0e2bae43b83273e5cd46d78a4004d741a667"
        />
        <text class="nav-title">
          下单
        </text>
      </view>
    </view>

    <!-- 收货地址卡片 -->
    <view class="delivery-address-card flex-row justify-between" @click="selectDeliveryAddress">
      <view class="address-info flex-col">
        <!-- 姓名和电话 -->
        <view class="contact-info flex-row justify-between">
          <text class="contact-name">
            {{ orderData.deliveryAddress.name }}
          </text>
          <text class="contact-phone">
            {{ orderData.deliveryAddress.phone }}
          </text>
        </view>
        <!-- 地址信息 -->
        <view class="address-detail">
          <text class="address-tag" v-if="orderData.deliveryAddress.isDefault">
            【默认】
          </text>
          <text class="address-text">
            {{ orderData.deliveryAddress.address }}
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
      <text class="field-label">
        购买数量
      </text>
      <view class="quantity-input flex-row justify-between">
        <text class="quantity-value">
          {{ orderData.cargoInfo.quantity }}
        </text>
        <text class="quantity-unit">
          {{ orderData.cargoInfo.unit }}
        </text>
      </view>
      
      <!-- 发货地址 -->
      <text class="field-label">
        发货地址
      </text>
      <view class="origin-address-selector flex-row justify-between" @click="selectOriginAddress">
        <text class="origin-city">
          {{ orderData.cargoInfo.originCity }}
        </text>
        <image
          class="selector-arrow-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng5f0ad0ca685566386aff84decbcd88a1fae8d5f7d3f453d5aea3b0176d95c2c3"
        />
      </view>
    </view>

    <!-- 司机信息卡片 -->
    <view class="driver-info-card flex-col">
      <text class="card-title">
        选择司机
      </text>
      
      <!-- 司机姓名 -->
      <text class="field-label">
        司机
      </text>
      <view class="driver-name-input flex-col">
        <text class="driver-name">
          {{ orderData.driverInfo.name }}
        </text>
      </view>
      
      <!-- 手机号 -->
      <text class="field-label">
        手机号
      </text>
      <view class="driver-phone-input flex-col">
        <text class="driver-phone">
          {{ orderData.driverInfo.phone }}
        </text>
      </view>
      
      <!-- 车牌号 -->
      <text class="field-label">
        车牌号
      </text>
      <view class="plate-number-input flex-col">
        <text class="plate-number">
          {{ orderData.driverInfo.plateNumber }}
        </text>
      </view>
      
      <!-- 车辆类型 -->
      <text class="field-label">
        车辆类型
      </text>
      <view class="vehicle-type-input flex-col">
        <text class="vehicle-type">
          {{ orderData.driverInfo.vehicleType }}
        </text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-action-bar flex-row">
      <text class="cost-label">
        总共费用
      </text>
      <text class="total-cost">
        ¥{{ orderData.totalCost }}
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
