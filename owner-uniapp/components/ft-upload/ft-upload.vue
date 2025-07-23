<template>
	<view :class="className">
		<template v-if="!readonly">
			<view v-if="src != ''">
				<u-upload ref="upload" :fileList="fileList" @afterRead="afterRead" @delete="deleteFile" name="upload"
					:accept="accept" :uploadIcon="uploadIcon" :multiple="multiple" :maxCount="maxCount"
					:maxSize="maxSize" :width="width" :height="height">
					<u-image :src="src | imghttp" :width="customWidth" :height="customHeight"></u-image>
				</u-upload>
			</view>
			<view v-else>
				<u-upload ref="upload" :fileList="fileList" @afterRead="afterRead" @delete="deleteFile" name="upload"
					:accept="accept" :uploadIcon="uploadIcon" :multiple="multiple" :maxCount="maxCount"
					:maxSize="maxSize" :width="width" :height="height"></u-upload>
			</view>
		</template>
		<template v-else>
			<u-album v-if="fileList.length > 0" :urls="fileList" keyName="url" :multipleSize="customWidth"
				:singleSize="customWidth" space="16" :maxCount="maxCount" rowCount="6"></u-album>
		</template>
	</view>
</template>

<script>
	import baseUrl from '@/utils/baseUrl.js';
	export default {
		name: "ft-upload",
		components: {},
		props: {
			src: {
				type: String,
				default: "",
			},
			width: {
				type: [Number, String],
				default: 80,
			},
			height: {
				type: [Number, String],
				default: 80,
			},
			dir: {
				type: String,
				default: "default",
			},
			multiple: {
				type: Boolean,
				default: true,
			},
			maxCount: {
				type: Number,
				default: 9,
			},
			accept: {
				type: String,
				default: "image",
			},
			maxSize: {
				type: Number,
				default: 10 * 1024 * 1024,
			},
			value: {
				type: String,
				default: "",
			},
			fileType: {
				type: String,
				default: "",
			},
			returnType: {
				type: String,
				default: 'string', // 或者 'array'
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			className: {
				type: String,
				default: '', // 或者 'array'
			}
		},
		data() {
			return {
				fileList: [],
			};
		},
		computed: {
			uploadIcon() {
				if (this.accept === "video") {
					return "plus";
				}
				return "camera-fill";
			},
			customWidth() {
				return this.width + "rpx";
			},
			customHeight() {
				return this.height + "rpx";
			},
		},
		watch: {
			value() {
				this.setFieldList();
			},
		},
		created() {},
		mounted() {
			this.setFieldList();
		},
		methods: {
			// setFieldList() {
			// 	this.fileList = this.value ?
			// 		this.value.split(";").map((url) => ({
			// 			type: this.accept,
			// 			url,
			// 			status: "success",
			// 			message: "",
			// 		})) : [];
			// },
			setFieldList() {
				if (this.returnType === 'array') {
					// 如果是数组格式，并且this.value确实是数组才进行map操作
					if (Array.isArray(this.value)) {
						this.fileList = this.value.map(url => ({
							type: this.accept,
							url,
							status: 'success',
							message: ''
						}));
					} else if (typeof this.value === 'string') {
						this.fileList = this.value.split(",").filter(Boolean).map((url) => ({
							type: this.accept,
							url,
							status: 'success',
							message: '',
						}));
					} else {
						this.fileList = [];
					}
				} else {
					// 如果是字符串格式，直接按分号分割后处理
					this.fileList = typeof this.value === 'string' ?
						this.value.split(";").filter(Boolean).map((url) => ({
							type: this.accept,
							url,
							status: 'success',
							message: '',
						})) : [];
				}
			},

			//新增图片
			async afterRead(event) {
				const lists = [].concat(event.file);

				let fileListLen = this.fileList.length;
				lists.map((item) => {
					this.fileList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);
					let item = this.fileList[fileListLen];
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}));
					fileListLen++;
				}
				this.updateValue();
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: `${baseUrl}/api/upload/file`,
						filePath: url,
						name: 'file',
						header: {
							'Authorization': uni.getStorageSync('token')
						},
						formData: {
							'fileStorageTypeCode': this.fileType, //文件类型
							'targetId': uni.getStorageSync('userInfo').companyId,
						},
						success: (res) => {
							setTimeout(() => {
								resolve(JSON.parse(res.data).data);
							}, 1000);
						}
					});
				});
			},
			deleteFile(event) {
				let that = this;
				uni.showModal({
					title: '确认删除',
					confirmText: '删除',
					content: '确认删除当前项吗？',
					success: function(res) {
						if (res.confirm) {
							that.fileList.splice(event.index, 1);
							that.updateValue();
						}
					}
				});
			},
			updateValue() {
				const urls = this.fileList
					.filter((item) => item.status === "success")
					.map((item) => item.url);
				let value;
				if (this.returnType === 'array') {
					value = urls;
				} else {
					value = urls.join(";");
				}
				console.log("value", value);
				this.$emit("input", value);
			}
		},
	};
</script>

<style lang="scss" scoped></style>