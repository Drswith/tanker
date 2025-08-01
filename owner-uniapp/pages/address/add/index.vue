<script>
import { addressApi } from '@/api/address'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        contactPerson: '', // 收货人姓名
        phoneNumber: '', // 收货人手机号
        region: '', // 地区
        detailAddress: '', // 详细地址
        postalCode: '', // 邮政编码
        isDefault: false, // 设为默认送货地址
      },

      // 页面状态
      pageState: {
        isLoading: false, // 加载状态
        isEdit: false, // 是否编辑模式
        addressId: null, // 地址ID（编辑时使用）
        submitting: false, // 提交状态
      },

      // 地区选择相关数据
      regionData: {
        province: '', // 省份
        city: '', // 城市
        district: '', // 区县
        addressCode: [], // 地址编码
      },

      // 常量配置
      constants: {
        PHONE_REGEX: /^1[3-9]\d{9}$/, // 手机号正则
        POSTAL_CODE_REGEX: /^\d{6}$/, // 邮政编码正则
      },

      visible: false,
      maskCloseAble: true,
      defaultValue: '',
      // defaultValue: ['河北省','唐山市','丰南区'],
      column: 3,

      // 表单验证规则
      rules: {
        contactPerson: [
          {
            required: true,
            message: '请输入收货人姓名',
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 10,
            message: '收货人姓名长度为2-10位',
            trigger: ['blur', 'change'],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入收货人手机号',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change'],
          },
        ],
        region: [
          {
            required: true,
            message: '请选择省/市/区',
            trigger: ['blur', 'change'],
          },
        ],
        detailAddress: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change'],
          },
          {
            min: 1,
            max: 100,
            message: '详细地址长度为1-100位',
            trigger: ['blur', 'change'],
          },
        ],
        postalCode: [
          {
            required: true,
            message: '请输入邮政编码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的邮政编码',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  computed: {
    // 地区选择显示文本
    regionDisplayText() {
      if (this.regionData.province && this.regionData.city && this.regionData.district) {
        return `${this.regionData.province} / ${this.regionData.city} / ${this.regionData.district}`
      }
      return '请选择地区'
    },
  },

  onLoad(options) {
    if (options.id) {
      this.pageState.isEdit = true
      this.pageState.addressId = options.id
      this.loadAddressDetail(options.id)
    }
  },

  methods: {
    // 加载地址详情（编辑时使用）
    async loadAddressDetail(id) {
      try {
        this.pageState.isLoading = true
        const address = await addressApi.getAddressDetail(id)
        console.log(address)
        this.formData = {
          contactPerson: address.name || '',
          phoneNumber: address.mobile || '',
          region: `${address.province || ''} ${address.city || ''} ${address.district || ''}`,
          detailAddress: address.address || '',
          postalCode: address.zip || '',
          isDefault: address.isDefault || false,
        }
        this.regionData = {
          province: address.province || '',
          city: address.city || '',
          district: address.district || '',
          addressCode: [address.addressCode || ''],
        }
        this.defaultValue = [address.province || '', address.city || '', address.district || '']
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

    // 选择城市
    selectRegion() {
      console.log('选择城市')
      this.visible = true
    },

    // 地区选择确认
    confirm(e) {
      console.log('地区选择确认:', e)
      this.visible = false

      if (e && e.code) {
        // 更新地区数据
        this.regionData.province = e.provinceName
        this.regionData.city = e.cityName
        this.regionData.district = e.areaName
        this.regionData.addressCode = [e.code] // 存储地区编码

        // 更新显示文本
        this.formData.region = e.name // 使用完整的地区名称
      }
    },

    // 地区选择取消
    cancel() {
      console.log('地区选择取消')
      this.visible = false
    },

    // 表单验证
    validateForm() {
      return this.$refs.uForm.validate()
    },

    // 提交地址信息
    async submitAddress() {
      try {
        // 表单验证
        const valid = await this.validateForm()
        if (!valid) {
          return
        }

        // 防止重复提交
        if (this.pageState.submitting) {
          return
        }

        this.pageState.submitting = true
        this.pageState.isLoading = true

        // 构建API请求数据
        const addressData = this.buildAddressData()

        if (this.pageState.isEdit) {
          // 编辑地址
          await addressApi.updateAddress({
            ...addressData,
            id: this.pageState.addressId,
          })

          uni.showToast({
            title: '编辑地址成功',
            icon: 'success',
          })
        }
        else {
          // 新增地址
          await addressApi.addAddress(addressData)

          uni.showToast({
            title: '新增地址成功',
            icon: 'success',
          })
        }

        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack()
        }, 1500)
      }
      catch (error) {
        console.error('提交地址失败:', error)
        uni.showToast({
          title: error.message || '操作失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
        this.pageState.submitting = false
      }
    },

    // 构建API请求数据
    buildAddressData() {
      return {
        name: this.formData.contactPerson, // 收货人姓名
        mobile: this.formData.phoneNumber, // 收货人手机号
        province: this.regionData.province, // 省份
        city: this.regionData.city, // 城市
        district: this.regionData.district, // 区县
        address: this.formData.detailAddress, // 详细地址
        zip: this.formData.postalCode, // 邮政编码
        isDefault: this.formData.isDefault, // 是否默认地址
        // addressCode: this.regionData.addressCode, // 地址编码
        extData: {}, // 扩展数据
      }
    },

    // 删除地址或清空表单
    async deleteAddress() {
      if (this.pageState.isEdit) {
        // 编辑模式：删除地址
        uni.showModal({
          title: '确认删除',
          content: '确定要删除这个地址吗？',
          success: async (res) => {
            if (res.confirm) {
              try {
                this.pageState.isLoading = true
                // TODO: 调用删除地址接口
                // await this.httpApi.deleteAddress(this.pageState.addressId);

                uni.showToast({
                  title: '删除成功',
                  icon: 'success',
                })

                setTimeout(() => {
                  this.navigateBack()
                }, 1500)
              }
              catch (error) {
                uni.showToast({
                  title: '删除失败，请重试',
                  icon: 'none',
                })
              }
              finally {
                this.pageState.isLoading = false
              }
            }
          },
        })
      }
      else {
        // 新增模式：清空表单
        uni.showModal({
          title: '确认清空',
          content: '确定要清空当前填写的内容吗？',
          success: (res) => {
            if (res.confirm) {
              this.formData = {
                contactPerson: '',
                phoneNumber: '',
                region: '',
                detailAddress: '',
                postalCode: '',
                isDefault: false,
              }
              uni.showToast({
                title: '已清空表单',
                icon: 'success',
              })
            }
          },
        })
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
        <!-- 收货人姓名 -->
        <u-form-item
          prop="contactPerson"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              姓名
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.contactPerson"
              placeholder="收货人姓名"
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

        <!-- 收货人手机号 -->
        <u-form-item
          prop="phoneNumber"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              电话
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.phoneNumber"
              placeholder="收货人手机号"
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

        <!-- 地区选择 -->
        <u-form-item
          prop="region"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              地区
            </text>
          </template>
          <view class="input-field flex-col" @click="selectRegion">
            <view class="address-input-field">
              <view>{{ regionDisplayText }}</view>
              <u-icon name="arrow-down-fill" size="28" />
            </view>
          </view>
        </u-form-item>

        <!-- 详细地址 -->
        <u-form-item
          prop="detailAddress"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              详细地址
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.detailAddress"
              placeholder="街道门牌、楼层房间号等信息"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="100"
            />
          </view>
        </u-form-item>

        <!-- 邮政编码 -->
        <u-form-item
          prop="postalCode"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              邮政编码
            </text>
          </template>
          <view class="input-field flex-col">
            <u--input
              v-model="formData.postalCode"
              placeholder="邮政编码"
              placeholder-style="color: #999999; font-size: 28rpx;"
              border="none"
              :custom-style="{
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: '28rpx',
                lineHeight: '40rpx',
              }"
              maxlength="6"
              type="number"
            />
          </view>
        </u-form-item>

        <!-- 设为默认送货地址 -->
        <u-form-item
          prop="isDefault"
          :border-bottom="false"
          class="form-item-custom"
        >
          <template #label>
            <text class="field-label">
              设为默认送货地址
            </text>
          </template>
          <view class="switch-field flex-col">
            <u-switch
              v-model="formData.isDefault"
              active-color="#52C41A"
              inactive-color="#E5E5E5"
              size="24"
            />
          </view>
        </u-form-item>
      </u--form>

      <!-- 保存按钮 -->
      <view
        class="btn-container flex-col"
        :class="{ 'btn-disabled': pageState.submitting }"
        @click="submitAddress"
      >
        <u-loading-icon
          v-if="pageState.isLoading"
          color="#ffffff"
          size="32"
          mode="circle"
        />
        <text v-else class="btn-text">
          {{ pageState.submitting ? '提交中...' : '保存' }}
        </text>
      </view>

      <!-- 删除按钮 -->
      <view
        class="btn-container-secondary flex-col"
        @click="deleteAddress"
      >
        <text class="btn-text-secondary">
          {{ pageState.isEdit ? '删除' : '清空' }}
        </text>
      </view>
    </view>
    <piaoyi-cityPicker :column="column" :default-value="defaultValue" :mask-close-able="maskCloseAble" :visible="visible" @confirm="confirm" @cancel="cancel" />
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';

/* 开关字段样式 */
.switch-field {
  background-color: #fff;
  border-radius: 16rpx;
  // border: 1.5px solid rgba(238, 238, 238, 1);
  margin: 16rpx 2rpx 0 0;
  width: 100%;
  // padding: 12rpx 18rpx;
  // display: flex;
  // align-items: center;
  // justify-content: flex-start;
  // height: 70rpx;
}

/* 按钮禁用状态样式 */
.btn-disabled {
  background: rgba(255, 209, 0, 0.6) !important;
  opacity: 0.6;
  pointer-events: none;
}

/* Secondary按钮样式 */
.btn-container-secondary {
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  border-radius: 48rpx;
  margin-top: 24rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-text-secondary {
  color: #666;
  font-size: 32rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 44rpx;
}
</style>
