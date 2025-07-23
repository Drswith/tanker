<template>
	<view>
		<view @click="showPicker" class="flex-between" :class="boxClass" :style="boxStyle">
			<!-- <view :class="textClass" :style="textStyle">{{ value || placeholder }}</view> -->
			<u--text :text=" value || placeholder" :color="value == '' ? '#c0c4cc':'#222'" size="26" lineHeight="40"
				:lines="1"></u--text>
			<view v-if="icon" class="ml-10" :class="iconClass" :style="iconStyle">
				<u-icon :name="icon | imghttp" :color="iconColor" :size="iconSize" />
			</view>
		</view>
		<u-datetime-picker :show="show" v-model="val" :mode="mode" :maxDate="maxDate" :minDate="minDate"
			:maxHour="maxHour" :minHour="minHour" :title="pickerTitle" itemHeight="80" :confirmColor="confirmColor"
			@confirm="handleConfirm" @cancel="show = false" @close="close" closeOnClickOverlay></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		name: "ft-datetime",
		props: {
			mode: {
				type: String,
				default: "date",
			},
			startDate: {
				type: String,
				default: "",
			},
			endDate: {
				type: String,
				default: "",
			},
			minHour: {
				type: Number,
				default: 0,
			},
			maxHour: {
				type: Number,
				default: 24,
			},
			value: {
				type: String,
				default: "",
			},
			defaultValue: {
				type: String,
				default: "",
			},
			placeholder: {
				type: String,
				default: "请选择",
			},
			boxClass: {
				type: String,
				default: "",
			},
			boxStyle: {
				type: [String, Object],
				default: () => {},
			},
			textClass: {
				type: String,
				default: "",
			},
			textStyle: {
				type: [String, Object],
				default: () => {},
			},
			iconClass: {
				type: String,
				default: "",
			},
			iconStyle: {
				type: [String, Object],
				default: () => {},
			},
			icon: {
				type: [String, Boolean],
				default: "arrow-down",
			},
			iconSize: {
				type: String,
				default: () => "26rpx",
			},
			iconColor: {
				type: String,
				default: () => "#c0c4cc",
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			confirmColor: {
				type: String,
				default: () => "",
			},
			pickerTitle: {
				type: String,
				default: () => "请选择",
			}
		},
		data() {
			return {
				show: false,
				val: 0,
			};
		},
		computed: {
			minDate() {
				let date = this.startDate || "1970-01-01";
				if (date === "today") {
					date = uni.$u.date();
				}
				const newTime = date.replace(/\\-/g, "/");
				return new Date(newTime).getTime();
			},
			maxDate() {
				let date = this.endDate || "2030-12-31";
				if (date === "today") {
					date = uni.$u.date();
				}
				const newTime = date.replace(/\\-/g, "/");
				return new Date(newTime).getTime();
			},
		},
		watch: {
			value: {
				handler(newVal) {
					const newTime = newVal.replace(/\\-/g, "/");
					if (this.mode !== "time") {
						if (newTime) {
							this.val = new Date(newTime).getTime();
						} else if (this.defaultValue) {
							const newDate = this.defaultValue.replace(/\\-/g, "/");
							this.val = new Date(newDate).getTime();
						} else {
							this.val = new Date().getTime();
						}
					} else {
						this.val = newTime;
					}
				},
				immediate: true,
			},
		},
		methods: {
			showPicker() {
				if (this.readonly) return;
				this.show = true;
			},
			handleConfirm({
				value,
				mode
			}) {
				const timeFormat = uni.$u.timeFormat;
				let val = "";
				switch (mode) {
					case "datetime":
						val = timeFormat(value, "yyyy-mm-dd hh:MM:ss");
						break;
					case "date":
						val = timeFormat(value, "yyyy-mm-dd");
						break;
					case "year-month":
						val = timeFormat(value, "yyyy-mm");
						break;
					case "time":
						val = value;
						break;
					default:
						break;
				}
				console.log("val", val);
				this.$emit("input", val);
				this.show = false;
			},
			close() {
				this.show = false;
			},
		},

	};
</script>

<style>

</style>