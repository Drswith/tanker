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
	padding: 8rpx 24rpx;
	border-radius: 0rpx 8rpx 0rpx 8rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}

.sign-bg {
  background: linear-gradient(to right, #FD4641, #FD7966);
}

.other-bg {
  background: linear-gradient(to right, #0975FF, #62CBFD);
}
</style>
