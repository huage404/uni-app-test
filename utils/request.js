function minReuqest(config){
	const BASE_URL = 'http://cesishahe.free.idcfengye.com'
	config.url = BASE_URL + config.url
	console.log('config',config)
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