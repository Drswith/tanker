<script>
import { orderApi } from '@/api/order'

/**
 * 订单状态枚举映射
 *
 * 订单流程说明：
 * 0  - 已创建待支付
 * 1  - 已支付待接单
 * 2  - 已接单待签署（业主和平台）
 * 3  - 已签署司机前往发车地待验车
 * 4  - 验车通过待施封
 * 5  - 验车不通过
 * 6  - 完成施封待安装GPS
 * 7  - 完成GPS安装待司机签署
 * 8  - 司机已签署（运输中）
 * 9  - 司机确认送达待核验
 * 10 - 业主核验确认收货后待评价（用于查询）
 * 11 - 业主核验不通过
 * 12 - 已评价（用于前端查询）
 * 13 - 确认收货后待邮寄GPS
 * 14 - 已邮寄
 * 15 - 后台确认收到GPS订单结束
 * 16 - 已提交资料待退款
 * 17 - 已退款已取消
 */
const OrderStatus = Object.freeze({
  // 订单创建阶段
  Created: 0, // 已创建待支付
  Paid: 1, // 已支付待接单

  // 接单签署阶段
  Accepted: 2, // 已接单待签署（业主和平台）
  Signed: 3, // 已签署司机前往发车地待验车

  // 验车施封阶段
  Verified: 4, // 验车通过待施封
  Unverified: 5, // 验车不通过
  Sealed: 6, // 完成施封待安装GPS

  // GPS安装阶段
  GpsInstalled: 7, // 完成GPS安装待司机签署
  DriverSigned: 8, // 司机已签署（运输中）

  // 运输配送阶段
  DeliveryConfirmed: 9, // 司机确认送达待核验
  OwnerVerified: 10, // 业主核验确认收货后待评价
  OwnerRejected: 11, // 业主核验不通过
  Evaluated: 12, // 已评价（用于前端查询）

  // GPS回收阶段
  WaitingGpsReturn: 13, // 确认收货后待邮寄GPS
  GpsShipped: 14, // 已邮寄
  GpsReceived: 15, // 后台确认收到GPS订单结束

  // 退款取消阶段
  RefundSubmitted: 16, // 已提交资料待退款
  RefundCompleted: 17, // 已退款已取消
})

