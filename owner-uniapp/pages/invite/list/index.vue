<script>
import { inviteApi } from '@/api/invite'

export default {
  data() {
    return {
      // 推荐人信息
      referrerInfo: {
        name: '',
        totalFriends: 0,
      },

      // 邀请记录列表数据
      inviteList: [],

      // 页面状态
      pageState: {
        isLoading: false,
      },
    }
  },

  onLoad() {
    this.loadInviteList()
  },

  methods: {
    // 加载邀请记录列表
    async loadInviteList() {
      try {
        this.pageState.isLoading = true
        const { inviter = '', list = [], listSize = 0 } = await inviteApi.getInviteList()

        // 适配接口数据到页面显示格式
        this.inviteList = list.map(item => ({
          id: item.id,
          name: item.extData?.name || '未知用户',
          phone: item.extData?.phone || '未知手机号',
          inviteTime: item.creationTime || '',
          avatar: item.extData?.avatar || '/static/images/default-avatar.png',
          userId: item.userId,
          inviterId: item.inviterId,
        }))

        // 更新推荐人姓名
        this.referrerInfo.name = inviter

        // 更新好友总数
        this.referrerInfo.totalFriends = listSize
      }
      catch (error) {
        console.error('加载邀请记录失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 邀请好友
    inviteFriend() {
      // TODO: 实现邀请好友功能
      uni.showToast({
        title: '邀请功能开发中',
        icon: 'none',
      })
    },

    // 查看邀请详情
    viewInviteDetail(invite) {
      // TODO: 实现查看邀请详情功能
      console.log('查看邀请详情:', invite)
    },
  },
}
</script>

<template>
  <view class="invite-list-page">
    <!-- 顶部统计信息 -->
    <view class="stats-header">
      <view class="stats-info">
        <text class="stats-text">
          我的推荐人：{{ referrerInfo.name }}
        </text>
        <text class="stats-text">
          好友总数：{{ referrerInfo.totalFriends }} 人
        </text>
      </view>
      <view class="invite-btn" @click="inviteFriend">
        <text class="invite-btn-text">
          邀请好友
        </text>
      </view>
    </view>

    <!-- 邀请记录列表 -->
    <view class="invite-list-container">
      <view
        v-for="invite in inviteList"
        :key="invite.id"
        class="invite-card"
        @click="viewInviteDetail(invite)"
      >
        <!-- 用户头像 -->
        <view class="user-avatar">
          <image
            class="avatar-image"
            :src="invite.avatar"
            mode="aspectFill"
          />
        </view>

        <!-- 用户信息 -->
        <view class="user-info">
          <!-- 用户姓名 -->
          <view class="user-name-row">
            <text class="user-name">
              {{ invite.name }}
            </text>
          </view>

          <!-- 电话和时间水平排列 -->
          <view class="user-details-row">
            <text class="user-phone">
              {{ invite.phone }}
            </text>
            <text class="invite-time">
              {{ invite.inviteTime }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.invite-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部统计信息 */
.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.stats-text {
  font-size: 28rpx;
  color: #333;
}

.invite-btn {
  background-color: #ff9e00;
  border-radius: 8rpx;
  padding: 16rpx 24rpx;
}

.invite-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

/* 邀请记录列表容器 */
.invite-list-container {
  padding: 0 32rpx;
}

/* 邀请记录卡片 */
.invite-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 用户头像 */
.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  overflow: hidden;
  margin-right: 24rpx;
  background-color: #007AFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

/* 用户信息 */
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name-row {
  margin-bottom: 12rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 电话和时间水平排列 */
.user-details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-phone {
  font-size: 28rpx;
  color: #666;
}

.invite-time {
  font-size: 28rpx;
  color: #999;
}
</style>
