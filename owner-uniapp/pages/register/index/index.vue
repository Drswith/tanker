<script>
import { userApi } from '@/api/user'
import { request } from '@/utils/http'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        mobile: '', // 手机号
        verifyCode: '', // 验证码（用于前端显示，提交时作为查询参数）
        inviteCode: '', // 邀请码
        companyName: '', // 公司名称
        realName: '', // 联系人（真实姓名）
        companyAddress: '', // 公司地址
        businessLicense: '', // 营业执照
      },

      // 上传文件列表
      licenseFileList: [],

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
        isCodeSending: false, // 验证码发送状态
        codeCountdown: 0, // 验证码倒计时
        canSendCode: true, // 是否可以发送验证码
      },

      // 常量配置
      constants: {
        CODE_COUNTDOWN_TIME: 60, // 验证码倒计时时间（秒）
        PHONE_REGEX: /^1[3-9]\d{9}$/, // 手机号正则
        REQUIRED_FIELDS: ['mobile', 'companyName', 'realName'], // 必填字段
      },

      // 表单验证规则
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
        ],
        verifyCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change'],
          },
          {
            min: 4,
            max: 6,
            message: '验证码长度为4-6位',
            trigger: ['blur', 'change'],
          },
        ],
        companyName: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: ['blur', 'change'],
          },
        ],
        realName: [
          {
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  methods: {
    // 发送验证码
    async sendVerificationCode() {
      if (!this.formData.mobile) {
        uni.showToast({
          title: '请先输入手机号',
          icon: 'none',
        })
        return
      }

      if (!this.constants.PHONE_REGEX.test(this.formData.mobile)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }

      if (!this.pageState.canSendCode) {
        return
      }

      this.pageState.isCodeSending = true
      this.pageState.canSendCode = false
      this.pageState.codeCountdown = this.constants.CODE_COUNTDOWN_TIME

      // 开始倒计时
      const timer = setInterval(() => {
        this.pageState.codeCountdown--
        if (this.pageState.codeCountdown <= 0) {
          clearInterval(timer)
          this.pageState.canSendCode = true
          this.pageState.isCodeSending = false
        }
      }, 1000)

      try {
        // TODO: 调用发送验证码接口
        await userApi.getVerifyCode({ mobile: this.formData.mobile })
        uni.showToast({
          title: '验证码已发送',
          icon: 'success',
        })
      }
      catch (error) {
        console.error('发送验证码失败:', error)
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none',
        })
        clearInterval(timer)
        this.pageState.canSendCode = true
        this.pageState.isCodeSending = false
        this.pageState.codeCountdown = 0
      }
    },

    // 营业执照上传后处理
    async afterReadLicense(event) {
      const { file } = event
      console.log('营业执照上传:', file)

      // 验证文件
      if (!file) {
        uni.showToast({
          title: '未选择文件',
          icon: 'none',
        })
        return
      }

      try {
        // 使用file.path或file.url作为文件路径，优先使用path
        const filePath = file.path || file.url

        if (!filePath) {
          throw new Error('无法获取文件路径')
        }

        // 显示上传中状态
        uni.showLoading({
          title: '上传中...',
          mask: true,
        })

        const res = await request.upload('/api/upload/file', filePath)
        console.log('上传成功:', res)

        this.licenseFileList = [file]
        this.formData.businessLicense = res // request.upload已经返回data.data

        uni.hideLoading()
        uni.showToast({
          title: '营业执照上传成功',
          icon: 'success',
        })
      }
      catch (error) {
        console.error('上传失败:', error)
        uni.hideLoading()

        // 上传失败时清空文件列表
        this.licenseFileList = []
        this.formData.businessLicense = ''
      }
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

    // 提交注册
    async submitRegistration() {
      try {
        // const valid = await this.validateForm()
        // if (!valid) {
        //   return
        // }

        this.pageState.isLoading = true

        // 构建用户数据对象，排除verificationCode
        const userData = {
          mobile: this.formData.mobile,
          inviteCode: this.formData.inviteCode,
          companyName: this.formData.companyName,
          realName: this.formData.realName,
          companyAddress: this.formData.companyAddress,
          businessLicense: this.formData.businessLicense,
        }

        await userApi.register(userData, this.formData.verifyCode)

        uni.showToast({
          title: '已提交，待审核',
          icon: 'success',
        })

        // 延迟跳转到登录页面
        setTimeout(() => {
          this.navigateToLogin()
        }, 1500)
      }
      catch (error) {
        uni.showToast({
          title: error.message || '注册失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 跳转到登录页面
    navigateToLogin() {
      uni.navigateTo({
        url: '/pages/login/index/index',
      })
    },
  },
}
</script>

<template>
  <view class="auth-page flex-col">
    <!-- 头部 -->
    <view class="header-container flex-col">
      <image
        class="header-logo"
        referrerpolicy="no-referrer"
        src="/static/images/kache.png"
      />
      <text class="page-title">
        完善资料
      </text>
    </view>

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
        <!-- 手机号 -->
        <u-form-item
          prop="mobile"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                手机号
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.mobile"
              placeholder="请输入手机号码"
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

        <!-- 验证码 -->
        <u-form-item
          prop="verifyCode"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                验证码
              </text>
            </view>
          </template>
          <view class="input-field input-field--with-button flex-row justify-between">
            <u--input
              v-model="formData.verifyCode"
              placeholder="请输入验证码"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
                flex: '1',
              }"
              maxlength="6"
              type="number"
            />
            <text
              class="get-code-btn"
              :style="{ opacity: pageState.canSendCode ? 1 : 0.6 }"
              @click="sendVerificationCode"
            >
              {{ pageState.canSendCode ? '获取验证码' : `${pageState.codeCountdown}s` }}
            </text>
          </view>
        </u-form-item>

        <!-- 邀请码 -->
        <u-form-item
          prop="inviteCode"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              邀请码
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.inviteCode"
              placeholder="请输入邀请码"
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

        <!-- 公司名称 -->
        <u-form-item
          prop="companyName"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                公司名称
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.companyName"
              placeholder="请输入企业名称"
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

        <!-- 联系人 -->
        <u-form-item
          prop="realName"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <text class="required-asterisk">
                *
              </text>
              <text class="field-label">
                联系人
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.realName"
              placeholder="请输入联系人姓名"
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
              placeholder="请输入公司地址"
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
              上传营业执照
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

      <!-- 注册按钮 -->
      <view class="btn-container flex-col" @click="submitRegistration">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          立即注册
        </text>
      </view>

      <!-- 登录链接 -->
      <view class="link-container" @click="navigateToLogin">
        <text class="prefix-text">
          已有账号，
        </text>
        <text class="link-text">
          立即登录
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/auth.scss';
@import './index.rpx.css';
</style>
