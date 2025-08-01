<script>
import { OrderStatus } from '@/api/order'

export default {
  name: 'Tag',
  props: {
    status: {
      type: Number,
    },
    text: {
      type: String,
      default: 'unknown',
    },
  },
  computed: {
    tagClass() {
      if ([OrderStatus.Accepted, OrderStatus.GpsInstalled].includes(this.status)) {
        return 'sign-bg'
      }
      return 'other-bg'
    },
  },
}
</script>

<template>
  <view class="treetop" :class="[tagClass]">
    {{ text }}
  </view>
</template>

<style lang="scss" scoped>
/* 订单状态角标 */
.treetop {
	position: absolute;
	top: 0;
	right: 0;
	color: #fff;
	font-size: 20rpx;
	font-weight: 400;
	padding: 8rpx 20rpx;
	border-radius: 0 10rpx 0 10rpx;
}

.sign-bg {
  background: linear-gradient(to right, #FD4641, #FD7966);
}

.other-bg {
  background: linear-gradient(to right, #0975FF, #62CBFD);
}
</style>
