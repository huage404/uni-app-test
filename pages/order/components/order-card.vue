<template>
	<view class="order-module">
		<view class="header">
			<view class="resource-name">{{cardData.gytOrderNo}}</view>
			<text class="order-state"
				:style="orderState[cardData.state]['style']">{{orderState[cardData.state]['text']}}</text>
		</view>
		<view class="content">
			<view class="icon"><text class="iconfont icon-geren2"></text></view>
			<view class="info">
				<view>{{cardData.orderName}}</view>
				<!-- <view class="paratext">门票种类：{{cardData.ticketType}}</view> -->
				<view class="paratext">出行时间：{{cardData.travelTime}}</view>
			</view>
			<view class="price-container">
				<view class="price">￥{{cardData.unitPrice}}</view>
				<view class="count">X {{cardData.count}}</view>
			</view>
		</view>
		<view class="summarize">
			合计：<text class="total-price">￥{{cardData.totalPrices}}</text>
		</view>
		<view class="btn-list" v-if="cardData.state == '2'">
			<text class="btn" @click="handleRefund">取消订单</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderState: {
					'2': {
						text: '待出行',
						style: {
							color: '#fc941d'
						}
					},
					'3': {
						text: '已完成',
						style: {
							color: '#2a9938'
						}
					},
					'6': {
						text: '已退单',
						style: {
							color: '#ff0000'
						}
					}
				}
			}
		},
		props: {
			cardData: {
				type: Object,
				default: {
					gytOrderNo: "",
					state: '0',
					orderName: "",
					ticketType: "",
					travelTime: "",
					unitPrice: "",
					totalPrices: "",
					platNum: "",
					count: 0
				}
			}
		},
		methods: {
			// 退款按钮
			handleRefund() {
				let that = this
				let platNum = this.cardData.platNum
				uni.showModal({
					title: '是否选择退款',
					content: '发起退款后需要人工审核',
					success(res) {
						if (res.confirm) {
							// 发起退款
							platNum && that.$API.refund(platNum)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		},
		computed() {}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';

	.order-module {
		box-shadow: $boxShadow;
		background: #FFFFFF;
		margin-top: 20rpx;
		font-size: 28rpx;
		line-height: 1.3;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 0 $padding;

			.order-state {
				color: #fc941d;
			}
		}

		.content {
			background: #fafafa;
			box-sizing: border-box;
			padding: $padding;
			height: 200rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			.icon {
				flex: 1;

				.icon-geren2 {
					color: $themeColor;
				}
			}

			.info {
				flex: 7;
				font-size: 30rpx;
				font-weight: 700;

				.paratext {
					font-size: 26rpx;
					color: #999999;
					font-weight: 400;
					line-height: 1.5;
				}
			}

			.price-container {
				flex: 2;
				text-align: right;

				.price {
					font-size: 24rpx;
				}

				.count {
					font-size: 20rpx;
					color: #999999;
				}
			}
		}

		.summarize {
			text-align: right;
			line-height: 70rpx;
			font-size: 30rpx;
			border-bottom: 2rpx solid $borderColor;
			margin: 0 $padding;

			.total-price {
				font-size: 28rpx;
				color: #f7042d;
			}
		}

		.btn-list {
			height: 100rpx;
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			padding: 0 $padding;

			.btn {
				font-size: 26rpx;
				padding: 8rpx 14rpx;
				margin-left: 16rpx;
				border-radius: 8rpx;
				border: 2rpx solid $borderColor;

				&.pay {
					color: #ffb814;
					border-color: #ffb814;
				}
			}
		}
	}
</style>
