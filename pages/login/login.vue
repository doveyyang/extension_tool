<template>
    <view class="ccontent">
		<cu-custom bgColor="bg-blue" :isBack="false"><block slot="backText"></block>
			<block slot="content">登陆</block>
			<!-- <block slot="right"><text class="cuIcon-add padding-lg" @tap="addOrder"></text></block> -->
		</cu-custom>
        <view class="input-group padding-sm">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input class="m-input" type="number" clearable focus v-model="account" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row">
                <text class="title">验证码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入验证码"></m-input>
				
            </view>
        </view>
		<view class="text-right padding-sm">
			<view :class="{'text-gray':count>0}" @tap="getCode" >
				{{codetext}}
			</view>
		</view>
        <view class="btn-row padding-sm">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js';
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
                positionTop: 0,
				codetext:'获取验证码',
				count:-1,
            }
        },
        computed: mapState(['forcedLogin']),
        methods: {
            ...mapMutations(['login']),
            
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
			getCode(){
				let self = this;
				if(this.count<0){
					let self = this;				
					let data = {};
					// debugger;
					data.username = this.account;
					data.type = 'sweep';
					data.api_token = service.API_TOKEN;
					// debugger;
					uni.showLoading({})
					debugger;
					this.$request.post('/home/Jqlogin/sms',{data})
					.then(res=>{
						if(!res.data || res.data.code !=1){
							uni.showToast({
								title: res.data.msg || '服务器繁忙',
								icon:'none'
							});
						}else{ 
							self.count = 60;
							let n = setInterval(()=>{
								self.codetext = `${self.count}后可重新获取`
								self.count--;
								if(self.count<0){
									// self.count = 60;
									self.codetext = "获取验证码"
									clearInterval(n);
								}
							},1000)
							uni.showToast({
								title:'验证码为：' + res.data.msg,
							})
							console.log(res.data.msg);
							
						}
					}).finally(e=>{
						setTimeout(function(){
							uni.hideLoading()
						},1500)
						
					}).catch(e => {
						console.error(e)
					});
					
					
					
				}
			},
            bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                /**
                 * 下面简单模拟下服务端的处理
                 * 检测用户账号密码是否在已注册的用户列表中
                 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
                 */
                const data = {
                    account: this.account,
                    password: this.password
                };
				
                // const validUser = service.getUsers().some(function (user) {
                //     return data.account === user.account && data.password === user.password;
                // });
				let self = this;				
				let ndata = {};
				// debugger;
				ndata.username = this.account;
				ndata.validateCode = this.password;
				ndata.api_token = service.API_TOKEN;
				ndata.sms_type = 2; //验证sweep的短信   0 注册 1 忘记密码 2 sweep  3 通过验证 4 拒绝验证 6 启用 7禁用 8 给治理员发短信
				// debugger;
				uni.showLoading({})
				debugger;
				this.$request.post('/home/Jqlogin/verify',{data:ndata})
				.then(res=>{
					if(!res.data || res.data.code !=1){
						uni.showToast({
							title: res.data.msg || '服务器繁忙',
							icon:'none'
						});
					}else{ 
						
						console.log(res.data.msg);
						self.saveUserInfo(data),
						
						self.toMain(this.account);
					}
				}).finally(e=>{
					setTimeout(function(){
						uni.hideLoading()
						
					},1500)
					
				}).catch(e => {
					console.error(e)
				});
				
				
                // if (validUser) {
                //     this.toMain(this.account);
                // } else {
                //     uni.showToast({
                //         icon: 'none',
                //         title: '用户账号或密码不正确',
                //     });
                // }
            },
            oauth(value) {
                uni.login({
                    provider: value,
                    success: (res) => {
                        uni.getUserInfo({
                            provider: value,
                            success: (infoRes) => {
                                /**
                                 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                                 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                                 */
                                this.toMain(infoRes.userInfo.nickName);
                            }
                        });
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            toMain(userName) {
                this.login(userName);
				
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../main/main',
                    });
                } else {
                    uni.navigateBack();
                }

            },
			saveUserInfo(data){
				uni.setStorage({
					key:"EXTENSION_USER_INFO",
					data:data
				})
				this.$store.dispatch('SetLoginedInfo');
			},
        },
        onReady() {
            this.initPosition();
            // this.initProvider();
        }
    }
</script>

<style>
    body,
    page {
    	min-height: 100%;
    	display: flex;
    }
    
    /* #ifdef MP-BAIDU */
    page {
    	width: 100%;
    	height: 100%;
    	display: block;
    }
    
    swan-template {
    	width: 100%;
    	min-height: 100%;
    	display: flex;
    }
    
    /* #endif */
    
    /* 原生组件模式下需要注意组件外部样式 */
    m-input {
    	width: 100%;
    	min-height: 100%;
    	display: flex;
    }
    
    .ccontent {
    	display: flex;
    	flex: 1;
    	flex-direction: column;
    	background-color: #efeff4;
    	
    }
    
    .input-group {
    	background-color: #ffffff;
    	margin-top: 40upx;
    	position: relative;
    }
    
    .input-group::before {
    	position: absolute;
    	right: 0;
    	top: 0;
    	left: 0;
    	height: 1upx;
    	content: '';
    	-webkit-transform: scaleY(.5);
    	transform: scaleY(.5);
    	background-color: #c8c7cc;
    }
    
    .input-group::after {
    	position: absolute;
    	right: 0;
    	bottom: 0;
    	left: 0;
    	height: 1upx;
    	content: '';
    	-webkit-transform: scaleY(.5);
    	transform: scaleY(.5);
    	background-color: #c8c7cc;
    }
    
    .input-row {
    	display: flex;
    	flex-direction: row;
    	position: relative;
    }
    
    .input-row .title {
    	width: 20%;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 0;
    	padding-left: 30upx;
    	line-height: 50upx;
    }
    
    .input-row.border::after {
    	position: absolute;
    	right: 0;
    	bottom: 0;
    	left: 15upx;
    	height: 1upx;
    	content: '';
    	-webkit-transform: scaleY(.5);
    	transform: scaleY(.5);
    	background-color: #c8c7cc;
    }
    
    .btn-row {
    	margin-top: 50upx;
    	padding: 20upx;
    }
    
    button.primary {
    	background-color: #0faeff;
    }
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    
    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }
    
    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    
    .oauth-image {
        width: 100upx;
        height: 100upx;
        border: 1upx solid #dddddd;
        border-radius: 100upx;
        margin: 0 40upx;
        background-color: #ffffff;
    }
    
    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 20upx;
    }
</style>
