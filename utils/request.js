export const request = (config)=>{
	// 设置请求头
	const baseUrl = 'http://gyt-api.test.ganyoutong.cn'
	
	config.url = baseUrl + config.url
	
	if(!config.data){
		config.data = {}
	}
	
	return new Promise((resolve, reject)=>{
		uni.request(config).then(response=>{
						
			// 处理异常
			if(response[0]){
				reject({message: '网络超时'})
			}else{
				let response = response[1].data
				resolve(response)
			}
		}).catch(error=>{
			reject(error)
		})
	})
}