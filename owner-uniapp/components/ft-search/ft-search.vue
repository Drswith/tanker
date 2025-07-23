<template>
	<view class="mg-x-center" :class="searchClass">
		<u--input clearable v-model="val" :value="value" @change="delayedSearch" :placeholder="placeholder"
			:border="border" :shape="shape" :color="color" :fontSize="fontSize" :customStyle="customStyle">
			<template slot="prefix">
				<u-icon class="mr-20" :color="iconColor" :bold="iconBold" :size="iconSize" :name="iconName"
					@tap="searchReload"></u-icon>
			</template>
		</u--input>
	</view>
</template>

<script>
	export default {
		name: "ft-search",
		props: {
			value: {
				type: String,
				default: "",
			},
			searchClass: {
				type: String,
				default: "",
			},
			placeholder: {
				type: String,
				default: "请输入关键字搜索",
			},
			border: {
				type: String,
				default: "none",
			},
			shape: {
				type: String,
				default: "circle",
			},
			color: {
				type: String,
				default: "#FFF",
			},
			fontSize: {
				type: String,
				default: "28",
			},
			customStyle: {
				type: Object,
				default: () => {
					return {
						height: "80rpx",
						background: "rgba(51,51,51,0.8)",
						'border-radius': "42rpx",
						padding: "0 32rpx",
					};
				}
			},
			iconColor: {
				type: String,
				default: "#C5FF00",
			},
			iconBold: {
				type: Boolean,
				default: true
			},
			iconSize: {
				type: String,
				default: "44",
			},
			iconName: {
				type: String,
				default: "search",
			}
		},
		data() {
			return {
				delayedSearchTimeOutMs: getApp().globalData.delayedSearchTimeOutMs,
			};
		},
		computed: {
			val: {
				get() {
					return this.value;
				},
				set(value) {
					this.$emit("input", value);
				},
			},
		},
		methods: {

			//延时搜索
			delayedSearch: function() {
				clearTimeout(this.searchInputTimeOutId); //清除延时器
				this.searchInputTimeOutId = setTimeout(() => {
					this.searchReload();
				}, this.delayedSearchTimeOutMs);
			},

			searchReload: function() {
				this.$emit('search-reload', this.val);
			},

		}
	};
</script>

<style lang="scss">

</style>