<script>
export default {
  data() {
    return {
      shareImage: '',
      shareText: '邀请海报台可替换；\n海报必需内容：邀请者昵称、邀请码、二维码',
      inviterName: 'Xxxxx',
      inviteCode: 'QY8928',
    }
  },
  onLoad() {
    // 页面加载时的逻辑
  },
  methods: {
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
        title: '分享朋友圈123',
        query: {
          id: '123',
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
        <image class="share-image" :src="shareImage || '/static/images/kache.png'" mode="aspectFit" />
        <!-- 二维码 -->
        <view class="qr-code">
          <image class="qr-image" src="/static/images/icon/qr-code.svg" />
        </view>
        <!-- 邀请信息 -->
        <view class="invite-info">
          <text class="invite-text">
            邀请你加入 Xxxxx
          </text>
          <text class="invite-code">
            邀请码：{{ inviteCode }}
          </text>
        </view>
      </view>
    </view>

    <!-- 分享操作区域 -->
    <view class="share-actions flex-col">
      <text class="share-title">
        分享到:
      </text>

      <!-- 分享按钮组 -->
      <view class="share-buttons flex-row">
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
      </view>

      <!-- 取消按钮 -->
      <view class="cancel-button-wrapper flex-col">
        <text class="cancel-button-text">
          取消
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
