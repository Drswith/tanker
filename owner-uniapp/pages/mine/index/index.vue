<script>
export default {
  data() {
    return {
      loopData0: [
        {
          lanhuimage0:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2397a309bfdd2c470c051fc9eada3e75220596728e7d57a7b2f91c006287a40e',
          lanhutext0: '待接单',
        },
        {
          lanhuimage0:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng55dd74827c169a5be51f7fbe1ddb7773f0d19ecc56d59a8dd77b557c79516c13',
          lanhutext0: '待签署',
        },
        {
          lanhuimage0:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng90a751f8f31d31d87d05a10a63776a29c64f099c85a269f2b87ba72977afdfec',
          lanhutext0: '待签署',
        },
        {
          lanhuimage0:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb4be2172c087f0f90da85b3ae34ad4f5bdc4289502591f377baa2a08946d9d5a',
          lanhutext0: '运输中',
        },
        {
          lanhuimage0:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng8075be52a3e8361eecafb11cbee4ad9c489246763981c610d0b03436ecd4a344',
          lanhutext0: '已完成',
        },
      ],
      constants: {},
    }
  },
  methods: {},
}
</script>

<template>
  <view class="page flex-col">
    <view class="section_1 flex-col">
      <view class="group_1 flex-row">
        <text class="text_1">
          9:41
        </text>
        <image
          class="thumbnail_1"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng1be20f0eced1f466b6b4dc3a981fc6b52a4b9cf391debed94bcf2e01f7c38668"
        />
        <image
          class="thumbnail_2"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb3bbe96fea0140cfc24043ebc96677b3c6566f6cd0b99cb137439fb58271c764"
        />
        <image
          class="image_1"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPnga05957db16243a63d7c74f823baeb36bbafa63e1b3e30902724223c367fb5eeb"
        />
      </view>
      <view class="group_2 flex-row justify-between">
        <view class="text-group_15 flex-col">
          <text class="text_2">
            用户名称
          </text>
          <text class="text_3">
            1234455656
          </text>
        </view>
        <image
          class="thumbnail_3"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng209d720086f74ff3a27a8cd26fcd2ba41c2fc5b8828d8a8e7cdfa96993319601"
        />
      </view>
      <view class="section_4 flex-col">
        <text class="text_4">
          订单中心
        </text>
        <view class="list_4 flex-row">
          <view
            v-for="(item, index) in loopData0"
            :key="index"
            class="image-text_32 flex-col"
          >
            <image
              class="label_1"
              referrerpolicy="no-referrer"
              :src="item.lanhuimage0"
            />
            <text class="text-group_2" v-html="item.lanhutext0" />
          </view>
        </view>
      </view>
      <view class="image-wrapper_1 flex-col">
        <image
          class="label_2"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng73911c32192d604a909335e508be55d8d9423fac2e67a318832bff76de0b30ea"
        />
      </view>
    </view>
    <view class="section_5 flex-row">
      <view class="text-wrapper_5 flex-col">
        <text class="text_5">
          邀请好友
        </text>
        <text class="text_6">
          邀请码：123445
        </text>
      </view>
      <view class="text-wrapper_2 flex-col">
        <text class="text_7">
          立即邀请
        </text>
      </view>
      <image
        class="image_2"
        referrerpolicy="no-referrer"
        src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng33446cd7385b513d338ccc0a92fef9ed0e63a16d039dcbb1899d452a75b5e15e"
      />
      <image
        class="image_3"
        referrerpolicy="no-referrer"
        src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng6805aec5d9b410cd404dd6907f2c519b7f09b5c1905ec88bd8ac7a330384b2bf"
      />
    </view>
    <view class="section_6 flex-col">
      <text class="text_8">
        其他功能
      </text>
      <view class="image-text_33 flex-row justify-between">
        <image
          class="thumbnail_4"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngf3ed587ee3759c09b25ccd4c02cfff64872a7688489c1af754c42bc630141d40"
        />
        <text class="text-group_3">
          邀请记录
        </text>
      </view>
      <view class="image-text_34 flex-row justify-between">
        <image
          class="thumbnail_5"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb0e9e25d3e5aebe69ecd065761817a4b42be64c1ec0e921e8c14e718cee486d4"
        />
        <text class="text-group_4">
          收货地址
        </text>
      </view>
      <view class="image-text_35 flex-row justify-between">
        <image
          class="thumbnail_6"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng3f894d0d10d4f57a02e0b4de9d698554d8bcaee0713248573ab8b0c3d434d1b4"
        />
        <text class="text-group_5">
          合作司机
        </text>
      </view>
      <view class="image-text_36 flex-row justify-between">
        <image
          class="thumbnail_9"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2c25b1710c1d7268e28d5223e71dd1d612002aa55fc5bde714cd8d542bf4370b"
        />
        <text class="text-group_14">
          修改密码
        </text>
      </view>
      <view class="image-text_37 flex-row justify-between">
        <image
          class="thumbnail_7"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngaf1ca6e3ac540c87475f461e1e53d142d82b49351a775475691a674ca8af1bc8"
        />
        <text class="text-group_6">
          电话客服
        </text>
      </view>
      <view class="image-text_38 flex-row justify-between">
        <image
          class="thumbnail_8"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngbafd1b78b789ebdd05b476634511a4b0f5b7340b202aa145f2575ac68ca8f208"
        />
        <text class="text-group_7">
          咨询反馈
        </text>
      </view>
    </view>
    <view class="section_7 flex-row justify-between">
      <view class="image-text_39 flex-col">
        <image
          class="label_3"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng570d1ab544c86ed348592752935a0afa3fdaedc710634807a68e3c20c49e64d3"
        />
        <text class="text-group_8">
          首页
        </text>
      </view>
      <view class="image-text_40 flex-col">
        <image
          class="label_4"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngdeb2f830dbb85db6727798f206dc1e72c05e8f5e93e9f0f598d3fbe66428353e"
        />
        <text class="text-group_9">
          现场实况
        </text>
      </view>
      <view class="image-text_41 flex-col">
        <image
          class="image_4"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngd0ce0666451ac438c0ace1419c39d2f8091aef8bd2c8ab095c018f6b8210034a"
        />
        <text class="text-group_10">
          订单中心
        </text>
      </view>
      <view class="image-text_42 flex-col">
        <image
          class="image_5"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng24f25d2ee9d9c6e9f386074118c2d933da89bbca291fb9cdfb5953325448096b"
        />
        <text class="text-group_11">
          我的
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
@import './index.rpx.css';
</style>
