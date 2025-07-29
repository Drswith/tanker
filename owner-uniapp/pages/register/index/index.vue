<script>
export default {
  data() {
    return {
      // 表单数据
      formData: {
        phoneNumber: '',        // 手机号
        verificationCode: '',   // 验证码
        invitationCode: '',     // 邀请码
        companyName: '',        // 公司名称
        contactPerson: '',      // 联系人
        companyAddress: '',     // 公司地址
        businessLicenseFront: null,  // 营业执照正面
        businessLicenseBack: null    // 营业执照反面
      },
      
      // 页面状态
      pageState: {
        isLoading: false,           // 加载状态
        isCodeSending: false,       // 验证码发送状态
        codeCountdown: 0,           // 验证码倒计时
        canSendCode: true           // 是否可以发送验证码
      },
      
      // 常量配置
      constants: {
        CODE_COUNTDOWN_TIME: 60,    // 验证码倒计时时间（秒）
        PHONE_REGEX: /^1[3-9]\d{9}$/, // 手机号正则
        REQUIRED_FIELDS: ['phoneNumber', 'companyName', 'contactPerson'] // 必填字段
      }
    }
  },
  
  methods: {
    // 发送验证码
    sendVerificationCode() {
      // TODO: 实现发送验证码逻辑
    },
    
    // 上传营业执照
    uploadBusinessLicense(type) {
      // TODO: 实现上传营业执照逻辑
      // type: 'front' | 'back'
    },
    
    // 表单验证
    validateForm() {
      // TODO: 实现表单验证逻辑
    },
    
    // 提交注册
    submitRegistration() {
      // TODO: 实现注册提交逻辑
    },
    
    // 跳转到登录页面
    navigateToLogin() {
      // TODO: 实现跳转到登录页面逻辑
    }
  }
}
</script>

<template>
  <view class="register-page flex-col">
    <view class="header-background flex-col">
      <image
        class="header-logo"
        referrerpolicy="no-referrer"
        src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPnga446dcdee06ac078a46859047640a4fe59b44edf2314c730c3a1a8bdd1ac9bb3"
      />
    </view>
    <view class="form-container flex-col">
      <view class="status-bar flex-row">
        <text class="status-time">
          9:41
        </text>
        <image
          class="signal-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng8942c772138d7a728a3cb4c176b8719697da171bb30fcde2f4e0dee330cf5c46"
        />
        <image
          class="wifi-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng844e2577a5d293008bc4c73d8eff6816403b8c9c20a53b2b16a20e293a52d5c0"
        />
        <image
          class="battery-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng94453512b80fc09beef7531f197aa618ef23723c1db4743928447c71bed4cb28"
        />
      </view>
      <text class="page-title">
        完善资料
      </text>
      <view class="field-label-required">
        <text class="required-asterisk">
          *
        </text>
        <text class="field-label">
          手机号
        </text>
      </view>
      <view class="input-field flex-col">
        <text class="input-placeholder">
          请输入手机号码
        </text>
      </view>
      <text class="verification-code-label">
        验证码
      </text>
      <view class="verification-input-container flex-row justify-between">
        <text class="verification-placeholder">
          请输入邀请码
        </text>
        <text class="get-code-btn">
          获取验证码
        </text>
      </view>
      <text class="invitation-code-label">
        邀请码
      </text>
      <view class="invitation-input-field flex-col">
        <text class="invitation-placeholder">
          请输入邀请码
        </text>
      </view>
      <view class="company-name-label-required">
        <text class="required-asterisk">
          *
        </text>
        <text class="field-label">
          公司名称
        </text>
      </view>
      <view class="company-input-field flex-col">
        <text class="company-placeholder">
          请输入企业名称
        </text>
      </view>
      <view class="contact-label-required">
        <text class="required-asterisk">
          *
        </text>
        <text class="field-label">
          联系人
        </text>
      </view>
      <view class="contact-input-field flex-col">
        <text class="contact-placeholder">
          请输入联系人姓名
        </text>
      </view>
      <text class="address-label">
        公司地址
      </text>
      <view class="address-input-field flex-col">
        <text class="address-placeholder">
          请输入公司地址
        </text>
      </view>
      <text class="license-upload-label">
        上传营业执照
      </text>
      <view class="license-upload-container flex-row justify-between">
        <view class="license-front-upload flex-row">
          <view class="upload-item flex-col">
            <image
              class="upload-icon"
              referrerpolicy="no-referrer"
              src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng3c4ff115d9aa28905fb2daa76a26d9b0e6b892a5713573d8b00909eaac162f02"
            />
            <text class="upload-text-front">
              上传营业执照正面
            </text>
          </view>
        </view>
        <view class="license-back-upload flex-row">
          <view class="upload-item flex-col">
            <image
              class="upload-icon"
              referrerpolicy="no-referrer"
              src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng3c4ff115d9aa28905fb2daa76a26d9b0e6b892a5713573d8b00909eaac162f02"
            />
            <text class="upload-text-back">
              上传营业执照反面
            </text>
          </view>
        </view>
      </view>
      <view class="register-btn-container flex-col">
        <text class="register-btn-text">
          立即注册
        </text>
      </view>
      <view class="login-link-container">
        <text class="login-prefix-text">
          已有账号，
        </text>
        <text class="login-link-text">
          立即登录
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
@import './index.rpx.css';
</style>
