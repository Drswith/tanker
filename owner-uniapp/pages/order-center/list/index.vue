<script>
import { orderApi } from '@/api'

export default {
  data() {
    return {
      // 标签栏数据
      // 0 已创建待支付 1 已支付待接单 2已接单待签署（业主和平台）
      // 3已签署司机前往发车地待验车 4 验车通过待施封 5 验车不通过 6 完成施封待安装gps
      tabList: [{
        title: '待接单',
        id: 1,
      }, {
        title: '待支付',
        id: 0,
      }, {
        title: '待发车',
        id: 3,
      }, {
        title: '待签署',
        id: 2,
      }, {
        title: '运输中',
        id: 4,
      }, {
        title: 'GPS待回收',
        id: 6,
      }],
      currentTab: 1, // 当前选中标签索引
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
            v-if="currentTab == 1" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待接单</text>
          </view>
          <view
            v-if="currentTab == 0" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待支付</text>
          </view>
          <view
            v-if="currentTab == 3" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待发车</text>
          </view>
          <view
            v-if="currentTab == 4" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>运输中</text>
          </view>
          <view
            v-if="currentTab == 6" class="treetop"
            style="background: linear-gradient(to right, #0975FF, #62CBFD);"
          >
            <text>待回收</text>
          </view>
          <view
            v-if="currentTab == 2" class="treetop"
            style="background: linear-gradient(to right, #FD4641, #FD7966);"
          >
            <text>待签署</text>
          </view>
          <view
            class="card_item" :style="{
              marginBottom: currentTab == 2 ? '45px' : '15px',
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
              <view v-if="currentTab == 2" class="sign-btn" style="margin-left: 10px;">
                立即签署
              </view>
              <view class="modify-btn" style="margin-left: 10px;">
                修改订单
              </view>
              <view class="cancel-btn">
                取消订单
              </view>
            </view>
          </view>
          <view v-if="currentTab == 2" class="notes">
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
