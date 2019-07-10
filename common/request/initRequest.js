function init(request){	
	// 设置拦截器的配置
	// 全局配置
	request.setConfig({
	  baseUrl: 'http://lost.jade2707.top', // 此为线上地址，需加入到域名白名单，或者更改为您自己的线上地址即可
	  // baseUrl:'http://www.auth.com',
	  dataType: 'json', // 可删除，默认为json
	  // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
	  headers: {
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Headers':'*',
		'Access-Control-Allow-Methods':'*',
		'content-type':'application/json;application/x-www-form-urlencoded; charset=UTF-8',
		'api_token' : 'a935f146542257018700e139720407520cee23e1'
	  }
	})
	
	// 设置请求拦截器
	request.interceptors.request(config => {
	  // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数
	  // config.data.api_token = 'a935f146542257018700e139720407520cee23e1';
	  return config; // 返回修改后的配置，如未修改也需添加这行
	})
	
	// 设置响应拦截器
	request.interceptors.response(res => {
	  return res; // 原样返回
	})
	
}
export default init;