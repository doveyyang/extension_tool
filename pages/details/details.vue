<template>
	<view class="detail-container">
		<cu-custom bgColor="bg-blue" :isBack="true"><block slot="backText"></block>
			<block slot="content">项目详情</block>
			<!-- <block slot="right"><view class="iconfont padding-sm" @tap="$refs.dshare.show()"> <text class="cuIcon-share "></text></view></block> -->
		</cu-custom>	
		
		<view class="project-box flex flex-direction justify-center">
			<view class="money margin-top">
				￥ <text class="number">{{detailinfo.money}}</text> 元 工程款
			</view>
			<!-- <view class="fmoney">
				<text>￥{{fmoney}} 元 返扣</text>
			</view> -->
			<view class="info-box flex justify-around">
				<view class="item">
					<view class="title">
						{{detailinfo.name}}
					</view>
					<view class="name">
						项目类型
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detailinfo.area}}m&sup2;
					</view>
					<view class="name">
						面积
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detailinfo.order_id}}个点
					</view>
					<view class="name">
						采集点
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detailinfo.date}}
					</view>
					<view class="name">
						施工时间
					</view>
				</view>
			</view>
			
			<view class="address-box padding-sm">
				<text class="iconfont">&#xe61d;</text>
				<text class="address text-blue">{{detailinfo.addressurl}}</text>
			</view>
			
			<view class="status-box">
				<image src="/static/img/sea/weiwancheng.png" mode="widthFix" v-if="detailinfo.type==0"></image>
				<image src="/static/img/sea/yiwancheng.png" mode="widthFix" v-else></image>
			</view>
		</view>
		
		<!-- 甲方信息 -->
		<!-- <view class="common-box margin-top">
			<view class="title">
				<text>甲方信息</text>
			</view>
			<view class="info-box flex" v-if="person">
				<view class="avatar">
					<view class="cu-avatar lg round " :style="'background-image:url('+person.head_img+')'"></view>
				</view>
				<view class="info flex flex-direction justify-around ">
					<view class="project">						
						<text class="name ">{{person.name}}</text>
					</view>
					<view class="">
						<text class="">{{person.nickname}}</text>
					</view>
					<view class="date ">
						<text class="iconfont">&#xe639;</text> {{person.mobile}} 
					</view>
				</view>
				<view class="btn-box flex flex-direction justify-around" @tap="showCompanyDetail()">
					<text class="text-right text-blue">查看公司>></text>
				</view>
			</view>
		</view> -->
		<!-- 客户信息 -->
		<view class="common-box margin-top">
			<view class="title">
				<text>客户信息</text>
			</view>
			<view class="info-box flex" >
				<view class="avatar">
					<view class="cu-avatar lg round " :style="'background-image:url('+cuhead_img+')'"></view>
				</view>
				<view class="info flex flex-direction justify-around ">
					<view class="project">						
						<text class="name ">{{detailinfo.name}}</text>
					</view>
				
					<view class="date " v-show="detailinfo.mobile">
						<text class="iconfont">&#xe639;</text> {{detailinfo.mobile}} 
					</view>
				</view>
				<view class="btn-box flex flex-direction justify-around" v-show="!detailinfo.mobile">
					<text class="iconfont text-blue text-center"> &#xe61b; </text>
				</view>
			</view>
		</view>
		
		<!-- 项目信息 -->
		<view class="common-box margin-top">
			<view class="title">
				<text>项目信息</text>
			</view>
			<view class="detail-box">
				<view class="flex justify-around ">
					<view class="item flex">
						<text class="name text-right">项目类型:</text>
						<text class="content text-left">{{detailinfo.name}}</text>
					</view>
					<view class="item flex">
						<text class="name text-right">采集点:</text>
						<text class="content text-left">{{detailinfo.order_id}}个</text>
					</view>
				</view>
				<view class="flex justify-around ">
					<view class="item flex">
						<text class="name text-right">开工时间:</text>
						<text class="content text-left start-date">{{ detailinfo.date }}</text>
					</view>
					<view class="item flex">
						<text class="name text-right">工程款:</text>
						<text class="content text-left text-orange">{{detailinfo.money}}元</text>
					</view>
				</view>
				<view class="flex justify-around ">
					<view class="item flex">
						<text class="name text-right">面积:</text>
						<text class="content text-left">{{detailinfo.area}}m&sup2;</text>
					</view>
					<view class="item flex">
						<text class="name text-right">分成:</text>
						<text class="content text-left text-orange">-</text>
					</view>
				</view>
				<view class="flex justify-around ">
					<view class="item flex">
						<text class="name text-right">地址:</text>
						<text class="content text-left">{{detailinfo.addressurl}}</text>
					</view>
					<view class="item flex">
						<text class="name text-right">项目状态:</text>
						<text class="content text-left text-blue">{{detailinfo.type==0?'未完成':'已完成'}}</text>
					</view>
				</view>
				<view class="flex justify-around  border-bottom">
					<view class="item flex  ">
						<text class="name text-right">备注:</text>
						<text class="text-gray desc">{{detailinfo.remark}}</text>
					</view>
				</view>				
			</view>
		</view>
	
		<!-- <view class="btn-box flex margin-top" v-show="my!=2">
			<button   class="bg-blue text-white" @click="makeCall">联系甲方</button>
			<button   class="bg-orange text-white" @click="apply">{{my==1?'取消申请':'马上申请'}}</button>
		</view> -->
		<!-- 
		<doveyShare :para="'/pages/projectdetail/projectdetail?id='+id" ref="dshare" :title="`免费接单子啦`" 
		:summary="'我正在使用净醛系统分享我的单子，赶紧跟我一起来体验吧！'"></doveyShare> -->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';	
	import service from '../../service.js';
	
	export default {
		data() {
			return {
				id:0,
				datetime:'-',
				order_id:0,
				money:0,
				area:0,
				aname:'-',
				project_name:'-',
				address:'-',
				fmoney:0,
				head_img:'/static/missing-face.png',
				cuhead_img:'/static/missing-face.png',
				uid: 56,
				booking_time: "",
				pro_id: 6,
				type: 0,
				maketype: 0,
				clicknum: 0,
				time: 1559790973,
				remark: "",
				person: {
					"id": 2,
					"nickname": "",
					"mobile": "",
					"name": "",
					"addressurl": null,
					"addressinfo": null,
					"addresscode": "",
					"head_img": null
				},
				nickname: "",
				mobile: "",
				addressurl: "",
				addressinfo: "",
				my:'',
				com_id:'',
				detailinfo:'',
			}
		},
		filters:{
			formateDate(val){			
				const date = new Date(val);
				const year = date.getFullYear()
				const month = date.getMonth()>9?date.getMonth()+1:`0${date.getMonth()+1}`;
				const day = date.getDate()>9?date.getDate():`0${date.getDate()}`; 
				// console.log(`${year}-${month}-${day}`);
				return `${year}-${month}-${day}`;
			}
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin', 'userName', 'loginToken', 'loginType','info'])
		},
		components:{
			// doveyShare
		},
		onLoad(option) {
			debugger;
			if(option.detail){
				this.id = 1;
				
				this.detailinfo = JSON.parse(option.detail);
			}else{
				// uni.navigateTo({
				// 	url:'../../public/login/index'
				// })
				// uni.navigateBack({
				// 	delta:1
				// })
			}
		},
		mounted(){
			if(this.hasLogin){
				console.log('hasLogin',this.hasLogin);
				// this.initData() 
			}
		},
		methods:{
			initData(){
				let self = this;
				uni.showLoading()
				let data = this.$customfunc.deepCopy(this.info);
				
				data.api_token = service.API_TOKEN;
				data.id = this.id;
				this.$request.post('/home/publicbooking/info',{data})
				.then(res=>{
					if(!res.data || res.data.code !=1){
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
					}else{						
						let info = res.data.data;
						self.datetime = info.datetime;
						self.order_id = info.order_id;
						self.money = info.money;
						self.area = info.area;
						self.aname = info.aname;
						self.project_name = info.project_name;
						self.fmoney = info.fmoney;
						self.head_img = info.head_img;
						self.maketype = info.maketype;
						self.time = info.time;
						self.remark = info.remark;
						self.person = info.person;
						self.nickname = info.nickname;
						self.addressurl = info.addressurl;
						self.addressinfo = info.addressinfo;
						self.mobile = info.mobile;
						self.my = info.my;
						self.com_id = info.com_id;
					}
				}).finally(e=>{
					uni.hideLoading()
				}).catch(e => {
					console.error(e)
				});
			},
			makeCall(){
				uni.makePhoneCall({
					phoneNumber:this.mobile
				})
			},
			apply(){
				// let self = this;
				// uni.showLoading()
				// let data = this.$customfunc.deepCopy(this.info);
				// 
				// data.api_token = service.API_TOKEN;
				// data.id = this.id;
				// let url = '/home/publicbooking/reception';
				// if(this.my==1){
				// 	url='home/publicbooking/rmrequest'
				// }
				// this.$request.post(url,{data})
				// .then(res=>{
				// 	if(!res.data || res.data.code !=1){
				// 		uni.showToast({
				// 			title: res.data.msg,
				// 			icon:'none'
				// 		});
				// 	}else{
				// 		uni.showToast({
				// 			title: res.data.msg,
				// 			success(){
				// 				self.initData();
				// 			}
				// 		});
				// 	}
				// }).finally(e=>{
				// 	setTimeout(function() {uni.hideLoading()}, 1500);					
				// }).catch(e => {
				// 	console.error(e)
				// });
			},
			showCompanyDetail(){
				// 
				uni.navigateTo({
					url:"./companyinfo/companyinfo"
				})
			}
		}
	}
