<script>
import { orderApi, OrderStatus } from '@/api/order'
import Notes from './components/Notes.vue'
import Tag from './components/Tag.vue'

export default {
  components: {
    Tag,
    Notes,
  },
  data() {
    return {
      OrderStatus: Object.freeze(OrderStatus),
      // 标签栏数据 - 使用OrderStatus枚举替代硬编码数字
      tabList: Object.freeze([
        // 主要业务流程状态
        { name: '待支付', status: OrderStatus.Created, operations: ['取消订单', '立即支付'] }, // 0 - 已创建待支付
        { name: '待接单', status: OrderStatus.Paid, operations: ['取消订单', '立即支付'] }, // 1 - 已支付待接单
        { name: '待发车', status: OrderStatus.Signed, operations: [] }, // 3 - 已签署司机前往发车地待验车
        { name: '待签署', status: OrderStatus.Accepted, operations: ['取消订单', '修改订单', '立即签署'] }, // 2 - 已接单待签署（业主和平台）
        // { name: '验车中', status: OrderStatus.Verified , operations: ['寄回GPS'] }, // 4 - 验车通过待施封
        // { name: '验车失败', status: OrderStatus.Unverified , operations: [] }, // 5 - 验车不通过
        // { name: 'GPS待安装', status: OrderStatus.Sealed , operations: [] }, // 6 - 完成施封待安装GPS
        // { name: '待司机签署', status: OrderStatus.GpsInstalled , operations: [] }, // 7 - 完成GPS安装待司机签署
        { name: '运输中', status: OrderStatus.DriverSigned, operations: ['订单进度', '验收授权', '确认收货'] }, // 8 - 司机已签署（运输中）
        // { name: '待核验', status: OrderStatus.DeliveryConfirmed , operations: [] }, // 9 - 司机确认送达待核验
        { name: 'GPS待回收', status: OrderStatus.WaitingGpsReturn, operations: ['寄回GPS'] }, // 13 - 确认收货后待邮寄GPS
        { name: '待评价', status: OrderStatus.OwnerVerified, operations: ['立即评价'] }, // 10 - 业主核验确认收货后待评价
        // { name: '核验失败', status: OrderStatus.OwnerRejected , operations: [] }, // 11 - 业主核验不通过
        // { name: '已评价', status: OrderStatus.Evaluated , operations: [] }, // 12 - 已评价（用于前端查询）
        // { name: 'GPS已邮寄', status: OrderStatus.GpsShipped , operations: [] }, // 14 - 已邮寄
        { name: '已完成', status: OrderStatus.GpsReceived, operations: [] }, // 15 - 后台确认收到GPS订单结束
        // { name: '待退款', status: OrderStatus.RefundSubmitted , operations: [] }, // 16 - 已提交资料待退款
        { name: '已取消', status: OrderStatus.RefundCompleted, operations: ['删除订单'] }, // 17 - 已退款已取消
      ]),
      currentTab: 3,
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

      const payload = {
        page: this.page,
        size: this.size,
      }
      // 待评价特殊处理
      if (this.tabList[this.currentTab].status === OrderStatus.OwnerVerified) {
        payload.isEvaluate = 0 // 0 未评价 1 已评价
      }
      else {
        payload.status = this.tabList[this.currentTab].status
      }

      // let data = await this.httpApi.usageOrderList({
      const data = await orderApi.getOrderList(payload)

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
        url: `/pages/order-center/add/index?id=${order.id}`,
      })
    },
    // 签署订单
    async handleSignOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/sign/index?id=${order.id}`,
      })
    },
    // 订单进度
    handleOrderProgress(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/progress/index?id=${order.id}`,
      })
    },
    // 订单详情
    handleOrderDetail(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/detail/index?id=${order.id}`,
      })
    },
    // 验收授权
    handleCheckOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/check/index?id=${order.id}`,
      })
    },
    // 确认收货
    handleConfirmOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/confirm/index?id=${order.id}`,
      })
    },
    // 照片信息
    handleOrderPhoto(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/photo/index?id=${order.id}`,
      })
    },
    // 评价订单
    handleEvaluateOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/evaluate/index?id=${order.id}`,
      })
    },
    // 寄回GPS
    handleReturnGps(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/gps-return/index?id=${order.id}`,
      })
    },
    // 立即支付
    handlePayOrder(order) {
      console.log('order', order)
      uni.navigateTo({
        url: `/pages/order-center/pay/index?id=${order.id}`,
      })
    },
    // 取消订单
    async handleCancelOrder(order) {
      // 如果订单状态为0（已创建待支付），直接调用API取消
      if (order.status === OrderStatus.Created) {
        const res = await orderApi.cancelOrder({
          orderNo: order.orderNo,
        })
        console.log('res', res)
        uni.showToast({
          title: '取消订单成功',
          icon: 'success',
        })
        this.dataList = await this.getOrder()
        this.orderDataList = this.dataList
      }
      else {
        // 其他状态跳转到退款页面
        uni.navigateTo({
          url: `/pages/order-center/cancel/index?id=${order.id}`,
        })
      }
    },

    // 删除订单
    async handleDeleteOrder(order) {
      try {
        await orderApi.deleteOrder(order.id)
        uni.showToast({
          title: '删除订单成功',
          icon: 'success',
        })
        this.dataList = await this.getOrder()
        this.orderDataList = this.dataList
      }
      catch (error) {
        uni.showToast({
          title: '删除订单失败',
          icon: 'error',
        })
      }
    },

    getOperationButtonClass(index, totalLength) {
      // 计算倒数位置：0表示最后一个，1表示倒数第二个，2表示倒数第三个
      const reverseIndex = totalLength - 1 - index

      if (reverseIndex === 0) {
        return 'sign-btn' // 最后一个按钮
      }
      else if (reverseIndex === 1) {
        return 'modify-btn' // 倒数第二个按钮
      }
      else {
        return 'cancel-btn' // 倒数第三个及之前的所有按钮
      }
    },
    handleOperationButtonClick(order, btnName) {
      switch (btnName) {
        case '取消订单':
          this.handleCancelOrder(order)
          break
        case '修改订单':
          this.handleEditOrder(order)
          break
        case '立即签署':
          this.handleSignOrder(order)
          break
        case '订单进度':
          this.handleOrderProgress(order)
          break
        case '验收授权':
          this.handleCheckOrder(order)
          break
        case '确认收货':
          this.handleConfirmOrder(order)
          break
        case '寄回GPS':
          this.handleReturnGps(order)
          break
        case '立即评价':
          this.handleEvaluateOrder(order)
          break
        case '删除订单':
          this.handleDeleteOrder(order)
          break
        case '再来一单':
          this.apiErrorToast(order)
          break
        case '立即支付':
          this.handlePayOrder(order)
          break
        default:
          this.apiErrorToast(order)
          break
      }
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

    <scroll-view class="order" scroll-y @scroll="onScroll">
      <view v-for="(item, index) in orderDataList" :key="index" class="card">
        <Tag :status="item.status" :text="tabList[currentTab].name" />

        <view
          class="card_item" :style="{
            marginBottom: (item.status === OrderStatus.Accepted || item.status === OrderStatus.GpsInstalled) ? '90rpx' : '30rpx',
          }"
          @click="() => handleOrderDetail(item)"
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

          <!-- 订单操作按钮组 -->
          <view v-if="tabList[currentTab].operations.length > 0" class="button-group">
            <view v-for="(btn, btnIndex) in tabList[currentTab].operations" :key="btnIndex" :class="[getOperationButtonClass(btnIndex, tabList[currentTab].operations.length)]" style="margin-left: 20rpx;" @click.stop="handleOperationButtonClick(item, btn)">
              {{ btn }}
            </view>
          </view>
        </view>

        <Notes v-if="item" :status="item.status" />
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
page {
  background-color: #F8F8F8;
}
  /* 订单中心页面主容器 */
.order-center {
	width: 100vw;
  position: relative;
}

.order-tabs {
  padding: 32rpx 32rpx 0 32rpx;
	z-index: 100;
	height: calc(44rpx + 32rpx);
}

/* 订单列表滚动容器 */
.order {
	overflow: scroll;
	padding: 32rpx;
}

/* 订单卡片容器 */
.card {
	margin-top: 10rpx;
	position: relative;
	z-index: 10;
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
