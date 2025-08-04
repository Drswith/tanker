<script>
import { userApi } from '@/api/user'
import { setToken, setTokenInfos, setUserInfo } from '@/utils/auth'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        mobile: '', // 手机号
        verifyCode: '', // 验证码
        password: '',
        confirmPassword: '',
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
        ],
        password: [
          {
            required: true,
            message: '请输入新密码',
            trigger: ['blur', 'change'],
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: ['blur', 'change'],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return value === this.formData.password
            },
            message: '确认密码与新密码不一致',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
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
        await userApi.getVerifyCode({ mobile: this.formData.mobile })
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

    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交修改密码
    async submitChangePassword() {
      try {
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        this.pageState.isLoading = true

        // TODO: 调用注册接口
        // await this.httpApi.register(this.formData);

        uni.showToast({
          title: '注册成功',
          icon: 'success',
        })

        // 延迟跳转
        setTimeout(() => {
          uni.navigateBack()
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

  },
}
</script>

<template>
  <view class="auth-page flex-col">
    <view class="form-container flex-col">
      <!-- uView 表单 -->
      <u--form
        ref="uForm"
        :rules="rules"
        :model="formData"
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
          prop="verificationCode"
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
              v-model="formData.verificationCode"
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

        <!-- 新密码 -->
        <u-form-item
          prop="password"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              新密码
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.password"
              placeholder="请输入新密码"
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
        <!-- 确认密码 -->
        <u-form-item
          prop="confirmPassword"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              确认密码
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.confirmPassword"
              placeholder="请输入确认密码"
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
      </u--form>

      <!-- 提交按钮 -->
      <view class="btn-container flex-col" @click="submitRegistration">
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          提交
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';
@import './index.rpx.css';
</style>
