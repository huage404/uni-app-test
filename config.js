 
/*
	切换服务器，
	true 为生产环境
	false 为测试环境
*/ 
const toggleUrl = true

// 服务器地址
const BASE_URL = toggleUrl ? 'https://api.chinay.net:8848' : 'http://www.frpgz1.idcfengye.com'

// 测试资源产品 Id
const testResourceId= '1341959994957959170'	
// 测试小程序 Id
const testAppId= '2021002132633235'	

/*-----景德镇瑶里景区 strat -----*/
// 资源产品 Id
const resourceId = '1347468367946588161'
// 小程序 Id
const appId = '2021002133637774'
/*-----景德镇瑶里景区 end -----*/


export default {
	BASE_URL,
	resourceId: toggleUrl ? resourceId : testResourceId,
	appId: toggleUrl ? appId : testAppId
}