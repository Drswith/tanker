<script>
export default {
  name: 'TimeLine',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0, // 当前进度节点的索引
    },
  },
  methods: {
    // 获取节点状态：completed(已完成), current(当前), pending(未完成)
    getNodeStatus(index) {
      if (index < this.currentIndex) {
        return 'pending'
      }
      else if (index === this.currentIndex) {
        return 'current'
      }
      else {
        return 'completed'
      }
    },
  },
}
</script>

<template>
  <view class="logistics">
    <view
      v-for="(item, index) in list" :key="index" class="item" :class="{
        'item-completed': getNodeStatus(index) === 'completed',
        'item-current': getNodeStatus(index) === 'current',
        'item-pending': getNodeStatus(index) === 'pending',
      }"
    >
      <view class="content">
        <view class="dot-container">
          <view
            class="dot" :class="{
              completed: getNodeStatus(index) === 'completed',
              current: getNodeStatus(index) === 'current',
              pending: getNodeStatus(index) === 'pending',
            }"
          />
        </view>
        <view class="info">
          <view class="info-content">
            <view
              class="status" :class="{
                'text-completed': getNodeStatus(index) === 'completed',
                'text-current': getNodeStatus(index) === 'current',
                'text-pending': getNodeStatus(index) === 'pending',
              }"
            >
              {{ item.status }}
            </view>
            <view
              class="time" :class="{
                'text-completed': getNodeStatus(index) === 'completed',
                'text-current': getNodeStatus(index) === 'current',
                'text-pending': getNodeStatus(index) === 'pending',
              }"
            >
              {{ item.time || '-' }}
            </view>
          </view>
          <view
            class="description" :class="{
              'text-completed': getNodeStatus(index) === 'completed',
              'text-current': getNodeStatus(index) === 'current',
              'text-pending': getNodeStatus(index) === 'pending',
            }"
          >
            {{ item.description }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
	.logistics {
		padding: 30rpx 10rpx;
		background-color: #ffffff;
		.item {
			position: relative;
			padding-bottom: 40rpx;
		}
		.item:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 15rpx;
			top: 30rpx;
			bottom: 0;
			width: 1rpx;
			background-color: #e0e0e0;
		}
		// 已完成和当前节点的连接线高亮
		.item-completed:not(:last-child)::after,
		.item-current:not(:last-child)::after {
			background-color: #FF9E00;
		}
		// 未完成节点的连接线置灰
		.item-pending:not(:last-child)::after {
			background-color: #e0e0e0;
		}

		.info {
			margin-left: 20rpx;
			flex: 1;
			.info-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 32rpx;
				position: relative;
			}
			.status {
				line-height: 40rpx;
				display: block;
				font-size: 28rpx;
				color: #333;
				font-weight: 700;
				// 未完成状态文本置灰
				&.text-pending {
					color: #ccc;
				}
			}

			.time {
				line-height: 40rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;
				// 未完成状态文本置灰
				&.text-pending {
					color: #ddd;
				}
			}

			.description {
				width: 560rpx;
				font-size: 26rpx;
				color: #999999;
				line-height: 1.4;
				// 超长换行
				word-break: break-word;
				// 超出部分省略号
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 10;
				-webkit-box-orient: vertical;

				// 未完成状态文本置灰
				&.text-pending {
					color: #ccc;
				}
			}
		}
	}

	.content {
		display: flex;
		align-items: flex-start;
	}

	.dot-container {
		width: 30rpx;
		height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: #e0e0e0;
			// 已完成状态
			&.completed {
				width: 16rpx;
				height: 16rpx;
				background-color: #FF9E00;
			}
			// 当前状态
			&.current {
				width: 20rpx;
				height: 20rpx;
				background-color: #FF9E00;
				box-shadow: 0 0 0 6rpx rgba(255, 190, 111, 0.2);
			}
			// 未完成状态
			&.pending {
				width: 12rpx;
				height: 12rpx;
				background-color: #e0e0e0;
			}
		}
	}
</style>
