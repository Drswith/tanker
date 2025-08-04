<script>
const mockImg = 'http://ottms.innoforce.cc/files/fef53f78-6644-4c97-9b4d-4dc83c0bcbd0.png'

export default {
  components: {
  },
  data() {
    return {
      shareImage: 'http://ottms.innoforce.cc/files/fef53f78-6644-4c97-9b4d-4dc83c0bcbd0.png',
      shareText: '邀请海报台可替换；\n海报必需内容：邀请者昵称、邀请码、二维码',
      inviterName: 'Xxxxx',
      inviteCode: 'QY8928',
    }
  },
  onLoad() {
    // 页面加载时的逻辑
    this.getShareImage().then((res) => {
      this.shareImage = res
    })
  },
  methods: {

    getShareImage() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockImg)
        }, 500)
      })
    },

    // 分享到微信
    shareToWeChat() {

    },

    // 分享到朋友圈
    shareToMoments() {

    },

    onShareAppMessage() {
      return {
        title: '分享好友123',
        path: '/index/index?id=123',
      }
    },

    onShareTimeline() {
      return {
        title: '分享朋友圈321',
        query: {
          id: '321',
        },
        imageUrl: this.shareImage,
      }
    },

    // 复制链接
    copyLink() {
      uni.setClipboardData({
        data: `邀请码：${this.inviteCode}`,
        success() {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
          })
        },
      })
    },

    // 下载图片
    downloadImage() {
      if (this.shareImage) {
        uni.downloadFile({
          url: this.shareImage,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  uni.showToast({
                    title: '保存成功',
                    icon: 'success',
                  })
                },
                fail() {
                  uni.showToast({
                    title: '保存失败',
                    icon: 'none',
                  })
                },
              })
            }
          },
        })
      }
    },

    // 取消分享
    cancelShare() {
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <view class="page flex-col">
    <!-- 分享内容区域 -->
    <view class="share-content flex-col">
      <!-- 分享图片 -->
      <view class="share-image-wrapper">
        <image :show-menu-by-longpress="true" class="share-image" :src="shareImage " mode="aspectFit" />
      </view>
    </view>

    <!-- 分享操作区域 -->
    <view class="share-actions flex-col">
      <!-- <text class="share-title">
        分享到:
      </text> -->

      <!-- 分享按钮组 -->
      <!-- <view class="share-buttons flex-row">
        <view class="share-button flex-col" @click="shareToWeChat">
          <image class="share-icon" src="/static/images/icon/wechat.svg" />
          <text class="share-label">
            微信
          </text>
        </view>

        <view class="share-button flex-col" @click="shareToMoments">
          <image class="share-icon" src="/static/images/icon/moments.svg" />
          <text class="share-label">
            朋友圈
          </text>
        </view>

        <view class="share-button flex-col" @click="copyLink">
          <image class="share-icon" src="/static/images/icon/link.svg" />
          <text class="share-label">
            复制链接
          </text>
        </view>

        <view class="share-button flex-col" @click="downloadImage">
          <image class="share-icon" src="/static/images/icon/download.svg" />
          <text class="share-label">
            下载图片
          </text>
        </view>
      </view> -->

      <button class="primary-button" open-type="share">
        分享到
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
