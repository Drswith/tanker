<template>
	<view :class="tabsClass">
		<u-tabs :list="tabList" :current="val" @click="handleClick" :scrollable="scrollable" :lineHeight="lineHeight"
			:lineWidth="lineWidth" :lineColor="lineColor" :activeStyle="activeStyle" :inactiveStyle="inactiveStyle"
			:itemStyle="itemStyle"></u-tabs>
	</view>
</template>

<script>
	export default {
		name: "ft-tabs",
		props: {
			tabsClass: {
				type: String,
				default: "",
			},
			tabList: {
				type: Array,
				default: () => [],
			},
			value: {
				type: Number,
				default: 0,
			},
			scrollable: {
				type: Boolean,
				default: false,
			},
			lineHeight: {
				type: String,
				default: "8",
			},
			lineWidth: {
				type: String,
				default: "24",
			},

			lineColor: {
				type: String,
				default: "#FFF",
			},
			activeStyle: {
				type: Object,
				default: () => {
					return {
						color: "#fff",
						fontWeight: "bold",
					};
				}
			},
			inactiveStyle: {
				type: Object,
				default: () => {
					return {
						color: '#CBE4FF',
					};
				}
			},
			itemStyle: {
				type: Object,
				default: () => {
					return {
						padding: "0 20rpx 5rpx 20rpx",
						height: "70rpx",
						// width: "29%"
					};
				}
			},
		},
		data() {
			return {

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
			handleClick(e) {
				this.val = e.index;
				this.$emit("tab-click", e);
			}
		}

	};
</script>

<style lang="scss">

</style>