import Vue from 'vue'
import App from './App'

import store from './store'
// 引入request
import request from '@/common/request/request.js'
import init from '@/common/request/initRequest.js'
import customfunc from '@/common/customfunc/customfunc.js'
// 引入color UI
import cuCustom from './colorui/components/cu-custom.vue'

Vue.config.productionTip = false

Vue.prototype.$store = store
// 添加自定义方法集
Vue.prototype.$customfunc = customfunc;

// 初始化请求
init(request);
// 挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法
Vue.prototype.$request = request;

Vue.component('cu-custom',cuCustom)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
