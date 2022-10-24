export default {
	//首页时间转化
	dateTime(e) {
		let old = new Date(e);
		let now = new Date();
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
		//获取now具体时间
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth() + 1;
		let nD = now.getDate();
		//当天的时间
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		}
		//昨天的时间
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天' + h + ':' + m;
		} else {
			return Y + '/' + M + '/' + D;
		}
	},
	//聊天时间
	chatTime(e) {
		let old = new Date(e);
		let now = new Date();
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
		//获取now具体时间
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth() + 1;
		let nD = now.getDate();
		//当天的时间
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		}
		//昨天的时间
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天' + h + ':' + m;
		} else if (Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return M + '月' + D + '日 ' + h + ':' + m;
		} else {
			return `${Y}年${M}月${D}日${h}:${m}`;
		}
	},
	//详细时间
	detialTime(e) {
		let old = new Date(e);
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();

		//处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (h < 10) {
			h = '0' + h;
		}
		return `${Y}-${M}-${D} ${h}:${m}`
	},
	ymdDate(e) {
		let old = new Date(e);
		//获取old具体时间
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
	
		//处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		return `${Y}-${M}-${D}`;
	},
	//文件夹使用时间
	fileName(e) {
		let old = new Date(e);
		//获取old具体时间
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
	
		//处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		return Y+M+D;
	},
	//间隔时间差
	spaceTime(near,early){
		near=new Date(near);
		early=new Date(early);
		
		var tnear = near.getTime();
		var tearly = early.getTime();
		if(tearly>(tnear+1000*60*5)){
			return early;
		}else{
			return '';
		}
	},
	//防抖
	debounce(func,wait=500){
		let timer=null;
		return function(){
			let args = arguments;
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				func.apply(this,args);
			},wait)
		}
	},
}
