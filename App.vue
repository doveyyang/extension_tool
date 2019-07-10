<script>	
	import { mapState, mapMutations } from 'vuex';
	import Vue from 'vue';
	export default {
		onLaunch: function() {
			// console.log('App Launch');
			
			debugger;
			let userinfo = uni.getStorage({
				key:'userinfo',
				success:(res =>{
					debugger;
					if(!res.data){
						// 如果客户没有登录过就直接进入添加预约界面
						uni.navigateTo({
							url:'/pages/addorder/addorder'
						})
					}else{
						// 已经登录过，进入列表界面
						this.$store.dispatch('SetLoginedInfo');
						uni.navigateTo({
							url:'/pages/main/main'
						})
					}
				}),
			})
			if(!userinfo){
				// 如果客户没有登录过就直接进入添加预约界面
				uni.navigateTo({
					url:'/pages/addorder/addorder'
				})
			}
				
				
			
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					}
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			});
		},
		onShow: function() {
			// console.log('App Show');
		},
		onHide: function() {
			// console.log('App Hide');
		},
		computed: {
		...mapState(['hasLogin'])
	},
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";	
	
	/* 引入字体图标 */
	@import './static/iconfonts/iconfont.css';
</style>