export default {
  data() {
    return {
      OrderStatus,
      // 标签栏数据 - 使用OrderStatus枚举替代硬编码数字
      tabList: [
        // 主要业务流程状态
        { name: '待接单', status: OrderStatus.Paid }, // 1 - 已支付待接单
        { name: '待支付', status: OrderStatus.Created }, // 0 - 已创建待支付
        { name: '待发车', status: OrderStatus.Signed }, // 3 - 已签署司机前往发车地待验车
        { name: '待签署', status: OrderStatus.Accepted }, // 2 - 已接单待签署（业主和平台）
        { name: '验车中', status: OrderStatus.Verified }, // 4 - 验车通过待施封
        { name: '验车失败', status: OrderStatus.Unverified }, // 5 - 验车不通过
        { name: 'GPS待安装', status: OrderStatus.Sealed }, // 6 - 完成施封待安装GPS
        { name: '待司机签署', status: OrderStatus.GpsInstalled }, // 7 - 完成GPS安装待司机签署
        { name: '运输中', status: OrderStatus.DriverSigned }, // 8 - 司机已签署（运输中）
        { name: '待核验', status: OrderStatus.DeliveryConfirmed }, // 9 - 司机确认送达待核验
        { name: '待评价', status: OrderStatus.OwnerVerified }, // 10 - 业主核验确认收货后待评价
        { name: '核验失败', status: OrderStatus.OwnerRejected }, // 11 - 业主核验不通过
        { name: '已评价', status: OrderStatus.Evaluated }, // 12 - 已评价（用于前端查询）
        { name: 'GPS待回收', status: OrderStatus.WaitingGpsReturn }, // 13 - 确认收货后待邮寄GPS
        { name: 'GPS已邮寄', status: OrderStatus.GpsShipped }, // 14 - 已邮寄
        { name: '已完成', status: OrderStatus.GpsReceived }, // 15 - 后台确认收到GPS订单结束
        { name: '待退款', status: OrderStatus.RefundSubmitted }, // 16 - 已提交资料待退款
        { name: '已取消', status: OrderStatus.RefundCompleted }, // 17 - 已退款已取消
      ],
      currentTab: 0,
      page: 1,
      size: 20,
      // 订单数据，实际可从接口获取
      orderDataList: [],
      dataList: [],
    }
  },
  computed: {
    // 根据当前标签筛选订单列表
    currentOrderList() {
      // 模拟，实际可根据不同标签逻辑复杂处理，比如接口按状态筛选
      return this.orderDataList
    },

    // 当前卡片角标
    currentStatusConfig() {
      const styleConfigs = {
        [OrderStatus.Accepted]: { background: 'linear-gradient(to right, #FD4641, #FD7966)' },
        [OrderStatus.Signed]: { background: 'linear-gradient(to right, #FD4641, #FD7966)' },
      }

      const style = styleConfigs[this.tabList[this.currentTab].status] || null
      if (style) {
        return { name: this.tabList[this.currentTab].name, style }
      }
      else {
        return { name: this.tabList[this.currentTab].name, style: { background: 'linear-gradient(to right, #0975FF, #62CBFD)' } }
      }
    },

    // 当前卡片按钮组
    currentCardButtonGroup() {
      const buttonGroups = [
        { name: '取消订单', class: '', handler: order => this.apiErrorToast(order) },
        { name: '修改订单', class: '', handler: order => this.handleEditOrder(order) },
        { name: '立即签署', class: '', handler: () => {} },
        { name: '订单进度', class: '', handler: () => {} },
        { name: '验收授权', class: '', handler: () => {} },
        { name: '确认收货', class: '', handler: () => {} },
        { name: '寄回GPS', class: '', handler: order => this.handleReturnGps(order) },
        { name: '立即评价', class: '', handler: order => this.handleEvaluateOrder(order) },
        { name: '删除订单', class: '', handler: order => this.apiErrorToast(order) },
        { name: '再来一单', class: '', handler: order => this.apiErrorToast(order) },
        { name: '立即支付', class: '', handler: order => this.handlePayOrder(order) },
      ]

      const statusButtonGroupMap = {
        [OrderStatus.Created]: buttonGroups.filter(item => ['取消订单', '立即支付'].includes(item.name)), // 0 - 已创建待支付
        [OrderStatus.Paid]: buttonGroups.filter(item => ['修改订单', '取消订单'].includes(item.name)), // 1 - 已支付待接单
        [OrderStatus.Accepted]: buttonGroups.filter(item => ['修改订单', '取消订单', '立即签署'].includes(item.name)), // 2 - 已接单待签署（业主和平台）
        [OrderStatus.Signed]: buttonGroups.filter(item => [].includes(item.name)), // 3 - 已签署待发车
        [OrderStatus.Verified]: buttonGroups.filter(item => ['寄回GPS'].includes(item.name)), // 4 - 验车通过待施封
        [OrderStatus.Unverified]: buttonGroups.filter(item => [].includes(item.name)), // 5 - 验车不通过
        [OrderStatus.Sealed]: buttonGroups.filter(item => [].includes(item.name)), // 6 - 完成施封待安装GPS
        [OrderStatus.GpsInstalled]: buttonGroups.filter(item => ['取消订单', '立即签署'].includes(item.name)), // 7 - 完成GPS安装待司机签署
        [OrderStatus.DriverSigned]: buttonGroups.filter(item => ['订单进度', '验收授权', '确认收货'].includes(item.name)), // 8 - 司机已签署（运输中）
        [OrderStatus.DeliveryConfirmed]: buttonGroups.filter(item => ['验收授权'].includes(item.name)), // 9 - 司机确认送达待核验
        [OrderStatus.OwnerVerified]: buttonGroups.filter(item => ['立即评价'].includes(item.name)), // 10 - 业主核验确认收货后待评价
        [OrderStatus.OwnerRejected]: buttonGroups.filter(item => [].includes(item.name)), // 11 - 业主核验不通过
        [OrderStatus.Evaluated]: buttonGroups.filter(item => [].includes(item.name)), // 12 - 已评价（用于前端查询）
        [OrderStatus.WaitingGpsReturn]: buttonGroups.filter(item => ['寄回GPS'].includes(item.name)), // 13 - 确认收货后待邮寄GPS
        [OrderStatus.GpsShipped]: buttonGroups.filter(item => [].includes(item.name)), // 14 - 已邮寄
        [OrderStatus.GpsReceived]: buttonGroups.filter(item => [].includes(item.name)), // 15 - 后台确认收到GPS订单结束
        [OrderStatus.RefundSubmitted]: buttonGroups.filter(item => ['删除订单'].includes(item.name)), // 16 - 已提交资料待退款
        [OrderStatus.RefundCompleted]: buttonGroups.filter(item => ['删除订单'].includes(item.name)), // 17 - 已退款已取消
      }

      // inject class
      console.log('this.tabList[this.currentTab].status', this.currentTab, this.tabList[this.currentTab].status, statusButtonGroupMap[this.tabList[this.currentTab].status])
      const result = statusButtonGroupMap[this.tabList[this.currentTab].status]?.reverse() || []
      for (let index = 0; index < result.length; index++) {
        const element = result[index]
        if (index === 1) {
          element.class = 'modify-btn'
        }
        else if (index === 2) {
          element.class = 'cancel-btn'
        }
        else {
          element.class = 'sign-btn'
        }
      }

      return result.reverse()
    },
  },
  async onShow() {
    this.dataList = await this.getOrder()
    this.orderDataList = this.dataList
  },
  methods: {
    apiErrorToast(params) {
      console.log('params', params)
      uni.showToast({
        title: '缺少API接口',
        icon: 'none',
      })
    },
    // 切换标签
    async changeTab({ index }) {
      console.log('changeTab', index)
      this.currentTab = index
      this.page = 1
      this.dataList = []
      this.orderDataList = []
      this.dataList = await this.getOrder()
      this.orderDataList = this.dataList
    },
    // 拨打电话
    callCustomNumber(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        fail: (err) => {
          uni.showToast({ title: `拨打失败: ${err.errMsg}`, icon: 'none' })
        },
      })
    },
    // 订单状态 0 已创建待支付 1 已支付待接单 2已接单待签署（业主和平台）
    // 3已签署司机前往发车地待验车 4 验车通过待施封 5 验车不通过 6 完成施封待安装gps
    // 7完成gps安装待司机签署 8司机已签署（运输中）9司机确认送达待核验 10业主核验确认收货后 待评价（用于查询）
    // 11业主核验不通过12 已评价(用于前端查询) 13确认收货后待邮寄gps 14已邮寄
    // 15后台确认收到gps订单结束 16已提交资料待退款 17已退款已取消
    async getOrder() {
      // if (uni.getStorageSync('token')) {
      // 	let config = {
      // 		userKey: '15145645622',
      // 		password: '123456'
      // 	}
      // 	let res = await this.httpApi.usageLogin(config) // 登录
      // 	console.log('token', res.data.token)
      // 	uni.setStorageSync('token', res.data.token)
      // }

      // let data = await this.httpApi.usageOrderList({
      const data = await orderApi.getOrderList({
        status: this.tabList[this.currentTab].status,
        page: this.page,
        size: this.size,
      })
      if (data?.content && Array.isArray(data.content)) {
        data.content.forEach((item) => {
          item.driverName = item.driverName ? item.driverName.substr(0, 1) : null
          item.deliveryName = item.deliveryName ? item.deliveryName.substr(0, 1) : null
        })
      }
      return data?.content || []
    },
    async onScroll(e) {
      // e.detail.scrollTop 是滚动距离
      console.log('滚动位置：', e.detail.scrollTop)
      if (this.dataList.length >= this.size && e.detail.scrollTop > this.orderList.length * 110) {
        this.page++
        this.dataList = await this.getOrder()
        this.orderDataList = [...this.orderDataList, ...this.dataList]
      }
      // if(this.show) {
      // 	if (this.orderList.length > this.size && e.detail.scrollTop > this.orderList.length * 90) {
      // 		// console.log('滚动超过100px时的操作：', e.detail.scrollTop);
      // 		this.getData();
      // 	}
      // } else {

      // }
      // 可以在这里处理滚动逻辑，如：
    },
    // 修改订单
    handleEditOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/add/index?id=${order.id}&orderData=${encodeURIComponent(JSON.stringify(order))}`,
      })
    },
    // 评价订单
    handleEvaluateOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/evaluate/index?id=${order.id}&orderData=${encodeURIComponent(JSON.stringify(order))}`,
      })
    },
    // 寄回GPS
    handleReturnGps(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/gps-return/index?id=${order.id}&orderData=${encodeURIComponent(JSON.stringify(order))}`,
      })
    },
    // 立即支付
    handlePayOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/pay/index?id=${order.id}&orderData=${encodeURIComponent(JSON.stringify(order))}`,
      })
    },
  },
}
</script>

