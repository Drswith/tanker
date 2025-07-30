<script>
export default {
  data() {
    return {
      // 推荐人信息
      referrerInfo: {
        name: '多多',
        totalFriends: 3,
      },

      // 邀请记录列表数据
      inviteList: [
        {
          id: 1,
          name: '章鱼哥',
          phone: '195****1234',
          inviteTime: '2021-12-12 12:00',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 2,
          name: '海绵宝宝',
          phone: '195****1234',
          inviteTime: '2021-12-12 12:00',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 3,
          name: '红红',
          phone: '195****1234',
          inviteTime: '2021-12-12 12:00',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 4,
          name: '派大星',
          phone: '137****5678',
          inviteTime: '2021-12-13 15:30',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 5,
          name: '蟹老板',
          phone: '158****9012',
          inviteTime: '2021-12-14 09:15',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 6,
          name: '珊迪',
          phone: '186****3456',
          inviteTime: '2021-12-15 16:45',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 7,
          name: '痞老板',
          phone: '139****7890',
          inviteTime: '2021-12-16 11:20',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 8,
          name: '小蜗',
          phone: '150****2345',
          inviteTime: '2021-12-17 14:40',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 9,
          name: '泡芙老师',
          phone: '133****4567',
          inviteTime: '2021-12-18 10:25',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 10,
          name: '海之王',
          phone: '177****8901',
          inviteTime: '2021-12-19 13:15',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 11,
          name: '小比目鱼',
          phone: '138****2345',
          inviteTime: '2021-12-20 16:30',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 12,
          name: '贝壳王子',
          phone: '159****6789',
          inviteTime: '2021-12-21 09:45',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 13,
          name: '海星使者',
          phone: '136****0123',
          inviteTime: '2021-12-22 14:20',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 14,
          name: '珊瑚公主',
          phone: '155****4567',
          inviteTime: '2021-12-23 11:35',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 15,
          name: '水母仙子',
          phone: '189****8901',
          inviteTime: '2021-12-24 15:50',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 16,
          name: '鲨鱼先生',
          phone: '135****2345',
          inviteTime: '2021-12-25 08:40',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 17,
          name: '海龟爷爷',
          phone: '156****6789',
          inviteTime: '2021-12-26 12:55',
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 18,
          name: '海马侠',
          phone: '187****0123',
          inviteTime: '2021-12-27 17:10',
          avatar: '/static/images/default-avatar.png',
        },
      ],

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
        // TODO: 调用获取邀请记录列表接口
        // const response = await this.httpApi.getInviteList();
        // this.inviteList = response.data;
      }
      catch (error) {
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
