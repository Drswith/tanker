<script>
import { orderApi, OrderStatus, OrderStatusText } from '@/api/order'
import { userApi } from '@/api/user'
import { getToken, getUserInfo, setUserInfo } from '@/utils/auth'

export default {
  data() {
    return {
      OrderStatus: Object.freeze(OrderStatus),
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
      gridOptions: [
        {
          icon:
            '/static/images/mine-wait.png',
          label: '待接单',
          status: OrderStatus.Paid,
        },
        {
          icon:
            '/static/images/mine-sign.png',
          label: '待签署',
          status: OrderStatus.Accepted,
        },
        // {
        //   icon:
        //     '/static/images/mine-signed.png',
        //   label: '待签署',
        //   status: OrderStatus.Accepted,
        // },
        {
          icon:
            '/static/images/mine-trans.png',
          label: '运输中',
          status: OrderStatus.DriverSigned,
        },
        {
          icon:
            '/static/images/mine-finished.png',
          label: '已完成',
          status: OrderStatus.GpsReceived,
        },
      ],
      constants: {},
    }
  },
  computed: {
    isLogin() {
      const token = getToken()
      return !!token
    },
  },
  onShow() {
    if (this.isLogin) {
      this.loadUserProfile()
    }
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
          setUserInfo(this.userInfo)
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

    goToOrderList(index) {
      console.log(this.gridOptions[index].status)
      uni.reLaunch({
        url: `/pages/order-center/list/index?orderStatus=${this.gridOptions[index].status}`,
      })
    },

    // 跳转到用户信息页面
    goToUserInfo() {
      if (!this.isLogin) {
        uni.reLaunch({
          url: '/pages/login/index/index',
        })
        return
      }

      uni.navigateTo({
        url: `/pages/mine/info/index?userId=${this.userInfo.id}`,
      })
    },

    // 跳转到邀请记录页面
    goToInviteList() {
      uni.navigateTo({
        url: '/pages/invite/list/index',
      })
    },

    // 跳转到邀请页面
    goToInvite() {
      uni.navigateTo({
        url: '/pages/invite/index/index',
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

    // 跳转到修改密码页面
    goToChangePassword() {
      uni.navigateTo({
        url: '/pages/change-password/index/index',
      })
    },

    // 拨打客服电话
    makePhoneCall() {
      const servicePhone = '13800000000'
      uni.makePhoneCall({
        phoneNumber: servicePhone,
      })
    },
    // 联系微信小程序客服
    handleContact(e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    },
  },
}
</script>

<template>
  <view class="page flex-col">
    <view class="header-section flex-col">
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
            {{ isLogin ? userInfo.username || '用户名称' : '未登录' }}
          </text>
          <text class="user-mobile">
            {{ isLogin ? userInfo.mobile || '暂无手机号' : '点击登录' }}
          </text>
        </view>
        <image
          class="arrow-icon"
          referrerpolicy="no-referrer"
          src="/static/images/mine-arrow.png"
        />
      </view>
      <template v-if="isLogin">
        <view class="order-center-section flex-col">
          <view class="section-title-container">
            <view class="section-title">
              订单中心
            </view>
            <view class="section-title-view-more" @click="goToOrderList(2)">
              查看更多
            </view>
          </view>
          <view class="order-status-list flex-row justify-between">
            <view
              v-for="(item, index) in gridOptions"
              :key="index"
              class="order-status-item flex-col"
              @click="goToOrderList(index)"
            >
              <image
                class="status-icon"
                referrerpolicy="no-referrer"
                :src="item.icon"
              />
              <text class="status-label">
                {{ item.label }}
              </text>
            </view>
          </view>
        </view>
      </template>
    </view>
    <template v-if="isLogin">
      <view class="invite-section flex-row" @click="goToInvite">
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
        <view class="feature-item flex-row " @click="goToChangePassword">
          <image
            class="feature-icon"
            referrerpolicy="no-referrer"
            src="/static/images/mine-password.png"
          />
          <text class="feature-label">
            修改密码
          </text>
        </view>
        <view class="feature-item flex-row " @click="makePhoneCall">
          <image
            class="feature-icon"
            referrerpolicy="no-referrer"
            src="/static/images/mine-call.png"
          />
          <text class="feature-label">
            电话客服
          </text>
        </view>
        <button open-type="contact" bindcontact="handleContact" session-from="sessionFrom" class="contact-btn">
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
        </button>
      </view>
    </template>
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
.contact-btn {
  border: none;
    &::after {
    border: none;
    }
}
</style>
