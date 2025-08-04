<script>
import { userApi } from '@/api/user'
import { setToken, setTokenInfos, setUserInfo } from '@/utils/auth'

export default {
  data() {
    return {
      // 登录方式：'password' 或 'sms'
      loginType: 'password',

      // 协议同意状态
      isAgreed: false,

      // 表单数据
      formData: {
        phoneNumber: '', // 手机号
        password: '', // 密码
        verifyCode: '', // 验证码
      },

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
      },

      // 表单验证规则
      rules: {
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change'],
          },
        ],
        verifyCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },

  computed: {
    // 当前表单验证规则
    currentRules() {
      if (this.loginType === 'password') {
        return {
          phoneNumber: this.rules.phoneNumber,
          password: this.rules.password,
        }
      }
      else {
        return {
          phoneNumber: this.rules.phoneNumber,
          verifyCode: this.rules.verifyCode,
        }
      }
    },
  },

  methods: {
    // 切换登录方式
    switchLoginType(type) {
      this.loginType = type
      // 清空表单数据
      this.formData.password = ''
      this.formData.verifyCode = ''
      // 清除验证错误
      this.$nextTick(() => {
        this.$refs.uForm.clearValidate()
      })
    },

    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 发送验证码
    async sendVerificationCode() {
      if (!this.formData.phoneNumber) {
        uni.showToast({
          title: '请先输入手机号',
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
        await userApi.getVerifyCode({ mobile: this.formData.phoneNumber })
        uni.showToast({
          title: '验证码已发送',
          icon: 'success',
        })
      }
      catch (error) {
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

    // 登录
    async login() {
      try {
        // 检查是否同意协议
        if (!this.isAgreed) {
          uni.showToast({
            title: '请先同意用户协议和隐私政策',
            icon: 'none',
          })
          return
        }

        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        if (this.loginType === 'password') {
          const res = await userApi.login({
            userKey: this.formData.phoneNumber,
            password: this.formData.password,
          })
          console.log('登录结果', res)
          const { token, profile, tokenInfos } = res
          if (!token) {
            throw new Error('登录失败')
          }
          setToken(token)
          setTokenInfos(tokenInfos)
          setUserInfo(profile)
        }
        else {
          const res = await userApi.smsLogin({
            mobile: this.formData.phoneNumber,
            verifyCode: this.formData.verifyCode,
          })
          console.log('登录结果', res)
          const { token, token_infos, ...profile } = res
          if (!token) {
            throw new Error('登录失败')
          }
          setToken(token)
          setTokenInfos(token_infos)
          setUserInfo({ ...profile })
        }

        uni.reLaunch({
          url: '/pages/home/index/index',
        })
      }
      catch (error) {
        console.log(error)

        uni.showToast({
          title: error[0]?.message || error.errMsg || error.message || '登录失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // 跳转到注册页面
    navigateToRegister() {
      uni.navigateTo({
        url: '/pages/register/index/index',
      })
    },

    // 忘记密码
    forgotPassword() {
      uni.navigateTo({
        url: '/pages/change-password/index/index',
      })
    },

    // 打开用户协议
    openUserAgreement() {
      uni.navigateTo({
        url: '/pages/privacy-policy/index/index',
      })
    },

    // 打开隐私政策
    openPrivacyPolicy() {
      uni.navigateTo({
        url: '/pages/privacy-policy/index/index',
      })
    },

    // 切换协议同意状态
    toggleAgreement() {
      this.isAgreed = !this.isAgreed
    },
  },
}
</script>

<template>
  <view class="auth-page flex-col">
    <!-- 头部背景 -->
    <view class="header-container flex-col">
      <image
        class="header-logo"
        referrerpolicy="no-referrer"
        src="/static/images/kache.png"
      />
      <text class="page-title">
        欢迎登录
      </text>
    </view>

    <view class="form-container flex-col">
      <!-- uView 表单 -->
      <u--form
        ref="uForm"
        :model="formData"
        :rules="currentRules"
        label-position="top"
        :label-style="{ fontSize: '32rpx', fontWeight: '600', color: '#4D4E46', marginBottom: '16rpx' }"
        error-type="toast"
      >
        <!-- 手机号 -->
        <u-form-item
          prop="phoneNumber"
          :required="true"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <view class="field-label-required">
              <!-- <text class="required-asterisk">
                *
              </text> -->
              <text class="field-label">
                手机号
              </text>
            </view>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.phoneNumber"
              placeholder="请输入手机号"
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

        <!-- 验证码登录 -->
        <template v-if="loginType === 'sms'">
          <u-form-item
            prop="verifyCode"
            :required="true"
            :border-bottom="false"
            class="form-item-custom"
          >
            <template #label>
              <view class="field-label-required">
                <!-- <text class="required-asterisk">
                  *
                </text> -->
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
        </template>

        <!-- 密码登录 -->
        <template v-else>
          <u-form-item
            prop="password"
            :required="true"
            :border-bottom="false"
            class="form-item-custom"
          >
            <template #label>
              <view class="field-label-required">
                <!-- <text class="required-asterisk">
                  *
                </text> -->
                <text class="field-label">
                  密码登录
                </text>
              </view>
            </template>
            <view class="input-field flex-col">
              <u--input
                v-model="formData.password"
                placeholder="请输入密码"
                placeholder-style="color: #999999; font-size: 28rpx;"
                border="none"
                :custom-style="{
                  backgroundColor: 'transparent',
                  padding: '0',
                  fontSize: '28rpx',
                  lineHeight: '40rpx',
                }"
                type="password"
              />
            </view>
          </u-form-item>
        </template>
      </u--form>

      <!-- 登录方式切换链接 -->
      <view class="login-switch-links flex-row justify-between" style="margin-bottom: 32rpx;">
        <!-- 左侧链接 -->
        <text
          v-if="loginType === 'sms'"
          class="switch-link"
          @click="switchLoginType('password')"
        >
          密码登录
        </text>
        <text
          v-else
          class="switch-link"
          @click="switchLoginType('sms')"
        >
          验证码登录
        </text>

        <!-- 右侧忘记密码链接 -->
        <text
          class="switch-link"
          @click="forgotPassword"
        >
          忘记密码？
        </text>
      </view>

      <!-- 登录按钮 -->
      <view class="btn-container flex-col" @click="login">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          登录
        </text>
      </view>

      <!-- 注册链接 -->
      <view class="link-container" @click="navigateToRegister">
        <text class="prefix-text">
          暂无账号，
        </text>
        <text class="link-text">
          立即注册
        </text>
      </view>

      <!-- 协议条款 -->
      <view class="agreement-container flex-row align-center">
        <view class="radio-container" @click="toggleAgreement">
          <view class="radio-icon" :class="{ checked: isAgreed }">
            <view v-if="isAgreed" class="radio-dot" />
          </view>
        </view>
        <view class="agreement-text-container flex-row flex-wrap">
          <text class="agreement-text">
            如您点击授权，您将同意并接受
            <text class="agreement-link" @click="openUserAgreement">
              《用户服务协议》
            </text>
            、
            <text class="agreement-link" @click="openPrivacyPolicy">
              《隐私政策》
            </text>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/auth.scss';
@import './index.rpx.css';
</style>
