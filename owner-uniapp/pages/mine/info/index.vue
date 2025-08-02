<script>
import { userApi } from '@/api/user'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        avatar: '', // 头像
        contactPerson: '秦泰', // 联系人姓名
        phoneNumber: '19512344321', // 手机号
      },

      // 上传文件列表
      avatarFileList: [],

      // userData
      userData: {},

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
      },

      // 表单验证规则
      rules: {
        contactPerson: [
          {
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change'],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  onShow(options) {
    this.loadUserProfile()
  },

  methods: {
    // 加载用户信息
    async loadUserProfile() {
      try {
        this.pageState.isLoading = true
        const response = await userApi.getMyProfile()
        this.userData = response

        // 适配用户数据到表单字段
        this.formData = {
          avatar: response.avatar || '',
          contactPerson: response.username || '',
          phoneNumber: response.mobile || '',
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
    // 头像上传后处理
    afterReadAvatar(event) {
      const { file } = event
      this.avatarFileList = [file]
      this.formData.avatar = file.url || file.path

      // TODO: 上传到服务器
      uni.showToast({
        title: '头像上传成功',
        icon: 'success',
      })
    },

    // 删除头像
    deleteAvatar() {
      this.avatarFileList = []
      this.formData.avatar = ''
    },

    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交保存信息
    async submitInfo() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // 构建更新数据，映射表单字段到接口字段
        const updateData = {
          avatar: this.formData.avatar,
          nickname: this.formData.contactPerson,
          mobile: this.formData.phoneNumber,
        }

        // 调用更新用户信息接口
        await userApi.updateMyProfile(updateData)

        uni.showToast({
          title: '保存成功',
          icon: 'success',
        })
        this.navigateBack()
      }
      catch (error) {
        console.error('更新用户信息失败:', error)
        uni.showToast({
          title: error.message || '保存失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 返回上一页
    navigateBack() {
      uni.switchTab({
        url: '/pages/mine/index/index',
      })
    },
  },
}
</script>

<template>
  <view class="flex-col">
    <view class="form-container flex-col">
      <!-- uView 表单 -->
      <u--form
        ref="uForm"
        :model="formData"
        :rules="rules"
        label-position="top"
        :label-style="{ fontSize: '32rpx', fontWeight: '600', color: '#4D4E46', marginBottom: '16rpx' }"
        error-type="toast"
      >
        <!-- 头像上传 -->
        <u-form-item
          prop="avatar"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              头像
            </text>
          </template>
          <view class="upload-container">
            <view class="upload-item-wrapper">
              <u-upload
                ref="avatarUpload"
                :file-list="avatarFileList"
                :max-count="1"
                :width="120"
                :height="120"
                @afterRead="afterReadAvatar"
                @delete="deleteAvatar"
              >
                <template #default>
                  <view class="upload-slot avatar-upload-slot">
                    <image
                      class="upload-icon"
                      src="/static/images/upload-plus.png"
                    />
                  </view>
                </template>
              </u-upload>
            </view>
          </view>
        </u-form-item>

        <!-- 联系人姓名 -->
        <u-form-item
          prop="contactPerson"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              联系人姓名
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.contactPerson"
              placeholder="秦泰"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
            />
          </view>
        </u-form-item>

        <!-- 手机号 -->
        <u-form-item
          prop="phoneNumber"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              手机号
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.phoneNumber"
              placeholder="19512344321"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="11"
              type="number"
            />
          </view>
        </u-form-item>
      </u--form>

      <!-- 保存按钮 -->
      <view class="btn-container flex-col" @click="submitInfo">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          保存信息
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';

/* 上传容器 */
.upload-container {
  margin-top: 16rpx;
}

/* 上传项包装器 */
.upload-item-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 自定义上传插槽 */
.upload-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1.5px dashed rgba(238, 238, 238, 1);
  border-radius: 16rpx;
  width: 320rpx;
  height: 200rpx;
  padding: 23rpx 31rpx 23rpx 32rpx;
}

/* 头像上传插槽 */
.avatar-upload-slot {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  padding: 0;
}

/* 上传图标 */
.upload-icon {
  width: 48rpx;
  height: 48rpx;
}

/* 上传插槽文字 */
.upload-slot-text {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  font-weight: normal;
  line-height: 34rpx;
  margin-top: 24rpx;
  text-align: center;
}
</style>
