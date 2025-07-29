<script>
export default {
  name: 'Live',
  components: {

  },
  props: {

  },
  data() {
    return {
      lives: [
        {
          id: 1,
          name: '实况1',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
        {
          id: 2,
          name: '实况2',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
        {
          id: 3,
          name: '实况3',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
        {
          id: 4,
          name: '实况4',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
        {
          id: 5,
          name: '实况5',
          src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
        },
      ],
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    videoErrorCallback(e) {
      uni.showModal({
        content: e.target.errMsg,
        showCancel: false,
      })
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code)
    },
    error(e) {
      console.error('live-player error:', e.detail.errMsg)
    },
  },
}
</script>

<template>
  <view class="live">
    <!-- #ifdef H5 -->
    <video
      v-for="item in lives"
      :id="`live${item.id}`"
      :key="item.id"
      style="width: 100%; border-radius: 20rpx;margin-bottom: 20rpx;"
      :src="item.src"
      :name="item.name"
      controls
      @error="videoErrorCallback"
    />
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <live-player
      v-for="item in lives"
      :id="`live${item.id}`"
      :key="item.id"
      :src="item.src"
      :name="item.name"
      autoplay
      style="width: 100%; border-radius: 20rpx;margin-bottom: 20rpx;"
      @statechange="statechange"
      @error="error"
    />
    <!-- #endif -->
  </view>
</template>

<style scoped>
@import './index.rpx.css';
</style>
