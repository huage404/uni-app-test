import minReuqest from "../utils/request.js"


/*
* 获取景点产品数据
* @method GET
* @param {String} - 传入景点产品 id
*/
export function getTicketData(id){
	return minReuqest({
		url: `/alipay/ticket/${id}`
	})
}

export function payOrder(data){
	console.log('data===',data)	
	return minReuqest({
		url: `/pay/payOrder`,
		method: 'POST',
		header: {
			"Content-Type": "application/json"
		},
		data: {
			commPric: data.commPric,	// 订单总价
			tradeName: data.tradeName,	// 景区名
			resourceId: '',				// 景区Id
			userId: ''
		}
	})
}

export function notifyUrl(){
	return minReuqest({
		url: `/pay/notifyUrl`
	})
}