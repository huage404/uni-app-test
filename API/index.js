import minReuqest from "../utils/request.js"



// 资源相关
const resources = {
	/**
	 * @description 获取景点产品数据
	 * @method GET
	 * @param {String} - 传入景点产品 id
	 */
	getTicketData(id){
		return minReuqest({
			url: `/alipay/ticket/${id}`
		})
	}
}

// 支付相关
const payRelated = {
	/**
	 * 获取授权信息参数
	 * @description 返回数据中包含一个 userId ，用来作为参数调用 payOrder
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
	
	/**
	 * 获取支付订单
	 * @description 发起支付，成功后调用 notifyUrl
	 * @description 具体参数可以在 postman 中查看
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
	
	/**
	 * 支付成功后的回调
	 * @description 支付成功后，向后端发起请求，修改订单状态
	 */
	notifyUrl(){
		return minReuqest({
			url: `/pay/notifyUrl`
		})
	},
	
	/**
	 * 撤销订单
	 * @description 撤销订单
	 */
	cancelOrder(data){
		return minReuqest({
			url: `/pay/cancelOrder`,
			data: data
		})
	},
	
	/**
	 * 下单接口
	 * @description 下单接口
	 * @param {Object} data 
	 */
	placeOrder(data){
		return minReuqest({
			url: `/order/placeOrder`,
			data: data
		})
	}
}


export default {
	// 资源相关
	...resources,
	// 支付相关
	...payRelated	
}