<template>
  <view class="order-center">
    <view class="order-tabs">
      <u-tabs
        :current="currentTab"
        :list="tabList"
        line-color="transparent"
        :active-style="{
          fontWeight: '600',
          fontSize: '32rpx',
          color: '#333333',
          height: '44rpx',
          lineHeight: '44rpx',
          textAlign: 'left',
          fontStyle: 'normal',
          transform: 'translateY(-4rpx)',
          transition: 'all 0.1s ease-in-out',
        }"
        :inactive-style="{
          fontWeight: '500',
          fontSize: '24rpx',
          color: '#999999',
          height: '34rpx',
          lineHeight: '34rpx',
          textAlign: 'left',
          fontStyle: 'normal',
          transition: 'all 0.1s ease-in-out',
        }"
        item-style="padding-left: 16rpx; padding-right: 16rpx ;height: 44rpx;"
        @change="changeTab"
      />
    </view>

    <!-- 订单状态 0 已创建待支付 1 已支付待接单 2已接单待签署（业主和平台）
			3已签署司机前往发车地待验车 4 验车通过待施封 5 验车不通过 6 完成施封待安装gps
			7完成gps安装待司机签署 8司机已签署（运输中）9司机确认送达待核验 10业主核验确认收货后 待评价（用于查询）
			11业主核验不通过12 已评价(用于前端查询) 13确认收货后待邮寄gps 14已邮寄
			15后台确认收到gps订单结束 16已提交资料待退款 17已退款已取消 -->
    <scroll-view class="order" scroll-y @scroll="onScroll">
      <view v-for="(item, index) in orderDataList" :key="index" class="card">
        <view
          v-if="currentStatusConfig"
          class="treetop"
          :style="currentStatusConfig.style"
        >
          <text>{{ currentStatusConfig.name }}</text>
        </view>

        <view
          class="card_item" :style="{
            marginBottom: (currentTab === OrderStatus.Accepted || currentTab === OrderStatus.GpsInstalled) ? '90rpx' : '30rpx',
          }"
        >
          <view>
            <view class="text_right">
              订单编号：
            </view>{{ item.orderNo }}
          </view>
          <view class="flex">
            <view>
              <view class="text_right">
                购买数量：
              </view><text id="text" style="color:#000000;">
                {{ item.buyCount }} 吨
              </text>
            </view>
            <view style="margin-left: 40rpx;">
              下单时间：<text id="text" style="color:#000000;">
                {{ item.placeOrderTime }}
              </text>
            </view>
          </view>
          <view>
            <view class="text_right">
              司机：
            </view><text id="text" style="color:#000000;">
              {{ item.deliveryName ? `${item.deliveryName}师傅` : "" }}<text style="margin-left: 20rpx;">
                {{ item.deliveryMobile ? `(${item.deliveryMobile})` : "" }}
              </text>
            </text>
            <image
              v-show="item.deliveryMobile" style="width: 24rpx; height: 24rpx; margin-left: 10rpx;" src="/static/images/icon/phone.png"
              @click="callCustomNumber(item.deliveryMobile)"
            />
          </view>
          <view>
            <view class="text_right">
              发货员：
            </view><text id="text" style="color:#000000;">
              {{ item.driverName ? `${item.driverName}师傅` : "" }} <text style="margin-left: 20rpx;">
                {{ item.driverMobile ? `(${item.driverMobile})` : "" }}
              </text>
            </text>
            <image
              v-show="item.driverMobile" style="width: 24rpx; height: 24rpx; margin-left: 10rpx;" src="/static/images/icon/phone.png"
              @click="callCustomNumber(item.driverMobile)"
            />
          </view>

          <view v-if="currentCardButtonGroup.length > 0" class="button-group">
            <view v-for="(btn, btnIndex) in currentCardButtonGroup" :key="btnIndex" :class="btn.class" style="margin-left: 20rpx;" @click="() => btn.handler(item)">
              {{ btn.name }}
            </view>
          </view>
        </view>

        <view v-if="currentTab === OrderStatus.Accepted" class="notes">
          <text style="margin-left: 20rpx;">
            备注：平台服务协议
          </text>
        </view>
        <view v-else-if="currentTab === OrderStatus.GpsInstalled" class="notes">
          <text style="margin-left: 20rpx;">
            备注：司机承运协议
          </text>
        </view>
      </view>
      <view style="height: 100rpx;background-color: #F8F8F8;" />
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
  /* 订单中心页面主容器 */