</script>

<style lang="scss">
.detail-container{
	width: 100%;
	.project-box{
		background-color: white;
		width: 100%;
		position: relative;
		.money{
			padding: 10upx;
			text-align: center;
			color: #949494;
			.number{
				color: #F45D1D;
				font-size: 60upx;
				margin: 0 10upx 0 0;
				font-weight: 700;
			}
		}
		.fmoney{
			padding: 10upx;
			text-align: center;
			color: #F45D1D;
			text{
				border: 1upx solid #c8c7cc;
				padding: 5upx 40upx;
				border-radius: 40upx;
			}
		}
		.info-box{
			margin-top: 10upx;
			padding: 10upx;
			border-bottom: 1upx solid #c8c7cc;
			.item{
				text-align: center; 
				padding: 10upx;
				.title{
					font-size: 32upx;
					line-height: 1em;
					font-weight: 700; 
				}
				.name{ 
					margin-top: 10upx;
					font-size: 24upx;
				}
			}
		}
		.address-box{
			font-size: 30upx;
			.address{
				margin-left: 10upx;
			}
		}
		.status-box{
			right: 30upx;
			top: 0;
			position: absolute;
			width:44upx;
			height: 123upx;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		
	}
	.picture-box{
		background-color: white;
		.title{
			font-weight:700;
		}
	}
	.desc-box{
		background-color: white;
		
		.title{
			font-weight:700;
		}
		.content{
			color: #949494;
			text-indent: 2em;
			line-height: 1.5em;
		}
	}
		
	.logo-box{
		background-color: white;
		height: 350upx;
		.logo{
			margin: 0 auto;
			width: 112upx;
			height: 124upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.slogan{
			// margin: 0 auto;
			text-align: center;
			line-height: 2em;
			font-size: 28upx;
			font-weight: 700;
		}
		background: url('/static/img/sea/bg-logo.png') no-repeat bottom;
	}
	// 发布方
	.common-box{
		width: 100%;
		background-color: white;
		// border: 1px solid red;
		.title{
			color:  #2C94ED;
			// border: 1upx solid purple;
			// padding: 0upx  20upx 0upx 0upx;
			
			text{
				padding:0 40upx;
				margin: 10upx 20upx 10upx 0;
				display: inline-block;
				// border-right: 
				background-color: #2C94ED;
				color: white;
				
				border-radius: 0 20upx 20upx 0;
			}
		}
		// 列表
		.info-box{
			color: #949494;
			width: 100%;
			padding: 20upx;
			// border-bottom: 1upx solid #ccc;
			// border: 1upx solid pink;
			.avatar{
				flex: 1;
			}
			.info{
				// border: 1px solid purple;
				flex:4;
				overflow: hidden;
				.name{
					color: gray;
				}
				.date{
					margin-top: 10upx;
					color: #F45D1D;
				}
			}
			.btn-box{
				flex:1;
				// border: 1upx solid pink;
				white-space: nowrap;
			}
		}
		
		// 项目信息
		.detail-box{
			// border: 1px solid blue;
			padding: 10upx;
			.item{
				// border: 1px solid purple;
				flex: 1;
				.name{
					flex:1;
					color: #949494;
					font-size: 24upx;
					margin-right: 10upx;
					// border: 1upx solid red;
					white-space: nowrap;
					line-height: 40upx;
				}
				.content{
					flex:1;
					white-space: nowrap;
					text-align: justify;
					word-break: break-all;
					font-size: 28upx;
					line-height: 40upx;
					overflow: hidden;
					white-space: initial;
					
				}
				.start-date{
					white-space: nowrap;
					overflow: hidden;
				}
				.desc{
					flex:3;
					// border: 1upx solid pink;
					// white-space: nowrap;
					// line-height: 1em;
					text-align: justify;
					word-break: break-all;
					padding: 0 10upx 0 0 ;
					line-height: 40upx;

				}
			}
		}
	}

	// 
	.btn-box{
		width: 100%;
		button{
			width: 100%;
			border-radius: 0;
		}
	}
}
</style>
