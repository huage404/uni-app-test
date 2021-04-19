<template>
	<view class="order-module">
		<view class="header">
			<view class="resource-name">南昌欢乐谷</view>
			<text class="order-state">待付款</text>
		</view>
		<view class="content">
			<view class="icon"></view>
			<view class="info">
				<view>南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷</view>
				<view class="paratext">门票种类：成人票门票</view>
				<view class="paratext">出行时间：2021-04-19</view>
			</view>
			<view class="price-container">
				<view class="price">￥11220.30</view>
				<view class="count">X 1</view>
			</view>
		</view>
		<view class="summarize">
			合计：<text class="total-price">￥11220.30</text>
		</view>
		<view class="btn-list">
			<text class="btn pay">立即付款</text>
			<text class="btn">取消订单</text>
		</view>
	</view>
</template>

<script>
	export default {
		
		
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';
	
	.order-module{
		box-shadow: $boxShadow;
		background: #FFFFFF;
		margin-top: 20rpx;
		font-size: 28rpx;
		line-height: 1.3;
		.header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 0 $padding;
			
			.order-state{
				color: #fc941d;
			}
		}
		.content{
			background: #fafafa;
			box-sizing: border-box;
			padding: 30rpx $padding;
			height: 200rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.icon{
				flex: 1;
				background-color: $themeColor;
			}
			.info{
				flex: 7;
				font-size: 30rpx;
				.paratext{
					font-size: 26rpx;
					color: #999999;
				}
			}
			.price-container{
				flex: 2;
				text-align: right;
				.price{
					font-size: 24rpx;
				}
				.count{
					font-size: 20rpx;
					color: #999999;
				}
			}
		}
		.summarize{
			text-align: right;
			line-height: 70rpx;
			font-size: 30rpx;
			border-bottom: 2rpx solid $borderColor;
			margin: 0 $padding;
			.total-price{
				font-size: 28rpx;
				color: #f7042d;
			}
		}
		.btn-list{
			height: 100rpx;
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			padding: 0 $padding;
			.btn{
				font-size: 26rpx;
				padding: 8rpx 14rpx;
				margin-left: 16rpx;
				border-radius: 8rpx;
				border: 2rpx solid $borderColor;
				
				&.pay{
					color: #ffb814;
					border-color: #ffb814;
				}
			}
		}
	}
</style>