.order-center {
	width: 100vw;
	min-height: 100vh;
	background-color: #F8F8F8;
	overflow: auto;
}

.order-tabs {
	background-color: #F8F8F8;
  padding: 32rpx 32rpx 0 32rpx;
	position: fixed;
	top: calc(88rpx + env(safe-area-inset-top));
	left: 0;
	right: 0;
	z-index: 100;
	height: calc(44rpx + 32rpx);
}

/* 订单列表滚动容器 */
.order {
	overflow: scroll;
	padding: calc(44rpx + 32rpx) 32rpx 0 32rpx;
}

/* 订单卡片容器 */
.card {
	margin-top: 10rpx;
	position: relative;
	z-index: 10;
}

/* 订单状态角标 */
.treetop {
	position: absolute;
	top: 0;
	right: 0;
	color: #fff;
	font-size: 20rpx;
	font-weight: 400;
	padding: 8rpx 20rpx;
	border-radius: 0 10rpx 0 10rpx;
}

/* 订单卡片内容 */
.order .card_item {
	padding: 20rpx;
	font-size: 24rpx;
	color: #C3C3C3;
	line-height: 60rpx;
	background: #FFFFFF;
	border: 2rpx solid #E5E5E5;
	box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(0,0,0,0.1);
	border-radius: 16rpx;
}

