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
      // 标签栏数据 - 使用OrderStatus枚举替代硬编码数字
      tabList: [
        // 主要业务流程状态
        { title: '待支付', id: OrderStatus.Created }, // 0 - 已创建待支付
        { title: '待接单', id: OrderStatus.Paid }, // 1 - 已支付待接单
        { title: '待签署', id: OrderStatus.Accepted }, // 2 - 已接单待签署（业主和平台）
        { title: '待发车', id: OrderStatus.Signed }, // 3 - 已签署司机前往发车地待验车
        { title: '验车中', id: OrderStatus.Verified }, // 4 - 验车通过待施封
        { title: '验车失败', id: OrderStatus.Unverified }, // 5 - 验车不通过
        { title: 'GPS待安装', id: OrderStatus.Sealed }, // 6 - 完成施封待安装GPS
        { title: '待司机签署', id: OrderStatus.GpsInstalled }, // 7 - 完成GPS安装待司机签署
        { title: '运输中', id: OrderStatus.DriverSigned }, // 8 - 司机已签署（运输中）
        { title: '待核验', id: OrderStatus.DeliveryConfirmed }, // 9 - 司机确认送达待核验
        { title: '待评价', id: OrderStatus.OwnerVerified }, // 10 - 业主核验确认收货后待评价
        { title: '核验失败', id: OrderStatus.OwnerRejected }, // 11 - 业主核验不通过
        { title: '已评价', id: OrderStatus.Evaluated }, // 12 - 已评价（用于前端查询）
        { title: 'GPS待回收', id: OrderStatus.WaitingGpsReturn }, // 13 - 确认收货后待邮寄GPS
        { title: 'GPS已邮寄', id: OrderStatus.GpsShipped }, // 14 - 已邮寄
        { title: '已完成', id: OrderStatus.GpsReceived }, // 15 - 后台确认收到GPS订单结束
        { title: '待退款', id: OrderStatus.RefundSubmitted }, // 16 - 已提交资料待退款
        { title: '已取消', id: OrderStatus.RefundCompleted }, // 17 - 已退款已取消
      ],
      currentTab: OrderStatus.Paid, // 默认选中"待接单"状态
      page: 1,
      size: 10,
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
  onLoad() {
    this.getOrder()
  },
  methods: {
    // 切换标签
    switchTab(index) {
      this.currentTab = index
      this.page = 1
      this.getOrder()
      // 可在此处根据标签切换，调用接口重新获取对应状态订单数据等逻辑
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
      let data = await orderApi.getOrderList({
        status: this.currentTab,
        page: this.page,
        size: this.size,
      })
      if (data?.content && Array.isArray(data.content)) {
        data.content.forEach((item) => {
          item.driverName = item.driverName ? item.driverName.substr(0, 1) : null
          item.deliveryName = item.deliveryName ? item.deliveryName.substr(0, 1) : null
        })
      }

      this.dataList = data.content
      this.orderDataList = data.content
    },
    async onScroll(e) {
      // e.detail.scrollTop 是滚动距离
      console.log('滚动位置：', e.detail.scrollTop)
      if (this.dataList.length >= this.size && e.detail.scrollTop > this.orderList.length * 110) {
        this.page++
        let data = await this.httpApi.usageOrderList({
          status: this.currentTab,
          page: this.page,
          size: this.size,
        })
        if (data?.data?.content && Array.isArray(data.data.content)) {
          data.data.content.forEach((item) => {
            item.driverName = item.driverName ? item.driverName.substr(0, 1) : null
            item.deliveryName = item.deliveryName ? item.deliveryName.substr(0, 1) : null
          })
        }
        this.dataList = data.data.content
        this.orderDataList = [...this.orderDataList, ...data.data.content]
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
  },
}
</script>

<template>
  <view class="order-center">
    <view class="context">
      <!-- 标签栏 -->
      <view class="tab-bar">
        <view
          v-for="(item, index) in tabList" :key="index" class="tab-item"
          :class="{ active: currentTab === item.id }" @click="switchTab(item.id)"
        >
          {{ item.title }}
        </view>
      </view>
      <!-- 订单状态 0 已创建待支付 1 已支付待接单 2已接单待签署（业主和平台）
			3已签署司机前往发车地待验车 4 验车通过待施封 5 验车不通过 6 完成施封待安装gps
			7完成gps安装待司机签署 8司机已签署（运输中）9司机确认送达待核验 10业主核验确认收货后 待评价（用于查询）
			11业主核验不通过12 已评价(用于前端查询) 13确认收货后待邮寄gps 14已邮寄
			15后台确认收到gps订单结束 16已提交资料待退款 17已退款已取消 -->
      <scroll-view class="order" scroll-y @scroll="onScroll">
        <view v-for="(item, index) in orderDataList" :key="index" class="card">
          <view
            v-if="currentTab === 1" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待接单</text>
          </view>
          <view
            v-if="currentTab === 0" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待支付</text>
          </view>
          <view
            v-if="currentTab === 3" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待发车</text>
          </view>
          <view
            v-if="currentTab === 4" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>运输中</text>
          </view>
          <view
            v-if="currentTab === 6" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待回收</text>
          </view>
          <view
            v-if="currentTab === 2" class="treetop"
            style="background: linear-gradient(to right, #FD4641, #FD7966);"
          >
            <text>待签署</text>
          </view>
          <view
            class="card_item" :style="{
              marginBottom: currentTab === 2 ? '45px' : '15px',
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
              <view style="margin-left: 20px;">
                下单时间：<text id="text" style="color:#000000;">
                  {{ item.placeOrderTime }}
                </text>
              </view>
            </view>
            <view>
              <view class="text_right">
                司机：
              </view><text id="text" style="color:#000000;">
                {{ item.deliveryName ? `${item.deliveryName}师傅` : "" }}<text style="margin-left: 10px;">
                  {{ item.deliveryMobile ? `(${item.deliveryMobile})` : "" }}
                </text>
              </text>
              <image
                v-show="item.deliveryMobile" style="width: 12px; height: 12px; margin-left: 5px;" src="/static/images/icon/phone.png"
                @click="callCustomNumber(item.deliveryMobile)"
              />
            </view>
            <view>
              <view class="text_right">
                发货员：
              </view><text id="text" style="color:#000000;">
                {{ item.driverName ? `${item.driverName}师傅` : "" }} <text style="margin-left: 10px;">
                  {{ item.driverMobile ? `(${item.driverMobile})` : "" }}
                </text>
              </text>
              <image
                v-show="item.driverMobile" style="width: 12px; height: 12px; margin-left: 5px;" src="/static/images/icon/phone.png"
                @click="callCustomNumber(item.driverMobile)"
              />
            </view>

            <view class="button-group">
              <view v-if="currentTab === 2" class="sign-btn" style="margin-left: 10px;">
                立即签署
              </view>
              <view class="modify-btn" style="margin-left: 10px;">
                修改订单
              </view>
              <view class="cancel-btn">
                取消订单
              </view>
              <view class="cancel-btn">
                订单进度
              </view>
              <view class="cancel-btn">
                验收授权
              </view>
              <view class="cancel-btn">
                确认收货
              </view>
              <view v-if="currentTab === 6" class="cancel-btn">
                寄回GPS
              </view>
              <view class="cancel-btn">
                立即评价
              </view>
            </view>
          </view>

          <view v-if="currentTab === 2" class="notes">
            <text style="margin-left: 10px;">
              备注：平台服务协议
            </text>
          </view>
        </view>
        <view style="height: 50px;background-color: #F8F8F8;" />
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
	@import "./index.scss";
</style>
