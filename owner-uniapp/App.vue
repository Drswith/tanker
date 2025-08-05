<script>
import { checkSystem } from '@/utils/os'

// #ifdef MP-WEIXIN
import QQMapWX from '@/utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
// #endif

const QQMapKey = 'D6ABZ-7O73L-UXXPG-E4RBT-S4GGE-5ABV5'

export default {
  globalData: {
    os: 'unknown',
    mapKey: QQMapKey,
    // 实例化腾讯地图API核心类
    // #ifdef MP-WEIXIN
    qqmapsdk: new QQMapWX({
      key: QQMapKey,
    }),
    // #endif

    delayedSearchTimeOutMs: 500, // 搜索延时
  },
  onLaunch(options) {
    console.log('App Launch', options)
    this.globalData.os = checkSystem()
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  onUnload() {},
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
