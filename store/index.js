import Vue from "vue"
import Vuex from "vuex" 

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		resourceId: '1347468348069781505',	// 资源产品 Id
		userId: '',						// 用户 Id
		resourceName: '',
		test: "Hello World"
	},
	mutations:{
		setUserId(state,userId){
			userId && (state.userId = userId)
		},
		setResourceId(state,resourceId){
			resourceId && (state.resourceId = resourceId)
		},
		setResourceName(state,resourceName){
			resourceName && (state.resourceName = resourceName)
		},
		
		// 將 vuex 中的数据保存到 storage 中
		setStorage(state,{key,data}){
			uni.setStorage({key, data})
		}
	},
	actions:{
		// 保存用户Id
		setUserIdSync(context,userId){
			context.commit('setUserId',userId)
		},
		// 保存资源名
		setResourceNameSync(context,setResourceName){
			context.commit('setResourceName',setResourceName)
		}
	}
})

export default store