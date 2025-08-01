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

      // GPS设备信息
      gpsInfo: {
        installTime: '2025-12-12 12:00', // GPS安装时间
        installPhotos: [], // GPS安装信息照片文件列表
        returnTime: '2025-12-12 12:00', // GPS寄回时间
        returnExpress: '顺丰', // 寄回快递
        returnTrackingNumber: '9809182382', // 寄回快递单号
      },

      // 页面状态
      pageState: {
        isLoading: false,
        isEditable: true, // 是否可编辑（上传照片）
      },
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

    // 模拟加载GPS设备信息
    this.loadGpsInfo()
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 加载GPS设备信息
    async loadGpsInfo() {
      try {
        this.pageState.isLoading = true
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟已上传的GPS安装照片数据
        this.gpsInfo.installPhotos = [
          {
            url: '/static/images/fallback-image.png',
            name: 'gps_install_1.jpg',
            thumb: '/static/images/fallback-image.png',
          },
          {
            url: '/static/images/fallback-image.png',
            name: 'gps_install_2.jpg',
            thumb: '/static/images/fallback-image.png',
          },
          {
            url: '/static/images/fallback-image.png',
            name: 'gps_install_3.jpg',
            thumb: '/static/images/fallback-image.png',
          },
        ]
      }
      catch (error) {
        console.error('加载GPS设备信息失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none',
        })
      }
      finally {
        this.pageState.isLoading = false
      }
    },

    // u-upload组件读取文件后的回调
    afterReadPhoto(event) {
      const { file } = event

      // 添加新上传的照片到列表
      this.gpsInfo.installPhotos.push({
        url: file.url,
        thumb: file.thumb || file.url,
        name: file.name || `gps_install_${Date.now()}.jpg`,
      })

      uni.showToast({
        title: '照片上传成功',
        icon: 'success',
      })
    },

    // u-upload组件删除文件的回调
    deletePhoto(event) {
      const { index } = event
      this.gpsInfo.installPhotos.splice(index, 1)

      uni.showToast({
        title: '照片已删除',
        icon: 'success',
      })
    },

    // 预览照片
    previewPhoto(item) {
      const urls = this.gpsInfo.installPhotos.map(photo => photo.url)
      const current = this.gpsInfo.installPhotos.findIndex(photo => photo.url === item.url)

      uni.previewImage({
        current,
        urls,
      })
    },

    // 返回上一页
    navigateBack() {
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <view class="flex-col page-container">
    <!-- 内容区域 -->
    <view class="form-container flex-col">
      <!-- GPS安装时间 -->
      <view class="info-section">
        <view class="field-label-required">
          <text class="field-label">
            GPS安装时间：
          </text>
          <text class="field-value">
            {{ gpsInfo.installTime }}
          </text>
        </view>
      </view>

      <!-- GPS安装信息 -->
      <view class="info-section">
        <view class="field-label-required">
          <text class="field-label">
            GPS安装信息
          </text>
        </view>

        <!-- 照片上传组件 -->
        <view class="photo-upload-container">
          <u-upload
            ref="photoUpload"
            :file-list="gpsInfo.installPhotos"
            :max-count="9"
            accept="image"
            :width="200"
            :height="200"
            :deletable="pageState.isEditable"
            :preview-full-image="true"
            @afterRead="afterReadPhoto"
            @delete="deletePhoto"
            @clickPreview="previewPhoto"
          >
            <view v-if="pageState.isEditable" class="upload-slot">
              <view class="upload-placeholder">
                <u-icon name="camera" size="60" color="#999" />
                <text class="upload-text">
                  添加照片
                </text>
              </view>
            </view>
          </u-upload>
        </view>

        <!-- 上传提示 -->
        <view v-if="pageState.isEditable" class="upload-tip">
          <text class="tip-text">
            最多可上传9张照片，支持jpg、png格式
          </text>
        </view>
      </view>

      <!-- GPS寄回时间 -->
      <view class="info-section">
        <view class="field-label-required">
          <text class="field-label">
            GPS寄回时间：
          </text>
          <text class="field-value">
            {{ gpsInfo.returnTime }}
          </text>
        </view>
      </view>

      <!-- 寄回快递 -->
      <view class="info-section">
        <view class="field-label-required">
          <text class="field-label">
            寄回快递：
          </text>
          <text class="field-value">
            {{ gpsInfo.returnExpress }}
          </text>
        </view>
      </view>

      <!-- 寄回快递单号 -->
      <view class="info-section">
        <view class="field-label-required">
          <text class="field-label">
            寄回快递单号：
          </text>
          <text class="field-value">
            {{ gpsInfo.returnTrackingNumber }}
          </text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="pageState.isLoading" class="loading-overlay">
      <u-loading-icon color="#FFA500" size="60" mode="circle" />
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/static/css/form.scss';

/* 页面容器 */
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  padding: 20rpx 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  z-index: 10;
  padding: 10rpx;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 信息区块 */
.info-section {
  margin-bottom: 48rpx;
}

.info-section:last-child {
  margin-bottom: 0;
}

/* 字段值样式 */
.field-value {
  color: #333;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 40rpx;
  margin-left: 16rpx;
}

/* 照片上传容器 */
.photo-upload-container {
  margin-top: 16rpx;
}

/* 上传插槽样式 */
.upload-slot {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

/* 上传提示 */
.upload-tip {
  margin-top: 16rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  line-height: 34rpx;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 表单容器重写 */
.form-container {
  border-radius: 32rpx 32rpx 0 0;
}

/* 重写u-upload组件样式 */
:deep(.u-upload) {
  .u-upload__wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
  }

  .u-upload__wrap__preview {
    width: 200rpx !important;
    height: 200rpx !important;
    border-radius: 16rpx;
    overflow: hidden;
    border: 2rpx solid #e5e5e5;
  }

  .u-upload__wrap__preview__image {
    width: 100% !important;
    height: 100% !important;
    border-radius: 16rpx;
  }

  .u-upload__button {
    width: 200rpx !important;
    height: 200rpx !important;
  }
}
</style>
