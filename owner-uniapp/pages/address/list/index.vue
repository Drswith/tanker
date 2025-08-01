<script>
import { addressApi } from '@/api/address'

export default {
  data() {
    return {
      // 地址列表数据
      addressList: [],

      // 默认地址ID
      defaultAddressId: null,

      // 页面状态
      pageState: {
        isLoading: false,
        isEmpty: false,
      },
    }
  },

  onLoad() {
    this.loadAddressList()
  },

  onShow() {
    // 页面显示时重新加载列表
    this.loadAddressList()
  },

  methods: {
    // 处理默认地址变更
    async handleDefaultChange(id) {
      console.log('默认地址变更:', id)
      // 更新本地数据
      this.addressList.forEach((address) => {
        address.isDefault = address.id === id
      })

      try {
        await addressApi.setDefaultAddress({
          id,
          isDefault: true,
        })
        uni.showToast({
          title: '设置成功',
          icon: 'success',
        })
      }
      catch (error) {
        uni.showToast({
          title: '设置失败，请重试',
          icon: 'none',
        })
        // 恢复原来的选中状态
        this.defaultAddressId = this.addressList.find(addr => addr.isDefault)?.id || null
      }
    },

    // 加载地址列表
    async loadAddressList() {
      try {
        this.pageState.isLoading = true
        const data = await addressApi.getAddressList()
        console.log('地址列表数据:', data)

        // 将接口数据映射到页面显示格式
        if (data && Array.isArray(data)) {
          this.addressList = data.map(address => ({
            id: address.id,
            contactPerson: address.name || '未知',
            phone: address.mobile || '未知',
            address: `${address.province || ''}${address.city || ''}${address.district || ''}${address.address || ''}`,
            isDefault: address.isDefault || false,
            // 保留原始数据
            originalData: address,
          }))

          // 更新默认地址ID
          const defaultAddress = this.addressList.find(addr => addr.isDefault)
          this.defaultAddressId = defaultAddress ? defaultAddress.id : null
        }
        else {
          this.addressList = []
        }

        this.pageState.isEmpty = this.addressList.length === 0
      }
      catch (error) {
        console.error('加载地址列表失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 编辑地址
    editAddress(address) {
      uni.navigateTo({
        url: `/pages/address/add/index?id=${address.id}`,
      })
    },

    // 删除地址
    deleteAddress(address) {
      uni.showToast({
        title: '缺少api接口',
        icon: 'none',
      })
      // uni.showModal({
      //   title: '确认删除',
      //   content: `确定要删除地址"${address.contactPerson}"吗？`,
      //   success: (res) => {
      //     if (res.confirm) {
      //       this.confirmDeleteAddress(address)
      //     }
      //   },
      // })
    },

    // 确认删除地址
    async confirmDeleteAddress(address) {
      try {
        // TODO: 调用删除地址接口
        // await this.httpApi.deleteAddress(address.id);

        // 从列表中移除
        const index = this.addressList.findIndex(item => item.id === address.id)
        if (index > -1) {
          this.addressList.splice(index, 1)
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

    // 添加新地址
    addNewAddress() {
      uni.navigateTo({
        url: '/pages/address/add/index',
      })
    },
  },
}
</script>

<template>
  <view class="address-list-page">
    <!-- 加载状态 -->
    <view v-if="pageState.isLoading" class="loading-container">
      <text class="loading-text">
        加载中...
      </text>
    </view>

    <!-- 地址列表 -->
    <view v-else-if="addressList.length > 0" class="address-list-container">
      <view
        v-for="address in addressList"
        :key="address.id"
        class="address-card"
      >
        <!-- 地址信息 -->
        <view class="address-info">
          <!-- 收货人信息行 -->
          <view class="contact-info-row">
            <text class="contact-person">
              收货人：{{ address.contactPerson }}
            </text>
            <text class="contact-phone">
              {{ address.phone }}
            </text>
          </view>

          <!-- 收货地址行 -->
          <view class="address-row">
            <text class="address-label">
              收货地址：
            </text>
            <text class="address-text">
              {{ address.address }}
            </text>
          </view>

          <!-- 默认标识和操作按钮行 -->
          <view class="bottom-row">
            <view class="default-radio-container">
              <u-radio-group
                v-model="defaultAddressId"
                placement="row"
                @change="handleDefaultChange"
              >
                <u-radio
                  :name="address.id"
                  :custom-style="{
                    marginBottom: '0',
                  }"
                >
                  <template #default>
                    <text class="radio-label">
                      设为默认
                    </text>
                  </template>
                </u-radio>
              </u-radio-group>
            </view>
            <view class="address-actions">
              <text
                class="action-btn edit-btn"
                @click.stop="editAddress(address)"
              >
                编辑
              </text>
              <text
                class="action-btn delete-btn"
                @click.stop="deleteAddress(address)"
              >
                删除
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空数据状态 -->
    <view v-else class="empty-container">
      <text class="empty-text">
        暂无地址数据
      </text>
      <text class="empty-hint">
        点击下方按钮添加新地址
      </text>
    </view>

    <!-- 添加新地址按钮 -->
    <view class="add-address-btn" @click="addNewAddress">
      <text class="add-btn-text">
        添加新地址
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.address-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 地址列表容器 */
.address-list-container {
  padding: 24rpx 32rpx;
}

/* 地址卡片 */
.address-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 地址信息 */
.address-info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 收货人信息行 */
.contact-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contact-person {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.contact-phone {
  font-size: 28rpx;
  color: #333;
}

/* 收货地址行 */
.address-row {
  display: flex;
  align-items: flex-start;
}

.address-label {
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
}

.address-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  line-height: 1.4;
}

/* 底部行 */
.bottom-row {
  border-top: 2rpx solid #E5E5E5;
  padding-top: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 默认地址选择容器 */
.default-radio-container {
  flex: 1;
}

/* Radio标签样式 */
.radio-label {
  font-size: 24rpx;
  color: #666;
  margin-left: 8rpx;
}

/* 操作按钮 */
.address-actions {
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

/* 添加新地址按钮 */
.add-address-btn {
  position: fixed;
  bottom: 40rpx;
  left: 32rpx;
  right: 32rpx;
  height: 96rpx;
  background: linear-gradient(326deg, #FFD100 0%, #FFA500 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 165, 0, 0.3);
  cursor: pointer;
}

.add-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 空数据状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  gap: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}
</style>
