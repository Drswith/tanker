<!-- 导入地图 -->
<template>
	<view class="content">
		<view class="wrapperBox" v-show="show">
			<!-- #ifdef H5 -->
			<view id="wrapper"></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<map :latitude="latitude" :longitude="longitude" :markers="markers" style="width: 100%; height: 100%;"></map>
			<!-- #endif -->
		</view>
		<view :class="show ? 'listCard down' : 'listCard top'">
			<view class="list">
				<view class="title">当前订单</view>
				<view class="image" @click="down()">
					<image style="width: 20px; height: 20px; margin-left: -10px;"
						:src="show ? '/static/images/icon/top.png' : '/static/images/icon/down.png'"></image>
				</view>
				<!-- <view class="treetop"><text>运输中</text></view> -->
				<scroll-view :class="show ? 'scroll-container downS' : 'scroll-container top'" scroll-y @scroll="onScroll">
					<view class="card" v-for="(item, index) in orderList" :key="index">
						<view class="treetop"><text>运输中</text></view>
						<view class="card_item">
							<view>订单编号：{{ item.orderNo }}</view>
							<view class="flex">
								<view>车牌号码：<text id="text">{{ item.carNumber }}</text></view>
								<view style="margin-left: 20px;">已送达：<text id="text">{{ item.current }}</text></view>
							</view>
							<view>发车时间：<text id="text">{{ item.driverSignTime }}</text></view>
						</view>
					</view>
					<view style="height: 100px;"></view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>
	// #ifdef H5
	let mapObj = null; // 生成组件实例
	let agriculture = []; // 生成图标实例
	let marker = []; // 生成标点实例

	window.mapInit = function() { // 挂载地图实例
		mapObj = new TMap.Map("wrapper", {
			center: new TMap.LatLng(30.188034, 120.214237), // 地图初始坐标
			zoom: 14, // 缩放等级
			mapStyleId: 'style1', // 地图样式
			zoomControl: false, // 设置是否启用缩放控件
		});

		mapObj.on("click", function(evt) { // 地图全局事件
			// 这里是通过获取地图点击的位置，将该位置移动至中心点，后面会用上
			mapObj.setCenter(new TMap.LatLng(evt.latLng.getLat().toFixed(6), evt.latLng.getLng().toFixed(6)))
		})
	}
	// #endif

	export default {
		data() {
			return {
				key: 'DHZBZ-7MHY3-PF63K-O627C-I2GBE-DPFYX', // 换你自己的key
				page: 1,
				size: 10,
				orderList: [],
				dataList: [],
				iconItem: [],
			show: true,
			latitude: 30.188034,
			longitude: 120.214237,
			}
		},
		async onLoad() {
			this.getData()
		// #ifdef MP-WEIXIN
		await this.getMap();
		// #endif
		// #ifdef H5
			this.loadScrpit();
			// #endif
			// #ifdef H5
			let time = setInterval(() => { // 等待地图挂载
				if (mapObj != null) {
					clearInterval(time);
					this.setIcon(); // 挂载坐标图片信息
				}
			}, 100)
			// #endif
			await this.getMap()
			// #ifdef MP-WEIXIN
			this.setMapMarker(); // 数据加载后设置标记
			// #endif
		},
		created() {},
		methods: {
			down() {
				this.show = !this.show
			},
			// 初始化
			loadScrpit() { // 挂载js
				var script = document.createElement('script');
				script.src =
					`https://map.qq.com/api/gljs?v=1.exp&key=${this.key}&libraries=visualization&callback=mapInit`;
				document.body.appendChild(script);
			},
			setIcon() { // 创建标点图标
				agriculture = new TMap.MarkerStyle({ // 定义农业图标样式
					width: 52.5,
					height: 52.5,
					anchor: {x: 26.25, y: 26.25},
					image: '/static/images/icon/positioning.png'
				});
		},
		setMapMarker() { // 创建标点实例
				// #ifdef H5
				let geometries = [];
				for (let i = 0; i < this.iconItem.length; i++) {
					let obj = {
						"id": i,
						"styleId": this.iconItem[i].name,
						"position": new TMap.LatLng(this.iconItem[i].position[0], this.iconItem[i].position[1]),
						"properties": {"title": this.iconItem[i].name}
					}
					geometries.push(obj);
				}
				marker = new TMap.MultiMarker({
					id: 'marker-layer',
					map: mapObj,
					styles: {"agriculture": agriculture},
					geometries: geometries
				});
				// #endif
				// #ifdef MP-WEIXIN
				this.markers = this.iconItem.map((item, index) => ({
					id: index.toString(),
					latitude: item.position[0],
					longitude: item.position[1],
					iconPath: '/static/images/icon/positioning.png',
					width: 52.5,
					height: 52.5
				}));
				// #endif
			},
			async getMap() {
				let maps = await this.httpApi.usageMapCoordinates({})
				console.log('maps', maps)
				this.iconItem = maps.data.map((item, index) => {
				item.name = 'agriculture';
				item.position = [Number(item.position[0]), Number(item.position[1])];
				return item;
			});
		console.log('iconItem', this.iconItem);
		this.setMapMarker();
		},
		async getData() {
				// if (uni.getStorageSync('token')) {
				// 	let config = {
				// 		userKey: '15145645622',
				// 		password: '123456'
				// 	}
				// 	let res = await this.httpApi.usageLogin(config) // 登录
				// 	console.log('token', res.data.token)
				// 	uni.setStorageSync('token', res.data.token)
				// }
				let data = await this.httpApi.usageCurrentOrder({
					page: this.page,
					size: this.size,
				}); // 获取当前订单
				console.log('data', data.data.content)
				this.dataList = data.data.content;
				this.orderList = [...this.orderList, ...data.data.content]


			},
			onScroll(e) {
				// e.detail.scrollTop 是滚动距离
				// console.log('滚动位置：', e.detail.scrollTop);
				if (this.dataList.length >= this.size && e.detail.scrollTop > this.orderList.length * 90) {
					// console.log('滚动超过100px时的操作：', e.detail.scrollTop);
					this.page++
					this.getData();
				}
				// 可以在这里处理滚动逻辑，如：

			}
		}
	}
</script>

<style scoped lang="scss">
	@import "./index.scss";
	.wrapperBox {
	width: 100%;
	height: 50vh;
	position: relative;
}
.map {
	width: 100%;
	height: 100%;
}
</style>