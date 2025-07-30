<script>
export default {
  data() {
    return {
      // 表单数据
      formData: {
        avatar: '', // 头像
        contactPerson: '秦泰', // 联系人姓名
        phoneNumber: '19512344321', // 手机号
        companyName: '穿石科技', // 公司全称
        companyShortName: '穿石', // 公司简称
        companyAddress: '浙江省xxxxxxxxx', // 公司地址
        businessLicense: '', // 营业执照
      },

      // 上传文件列表
      avatarFileList: [],
      licenseFileList: [],

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
      },

      // 常量配置
      constants: {
        PHONE_REGEX: /^1[3-9]\d{9}$/, // 手机号正则
        REQUIRED_FIELDS: ['contactPerson', 'phoneNumber', 'companyName'], // 必填字段
      },

      // 表单验证规则
      rules: {
        contactPerson: [
          {
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 10,
            message: '联系人姓名长度为2-10位',
            trigger: ['blur', 'change'],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change'],
          },
        ],
        companyName: [
          {
            required: true,
            message: '请输入公司全称',
            trigger: ['blur', 'change'],
          },
        ],
        companyShortName: [
          {
            required: false,
            message: '请输入公司简称',
            trigger: ['blur', 'change'],
          },
        ],
        companyAddress: [
          {
            required: false,
            message: '请输入公司地址',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  methods: {
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

    // 营业执照上传后处理
    afterReadLicense(event) {
      const { file } = event
      this.licenseFileList = [file]
      this.formData.businessLicense = file.url || file.path

      // TODO: 上传到服务器
      uni.showToast({
        title: '营业执照上传成功',
        icon: 'success',
      })
    },

    // 删除营业执照
    deleteLicense() {
      this.licenseFileList = []
      this.formData.businessLicense = ''
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

        // TODO: 调用保存信息接口
        // await this.httpApi.saveUserInfo(this.formData);

        uni.showToast({
          title: '保存成功',
          icon: 'success',
        })

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
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
      uni.navigateBack()
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
              maxlength="10"
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

        <!-- 公司全称 -->
        <u-form-item
          prop="companyName"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              公司全称
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.companyName"
              placeholder="穿石科技"
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

        <!-- 公司简称 -->
        <u-form-item
          prop="companyShortName"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              公司简称
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.companyShortName"
              placeholder="穿石"
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

        <!-- 公司地址 -->
        <u-form-item
          prop="companyAddress"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              公司地址
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.companyAddress"
              placeholder="浙江省xxxxxxxxx"
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

        <!-- 营业执照上传 -->
        <u-form-item
          prop="businessLicense"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              营业执照
            </text>
          </template>
          <view class="upload-container">
            <view class="upload-item-wrapper">
              <u-upload
                ref="licenseUpload"
                :file-list="licenseFileList"
                :max-count="1"
                :width="320"
                :height="200"
                @afterRead="afterReadLicense"
                @delete="deleteLicense"
              >
                <template #default>
                  <view class="upload-slot">
                    <image
                      class="upload-icon"
                      src="/static/images/upload-plus.png"
                    />
                    <text class="upload-slot-text">
                      上传营业执照
                    </text>
                  </view>
                </template>
              </u-upload>
            </view>
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
