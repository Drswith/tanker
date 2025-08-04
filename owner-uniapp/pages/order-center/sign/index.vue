<script>
import { orderApi } from '@/api/order'
import baseUrl from '@/utils/baseUrl.js'

export default {
  data() {
    return {
      showSign: false, // 是否显示签字板 仅微信小程序需要该配置
      signBase64: '',
      signTempimg: '',
      showPopup: false,
      signUrl: '',
      contractId: '',
    }
  },
  onLoad(options) {
    if (!options.orderId) {
      uni.showToast({
        title: '参数错误',
        icon: 'none',
      })
      return
    }
    this.contractId = options.orderId
  },
  mounted() {
    // 监听签名图片
    uni.$on('getSignImg', (e) => {
      // 多签名场景下可根据 sid 区分不同签名
      if (e.sid === 'sign-board-popup') {
        this.signBase64 = e.base64
        this.signTempimg = e.path
        this.uploadFile(e.path)
      }
      // 一定注意不能确认签字完成后立马关闭弹窗，否则签字板会销毁，无法获取签名。需要等签名正确获取到之后再关闭弹窗
      this.close()
    })
  },
  methods: {
    // 上传签名
    uploadFile(url) {
      let that = this
      uni.uploadFile({
        url: `${baseUrl}/api/upload/file`,
        filePath: url,
        name: 'file',
        header: {
          Authorization: uni.getStorageSync('token'),
        },
        formData: {
          fileStorageTypeCode: 'contract_signature', // 签名
          targetId: uni.getStorageSync('userInfo').companyId,
        },
        success: (res) => {
          that.signUrl = JSON.parse(res.data).data
        },
      })
    },

    // 签署合同
    // signContract() {
    //   this.httpApi.signContract(this.contractId, {
    //     imgPath: this.signUrl,
    //   }).then((res) => {
    //     uni.$u.toast('签署成功!')
    //     setTimeout(() => {
    //       this.$com.goBack(true, 'getContractDetail')
    //     }, 800)
    //   })
    // },
    async signContract() {
      uni.showLoading({
        title: '签署中...',
      })
      try {
        await orderApi.signContract({
          id: Number.parseInt(this.contractId),
          imgPath: this.signUrl,
        })
        uni.hideLoading()
        uni.showToast({
          title: '签署成功!',
          icon: 'success',
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/order-center/list/index',
          })
        }, 1500)
      }
      catch (error) {
        console.error(error)
        uni.showToast({
          title: error.message,
          icon: 'none',
        })
      }
      finally {
        uni.hideLoading()
      }
    },

    // 打开弹窗
    open() {
      this.showPopup = true
      this.$nextTick(() => {
        this.showSign = true // 微信小程序需要此步骤来初始化签字板
        uni.showToast({
          title: '请横屏签字',
          icon: 'none',
        })
      })
    },

    // 关闭弹窗
    close() {
      this.showPopup = false
      this.$nextTick(() => {
        this.showSign = false // 微信小程序需要此步骤来销毁签字板
      })
    },

    // 重置签名
    reset() {
      this.$refs.signBoardRef.reset()
    },

    // 确认签名
    confirm() {
      this.$refs.signBoardRef.confirm()
      // 一定注意不能确认签字完成后立马关闭弹窗，否则签字板会销毁，无法获取签名。需要等签名正确获取到之后再关闭弹窗
    },
  },
}
</script>

<template>
  <view class="exmaple2">
    <view class="btn w-660 mg-x-center">
      <u-button
        color="#3AC8FF" custom-style="border-radius: 20rpx; font-size: 28rpx; height: 83rpx;"
        @click="open()"
      >
        打开签字板
      </u-button>
    </view>
    <view class="sign-preview">
      <image v-if="signBase64" class="sign-image" :src="signBase64" mode="widthFix" />
      <view v-else>
        签名预览
      </view>
    </view>
    <view v-if="signBase64" class="btn w-660 mg-x-center mt-40 h-140">
      <u-button
        color="#3AC8FF" custom-style="border-radius: 20rpx; font-size: 28rpx; height: 83rpx;"
        @click="signContract()"
      >
        确认签署
      </u-button>
    </view>
    <!-- 弹窗 -->
    <u-popup :show="showPopup" mode="left" :custom-style="{ width: '100vw', height: '100vh' }">
      <view class="sign-popup">
        <!-- 自定义控制栏 -->
        <!-- <view class="sign-control">
					<button size="mini" type="default" @click="close">关闭</button>
					<button size="mini" type="warn" @click="reset">重置</button>
					<button size="mini" type="primary" @click="confirm">确认</button>
				</view> -->
        <!-- 签字板 -->
        <view class="sign-box">
          <!-- :markText="['签字', 'sign']"  bgColor="#f8f8f8" -->
          <sp-sign-board
            v-if="showSign"
            ref="signBoardRef"
            sid="sign-board-popup"
            horizontal
            :need-back="false"
            :popup-mode="false"
            :exp-file="{ fileType: 'png' }"
            :pen-style="{ lineWidth: '6' }"
            @cancel="close"
          />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style>
	.exmaple2 {
		padding: 24rpx;
		box-sizing: border-box;
	}

	.sign-preview {
		min-height: 1000rpx;
		margin-top: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #66ccff;
		background-color: #f0f0f0;
		color: #bbbbbb;
	}

	.sign-image {
		width: 640rpx;
	}

	.sign-popup {
		background-color: #fff;
		height: 95vh;
		padding: 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.sign-control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.sign-box {
		flex: 1;
		border: solid 1rpx #adadad;
	}
</style>
