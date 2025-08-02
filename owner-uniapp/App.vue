<script>
// #ifdef MP-WEIXIN
import QQMapWX from '@/utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
// #endif

// #ifdef H5 || MP-WEIXIN
const mapKey = 'D6ABZ-7O73L-UXXPG-E4RBT-S4GGE-5ABV5'
// #endif

export default {
  globalData: {
    os: 'unknown',
    mapKey,
    // 实例化腾讯地图API核心类
    // #ifdef MP-WEIXIN
    qqmapsdk: new QQMapWX({
      key: mapKey,
    }),
    // #endif

    delayedSearchTimeOutMs: 500, // 搜索延时
  },
  onLaunch() {
    console.log('App Launch')
    const deviceInfo = uni.getDeviceInfo()
    const isIos = deviceInfo.system.includes('iOS')
    const isAndroid = deviceInfo.system.includes('Android')
    const isHarmony = deviceInfo.system.includes('HarmonyOS')

    console.warn('[SYSTEM] 终端信息', deviceInfo)
    if (isIos) {
      console.warn('[SYSTEM] Running at ios')
      this.globalData.os = 'ios'
    }
    else if (isAndroid) {
      console.warn('[SYSTEM] Running at android')
      this.globalData.os = 'android'
    }
    else if (isHarmony) {
      console.warn('[SYSTEM] Running at harmony')
      this.globalData.os = 'harmony'
    }
    else {
      console.warn('[SYSTEM] unknown os')
    }
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  onUnload() {},
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
  @import './static/css/uni.css';
	@import "./static/css/common.scss";
	@import "./static/css/base.scss";
	@import "./static/css/button.scss";
</style>

<style>
	/*每个页面公共css */
</style>
