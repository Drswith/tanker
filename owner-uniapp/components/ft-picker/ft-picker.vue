<template>
	<view>
		<view class="bg-fff-1 br-16 flex-between" @click="show = !disabled">
			<u--text :text="text || value || placeholder" :color="value=='' ? '#c0c4cc':'#222' " size="26"
				lineHeight="40" :lines="1"></u--text>
			<u-icon v-if="!disabled" :name="show?'arrow-up':'arrow-down'" color="#c0c4cc" size="26"></u-icon>
		</view>
		<u-picker :disabled="disabled" :show="show" :title="title || placeholder" :loading="loading"
			:closeOnClickOverlay="closeOnClickOverlay" :columns="columns" :keyName="keyName" @cancel="show=false"
			@close="show=false" @confirm="confirm" itemHeight="80"></u-picker>
	</view>
</template>

<script>
	export default {
		name: "ft-picker",
		props: {
			placeholder: {
				type: String,
				default: '请选择',
			},
			value: {
				type: String,
				default: "",
			},
			keyName: {
				type: String,
				default: '',
			},
			columns: {
				type: Array,
				default () {
					return [];
				}
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			text: {
				type: String,
				default: '',
			},
			title: {
				type: String,
				default: '',
			},
			loading: {
				type: Boolean,
				default: false,
			},
			closeOnClickOverlay: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				show: false,
			};
		},
		methods: {
			clickPicker() {
				this.$emit('clickPicker');
			},
			confirm(e) {
				this.show = false;
				this.$emit("input", e.value[0].label);
				this.$emit('confirm', e.value[0]);
			},
		}
	};
</script>

<style>

</style>