<script>
import { orderApi } from '@/api/order'

export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      // 路由参数
      routeParams: {
        orderId: null,
      },

      // 订单数据
      orderData: null,

      // 页面状态
      pageState: {
        isLoading: false,
      },
    }
  },
  computed: {

  },
  watch: {

  },
  onLoad(options) {
    this.routeParams.orderId = options.id
    if (this.routeParams.orderId) {
      // 加载订单详情
      this.loadOrderDetail()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 加载订单详情
    async loadOrderDetail() {
      try {
        this.pageState.isLoading = true
        const response = await orderApi.getOrderDetail(this.routeParams.orderId)
        this.orderData = response
      }
      catch (error) {
        console.error('加载订单详情失败:', error)
        uni.showToast({
          title: '加载订单详情失败',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },
  },
}</script>

<template>
  <div>
    confirm
  </div>
</template>

<style lang="scss" scoped>

</style>
