<template>
    <view class="ccontent ">
		<cu-custom bgColor="bg-blue" :isBack="false"><block slot="backText"></block>
			<block slot="content">项目主页</block>
			<block slot="right"><text class="cuIcon-add padding-lg" @tap="addOrder"></text></block>
		</cu-custom>
		<!-- <view class="operate-box padding-sm" >
			<button type="default" @click="addOrder">添加项目</button>
		</view> -->
		<view class="padding-sm">			
			<view v-if="hasLogin" class="hello">
				<view class="title text-center">
					您好 {{userName}}，欢迎注册净醛公海平台
				</view>			   
			</view>
			<view v-if="!hasLogin" class="hello">
				<view class="title text-center">
					您好 游客。
			   </view>           
			</view>		
		</view>
		<view class="list-box">			
			<seapro ref="seaproref"></seapro>
		</view>
		
    </view>
</template>

<script>
    import {
        mapState
    } from 'vuex'
	import seapro from '@/components/seaproject.vue';
    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data(){
			return {
				list:[]
			}
		},
        mounted() {
            if (!this.hasLogin) {
                uni.showModal({
                    title: '未登录',
                    content: '您未登录，需要登录后才能继续',
                    /**
                     * 如果需要强制登录，不显示取消按钮
                     */
                    showCancel: !this.forcedLogin,
                    success: (res) => {
                        if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
                            if (this.forcedLogin) {
                                uni.reLaunch({
                                    url: '../login/login'
                                });
                            } else {
                                uni.navigateTo({
                                    url: '../login/login'
                                });
                            }
                        }
                    }
                });
            }
			// if()
        },
		components:{		
			seapro
		},
		onShow() {
			// debugger;
			if(this.$refs.seaproref)
			this.$refs.seaproref.initData();
		},
		methods:{
			addOrder(){
				uni.navigateTo({
					url:"/pages/addorder/addorder"
				})
			},
			
		},
		
		
    }
</script>

<style>
	
    .hello {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .title {
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul {
        font-size: 30upx;
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul>view {
        line-height: 50upx;
    }
	.list-box{
		height: 450px;
	}
</style>
