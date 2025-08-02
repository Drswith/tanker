<script>
// #ifdef MP-WEIXIN
import QQMapWX from '@/utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
// #endif

// #ifdef H5 || MP-WEIXIN
const mapKey = 'D6ABZ-7O73L-UXXPG-E4RBT-S4GGE-5ABV5'
// #endif

export default {
  globalData: {
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
</style>

<style>
	/*每个页面公共css */
</style>
