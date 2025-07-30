<script>
export default {
  data() {
    return {
      // 司机列表数据
      driverList: [
        {
          id: 1,
          name: '章鱼哥',
          phone: '195****1234',
          rating: 5.0,
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 2,
          name: '海绵宝宝',
          phone: '195****1234',
          rating: 5.0,
          avatar: '/static/images/default-avatar.png',
        },
        {
          id: 3,
          name: '红红',
          phone: '195****1234',
          rating: 5.0,
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
    this.loadDriverList()
  },

  methods: {
    // 加载司机列表
    async loadDriverList() {
      try {
        this.pageState.isLoading = true
        // TODO: 调用获取司机列表接口
        // const response = await this.httpApi.getDriverList();
        // this.driverList = response.data;
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

    // 编辑司机
    editDriver(driver) {
      uni.navigateTo({
        url: `/pages/driver/detail/index?id=${driver.id}&mode=edit`,
      })
    },

    // 删除司机
    deleteDriver(driver) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除司机"${driver.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            this.confirmDeleteDriver(driver)
          }
        },
      })
    },

    // 确认删除司机
    async confirmDeleteDriver(driver) {
      try {
        // TODO: 调用删除司机接口
        // await this.httpApi.deleteDriver(driver.id);

        // 从列表中移除
        const index = this.driverList.findIndex(item => item.id === driver.id)
        if (index > -1) {
          this.driverList.splice(index, 1)
        }

        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
      }
      catch (error) {
        uni.showToast({
          title: '删除失败，请重试',
          icon: 'none',
        })
      }
    },

    // 查看司机详情
    viewDriverDetail(driver) {
      uni.navigateTo({
        url: `/pages/driver/detail/index?id=${driver.id}`,
      })
    },
  },
}
</script>

<template>
  <view class="driver-list-page">
    <!-- 司机列表 -->
    <view class="driver-list-container">
      <view
        v-for="driver in driverList"
        :key="driver.id"
        class="driver-card"
        @click="viewDriverDetail(driver)"
      >
        <!-- 司机头像 -->
        <view class="driver-avatar">
          <image
            class="avatar-image"
            :src="driver.avatar"
            mode="aspectFill"
          />
        </view>

        <!-- 司机信息 -->
        <view class="driver-info">
          <!-- 司机姓名 -->
          <view class="driver-name-row">
            <text class="driver-name">
              {{ driver.name }}
            </text>
          </view>

          <!-- 电话、评分、操作按钮水平排列 -->
          <view class="driver-details-row">
            <view class="phone-rating-group">
              <text class="driver-phone">
                {{ driver.phone }}
              </text>
              <text class="rating-text">
                {{ driver.rating }} 分
              </text>
            </view>
            <view class="driver-actions">
              <text
                class="action-btn edit-btn"
                @click.stop="editDriver(driver)"
              >
                编辑
              </text>
              <text
                class="action-btn delete-btn"
                @click.stop="deleteDriver(driver)"
              >
                删除
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.driver-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 司机列表容器 */
.driver-list-container {
  padding: 24rpx 32rpx;
}

/* 司机卡片 */
.driver-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 司机头像 */
.driver-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  overflow: hidden;
  margin-right: 24rpx;
  background-color: #f0f0f0;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

/* 司机信息 */
.driver-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.driver-name-row {
  margin-bottom: 12rpx;
}

.driver-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 电话、评分、操作按钮水平排列 */
.driver-details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 电话和评分分组 */
.phone-rating-group {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 16rpx;
}

.driver-phone {
  font-size: 28rpx;
  color: #666;
}

.rating-text {
  font-size: 28rpx;
  color: #FFA500;
  font-weight: 500;
}

/* 操作按钮 */
.driver-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  text-align: center;
  cursor: pointer;
  min-width: 60rpx;
}

.edit-btn {
  background-color: #FFA500;
  color: #fff;
}

.delete-btn {
  background-color: #ff4757;
  color: #fff;
}
</style>
