<script>
import { userApi } from '@/api/user'

export default {
  data() {
    return {
      orderStatusList: [
        {
          icon:
            '/static/images/mine-wait.png',
          label: '待接单',
        },
        {
          icon:
            '/static/images/mine-sign.png',
          label: '待签署',
        },
        {
          icon:
            '/static/images/mine-signed.png',
          label: '待签署',
        },
        {
          icon:
            '/static/images/mine-trans.png',
          label: '运输中',
        },
        {
          icon:
            '/static/images/mine-finished.png',
          label: '已完成',
        },
      ],
      constants: {},
    }
  },
  methods: {},
}
</script>

<template>
  <view class="page flex-col">
    <view class="header-section flex-col">
      <view class="user-info flex-row justify-between">
        <view class="avatar-wrapper flex-col">
          <image
            class="user-avatar"
            referrerpolicy="no-referrer"
            src="/static/images/mine-avatar.png"
          />
        </view>
        <view class="user-details flex-col">
          <text class="username">
            用户名称
          </text>
          <text class="user-id">
            1234455656
          </text>
        </view>
        <image
          class="arrow-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-arrow.png"
        />
      </view>

      <view class="order-center-section flex-col">
        <text class="section-title">
          订单中心
        </text>
        <view class="order-status-list flex-row">
          <view
            v-for="(item, index) in orderStatusList"
            :key="index"
            class="order-status-item flex-col"
          >
            <image
              class="status-icon"
              referrerpolicy="no-referrer"
              :src="item.icon"
            />
            <text class="status-label" v-html="item.label" />
          </view>
        </view>
      </view>
    </view>

    <view class="invite-section flex-row">
      <view class="invite-info flex-col">
        <text class="invite-title">
          邀请好友
        </text>
        <text class="invite-code">
          邀请码：123445
        </text>
      </view>
      <view class="invite-button flex-col">
        <text class="invite-btn-text">
          立即邀请
        </text>
      </view>
      <image
        class="invite-bg-image"
        referrerpolicy="no-referrer"
        src="/static/images/mine-invite-box.png"
      />
    </view>
    <view class="features-section flex-col">
      <text class="section-title">
        其他功能
      </text>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-invite-list.png"
        />
        <text class="feature-label">
          邀请记录
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-address.png"
        />
        <text class="feature-label">
          收货地址
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-driver.png"
        />
        <text class="feature-label">
          合作司机
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-password.png"
        />
        <text class="feature-label">
          修改密码
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-call.png"
        />
        <text class="feature-label">
          电话客服
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-feedback.png"
        />
        <text class="feature-label">
          咨询反馈
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
