<script>
import { userApi } from '@/api/user'

export default {
  data() {
    return {
      userInfo: {
        id: null,
        username: '',
        nickname: '',
        mobile: '',
        avatar: '',
        inviter: '',
      },
      pageState: {
        isLoading: false,
      },
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
  onShow() {
    this.loadUserProfile()
  },
  methods: {
    // 加载用户信息
    async loadUserProfile() {
      try {
        this.pageState.isLoading = true
        const response = await userApi.getMyProfile()

        if (response) {
          this.userInfo = {
            id: response.id || null,
            username: response.username || '',
            nickname: response.nickname || '',
            mobile: response.mobile || '',
            avatar: response.avatar || '/static/images/mine-avatar.png',
            inviter: response.inviter || '',
          }
        }
      }
      catch (error) {
        console.error('加载用户信息失败:', error)
        uni.showToast({
          title: '加载用户信息失败',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 跳转到用户信息页面
    goToUserInfo() {
      uni.navigateTo({
        url: `/pages/mine/info/index?userData=${encodeURIComponent(JSON.stringify(this.userInfo))}`,
      })
    },

    // 跳转到邀请记录页面
    goToInviteList() {
      uni.navigateTo({
        url: '/pages/invite/list/index',
      })
    },

    // 跳转到收货地址页面
    goToAddressList() {
      uni.navigateTo({
        url: '/pages/address/list/index',
      })
    },

    // 跳转到合作司机页面
    goToDriverList() {
      uni.navigateTo({
        url: '/pages/driver/list/index',
      })
    },
  },
}
</script>

<template>
  <view class="page flex-col">
    <!-- 加载状态 -->
    <view v-if="pageState.isLoading" class="loading-container flex-col">
      <text class="loading-text">
        加载中...
      </text>
    </view>

    <view v-else class="header-section flex-col">
      <view class="user-info flex-row justify-between" @click="goToUserInfo">
        <view class="avatar-wrapper flex-col">
          <image
            class="user-avatar"
            referrerpolicy="no-referrer"
            :src="userInfo.avatar || '/static/images/mine-avatar.png'"
          />
        </view>
        <view class="user-details flex-col">
          <text class="username">
            {{ userInfo.nickname || userInfo.username || '用户名称' }}
          </text>
          <text class="user-mobile">
            {{ userInfo.mobile || '暂无手机号' }}
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
          邀请码：{{ userInfo.inviter || '暂无邀请码' }}
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
      <view class="feature-item flex-row " @click="goToInviteList">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-invite-list.png"
        />
        <text class="feature-label">
          邀请记录
        </text>
      </view>
      <view class="feature-item flex-row " @click="goToAddressList">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-address.png"
        />
        <text class="feature-label">
          收货地址
        </text>
      </view>
      <view class="feature-item flex-row " @click="goToDriverList">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-driver.png"
        />
        <text class="feature-label">
          合作司机
        </text>
      </view>
      <view class="feature-item flex-row ">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-password.png"
        />
        <text class="feature-label">
          修改密码
        </text>
      </view>
      <view class="feature-item flex-row ">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-call.png"
        />
        <text class="feature-label">
          电话客服
        </text>
      </view>
      <view class="feature-item flex-row ">
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

/* 加载状态样式 */
.loading-container {
  padding: 40rpx;
  align-items: center;
  justify-content: center;
  min-height: 200rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}
</style>
