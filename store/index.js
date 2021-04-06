import Vue from "vue"
import Vuex from "vuex" 

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		authCode: '',
		userId: ''
	},
	mutations:{
		setAuthCode(state,authCode){
			state.authCode = authCode
		}
	}
})

export default store