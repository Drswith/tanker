<script>
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
        orderNo: '',
        driverId: null,
      },

      // 订单数据
      orderData: null,
    }
  },
  computed: {

  },
  watch: {

  },
  onLoad(options) {
    this.routeParams.orderId = options.id
    this.routeParams.orderNo = options.orderNo || ''
    this.routeParams.driverId = options.driverId || null

    // 如果有传递的订单数据，直接使用
    if (options.orderData) {
      try {
        this.orderData = JSON.parse(decodeURIComponent(options.orderData))
        this.routeParams.orderNo = this.orderData.orderNo || ''
        this.routeParams.driverId = this.orderData.driverId || null
      }
      catch (error) {
        console.error('解析订单数据失败:', error)
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
}
</script>

<template>
  <div>
    check
  </div>
</template>

<style lang="scss" scoped>

</style>