/* 弹性布局容器 */
.flex {
	display: flex;
	width: 100%;
	height: 60rpx;
	overflow: hidden;
}

/* 右对齐文本 */
.text_right {
	width: 140rpx;
	text-align: right;
	display: inline-block;
	font-size: 24rpx;
	font-weight: 300;
	color: #999999;
}

/* 订单备注信息 */
.notes {
	width: 100%;
	background-color: #FFF3E0;
	font-size: 24rpx;
	color: #797063;
	display: flex;
	align-items: center;
	box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(0,0,0,0.1);
	border-radius: 0rpx 0rpx 16rpx 16rpx;
	position: absolute;
	bottom: 0px;
	transform: translateY(calc(100% - 16rpx));
	z-index: -2;
	padding-top: 32rpx;
	padding-bottom: 16rpx;
}

/* 按钮组容器 */
.button-group {
	width: 100%;
	height: 60rpx;
	display: flex;
	justify-content: flex-end;
	margin-top: 20rpx;
}

/* 取消订单按钮样式 */
.cancel-btn {
	width: 160rpx;
	height: 100%;
	background-color: #E9E9E9;
	color: #AAAAAA;
	font-size: 24rpx;
	border-radius: 40rpx;
	margin: 0;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 修改订单按钮样式 */
.modify-btn {
	width: 160rpx;
	height: 100%;
	background-color: #fff;
	color: #EBA932;
	font-size: 24rpx;
	border: 2rpx solid #EBA932;
	border-radius: 40rpx;
	margin: 0;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 立即签署按钮样式 */
.sign-btn {
	width: 160rpx;
	height: 100%;
	background: linear-gradient(to right, #FFA600, #FFCD01);
	color: #fff;
	border-radius: 40rpx;
	font-size: 24rpx;
	margin: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
