<script>
const mock = [
  {
    id: 1,
    name: '实况1',
    src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
  },
]

export default {
  name: 'Live',
  data() {
    return {
      lives: [
        {
          id: 1,
          name: '实况1',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
      ],
      pageState: {
        isLoading: false,
      },
    }
  },
  onLoad() {
    this.loadLives()
  },
  methods: {
    async loadLives() {
      this.pageState.isLoading = true
      const data = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(mock)
        }, 1000)
      })
      console.log('data', data)
      this.lives = data || []
      this.pageState.isLoading = false
    },
    videoErrorCallback(e) {
      uni.showModal({
        content: e.target?.errMsg || '视频播放失败',
        showCancel: false,
      })
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code || '视频播放失败')
    },
    error(e) {
      console.error('live-player error:', e.detail.errMsg || '视频播放失败')
    },
  },
}
</script>

<template>
  <view class="live-page-container">
    <template v-if="pageState.isLoading">
      <view class="loading-container">
        <u-loadmore status="loading"></u-loadmore>
      </view>
    </template>

    <template v-else-if="lives.length === 0">
      <view class="empty-container">
        暂无实况数据
      </view>
    </template>
    <template v-else>
      <!-- #ifdef H5 -->
      <video
        v-for="(item, index) in lives"
        :id="`live_${item.id}`"
        :key="`live_${index}`"
        style="width: 100%; border-radius: 20rpx;margin-bottom: 20rpx;"
        :src="item.src"
        :name="item.name"
        controls
        @error="videoErrorCallback"
      />
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <live-player
        v-for="(item, index) in lives"
        :id="`live_${item.id}`"
        :key="`live_${index}`"
        :src="item.src"
        :name="item.name"
        autoplay
        style="width: 100%; border-radius: 20rpx;margin-bottom: 20rpx;"
        @statechange="statechange"
        @error="error"
      />
    <!-- #endif -->
    </template>
  </view>
</template>

<style scoped lang="scss">
.live-page-container {
  width: 100%;
  height: 100%;
  padding: 0 20rpx;
}

.loading-container {
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-container {
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
