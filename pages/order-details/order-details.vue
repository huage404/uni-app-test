<template>
	<!-- 订单详情页面
			页面路径: pages/order-details
			功能: 输入订单信息，创建待支付订单，完成后进入支付页面
	-->
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
					<view>{{item.productName}}</view>
					<view class="price">￥{{item.price}}</view>
				</view>
				<view class="number">
					<view class="btn left" @click="reduceCount(item)">-</view>
					<view class="num">{{item.number}}</view>
					<view class="btn right" @click="addCount(item)">+</view>
				</view>
			</view>
		</view>
		
		<!-- 旅客信息 -->
		<!-- <view class="module">
			<view class="title">旅客信息</view>
			<view class="cell">
				<text class="label">出行人</text>
				<text class="right-text">
					添加出行人
					<text class="iconfont icon-youjiantou"></text>
				</text>
			</view>
			<view class="cell flex">
				<view>
					<text class="label m-r-20">用户姓名</text>
					<text class="label">15797782050</text>
				</view>
				<text class="iconfont icon-cha-"></text>
			</view>
		</view>	 -->	
				
		<view class="module">
			<view class="cell">
				<text class="label">留言</text>
				<input class="input-text" placeholder-class="placeholder-style" type="number" placeholder="选填您的备注信息">
			</view>
		</view>
		
		<view class="module">
			<view class="title">联系人</view>
			<view class="cell">
				<text class="label">姓名</text>
				<input class="input-text" placeholder-class="placeholder-style" type="text" v-model="ticketOrderParam.orderContactList[0]['name']" placeholder="请填写您的姓名">
			</view>
			<view class="cell">
				<text class="label">电话号码</text>
				<input class="input-text" placeholder-class="placeholder-style" type="number" v-model="ticketOrderParam.orderContactList[0]['phone']" placeholder="请填写您的电话号码">
			</view>
		</view>

		<!-- 底部 tabBar -->
		<view class="tabBar">
			<view class="price-container">
				<text>合计:</text>
				<text class="price">￥{{totalPrices.toFixed(2)}}</text>
			</view>
			<button class="btn" @click="aliPay">立即支付</button>
		</view>
	</view>
</template>

<script>
	import {request} from '../../utils/request.js'
	import {mapState} from "vuex"
	
	export default {
		data() {
			return {
				orderName: '',
				ticketList: [],
				ticketOrderParam: {
					commPric: "0.01", 			// 订单总价
					tradeName: "", 			// 景区名称
					resourceId: "", 		// 景区Id
					userId: "", 			// 用户登陆后的 userId
					orderContactList: [ 	// 订单联系人列表
						{
							name: "", 		// 联系人姓名
							phone: "" 		// 联系人电话
						}
					],
					orderTicket: { 			// 订单联系人列表
						orderMemo: "备忘录", 		// 备忘录
						orderQuantity: "1", 	// 订单数
						originType: "2", 	// 订单来源
						productCode: "", 	// 产品编号（门票编码）
						apiOrderType: "", 	// 订单类型（分销商名称）
						apiOrderNo: "", 	// 订单编码（本地订单号）
						remark: "备忘录2", 		// 备注
						travelDate: "2021-04-12" 		// 出行时间
					},
					orderTouristList: [
						{ 	// 游客列表
							certNo: "345678909878909876", 		// 证件号
							certType: "身份证", 		// 证件类型
							name: "test", 			// 游客姓名
							phone: "13755676545" 			// 游客电话
						}
					]
				}
			};
		},
		computed: {
			...mapState(['resourceId','test','userId','resourceName']),
			// 订单时间，默认取当天
			orderDate(){
				let nowDate = new Date()
				let month = nowDate.getMonth()+1
				let day = nowDate.getDate()	
						
				function addZero(num){
					return num < 9 ? `0${num}` : num
				}	
						
				return `${addZero(month)}-${addZero(day)}`
			},
			// 计算总价
			totalPrices() {
				let total = 0;
				this.ticketList.forEach((item) => {
					total += Number(item.price) * item.number
				})
				return isNaN(total) ? 0 : total
			}
		},
		onLoad(option){
			let data = uni.getStorageSync('ticketsList')
			
		   this.orderName = data[option.index]['productName']
			
			this.ticketList = [{
				productName: data[option.index]['productName'],
				price: this.getPrice(data[option.index]['ticketPriceCalendars']),
				number: 0
			}]
		},
		methods: {
			addCount(item) {
				item.number++
			},
			reduceCount(item) {
				item.number = item.number > 0 ? item.number - 1 : 0
			},
			aliPay(){
				let params = {}
				this.ticketOrderParam.tradeName = this.resourceName
				// this.ticketOrderParam.commPric = this.totalPrices
				this.ticketOrderParam.resourceId = this.resourceId
				this.ticketOrderParam.userId = this.userId
				
				
				// 1. 创建支付订单
				this.$API.payOrder(this.ticketOrderParam).then(response=>{		
					// 2. 发起支付弹窗
					uni.requestPayment({
						provider: 'alipay',			// 服务商类型
						orderInfo: response.msg		// 支付订单号
					}).then((res)=>{
						console.log('res',res)
						this.showMsg(res[1]['resultCode'])
					})
				})
			},
			// 判断用户是否支付成功
			showMsg(code){
				const hash = {
					"4": "无权限调用: 个人小程序应用没有开放小程序支付能力",
					"9000": "订单处理成功",
					"8000": "正在处理中。支付结果未知（有可能已经支付成功）",
					"4000": "订单处理失败",
					"6001": "用户中途取消",
					"6002": "网络连接出错",
					"6004": "处理结果未知（有可能已经成功）",
				}
				if(code === '9000'){
					// 3. 支付成功后，修改订单状态
					this.$API.notifyUrl()
				}
				uni.showModal({
					content: hash[code]
				})
			},
			/**
			 * 返回一个套餐价格
			 * @description 返回今天之后的第一个套餐价格
			 * @param {Array} list - 价格数组 
			 * @return {Number}
			 */
			getPrice(list){
				let nowTime = new Date().getTime()
				let newArr = []
				list.forEach(item=>{
					let useTime = new Date(item.useDate)
					if(useTime > nowTime){
						newArr.push(item)
					}
				})
				return newArr[0]['dealPrice']
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
	}

	
	.module {
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
			
			.right-text{
				font-size: 24rpx;
				display: flex;
				align-items: center;
				color: rgba(0,0,0,.5);
				.iconfont{
					font-size: inherit;
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

	.m-r-20{
		margin-right: 20rpx;
	}
</style>
