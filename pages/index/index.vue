<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center"><image src="../../static/img/logo.png" class="logo"></image></view>
			<navigator :url="'../userhome/userhome?id=' + uid + '&tip=2'" class="top-bar-left" hover-class="none"><image :src="imgurl" class="my-img"></image></navigator>
			<view class="top-bar-right">
				<navigator url="../search/search" class="search"><image src="../../static/icon/search.png"></image></navigator>
				<navigator url="../buildgroup/buildgroup" class="add"><image src="../../static/icon/add.png"></image></navigator>
			</view>
		</view>
		<view class="main">
			<view class="refresh" v-if="!refresh && requestData <= 0">
				<image src="../../static/icon/refresh.png"></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="friends" v-if="requestData > 0" @tap="toRequest">
				<view class="friend-list">
					<view class="friend-list-left">
						<text class="tip">{{ requestData }}</text>
						<image src="../../static/icon/friendapply.png"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{ changeTime(requestTime) }}</view>
						</view>
						<view class="news">box-sizing:border-boxbox-sizing:border-box</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friend-list" v-for="(item, index) in indexlist" :key="index" @tap="goChatRoom(item)">
					<view class="friend-list-left">
						<text class="tip" v-if="item.tip > 0">{{ item.tip }}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ changeTime(item.lastTime) }}</view>
						</view>
						<view class="news">{{ item.msg }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		return {
			title: 'Hello talky',
			uid: '',
			imgurl: '',
			token: '',
			myname: '',
			requestData: 0,
			requestTime: '',
			indexlist: [],
			friends: [],
			groups: [],
			refresh: false
		};
	},
	onLoad: function() {
		this.getStorages();
		this.join(this.uid);
		this.concatList();
		this.receiveSocket();
		this.groupSocket();
	},
	onShow: function() {
		this.getStorages();
		this.concatList();
	},
	onPullDownRefresh() {
		this.getStorages();
		this.concatList();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		changeTime: function(date) {
			return myfun.dateTime(date);
		},
		//获取缓存数据
		getStorages: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.imgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.myname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		//好友请求
		async friendRequest() {
			const params = {
				uid: this.uid,
				token: this.token,
				state: 1
			};
			const res = await this.API.GetFriend(params);
			const result = res.data.result;
			this.requestData = result.length;
			if (result.length > 0) {
				this.requestTime = result[0].lastTime;
				for (let i = 0; i < result.length; i++) {
					if (this.requestTime < result[i].lastTime) {
						this.requestTime = result[i].lastTime;
					}
				}
			}
		},
		//获取好友列表
		async getFriends() {
			const params = {
				uid: this.uid,
				state: 0,
				token: this.token,
			};
			const res = await this.API.GetFriend(params);
			const result = res.data.result;
			if (result.length > 0) {
				this.refresh = true;
				this.friends = [];
				for (let i = 0; i < result.length; i++) {
					result[i].imgurl = this.serverUrl + result[i].imgurl;
					result[i].chattype = 0;
					if (result[i].markname) {
						result[i].name = result[i].markname;
					}
					this.friends.push(result[i]);
				}
			}
		},

		//获取群列表
		async getGroups() {
			const params = {
				uid: this.uid,
				token: this.token
			};
			const res = await this.API.GetGroup(params);
			const result = res.data.result;
			if (result.length > 0) {
				this.refresh = true;
				this.groups = [];
				for (let i = 0; i < result.length; i++) {
					result[i].imgurl = this.serverUrl + result[i].imgurl;
					result[i].chattype = 1;
					this.groups.push(result[i]);
					this.socket.emit('group', result[i].id);
				}
			}
		},
		//获取最后一条消息
		async getLastMsg(arr, i) {
			if (arr[i].chattype == 0) {
				const params = {
					uid: this.uid,
					fid: arr[i].id,
					token: this.token
				};
				const res = await this.API.GetLastMag(params);
				const result = res.data.result;
				if (result.types == 1) {
					result.message = '[图片]';
				} else if (result.types == 2) {
					result.message = '[语音]';
				} else if (result.types == 3) {
					result.message = '[视频]';
				} else if (result.types == 4) {
					result.message = '[位置]';
				} else {
				}
				let e = arr[i];
				e.msg = result.message;
				arr.splice(i, 1, e);
			} else {
				//群聊最后一条消息
				const params = {
					gid: arr[i].id,
					token: this.token
				};
				const res = await this.API.GetLastGroupMag(params);
				const result = res.data.result;
				if (result.name == this.myname) {
					if (result.types == 1) {
						result.message = '[图片]';
					} else if (result.types == 2) {
						result.message = '[语音]';
					} else if (result.types == 3) {
						result.message = '[视频]';
					} else if (result.types == 4) {
						result.message = '[位置]';
					}
				} else {
					if (result.types == 1) {
						result.message = result.name + ':[图片]';
					} else if (result.types == 2) {
						result.message = result.name + ':[语音]';
					} else if (result.types == 3) {
						result.message = result.name + ':[视频]';
					} else if (result.types == 4) {
						result.message = result.name + ':[位置]';
					}
				}
				let e = arr[i];
				e.msg = result.message;
				arr.splice(i, 1, e);
			}
		},
		//获取未读消息数
		async getUnread(arr, i) {
			const params = {
				uid: this.uid,
				fid: arr[i].id,
				token: this.token
			};
			const res = await this.API.GetUnread(params);
			const result = res.data.result;
			let e = arr[i];
			e.tip = result;
			arr.splice(i, 1, e);
		},
		//合并好友和群列表
		async concatList() {
			await this.friendRequest();
			await this.getFriends();
			await this.getGroups();
			for (let i = 0; i < this.friends.length; i++) {
				await this.getLastMsg(this.friends, i);
				await this.getUnread(this.friends, i);
			}
			for (let i = 0; i < this.groups.length; i++) {
				await this.getLastMsg(this.groups, i);
			}
			this.indexlist = this.friends.concat(this.groups).sort((a, b) => {
				return a.lastTime < b.lastTime ? 1 : -1;
			});
		},
		//socket
		//用户登录socket注册
		join: function(uid) {
			this.socket.emit('login', uid);
		},
		//聊天数据接收
		receiveSocket: function() {
			this.socket.on('msg', (msg, fromid, tip) => {
				let nmsg = '';
				if (msg.types == 0) {
					nmsg = msg.message;
				} else if (msg.types == 1) {
					nmsg = '[图片]';
				} else if (msg.types == 2) {
					nmsg = '[语音]';
				} else if (msg.types == 3) {
					nmsg = '[视频]';
				} else if (msg.types == 4) {
					nmsg = '[位置]';
				}
				for (let i = 0; i < this.indexlist.length; i++) {
					if (this.indexlist[i].id == fromid) {
						let e = this.indexlist[i];
						e.lastTime = new Date();
						e.msg = nmsg;
						e.tip++;
						this.indexlist.splice(i, 1);
						this.indexlist.unshift(e);
					}
				}
			});
		},
		//接收群即时消息
		groupSocket: function() {
			this.socket.on('groupmsg', (msg, gid, name) => {
				let nmsg = '';
				if (msg.types == 0) {
					nmsg = msg.message;
				} else if (msg.types == 1) {
					nmsg = '[图片]';
				} else if (msg.types == 2) {
					nmsg = '[语音]';
				} else if (msg.types == 3) {
					nmsg = '[视频]';
				} else if (msg.types == 4) {
					nmsg = '[位置]';
				}
				for (let i = 0; i < this.indexlist.length; i++) {
					if (this.indexlist[i].id == gid) {
						let e = this.indexlist[i];
						e.lastTime = new Date();
						e.msg = name + ':' + nmsg;
						e.tip++;
						this.indexlist.splice(i, 1);
						this.indexlist.unshift(e);
					}
				}
			});
		},
		async goChatRoom(data) {
			if (data.chattype == 0) {
				const params = {
					uid: this.uid,
					fid: data.id,
					token: this.token
				};
				await this.API.ClearUnread(params);
			} else {
				const params = {
					uid: this.uid,
					gid: data.id,
					token: this.token
				};
				await this.API.ClearGroupUnread(params);
			}
			uni.navigateTo({
				url: '../chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&img=' + data.imgurl + '&type=' + data.chattype
			});
		},
		toRequest: function() {
			uni.navigateTo({
				url: '../friendrequest/friendrequest'
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;

	.top-bar-right {
		image {
			padding: 18rpx 0 0 18rpx;
			width: 52rpx;
			height: 52rpx;
		}
	}
}

.main {
	padding-top: 104rpx;
	padding-bottom: $uni-spacing-col-base;
}
.refresh {
	text-align: center;
	image {
		width: 32rpx;
		height: 32rpx;
	}
	.ref-title {
		font-size: $uni-font-size-base;
		color: rgba(39, 40, 50, 0.4);
		line-height: 40rpx;
	}
}
.friend-list {
	height: 96rpx;
	padding: 16rpx $uni-spacing-col-base;

	.friend-list-left {
		position: relative;
		float: left;

		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: $uni-border-radius-base;
			background-color: $uni-color-primary;
		}

		.tip {
			position: absolute;
			z-index: 10;
			top: -8rpx;
			left: 68rpx;
			min-width: 20rpx;
			height: 36rpx;
			background: $uni-color-warning;
			border-radius: 18rpx;
			padding: 0 8rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-inverse;
			line-height: 36rpx;
			text-align: center;
		}
	}

	.friend-list-right {
		padding-left: 128rpx;

		.top {
			height: 50rpx;

			.name {
				float: left;
				font-size: 36rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 50rpx;
			}

			.time {
				float: right;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 50rpx;
			}
		}
	}

	.news {
		font-size: $uni-font-size-base;
		color: $uni-text-color-grey;
		line-height: 40rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
}
</style>
