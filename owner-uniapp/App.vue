<script>
export default {
  globalData: {
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
	@import './static/css/uni.css';
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "./uni_modules/uview-ui/index.scss";
	@import "./static/css/common.scss";
	@import "./static/css/base.scss";
</style>

<style>
	/*每个页面公共css */
</style>
