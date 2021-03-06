import Vue from 'vue'
import store from './store/index.js'
import App from './App'
import {toJSON} from './mixins/clearErrLog.js'
import apis from 'API/index.js'

// 清除控制台报错
Vue.mixin(toJSON)
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$API = apis
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
