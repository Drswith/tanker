<template>
	<view>
		
		<map class="map-view" id="map1" ref="map1" :show-location="false" :latitude="latitude" :longitude="longitude"
			scale="14">
			<text>vue</text>
		</map>
		
		
		
		<ww-bottom-drawerapp ref="drag" :proportionShow = 'proportionvc'  :dragHandleHeight = "handleHeight" :isExpand="mExpand"  @callExpand="onCallExpand" >
			<slot>
	
				<!-- 填充内容 -->
				<swiper :indicator-dots="indicatorDots"  :autoplay="autoplay" :interval="interval" :duration="duration"
				 :circular="circular" style="height:100rpx" >
					<swiper-item>
						<view class="swiper-item uni-bg-red">A</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-blue">B</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-badge-purple">C</view>
					</swiper-item>
				</swiper>
				
				<uni-grid :column="4" :highlight="false" :showBorder="false" @change="onChange">
					<uni-grid-item v-for="(item, index) in 12" :index="index" :key="index">
						<view class="grid-item-box" style="background-color: #fff;">
							<uni-icons type="image" :size="30" color="#777" />
							<text class="text">文本信息</text>
						</view>
					</uni-grid-item>
				</uni-grid>
				<!-- end -->
			</slot>

		</ww-bottom-drawerapp>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				proportionvc:0.5,//抽屉初始显示的位置，内容的百分比
				handleHeight:20,//抽屉顶部边框高度，可以设置0，隐藏
				mExpand:false,
				
				title: 'Hello',
				longitude: 116.3974770000,
				latitude: 39.9086920000,
				
				
				autoplay:true,
				interval:3000,
				duration:1000,
				indicatorDots:true,
				circular:true,
			}
		},
		onLoad() {

		},
		onReady() {
			//this.$refs.drag.initTop();
		},
		methods: {
			onChange(e) {
				let {
					index
				} = e.detail;
		       console.error(index);
				uni.showToast({
					title: `你点击了${index}`
				})
			},
			showApp(){
				uni.navigateTo({
					url:'app-map'
				})
			},
			onCallExpand(e) { //展开搜索的回调监听
			    
			   this.mExpand = e.value
			  
			   
			},
		}
	}
</script>

<style>
	page{
		background-color: #f3f3f3;
	}
	.map-view {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}
	.swiper-item{
		   height: 100rpx;
		   display: block;
		   line-height: 100rpx;
		   text-align: center;
	}
</style>
