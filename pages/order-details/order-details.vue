<template>
	<view class="order-details">
		<view class="details">
			<view class="order-name">{{orderName}}</view>
			<view class="order-rule">暂无</view>
			<view class="order-date">
				<text>出行时间</text>
				<text style="opacity: .5;">{{orderDate}}</text>
			</view>
			<view class="ticket" v-for="(item,index) in ticketList" :key="index">
				<view class="info">
					<view>{{item.text}}</view>
					<view class="price">￥{{Number(item.price).toFixed(2)}}</view>
				</view>
				<view class="number">
					<view class="btn left" @click="reduceCount(item)">-</view>
					<view class="num">{{item.number}}</view>
					<view class="btn right" @click="addCount(item)">+</view>
				</view>
			</view>
		</view>
			
		<view class="contacts">
			<view class="title">联系人</view>
			<view class="cell">
				<text class="label">姓名</text>
				<input class="input-text" placeholder-class="placeholder-style" type="text" placeholder="请填写您的姓名">
			</view>
			<view class="cell">
				<text class="label">电话号码</text>
				<input class="input-text" placeholder-class="placeholder-style" type="number" placeholder="请填写您的电话号码">
			</view>
		</view>
			{{resourceId}}
			{{userId}}
		<!-- 底部 tabBar -->
		<view class="tabBar">
			<view class="price-container">
				<text>合计:</text>
				<text class="price">￥{{totalPrices.toFixed(2)}}</text>
			</view>
			<button class="btn" @click="aliPay">提交订单</button>
		</view>
	</view>
</template>

<script>
	import {request} from '../../utils/request.js'
	import data from "@/mock/data.json"
	import {mapState} from "vuex"
	
	export default {
		data() {
			return {
				orderName: '',
				ticketList: [],
				userId: uni.getStorageSync('userId'),
				resourceId: uni.getStorageSync('resourceId'),
			};
		},
		onLoad(option){
			this.orderName = data.ticketsList[option.index]['text']
			this.ticketList = [data.ticketsList[option.index]]
		},
		computed:{
			...mapState(['resourceId'])
		},
		methods: {
			addCount(item) {
				item.number++
			},
			reduceCount(item) {
				item.number = item.number > 0 ? item.number - 1 : 0
			},
			aliPay(){
				let params = {
					commPric: '0.01',
					tradeName: '鄱阳湖湿地公园',
					resourceId: this.resourceId,
					userId: this.userId
				}
				console.log('params',params)
				/* this.$API.payOrder(params).then(res=>{		
					console.log('payOrder',res)
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.msg
					}).then(ress=>{
						console.log('测试',ress)
					})
				}) */
			}
		},
		computed: {
			orderDate(){
				let nowDate = new Date()
				let month = nowDate.getMonth()+1
				let day = nowDate.getDate()	
						
				function addZero(num){
					return num < 9 ? `0${num}` : num
				}	
						
				return `${addZero(month)}-${addZero(day)}`
			},
			totalPrices() {
				let total = 0;
				this.ticketList.forEach((item) => {
					total += Number(item.price) * item.number
				})
				return isNaN(total) ? 0 : total
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.order-details {
		padding: $padding;
		line-height: 1.5;

		>view {
			@extend .baseContianer;
			margin-bottom: $padding;
		}

		.details {
			font-size: 24rpx;

			>view {
				margin: 10rpx 0;
			}

			.order-name {
				font-size: 28rpx;
			}

			.order-rule {
				display: none;
			}

			.order-date {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.ticket {
				$red: #ee0a24;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.info {
					flex: 7;

					.price {
						color: $red;
						font-weight: bold;
					}
				}

				.number {
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.num {
						margin: 0 10rpx;
					}

					.btn {
						@extend .center;
						width: 40rpx;
						height: 40rpx;
						color: #fff;
						border-radius: 50%;
						font-weight: bold;

						&.left {
							color: $red;
							border: 1rpx solid $red;
						}

						&.right {
							background: $red;
						}
					}
				}
			}
		}

		.contacts {
			.title {
				font-size: 28rpx;
			}

			.cell {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.label {
					flex: 1;
					font-size: 24rpx;
				}

				.input-text {
					flex: 3;
					font-size: 24rpx;
				}

				/deep/ .placeholder-style {
					font-size: 24rpx;
				}
			}
		}
	}

	.tabBar {
		position: absolute;
		bottom: -$padding;
		height: 96rpx;
		left: 0;
		width: 100%;
		border-radius: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;

		.price-container {
			font-size: 26rpx;

			.price {
				color: #ed0038;
				font-size: 30rpx;
			}
		}

		.btn {
			@extend .center;
			font-size: 28rpx;
			width: 280rpx;
			height: 80rpx;
			border-radius: 80rpx;
			color: #FFFFFF;
			background-image: linear-gradient(to right, #ff5b2f, #ef051f);
		}
	}
</style>
