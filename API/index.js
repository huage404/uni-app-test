import minReuqest from "../utils/request.js"


export default {

	/*
	 * @description 获取景点产品数据
	 * @method GET
	 * @param {String} - 传入景点产品 id
	 */
	getTicketData(id){
		return minReuqest({
			url: `/alipay/ticket/${id}`
		})
	},


	/*
	 * @description 获取授权信息参数
	 * @method POST
	 * @param {Object} data
	 * @param {String} data.authcode - 支付宝给予的商户码
	 * @param {String} data.sourceId - 商品id
	 */
	getPermission(data){
		return minReuqest({
			url: `/pay/getPermission`,
			method: 'POST',
			header: {"Contype-Type": "application/json"},
			data: data
		})
	},


	/*
	 * @description 获取支付订单
	 * @method POST
	 * @param {Object} data
	 * @param {String} data.commPric - 订单总价
	 * @param {String} data.tradeName - 景区名称
	 * @param {String} data.resourceId - 景区Id
	 * @param {String} data.userId - 用户登陆后的 userId
	 */
	payOrder(data){
		return minReuqest({
			url: `/pay/payOrder`,
			method: 'POST',
			header: {
				"Content-Type": "application/json"
			},
			data: data
		})
	},

	/*
	 * 支付成功后的回调
	 * @description 支付成功后，向后端发起请求，修改订单状态
	 */
	notifyUrl(){
		return minReuqest({
			url: `/pay/notifyUrl`
		})
	}
}
