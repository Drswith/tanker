<script>
import { messageApi } from '@/api/message'

export default {
  name: '',

  components: {},
  props: {},
  data() {
    return {
      options1: [{
        text: '删除',
      }],
      dataList: [
        {
          id: 1,
          title: '测试消息',
          content: '这是一条测试消息',
          readStatus: 0,
          jumpPath: '/pages/home/index/index',
        },
        {
          id: 2,
          title: '测试消息2',
          content: '这是一条测试消息2',
          readStatus: 1,
          jumpPath: '/pages/home/index/index',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  onLoad() {},
  onShow() {},
  onReady() {},
  onUnload() {},
  methods: {
    // 获取数据
    queryList(pageNo, pageSize) {
      let config = {
        page: pageNo,
        size: pageSize,
      }
      // this.httpApi.getMsgList(config).then(res => {
      // 	this.$refs.paging.complete(res.data.content);
      // });
      messageApi.getMessageList(config).then((data) => {
        console.log('消息', data)
        this.$refs.paging.complete(data.content)
      })
      // this.$refs.paging.complete(this.dataList)
    },

    // 点击消息
    handleClick(item) {
      if (item.readStatus == 0) {
        // this.httpApi.readMsgItem(item.id).then(res => {
        // 	setTimeout(() => {
        // 		this.$refs.paging.refresh();
        // 	}, 800);
        // });
      }
      if (item.jumpPath) {
        this.$com.goPageByUrl(item.jumpPath)
      }
    },
    // 点击消息
    async handleClickSwipeItem(e) {
      console.log('点击消息', e)
      const id = e.name
      // 删除消息
      try {
        await messageApi.deleteMessage(id)
        console.log('删除消息成功')
        this.$refs.paging.refresh()
      }
      catch (error) {
        console.log('删除消息失败', error)
      }
    },
  },
}
</script>

<template>
  <view class="container">
    <z-paging ref="paging" v-model="dataList" @query="queryList">
      <u-swipe-action class="zpag mg-x-center mt-30">
        <u-swipe-action-item
          v-for="(item, index) in dataList"
          :key="index"
          class="zpag-item mb-27"
          :options="options1"
          :name="item.id"
          @click="handleClickSwipeItem"
        >
          <view class="flex-between pd-20">
            <view class="flex-y-center">
              <view class="pr">
                <u-image
                  :show-loading="true" :src="item.image" shape="circle" width="100"
                  height="100"
                />
                <u-badge
                  v-if="item.readStatus == 0" :is-dot="true" :offset="[0, 0]"
                  :absolute="true"
                />
              </view>
              <view class="ml-20">
                <u-text :text="item.title" size="28" line-height="42" color="#222" :lines="1" />
                <u-text
                  :text="item.content" size="24" line-height="36" color="#8C8C8C" :lines="2"
                  margin="10rpx 0 0 0"
                />
              </view>
            </view>
            <view class="flex-shrink-0">
              <u-text
                :text="$time.timeStringFilter(item.sendTime)" size="18" line-height="36"
                color="#8C8C8C"
              />
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
</style>
