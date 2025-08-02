<script>
export default {
  name: 'CustomButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    text: {
      type: String,
      default: '',
    },
    shape: {
      type: String,
      default: 'circle',
    },
  },
  computed: {
    buttonColor() {
      if (this.variant === 'primary') {
        return 'linear-gradient( 326deg, #FFD100 0%, #FFA500 100%)'
      }
      return ''
    },
  },
}
</script>

<template>
  <u-button :shape="shape" :color="buttonColor" :custom-style="{ height: '96rpx' }" v-bind="$attrs" loading-size="36" v-on="$listeners">
    <text class="button-text">
      {{ text }}
    </text>
  </u-button>
</template>

<style lang="scss" scoped>
.button-text {
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 32rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  line-height: 44rpx;
}
</style>
