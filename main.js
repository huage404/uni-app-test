import Vue from 'vue'
import App from './App'
import {toJSON} from './mixins/clearErrLog.js'

// 清除控制台报错
Vue.mixin(toJSON)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
