<template>
	<view class="order">
		<!-- 导航栏 start -->
		<view class="nav-list">
			<view class="nav-item" :class="{active: item.isActive}" @click="handleNavActive(item)" v-for="item in navList" :key="item.index">
				<text>{{item.text}}</text>
				<view class="line"></view>
			</view>
		</view>
		<!-- 导航栏 end -->
		
		<!-- 订单列表 start -->
		<view class="order-list">
			<orderCard v-for="(item, index) in listData" :key="index" :cardData="item"></orderCard>
		</view>
		<!-- 订单列表 end -->
	</view>
</template>

<script>
	import orderCard from './components/order-card.vue'
	
	export default {
		data() {
			return {
				navList:[
					{
						index: 0,
						isActive: true,
						text: '全部'
					},
					{
						index: 1,
						isActive: false,
						text: '待付款'
					},
					{
						index: 2,
						isActive: false,
						text: '待出行'
					},
					{
						index: 3,
						isActive: false,
						text: '退款单'
					}
				],
				listData: [
					{
						resourceName: "南昌欢乐谷",
						state: 0,
						orderName: "南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷",
						ticketType: "成人票门票",
						travelTime: "2021-04-19",
						unitPrice: "11220.30",
						totalPrices: "11220.30",
						count: 1
					},
					{
						resourceName: "南昌欢乐谷",
						state: 0,
						orderName: "南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷",
						ticketType: "成人票门票",
						travelTime: "2021-04-19",
						unitPrice: "11220.30",
						totalPrices: "11220.30",
						count: 1
					},
					{
						resourceName: "南昌欢乐谷",
						state: 0,
						orderName: "南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷南昌欢乐谷",
						ticketType: "成人票门票",
						travelTime: "2021-04-19",
						unitPrice: "11220.30",
						totalPrices: "11220.30",
						count: 1
					}
				]
			}
		},
		components:{ orderCard },
		methods: {
			handleNavActive(el){
				this.navList.forEach(item=>{
					item.isActive = false
				})
				el.isActive = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';
	
	.order{
		background: $themeBgColor;
		min-height: 100vh;
		.nav-list{
			height: 90rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 $padding;
			font-size: 28rpx;
			background: #fff;
			border-top: 2rpx solid $borderColor;
			box-shadow: $boxShadow;
			
			.nav-item{
				.line{
					width: 0;
					height: 4rpx;
					margin: 0 auto;
					background: $themeColor;
					transform: translateY(28rpx);
					transition: all 0.1s linear;
				}
				
				&.active{
					color: $themeColor;
					.line{
						width: 100%;
					}
				}
			}
		}
	
		.order-list{
			padding-bottom: 100rpx;
		}
	}

</style>
