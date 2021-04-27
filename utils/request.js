function minReuqest(config){
	// 正式
	const BASE_URL = 'https://api.chinay.net:8848'
	// 测试
	// const BASE_URL = 'http://www.frpgz1.idcfengye.com'
	config.url = BASE_URL + config.url
	return new Promise(function(resolve,reject){
		uni.request({...config}).then((data)=>{
			let [error, res]  = data;
			if(!error){
				resolve(res.data)
			}else{
				console.log('请求超时',error)
				reject(error)
			}
		}).catch(err=>{
			reject(err)
		})
	})
}

export default minReuqest