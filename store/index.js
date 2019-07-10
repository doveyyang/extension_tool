import Vue from 'vue'
import Vuex from 'vuex'
import service from '../service.js';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: false,
        userName: "",
		userInfo:'',
		info:{
			login_token:service.LOGIN_TOKEN,
			mobile:"15000004958",
		}
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        },
		setUserInfo(state,userInfo){
			console.log("userinfo",JSON.stringify(userInfo))
			state.userInfo = userInfo;
		}
    },
	actions:{
		SetLoginedInfo(context,userInfo){
			let info = uni.getStorageSync('EXTENSION_USER_INFO');
			console.log('state.info',this.state.info);
			console.log(info);
			if(info){
				context.commit('login',info.account);
				context.commit('setUserInfo',info);				
			}
		}
	}
})

export default store
