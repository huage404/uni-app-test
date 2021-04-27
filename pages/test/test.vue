<template>
	<!-- 测试页面
			页面路径: pages/test
			功能: 用来测试一些 API 接口
	-->
	<view class="test-page">
		<button class="cell" type="default" @click="getTicketData">获取景区资源</button>
		<button class="cell" type="default" @click="createTicketOrder">创建订单</button>
		<button class="cell" type="default" @click="login">立即登陆</button>
		<button class="cell" type="default" @click="payImmediately">立即支付</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				/* ticketOrderParam: {
					// "appId": "", 						// 分配给数据对接的appId
					// "sign": "", 							// 平台提供的签名字符串signKey
					// "ticketSlotId": "", 					// 根据这个id判断是否是多时间段
					
					"commPric": "0.01",						// 订单价格
					"tradeName": "鄱阳湖湿地公园",			// 资源名
					"resourceId": "1341959994957959170",	// 资源 ID
					"userId": "",							// 用户 ID（通过登陆获取）
					
					"orderTicket": { 						// 订单的基本信息
						"orderMemo": "", 			// 订单备注
						"orderQuantity": 1,					// 订单数量
						"travelDate": "2021-04-20", 		// date 游玩时间
						
						"productCode": "MP2765116212", 		// 产品编码
						// "originType": "1", 				// 默认传1
						// "apiOrderType": "",				// 外部分销类型（如：广西旅发，须统一）
						// "apiOrderNo": "", 				// 外部分销编号
					},
					
					"orderContactList": [{ 					// 联系人列表
						"name": "xzh", 						// 联系人姓名
						"phone": "15797782051" 				// 联系人手机号
					}],
					
					"orderTouristList": [{ 					// 游客列表
						"certNo": "360123200006242111", 	// 游客证件号
						"certType": "身份证", 				// 游客证件类型（身份证、护照、台胞证、港澳通行证、大陆居民往来台湾通行证） 
						"name": "xzh", 						// 游客姓名
						"phone": "15797782051" 				// 游客手机号
					}]
				} */

				ticketOrderParam: {
					
					"commPric": "0.01",						// 订单价格
					"tradeName": "鄱阳湖湿地公园",			// 资源名
					"resourceId": "1341959994957959170",	// 资源 ID
					"userId": "",							// 用户 ID（通过登陆获取）
					"orderTouristList": [{
						"certNo": "360123200006142121",
						"certType": "身份证",
						"name": "test",
						"phone": "15797782051"
					}],
					"orderTicket": {
						"orderMemo": "",
						"orderQuantity": 1,
						"originType": "1",
						"productCode": "MP8840527892",
						"travelDate": "2021-04-26"
					},
					"orderContactList": [{
						"name": "test",
						"phone": "15797782051"
					}]
				}
			};
		},
		computed: {
			...mapState(['resourceId', 'userId'])
		},
		methods: {
			...mapActions(['setUserIdSync', 'setResourceNameSync']),
			// 获取景区资源
			getTicketData() {
				this.$API.getTicketData('1341959994957959170').then(({
					data
				}) => {
					uni.setStorage({
						key: 'tcketData',
						data: data
					})
				})
			},

			// 登陆
			login() {
				let that = this
				uni.login({
					success({
						authCode
					}) {
						that.$API.getPermission({
							authcode: authCode,
							resourceId: '1341959994957959170'
						}).then(({
							data
						}) => {
							console.log('data', data)
							that.setUserIdSync(data.userId)
						})
					}
				})
			},

			// 创建门票订单
			createTicketOrder() {
				let data = uni.getStorageSync('tcketData')

				this.ticketOrderParam.userId = this.userId

				this.$API.payOrder(this.ticketOrderParam).then(response => {
					let [tradeNo, outTradeNo] = response.msg.split('out_trade_no:')
					uni.requestPayment({
						provider: 'alipay', // 服务商类型
						orderInfo: tradeNo // 支付订单号
					}).then((res) => {
						console.log('支付宝返回', res)
						if (res[1]['resultCode'] === '9000') {
							// 3. 支付成功后，修改订单状态
							this.$API.placeOrder({
								tradeNo,
								outTradeNo
							}).then(res => {
								console.log(res)
								console.table(res)
							})
						}
					})
				})
			},

			// 判断用户是否支付成功
			showMsg(code) {
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
					this.$API.notifyUrl()
				}
			},

			// 立即支付
			payImmediately() {

			}
		}
	}
</script>

<style lang="scss">
	.test-page {
		.cell {
			margin: 20rpx 0;
		}
	}
</style>
