 
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

// 资源产品 Id
const resourceId = '1347468349994967042'
// 小程序 Id
const appId = '2021002132632626303'

/*-----婺源风景区 strat -----*/
// 资源产品 Id
// const resourceId = '1347468369330708481'
// 小程序 Id
// const appId = '2021002133672716'
/*-----婺源风景区 end -----*/

/*-----上饶灵山景区 strat -----*/
// 资源产品 Id
// const resourceId = '1347468346635329538'
// 小程序 Id
// const appId = '2021002133623382'
/*-----上饶灵山景区 end -----*/

/*-----鄱阳湖大草原景区 strat -----*/
// 资源产品 Id
// const resourceId = '1357572469411487746'
// 小程序 Id
// const appId = '2021002133631855'
/*-----鄱阳湖大草原景区 end -----*/

/*-----景德镇瑶里景区 strat -----*/
// 资源产品 Id
// const resourceId = '1347468367946588161'
// 小程序 Id
// const appId = '2021002133637774'
/*-----景德镇瑶里景区 end -----*/

export default {
	BASE_URL,
	resourceId: toggleUrl ? resourceId : testResourceId,
	appId: toggleUrl ? appId : testAppId
}