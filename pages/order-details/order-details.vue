<template>
	<!-- 订单详情页面
			页面路径: pages/order-details
			功能: 输入订单信息，创建待支付订单，完成后进入支付页面
	-->
	<view class="order-details">
		<view class="details">
			<view class="order-name">{{orderName}}</view>
			<view class="order-rule">暂无</view>
			<view class="order-date-list">
				<view v-for="(date, index) in dataList" :class="{active: activeTime === index}"
					@click="changeActiveTime(index)" :key="index">{{date}}</view>
			</view>

		</view>

		<!-- 选择门票数量 -->
		<view class="ticket">
			<view class="info">
				<view>{{ticketList.productName}}</view>
				<view class="price">￥{{ticketList.price}}</view>
			</view>
			<view class="number">
				<view class="btn left" @click="reduceCount(item)">-</view>
				<view class="num">{{ticketList.number}}</view>
				<view class="btn right" @click="addCount(item)">+</view>
			</view>
		</view>
		
		<view class="order-date">
			<view>选择出行时间</view>
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">{{date}}</view>
			</picker>
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
			<view class="title">出行人</view>
			<view class="cell">
				<text class="label">姓名</text>
				<input class="input-text" placeholder-class="placeholder-style" type="text"
					v-model="ticketOrderParam.orderTouristList[0]['name']" placeholder="请填写您的姓名">
			</view>
			<view class="cell">
				<text class="label">电话号码</text>
				<input class="input-text" placeholder-class="placeholder-style" type="number"
					v-model="ticketOrderParam.orderTouristList[0]['phone']" placeholder="请填写您的电话号码">
			</view>
			<view class="cell">
				<text class="label">证件类型</text>
				<input class="input-text" disabled="disabled" placeholder-class="placeholder-style" type="text"
					:value="ticketOrderParam.orderTouristList[0]['certType']" placeholder="请选择您的证件类型">
			</view>
			<view class="cell">
				<text class="label">证件号</text>
				<input class="input-text" placeholder-class="placeholder-style" type="text"
					v-model="ticketOrderParam.orderTouristList[0]['certNo']" placeholder="请填写您证件号码">
			</view>
		</view>

		<view class="module">
			<view class="cell">
				<text class="label">留言</text>
				<input class="input-text" placeholder-class="placeholder-style" type="text" placeholder="选填您的备注信息">
			</view>
		</view>

		<view class="need-to-know">
			<rich-text :nodes="crowd"></rich-text>
		</view>

		<!-- 底部 tabBar -->
		<view class="tabBar">
			<view class="price-container">
				<text>合计:</text>
				<text class="price">￥{{totalPrices.toFixed(2)}}</text>
			</view>
			<button class="btn" @click="verify">立即支付</button>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '../../utils/request.js'
	import {
		mapState
	} from "vuex"
	import {
		htmlToNode
	} from '../../utils/index.js'

	export default {
		data() {
			const currentDate = this.getDate({ format: true })
			
			return {
				date: currentDate,
				"orderName": '',
				"ticketList": {
					"productName": '',
					"price": 0,
					"number": 1
				},
				"activeTime": 0,
				// 订票详情
				"crowd": "",
				// 订单参数
				"ticketOrderParam": {
					"commPric": "0.01", // 订单价格
					"tradeName": "", // 资源名
					"resourceId": "", // 资源 ID
					"userId": "", // 用户 ID（通过登陆获取）

					"orderTicket": { // 订单的基本信息
						"orderMemo": "", // 订单备注
						"orderQuantity": 0, // 订单数量
						"travelDate": "", // date 游玩时间
						"productCode": "", // 产品编码
					},

					"orderContactList": [{ // 联系人列表
						"name": "", // 联系人姓名
						"phone": "" // 联系人手机号
					}],

					"orderTouristList": [{ // 游客列表
						"certNo": "", // 游客证件号
						"certType": "身份证", // 游客证件类型（身份证、护照、台胞证、港澳通行证、大陆居民往来台湾通行证） 
						"name": "", // 游客姓名
						"phone": "" // 游客手机号
					}]
				}
			};
		},
		computed: {
			...mapState(['resourceId', 'test', 'userId', 'resourceName']),
			// 计算总价
			totalPrices() {
				let total = this.ticketList.price * this.ticketList.number
				this.ticketOrderParam.commPric = total
				return total
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},

		onLoad(option) {
			let { index, productCode } = option

			// 从内存中读取门票数据
			let data = uni.getStorageSync('ticketsList')

			// 给套餐详情添加类名，并转换为符合要求的数据格式
			let crowd = data[index]['crowd'].replace(/\<p/gi, '<p class="text"')
			this.crowd = htmlToNode(crowd)

			this.orderName = data[index]['productName']

			this.ticketList = {
				productName: data[index]['productName'],
				price: this.getPrice(data[index]['ticketPriceCalendars']),
				number: 1
			}

			this.ticketOrderParam.orderTicket.productCode = productCode
		},

		methods: {
			// 增加数量
			addCount(item) {
				this.ticketList.number += 1
			},
			// 减少数量
			reduceCount(item) {
				if (this.ticketList.number > 0) {
					this.ticketList.number -= 1
				}
			},
			
			// 发起支付
			aliPay() {
				console.log('订单参数', this.ticketOrderParam)
					// 创建支付订单
					this.$API.payOrder(this.ticketOrderParam).then(response => {

						/**
						 * @param {String} tradeNo - 支付宝订单号 
						 * @param {String} outTradeNo - 赣游通订单号
						 */
						let [tradeNo, outTradeNo] = response.msg.split('out_trade_no:')

						// 2. 发起支付弹窗
						uni.requestPayment({
							provider: 'alipay', // 服务商类型
							orderInfo: tradeNo // 支付订单号
						}).then((res) => {
							console.log('res', res)
							this.showMsg(res[1]['resultCode'], {
								tradeNo,
								outTradeNo
							})
						})
					})

			},
			
			// 下单前校验
			verify(){
				
				this.updateParams()
				
				let userInfo = this.ticketOrderParam.orderTouristList[0]
				// 校验出行人信息
				if (userInfo.name && userInfo.phone && userInfo.certNo){
					let nowDate = new Date().getTime()
					let orderTime = new Date(this.date).getTime()
					if(nowDate < orderTime){
						this.aliPay()
					}else{
						uni.showModal({
							content: '出行时间必须大于当天时间'
						})
					}
				}else{
					uni.showModal({
						content: '请输入出行人信息'
					})
				}
			},
			
			// 更新订单参数
			updateParams(){
				// 将出行人电话同步到联系人
				this.ticketOrderParam.orderContactList[0].name = this.ticketOrderParam.orderTouristList[0].name
				this.ticketOrderParam.orderContactList[0].phone = this.ticketOrderParam.orderTouristList[0].phone
				
				// 从 vuex 中读取资源参数
				this.ticketOrderParam.tradeName = this.resourceName // 资源名
				this.ticketOrderParam.resourceId = this.resourceId // 资源 id
				this.ticketOrderParam.userId = this.userId // 用户 id
				
				// 同步总价格
				this.ticketOrderParam.commPric = this.totalPrices
				// 同步订单数量
				this.ticketOrderParam.orderTicket.orderQuantity = this.ticketList.number
				// 同步订单时间
				this.ticketOrderParam.orderTicket.travelDate = this.date.split('/').join('-')
			},
			
			// 判断用户是否支付成功
			showMsg(code, param) {
				const hash = {
					"4": "无权限调用: 个人小程序应用没有开放小程序支付能力",
					"9000": "订单处理成功",
					"8000": "正在处理中。支付结果未知（有可能已经支付成功）",
					"4000": "订单处理失败",
					"6001": "用户中途取消",
					"6002": "网络连接出错",
					"6004": "处理结果未知（有可能已经成功）",
				}
				if (code === '9000') {
					// 3. 支付成功后，修改订单状态
					this.$API.placeOrder(param).then(res => {
						if (res.msg === "订单撤销成功") {
							uni.showModal({
								content: '订单支付失败，正在退款',
								success() {
									uni.switchTab({
										url: '/pages/home/home'
									})
									window.location.reload()
								}
							})
						} else {
							uni.switchTab({
								url: '/pages/home/home'
							})
							window.location.reload()
						}
					})
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
			getPrice(list) {
				/* let nowTime = new Date().getTime()
				let newArr = []
				list.forEach(item => {
					let useTime = new Date(item.useDate)
					if (useTime > nowTime) {
						newArr.push(item)
					}
				}) */
				return list[0]['dealPrice']
			},
			
			// 获取当天的日期
			getDate(type,nowDate) {
				
				let date = new Date();
				
				if(nowDate){ data = new Date(nowDate) }
				
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			
			// 点击切换当天的日期
			bindDateChange(e){
				this.date = e.target.value
			},
		},
		onReady() {
			
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
		padding: $padding $padding 200rpx;
		line-height: 1.5;

		>view {
			@extend .baseContianer;
			margin-bottom: $padding;
		}

		.need-to-know {
			::v-deep .text {
				font-size: 24rpx;
			}
		}
		
		.order-date {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
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

			
			.order-date-list {
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin-top: 12rpx;
			
				view {
					$color-gy: rgba(0, 0, 0, .5);
					$color-active: #fc941d;
			
					border: 2rpx solid $color-gy;
					padding: 8rpx 16rpx;
					border-radius: 4rpx;
					color: $color-gy;
			
					&.active {
						color: #FFFFFF;
						border-color: $color-active;
						background-color: $color-active;
					}
				}
			}
		}

		.ticket {
			$red: #ee0a24;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.info {
				font-size: 24rpx;

				.price {
					color: $red;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.number {
				width: 140rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 20rpx;

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

			.right-text {
				font-size: 24rpx;
				display: flex;
				align-items: center;
				color: rgba(0, 0, 0, .5);

				.iconfont {
					font-size: inherit;
				}
			}
		}
	}

	.tabBar {
		position: fixed;
		bottom: -$padding;
		height: 96rpx;
		left: 0;
		width: 100%;
		border-radius: 0 !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		border-top: 2rpx solid #f3f3f3;
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

	.m-r-20 {
		margin-right: 20rpx;
	}
</style>
