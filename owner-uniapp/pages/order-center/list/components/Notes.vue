<script>
import { OrderStatus } from '@/api/order'

export default {
  name: 'Notes',
  props: {
    status: {
      type: Number,
    },
  },
  computed: {
    text() {
      if (this.status === OrderStatus.Accepted) {
        return '备注：平台服务协议'
      }
      if (this.status === OrderStatus.GpsInstalled) {
        return '备注：司机承运协议'
      }
      return ''
    },
  },
}
</script>

<template>
  <view v-if="text" class="notes">
    <text style="margin-left: 20rpx;">
      {{ text }}
    </text>
  </view>
</template>

<style lang="scss" scoped>
/* 订单备注信息 */
.notes {
	width: 100%;
	background-color: #FFF3E0;
	font-size: 24rpx;
	color: #797063;
	display: flex;
	align-items: center;
	box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(0,0,0,0.1);
	border-radius: 0rpx 0rpx 16rpx 16rpx;
	position: absolute;
	bottom: 0px;
	transform: translateY(calc(100% - 16rpx));
	z-index: -2;
	padding-top: 32rpx;
	padding-bottom: 16rpx;
}
</style>
