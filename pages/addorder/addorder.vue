<template>
	<view class="ccontent">
		<cu-custom bgColor="bg-blue" :isBack="true"><block slot="backText"></block>
			<block slot="content">立即预约</block>
			<block slot="right">
				<view class="padding-sm" @click="gotomyorder" >
					我的预约
				</view>
			</block>
		</cu-custom>	
		<view class="header-title margin-top">
			1、您的信息
		</view>
		<form class="form">
			<view class="cu-form-group">
				<view class="title">您的电话</view>
				<input placeholder="请输入您的电话号码" type="number" v-model="phone"></input>
			</view>
			<view class="cu-form-group "  >
				<view class="title">您的姓名</view>
				
				<input placeholder="您的姓名" v-model="name"></input>
			</view>
			<view class="cu-form-group"  >
				<view class="title">您的地址</view>
				<input placeholder="请选择您的地址"  v-model="region" @click="openPicker" ></input>
				<text class="iconfont padding-lg text-lg" @click="chooseMap">&#xe630;</text>
			</view>
			<view class="cu-form-group border-bottom">
				<input placeholder="例：**路(弄)**号***栋+门牌号"  v-model="detailAddr"></input>
			</view>
			<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>			
		</form>
		
		<view class="header-title margin-top">
			2、预约信息
		</view>
		<form class="form" >
			<view class="cu-form-group">
				<view class="title">日期</view>
				<picker mode="date" :value="date" start="2019-01-01" end="2022-01-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">时间</view>
				<picker mode="time" :value="time" start="09:01" end="18:01" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">项目类型</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">
						{{index>-1?picker[index]:'点击选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">面积</view>
				<input placeholder="请输入面积" type="number" v-model="area"></input>
				 <text>m &sup2; </text>
			</view>
			<view class="cu-form-group ">
				<view class="title">采集点</view>
				<input placeholder="请输入采集点数" type="number" v-model="collectNum"></input>
				 <text> 个 </text>
			</view>
			<view class="cu-form-group ">
				<view class="title">工程款</view>
				<input placeholder="请输入预估工程款" type="number" v-model="money"></input>
				 <text> 元 </text>
			</view>
			<!-- <view class="cu-form-group ">
				<view class="title">分成</view>
				<input placeholder="请输入可分成金额(选填)" type="number" v-model="fmoney"></input>
				 <text> 元 </text>
			</view> -->
			<view class="cu-form-group align-start">
				<view class="title">备注</view>
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaBInput" placeholder="选填" v-model="remarks"></textarea>
			</view>
		</form>
		<view class="desc" >
			信息仅供工作使用，不会外传
		</view>
		
		<view class="btn-box" >
			<button type="primary" @click="addOrder">提交</button>
		</view>
		
		<!--  选择支付方式 -->
		<view class="cu-modal" :class="modalName=='payway'?'show':''" @tap.stop="hideModal">
			<view class="cu-dialog">
				
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{modalText}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="padding-lg">
						<button type="primary" @click="payby(1)">微信支付</button>
					</view>
					<view class="padding-lg margin-top">
						<button type="primary" @click="payby(0)">支付宝支付</button>
					</view>
					
				</view>
				<!-- <view class="cu-bar bg-white">					
					<view class="action margin-0 flex-sub  solid-left" @tap.stop="writeInfo">去完善</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	 
	 import { mapState, mapMutations } from 'vuex';
	 import lotusAddress from '@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue';
	 
	 import service from '../../service.js';
	export default {
		data() {
			return {
				userInfo:'',
				lotusAddressData:{
					visible:false,
					provinceName:'上海',
					cityName:'上海市',
					townName:'宝山区',
				},
				name:'',
				phone:'',
				region:'',
				detailAddr:'',
				bookingid:0,
				addressradio:'',
				addresslist:[],
				addresscode:"",
								
				time: '',
				date: '',	
				index: 0,
				picker: [],
				projectList:[], // 存放项目类型
				
				
				modalName:null,
				
				checkbox: [],
				area:'80',
				money:'80',
				fmoney:'',
				collectNum:'4',// 采集点
				remarks:'免费检测，上门提前电话联系',
				
				new_remark_name:'',  //名称
				
				disabledUserBtn:true, // 默认确认客户信息关闭
				modalText:'',
				orderId:'',
			};
		},
		components: {
			lotusAddress
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin', 'userName', 'loginToken', 'loginType','info'])
		},
		mounted(){
			// if(this.hasLogin){
			// 	console.log('hasLogin',this.hasLogin);
			// 	
			// }
			this.initData()
		},
		methods: {
			gotomyorder(){
				// 到我的预约界面
				uni.navigateTo({
					url:'/pages/main/main'
				})
			},
			initData(){
				console.log('加载数据')
				// 初始化日期
				let today = new Date();
				let month = today.getMonth()+1;
				
				this.date = `${today.getFullYear()}-${month>9?month:`0${month}`}-${today.getDate()>9?today.getDate():'0'+today.getDate()}`;
				this.time = `${today.getHours()}:00`;
				
				// 获取项目类型
				this.getProjectType();
				
			},
			//打开picker
			openPicker() {
				uni.showToast({
					icon:'loading',
					duration:500,
				})
				uni.hideKeyboard()
				this.lotusAddressData.visible = true;
			},
			//回传已选的省市区的值
			choseValue(res){
				this.lotusAddressData.visible = res.visible;//visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if(res.isChose){
					this.lotusAddressData.provinceName = res.provice;//省
					this.lotusAddressData.cityName = res.city;//市
					this.lotusAddressData.townName = res.town;//区
					this.region = `${res.provice},${res.city},${res.town}`; //region为已选的省市区的值
					this.addresscode = `${res.cityId},${res.provinceId},${res.townId}`;
				}
			},
			chooseMap(){
				let self = this;
				uni.chooseLocation({
					success: function (res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						self.region = `${res.address}`; //region为已选的省市区的值
						self.addressCode = `${res.latitude}-${res.longitude}`;
						self.detailAddr = res.name;
					}
				});
			},
			cancelOpertion(){
				// this.mo
				this.hideModal();
				this.phone = '';
			},
			// 获取项目类型 
			getProjectType(){				
				let self = this;
				let data =  this.$customfunc.deepCopy(this.info);
				data.api_token = service.API_TOKEN;
				this.$request.post('/home/My/getprolist',{data})
				.then(res=>{
					if(!res.data || res.data.code !=1){
						uni.showToast({
							title: res.data.msg || '服务器繁忙',
							icon:'none'
						});
					}else{ 
						if(res.data.data){
							let list = res.data.data.map(x=>x.name)
							self.projectList = res.data.data;
							self.picker = list;							
						}
					}
				}).catch(e => {
					console.error(e)
				});
			},
			
			// 修改时间
			TimeChange(e) {
				this.time = e.detail.value
			},
			// 修改日期
			DateChange(e) {
				this.date = e.detail.value
			},
			// 修改项目类型
			PickerChange(e) {
				if(e.detail.value==-1){
					this.index = 0;
				}else{
					this.index = e.detail.value
				}
			},
			payby(type){
				let self = this;				
				let data = {};
				// debugger;
				data.id = this.orderId;
				data.pay_type = 0;
				// debugger;
				uni.showLoading({})
				this.$request.post('/home/Personrequest/pay',{data})
				.then(res=>{
					if(!res.data || res.data.code !=1){
						uni.showToast({
							title: res.data.msg || '服务器繁忙',
							icon:'none'
						});
					}else{ 
						uni.showToast({
							title: res.data.msg,														
						});
						
					}
				}).finally(e=>{
					setTimeout(function(){
						uni.hideLoading()
						uni.navigateBack({
							delta: 1
						});
					},1500)
					
				}).catch(e => {
					console.error(e)
				});
			},
			
			// 打开多选图框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			// 隐藏多选图框
			hideModal(e) {
				this.modalName = null
			},
			// 多选按钮
			ChooseCheckbox(e) {
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked;
						break
					}
				}
			},
			// 修改备注
			textareaBInput(e) {
				this.textareaBValue = e.detail.value
			},
			validateData(){
				
				if(this.index==-1){
					uni.showToast({
						title:'请选择项目类型',
						icon:'none'
					})
					return false;
				}				
				if(!this.time){
					uni.showToast({
						title:'请选择项目时间',
						icon:'none'
					})
					return false;
				}
				if(!this.date){
					uni.showToast({
						title:'请选择项目日期',
						icon:'none'
					})
					return false;
				}
				return true;
			},
			pay(){
				// 请选择支付方式				
			},
			addOrder(){
				//  TODO: 验证数据是否为空
				if(!this.validateData()){
					return;
				}
				uni.showToast({
					title:'订单添加成功'					
				})
				
				// 添加订单
				let self = this;				
				let data = {};
				// {
				// 	mobile:this.userInfo.account
				// }
				data.mobile = this.phone;
				data.nickname = this.name;
				if(this.index>-1){
					data.project= this.projectList[this.index].id;
				}
				data.area = this.area;
				data.money =this.money;
				data.remark = this.remarks;
				data.order_id = this.collectNum;
				// data.booking_time = this.time;
				data.date=`${this.date} ${this.time}`;
				data.addressurl = this.region;
				data.addressinfo = this.detailAddr;
				data.addresscode = this.addresscode ||',';
				// data.fmoney =this.fmoney;
				data.pay_type = 0;
				// debugger;
				uni.showLoading({})
				this.$request.post('/home/Personrequest/index',{data})
				.then(res=>{
					if(!res.data || res.data.code !=1){
						uni.showToast({
							title: res.data.msg || '服务器繁忙',
							icon:'none'
						});
					}else{ 
						uni.showToast({
							title: res.data.msg,							
						});
						self.modalText = res.data.msg;
						self.modalName = 'payway';
						// debugger;
						self.orderId = res.data.data.data.id;
						
					}
				}).finally(e=>{
					uni.hideLoading()
				}).catch(e => {
					console.error(e)
				});
			}
		},
	}
</script>

<style lang="scss">
.ccontent{
	width: 100%;
	background-color: #FFFFFF;
}
 .btn-box{
	 margin: 20upx 10upx;
	 button{
		 border-radius: 98upx;
	 }
 }
 input{
	 text-align: right;
	 width: 100%;
 }
 .form{
	 width: 100%;
 }
 
 .desc{
	 font-size: 24upx;
	 text-align: right;
	 color: #CCCCCC;
	 padding: 0 20upx;
	 // position: absolute;
	 // right: 20upx;
 }
 .desc::before{
	 content: '*';
	 color: red;
 }
 .border-bottom{
	 border-bottom: 1px solid #EFEFEF;
 }
 .header-title{
	 text-indent: 1em;
	 font-size:28upx;
	 color: #0071BD;
 }
 .usertitle{
	 overflow: hidden;
 }
 .addbtn{
	 border-radius: 1em;;
	 background-color: #1792E9;
	 color: #FFFFFF;
	 padding: 0.2em 1em;
	 
 }
 .addinput{
	 text-align: left;
	 font-size: 14px;
	 line-height: 1.8em;
	 // text-indent: 1em;
	 margin-left: 1em;
 }
</style>
