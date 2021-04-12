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
	import {mapState,mapActions} from 'vuex'
	
	export default {
		data() {
			return {
				ticketOrderParam: {
					commPric: "0.01", 			// 订单总价
					tradeName: "鄱阳湖湿地公园", 			// 景区名称
					resourceId: "2021002132633235", 		// 景区Id
					userId: "", 			// 用户登陆后的 userId
					orderContactList: [ 	// 订单联系人列表
						{
							name: "联系人姓名", 		// 联系人姓名
							phone: "15700000000" 		// 联系人电话
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
							name: "xzh", 			// 游客姓名
							phone: "13755676545" 			// 游客电话
						}
					]
				}
			};
		},
		computed:{ ...mapState(['resourceId','userId']) },
		methods: {
			...mapActions(['setUserIdSync','setResourceNameSync']),
			// 获取景区资源
			getTicketData(){
				this.$API.getTicketData(this.resourceId).then(({data})=>{
					uni.setStorage({
						key: 'tcketData',
						data: data 
					})
				})
			},
			
			// 登陆
			login(){
				let that = this
				uni.login({
					success({authCode}){
						that.$API.getPermission({
							authcode: authCode,
							resourceId: '2021002132633235'
						}).then(({data})=>{
							console.log('data',data)
							that.setUserIdSync(data.userId)
						})
					}
				})
			},
			
			// 创建门票订单
			createTicketOrder() {
				let data = uni.getStorageSync('tcketData')
				
				this.ticketOrderParam.userId = this.userId
				
				this.$API.payOrder(this.ticketOrderParam).then(res=>{
					console.log('创建门票订单',res.msg)
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.msg,
						success({resultCode}){
							console.log('调用成功',resultCode)
							if(resultCode === '6001'){
								uni.showModal({
									content: '用户中途取消了支付'
								})
							}
						},
						fail(error){
							console.log('支付失败',error)
						},
						complete(){
							console.log('上面这两货是憨批')
						}
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
					this.$API.notifyUrl()
				}
			},
			
			// 立即支付
			payImmediately(){
				
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
