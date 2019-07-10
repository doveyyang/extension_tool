<template>
	<view class="project-container">
		<!-- 筛选操作 -->
		<!-- <view class="filter-box ">			
			<button class="mini-btn filter-item" plain type="primary" size="mini">
				日期
				<text class="iconfont icon-size">&#xe65a;</text>
			</button>
			<button class="mini-btn filter-item" plain type="primary" size="mini">
				省市
				<text class="iconfont icon-size">&#xe65a;</text>
			</button>
			<button class="mini-btn filter-item" plain type="primary" size="mini">
				状态
				<text class="iconfont icon-size">&#xe65a;</text>
			</button>
			<button class="mini-btn filter-item" plain type="primary" size="mini">
				价格
				<text class="iconfont icon-size">&#xe65a;</text>
			</button>
			<button class="mini-btn filter-item" plain type="primary" size="mini">
				公司
				<text class="iconfont icon-size">&#xe65a;</text>
			</button>
		</view> -->
	
	
		<!-- <mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit"> -->
			<view class="order-box">
				<view class="order-item" v-for="(item, index) in list" :key="index" @click="gotoDetail(item)">
					<view class="project">
						<text class="text">{{ item.name }} </text> |  <text class="text">{{item.area}}m&sup2;</text>  | <text class="text">{{item.order_id}}个点</text>
						<!-- <text class="cu-tag line-green radius " v-show="item.mytype">{{item.mytype==1?'已申请':'本公司'}}</text> -->
					</view>
					
					<view class="top-box">
						<view class="info">
							<!-- <view class="project-info">
								<view class="project">
									<text>{{ item.project_name }} </text> |  <text>{{item.area}}m&sup2;</text>  | <text>{{item.order_id}}个点</text>
									
								</view>
							</view> -->
							<view class="moneyinfo ">
								<text class="unit">￥</text><text class="money">{{item.money}}</text>元 工程款
							</view>
							<view class="person-info">
								<view class="person">
									<!-- <text class="unit">￥</text><text class="money">{{item.fmoney}}</text> 返扣 -->
								</view>
							</view>
						</view>
						<view class="status">
							
							<view class="btn-box flex">
								
								<!-- <button type="primary" class="btn" size="mini" @tap.stop="gotoDetail(item.id)"> 查看详情</button> -->
							</view>
						</view>
					</view>
					<view class="bottom-box">
						<view class="info" v-if="item.addressurl">
							<text class="iconfont">&#xe630;</text>
							{{ item.addressurl}}
						</view>
						<view class="btn-box">
							<view class="date"> <text class="iconfont padding-sm">&#xe609;</text> {{ item.date }}</view>
						</view>
					</view>
				</view>
			</view>
		<!-- </mescroll-uni> -->
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	import { mapState, mapMutations } from 'vuex';
	import service from '../service.js';
	export default{
		data(){
			return {
				currentpage: 0,
				// 下拉刷新
				mescroll: null, //mescroll实例对象
				// 下拉刷新的配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					isLock: false,//是否锁定上拉加载(设为true,可用于不触发upCallback,只保留回到顶部按钮的场景)
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				"list": [],
				index:-1,
				
			}
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin', 'info','userInfo'])
		},
		filters:{
			formateDate(val){			
					const date = new Date(val);
					const year = date.getFullYear()
					const month = date.getMonth()>9?date.getMonth()+1:`0${date.getMonth()+1}`;
					const day = date.getDate()>9?date.getDate():`0${date.getDate()}`; 
					return `${year}-${month}-${day}`;
			}
		},
		mounted(){
			this.initData();
		},
		methods:{
			updateData(){
				console.log('子组件中的updateData')
				this.mescroll && this.mescroll.triggerDownScroll();
			},
			gotoDetail(item){
				console.log('go to detail:',JSON.stringify(item))
				// debugger;
				uni.navigateTo({
					url:`/pages/details/details?id=1&detail=${JSON.stringify(item)}`
				});
				
			},
			initData(){
				if(this.hasLogin){
					
					let self = this;
					// let data = this.$customfunc.deepCopy(this.info);
					// console.log(data);
					// data.api_token = service.API_TOKEN;
					let data = {
						mobile:this.userInfo.account
					}
					debugger;
					// 获取派单记录
					this.$request
						.post('/home/Personrequest/getinfo', {
							data: data
						})
						.then(res => {
							if (res.data && res.data.code == 1) {
								// 接口返回的当前页数据列表 (数组)
								self.list = res.data.data; 
								// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
								// let totalPage = res.data.data.page; 
								// 
								// // 成功隐藏下拉加载状态
								// // 方法一(推荐): 后台接口有返回列表的总页数 totalPage
								// mescroll.endByPage(curPageData.length, totalPage+1); 
								// 
								// // 设置列表数据
								// if (pageNum == 0) self.list = []; // 如果是第一页需手动制空列表
								// self.list = self.list.concat(curPageData); // 追加新数据
							}else{
								mescroll.endByPage(0, 0); 
							}
							
						})
						.catch(e => {
							
							console.error(e);
						});
				}
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调, 有三种处理方式: */
			downCallback(mescroll){
				
				let self = this;
				// console.log('upCallback')
				if (!this.hasLogin) {
					self.mescroll.endErr();
					return;
				} 
				// 此时mescroll会携带page的参数:
				let pageNum = 0; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				
				let data = this.$customfunc.deepCopy(this.info);
				console.log(data);
				data.api_token = service.API_TOKEN;
				data.my = 0;// 公海项目
				
				// 获取派单记录
				this.$request
					.post('/home/publicbooking/index', {
						data: data
					})
					.then(res => {
						if (res.data && res.data.code == 1) {
							// 接口返回的当前页数据列表 (数组)
							let curPageData = res.data.data.list; 
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							let totalPage = res.data.data.page; 
							
							// 成功隐藏下拉加载状态
							// 方法一(推荐): 后台接口有返回列表的总页数 totalPage
							mescroll.endByPage(curPageData.length, totalPage+1); 
							
							// 设置列表数据
							if (pageNum == 0) self.list = []; // 如果是第一页需手动制空列表
							self.list = self.list.concat(curPageData); // 追加新数据
						}else{
							mescroll.endByPage(0, 0); 
						}
						
					})
					.catch(e => {
						
						console.error(e);
					});
			},
			/*上拉加载的回调*/
			upCallback(mescroll) {
				// console.log('上拉加载的回调函数')
				let self = this;
				// console.log('upCallback')
				if (!this.hasLogin) {
					self.mescroll.endByPage(0,0);
					return;
				} 
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				
				//使用this.$options.filters[]方式获取本地过滤器
			    let formateDate = this.$options.filters['formateDate'];
				
				let data = this.$customfunc.deepCopy(this.info);
				console.log(data);
				// data.datetime = formateDate(new Date());
				data.api_token = service.API_TOKEN;
				data.page=pageNum
				data.my = 0;// 公海项目
				
				// 获取派单记录
				this.$request
					.post('/home/publicbooking/index', {
						data: data
					})
					.then(res => {
						if (res.data && res.data.code == 1) {
							// 获取数据正常
							// self.currentpage = res.data.data.page;
							// // self.list = res.data.data.list;
							// 
							// // 接口返回的当前页数据列表 (数组)
							// let curPageData = res.data.data.list; 
							// // 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							// let totalPage = res.data.data.page; 
							// 
							// // 成功隐藏下拉加载状态
							// // 方法一(推荐): 后台接口有返回列表的总页数 totalPage
							// mescroll.endByPage(curPageData.length, totalPage); 
							// 
							// 设置列表数据
							// if (mescroll.num == 0) self.list = []; // 如果是第一页需手动制空列表
							self.list = self.list.concat(curPageData); // 追加新数据
							self.mescroll.endSuccess(curPageData.length);
						}else{
							self.mescroll.endErr(); 
						}
						
					})
					.catch(e => {
						self.mescroll.endErr(); 

						console.error(e);
					});
			}
		},
		components:{
			// MescrollUni,
		},
		onShow() {
			// this.mescroll&& this.mescroll.triggerDownScroll();
			this.initData()
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		}
		
	}
</script>

<style lang="scss" scoped>
	.project-container{
		
		// 记录的筛选
		.filter-box {
			margin-top: 10upx;
			border-top: 1upx solid #ececec;
			box-shadow: 0 0 20upx #ebebeb;
			display: flex;
			justify-content: space-around;
			background-color: white;
			
			.filter-item {
				vertical-align: middle;
				border: 0;
				margin: 0;
				text-align: center;
				font-size: 20upx;
				width: 100%;
				padding: 0.2em;
				color: gray;
				
				.icon-size{
					font-size: 20upx;
				}
				&:active{
					background-color: #0081FF;
				}
			}
			
		}
		
		// 订单列表
		.order-box {
			.order-item {
				box-shadow: 0 0 20upx #ebebeb;
				border: 1upx solid #dadada;
				border-radius: 8upx;
				margin: 20upx 20upx;
				padding: 10upx;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				background-color: #ffffff;
		
				.project {
					flex: 1;
					color: #45a5e5;
					font-size: 32upx;
					font-weight: 700;
					line-height: 60upx;
					
					// color: black;
					
					.text{
						color: black;
						margin:0 20upx;
						
					}
					&:first-child{
						margin-left: 0;
					}
				}
		
				.top-box {
					display: flex;
		
					.info {
						flex: 2;
						text-indent: 0.5em;
						font-size: 28upx;
						.project-info {
							display: flex;
		
							.project {
								flex: 1;
								color: #45a5e5;
								font-size: 32upx;
								font-weight: 700;
								line-height: 60upx;
								text{
									color: black;
									margin:0 20upx;
									
								}
								&:first-child{
									margin-left: 0;
								}
							}
							.date {
								flex: 1;
								font-weight: 700;
								font-size: 32upx;
								line-height: 60upx;
							}
						}
						.moneyinfo {
							line-height: 60upx;
							color: #7a7a7a;
							overflow: hidden;
		
							text {
								margin-right: 5upx;
							}
							.unit{
								color: orangered;
							}
							.money{
								font-size: 60upx;
								color: red;
							}
						}
						.person-info {
							display: flex;
							line-height: 60upx;
							// text-indent: 0.5em;
							// text {
							// 	margin-right: 5upx;
							// }
							.unit{
								color: orangered;
								margin-right: 5upx;
							}
							.money{
								font-size: 40upx;
								color: red;
								margin-right: 5upx;
							}
							.person {
								flex: 1;
								color: #7a7a7a;
								margin-right: 5upx;
							}
							.phone {
								flex: 1;
								color: #45a5e5;
		
								// text {
								// 	margin-right: 5upx;
								// 	color: #7a7a7a;
								// }
							}
						}
					}
					.status {
						flex: 1;
						display: flex;
						align-items: center;
						margin: 0 auto;
						.btn-box {
							margin: 0 auto;
							box-sizing: border-box;							
							.btn {
								border-radius: 40upx;
								background-color: #45a5e5;
								border: 0;
							}
						}
					}
				}
				.bottom-box {
					border-top: 1upx solid #dadada;
					display: flex;
		
					font-size: 24upx;
					color: #7a7a7a;
					.info {
						text-indent: 0.5em;
						margin-top: 16upx;
						flex: 2;
						white-space: nowrap;
						overflow: hidden;
						line-height: 50upx;
						.principal {
							overflow: hidden;
						}
					}
					.date {
						margin-top: 16upx;
						flex: 1;
						font-size: 32upx;
						line-height: 60upx;
					}
				}
			}
		}
	}
</style>
