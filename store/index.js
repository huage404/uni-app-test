import Vue from "vue"
import Vuex from "vuex" 

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		resourceId: '2021002132633235',	// 资源产品 Id
		userId: '',						// 用户 Id
		test: "Hello World"
	},
	mutations:{
		setUserId(state,userId){
			state.userId = userId
			this.commit('setStorage',{
				key: 'userId',
				data: userId
			})
		},
		setResourceId(state,resourceId){
			resourceId && (state.resourceId = resourceId)
			this.commit('setStorage',{
				key: 'resourceId',
				data: state.resourceId
			})
		},
		setStorage(state,{key,data}){
			uni.setStorage({key, data})
		}
	},
	actions:{
		setUserIdSync(context,userId){
			context.commit('setUserId',userId)
		}
	}
})

export default store