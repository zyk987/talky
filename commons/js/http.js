const serverUrl = 'http://47.110.32.55:3000'		//服务器地址
const socketUrl = 'http://47.110.32.55:5000'		//服务器socket地址
const baseUrl = 'http://47.110.32.55:3000/api';    //服务器请求地址
// const serverUrl = 'http://localhost:3000' //本地地址
// const socketUrl = 'http://localhost:5000' //本地socket地址
// const baseUrl = 'http://localhost:3000/api'; //本地请求地址

const httpRequest = (options) => {
	const value = uni.getStorageSync('user');
	let httpDefaultOpts = {
		url: baseUrl + options.url,
		data: options.data,
		beforeSend: function(xmlHttp) {
			xmlHttp.setRequestHeader("If-Modified-Since", "0");
			xmlHttp.setRequestHeader("Cache-Control", "no-cache");
		},
		method: options.method,
		header: options.method == 'GET' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'content-type': 'application/x-www-form-urlencoded'
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httpDefaultOpts).then((res) => {
			if (res[1]) {
				let status = res[1].data.status;
				if (status == 300) {
					uni.navigateTo({
						url: '../signin/signin?name=' + value.name
					});
				} else if (status == 500) {
					reject('err');
					uni.showToast({
						title: '服务器出错了!',
						icon: 'none',
						duration: 2000
					});
				}else{
					resolve(res[1])
				}
			}
			// resolve(res[1])
		}).catch((response) => {
			reject(response)
		})
	})
	return promise
};
export default {
	serverUrl,
	socketUrl,
	baseUrl,
	httpRequest
}
