<template>
	<!-- 门票列表页面
			页面路径: pages/tickets-list
			功能: 选择不同的门票套餐
	-->
	<view>
		<view class="banner">
			<text class="title">门票订购</text>
			<image :src="bgUrl" mode="widthFix"></image>
		</view>

		<!-- 门票 Start -->
		<view class="module">
			<view class="module-title"><text class="icon"></text> 门票详情</view>
			<view class="module-content">
				<view class="tickets" v-for="(item,index) in ticketsList" :key="index">
					<text class="tickets-info">{{item.text}}</text>
					<text class="price">￥0.00</text>
					<button :class="{disabled: item.isDisabled}" size="mini" @click="toOrderDetails(index)">{{item.buttonText}}</button>
				</view>
			</view>
		</view>
		<!-- 门票 End -->
	</view>
</template>

<script>
	import data from "@/mock/data.json"
	
	export default {
		onLoad(option) {
			this.ticketsList = data.ticketsList
			this.bgUrl = data.bannerList[0]
		},
		data() {
			return {
				// 门票列表
				ticketsList: [],
				bgUrl: ''
			};
		},
		methods:{
			toOrderDetails(index){				
				uni.navigateTo({
					url: `../order-details/order-details?index=${index}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';


	.banner {
		height: 250rpx;
		overflow: hidden;
		position: relative;
		background: #000;

		image {
			width: auto;

			&:active {
				opacity: .8;
			}
		}

		.title {
			position: absolute;
			top: 35%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 60rpx;
			color: #fff;
			font-weight: bold;
			letter-spacing: 10rpx;
			z-index: 1;
		}
	}

	.module {
		@extend .baseContianer;
		margin: $padding;
		margin-top: -74rpx;
		position: relative;

		.module-title {
			height: 100%;
			font-size: 28rpx;
			margin-bottom: $padding;

			.icon {
				display: inline-block;
				width: 8rpx;
				height: 20rpx;
				margin-right: 4rpx;
				background-color: red;
			}
		}

		.module-content {
			font-size: 24rpx;
			line-height: 1.5;

			>view {
				padding: $padding 0;
				border-bottom: 1rpx solid rgba(0, 0, 0, .1);

				&:last-child {
					border: none;
				}
			}

			>.tickets {
				display: flex;
				justify-content: space-between;
				align-items: center;
				>.tickets-info {
					// width: 400rpx;
					flex: 7;
				}
				>.price{
					flex: 3;
					text-align: center;
					font-size: 30rpx;
					color: rgba(255, 127, 0, .8);
					font-weight: 700;
				}
				>button {
					flex: 2;
					background-color: rgba(255, 127, 0, 1);
					color: #fff;
					border-radius: 10rpx;
					font-size: 26rpx;
					&:active {
						background-color: rgba(255, 127, 0, .8);
					}
				
					&.disabled {
						background-color: rgba(0, 0, 0, .4);
					}
				}
			}
		}
	}
</style>
