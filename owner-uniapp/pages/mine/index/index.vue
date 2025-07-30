<script>
export default {
  data() {
    return {
      orderStatusList: [
        {
          icon:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2397a309bfdd2c470c051fc9eada3e75220596728e7d57a7b2f91c006287a40e',
          label: '待接单',
        },
        {
          icon:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng55dd74827c169a5be51f7fbe1ddb7773f0d19ecc56d59a8dd77b557c79516c13',
          label: '待签署',
        },
        {
          icon:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng90a751f8f31d31d87d05a10a63776a29c64f099c85a269f2b87ba72977afdfec',
          label: '待签署',
        },
        {
          icon:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb4be2172c087f0f90da85b3ae34ad4f5bdc4289502591f377baa2a08946d9d5a',
          label: '运输中',
        },
        {
          icon:
            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng8075be52a3e8361eecafb11cbee4ad9c489246763981c610d0b03436ecd4a344',
          label: '已完成',
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
    <view class="header-section flex-col">
      <view class="status-bar flex-row">
        <text class="time-text">
          9:41
        </text>
        <image
          class="signal-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng1be20f0eced1f466b6b4dc3a981fc6b52a4b9cf391debed94bcf2e01f7c38668"
        />
        <image
          class="wifi-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb3bbe96fea0140cfc24043ebc96677b3c6566f6cd0b99cb137439fb58271c764"
        />
        <image
          class="battery-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPnga05957db16243a63d7c74f823baeb36bbafa63e1b3e30902724223c367fb5eeb"
        />
      </view>
      <view class="user-info flex-row justify-between">
        <view class="user-details flex-col">
          <text class="username">
            用户名称
          </text>
          <text class="user-id">
            1234455656
          </text>
        </view>
        <image
          class="arrow-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng209d720086f74ff3a27a8cd26fcd2ba41c2fc5b8828d8a8e7cdfa96993319601"
        />
      </view>
      <view class="order-center-section flex-col">
        <text class="section-title">
          订单中心
        </text>
        <view class="order-status-list flex-row">
          <view
            v-for="(item, index) in orderStatusList"
            :key="index"
            class="order-status-item flex-col"
          >
            <image
              class="status-icon"
              referrerpolicy="no-referrer"
              :src="item.icon"
            />
            <text class="status-label" v-html="item.label" />
          </view>
        </view>
      </view>
      <view class="avatar-wrapper flex-col">
        <image
          class="user-avatar"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng73911c32192d604a909335e508be55d8d9423fac2e67a318832bff76de0b30ea"
        />
      </view>
    </view>
    <view class="invite-section flex-row">
      <view class="invite-info flex-col">
        <text class="invite-title">
          邀请好友
        </text>
        <text class="invite-code">
          邀请码：123445
        </text>
      </view>
      <view class="invite-button flex-col">
        <text class="invite-btn-text">
          立即邀请
        </text>
      </view>
      <image
        class="invite-decoration"
        referrerpolicy="no-referrer"
        src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng33446cd7385b513d338ccc0a92fef9ed0e63a16d039dcbb1899d452a75b5e15e"
      />
      <image
        class="invite-bg-image"
        referrerpolicy="no-referrer"
        src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng6805aec5d9b410cd404dd6907f2c519b7f09b5c1905ec88bd8ac7a330384b2bf"
      />
    </view>
    <view class="features-section flex-col">
      <text class="section-title">
        其他功能
      </text>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngf3ed587ee3759c09b25ccd4c02cfff64872a7688489c1af754c42bc630141d40"
        />
        <text class="feature-label">
          邀请记录
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb0e9e25d3e5aebe69ecd065761817a4b42be64c1ec0e921e8c14e718cee486d4"
        />
        <text class="feature-label">
          收货地址
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng3f894d0d10d4f57a02e0b4de9d698554d8bcaee0713248573ab8b0c3d434d1b4"
        />
        <text class="feature-label">
          合作司机
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2c25b1710c1d7268e28d5223e71dd1d612002aa55fc5bde714cd8d542bf4370b"
        />
        <text class="feature-label">
          修改密码
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngaf1ca6e3ac540c87475f461e1e53d142d82b49351a775475691a674ca8af1bc8"
        />
        <text class="feature-label">
          电话客服
        </text>
      </view>
      <view class="feature-item flex-row justify-between">
        <image
          class="feature-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngbafd1b78b789ebdd05b476634511a4b0f5b7340b202aa145f2575ac68ca8f208"
        />
        <text class="feature-label">
          咨询反馈
        </text>
      </view>
    </view>
    <view class="bottom-navigation flex-row justify-between">
      <view class="nav-item flex-col">
        <image
          class="nav-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng570d1ab544c86ed348592752935a0afa3fdaedc710634807a68e3c20c49e64d3"
        />
        <text class="nav-label">
          首页
        </text>
      </view>
      <view class="nav-item flex-col">
        <image
          class="nav-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngdeb2f830dbb85db6727798f206dc1e72c05e8f5e93e9f0f598d3fbe66428353e"
        />
        <text class="nav-label">
          现场实况
        </text>
      </view>
      <view class="nav-item flex-col">
        <image
          class="nav-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPngd0ce0666451ac438c0ace1419c39d2f8091aef8bd2c8ab095c018f6b8210034a"
        />
        <text class="nav-label">
          订单中心
        </text>
      </view>
      <view class="nav-item flex-col">
        <image
          class="nav-icon"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng24f25d2ee9d9c6e9f386074118c2d933da89bbca291fb9cdfb5953325448096b"
        />
        <text class="nav-label">
          我的
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './index.rpx.css';
</style>
