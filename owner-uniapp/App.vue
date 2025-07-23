<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/static/css/common.scss";
	@import "@/static/css/base.scss";
</style>
<script>
	export default {
		globalData: {
			delayedSearchTimeOutMs: 500, //搜索延时
		},
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		onUnload() {},
		mounted() {
		},
		methods: {
		}
	};
</script>

<style>
	/*每个页面公共css */
</style>