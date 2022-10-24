<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center">
				<view class="title">{{ fname }}</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="more-img" v-if="type == 1" @tap="goGroupDetail()"><image src="../../static/icon/detail.png"></image></view>
			</view>
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{ paddingBottom: inputh + 'px' }">
				<view class="loading" :class="{ displaynone: isloading }"><image src="../../static/icon/loading.png" class="loading-img" :animation="animationData"></image></view>
				<view class="chat-ls" v-for="(item, index) in msgs" :key="index" :id="'msg' + item.id">
					<view class="chat-time" v-if="item.time != ''">{{ changeTime(item.time) }}</view>
					<view class="msg-m msg-left" v-if="item.fromId != uid">
						<navigator :url="'../userhome/userhome?id=' + item.fromId + '&tip=1'" hover-class="none"><image :src="item.imgurl" class="user-img"></image></navigator>
						<view class="massage" v-if="item.types == 0">
							<!-- 文字 -->
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<view class="massage" v-if="item.types == 1">
							<!-- 图片 -->
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="massage" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: 4 * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								<image src="../../static/icon/yuyin.png" class="voice-img"></image>
								{{ item.message.time }}
							</view>
						</view>
						<!-- 位置 -->
						<view class="massage" v-if="item.types == 4">
							<view class="msg-map">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map>
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromId == uid">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="massage" v-if="item.types == 0">
							<!-- 文字 -->
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<view class="massage" v-if="item.types == 1">
							<!-- 图片 -->
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="massage" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: 18 * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								{{ item.message.time }}″
								<image src="../../static/icon/yuyin.png" class="voice-img"></image>
							</view>
						</view>
						<!-- 位置 -->
						<view class="massage" v-if="item.types == 4">
							<view class="msg-map">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="padbt"></view> -->
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
import submit from '../../components/submit/submit.vue';
const innerAudioContext = uni.createInnerAudioContext();
export default {
	data() {
		return {
			uid: '',
			uimgurl: '',
			token: '',
			uname: '',
			fid: '',
			fname: '',
			type: '', //0为一对一，1为群聊
			fimgurl: '',
			msgs: [],
			imgMsg: [],
			scrollToView: '',
			inputh: '72',
			animationData: {},
			currentPage: 0,
			pageSize: 10,
			loading: '',
			isloading: true,
			swanition: true,
			beginloading: true
		};
	},
	onLoad: function(e) {
		this.fid = e.id;
		this.fname = e.name;
		this.type = e.type;
		this.fimgurl = e.img;
		this.getStorages();
		this.getMsg();
		this.receiveSocket();
		this.groupSocket();
	},
	components: {
		submit
	},
	methods: {
		// 返回
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 处理时间
		changeTime: function(date) {
			return myfun.chatTime(date);
		},
		// 获取缓存数据
		getStorages: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.uimgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.uname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		nextPage: function() {
			if (this.currentPage > 0 && this.beginloading) {
				this.isloading = false;
				// 禁止重复加载
				this.beginloading = false;
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'step-start'
				});
				this.animation = animation;
				let i = 1;
				this.loading = setInterval(
					function() {
						animation.rotate(i * 45).step();
						this.animationData = animation.export();
						i++;
						if (i > 20) {
							this.getMsg(this.currentPage);
						}
					}.bind(this),
					100
				);
			}
		},
		// 获取聊天数据
		async getMsg() {
			if (this.type == 0) {
				const params = {
					uid: this.uid,
					fid: this.fid,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					token: this.token
				};
				const res = await this.API.GetChatMsg(params);
				const result = res.data.result;
				let neartime = result[0].time;
				let imgarr = [];
				if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {
						result[i].imgurl = this.serverUrl + result[i].imgurl;
						if (i < result.length - 1) {
							let t = myfun.spaceTime(neartime, result[i + 1].time);
							if (t) {
								neartime = t;
							}
							result[i].time = t;
						}
						if (result[i].types == 1) {
							result[i].message = this.serverUrl + result[i].message;
							imgarr.unshift(result[i].message);
						}
						// if (result[i].types == 2) {
						// 	result[i].message = this.serverUrl + result[i].message;
						// }
						// json字符串还原
						if (result[i].types == 4) {
							result[i].message = JSON.parse(result[i].message);
						}
						this.msgs.unshift(result[i]);
					}
					console.log(this.msgs);
					this.imgMsg = imgarr.concat(this.imgMsg);
				}
				// 判断currentPage
				if (result.length == this.pageSize) {
					this.currentPage++;
				} else {
					this.currentPage = -1;
				}
				// 页数加1
				this.$nextTick(function() {
					this.swanition = false;
					this.scrollToView = 'msg' + this.msgs[result.length - 1].id;
				});
				clearInterval(this.loading);
				// 关闭loading
				this.isloading = true;
				// 开启加载
				this.beginloading = true;
			} else {
				const params = {
					gid: this.fid,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					token: this.token
				};
				const res = await this.API.GetGroupChatMsg(params);
				const result = res.data.result;
				let neartime = result[0].time;
				let imgarr = [];
				if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {
						result[i].imgurl = this.serverUrl + result[i].imgurl;
						if (i < result.length - 1) {
							let t = myfun.spaceTime(neartime, result[i + 1].time);
							if (t) {
								neartime = t;
							}
							result[i].time = t;
						}
						if (result[i].types == 1) {
							result[i].message = this.serverUrl + result[i].message;
							imgarr.unshift(result[i].message);
						}
						// json字符串还原
						if (result[i].types == 4) {
							result[i].message = JSON.parse(result[i].message);
						}
						this.msgs.unshift(result[i]);
					}
					this.imgMsg = imgarr.concat(this.imgMsg);
				}
				// 判断currentPage
				if (result.length == this.pageSize) {
					this.currentPage++;
				} else {
					this.currentPage = -1;
				}
				// 页数加1
				this.$nextTick(function() {
					this.swanition = false;
					this.scrollToView = 'msg' + this.msgs[result.length - 1].id;
				});
				clearInterval(this.loading);
				// 关闭loading
				this.isloading = true;
				// 开启加载
				this.beginloading = true;
			}
		},

		// 预览图片
		previewImg: function(e) {
			let index = 0;
			for (let i = 0; i < this.imgMsg.length; i++) {
				if (this.imgMsg[i] == e) {
					index = i;
				}
			}
			uni.previewImage({
				current: index,
				urls: this.imgMsg,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		//音频播放
		playVoice: function(e) {
			innerAudioContext.src = e;
			innerAudioContext.play();
		},
		// 地图定位
		covers: function(e) {
			let map = [
				{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/icon/dw.png'
				}
			];
			return map;
		},
		// 接收输入内容
		inputs: function(e) {
			this.receiveMsg(e, this.uid, this.uimgurl);
		},
		// 接收输入信息，发送给后端
		receiveMsg: function(e, id, img) {
			//socket提交
			if (e.types == 0 || e.types == 4) {
				//发送给后端
				this.sendSocket(e);
			}
			if (e.types == 1) {
				this.imgMsg.push(e.message);
				let url = myfun.fileName(new Date());
				const uploadTask = uni.uploadFile({
					url: this.serverUrl + '/api/files/upload',
					filePath: e.message,
					name: 'file',
					formData: {
						url: url,
						name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10)
					},
					success: uploadFileRes => {
						console.log(uploadFileRes.data);
						let data = {
							message: uploadFileRes.data,
							types: e.types
						};
						this.sendSocket(data);
					}
				});
				uploadTask.onProgressUpdate(res => {
				});
			}
			if (e.types == 2) {
				let url = myfun.fileName(new Date());
				const uploadTask = uni.uploadFile({
					url: this.serverUrl + '/api/files/upload',
					filePath: e.message.voice,
					name: 'file',
					formData: {
						url: url,
						name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10)
					},
					success: uploadFileRes => {
						console.log(uploadFileRes);
						let data = {
							message: uploadFileRes.data,
							types: e.types
						};
						this.sendSocket(data);
					}
				});
				uploadTask.onProgressUpdate(res => {
				});
			}
			if (e.types == 4) {
				e.message = JSON.parse(e.message);
			}
			this.swanition = true;
			let len = this.msgs.length;
			let newTime = new Date();
			//时间间隔
			let t = myfun.spaceTime(newTime,this.msgs[len-1].time);			
			let data = {
				fromId: id,
				imgurl: img,
				message: e.message,
				types: e.types,
				time: newTime,
				id: len
			};
			this.msgs.push(data);
			this.$nextTick(function() {
				this.scrollToView = 'msg' + len;
			});
		},
		//聊天数据发送后端
		sendSocket: function(msg) {
			if (this.type == 0) {
				//一对一聊天
				this.socket.emit('msg', msg, this.uid, this.fid);
			} else {
				//群消息
				this.socket.emit('groupMsg', msg, this.uid, this.fid, this.uname, this.uimgurl);
			}
		},
		//聊天数据接收
		receiveSocket: function() {
			this.socket.on('msg', (msg, fromid, tip) => {
				if (fromid == this.fid && tip == 0) {
					this.swanition = true;
					let len = this.msgs.length;
					let nowTime = new Date();
					//时间间隔
					let t = myfun.spaceTime(nowTime, this.msgs[len-1].time);
					if (msg.types == 1 || msg.types == 2) {
						msg.message = this.serverUrl + msg.message;
					}
					if (msg.types == 4) {
						msg.message = JSON.parse(msg.message);
					}
					nowTime = t;
					let data = {
						fromId: fromid,
						imgurl: this.fimgurl,
						message: msg.message,
						types: msg.types,
						time: nowTime,
						id: len
					};
					this.msgs.push(data);
					if (msg.types == 1) {
						this.imgMsg.push(msg.message);
					}
					this.$nextTick(function() {
						this.scrollToView = 'msg' + len;
					});
					this.readMsg();
				}
			});
		},
		//接收群即时消息
		groupSocket: function() {
			this.socket.on('groupmsg', (msg, gid, name, img) => {
				if (gid == this.fid) {
					this.swanition = true;
					let len = this.msgs.length;
					let newTime = new Date();
					//时间间隔
					let t = myfun.spaceTime(newTime, this.msgs[len-1].time);
					// if(tip)
					if (msg.types == 1 || msg.types == 2) {
						msg.message = this.serverUrl + msg.message;
					}
					nowTime = t;
					let data = {
						fromId: gid,
						imgurl: img,
						message: msg.message,
						types: msg.types,
						time: nowTime,
						id: len
					};
					this.msgs.push(data);
					if (msg.types == 1) {
						this.imgMsg.push(msg.message);
					}
					this.$nextTick(function() {
						this.scrollToView = 'msg' + len;
					});
					this.readMsg();
				}
			});
		},
		//标记已读
		async readMsg() {
			if (this.type == 0) {
				const params = {
					uid: this.uid,
					fid: this.fid,
					token: this.token
				};
				await this.API.ClearUnread(params);
			} else {
				const params = {
					uid: this.uid,
					gid: this.fid,
					token: this.token
				};
				await this.API.ClearGroupUnread(params);
			}
		},
		//输入框高度
		heights: function(e) {
			this.inputh = e + 6;
			this.goBottom();
		},
		goGroupDetail: function() {
			uni.navigateTo({
				url: '../groupdetail/groupdetail?gid=' + this.fid + '&gimg=' + this.fimgurl
			});
		},
		//滚动到底部
		goBottom: function() {
			this.swanition = true;
			(this.scrollToView = ''),
				this.$nextTick(function() {
					let len = this.msgs.length - 1;
					this.scrollToView = 'msg' + this.msgs[len].id;
				});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

page {
	height: 100%;
}

.content {
	height: 100%;
	background: rgba(244, 244, 244, 1);
}

.top-bar {
	background: rgba(244, 244, 244, 0.96);
	border-bottom: 1px solid $uni-border-color;
}

.displaynone {
	display: none;
}
.chat {
	height: 100%;

	// .padbt {
	// 	padding-top: var(--status-bar-height);
	// 	width: 100%;
	// }
	.loading {
		text-align: center;
		.loading-img {
			width: 60rpx;
			height: 60rpx;
		}
	}
	.chat-main {
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;
		padding-top: 100rpx;
		display: flex;
		flex-direction: column;
	}

	.chat-ls {
		.chat-time {
			font-size: $uni-font-size-sm;
			color: rgba(39, 40, 50, 0.3);
			line-height: 34rpx;
			padding: 20rpx 0;
			text-align: center;
		}

		.msg-m {
			display: flex;
			padding: 20rpx 0;

			.user-img {
				flex: none;
				width: $uni-img-size-sm;
				height: $uni-img-size-sm;
				border-radius: $uni-border-radius-base;
			}

			.message {
				flex: none;
				max-width: 480rpx;
			}

			.msg-text {
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}

			.msg-img {
				max-width: 400rpx;
				border-radius: $uni-border-radius-base;
			}
			.msg-map {
				background: #fff;
				width: 464rpx;
				height: 284rpx;
				overflow: hidden;
				.map-name {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.map-address {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					padding: 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.map {
					padding-top: 8rpx;
					width: 464rpx;
					height: 190rpx;
				}
			}
			.voice {
				min-width: 80rpx;
				max-width: 400rpx;
			}
			.voice-img {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.msg-left {
			flex-direction: row;

			.msg-text {
				margin-left: 16rpx;
				background-color: #fff;
				border-radius: 0px 20rpx 20rpx 20rpx;
			}

			.msg-img {
				margin-left: 16rpx;
			}
			.msg-map {
				margin-left: 16rpx;
				border-radius: 0px 20rpx 20rpx 20rpx;
			}
			.voice {
				text-align: right;
			}
			.voice-img {
				float: left;
				width: 44rpx;
				height: 44rpx;
			}
		}

		.msg-right {
			flex-direction: row-reverse;

			.msg-text {
				margin-right: 16rpx;
				background-color: #81d4fa;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
			}

			.msg-img {
				margin-right: 16rpx;
			}
			.msg-map {
				margin-right: 16rpx;
				border-radius: 20rpx 0px 20rpx 20rpx;
			}
			.voice {
				text-align: left;
			}
			.voice-img {
				float: right;
				transform: rotate(180deg);
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
}
</style>
